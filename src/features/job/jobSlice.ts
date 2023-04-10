import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import customFetch, { checkForUnauthorizedRequest } from "../../utils/axious";
import { getUserFromLocalStorage } from "../../utils/localStorage";
import { AppDispatch } from "../../store";
import { logoutUser } from "../user/userSlice";
import { showLoading, hideLoading, getAllJobs } from "../allJobs/allJobsSlice";

const initialState: JobState = {
  isLoading: false,
  position: "",
  company: "",
  jobLocation: "",
  jobTypeOptions: ["full-time", "part-time", "remote", "internship"],
  jobType: "full-time",
  statusOptions: ["interview", "declined", "pending"],
  status: "pending",
  isEditing: false,
  editJobId: "",
};

export type Name =
  | "position"
  | "company"
  | "jobLocation"
  | "status"
  | "jobType";
interface ChangeAction {
  name: Name;
  value: string;
}

interface Job {
  position: string;
  company: string;
  jobLocation: string;
  status: string;
  jobType: string;
  editJobId?: string;
}
interface JobState extends Job {
  isLoading: boolean;
  jobTypeOptions: string[];
  statusOptions: string[];
  isEditing: boolean;
}
interface ResponseData {
  job: Job;
}
export const createJob = createAsyncThunk<
  ResponseData,
  Job,
  {
    rejectValue: string;
    dispatch: AppDispatch;
    state: any;
  }
>("job/createJob", async (job, thunkAPI) => {
  try {
    const resp = await customFetch.post("/jobs", job, {
      headers: {
        authorization: `Bearer ${thunkAPI.getState().user.user.token}`,
      },
    });
    thunkAPI.dispatch(clearValues());
    return resp.data;
  } catch (error: any) {
    return checkForUnauthorizedRequest(error, thunkAPI);
  }
});

export const deleteJob = createAsyncThunk<
  string,
  string,
  {
    rejectValue: string;
    dispatch: AppDispatch;
    state: any;
  }
>("job/deleteJob", async (jobId, thunkAPI) => {
  thunkAPI.dispatch(showLoading());
  try {
    const resp = await customFetch.delete(`/jobs/${jobId}`, {
      headers: {
        authorization: `Bearer ${thunkAPI.getState().user.user.token}`,
      },
    });
    thunkAPI.dispatch(getAllJobs());
    return resp.data.msg;
  } catch (error: any) {
    thunkAPI.dispatch(hideLoading());
    return checkForUnauthorizedRequest(error, thunkAPI);
  }
});
interface EditJob {
  job: Job;
  jobId: string;
}
export const editJob = createAsyncThunk<
  undefined,
  EditJob,
  {
    rejectValue: string;
    dispatch: AppDispatch;
    state: any;
  }
>("job/editJob", async ({ jobId, job }, thunkAPI) => {
  try {
    const resp = await customFetch.patch(`/jobs/${jobId}`, job, {
      headers: {
        authorization: `Bearer ${thunkAPI.getState().user.user.token}`,
      },
    });
    thunkAPI.dispatch(clearValues());
  } catch (error: any) {
    return checkForUnauthorizedRequest(error, thunkAPI);
  }
});

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    handleChange: (
      state,
      { payload: { name, value } }: PayloadAction<ChangeAction>
    ) => {
      state[name] = value;
    },
    clearValues: () => {
      return {
        ...initialState,
        jobLocation: getUserFromLocalStorage()?.location ?? "",
      };
    },
    setEditJob: (state, { payload }: PayloadAction<Job>) => {
      return { ...state, isEditing: true, ...payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createJob.pending, (state: JobState) => {
        state.isLoading = true;
      })
      .addCase(createJob.fulfilled, (state: JobState) => {
        state.isLoading = false;
        toast.success("Job Created");
      })
      .addCase(createJob.rejected, (state: JobState, { payload }) => {
        state.isLoading = false;
        toast.error(payload);
      })
      .addCase(deleteJob.fulfilled, (state: JobState, { payload }) => {
        toast.success(payload);
      })
      .addCase(deleteJob.rejected, (state: JobState, { payload }) => {
        toast.error(payload);
      })
      .addCase(editJob.pending, (state: JobState) => {
        state.isLoading = true;
      })
      .addCase(editJob.fulfilled, (state: JobState) => {
        state.isLoading = false;
        toast.success("Job Modified");
      })
      .addCase(editJob.rejected, (state: JobState, { payload }) => {
        state.isLoading = false;
        toast.error(payload);
      });
  },
});
export const { handleChange, clearValues, setEditJob } = jobSlice.actions;

export default jobSlice.reducer;
