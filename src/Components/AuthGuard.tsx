import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../store/slices/userSlice";
import { LoginScreen } from "./LoginScreen";
import { RoutePaths } from "../router/types";

interface AuthGuardProps {
  children: React.ReactElement | null;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user && (!user.profiles || user.profiles.length === 0)) {
      navigate(RoutePaths.Profiles);
      return;
    }
  }, [user, location.pathname, navigate]);

  if (!user) {
    return <LoginScreen />;
  }

  return children;
};

export default AuthGuard;
