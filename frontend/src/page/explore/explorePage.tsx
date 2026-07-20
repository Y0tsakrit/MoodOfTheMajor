import { useState } from 'react';
import { useAuth } from "../../components/authContext";
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { getProfile, getPost } from './actions'; 
import NavBar from '../../components/navBar';
import PostList from '../../components/postList';
import Notification from '../../components/notification';

function ExplorePage() {
    const { accessToken } = useAuth();

    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedMood, setSelectedMood] = useState('');

    const [notification, setNotification] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({
        show: false,
        message: '',
        type: 'success',
    });

    const { data: profile } = useQuery({
        queryKey: ['profile', accessToken], 
        queryFn: () => getProfile({}, accessToken!),
        enabled: !!accessToken,
    });

    const { data: postPages, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
        queryKey: ['posts', 'explore', searchKeyword, selectedMood, accessToken],
        queryFn: ({ pageParam = 1 }) => {
            return getPost({ 
                page: pageParam, 
                limit: 10,
                title: undefined,
                content: searchKeyword || undefined,
                mood: selectedMood || undefined
            }, accessToken!);
        },
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.isLastPage ? undefined : allPages.length + 1;
        },
        initialPageParam: 1,
        enabled: !!accessToken,
    });

    const posts = postPages ? postPages.pages.flatMap((page) => page.data) : [];

    const moodOptions = [
        { value: 'happy', label: 'Happy' },
        { value: 'sad', label: 'Sad' },
        { value: 'stressed', label: 'Stressed' },
        { value: 'chill', label: 'Chill' }
    ];

    const handleMoodSelect = (moodValue: string) => {
        if (selectedMood === moodValue) {
            setSelectedMood('');
        } else {
            setSelectedMood(moodValue);
        }
    };

    return (
        <div className="relative flex md:grid md:grid-cols-[auto_1fr] bg-[#0d0e15] w-full min-h-screen overflow-hidden text-white">
            
            {notification.show && (
                <div className="top-4 right-4 z-50 absolute min-w-[300px]">
                    <Notification 
                        message={notification.message} 
                        type={notification.type} 
                        onClose={() => setNotification((prev) => ({ ...prev, show: false }))}
                    />
                </div>
            )}

            <NavBar 
                data={profile?.[0] || null} 
                onPostStatus={setNotification}
            />
            
            <div className="flex flex-col w-full h-screen overflow-y-auto">
                <div className="top-0 z-10 sticky space-y-4 bg-[#0d0e15] p-6 border-zinc-900 border-b">
                    <h1 className="font-bold text-2xl">Explore Moods</h1>
                    
                    <div className="flex flex-col gap-4">
                        <div className="w-full">
                            <input
                                type="text"
                                placeholder="Search keywords in content..."
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                className="bg-[#1a1c26] p-2 border border-[#2d3142] focus:border-blue-500 rounded focus:outline-none w-full h-[38px] text-white text-sm placeholder-zinc-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <span className="block font-bold text-zinc-500 text-xs uppercase tracking-wider">Select Current Mood</span>
                            <div className="flex flex-wrap gap-2">
                                {moodOptions.map((mood) => {
                                    const isSelected = selectedMood === mood.value;
                                    return (
                                        <button
                                            key={mood.value}
                                            type="button"
                                            onClick={() => handleMoodSelect(mood.value)}
                                            className={`px-6 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 min-w-[100px] text-center ${
                                                isSelected 
                                                    ? 'bg-transparent border-zinc-400 text-white shadow-md' 
                                                    : 'bg-[#12131a] border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-[#1a1c26]'
                                            }`}
                                        >
                                            {mood.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 p-4">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-10 text-zinc-400">Loading Feed...</div>
                    ) : (
                        <PostList 
                            posts={posts} 
                            fetchMorePosts={fetchNextPage} 
                            hasMore={!!hasNextPage}
                            enableEdit={false} 
                            enableDelete={false} 
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default ExplorePage;