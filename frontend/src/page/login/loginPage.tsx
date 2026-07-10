import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { login } from './action';
import { injectTokenPointer } from '../../utils/api';
import { useAuth } from '../../components/AuthContext';
import Notification from '../../components/notification';

function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { setAccessToken } = useAuth();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    message: '',
    type: 'success',
  });

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      const result = await login(data.email, data.password);
      const accessToken = result.accessToken;
      
      localStorage.setItem('refreshToken', result.refreshToken);
      injectTokenPointer(accessToken);
      setAccessToken(accessToken);
      
      setNotification({
        show: true,
        message: 'Login successful! Redirecting...',
        type: 'success',
      });

      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error: any) {
      console.error('Error logging in:', error);
      setNotification({
        show: true,
        message: error.response?.data?.message || 'Invalid email or password.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, show: false }));
  };

  return (
    <div className='relative flex justify-center items-center bg-gray-100 p-4 min-h-screen'>
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}

      <div className='flex flex-col justify-center items-center bg-white shadow-md p-6 sm:p-8 border rounded-lg w-full sm:max-w-md'>
        <form className='flex flex-col justify-center items-center w-full' onSubmit={handleSubmit(onSubmit)}>
          <h1 className='mb-6 font-bold text-3xl'>Login</h1>
          
          <div className='mb-4 w-full'>
            <input 
              type="email" 
              placeholder='Email' 
              className='p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full' 
              {...register('email', { required: 'Email field is required' })} 
            />
            {errors.email && <p className='mt-1 text-red-500 text-xs'>{errors.email.message as string}</p>}
          </div>

          <div className='mb-6 w-full'>
            <input 
              type="password" 
              placeholder='Password' 
              className='p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full' 
              {...register('password', { required: 'Password field is required' })} 
            />
            {errors.password && <p className='mt-1 text-red-500 text-xs'>{errors.password.message as string}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`p-2 rounded-md w-full font-semibold text-white transition-colors ${
              isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p className='mt-4 text-gray-500 text-sm text-center'>
          Don't have an account?{' '}
          <Link to="/register" className='text-blue-500 hover:underline'>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;