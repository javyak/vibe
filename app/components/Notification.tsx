import React from 'react';

interface NotificationProps {
  message: string;
  color: "green" | "red";
  onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ message, color, onClose }) => {
  return (
    <div
      className={`
        fixed top-6 left-1/2 transform -translate-x-1/2 z-50
        flex items-center px-6 py-3 rounded-xl shadow-lg min-w-[340px] max-w-[90vw]
        ${color === "green" ? "bg-green-600" : "bg-red-600"}
      `}
      style={{ fontWeight: 600, fontSize: "1.15rem" }}
    >
      <span className="mr-3 flex items-center">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="12" fill="white" fillOpacity="0.15"/>
          <path d="M7 13l3 3 7-7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
      <span className="flex-1 text-white">{message}</span>
      <button
        className="ml-4 text-white text-2xl font-bold focus:outline-none"
        onClick={onClose}
        aria-label="Close notification"
        style={{ lineHeight: 1 }}
      >
        ×
      </button>
    </div>
  );
}; 