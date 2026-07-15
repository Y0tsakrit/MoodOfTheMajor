import React, { useState } from 'react';
import NavBar from '../../components/navBar';
import PostList from '../../components/postList';
import { getProfile, getPost } from './action';
import { useAuth } from "../../components/authContext";
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import Notification from '../../components/notification';

function MyAccount() {
    const { accessToken } = useAuth();

    const [notification, setNotification] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({
        show: false,
        message: '',
        type: 'success',
    });

    const { data: profiles } = useQuery({
        queryKey: ['profile', accessToken],
        queryFn: () => getProfile({}, accessToken!),
        enabled: !!accessToken,
    });

    const userProfile = profiles?.[0] || null;
    const profileId = userProfile?.id;

    const { data: postPages, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
        queryKey: ['posts', accessToken, profileId],
        queryFn: ({ pageParam = 1 }) => getPost({ page: pageParam, limit: 10, authorId: profileId }, accessToken!),
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.isLastPage ? undefined : allPages.length + 1;
        },
        initialPageParam: 1,
        enabled: !!accessToken && !!profileId, 
    });

    const posts = postPages ? postPages.pages.flatMap((page) => page.data) : [];

    if (isLoading) {
        return <div className="flex justify-center items-center bg-[#0d0e15] min-h-screen text-zinc-400">Loading Dashboard...</div>;
    }
    
    const userInitial = userProfile?.firstName ? userProfile.firstName.charAt(0).toUpperCase() : 'U';

    return (
        <div className="relative flex md:grid md:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr] bg-[#0d0e15] w-full min-h-screen overflow-hidden text-white">
            
            {notification.show && (
                <Notification 
                    message={notification.message} 
                    type={notification.type} 
                    onClose={() => setNotification((prev) => ({ ...prev, show: false }))}
                />
            )}

            <NavBar 
                data={userProfile} 
                onPostStatus={setNotification}
            />
            
            <div className="flex flex-col flex-1 w-full min-w-0 h-screen">
                {userProfile && (
                    <div className="p-6">
                        <div className="flex items-center gap-4 mx-auto w-full max-w-2xl">
                            <div className="flex justify-center items-center bg-zinc-800 rounded-full w-16 h-16 font-bold text-zinc-300 text-xl select-none shrink-0">
                                {userInitial}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <h1 className="font-bold text-white text-xl md:text-2xl truncate">
                                    {userProfile.firstName} {userProfile.lastName}
                                </h1>
                                <p className="mt-0.5 font-medium text-zinc-400 text-sm truncate uppercase tracking-wide">
                                    {userProfile.department?.major} Department
                                </p>
                                <div className="flex gap-4 mt-2">
                                    <span className="bg-zinc-900 px-2.5 py-0.5 border border-zinc-800 rounded font-medium text-zinc-400 text-xs">
                                        YEAR {userProfile.year}
                                    </span>
                                    <span className="bg-zinc-900 px-2.5 py-0.5 border border-zinc-800 rounded font-medium text-zinc-400 text-xs uppercase">
                                        {userProfile.department?.faculty}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="flex-1 overflow-y-auto">
                    <div className="mx-auto p-4 w-full max-w-2xl">
                        <h2 className="mb-4 px-1 font-bold text-zinc-500 text-xs uppercase tracking-wider">
                            Your Publications
                        </h2>
                    </div>
                    <PostList 
                        posts={posts} 
                        fetchMorePosts={fetchNextPage} 
                        hasMore={!!hasNextPage} 
                    />
                </div>

            </div>
            
        </div>
    );
}

export default MyAccount;