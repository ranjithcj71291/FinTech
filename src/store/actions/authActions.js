import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  signUpStart,
  signUpSuccess,
  signUpFailure,
  logoutSuccess,
} from '../reducers/authReducer';

const BASE_URL = 'https://6691889926c2a69f6e900c11.mockapi.io/fintechUsers/users';

export const login = createAsyncThunk('auth/login', async ({ email, password }, thunkAPI) => {
  console.log('login : 16 - Starting login process', { email, password });
  thunkAPI.dispatch(loginStart());
  console.log('login : 18 - Dispatched loginStart action');
  try {
    console.log('login : 20 - Fetching users from API');
    const response = await fetch(`${BASE_URL}`);
    console.log('login : 22 - Received response from API', response);
    const users = await response.json();
    console.log('login : 24 - Parsed users from response', users);

    const user = users.find(user => user.email === email && user.password === password);
    console.log('login : 27 - Matching user found:', user);

    if (user) {
      const loginResponse = {
        message: 'Hello 😉! How are you?',
        status: 'ok',
        isNewUser: false,
      };
      console.log('login : 33 - Login successful:', loginResponse);
      thunkAPI.dispatch(loginSuccess(loginResponse));
    } else {
      console.log('login : 36 - Login failed: Invalid email or password.');
      thunkAPI.dispatch(loginFailure('Invalid email or password.'));
    }
  } catch (error) {
    console.log('login : 40 - Login error:', error.toString());
    thunkAPI.dispatch(loginFailure(error.toString()));
  }
});

export const signUp = createAsyncThunk('auth/signUp', async ({ name, email, password }, thunkAPI) => {
  if (!name || !email || !password) {
    console.log('signUp : 60 - One or more fields are empty');
    thunkAPI.dispatch(signUpFailure('Please enter all fields.'));
    return;
  }

  console.log('signUp : 57 - Starting sign-up process', { name, email, password });
  thunkAPI.dispatch(signUpStart());
  console.log('signUp : 65 - Dispatched signUpStart action');
  try {
    console.log('signUp : 68 - Sending sign-up request to API');
    const response = await fetch(`${BASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    console.log('signUp : 75 - Received response from API', response);
    const data = await response.json();
    console.log('signUp : 78 - Parsed data from response', data);

    const signUpResponse = {
      ...data,
      message: 'Hello 😉! How are you?',
      status: 'ok',
      isNewUser: true,
    };
    console.log('signUp : 85 - Sign-up successful:', signUpResponse);
    thunkAPI.dispatch(signUpSuccess(signUpResponse));
  } catch (error) {
    console.log('signUp : 89 - Sign-up error:', error.toString());
    thunkAPI.dispatch(signUpFailure(error.toString()));
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  console.log('logout : 96 - Starting logout process');
  try {
    thunkAPI.dispatch(logoutSuccess());
    console.log('logout : 99 - Logout successful');
  } catch (error) {
    console.error('logout : 101 - Logout error:', error);
  }
});
