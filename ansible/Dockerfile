# Use Python base image
FROM python:3.9-slim

# Install Ansible and Docker CLI so Ansible can control Docker
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://get.docker.com -o get-docker.sh && \
    sh get-docker.sh && \
    pip install ansible docker docker-compose

# Install the community.docker collection for Ansible
RUN ansible-galaxy collection install community.docker

# Set working directory
WORKDIR /ansible

# Command to keep the container running
CMD ["tail", "-f", "/dev/null"]