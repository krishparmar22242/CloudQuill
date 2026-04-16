# Use Python base image
FROM python:3.9-slim

# Install Ansible, Docker CLI, and kubectl so Ansible can control K8s
RUN apt-get update && \
    apt-get install -y curl apt-transport-https ca-certificates && \
    curl -fsSL https://get.docker.com -o get-docker.sh && \
    sh get-docker.sh && \
    curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" && \
    install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl && \
    pip install ansible docker docker-compose

# Install the community.docker collection for Ansible
RUN ansible-galaxy collection install community.docker

# Set working directory
WORKDIR /ansible

# Command to keep the container running
CMD ["tail", "-f", "/dev/null"]