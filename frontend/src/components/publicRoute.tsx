import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authContext';

interface PublicRouteProps {
  children: React.ReactNode;
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const { accessToken } = useAuth();

  if (accessToken) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

