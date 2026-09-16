import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import {
  selectIsAuthChecked,
  selectUserData
} from '../../services/slices/userSlice';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  element: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  element
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUserData);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return element;
};
