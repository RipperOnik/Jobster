import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import userSlice from "./features/user/userSlice";
import jobSlice from "./features/job/jobSlice";
import allJobsSlice from "./features/allJobs/allJobsSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    job: jobSlice,
    allJobs: allJobsSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
