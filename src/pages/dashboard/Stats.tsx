import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { showStats } from "../../features/allJobs/allJobsSlice";
import { ChartsContainer, StatsContainer } from "../../components";

export default function Stats() {
  const { isLoading, monthlyApplications } = useAppSelector(
    (store) => store.allJobs
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(showStats());
  }, []);
  return (
    <>
      <StatsContainer />
      {monthlyApplications.length > 0 && <ChartsContainer />}
    </>
  );
}
