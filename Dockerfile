# Dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN apt update

COPY . .

CMD ["npm", "start"]