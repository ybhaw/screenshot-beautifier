# Build stage
FROM denoland/deno:alpine AS build

WORKDIR /app

# Copy package files
COPY package.json deno.lock* ./

# Install dependencies using deno's npm compatibility
RUN deno install --allow-scripts

# Copy source code
COPY . .

# Build the application
RUN deno task build

# Production stage
FROM nginx:alpine AS production

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# Development stage
FROM denoland/deno:alpine AS development

WORKDIR /app

# Copy package files
COPY package.json deno.lock* ./

# Install dependencies
RUN deno install --allow-scripts

# Copy source code
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start development server
CMD ["deno", "task", "dev", "--", "--host", "0.0.0.0"]
