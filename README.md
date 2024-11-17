**My Flower Garden - To-Do List Web Application 🌸🌷**
**Project Overview**

This project is a simple web application that manages flower data and user authentication. It includes routes for user registration, login, and CRUD operations for flower records. The application uses MongoDB for data storage and Express.js for the server-side API.

**Features**

- User Authentication: Register and login with JWT-based authentication.

- Flower Management: Add, edit, and delete flowers.

- User Roles: Two roles (admin and editor) with role-based access control.

- Flower Statistics: Fetch statistics related to flower species, size, fragrance, and height.

- CSV Import: Import flower data from a CSV file.

- Climate Change News: Fetch the latest climate change news via an API.

**Prerequisites**

Before running this project, ensure you have the following installed:

- Node.js

- MongoDB

**Installation**

1. Clone the repository:

- git clone https://github.com/araikauuu/flower-app-webb.git
   cd flower-app

2. Install dependencies:

- npm install

3. Set up your MongoDB connection:

- Replace the mongoURI in the index.js file with your own MongoDB URI.

4. Run the application:
   
- npm start
   
The application will be available at http://localhost:3000.

**API Usage**

The application interacts with a REST API to fetch, add, edit, and delete plant data.

**API Endpoints**

- GET /plants: Fetches all plants from the garden.
- POST /register: Registers a new user.
- POST /login: Logs in a user and returns a JWT token.
- POST /flowers: Adds a new flower to the garden (admin only).
- PUT /flowers/{id}: Edits an existing flower (admin only).
- DELETE /flowers/{id}: Deletes a flower from the garden (admin only).

**Key Design Decisions**

- Modular Frontend: The application’s UI is divided into different components (e.g., login, registration, flower management) for better readability and maintainability.

- Responsive Design: The application uses Bootstrap for quick and responsive design. Custom CSS is applied to create a more personalized look, such as the background image and input fields.

- Role-based Authentication: Users are assigned roles (admin or editor). Admin users can add, edit, and delete flower data, while editors can only view and add flowers.

- State Management: The user’s authentication token is stored in the frontend, ensuring that subsequent requests to the API are authorized.

- API Interaction: The frontend communicates with the backend API using fetch() for tasks such as login, registration, and flower management. This keeps the application flexible and easy to scale.

**Future Improvements**

- Database Integration: Currently, the backend API is a mock; integrating a database for persistent storage would improve the app’s functionality.

- User Profile: Add user profiles to allow users to personalize their garden and manage their data.

- Advanced Plant Search: Implement search functionality to filter plants by name, category, or other attributes.

- Testing: Add unit and integration tests to ensure the application works as expected across all components.