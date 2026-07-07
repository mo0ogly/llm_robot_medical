# Build stage
FROM node:20-slim as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# Serve at root for the network/Docker deploy (override the GitHub Pages subpath).
ARG VITE_BASE=/
ENV VITE_BASE=$VITE_BASE
RUN npm run build

# Serve stage
FROM nginx:alpine

# Copy built assets to Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# public/ assets keep restrictive 0660 perms after build; nginx worker (user nginx)
# would 403 on them. Make everything world-readable/traversable.
RUN chmod -R a+rX /usr/share/nginx/html

# Copy custom Nginx configuration to proxy /api requests to the backend
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
