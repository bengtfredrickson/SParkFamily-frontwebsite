// Mayank Dhyani  29/07/2022
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
let auth = ''
let decoded = ''
const date = new Date();
export const GuardedRoute = () => {
  auth = localStorage.getItem("auth_token");
  if (auth) {
    decoded = jwtDecode(auth);
    var expiry = decoded.exp * 1000;
    var current = Date.now();
    if (current >= expiry) {
      auth = null;
      localStorage.clear();
    }
  }
  return auth ? <Outlet /> : <Navigate to="/" replace={true} />;
}




export const GuardedLogin = () => {
  return !localStorage.getItem('auth_token') ? <Outlet /> : <Navigate to="/home" replace={true} />;
}