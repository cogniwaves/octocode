'use client';

import React from 'react';
import { cn } from '@/lib/utils/theme-utils';
import type { ButtonProps } from '@/lib/types/theme';
import styles from '@/styles/components/Button.module.css';

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'filled',
      size = 'medium',
      disabled = false,
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      type = 'button',
      onClick,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const buttonClasses = cn(
      styles.button,
      styles[variant],
      {
        [styles.small]: size === 'small',
        [styles.large]: size === 'large',
        [styles.iconLeading]: leftIcon && !loading,
        [styles.iconTrailing]: rightIcon && !loading,
        [styles.iconOnly]: !children && (leftIcon || rightIcon) && !loading,
        [styles.loading]: loading,
        [styles.fullWidth]: fullWidth,
      },
      className
    );

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;
      onClick?.(event);
    };

    const iconElement = loading ? (
      <div className={cn(styles.icon, 'md-loading-spinner')} aria-hidden="true">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="31.416"
            strokeDashoffset="31.416"
          >
            <animate
              attributeName="stroke-dasharray"
              dur="2s"
              values="0 31.416;15.708 15.708;0 31.416"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke-dashoffset"
              dur="2s"
              values="0;-15.708;-31.416"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>
    ) : null;

    return (
      <button
        ref={ref}
        type={type}
        className={buttonClasses}
        disabled={disabled || loading}
        onClick={handleClick}
        onFocus={onFocus}
        onBlur={onBlur}
        aria-disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <>
            {iconElement}
            {children && <span>{children}</span>}
          </>
        ) : (
          <>
            {leftIcon && (
              <span className={cn(styles.icon, styles.iconLeading)} aria-hidden="true">
                {leftIcon}
              </span>
            )}
            {children && <span>{children}</span>}
            {rightIcon && (
              <span className={cn(styles.icon, styles.iconTrailing)} aria-hidden="true">
                {rightIcon}
              </span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };