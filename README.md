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

## Conclusion

This project demonstrates a robust and scalable solution for marketing campaign performance analysis. The combination of NestJS and Vue 3 with Vuetify provides a powerful and user-friendly platform for managing and visualizing campaign data. The design decisions and optimizations implemented ensure the application is both performant and maintainable, ready to meet the needs of users and stakeholders.
