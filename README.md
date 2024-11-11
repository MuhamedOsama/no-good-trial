Here's an updated README with information about the Docker setup, Docker Compose configuration, and instructions on running the application with the recent changes.

---

# Project Overview

## Introduction

This project is a comprehensive marketing campaign performance dashboard, designed to help users analyze and visualize their marketing campaign data. The application consists of two main components: the API, built with NestJS, and the client, built with Vue 3 and Vuetify.

- **[App](https://urchin-app-asiv2.ondigitalocean.app/)**: User interface for interacting with the dashboard.
- **[API Documentation (Swagger)](https://urchin-app-asiv2.ondigitalocean.app/api/swagger)**: Interactive documentation for testing and exploring API endpoints.

## Design Decisions

### Backend (API)

1. **NestJS Framework**: Chosen for its modular architecture, which allows for easy scalability and maintainability.
2. **MongoDB**: Used as the database for its flexibility in handling diverse data structures.
3. **Swagger Integration**: Provides API documentation and testing capabilities, enhancing developer experience.
4. **Cron Jobs**: Implemented for periodic cleanup and archival of old campaign data, ensuring the database remains performant.

### Frontend (Client)

1. **Vue 3 and Vuetify**: Selected for their modern, reactive UI capabilities and comprehensive component library, respectively.
2. **Vite**: Used as the build tool for its fast cold starts and instant hot module replacement (HMR).
3. **Chart.js**: Integrated for data visualization, providing interactive charts for campaign performance analysis.
4. **Axios**: Utilized for making HTTP requests to the API, with error handling and response interceptors for a robust client-server communication.

## Challenges Faced

1. **Data Transformation**: Ensuring raw campaign data fits the schema required careful mapping and validation.
2. **Performance Optimization**: Handling large datasets efficiently, especially during data aggregation and filtering operations.
3. **Digital Ocean Deployment**: This was my first time using Digital Ocean, and although I encountered some challenges with configuring Nginx and Docker, I was able to work through them successfully.

## Additional Features and Optimizations

1. **Batch Insert**: The API supports batch insertion of campaigns, which is useful for bulk data uploads.
2. **Data Filtering and Aggregation**: Advanced filtering options and data aggregation endpoints allow users to drill down into specific campaign metrics.
3. **Responsive Design**: The client application is fully responsive, ensuring a seamless experience across different devices.
4. **Automated Component Importing**: Using `unplugin-vue-components` to automatically import Vue components, streamlining the development process.
5. **Environment Configuration**: Utilizing environment variables for API URLs and other configurations, making the application easily adaptable to different deployment environments.

---

## Docker and Docker Compose Setup

### Docker Files

#### Client Dockerfile (`client/Dockerfile`)

The `client` component of this project is packaged with Docker using a multi-stage Dockerfile:

```dockerfile
# Stage 1: Build the Vue app
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN yarn
COPY . .
RUN yarn run build

# Stage 2: Nginx to serve the built app
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf  # Default NGINX config for general use
EXPOSE 80
```

The Dockerfile sets up the Vue application in two stages:

- **Build Stage**: Installs dependencies and builds the Vue app.
- **Serve Stage**: Uses NGINX to serve the built files.

#### API Dockerfile (`api/Dockerfile`)

The `api` component is configured in a separate Dockerfile, which sets up a NestJS environment and runs the server:

```dockerfile
# API Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN yarn
COPY . .
EXPOSE 4000
CMD ["yarn", "start:prod"]
```

### Docker Compose Configuration

We use Docker Compose to orchestrate both the client and API services, making it easy to set up and run the application locally.

#### `docker-compose.yml`

The `docker-compose.yml` file is in the project root (`trial/`) and configures the client and API services.

```yaml
version: '3.8'

services:
  client:
    build:
      context: ./client
      dockerfile: Dockerfile
    ports:
      - '80:80'
    volumes:
      - ./client/nginx-local.conf:/etc/nginx/conf.d/default.conf # Override with nginx-local.conf for local development

  no-good-trial-api:
    build:
      context: ./api
      dockerfile: Dockerfile
    ports:
      - '4000:4000'
    environment:
      - MONGO_URL=mongodb://mongo:27017/no-good-trial
    depends_on:
      - mongo

  mongo:
    image: mongo
    ports:
      - '27017:27017'
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

### Running the Application

To start the application locally with Docker Compose:

1. **Navigate to the project root** (`no-good-trial/`).
2. **Run Docker Compose**:
   ```bash
   docker-compose up --build
   ```

This command will:

- Build both the client and API services.
- Start the MongoDB service.
- Override the default `nginx.conf` with `nginx-local.conf` for local development, making sure `localhost:4000` is used for the API proxy.

### Explanation of Recent Changes

1. **Separate NGINX Configurations**:
   - `nginx.conf` is the default configuration used for production or general deployment.
   - `nginx-local.conf` is tailored for local Docker Compose development, enabling API requests to `localhost:4000`.
2. **Volume Mount in Docker Compose**:
   - We mount `nginx-local.conf` to override `nginx.conf` only in the Docker Compose environment, ensuring a smooth setup for local development.

---

## Conclusion

This project demonstrates a robust and scalable solution for marketing campaign performance analysis. The combination of NestJS and Vue 3 with Vuetify provides a powerful and user-friendly platform for managing and visualizing campaign data. The design decisions and optimizations implemented ensure the application is both performant and maintainable, ready to meet the needs of users and stakeholders.
