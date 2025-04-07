import { ReactNode } from 'react';
import clsx from 'clsx'; // Optional: Helps with conditional classes

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

const Container = ({ children, className = '' }: ContainerProps) => (
  <div className={clsx('mx-auto flex max-w-6xl px-6', className)}>
    {children}
  </div>
);

export default Container;
