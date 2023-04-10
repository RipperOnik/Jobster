import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import customFetch, { checkForUnauthorizedRequest } from "../../utils/axious";
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
  stats?: Stats;
  monthlyApplications: MonthlyApplication[];
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
  const { page, search, searchStatus, searchType, sort } =
    thunkAPI.getState().allJobs;

  let url = `/jobs?status=${searchStatus}&jobType=${searchType}&sort=${sort}&page=${page}`;
  if (search) {
    url += `&search=${search}`;
  }

  try {
    const resp = await customFetch.get(url, {
      headers: {
        authorization: `Bearer ${thunkAPI.getState().user.user.token}`,
      },
    });
    return resp.data;
  } catch (error: any) {
    return checkForUnauthorizedRequest(error, thunkAPI);
  }
});

interface StateResponseData {
  defaultStats: Stats;
  monthlyApplications: MonthlyApplication[];
}
interface Stats {
  pending: number;
  interview: number;
  declined: number;
}
export interface MonthlyApplication {
  date: string;
  count: number;
}

export const showStats = createAsyncThunk<
  StateResponseData,
  undefined,
  {
    rejectValue: string;
    state: any;
    dispatch: AppDispatch;
  }
>("allJobs/showStats", async (_, thunkAPI) => {
  try {
    const resp = await customFetch.get("/jobs/stats", {
      headers: {
        authorization: `Bearer ${thunkAPI.getState().user.user.token}`,
      },
    });
    return resp.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
});

export type Name = "searchStatus" | "searchType" | "sort" | "search";
export interface ChangeAction {
  name: Name;
  value: string;
}

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
    handleChange: (
      state,
      { payload: { name, value } }: PayloadAction<ChangeAction>
    ) => {
      state.page = 1;
      state[name] = value;
    },
    clearFilters: (state) => {
      return { ...state, ...initialFiltersState };
    },
    changePage: (state, { payload }: PayloadAction<number>) => {
      state.page = payload;
    },
    clearAllJobsState: () => {
      return initialState;
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
        state.numOfPages = payload.numOfPages;
        state.totalJobs = payload.totalJobs;
      })
      .addCase(getAllJobs.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload);
      })
      .addCase(showStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(showStats.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.stats = payload.defaultStats;
        state.monthlyApplications = payload.monthlyApplications;
      })
      .addCase(showStats.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload);
      });
  },
});
export const {
  showLoading,
  hideLoading,
  handleChange,
  clearFilters,
  changePage,
  clearAllJobsState,
} = allJobsSlice.actions;

export default allJobsSlice.reducer;
