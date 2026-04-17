# CI/CD Pipeline Complete Dry-Run Guide

This guide contains the step-by-step commands to fully test your automated CI/CD pipeline from start to finish on your local machine. You can use this guide any time you want to verify that **GitHub -> Jenkins -> Docker -> Ansible -> Kubernetes** is working correctly.

---

### Step 1: Start Your Base Infrastructure
Before triggering anything, make sure your core applications are running on your Windows machine:
1. Open **Docker Desktop** and wait for it to be running.
2. Open **Jenkins** (ensure your local Jenkins server is running).
3. Open a terminal and start your Kubernetes cluster:
   ```bash
   minikube start --driver=docker
   ```

### Step 2: Start the Webhook Forwarder (Smee)
For GitHub to tell your local Jenkins that new code has been pushed, you need to run the Smee client. 
Open a **new terminal window**, paste this command, and **leave it running**:
```bash
npx smee-client --url https://smee.io/BlbD2YehGqwNAOn2 --target "http://localhost:8080/buildByToken/build?job=CloudQuill-CI-Pipeline&token=cloudquill123"
```

### Step 3: Setup the Ansible Runner Container
Jenkins uses a Docker container named `ansible-server` to run the deployment scripts. We must start it and safely give it your Windows Kubernetes credentials.
Open a **new terminal window** and run these commands one by one:

```bash
# 1. Build the Ansible image (only needs to be done once if you change the Dockerfile)
docker build -t cloudquill-ansible ./ansible

# 2. Remove the old container if it exists
docker rm -f ansible-server

# 3. Start the container and mount your K8s directories safely (PowerShell format)
docker run -d --name ansible-server -v /var/run/docker.sock:/var/run/docker.sock -v "${HOME}/.kube:/tmp/.kube" -v "${HOME}/.minikube:/root/.minikube" -v "${PWD}:/app" cloudquill-ansible

# 4. Inject the K8s credentials so Ansible can talk to Minikube (Bypassing Windows formatting issues using Python)
docker exec ansible-server sh -c "mkdir -p /root/.kube && cp -r /tmp/.kube/* /root/.kube/"
docker exec ansible-server python -c "import re; f=open('/root/.kube/config'); c=f.read(); f.close(); c=c.replace(chr(67)+':'+chr(92)+'Users'+chr(92)+'krish'+chr(92)+'.minikube', '/root/.minikube'); c=c.replace(chr(92), '/'); c=re.sub(r'https://127\.0\.0\.1:\d+', 'https://192.168.49.2:8443', c); f=open('/root/.kube/config', 'w'); f.write(c); f.close();"

# 5. Verify the connection (Should print "minikube Ready")
docker exec ansible-server kubectl get nodes
```

---

### Step 4: Trigger the Automated Pipeline!
Now the environment is 100% ready. Let's trigger a real deployment.

1. Open any code file, for example, `src/components/Home.js`.
2. Make a small visible change (like changing a heading from "Welcome" to "Welcome to Kubernetes!").
3. Save the file.
4. Run the standard Git commands to push your code to the `main` branch:
   ```bash
   git add .
   git commit -m "Dry Run K8s Deployment"
   git push origin main
   ```

### Step 5: Watch and Verify
1. **Watch Jenkins:** Immediately open your Jenkins dashboard (`http://localhost:8080`). You should see the `CloudQuill-CI-Pipeline` job start automatically! You can click on the blinking blue/green dot to see the Console Output.
2. **Watch Kubernetes:** Once Jenkins finishes successfully, run this in your terminal to see your new containers running:
   ```bash
   kubectl get pods
   ```
3. **See the Result:** Open the final application in your browser to see your code changes live:
   ```bash
   minikube service frontend
   ```

Whenever you want to test the full loop again, you only need to repeat **Step 4** (Push Code) as long as everything from Steps 1-3 is still running in the background!
