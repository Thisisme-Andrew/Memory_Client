# Stage 1: build
FROM node:lts-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Stage 2: run
FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/package.json /app/package-lock.json ./
RUN npm install --production
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/.env .env
EXPOSE 3000
CMD ["npm", "start"]