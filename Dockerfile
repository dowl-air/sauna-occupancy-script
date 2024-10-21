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

RUN npx tsc

RUN ["cp", "dist/index.js", "."]

# Command to run the application
CMD ["node", "index.js"]
