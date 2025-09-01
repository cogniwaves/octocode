'use client';

import React from 'react';
import { cn } from '@/lib/utils/theme-utils';
import type { CardProps } from '@/lib/types/theme';
import styles from '@/styles/components/Card.module.css';

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      className,
      variant = 'elevated',
      size = 'medium',
      interactive = false,
      loading = false,
      header,
      media,
      actions,
      onClick,
      ...props
    },
    ref
  ) => {
    const cardClasses = cn(
      styles.card,
      styles[variant],
      {
        [styles.compact]: size === 'small',
        [styles.large]: size === 'large',
        [styles.interactive]: interactive,
        [styles.loading]: loading,
      },
      className
    );

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (interactive && onClick) {
        onClick(event);
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (interactive && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        onClick?.(event as any);
      }
    };

    return (
      <div
        ref={ref}
        className={cardClasses}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={interactive ? 0 : undefined}
        role={interactive ? 'button' : undefined}
        {...props}
      >
        {loading && <div className={styles.loadingSpinner} />}
        
        {header && (
          <div className={styles.header}>
            {header}
          </div>
        )}
        
        {media && (
          <div className={styles.media}>
            {React.isValidElement(media) && media.type === 'img' ? (
              React.cloneElement(media as React.ReactElement, {
                className: cn(styles.mediaImage, media.props.className),
              })
            ) : (
              media
            )}
          </div>
        )}
        
        {children && (
          <div className={styles.content}>
            {children}
          </div>
        )}
        
        {actions && (
          <div className={styles.actions}>
            {actions}
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card subcomponents
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(styles.header, className)} {...props} />
));

CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn(styles.title, className)} {...props} />
));

CardTitle.displayName = 'CardTitle';

const CardSubtitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn(styles.subtitle, className)} {...props} />
));

CardSubtitle.displayName = 'CardSubtitle';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(styles.content, className)} {...props} />
));

CardContent.displayName = 'CardContent';

const CardBody = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn(styles.body, className)} {...props} />
));

CardBody.displayName = 'CardBody';

const CardSupporting = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn(styles.supporting, className)} {...props} />
));

CardSupporting.displayName = 'CardSupporting';

const CardMedia = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(styles.media, className)} {...props} />
));

CardMedia.displayName = 'CardMedia';

const CardActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    alignment?: 'start' | 'center' | 'end' | 'between';
  }
>(({ className, alignment = 'start', ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(
      styles.actions, 
      {
        [styles.actionsCenter]: alignment === 'center',
        [styles.actionsEnd]: alignment === 'end',
        [styles.actionsBetween]: alignment === 'between',
      },
      className
    )} 
    {...props} 
  />
));

CardActions.displayName = 'CardActions';

const CardDivider = React.forwardRef<
  HTMLHRElement,
  React.HTMLAttributes<HTMLHRElement>
>(({ className, ...props }, ref) => (
  <hr ref={ref} className={cn(styles.divider, className)} {...props} />
));

CardDivider.displayName = 'CardDivider';

export { 
  Card,
  CardHeader,
  CardTitle,
  CardSubtitle,
  CardContent,
  CardBody,
  CardSupporting,
  CardMedia,
  CardActions,
  CardDivider,
};

export type { CardProps };