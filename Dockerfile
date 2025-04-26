# Use the official Node.js image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application files
COPY . .

# Set the environment to production
ENV NODE_ENV=production

# Build the NestJS application
RUN npm run build

# Expose the application port
EXPOSE 3000

# Command to run the application with drizzle-kit migration
CMD ["sh", "-c", "npx drizzle-kit generate && npx drizzle-kit push --verbose --force && node dist/src/main"]
