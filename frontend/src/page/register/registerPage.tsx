import { useEffect, useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import SearchDropdown from '../../components/searchDropdown';
import { registerSchema } from '../../utils/validation';
import { getFaculties, getMajors, registerUser } from './action';
import Notification from '../../components/notification';

function RegisterPage() {
    const navigate = useNavigate();

    const [faculties, setFaculties] = useState<any[]>([]);
    const [majors, setMajors] = useState<any[]>([]);
    const [selectedFacultyValue, setSelectedFacultyValue] = useState<string | null>(null);
    const [loadingMajors, setLoadingMajors] = useState<boolean>(false);

    const [notification, setNotification] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({
        show: false,
        message: '',
        type: 'success',
    });

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
        email: '',
        firstName: '',
        lastName: '',
        faculty: '',
        major: '',
        password: '',
        }
    });

    const onSubmit = async (data: any) => {
        try {
        await registerUser(data);
        setNotification({
            show: true,
            message: 'Registration successful! Account created.',
            type: 'success',
        });
        setTimeout(() => {
            navigate('/login');
        }, 1500);
        } catch (error) {
        setNotification({
            show: true,
            message: 'Registration failed. Please check your data.',
            type: 'error',
        });
        }
    };

    const closeNotification = () => {
        setNotification((prev) => ({ ...prev, show: false }));
    };

    useEffect(() => {
        register('faculty');
        register('major');
    }, [register]);

    useEffect(() => {
        const fetchFaculties = async () => {
        try {
            const data = await getFaculties();
            setFaculties(data);
        } catch (error) {
            console.error('Error fetching faculties:', error);
        }
        };
        fetchFaculties();
    }, []);

    useEffect(() => {
        if (!selectedFacultyValue) {
        setMajors([]);
        setValue('major', '');
        return;
        }

        const fetchMajorsData = async () => {
        try {
            setLoadingMajors(true);
            setValue('major', ''); 
            
            const selectedFaculty = faculties.find(f => f.value === selectedFacultyValue);
            if (selectedFaculty) {
            const data = await getMajors(selectedFaculty.label);
            setMajors(data);
            }
        } catch (error) {
            console.error('Error fetching majors:', error);
            setMajors([]);
        } finally {
            setLoadingMajors(false);
        }
    };
    fetchMajorsData();}, [selectedFacultyValue, faculties, setValue]);

    const handleFacultyChange = (val: string) => {
        setSelectedFacultyValue(val);
        setValue('faculty', val);
    };

    const handleMajorChange = (val: string) => {
        setValue('major', val);
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
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col justify-center items-center w-full'>
            <h1 className='mb-6 font-bold text-3xl'>Register</h1>
            <div className='mb-4 w-full'>
                <input 
                type="email" 
                placeholder='Email' 
                {...register('email')}
                className='p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full' 
                />
                {errors.email && <p className='mt-1 text-red-500 text-xs'>{errors.email.message}</p>}
            </div>

            <div className='mb-4 w-full'>
                <input 
                type="text" 
                placeholder='First Name' 
                {...register('firstName')}
                className='p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full' 
                />
                {errors.firstName && <p className='mt-1 text-red-500 text-xs'>{errors.firstName.message}</p>}
            </div>

            <div className='mb-4 w-full'>
                <input 
                type="text" 
                placeholder='Last Name' 
                {...register('lastName')}
                className='p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full' 
                />
                {errors.lastName && <p className='mt-1 text-red-500 text-xs'>{errors.lastName.message}</p>}
            </div>

            <div className='flex justify-between gap-3 mb-4 w-full'>
                <div className='w-1/2'>
                <SearchDropdown 
                    placeholder='Search or select a faculty...' 
                    options={faculties} 
                    onChange={handleFacultyChange} 
                />
                {errors.faculty && <p className='mt-1 text-red-500 text-xs'>{errors.faculty.message}</p>}
                </div>
                <div className='w-1/2'>
                <SearchDropdown 
                    placeholder={loadingMajors ? 'Loading...' : 'Search or select a major...'} 
                    options={majors} 
                    onChange={handleMajorChange}
                    disabled={!selectedFacultyValue || loadingMajors}
                />
                {errors.major && <p className='mt-1 text-red-500 text-xs'>{errors.major.message}</p>}
                </div>
            </div>

            <div className='mb-4 w-full'>
                <input 
                type="number" 
                placeholder='Year of Study' 
                {...register('yearOfStudy', { valueAsNumber: true })}
                className='p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full' 
                />
                {errors.yearOfStudy && <p className='mt-1 text-red-500 text-xs'>{errors.yearOfStudy.message}</p>}
            </div>

            <div className='mb-6 w-full'>
                <input 
                type="password" 
                placeholder='Password' 
                {...register('password')}
                className='p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full' 
                />
                {errors.password && <p className='mt-1 text-red-500 text-xs'>{errors.password.message}</p>}
            </div>

            <button type="submit" className='bg-blue-500 hover:bg-blue-600 p-2 rounded-md w-full font-semibold text-white transition-colors'>
                Register
            </button>
            </form>

            <p className='mt-4 text-gray-500 text-sm text-center'>
            Already have an account?{' '}
            <Link to="/login" className='text-blue-500 hover:underline'>
                Login
            </Link>
            </p>
        </div>
        </div>
    );
}

export default RegisterPage;