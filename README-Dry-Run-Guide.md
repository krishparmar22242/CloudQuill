# CloudQuill CI/CD: The Ultimate Viva Presentation Guide

This guide is your **Fail-Proof Script** for demonstrating your DevOps pipeline. It covers every command needed to spin up your environment from a cold boot, trigger the CI/CD pipeline, and handle Kubernetes deployment behaviors (like zero-downtime pod termination and Windows API tunneling).

---

## PHASE 1: Booting the Infrastructure (Pre-flight Checks)
*(Run these before you share your screen for the presentation)*

### 1. Start Your Base Infrastructure
If you recently turned on your computer, Docker resets its security and background services sleep automatically. **You must run these 3 checks perfectly:**

1. **Wait for Docker:** Open **Docker Desktop** and wait for the green bar to say "Running".
2. **Restore Jenkins API Access:** Your Jenkins container loses its Docker socket privileges on restart. Open PowerShell and unlock it:
   ```bash
   docker exec -u root jenkins chmod 666 /var/run/docker.sock
   ```
3. **Awaken Minikube:** Your Kubernetes cluster will be sleeping. Wake it up and get a fresh host IP:
   ```bash
   minikube stop
   minikube start
   ```

### 2. Start the Webhook Forwarder (Smee)
For GitHub to tell your local Jenkins that new code has been pushed, you need to run the Smee client. 
Open a **new terminal window**, paste this, and **leave it running**:
```bash
npx smee-client --url https://smee.io/BlbD2YehGqwNAOn2 --target "http://localhost:8080/buildByToken/build?job=CloudQuill-CI-Pipeline&token=cloudquill123"
```

### 3. Setup the Ansible Deployment Worker
Jenkins uses a Docker container named `ansible-server` to run deployments. We must start it and hand it your Kubernetes credentials.
Open a **new terminal window** and run these commands one at a time:

```bash
# 1. Remove the old container if it exists
docker rm -f ansible-server

# 2. Start the container and mount your K8s directories safely (PowerShell format)
docker run -d --name ansible-server -v /var/run/docker.sock:/var/run/docker.sock -v "${HOME}/.kube:/tmp/.kube" -v "${HOME}/.minikube:/root/.minikube" -v "${PWD}:/app" cloudquill-ansible

# 3. Inject the K8s credentials so Ansible can talk to Minikube (Bypasses Windows formatting issues using Python)
docker exec ansible-server sh -c "mkdir -p /root/.kube && cp -r /tmp/.kube/* /root/.kube/"
docker exec ansible-server python -c "import re; f=open('/root/.kube/config'); c=f.read(); f.close(); c=c.replace(chr(67)+':'+chr(92)+'Users'+chr(92)+'krish'+chr(92)+'.minikube', '/root/.minikube'); c=c.replace(chr(92), '/'); c=re.sub(r'https://127\.0\.0\.1:\d+', 'https://192.168.49.2:8443', c); f=open('/root/.kube/config', 'w'); f.write(c); f.close();"

# 4. Verify the connection (Should print "minikube Ready")
docker exec ansible-server kubectl get nodes
```

---

## PHASE 2: The Viva Live Demonstration

### 1. Show the Initial State
Show the examiner that the Kubernetes cluster is actively running your current pods:
```bash
kubectl get pods
```

### 2. Make a Code Change & Trigger the Pipeline!
Now the environment is 100% ready. Let's trigger a real deployment.
1. Open `src/components/Home.js` and make a visible change (e.g., change "Welcome" to "Viva Demo V2").
2. Save the file and push the changes:
   ```bash
   git add .
   git commit -m "Viva Live Demo Deployment"
   git push origin main
   ```

### 3. Watch Jenkins and Kubernetes Work
1. **Watch Jenkins:** Immediately open your Jenkins dashboard (`http://localhost:8080`). You should see the pipeline start!
2. **Watch Kubernetes:** Once Jenkins reaches the "Deploy with Ansible" stage, go back to your terminal and spam this command:
   ```bash
   kubectl get pods
   ```
   > **What to explain to the examiner:** "Notice how Kubernetes spins up a `ContainerCreating` pod first, and changes the old backend pod to `Terminating`. This is Kubernetes ensuring **Zero-Downtime Deployment**!"

---

## PHASE 3: Displaying the App & The Network Tunnel

### 1. Open the CloudQuill Frontend
To view the automatic React app result, ask Minikube to open it in your browser:
```bash
minikube service frontend
```

### 2. Connect the Backend API Tunnel (Crucial for Windows)
Windows strictly blocks direct API pings into the Minikube internal IP network. To allow the frontend to talk to the backend database, you must open a **dedicated terminal tab** and run:
```bash
kubectl port-forward svc/backend 30005:5000
```
*(Leave this running! Your frontend UI is now 100% functional for Login, Signup, and Notes).*

---

## ⚠️ IMPORTANT: The "Port-Forward Drop" (When Redeploying)

If you push **another** code update to GitHub while the `kubectl port-forward` command is running, Jenkins will deploy a brand new Backend Pod.

**What happens?**
1. Kubernetes strictly kills the old Backend Pod.
2. Because your `port-forward` was attached to that old Pod, your terminal command will crash with the error: `error: lost connection to pod (container not running)`.
3. The CloudQuill web app will temporarily fail to fetch notes.

**How to recover (This is completely normal!):**
You just need to wait for Jenkins to finish creating the *new* Pod. Verify it is running by checking `kubectl get pods`, and then **simply re-run the tunnel command:**
```bash
kubectl port-forward svc/backend 30005:5000
```
Your app will reconnect to the database instantly!

---

## PHASE 4: Simulating Kubernetes Self-Healing (Chaos Testing)

A fantastic way to impress your examiner is to prove that Kubernetes is highly resilient and self-healing. You can manually "assassinate" a running pod during your demo to show how Kubernetes instantly detects the failure and spins up a replacement pod automatically.

### 1. Kill the Backend Pod Manually
Run this command to forcefully delete the active backend pod (using its label so you don't have to copy its exact name):
```bash
kubectl delete pod -l app=backend
```

### 2. Watch Kubernetes Save the Day
Immediately run this command a few times:
```bash
kubectl get pods
```
> **What to explain to the examiner:** "I just manually destroyed the backend server to simulate a devastating server crash. However, our Kubernetes Deployment controller instantly noticed the desired state (1 pod) didn't match the actual state (0 pods), so it immediately spawned a brand new replacement pod in milliseconds to keep the application online. Human intervention wasn't needed to fix the crash!"

### 3. Re-establish the Windows Tunnel
Just like pushing new code, deleting the pod kills the old container, which breaks your active port-forward tunnel. Once your `kubectl get pods` shows the new backend pod is `Running`, quickly restart your tunnel so your Windows browser can resume talking to it:
```bash
kubectl port-forward svc/backend 30005:5000
```
