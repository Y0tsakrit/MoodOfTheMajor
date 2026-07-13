import React from 'react';

interface Author {
  firstName?: string;
  lastName?: string;
  year?: string;
}

interface Post {
  id: string;
  postTitle: string;
  postContent: string;
  postMood: string;
  major?: string;
  author?: Author;
}

interface PostCardProps {
  post: Post;
  index: number;
}

export default function PostCard({ post, index }: PostCardProps) {
  return (
    <div 
      className="flex flex-col gap-3 bg-[#161722] shadow-lg p-4 md:p-5 border border-zinc-800 hover:border-zinc-700 rounded-xl w-full transition-colors"
    >
      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-2 sm:gap-4">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="max-w-[180px] sm:max-w-none font-semibold text-zinc-200 text-sm truncate">
            {post.author?.firstName || "Anonymous"} {post.author?.lastName || "User"}
          </span>
          <span className="text-zinc-500 text-xs shrink-0">
            (Year {post.author?.year || "?"} - {post.major ? post.major.toUpperCase() : "GENERAL"})
          </span>
        </div>
        <span className="self-start sm:self-auto bg-zinc-800 px-2 py-0.5 rounded font-semibold text-white text-xs shrink-0">
          {post.postMood}
        </span>
      </div>

      <div className="flex flex-col gap-1 w-full">
        <h3 className="font-bold text-white text-base md:text-lg break-words">{post.postTitle}</h3>
        <p className="text-zinc-400 text-sm break-words leading-relaxed whitespace-pre-line">{post.postContent}</p>
      </div>
    </div>
  );
}