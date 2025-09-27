// src/services/userService.js
import api from './api';

export const getAllStudents = () =>
  api.get('/users/students');

export const getAllDrills = () =>
  api.get('/users/drills');
