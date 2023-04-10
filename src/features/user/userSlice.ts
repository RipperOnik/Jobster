import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import customFetch, { checkForUnauthorizedRequest } from "../../utils/axious";
import { clearAllJobsState } from "../allJobs/allJobsSlice";
import { clearValues } from "../job/jobSlice";

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
    return checkForUnauthorizedRequest(error, thunkApi);
  }
});
export const clearStore = createAsyncThunk<any, string | undefined>(
  "user/clearStore",
  async (message, thunkAPI) => {
    try {
      // logout user
      thunkAPI.dispatch(logoutUser(message));
      // clear jobs value
      thunkAPI.dispatch(clearAllJobsState());
      // clear job input values
      thunkAPI.dispatch(clearValues());
      return Promise.resolve();
    } catch (error) {
      // console.log(error);
      return Promise.reject();
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    logoutUser: (state, { payload }: PayloadAction<string | undefined>) => {
      state.user = null;
      state.isSidebarOpen = false;
      removeUserFromLocalStorage();
      if (payload) {
        toast.success(payload);
      }
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
      })
      .addCase(clearStore.rejected, () => {
        toast.error("There was an error");
      });
  },
});

export const { toggleSidebar, logoutUser } = userSlice.actions;

export default userSlice.reducer;
