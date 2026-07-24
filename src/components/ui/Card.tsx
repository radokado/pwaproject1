import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 md:p-6 shadow-xl text-slate-100 ${
        hoverable ? 'hover:border-indigo-500/50 hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
