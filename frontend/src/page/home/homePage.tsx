import React, { useState } from 'react';
import NavBar from '../../components/navBar';
import PostList from '../../components/postList';
import CreatePostModal from '../../components/createPostModal';
import { getProfile, getPost } from './action';
import { useAuth } from "../../components/authContext";
import { useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import Notification from '../../components/notification';


function HomePage() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const {data: postPages, fetchNextPage, hasNextPage, isLoading} = useInfiniteQuery({
    queryKey: ['posts', accessToken],
    queryFn: ({ pageParam = 1 }) => getPost({ page: pageParam, limit: 10 }, accessToken!),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.isLastPage ? undefined : allPages.length + 1;
    },
    initialPageParam: 1,
    enabled: !!accessToken,
  });

  const posts = postPages ? postPages.pages.flatMap((page) => page.data) : [];

  const handlePostSubmit = async (formData: { title: string; content: string; mood: string; isAnonymous: boolean }) => {
    try {
      // console.log("Submitting custom payload to backend service architecture:", formData);

      queryClient.invalidateQueries({ queryKey: ['posts'] });

    } catch (error) {
      setNotification({
        show: true,
        message: 'Failed to create post.',
        type: 'error',
      });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center bg-[#0d0e15] min-h-screen text-zinc-400">Loading Dashboard...</div>;
  }

  return (
    <div className="flex md:grid md:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr_350px] bg-[#0d0e15] w-full min-h-screen overflow-hidden text-white">
      <NavBar 
        data={profiles?.[0] || null} 
        onShareMoodClick={() => setIsModalOpen(true)} 
      />
      
      <PostList 
        posts={posts} 
        fetchMorePosts={fetchNextPage} 
        hasMore={!!hasNextPage} 
      />
      
      <div className="hidden lg:block p-6 border-zinc-800 border-l">
        <h3 className="mb-4 font-bold text-zinc-400 text-xs uppercase tracking-wider">Trending Topics</h3>
        <div className="text-zinc-500 text-sm">No recent topics available.</div>
      </div>

      {/* 4. Instantiate the component node portal at the top level layout hierarchy */}
      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handlePostSubmit} 
      />
    </div>
  );
}

export default HomePage;