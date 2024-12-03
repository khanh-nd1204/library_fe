import {createSlice} from '@reduxjs/toolkit';
import {UserType} from "../../types/user.type.ts";

type StateType = {
  user: UserType;
};

const initialState: StateType = {
  user: {} as UserType,
};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    doLoginAccountAction: (state, action) => {
      state.user = action.payload.user;
      localStorage.setItem("accessToken", action.payload.accessToken);
    },
    doGetAccountAction: (state, action) => {
      state.user = action.payload;
    },
    doLogoutAccountAction: (state) => {
      state.user = {};
      localStorage.removeItem("accessToken");
    },
    doUpdateAccountAction: (state, action) => {
      state.user.name = action.payload.name;
      localStorage.removeItem("accessToken");
    },
  },

  extraReducers: () => {
  },
});

export const {
  doGetAccountAction, doLogoutAccountAction,
  doLoginAccountAction, doUpdateAccountAction
} = accountSlice.actions;

export default accountSlice.reducer;
