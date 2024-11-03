import React, { useEffect } from 'react';
import { LuCheck } from 'react-icons/lu';
import { MdDelete } from 'react-icons/md';

const Toast = ({ isShown, message, type, onClose }) => {
  useEffect(() => {
    if (isShown) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto-close after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isShown, onClose]);

  if (!isShown) return null;

  return (
    <div
      className="fixed top-10 right-5 flex items-center p-3 rounded shadow-lg text-black bg-white border-l-4 transition-transform transform-gpu z-[1000]"
      style={{
        borderColor: type === 'delete' ? '#e74c3c' : type === 'edit' ? '#f39c12' : '#2ecc71',
        transform: isShown ? 'translateX(0)' : 'translateX(100%)', // Slide-in effect
        position: 'fixed', // Ensure it's fixed at top-right
        top: '80px', // Explicitly position top
        right: '30px', // Explicitly position right
      }}
    >
      {type === 'delete' ? (
        <MdDelete
          className="text-2xl mr-3"
          style={{ color: '#e74c3c' }} // Inline style for red color on delete icon
        />
      ) : (
        <LuCheck
          className="text-2xl mr-3"
          style={{ color: type === 'edit' ? '#f39c12' : '#2ecc71' }}
        />
      )}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

export default Toast;
