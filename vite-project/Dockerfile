# Step 1: Build the app
FROM node:18-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run prod
# Step 2: Serve the app using nginx
FROM nginx:stable-alpine AS production
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html
# # Optional: Replace default nginx config
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
