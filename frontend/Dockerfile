FROM node:alpine
WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install
COPY . .

EXPOSE 9900
CMD ["npm", "start"]
