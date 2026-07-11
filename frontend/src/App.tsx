import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './page/login/loginPage';
import RegisterPage from './page/register/registerPage';
import { AuthProvider } from './components/AuthContext'; 
import PublicRoute from './components/publicRoute';
import PrivateRoute from './components/privateRoute';
import HomePage from './page/home/homePage';


export default function App() {
  return (
    <AuthProvider>
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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}