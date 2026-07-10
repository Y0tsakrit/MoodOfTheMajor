import React, { useEffect } from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export default function Notification({ message, type, onClose, duration = 3000 }: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const isSuccess = type === 'success';

  return (
    <>
      <style>{`
        @keyframes fadeInDown {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-toast {
          animation: fadeInDown 0.2s ease-out forwards;
        }
      `}</style>

      <div className="top-5 right-5 z-50 fixed animate-toast">
        <div
          className={`flex items-center gap-3 shadow-lg border p-4 rounded-lg min-w-[300px] text-white transition-all transform ${
            isSuccess 
              ? 'bg-green-600 border-green-700' 
              : 'bg-red-600 border-red-700'
          }`}
        >
          <div className="font-bold text-xl">
            {isSuccess ? '✓' : '✕'}
          </div>
          <div className="flex-1 font-medium text-sm">
            {message}
          </div>
          <button
            onClick={onClose}
            className="hover:bg-black/10 p-1 rounded text-white/80 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </>
  );
}