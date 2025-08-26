# Mobile ERDDAP Explorer

A responsive web application for searching, viewing, and favoriting oceanographic data from ERDDAP servers, designed for mobile-first use.

## Key Features

- **Station Search:** Search for data stations by text and sensor type.
- **Interactive Map:** View station locations with marker clustering for performance.
- **Detailed Station View:** Inspect individual stations, view latest measurements, and see sensor data charts.
- **Favorites:** Save favorite stations, sensors, and data tables for quick access.
- **Configurable Boundaries:** Set a default map area and zoom level for a personalized experience.

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm

### Installation & Setup

1.  Clone the repository:
    ```sh
    git clone <repository_url>
    cd <repository_directory>
    ```

2.  Install dependencies:
    ```sh
    npm install
    ```

3.  Configure the environment. Create a `.env` file in the project root and add the ERDDAP server URL:
    ```env
    # .env
    REACT_APP_SERVER=https://erddap.sensors.axds.co/erddap
    ```

### Running the Application

- **Development Server:**
  ```sh
  npm start
  ```
  The application will be available at `http://localhost:3000`.

- **Storybook Component Library:**
  ```sh
  npm run storybook
  ```
  Storybook will be available at `http://localhost:6006`.

## Available Scripts

- `npm start`: Runs the app in development mode.
- `npm run build`: Builds the app for production.
- `npm test`: Runs the test suite in watch mode.
- `npm run storybook`: Starts the Storybook development server.
- `npm run build-storybook`: Builds the Storybook component library for deployment.

## Docker

The project includes `Dockerfile` configurations for both the main application and Storybook, managed via `docker-compose`.

1.  **Build the images:**
    ```sh
    docker-compose build
    ```

2.  **Run the containers:**
    ```sh
    docker-compose up
    ```
    - The application will be served at `http://localhost:8787`.
    - Storybook will be served at `http://localhost:8888`.
