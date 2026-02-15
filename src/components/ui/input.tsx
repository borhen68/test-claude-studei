import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-12 w-full rounded-2xl border-2 px-4 py-3 text-base',
          'transition-all duration-200',
          'bg-white text-neutral-900 placeholder:text-neutral-400',
          'focus-visible:outline-none focus-visible:ring-4',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error
            ? 'border-red-500 focus-visible:border-red-600 focus-visible:ring-red-100'
            : 'border-neutral-300 focus-visible:border-violet-500 focus-visible:ring-violet-100',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
