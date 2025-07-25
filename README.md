# Netflix Clone

Created by Kirsty Richmond.

## Visit Site
https://kirsty-richmond-netflix.vercel.app/

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Git

### Installation

1. **Clone the repository**
   ```bash
   $ git clone <repository-url>
   $ cd netflix-clone
   ```

2. **Install dependencies**
   ```bash
   $ npm install
   ```

3. **Start the development server**
   ```bash
   $ npm start
   ```
   The application will run on `http://localhost:3000`


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

Future implementations:
- Add/remove content from watchlist
- Personalized recommendations
- Download for offline viewing

Design choices:
- Used Firebase for authentication and data storage to handle user accounts and profile management
- Implemented Redux for state management to maintain user authentication state and profile data across components
- Used styled-components for styling to keep component styles modular and maintainable
- Integrated with The Movie Database (TMDb) API for movie and TV show data

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

/src/firebase.js
Firebase configuration and initialization.

/src/Requests.js
API endpoints for fetching movie data from TMDb.

/src/axios.js
Axios configuration for API requests.

#### Created with:

[![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)](#)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?logo=react-router&logoColor=white)](#)
[![Redux](https://img.shields.io/badge/Redux-764ABC?logo=redux&logoColor=fff)](#)
[![Firebase](https://img.shields.io/badge/Firebase-039BE5?logo=Firebase&logoColor=white)](#)
[![Styled Components](https://img.shields.io/badge/styled--components-DB7093?logo=styled-components&logoColor=white)](#)
[![Axios](https://img.shields.io/badge/Axios-5A29E4?logo=axios&logoColor=fff)](#)
