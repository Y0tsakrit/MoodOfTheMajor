import InfiniteScroll from "react-infinite-scroll-component";
import PostCard from './postCard';

interface PostListProps {
  posts: any[];
  fetchMorePosts: () => void;
  hasMore: boolean;
  enableEdit?: boolean;
  enableDelete?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function PostList({ 
  posts, 
  fetchMorePosts, 
  hasMore, 
  enableEdit, 
  enableDelete, 
  onEdit, 
  onDelete 
}: PostListProps) {
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
            <PostCard 
              key={`${post.postId || 'post'}-${index}`} 
              post={post} 
              index={index} 
              enableEdit={enableEdit}
              enableDelete={enableDelete}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}