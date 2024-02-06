FROM node:16

WORKDIR /usr/src/app

# This copy the contents of the current directory (on the Docker host) into the /usr/src/app directory within the Docker image, ensuring that the copied files or directories are owned by the node user and group
COPY --chown=node:node . .

RUN npm ci --only=production

# USER node is for running the application as a user with lower privileges
USER node

CMD npm start