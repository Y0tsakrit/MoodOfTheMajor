import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './page/login/loginPage';
import RegisterPage from './page/register/registerPage';
import { AuthProvider, useAuth } from './components/authContext'; 
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PublicRoute from './components/publicRoute';
import PrivateRoute from './components/privateRoute';
import HomePage from './page/home/homePage';
import MyAccount from './page/myAccount/myAccountPage';

const queryClient = new QueryClient();

function GlobalLoadingScreen() {
  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-[#0d0e15] w-full min-h-screen">
      <div className="border-4 border-zinc-800 border-t-zinc-200 rounded-full w-10 h-10 animate-spin" />
    </div>
  );
}

function AppRoutes() {
  const { loading } = useAuth();

  if (loading) {
    return <GlobalLoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          } 
        />
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/my-account" 
          element={
            <PrivateRoute>
              <MyAccount />
            </PrivateRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* Render the context-aware routing tree sublayer component node */}
        <AppRoutes />
      </AuthProvider>
    </QueryClientProvider>
  );
}