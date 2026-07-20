import { Trash, Pen, Check, X } from 'lucide-react';
import React, { useState } from 'react';

interface Author {
  firstName?: string;
  lastName?: string;
  year?: string;
}

interface Post {
  postId: string;
  postTitle: string;
  postContent: string;
  postMood: string;
  major?: string;
  faculty?: string;
  author?: Author;
}

interface PostCardProps {
  post: Post;
  index: number;
  enableEdit?: boolean;
  enableDelete?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onShowNotification?: (config: { show: boolean; message: string; type: 'success' | 'error' }) => void;
}

export default function PostCard({
  post,
  enableEdit,
  enableDelete,
  onEdit,
  onDelete
}: PostCardProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleDeleteClick = () => {
    setIsConfirmingDelete(true);
  };

  const handleCancelDelete = () => {
    setIsConfirmingDelete(false);
  };

  const handleConfirmDelete = () => {
    onDelete?.(post.postId);
    setIsConfirmingDelete(false);
  };

  return (
    <div className="flex flex-col gap-3 bg-[#161722] shadow-lg p-4 md:p-5 border border-zinc-800 hover:border-zinc-700 rounded-xl w-full transition-colors">
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1">
          <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-2 sm:gap-4">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <div className="flex flex-row gap-1 max-w-[180px] sm:max-w-none font-semibold text-zinc-200 text-sm truncate">
                <div>{post.author?.firstName || "Anonymous"}</div>
                <div>{post.author?.lastName || "User"}</div>
              </div>
              <div className="text-zinc-500 text-xs shrink-0">
                (Year {post.author?.year || "?"} -{" "}
                {post.faculty ? post.faculty.toUpperCase() : "ERROR"}{" "}
                {post.major ? post.major.toUpperCase() : "ERROR"})
              </div>
            </div>

            <span className="self-start sm:self-auto bg-zinc-800 px-2 py-0.5 rounded font-semibold text-white text-xs shrink-0">
              {post.postMood}
            </span>
          </div>
        </div>

        {(enableEdit || enableDelete) && (
          <div className="flex items-center gap-2">
            {isConfirmingDelete ? (
              <div className="flex items-center gap-1 bg-red-950/20 p-1 border border-red-900/40 rounded-md transition-all">
                <span className="px-1.5 font-medium text-red-400 text-xs select-none">Confirm?</span>
                <button
                  onClick={handleConfirmDelete}
                  className="bg-red-900 hover:bg-red-800 p-1 rounded text-white transition-colors"
                  title="Confirm Delete"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleCancelDelete}
                  className="bg-zinc-800 hover:bg-zinc-700 p-1 rounded text-zinc-400 hover:text-white transition-colors"
                  title="Cancel"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <>
                {enableEdit && (
                  <button
                    onClick={() => onEdit?.(post.postId)}
                    className="bg-zinc-800 hover:bg-zinc-700 p-1.5 rounded-md text-zinc-400 hover:text-white transition-colors"
                    title="Edit"
                  >
                    <Pen className="w-4 h-4" />
                  </button>
                )}

                {enableDelete && (
                  <button
                    onClick={handleDeleteClick}
                    className="bg-red-950/40 hover:bg-red-900/60 p-1.5 border border-red-900/50 rounded-md text-red-400 hover:text-red-300 transition-colors"
                    title="Delete"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="font-bold text-white text-base md:text-lg break-words">
          {post.postTitle}
        </h3>
        <p className="text-zinc-400 text-sm break-words leading-relaxed whitespace-pre-line">
          {post.postContent}
        </p>
      </div>
    </div>
  );
}