// src/services/assessmentService.js
import api from './api';

export const assignAssessment = (studentId, drillId, score, feedback, assignToAll = false) =>
  api.post('/assessment/assign', { studentId, drillId, score, feedback, assignToAll });

export const getTeacherAssessments = () =>
  api.get('/assessment/teacher');

export const updateAssessment = (assessmentId, score, feedback, status) =>
  api.post('/assessment/update', { assessmentId, score, feedback, status });

export const getStudentAssessments = () =>
  api.get('/assessment/student');

export const completeAssessment = (assessmentId) =>
  api.post('/assessment/complete', { assessmentId });

export const updateStudentAssessment = (assessmentId, score, status) =>
  api.post('/assessment/student/update', { assessmentId, score, status });
