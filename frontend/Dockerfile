# Build stage
FROM node:18-alpine as build

WORKDIR /usr/src/app

# COPY package*.json ./
# RUN npm install

COPY . .
# RUN npm run build  # If using a framework like React/Vue (adjust as needed)

# Production stage (for static files)
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /usr/src/app /usr/share/nginx/html

# Copy custom nginx config (if needed)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]