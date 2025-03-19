# MERN Stack with Vite

A full-stack web application built with the MERN (MongoDB, Express, React, Node.js) stack, utilizing Vite for the React frontend. This project provides a fast and efficient development environment for building modern web applications.

## Features

- **Frontend**: Built with React using Vite for a fast and optimized development environment.
- **Backend**: Powered by Node.js and Express.js for robust API development.
- **Database**: MongoDB for data storage and retrieval.
- **Routing**: Includes React Router for single-page application (SPA) routing.
- **State Management**: Context API or any other state management library (e.g., Redux) can be used.
- **Styling**: Includes support for CSS, Tailwind CSS, or any preferred styling solution.

## Prerequisites

Ensure you have the following installed on your system:

- Node.js (v22.12.0)
- MongoDB (>= 5.x)
- npm or yarn (package managers)

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/swamiankit261/fishProject.git
cd fishProject
```

### 2. Install Dependencies

#### Backend
```bash
npm install
```

#### Frontend
```bash
cd ../frontend
npm install
```

### 3. Environment Variables

### Backend

Create a `.env` file in the `backend` folder with the following variables:

```env
DB_URL =

PORT =

ORIGIN=

CLOUDINARY_CLOUD_NAME =
CLOUDINARY_API_KEY =
CLOUDINARY_API_SECRET =

ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=

REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=

NODE_ENV=
```

### Frontend

Create a `.env` file in the `frontend` folder with the following variables:

```env
VITE_NODE_ENV=development

VITE_GST=18
VITE_SHIPPING_PRICE=20,
VITE_UPIID=example@axl
VITE_ACCOUNT_HOST_NAME="jhon"
```

### 4. Run the Application

#### Start the Backend Server
```bash
npm start
```

#### Start the Frontend Development Server
```bash
cd ../frontend
npm start
```

### Start both server backend and frontend

```bash
npm run dev
```

### 5. Access the Application

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:5000](http://localhost:5000)

## Project Structure

```plaintext
mern-vite-project/
├── backend/        # Node.js + Express backend
├── frontend/       # React + Vite frontend
├── README.md       # Project documentation
```

### Backend

- `server.js`: Entry point of the backend server.
- `routes/`: Contains API routes.
- `models/`: Database models for MongoDB.
- `controllers/`: Logic for handling API requests.
- `config/`: Configuration files (e.g., database connection).

### Frontend

- `src/`: Main source folder.
  - `components/`: Reusable React components.
  - `pages/`: React pages for different routes.
  - `context/`: Context API setup for global state management.
  - `App.jsx`: Root component.
  - `main.jsx`: Entry point for React.

## Scripts


### Frontend Scripts

- `npm run dev`: Start the Vite development server.
- `npm run build`: Build the React app for production.
- `npm run preview`: Preview the production build.


### Backend Scripts

- `npm run dev`: Start both backend and frontend.
- `npm start`: Start the server in development mode with hot reloading.

## Dependencies

### Backend

- express
- mongoose
- dotenv
- mongoose-autopopulate
- cloudinary
- cookie-parser
- cors
- express-validator
- multer-storage-cloudinary
- multer (for file handling)
- bcrypt (for password hashing)
- jsonwebtoken (for authentication)

### Frontend

- react
- react-dom
- react-router-dom
- react-toastify
- yup
- react-redux
- tailwindcss

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

---

Happy coding! If you have any questions or suggestions, feel free to reach out.

