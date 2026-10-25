import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: "GUEST" | "CUSTOMER" | "PARTNER" | "PARTNER_STAFF" | "ADMIN";
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token?: string | null;
}

const getInitialAuthState = (): AuthState => {
  try {
    const savedUser = localStorage.getItem("mego_auth_user");
    const savedToken = localStorage.getItem("mego_auth_token");
    if (savedUser && savedToken) {
      return {
        isAuthenticated: true,
        user: JSON.parse(savedUser),
        token: savedToken,
      };
    }
  } catch {
    // Ignore error in SSR / restricted environments
  }
  return {
    isAuthenticated: false,
    user: null,
    token: null,
  };
};

const initialState: AuthState = getInitialAuthState();

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      try {
        localStorage.setItem("mego_auth_user", JSON.stringify(action.payload.user));
        localStorage.setItem("mego_auth_token", action.payload.token);
      } catch {
        // Storage unavailable
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      try {
        localStorage.removeItem("mego_auth_user");
        localStorage.removeItem("mego_auth_token");
      } catch {
        // Storage unavailable
      }
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        try {
          localStorage.setItem("mego_auth_user", JSON.stringify(state.user));
        } catch {
          // Storage unavailable
        }
      }
    },
  },
});

export const { loginSuccess, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;
