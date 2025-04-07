import { ReactNode } from 'react';
import clsx from 'clsx'; // Optional: Helps with conditional classes
import Title from './Title';

interface CardProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

const Card = ({ children, title, className = '' }: CardProps) => (
  <div
    className={clsx(
      'rounded-xl border border-gray-400/20 bg-white p-6 shadow-sm dark:bg-slate-900',
      className
    )}
  >
    {title && (
      <Title level={2} className="mb-4">
        {title}
      </Title>
    )}
    {children}
  </div>
);

export default Card;
