# Mobile ERDDAP

## Project Description
A mobile-first React application providing a user-friendly interface to explore, visualize, and favorite environmental data from ERDDAP servers. It focuses on presenting station information, sensor measurements, and latest data readings, designed for quick access and readability on handheld devices.

## Features
*   **Interactive Map:** Browse data stations geographically with selectable markers.
*   **Station Details:** View comprehensive information for individual stations, including metadata, time-series charts for various sensors, and a table of the latest measurements.
*   **Search & Filtering:** Efficiently search for data stations by name and filter results by specific sensor types.
*   **Favorites Management:** Bookmark preferred stations, individual sensors, or entire latest measurement tables for quick access and personalized data tracking.
*   **Responsive Design:** Optimized for a seamless user experience across mobile devices.
*   **Configurable Map Boundaries:** Adjust default geographic map view and zoom level via settings.
*   **Storybook Integration:** A dedicated component library for UI development and documentation.

## Tech Stack
*   **Frontend Framework:** React with TypeScript
*   **Styling:** Tailwind CSS
*   **Mapping:** Leaflet (`@axdspub/axiom-maps`)
*   **Charting:** `@axdspub/axiom-charts`
*   **Data Services:** `@axdspub/erddap-service`, `@axdspub/axiom-ui-data-services` for ERDDAP data fetching and parsing.
*   **UI Components:** Radix UI primitives
*   **Build Tooling:** Craco (for custom Webpack/Jest configuration), Storybook.
*   **Containerization:** Docker, Docker Compose
*   **CI/CD:** GitLab CI

## Getting Started

### Prerequisites
*   Node.js (v18 or later recommended)
*   npm or Yarn
*   Docker & Docker Compose (optional, for containerized setup)

### Installation
1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd mobile-erddap
    ```
2.  Install project dependencies:
    ```bash
    npm install
    # or yarn install
    ```

### Running the Application

*   **Development Mode:**
    Starts the React development server.
    ```bash
    npm start
    ```
    Open [http://localhost:3000](http://localhost:3000) to view it in the browser. The page will reload on edits.

*   **Production Build:**
    Builds the app for production to the `build` folder.
    ```bash
    npm run build
    ```
    This bundles React in production mode and optimizes for performance.

*   **With Docker Compose (Development):**
    Builds and runs the application and Storybook in Docker containers.
    ```bash
    docker-compose up --build
    ```
    Access the application at `http://localhost:8787` and Storybook at `http://localhost:8888`.

## CI/CD
This project uses `.gitlab-ci.yml` to define automated build, test, and push stages for both the main application and its Storybook instance. It supports branching, tagging, and deployment to a staging environment (`aps apps-stage mobile-erddap-and-storybook`).
