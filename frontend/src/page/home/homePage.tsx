import { useState } from 'react';
import NavBar from '../../components/navBar';
import PostList from '../../components/postList';
import { getProfile, getPost } from './action';
import { useAuth } from "../../components/authContext";
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import Notification from '../../components/notification';

function HomePage() {
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
  const [twentyFourHoursAgo] = useState(() => new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

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

  const { data: trendData } = useQuery({
    queryKey: ['posts', 'trending-24h', twentyFourHoursAgo, accessToken],
    queryFn: () => getPost({
      page: 1,
      limit: 100,
      fromDate: twentyFourHoursAgo,
    } as any, accessToken!),
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000, // Optional cache safety layer to block background refetches for 5 minutes
  });

  const posts = postPages ? postPages.pages.flatMap((page) => page.data) : [];
  const trendPosts = trendData?.data || [];

  const moodOptions = [
    { value: 'happy', label: 'Happy' },
    { value: 'sad', label: 'Sad' },
    { value: 'stressed', label: 'Stressed' },
    { value: 'chill', label: 'Chill' }
  ];

  const totalTrendCount = trendPosts.length || 1;
  const moodCounts = moodOptions.reduce((acc, mood) => {
    acc[mood.value] = trendPosts.filter((p: { postMood: string; }) => p.postMood?.toLowerCase() === mood.value).length;
    return acc;
  }, {} as Record<string, number>);

  if (isLoading) {
    return <div className="flex justify-center items-center bg-[#0d0e15] min-h-screen text-zinc-400">Loading Dashboard...</div>;
  }

  return (
    <div className="relative flex md:grid md:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr_350px] bg-[#0d0e15] w-full min-h-screen overflow-hidden text-white">
      {notification.show && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification((prev) => ({ ...prev, show: false }))}
        />
      )}
      
      <NavBar 
        data={profiles?.[0] || null} 
        onPostStatus={setNotification}
      />
      
      <div className="flex flex-col flex-1 w-full min-w-0 h-screen">

        <div className="p-4">
          <PostList 
            posts={posts} 
            fetchMorePosts={fetchNextPage} 
            hasMore={!!hasNextPage}
            enableEdit={false} 
            enableDelete={false} 
          />
        </div>
      </div>
      
      <div className="hidden lg:block p-6 border-zinc-800 border-l min-w-[350px]">
        <div className="mb-6">
          <h3 className="font-bold text-zinc-400 text-xs uppercase tracking-wider">Trending Moods</h3>
          <p className="mt-0.5 font-semibold text-[10px] text-zinc-600 uppercase tracking-wider">Past 24 Hours</p>
        </div>
        
        <div className="space-y-4">
          {moodOptions.map((mood) => {
            const count = moodCounts[mood.value] || 0;
            const percentage = Math.max(5, Math.min(100, (count / totalTrendCount) * 100));

            return (
              <div key={mood.value} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-zinc-300">{mood.label}</span>
                  <span className="font-semibold text-zinc-500 text-xs">{count} posts</span>
                </div>
                
                <div className="bg-[#12131a] rounded-full w-full h-3 overflow-hidden">
                  <div 
                    className="bg-zinc-400 rounded-full h-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default HomePage;