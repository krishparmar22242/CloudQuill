# Use Node.js as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the backend files
COPY . .

# Expose the API port
EXPOSE 5000

# Start the server (using node instead of nodemon for production/containers)
CMD ["node", "index.js"]
