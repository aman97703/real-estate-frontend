import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    UpdateUserStart: (state) => {
      state.loading = true;
    },
    UpdateUserSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
      state.error = null;
    },
    UpdateUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      console.log(action.payload);
      if (action.payload === "Unauthorized") {
        state.currentUser = null;
        localStorage.clear();
      }
    },
    DeleteUserStart: (state) => {
      state.loading = true;
    },
    DeleteUserSuccess: (state) => {
      state.loading = false;
      state.currentUser = null;
      state.error = null;
    },
    DeleteUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      console.log(action.payload);
      if (action.payload === "Unauthorized") {
        state.currentUser = null;
        localStorage.clear();
      }
    },
    SignOutStart: (state) => {
      state.loading = true;
    },
    SignOutSuccess: (state) => {
      state.loading = false;
      state.currentUser = null;
      state.error = null;
    },
    SignOutFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      console.log(action.payload);
      if (action.payload === "Unauthorized") {
        state.currentUser = null;
        localStorage.clear();
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  signInStart,
  signInSuccess,
  signInFailure,
  UpdateUserStart,
  UpdateUserSuccess,
  UpdateUserFailure,
  DeleteUserStart,
  DeleteUserSuccess,
  DeleteUserFailure,
  SignOutStart,
  SignOutSuccess,
  SignOutFailure,
} = userSlice.actions;

export default userSlice.reducer;
