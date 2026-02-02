import type Route from './interfaces/Route.ts';
import { createElement } from 'react';

// page components

import NotFoundPage from './pages/NotFoundPage.tsx';
import startPage from './pages/StartPage.tsx';
import AboutUsPage from './pages/AboutUsPage.tsx';
import BookingPage from './pages/BookingPage.tsx';
import MovieDetails from './pages/MovieDetails.tsx';
import LoginPage from './pages/Login.tsx';
import RegisterPage from './pages/Register.tsx';


export default [
  startPage,
  MovieDetails,
  AboutUsPage,
  NotFoundPage,
  BookingPage,
  LoginPage,
  RegisterPage,
]
  // map the route property of each page component to a Route
  .map(x => (({ element: createElement(x), ...x.route }) as Route))
  // sort by index (and if an item has no index, sort as index 0)
  .sort((a, b) => (a.index || 0) - (b.index || 0));