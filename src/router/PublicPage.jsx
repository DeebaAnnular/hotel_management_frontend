import React from 'react';
import { useSelector } from 'react-redux';
import { selectJwt } from '../redux/slices/loginSlice';
import { Navigate } from 'react-router-dom';

const PublicPage = ({children}) => {
    const jwt = useSelector(selectJwt)
  
  return jwt? <Navigate to ="/layout/floorandroom" replace/> : children
}

export default PublicPage