import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav
      aria-label="Fil d'Ariane"
      className="flex items-center flex-wrap gap-1 text-sm mb-4 text-gray-500"
      data-testid="breadcrumbs"
    >
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-[#0EA5E9] transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
        <span>Accueil</span>
      </Link>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
            {item.to && !isLast ? (
              <Link
                to={item.to}
                className="hover:text-[#0EA5E9] transition-colors truncate max-w-[200px]"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={`truncate max-w-[260px] ${
                  isLast ? 'text-gray-800 font-semibold' : ''
                }`}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
