"use client"
// Adapter that maps our Button API to Material Tailwind under the hood.
import * as React from 'react'
import { Button as MTButton, type ButtonProps as MTButtonProps } from '@material-tailwind/react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}

const variantMap: Record<NonNullable<ButtonProps['variant']>, MTButtonProps['variant'] | undefined> = {
  default: 'filled',
  secondary: 'filled',
  outline: 'outlined',
  ghost: 'text',
  link: 'text',
}

const sizeMap: Record<NonNullable<ButtonProps['size']>, MTButtonProps['size'] | undefined> = {
  default: 'md',
  sm: 'sm',
  lg: 'lg',
  icon: 'sm',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', children, ...rest }, ref) => {
    // color is driven by ThemeProvider defaults; allow override via rest
    return (
      <MTButton
        {...(rest as any)}
        ref={ref as any}
        variant={variantMap[variant]}
        size={sizeMap[size]}
        className={`rounded-2xl ${className ?? ''}`}
      >
        {children}
      </MTButton>
    )
  },
)
Button.displayName = 'Button'

export { Button as default }


