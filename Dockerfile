FROM node:20-alpine

WORKDIR /app

# Ensure devDependencies are available for migration tools at runtime
ENV NPM_CONFIG_PRODUCTION=false

# Application source
COPY . .

# Install frontend and backend dependencies
RUN npm install
RUN cd backend && npm install --include=dev

# Build frontend with API base URL injected at build time
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# Run backend (which will also serve frontend dist)
WORKDIR /app/backend
EXPOSE 3000
CMD ["npm", "start"]
