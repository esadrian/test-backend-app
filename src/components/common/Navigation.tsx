import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();

  const links = [
    { path: '/', label: 'Name Analysis' },
    { path: '/covid', label: 'COVID Stats' },
  ];

  return (
    <nav className="flex justify-center gap-4">
      <ul className="text-right">
        {links.map((link) => (
          <li key={link.label} className="my-2 inline-block">
            <Link
              to={link.path}
              className={`rounded-md px-4 py-2 text-center text-base font-medium ${
                location.pathname === link.path
                  ? 'bg-slate-100 text-green-600 dark:bg-slate-800 dark:text-green-400'
                  : 'text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
