import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
   loading: false,
  error: null,
};


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
  state.error = null;

  // Save to localStorage
  localStorage.setItem('user', JSON.stringify(action.payload.user));
  localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
  state.user = null;
  state.token = null;
  state.loading = false;
  state.error = null;
},


  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;

