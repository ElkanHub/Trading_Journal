'use client';

import React, { MouseEvent } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const rippleButtonVariants = cva(
  'relative overflow-hidden transition-all duration-300 ease-in-out',
  {
    variants: {
      variant: {
        default:
          'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg hover:shadow-emerald-500/50',
        secondary:
          'bg-slate-700 hover:bg-slate-600 text-white shadow-lg hover:shadow-slate-600/50',
      },
      size: {
        default: 'px-8 py-4 rounded-lg text-lg font-semibold',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface RippleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof rippleButtonVariants> {}

const RippleButton = React.forwardRef<HTMLButtonElement, RippleButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    const createRipple = (event: MouseEvent<HTMLButtonElement>) => {
      const button = event.currentTarget;
      const circle = document.createElement('span');
      const diameter = Math.max(button.clientWidth, button.clientHeight);
      const radius = diameter / 2;

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
      circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
      circle.classList.add('ripple');

      const ripple = button.getElementsByClassName('ripple')[0];

      if (ripple) {
        ripple.remove();
      }

      button.appendChild(circle);
    };

    return (
      <button
        className={cn(rippleButtonVariants({ variant, size, className }))}
        ref={ref}
        onClick={(e) => {
          createRipple(e);
          props.onClick?.(e);
        }}
        {...props}
      />
    );
  }
);
RippleButton.displayName = 'RippleButton';

export { RippleButton, rippleButtonVariants };
