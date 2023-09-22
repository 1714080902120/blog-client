# Use the official Node.js image as the base image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies
RUN npm install

ENV key=value

# Build the application
CMD ["sh", "-c", "npm install && npm run build && npm run preview"]
