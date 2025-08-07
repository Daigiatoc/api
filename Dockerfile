# Dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN apt update && apt install -y ffmpeg

COPY . .

CMD ["npm", "start"]