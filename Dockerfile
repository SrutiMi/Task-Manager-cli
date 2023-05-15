FROM node:16
WORKDIR /app

#Copy the package.json and package-lock.json file to the container

COPY package*.json .

RUN npm install

#copying the rest of the application files to the container
COPY . .

CMD ["node","task_manager.js"]
