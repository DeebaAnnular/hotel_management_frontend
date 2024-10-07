import React from "react";
import { useSelector } from "react-redux";
import { selectJwt, selectIsLoading } from "../redux/slices/loginSlice";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

const ProtectedPage = ({ children }) => {
  const jwt = useSelector(selectJwt);
  const isLoading = useSelector(selectIsLoading);

  if (isLoading) {
    return <LoadingSpinner/>; // Or a loading spinner
  }

  return jwt ? children : <Navigate to="/login" replace />;
};

export default ProtectedPage;