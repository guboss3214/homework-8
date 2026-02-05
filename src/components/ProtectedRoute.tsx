import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../store/store";

const ProtectedRoute = ({ children }: {children: ReactNode}) => {
  const isAuth = useSelector((state: RootState) => state.user.isAuthenticated);

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute