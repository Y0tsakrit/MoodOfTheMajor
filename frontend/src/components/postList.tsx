import React from 'react';
import InfiniteScroll from "react-infinite-scroll-component";
import PostCard from './postCard';

interface PostListProps {
  posts: any[];
  fetchMorePosts: () => void;
  hasMore: boolean;
}

export default function PostList({ posts, fetchMorePosts, hasMore }: PostListProps) {
  return (
    <div 
      className="p-4 md:p-6 w-full h-[calc(100vh-80px)] md:h-screen overflow-y-auto" 
      id="scrollableDiv"
    >
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchMorePosts}
        hasMore={hasMore}
        loader={<h4 className="my-4 text-zinc-400 text-sm text-center animate-pulse">Loading posts...</h4>}
        endMessage={<p className="my-4 font-medium text-zinc-500 text-sm text-center">All caught up!</p>}
        scrollableTarget="scrollableDiv"
      >
        <div className="flex flex-col gap-4 mx-auto w-full max-w-2xl">
          {posts.map((post, index) => (
            <PostCard key={`${post.id || 'post'}-${index}`} post={post} index={index} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}