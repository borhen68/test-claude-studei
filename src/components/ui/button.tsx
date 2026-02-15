import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  magnetic?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', magnetic = false, children, ...props }, ref) => {
    const baseClasses = cn(
      'inline-flex items-center justify-center font-semibold',
      'transition-all duration-200 ease-out',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
      'relative overflow-hidden',
      {
        // Size variants
        'h-9 px-4 text-sm rounded-xl': size === 'sm',
        'h-11 px-6 text-base rounded-2xl': size === 'md',
        'h-14 px-8 text-lg rounded-2xl': size === 'lg',
        'h-16 px-10 text-xl rounded-3xl': size === 'xl',
        
        // Color variants - 2026 gradients & glassmorphism
        'bg-gradient-to-br from-violet-600 to-purple-700 text-white shadow-lg hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-1 focus-visible:ring-violet-500':
          variant === 'primary',
        'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-1 focus-visible:ring-amber-500':
          variant === 'accent',
        'bg-white/80 backdrop-blur-md border border-neutral-200 text-neutral-900 shadow-md hover:shadow-lg hover:bg-white hover:-translate-y-0.5 focus-visible:ring-neutral-400':
          variant === 'secondary',
        'border-2 border-violet-600 bg-transparent text-violet-600 hover:bg-violet-50 hover:border-violet-700 focus-visible:ring-violet-500':
          variant === 'outline',
        'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:ring-neutral-400':
          variant === 'ghost',
        'bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-lg hover:shadow-xl hover:shadow-red-500/30 hover:-translate-y-1 focus-visible:ring-red-500':
          variant === 'danger',
      },
      magnetic && 'hover:scale-105',
      className
    );

    if (magnetic && !props.disabled) {
      return (
        <motion.button
          ref={ref}
          className={baseClasses}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          {...props}
        >
          {children}
        </motion.button>
      );
    }

    return (
      <button
        className={baseClasses}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button };
