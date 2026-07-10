import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './page/login/loginPage';
import RegisterPage from './page/register/registerPage';
import { AuthProvider } from './components/AuthContext'; 
import PublicRoute from './components/publicRoute';


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
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
          <Route path="/"/>
        </Routes>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}