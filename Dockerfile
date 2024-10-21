# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install any needed dependencies
RUN npm install

# Copy the current directory contents into the container
COPY . .

# Transpile TypeScript to JavaScript
RUN npx tsc

# Command to run the application
CMD ["node", "dist/index.js"]
