import React, { useEffect } from "react";
import Wrapper from "../../assets/wrappers/DashboardFormPage";
import { FormRow, FormRowSelect } from "../../components";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  clearValues,
  createJob,
  editJob,
  handleChange,
} from "../../features/job/jobSlice";
import { Name } from "../../features/job/jobSlice";

export default function AddJob() {
  const {
    isLoading,
    position,
    company,
    jobLocation,
    jobType,
    jobTypeOptions,
    status,
    statusOptions,
    isEditing,
    editJobId,
  } = useAppSelector((store) => store.job);
  const { user } = useAppSelector((store) => store.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isEditing && user && user.location) {
      const name = "jobLocation" as Name;
      dispatch(handleChange({ name: name, value: user.location }));
    }
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!position || !company || !jobLocation) {
      toast.error("Please fill out all the fields");
      return;
    }
    if (isEditing) {
      dispatch(
        editJob({
          jobId: editJobId!!,
          job: { position, company, jobLocation, jobType, status },
        })
      );
      return;
    }
    dispatch(createJob({ position, company, jobLocation, jobType, status }));
  }
  function handleJobInput(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) {
    const name = e.target.name as Name;
    const value = e.target.value;
    dispatch(handleChange({ name, value }));
  }
  return (
    <Wrapper>
      <form className="form" onSubmit={handleSubmit}>
        <h3>{isEditing ? "edit job" : "add job"}</h3>
        <div className="form-center">
          {/* position */}
          <FormRow
            type="text"
            name="position"
            value={position}
            handleChange={handleJobInput}
          />
          {/* company */}
          <FormRow
            type="text"
            name="company"
            value={company}
            handleChange={handleJobInput}
          />
          {/* jobLocation */}
          <FormRow
            type="text"
            name="jobLocation"
            labelText="job location"
            value={jobLocation}
            handleChange={handleJobInput}
          />
          {/* status */}
          <FormRowSelect
            name="status"
            value={status}
            handleChange={handleJobInput}
            options={statusOptions}
          />
          {/* jobType */}
          <FormRowSelect
            name="jobType"
            labelText="job type"
            value={jobType}
            handleChange={handleJobInput}
            options={jobTypeOptions}
          />
          <div className="btn-container">
            <button
              type="button"
              className="btn btn-block clear-btn"
              onClick={() => dispatch(clearValues())}
            >
              clear
            </button>
            <button
              type="submit"
              className="btn btn-block submit-btn"
              disabled={isLoading}
            >
              submit
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  );
}
