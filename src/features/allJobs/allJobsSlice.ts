import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import customFetch from "../../utils/axious";
import { AppDispatch } from "../../store";

const initialFiltersState: InitialFilterState = {
  search: "",
  searchStatus: "all",
  searchType: "all",
  sort: "latest",
  sortOptions: ["latest", "oldest", "a-z", "z-a"],
};
interface InitialFilterState {
  search: string;
  searchStatus: string;
  searchType: string;
  sort: string;
  sortOptions: string[];
}

interface AllJobsState extends InitialFilterState {
  isLoading: boolean;
  jobs: Job[];
  totalJobs: number;
  numOfPages: number;
  page: number;
  stats: {};
  monthlyApplications: [];
}
interface Job {
  company: string;
  createdAt: string;
  createdBy: string;
  jobLocation: string;
  jobType: string;
  position: string;
  status: string;
  updatedAt: string;
  __v: number;
  _id: string;
}

interface ResponseData {
  jobs: Job[];
  totalJobs: number;
  numOfPages: number;
}

const initialState: AllJobsState = {
  isLoading: true,
  jobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1,
  stats: {},
  monthlyApplications: [],
  ...initialFiltersState,
};

export const getAllJobs = createAsyncThunk<
  ResponseData,
  undefined,
  {
    rejectValue: string;
    state: any;
    dispatch: AppDispatch;
  }
>("allJobs/getJobs", async (_, thunkAPI) => {
  let url = `/jobs`;

  try {
    const resp = await customFetch.get(url, {
      headers: {
        authorization: `Bearer ${thunkAPI.getState().user.user.token}`,
      },
    });
    return resp.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
});

const allJobsSlice = createSlice({
  name: "allJobs",
  initialState,
  reducers: {
    showLoading: (state) => {
      state.isLoading = true;
    },
    hideLoading: (state) => {
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllJobs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllJobs.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.jobs = payload.jobs;
      })
      .addCase(getAllJobs.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload);
      });
  },
});
export const { showLoading, hideLoading } = allJobsSlice.actions;

export default allJobsSlice.reducer;
