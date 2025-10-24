import { type ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export const PageContainer = ({ children, className = '' }: PageContainerProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className={`flex-1 ${className}`}>
        {children}
      </div>
    </div>
  );
};