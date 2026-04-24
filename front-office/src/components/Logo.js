import React from 'react';

export default function Logo({ size = 40, className = '', withText = true, textClassName = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="atikoLogoGradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38BDF8" />
            <stop offset="1" stopColor="#0284C7" />
          </linearGradient>
          <linearGradient id="atikoLogoAccent" x1="12" y1="10" x2="36" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#E0F2FE" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="48" height="48" rx="12" fill="url(#atikoLogoGradient)" />
        <path
          d="M24 10 L36 36 L30 36 L27.6 30 L20.4 30 L18 36 L12 36 Z M22.2 25.5 L25.8 25.5 L24 21 Z"
          fill="url(#atikoLogoAccent)"
        />
        <circle cx="24" cy="40" r="2" fill="#FB923C" />
      </svg>
      {withText && (
        <span
          className={`text-xl sm:text-2xl font-bold text-gray-800 tracking-tight ${textClassName}`}
          style={{ fontFamily: 'Work Sans' }}
        >
          Atiko
        </span>
      )}
    </div>
  );
}
