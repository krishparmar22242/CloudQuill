# CloudQuill - Kubernetes CI/CD Demonstration Guide

This guide contains the exact steps to present your DevOps project to your professor. It demonstrates 4 core technologies: **Docker, Jenkins, Ansible, and Kubernetes (Minikube)**.

## 🛠️ Step 0: Pre-presentation Setup (Do this before the professor looks)

Before you start your presentation, make sure your environment is running so you don't waste time booting things up.

1. **Start Minikube (Your Kubernetes Cluster):**
   ```bash
   minikube start
   ```

2. **Start Jenkins & Smee:**
   Make sure your Jenkins server is running and your Smee webhook forwarder is active in a terminal so GitHub can talk to Jenkins.
   *(Note: give Jenkins permission to talk to Docker by running `docker exec -u root jenkins chmod 666 /var/run/docker.sock`)*
   ```bash
   smee --url https://smee.io/YOUR_URL --path /github-webhook/ --port 8080
   ```

3. **Start the Ansible Server Container (CRITICAL):**
   You must start the Ansible container safely so it can manage your cluster without interfering with your Windows settings:
   ```bash
   # First build the updated Ansible Dockerfile
   docker build -t cloudquill-ansible ./ansible
   
   # Run the container with K8s volume mounts (safe copy method for PowerShell)
   docker rm -f ansible-server
   docker run -d --name ansible-server -v /var/run/docker.sock:/var/run/docker.sock -v "${HOME}/.kube:/tmp/.kube" -v "${HOME}/.minikube:/root/.minikube" -v "${PWD}:/app" cloudquill-ansible
   
   # Inject the Windows credentials into the Linux container safely (using Python to bypass PowerShell escaping bugs)
   docker exec ansible-server sh -c "mkdir -p /root/.kube && cp -r /tmp/.kube/* /root/.kube/"
   docker exec ansible-server python -c "import re; f=open('/root/.kube/config'); c=f.read(); f.close(); c=c.replace(chr(67)+':'+chr(92)+'Users'+chr(92)+'krish'+chr(92)+'.minikube', '/root/.minikube'); c=c.replace(chr(92), '/'); c=re.sub(r'https://127\.0\.0\.1:\d+', 'https://192.168.49.2:8443', c); f=open('/root/.kube/config', 'w'); f.write(c); f.close();"
   ```

---

## 🎤 The Live Demonstration (What to show the Professor)

### Step 1: Explain the Architecture (The 4 Technologies)
Tell the professor:
> *"For this project, I have implemented a full CI/CD pipeline using 4 core technologies: **Docker** for containerization, **Jenkins** for Continuous Integration, **Ansible** for Continuous Deployment, and **Kubernetes** to orchestrate and host the final application."*

### Step 2: Show the Kubernetes Infrastructure
Show them your local Kubernetes cluster running.
```bash
kubectl get nodes
```
> *"As you can see, I have a Minikube Kubernetes node active and ready to host our application."*

### Step 3: Trigger the CI/CD Pipeline
1. Open the React frontend code (e.g., `src/components/Home.js` or `Landing.js`).
2. Make a visible change, like changing the title to `"CloudQuill - K8s Version!"`.
3. Commit and push the code:
   ```bash
   git add .
   git commit -m "Update title to K8s Version"
   git push origin main
   ```

### Step 4: Show Jenkins & Ansible in Action
1. Open your Jenkins Dashboard in the browser.
2. Show the pipeline triggering automatically via the GitHub + Smee webhook.
3. Click on the Console Output.
4. Explain:
   > *"Jenkins pulls the new code, runs our Node.js tests, and then hands the job over to the Ansible container. Ansible is currently building our Docker images and running `kubectl apply` to push the new configurations to our Kubernetes cluster."*

### Step 5: Prove Kubernetes is Running the App
Once Jenkins shows `SUCCESS`, run these commands in your terminal:

1. Show the running pods:
   ```bash
   kubectl get pods
   ```
   > *"Here we can see our Frontend, Backend, and MongoDB pods running successfully in K8s."*

2. Open the application:
   ```bash
   minikube service frontend
   ```
   > *"By using Minikube's service command, K8s exposes the frontend through a NodePort, and we can see my new code changes are completely live!"*

### 🌟 Bonus: Show K8s Self-Healing (The "Wow" Factor)
To guarantee top marks, show the professor why K8s is better than Docker Compose.
1. Run this to delete the backend pod (simulating a crash):
   ```bash
   kubectl delete pod -l app=backend
   ```
2. Immediately run:
   ```bash
   kubectl get pods
   ```
   > *"I just simulated a server crash by deleting the backend container. As you can see, Kubernetes instantly detected the crash and immediately spun up a brand new container to replace it. This is why K8s is the industry standard for high availability."*
