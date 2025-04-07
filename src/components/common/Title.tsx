import React from 'react';
import clsx from 'clsx';

interface TitleProps {
  children: React.ReactNode;
  className?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

const Title = ({ children, className, level = 1 }: TitleProps) => {
  const baseStyles = 'font-bold text-gray-800 dark:text-gray-200 leading-tight';
  const levelStyles = {
    1: 'text-3xl',
    2: 'text-xl',
    3: 'text-xl',
    4: 'text-lg',
    5: 'text-base',
    6: 'text-sm',
  };

  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

  return React.createElement(
    HeadingTag,
    { className: clsx(baseStyles, levelStyles[level], className) },
    children
  );
};

export default Title;
