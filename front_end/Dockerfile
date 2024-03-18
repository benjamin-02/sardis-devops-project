# Use a lightweight Node.js image
FROM node:alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
# COPY package*.json ./

# Install dependencies
# RUN npm install

# Copy all files from the current directory to the working directory
COPY . .

# Replace the placeholder in script.js with the actual value from .env
RUN apk add --no-cache sed && \
    API_URL=$(grep API_URL .env | cut -d '=' -f2) && \
    sed -i "s|%%API_URL%%|$API_URL|g" public/script.js

# Expose the port the app runs on
EXPOSE 3000

# Command to run the app
CMD ["node", "server.js"]