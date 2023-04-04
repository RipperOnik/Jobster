import React, { PropsWithChildren } from "react";
import { useAppSelector } from "../store";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAppSelector((store) => store.user);
  if (!user) {
    return <Navigate to="/landing" />;
  }
  return children;
}
