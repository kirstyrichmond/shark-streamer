import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../store/slices/userSlice";
import { LoginScreen } from "./LoginScreen";
import { RoutePaths } from "../router/types";

interface AuthGuardProps {
  children: React.ReactElement | null;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const user = useSelector(selectUser);
  const location = useLocation();

  if (!user) {
    return <LoginScreen />;
  }

  const hasNoProfiles = !user.profiles || user.profiles.length === 0;
  if (hasNoProfiles && location.pathname !== RoutePaths.Profiles) {
    return <Navigate to={ RoutePaths.Profiles } replace />;
  }

  return children;
};

export default AuthGuard;
