FROM node:23-alpine

WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
EXPOSE 3000 3000
CMD ["npm", "run", "dev"]
