import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../store";
import FormRow from "./FormRow";
import FormRowSelect from "./FormRowSelect";
import { clearFilters, handleChange } from "../features/allJobs/allJobsSlice";

export default function SearchContainer() {
  const [localSearch, setLocalSearch] = useState("");
  const { isLoading, search, searchStatus, searchType, sort, sortOptions } =
    useAppSelector((store) => store.allJobs);
  const { jobTypeOptions, statusOptions } = useAppSelector(
    (store) => store.job
  );
  const dispatch = useAppDispatch();

  function handleSearch(e: any) {
    dispatch(handleChange({ name: e.target.name, value: e.target.value }));
  }
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLocalSearch("");
    dispatch(clearFilters());
  }
  function debounce() {
    let timeoutID: ReturnType<typeof setTimeout>;
    return (e: any) => {
      setLocalSearch(e.target.value);
      if (timeoutID) {
        clearTimeout(timeoutID);
      }
      timeoutID = setTimeout(() => {
        dispatch(handleChange({ name: e.target.name, value: e.target.value }));
      }, 1000);
    };
  }
  const optimizedDebounce = useMemo(() => debounce(), []);

  return (
    <Wrapper>
      <form className="form" onSubmit={handleSubmit}>
        <h4>search form</h4>
        <div className="form-center">
          {/* search position */}

          <FormRow
            type="text"
            name="search"
            value={localSearch}
            handleChange={optimizedDebounce}
          />
          {/* search by status */}
          <FormRowSelect
            labelText="status"
            name="searchStatus"
            value={searchStatus}
            handleChange={handleSearch}
            options={["all", ...statusOptions]}
          />
          {/* search by type */}
          <FormRowSelect
            labelText="type"
            name="searchType"
            value={searchType}
            handleChange={handleSearch}
            options={["all", ...jobTypeOptions]}
          />
          {/* sort */}
          <FormRowSelect
            name="sort"
            value={sort}
            handleChange={handleSearch}
            options={sortOptions}
          />
          <button
            className="btn btn-block btn-danger"
            disabled={isLoading}
            type="submit"
          >
            clear filters
          </button>
        </div>
      </form>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  .form {
    width: 100%;
    max-width: 100%;
  }
  .form-input,
  .form-select,
  .btn-block {
    height: 35px;
  }
  .form-row {
    margin-bottom: 0;
  }
  .form-center {
    display: grid;
    grid-template-columns: 1fr;
    column-gap: 2rem;
    row-gap: 0.5rem;
  }
  h5 {
    font-weight: 700;
  }
  .btn-block {
    align-self: end;
    margin-top: 1rem;
  }
  @media (min-width: 768px) {
    .form-center {
      grid-template-columns: 1fr 1fr;
    }
  }
  @media (min-width: 992px) {
    .form-center {
      grid-template-columns: 1fr 1fr 1fr;
    }
    .btn-block {
      margin-top: 0;
    }
  }
`;
