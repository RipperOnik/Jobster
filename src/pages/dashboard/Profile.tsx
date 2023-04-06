import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { toast } from "react-toastify";
import { FormRow } from "../../components";
import { updateUser } from "../../features/user/userSlice";
import Wrapper from "../../assets/wrappers/DashboardFormPage";

export default function Profile() {
  const { isLoading, user } = useAppSelector((store) => store.user);
  const dispatch = useAppDispatch();
  const [userData, setUserData] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    lastName: user?.lastName ?? "",
    location: user?.location ?? "",
  });
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { name, email, lastName, location } = userData;
    if (!name || !email || !lastName || !location) {
      toast.error("please fill out all fields");
      return;
    }
    dispatch(
      updateUser({
        name: userData.name,
        email: userData.email,
        lastName: userData.lastName,
        location: userData.location,
      })
    );
  }
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value;
    setUserData({ ...userData, [name]: value });
  }

  return (
    <Wrapper>
      <form className="form" onSubmit={handleSubmit}>
        <h3>profile</h3>
        <div className="form-center">
          <FormRow
            type="text"
            name="name"
            value={userData.name}
            handleChange={handleChange}
          />
          <FormRow
            type="text"
            name="lastName"
            labelText="last name"
            value={userData.lastName}
            handleChange={handleChange}
          />
          <FormRow
            type="email"
            name="email"
            value={userData.email}
            handleChange={handleChange}
          />
          <FormRow
            type="text"
            name="location"
            value={userData.location}
            handleChange={handleChange}
          />
          <button type="submit" className="btn btn-block" disabled={isLoading}>
            {isLoading ? "please wait..." : "submit"}
          </button>
        </div>
      </form>
    </Wrapper>
  );
}
