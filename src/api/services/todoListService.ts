import axios from '../axios';

export const getUserProfile = () => axios.get('/user/profile');

export const login = (email: string, password: string) =>
  axios.post('/auth/login', { email, password });
