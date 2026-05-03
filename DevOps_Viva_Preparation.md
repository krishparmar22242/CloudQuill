# CloudQuill Project & DevOps Viva Preparation Guide

This document contains a comprehensive set of Questions and Answers to prepare you for your Viva. It is divided into two parts: **Understanding the CloudQuill Application** and **The DevOps/CI/CD Implementation**.

---

## Part 1: Project Understanding (CloudQuill Application)

**Q1: What is CloudQuill and what problem does it solve?**
**Answer:** CloudQuill is a full-stack, cloud-based note-taking application built on the MERN stack (MongoDB, Express.js, React.js, Node.js). It solves the problem of local data dependency by allowing users to securely create, read, update, delete, and search their personal notes from anywhere using an internet connection.


## Part 2: Technical DevOps & CI/CD Implementation

**Q5: What is the main objective of the DevOps implementation in this project?**
**Answer:** The objective was to automate the entire software delivery lifecycle using Continuous Integration and Continuous Deployment (CI/CD). Now, whenever a developer pushes verified code to GitHub, the infrastructure automatically fetches, tests, and deploys the new code without manual server intervention.

**Q6: Explain the complete architectural flow of your deployment pipeline.**
**Answer:** 
1. **Push:** Developer pushes code to the `main` branch.
2. **Webhook & Bridge:** GitHub fires a webhook to a public Smee.io url. The local `smee-client` intercepts this and routes it into the local Jenkins server.
3. **CI Pipeline:** Jenkins gets the trigger, pulls the source code from Git, installs dependencies, and runs backend node tests using the `Jenkinsfile` definitions.
4. **CD Trigger:** If tests pass, Jenkins executes an Ansible playbook.
5. **Deployment:** Ansible manages the state by running `docker compose down` followed by `docker compose up -d --build`, safely spinning up the new infrastructure.

**Q7: Why did you use Docker and what is Docker Compose?**
**Answer:** Docker containerizes the application—packaging the code, runtime, system tools, and libraries together—ensuring "it works on my machine" translates to "it works everywhere." Docker Compose is an orchestration tool I used to define and run the multi-container application (Frontend, Backend, and MongoDB) using a single `docker-compose.yml` file.


**Q10: How did you fix Jenkins blocking the GitHub webhook (The 403 Forbidden Error)?**
**Answer:** Jenkins has strict CSRF (Cross-Site Request Forgery) protection that drops unauthenticated webhook payloads. To bypass this securely for local webhook proxies like Smee, I installed the **Build Authorization Token Root Plugin**. This allowed me to trigger jobs via a specific tokenized URL endpoint (`/buildByToken/build?job=...&token=...`) directly verifying the payload authorization without requiring standard user credentials.

**Q11: Why use Ansible for deployment? Couldn't Jenkins just run a shell script?**
**Answer:** While Jenkins can run bash scripts, doing so violates the Separation of Concerns in DevOps. Jenkins is an **Orchestrator** (for flow flow management, testing, and continuous integration). Ansible is a **Configuration Management & Deployment tool**. By delegating the heavy deployment instructions to Ansible, the architecture becomes highly scalable, idempotent, and maintains standard infrastructure-as-code principles.

---

## Part 3: Advanced DevOps & Technical Deep Dive

**Q12: How do your Docker containers communicate with each other?**
**Answer:** They communicate through a custom Docker Network created by Docker Compose. By default, `docker-compose up` creates a bridge network bridging all services defined in the `docker-compose.yml`. This allows the Node.js backend to connect to MongoDB simply by using the service name (e.g., `mongodb://mongo:27017`) instead of an IP address, thanks to Docker's internal DNS resolution.


**Q14: You used Webhooks to trigger builds. What is the difference between Webhooks and Polling, and why are Webhooks better?**
**Answer:** **Polling** is pull-based: Jenkins constantly asks GitHub (e.g., every minute), "Are there new changes?" This wastes network bandwidth and CPU cycles. **Webhooks** are push-based: GitHub actively notifies Jenkins the exact second a push occurs. Webhooks are vastly superior because they trigger builds instantly, reduce API rate limits, and consume zero idle compute resources.

**Q15: What type of Jenkins pipeline did you write, and why?**
**Answer:** I wrote a **Declarative Pipeline** (using the `pipeline {}` block). The alternative is a *Scripted Pipeline* (using `node {}` blocks directly with Groovy code). Declarative is industry standard now because it has a predefined, stricter structure (stages, steps, post-actions) that is easier to read, has built-in error handling, and natively supports conditional execution using the `when` directive.

**Q16: Ansible is famous for being "Idempotent." What does that mean, and how does your `deploy.yml` demonstrate it?**
**Answer:** Idempotency means executing the same task 100 times will result in the exact same end state without causing errors or duplicate operations. In my `deploy.yml`, using `docker compose up -d --build` is an idempotent operation. If the exact same images are already running and no code has changed, Docker Compose simply recognizes the state is matched and does nothing. It only replaces containers if the underlying code/image layers have changed.

---

## Part 4: Architectural Choices & Implementation Details (The "What" and "Why")

**Q18: Why did you choose Jenkins for CI/CD over cloud-native tools like GitHub Actions or GitLab CI?**
**Answer:** Jenkins was chosen deliberately to demonstrate a deeper understanding of self-hosted infrastructure. While cloud-native tools are easier to set up, hosting Jenkins locally as a Docker container forced me to manage server configurations, handle local-to-cloud networking, overcome socket permission boundaries, and set up security protocols manually. This showcases stronger, foundational DevOps engineering skills.

**Q19: What did you use for webhook forwarding, and why Smee.io over alternatives like Ngrok or Localtunnel?**
**Answer:** I used **Smee.io** running via the `smee-client`. I initially considered Localtunnel, but local tunneling services often inject anti-phishing "Warning" screens (interstitials) before allowing traffic through. This completely blocks programmatic API payloads. Smee.io is specifically designed purely for webhook forwarding, providing a dedicated, uninterrupted channel.

**Q20: What do your Jenkins pipeline stages actually *do* to the code before deploying, and why?**
**Answer:** The Jenkins pipeline acts as a **Quality Gate**. Instead of blinding deploying, it pulls the code, runs `npm install` to gather the node modules, and executes `npm test` against the backend. **Why?** This enforces Continuous Integration. If a developer pushes broken syntax or a failed test, Jenkins fails the build *before* it reaches Ansible, preventing the production containers from crashing.

**Q21: How are sensitive credentials like the MongoDB URI or JWT Secrets handled in this implementation?**
**Answer:** They are securely managed using **Environment Variables** (`.env` files). In a proper DevOps implementation, hardcoding secrets into the Git repository is a major security vulnerability. During the Ansible deployment phase, the Docker containers map to these local environment variables, securely injecting the database keys at runtime without exposing them to the internet or version control.

---

## Part 5: Infrastructure as Code (IaC) File Breakdown

**Q22: Could you explain exactly what is written inside your Ansible playbook (`deploy.yml`) and what it does in the background?**
**Answer:** The `deploy.yml` playbook defines the exact steps Ansible takes to deploy the app. It contains three main tasks running sequentially on `localhost` (pointing to the project root directory `/app`):
1. **Clean Slate (`docker compose down`):** It gracefully stops and removes the currently running CloudQuill containers.
2. **Build & Run (`docker compose up -d --build`):** It forces Docker to rebuild the container images to incorporate the freshly pulled code, and then starts the new containers in detached (`-d`) background mode.
3. **Verification (`docker ps`):** It lists the currently running containers and captures the output so that Jenkins can log proof that the deployment was successful.

**Q23: What exactly is defined inside your `docker-compose.yml` file?**
**Answer:** The `docker-compose.yml` is the blueprint for the entire application infrastructure. It defines three distinct **services** and how they network together:
1. **Frontend Service:** Builds the React app using the frontend `Dockerfile`, maps the external host port `3000` to the internal container port `3000`, and connects to the backend.
2. **Backend Service:** Builds the Node.js/Express app using the backend `Dockerfile`, maps port `5000`, and passes in the environment variables (like the MongoDB URI).
3. **Database Service:** Pulls the official MongoDB image, exposes port `27017`, and attaches a **Docker Volume**. This volume ensures that all users' notes are permanently saved on the host hard drive, even if the database container is completely destroyed and recreated by Ansible.

---

## Part 6: Kubernetes (K8s) Integration & Orchestration

**Q24: You migrated this project from Docker Compose to Kubernetes. Why is Kubernetes considered a massive upgrade over Docker Compose for production DevOps?**

**Answer:** Docker Compose is excellent for local development on a single machine, but Kubernetes (K8s) is an industrial-grade **container orchestration engine** built for distributed, multi-node environments. Kubernetes provides Enterprise features that Compose lacks natively: **Self-Healing** (automatically restarting crashed containers), **Horizonal Auto-scaling** (spinning up more replicas under heavy traffic), and **Zero-Downtime Rolling Updates**.

**Q25: Can you explain the Kubernetes objects (YAML files) you wrote for this project?**
**Answer:** I authored two main K8s objects for the tiers: **Deployments** and **Services**. 
- The `Deployments` define the desired state, telling K8s how many replicas of the Frontend, Backend, and MongoDB Pods should be running. 
- The `Services` handle networking. I used internal K8s networking (ClusterIP) for the backend and database to talk to each other securely, and a `NodePort` Service for the React Frontend so it can be exposed to the outside web browser.

**Q26: In your Kubernetes setup, what happens if the MongoDB pod crashes or restarts? Do users lose all their notes?**
**Answer:** No. Just like Docker Volumes, K8s needs persistent storage. I defined a **PersistentVolumeClaim (PVC)** (`mongo-pvc.yaml`) which requests permanent storage space from the cluster infrastructure. This ensures that the physical database files are decoupled from the lifecycle of the MongoDB Pod. If the pod crashes, K8s spins up a new one and seamlessly reattaches the same exact hard drive volume.

**Q27: Exactly how does Ansible deploy to your Kubernetes cluster in the CI/CD pipeline?**
**Answer:** Inside my Ansible `deploy.yml` playbook, the deployment steps are fully automated. Ansible first builds the new Docker images. To bypass the internet, it directly sideloads those images into Minikube's Docker registry (`docker save ... | docker load`). Finally, Ansible executes `kubectl apply -f ./k8s` to apply the YAML state, and verifies the deployment using `kubectl get pods`.

**Q28: What is Minikube and why are you using it for this project?**
**Answer:** Minikube is a lightweight utility that provisions a single-node Kubernetes cluster locally on my machine. In a true enterprise environment, we would deploy to AWS EKS or Google GKE. Minikube allows me to demonstrate identical, production-ready Kubernetes architecture, manifests, and CLI commands (`kubectl`) locally without incurring high public cloud provider costs.

**Q29: During implementation, we faced a "Caching Issue" where K8s didn't update the application even after Jenkins built the new code. What caused this and how did you resolve it?**
**Answer:** By default, if a K8s Deployment uses an image tagged `:latest`, Kubernetes checks its local cache. If it already has an image named `latest`, it skips repulling the newly built one to save bandwidth, leaving the old code running. I resolved this fundamentally in the pipeline by adding a `kubectl rollout restart deployment frontend backend` command to the Ansible playbook. This explicitly forces K8s to safely terminate the old pods and pull the freshly built image layers.

**Q30: Between Jenkins, Docker, Ansible, and Kubernetes—what happens if the server running this entire CI/CD pipeline crashes?**
**Answer:** Because I have implemented **Infrastructure as Code (IaC)**, nothing is lost. My Jenkins pipelines (`Jenkinsfile`), deployment scripts (`deploy.yml`), application code (`Dockerfile`), and orchestration rules (`k8s/*.yaml`) are all safely stored in the GitHub repository. To recover, I would simply pull the repository on a new machine, install Minikube/Docker, run the setup steps, and the entire architecture would rebuild itself in minutes.
