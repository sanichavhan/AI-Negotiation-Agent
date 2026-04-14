import React from 'react';

/**
 * Button — Astral Architect unified button
 *
 * Props:
 *   variant  : 'primary' | 'ghost' | 'violet-outline' | 'danger' | 'success'
 *   size     : 'sm' | 'md' | 'lg'
 *   loading  : bool — shows spinner, disables interaction
 *   icon     : ReactNode — optional leading icon
 *   iconRight: ReactNode — optional trailing icon
 *   fullWidth: bool — expand to container width
 *   as       : 'button' | 'a' | any — polymorphic element type
 *
 * Usage:
 *   <Button variant="primary" onClick={...}>Start Negotiating</Button>
 *   <Button variant="ghost" size="sm" loading>Loading...</Button>
 *   <Button variant="danger" icon={<TrashIcon />}>Delete</Button>
 */
const Button = ({
  children,
  variant   = 'primary',
  size      = 'md',
  loading   = false,
  icon      = null,
  iconRight = null,
  fullWidth = false,
  disabled  = false,
  className = '',
  as: Tag   = 'button',
  type      = 'button',
  ...rest
}) => {
  // ── Variant class mapping ────────────────────────────────────
  const variantClass = {
    'primary':       'btn-primary',
    'ghost':         'btn-ghost',
    'violet-outline':'btn-violet-outline',
    'danger':        'btn-danger',
    'success':       'btn-success',
  }[variant] ?? 'btn-primary';

  // ── Size overrides ───────────────────────────────────────────
  const sizeClass = {
    sm: 'px-4 py-2 text-sm rounded-md gap-1.5',
    md: '',   // base styles from CSS class
    lg: 'px-8 py-4 text-lg rounded-xl gap-3',
  }[size] ?? '';

  const widthClass = fullWidth ? 'w-full justify-center' : '';

  const isDisabled = disabled || loading;

  return (
    <Tag
      type={Tag === 'button' ? type : undefined}
      disabled={Tag === 'button' ? isDisabled : undefined}
      aria-disabled={isDisabled}
      className={`${variantClass} ${sizeClass} ${widthClass} ${className}
                  ${isDisabled ? 'opacity-50 cursor-not-allowed !transform-none !shadow-none' : ''}`}
      {...rest}
    >
      {/* Leading icon */}
      {!loading && icon && (
        <span className="shrink-0" aria-hidden="true">{icon}</span>
      )}

      {/* Loading spinner */}
      {loading && (
        <span
          className="spinner-sm shrink-0"
          style={{ borderTopColor: 'currentColor' }}
          aria-hidden="true"
        />
      )}

      {/* Label */}
      <span>{children}</span>

      {/* Trailing icon */}
      {!loading && iconRight && (
        <span className="shrink-0" aria-hidden="true">{iconRight}</span>
      )}
    </Tag>
  );
};

export default Button;
