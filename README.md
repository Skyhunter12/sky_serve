# Project Setup

## Backend Setup

1. Install all packages:
    ```sh
    npm i
    ```
    If any packages fail to install, use:
    ```sh
    npm i <packagename> --force
    ```

2. Start the backend server:
    ```sh
    npm run dev
    ```
    The backend will start running on port 3000.

## Frontend Setup

1. Install React:
    ```sh
    npm i react
    ```

2. Install all packages:
    ```sh
    npm i
    ```
    If any packages fail to install, use:
    ```sh
    npm i <packagename> --force
    ```

3. Start the frontend server:
    ```sh
    npm run start
    ```
    The frontend will start running on port 3001 to handle CORS issues for file upload.

## Backend Flow

- A Postman collection is shared for backend flow.

## Frontend Flow

### Registration
- URL: `http://localhost:3001/register`
- You can add any number of users. The email will be the primary key.

### Login
- URL: `http://localhost:3001/login`
- After logging in with email and password, you will have access to:
  - `navigateonMap`
  - `boardAdmin`
  - `logout`

### Map Utilization (tab - navigateonMap)
- Two markers are added by default. Zoom out to find both markers.
- Set near coordinates to alter either of the markers and get the distance between them.
- Distances shown include actual distance on road (drive), short distance directly, and travel time.
- On hover, you can see actual place names on the real map for both markers.

### File Upload (tab - boardadmin)
- Use this tab for uploading JSON/GeoJSON/KML/XML files.