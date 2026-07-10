import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './page/login/loginPage';
import RegisterPage from './page/register/registerPage';
import { AuthProvider } from './components/AuthContext'; 
import PublicRoute from './components/publicRoute';

function DashboardPage() {
  return <div style={{ padding: '20px' }}><h1>Dashboard Home</h1></div>;
}

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
          <Route path="/" element={<DashboardPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}