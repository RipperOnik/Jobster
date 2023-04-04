import { User } from "../features/user/userSlice";

export function addUserToLocalStorage(user: User) {
  localStorage.setItem("userJobster", JSON.stringify(user));
}

export function removeUserFromLocalStorage() {
  localStorage.removeItem("userJobster");
}

export function getUserFromLocalStorage() {
  const result = localStorage.getItem("userJobster");
  const user = result ? JSON.parse(result) : null;
  return user;
}
