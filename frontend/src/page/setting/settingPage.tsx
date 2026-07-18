import { useState, useEffect } from 'react';
import { useAuth } from "../../components/authContext";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfile, updateProfile, getDepartments } from './actions'; 
import NavBar from '../../components/navBar';
import SearchDropdown from '../../components/searchDropdown';
import Notification from '../../components/notification';

type ProfileFormData = {
    firstName: string;
    lastName: string;
    faculty: string;
    major: string;
    password: string;
};

interface DepartmentItem {
    id: string;
    faculty: string;
    major: string;
    CreatedAt: string;
    UpdatedAt: string;
}

function SettingPage() {
    const { accessToken } = useAuth();
    const queryClient = useQueryClient();

    const [notification, setNotification] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({
        show: false,
        message: '',
        type: 'success',
    });

    const [formData, setFormData] = useState<ProfileFormData>({
        firstName: '',
        lastName: '',
        faculty: '',
        major: '',
        password: '',
    });

    const [facultySearch, setFacultySearch] = useState('');
    const [majorSearch, setMajorSearch] = useState('');

    const { data: profile } = useQuery({
        queryKey: ['profile', accessToken], 
        queryFn: () => getProfile({}, accessToken!),
        enabled: !!accessToken,
    });

    const { data: facultyDeps } = useQuery<DepartmentItem[]>({
        queryKey: ['departments', 'faculty', facultySearch, accessToken],
        queryFn: () => getDepartments({ search: facultySearch }, accessToken!),
        enabled: !!accessToken,
    });

    const { data: majorDeps } = useQuery<DepartmentItem[]>({
        queryKey: ['departments', 'major', majorSearch, accessToken],
        queryFn: () => getDepartments({ search: majorSearch }, accessToken!),
        enabled: !!accessToken,
    });

    useEffect(() => {
        if (profile?.[0]) {
            const user = profile[0];
            const initialFaculty = user.department?.faculty || '';
            const initialMajor = user.department?.major || '';
            
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                faculty: initialFaculty,
                major: initialMajor,
                password: '',
            });
            
            setFacultySearch(initialFaculty);
            setMajorSearch(initialMajor);
        }
    }, [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFacultyChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            faculty: value,
            major: '',
        }));
        setFacultySearch(value);
        setMajorSearch('');
    };

    const handleMajorChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            major: value,
        }));
        setMajorSearch(value);
    };

    const mutation = useMutation<unknown, Error, ProfileFormData>({
        mutationFn: (updatedData) => updateProfile(updatedData, accessToken!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile', accessToken] });
            setNotification({
                show: true,
                message: 'Profile updated successfully',
                type: 'success'
            });
        },
        onError: (error) => {
            setNotification({
                show: true,
                message: error.message || 'Failed to update profile',
                type: 'error'
            });
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    const facultyOptions = Array.from(new Set((facultyDeps || []).map((d) => d.faculty)))
        .map((fac) => ({ value: fac, label: fac }));

    const majorOptions = (majorDeps || [])
        .filter((d) => !formData.faculty || d.faculty === formData.faculty)
        .map((d) => d.major)
        .map((maj) => ({ value: maj, label: maj }));

    return (
        <div className="relative flex md:grid md:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr_350px] bg-[#0d0e15] w-full min-h-screen overflow-hidden text-white">
            <NavBar 
                data={profile?.[0] || null} 
                onPostStatus={() => {}}
            />
            
            <div className="p-8 w-full max-w-2xl complex-form-layout">
                <h1 className="mb-6 font-bold text-2xl">Account Settings</h1>
                
                {notification.show && (
                    <div className="mb-4">
                        <Notification 
                            message={notification.message} 
                            type={notification.type} 
                            onClose={() => setNotification(prev => ({ ...prev, show: false }))}
                        />
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium text-sm">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="bg-[#1a1c26] p-2 border border-[#2d3142] focus:border-blue-500 rounded focus:outline-none w-full text-white"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-sm">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="bg-[#1a1c26] p-2 border border-[#2d3142] focus:border-blue-500 rounded focus:outline-none w-full text-white"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-sm">Faculty</label>
                        <SearchDropdown
                            placeholder="Select or search Faculty..."
                            options={facultyOptions}
                            value={formData.faculty}
                            onChange={handleFacultyChange}
                            onSearchChange={setFacultySearch}
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-sm">Major</label>
                        <SearchDropdown
                            placeholder="Select or search Major..."
                            options={majorOptions}
                            value={formData.major}
                            onChange={handleMajorChange}
                            onSearchChange={setMajorSearch}
                            disabled={!formData.faculty}
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-sm">New Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Leave blank to keep current password"
                            className="bg-[#1a1c26] p-2 border border-[#2d3142] focus:border-blue-500 rounded focus:outline-none w-full text-white"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 mt-4 px-4 py-2 rounded font-medium text-white transition-colors"
                    >
                        {mutation.isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SettingPage;