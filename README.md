# Shark Streamer

Created by Kirsty Richmond.

## Visit Site
- **Frontend**: https://kirsty-richmond-netflix-clone.vercel.app
- **Backend API**: https://netflix-clone-dcjp.onrender.com/api

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Python 3.9 or higher
- Git

### Frontend Setup

1. **Clone the repository**
   ```bash
   $ git clone <repository-url>
   $ cd shark-streamer
   ```

2. **Install frontend dependencies**
   ```bash
   $ npm install
   ```

3. **Start the development server**
   ```bash
   $ npm start
   ```
   The frontend will run on `http://localhost:3000`

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   $ cd backend
   ```

2. **Create and activate virtual environment**
   ```bash
   $ python -m venv shark-streamer
   $ source shark-streamer/bin/activate  # On Windows: shark-streamer\Scripts\activate
   ```

3. **Install Python dependencies**
   ```bash
   $ pip install -r requirements.txt
   ```

4. **Initialize the database**
   ```bash
   $ python -c "from app import create_app, db; app = create_app(); app.app_context().push(); db.create_all(); print('Database created!')"
   ```

5. **Seed avatar data (optional)**
   ```bash
   $ python seed_avatars.py
   ```

6. **Start the backend server**
   ```bash
   $ python run.py
   ```
   The backend API will run on `http://localhost:5001`

### Environment Variables

Create a `.env` file in the root directory for any environment-specific configurations:
```bash
REACT_APP_API_BASE_URL=http://localhost:5001/api
```


## Description:

** **Built for learning purposes only** **

This project is a Netflix clone that replicates the core functionality and user interface of the popular streaming platform.

Currently in the project you can:
- Create an account using email and password
- Sign in and out of your account
- Create and manage multiple user profiles
- Browse movies and TV shows
- Search for content
- View movie/show details and trailers
- Change subscription plans
- Responsive design for mobile and desktop
- Add/remove content from watchlist

Future implementations:
- Personalized recommendations
- Download for offline viewing

Design choices:
- Built a custom Python Flask backend for authentication and data storage to handle user accounts and profile management
- Implemented Redux for state management to maintain user authentication state and profile data across components
- Used styled-components for styling to keep component styles modular and maintainable
- Integrated with The Movie Database (TMDb) API for movie and TV show data
- Used Formik and Yup for form validation and user input handling

## File info:

/src/App.js
Main application component that handles routing and global state management.

/src/Components/HomeScreen.js
The main dashboard displaying movie rows, banner, and navigation.

/src/Components/LoginScreen.js
Authentication component handling user login and registration flows.

/src/Components/Profiles.js
Component for managing user profiles within an account.

/src/Components/Nav.js
Navigation component with search functionality and user menu.

/src/Components/Banner.js
Hero banner component displaying featured content.

/src/Components/Row.js
Component for displaying horizontal rows of movies/shows.

/src/Components/MovieModal.js
Modal component for displaying detailed movie information and trailers.

/src/Components/SearchScreen.js
Component for displaying search results.

/src/Components/AccountScreen.js
User account management interface.

/src/features/userSlice.js
Redux slice for managing user authentication state.

/src/services/api.js
API service layer for backend communication and request handling.

/src/schemas.js
Yup validation schemas for form validation.

/src/Requests.js
API endpoints for fetching movie data from TMDb.

/src/axios.js
Axios configuration for API requests.

### Backend Files

/backend/app/__init__.py
Flask application factory and configuration.

/backend/app/models.py
SQLAlchemy database models for users, profiles, and data.

/backend/app/routes.py
API routes and endpoint handlers.

/backend/run.py
Application entry point and server startup.

#### Created with:

**Frontend:**
[![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)](#)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?logo=react-router&logoColor=white)](#)
[![Redux](https://img.shields.io/badge/Redux-764ABC?logo=redux&logoColor=fff)](#)
[![Styled Components](https://img.shields.io/badge/styled--components-DB7093?logo=styled-components&logoColor=white)](#)
[![Axios](https://img.shields.io/badge/Axios-5A29E4?logo=axios&logoColor=fff)](#)
[![Formik](https://img.shields.io/badge/Formik-0052CC?logo=formik&logoColor=white)](#)

**Backend:**
[![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)](#)
[![Flask](https://img.shields.io/badge/Flask-000000?logo=flask&logoColor=white)](#)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-D71F00?logo=sqlalchemy&logoColor=white)](#)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?logo=sqlite&logoColor=white)](#)

**Deployment:**
[![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)](#)
[![Render](https://img.shields.io/badge/Render-46E3B7?logo=render&logoColor=white)](#)
