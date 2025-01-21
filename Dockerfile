# Use a Debian-based Node.js image as the base image
FROM node:20 AS stage
# Set NODE_ENV to production
ENV PORT=8080
RUN npm install -g pm2
FROM stage
# Set the working directory inside the container
WORKDIR /var/www/gp-api

# Copy only the production dependencies
# COPY package*.json ./
COPY . .

RUN npm install 
# Copy the built application (dist folder) from the pipeline
#COPY dist ./dist
# COPY ecosystem.config.js ./ecosystem.config.js

# Expose the port that your API service listens on
EXPOSE 8080


# Start the application
ENTRYPOINT ["pm2", "start", "ecosystem.config.cjs", "--no-daemon"]

#command build
#docker build -f Dockerfile.run -t user_mobtwin .
#command run
#docker run -d --name user_mobtwin --network my_network -p 8080:8080 user_mobtwin
