'use client';

import Link from 'next/link';
import { Utensils, ChefHat } from 'lucide-react';

interface BrandLogoProps {
  href?: string;
  badge?: string;
  subtitle?: string;
  icon?: 'utensils' | 'chef-hat';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function BrandLogo({
  href = '/',
  badge,
  subtitle,
  icon = 'utensils',
  size = 'md',
  className = '',
}: BrandLogoProps) {
  const IconComponent = icon === 'chef-hat' ? ChefHat : Utensils;

  const boxSizes = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-9 h-9 rounded-xl',
    lg: 'w-10 h-10 rounded-xl',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const content = (
    <div className={`flex items-center gap-2.5 group ${className}`}>
      <div
        className={`${boxSizes[size]} bg-linear-to-tr from-brand-600 to-amber-400 flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform duration-200 shrink-0`}
      >
        <IconComponent className={iconSizes[size]} />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-tight">
          <span className={`${textSizes[size]} font-extrabold tracking-tight text-white`}>
            Taste<span className="text-brand-500">Craft</span>
          </span>
          {badge && (
            <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-amber-400 font-semibold border border-amber-500/30">
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <span className="text-[10px] text-amber-400 font-bold tracking-wide uppercase leading-tight mt-0.5">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <Link href={href} className="inline-flex items-center focus:outline-none">
      {content}
    </Link>
  );
}
