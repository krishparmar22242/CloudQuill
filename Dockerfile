# Stage 1: Build the React application
FROM node:18-alpine as build

# Accept arguments passed during the Ansible Docker Build phase
ARG REACT_APP_API_URL
# Bake the argument into the container as an environment variable before building React
ENV REACT_APP_API_URL=$REACT_APP_API_URL

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build the React app
COPY . .
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Copy the build output to replace the default nginx contents
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 for the Nginx server
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
