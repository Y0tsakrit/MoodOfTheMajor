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

    const { data: postPages, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
        queryKey: ['posts', accessToken],
        queryFn: ({ pageParam = 1 }) => getPost({ page: pageParam, limit: 10 }, accessToken!),
        getNextPageParam: (lastPage, allPages) => {
        return lastPage.isLastPage ? undefined : allPages.length + 1;
        },
        initialPageParam: 1,
        enabled: !!accessToken,
    });

    const posts = postPages ? postPages.pages.flatMap((page) => page.data) : [];

    if (isLoading) {
        return <div className="flex justify-center items-center bg-[#0d0e15] min-h-screen text-zinc-400">Loading Dashboard...</div>;
    }
    
    return (
    <div className="relative flex md:grid md:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr] bg-[#0d0e15] w-full min-h-screen overflow-hidden text-white">

        <NavBar 
        data={profiles?.[0] || null} 
        onPostStatus={setNotification}
        />
        
        <div className="flex-1 w-full min-w-0">
        <PostList 
            posts={posts} 
            fetchMorePosts={fetchNextPage} 
            hasMore={!!hasNextPage} 
        />
        </div>
        
    </div>
    );
}

export default MyAccount