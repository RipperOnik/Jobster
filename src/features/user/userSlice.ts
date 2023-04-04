import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import customFetch from "../../utils/axious";

import {
  addUserToLocalStorage,
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
} from "../../utils/localStorage";
import { AppDispatch } from "../../store";

const initialState: UserState = {
  isLoading: false,
  isSidebarOpen: false,
  user: getUserFromLocalStorage(),
};

interface UserState {
  isLoading: boolean;
  isSidebarOpen: boolean;
  user: User | null;
}

export interface User {
  name?: string;
  lastName?: string;
  location?: string;
  token?: string;
  email: string;
  password?: string;
}
interface ResponseData {
  user: User;
}
interface MyKnownError {
  response: Data;
}
interface Data {
  msg: string;
}

export const registerUser = createAsyncThunk<
  ResponseData,
  User,
  {
    rejectValue: string;
  }
>("user/registerUser", async (user, thunkApi) => {
  try {
    const resp = await customFetch.post("/auth/register", user);
    return resp.data;
  } catch (error: MyKnownError | any) {
    return thunkApi.rejectWithValue(error.response.data.msg);
  }
});

export const loginUser = createAsyncThunk<
  ResponseData,
  User,
  {
    rejectValue: string;
  }
>("user/loginUser", async (user, thunkApi) => {
  try {
    const resp = await customFetch.post("/auth/login", user);
    return resp.data;
  } catch (error: MyKnownError | any) {
    return thunkApi.rejectWithValue(error.response.data.msg);
  }
});

export const updateUser = createAsyncThunk<
  ResponseData,
  User,
  {
    rejectValue: string;
    state: any;
    dispatch: AppDispatch;
  }
>("user/updateUser", async (user: User, thunkApi) => {
  try {
    const resp = await customFetch.patch("/auth/updateUser", user, {
      headers: {
        authorization: `Bearer ${thunkApi.getState().user.user.token}`,
      },
    });
    return resp.data;
  } catch (error: MyKnownError | any) {
    if (error.response.status === 401) {
      thunkApi.dispatch(logoutUser());
      return thunkApi.rejectWithValue("Unauthorized! Logging out...");
    }
    return thunkApi.rejectWithValue(error.response.data.msg);
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isSidebarOpen = false;
      removeUserFromLocalStorage();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state: UserState) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state: UserState, { payload }) => {
        let user = null;
        if (payload && payload.user) {
          user = payload.user;
        } else {
          return;
        }
        state.isLoading = false;
        state.user = user;
        addUserToLocalStorage(user);
        toast.success(`Hello, ${user.name}`);
      })
      .addCase(registerUser.rejected, (state: UserState, { payload }) => {
        state.isLoading = false;
        toast.error(payload);
      })

      .addCase(loginUser.pending, (state: UserState) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state: UserState, { payload }) => {
        let user = null;
        if (payload && payload.user) {
          user = payload.user;
        } else {
          return;
        }
        state.isLoading = false;
        state.user = user;
        addUserToLocalStorage(user);
        toast.success(`Welcome Back, ${user.name}`);
      })
      .addCase(loginUser.rejected, (state: UserState, { payload }) => {
        state.isLoading = false;
        toast.error(payload);
      })
      .addCase(updateUser.pending, (state: UserState) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state: UserState, { payload }) => {
        let user = null;
        if (payload && payload.user) {
          user = payload.user;
        } else {
          return;
        }
        state.isLoading = false;
        state.user = user;
        addUserToLocalStorage(user);
        toast.success("User updated");
      })
      .addCase(updateUser.rejected, (state: UserState, { payload }) => {
        state.isLoading = false;
        toast.error(payload);
      });
  },
});

export const { toggleSidebar, logoutUser } = userSlice.actions;

export default userSlice.reducer;
