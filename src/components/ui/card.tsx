"use client"
import * as React from 'react'
import { Card as MTCard, type CardProps as MTCardProps, CardBody as MTCardBody, type CardBodyProps as MTCardBodyProps, CardHeader as MTCardHeader } from '@material-tailwind/react'
import { cn } from '@/lib/utils'

export function Card({ className, ...props }: MTCardProps) {
  return <MTCard {...(props as any)} className={cn('rounded-2xl border border-border ring-1 ring-transparent dark:ring-white/10 bg-card text-foreground', className)} />
}

export function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <MTCardHeader {...props as any} className={cn('mb-2 bg-transparent shadow-none rounded-2xl p-4', className)} />
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-lg font-semibold', className)} {...props} />
}

export function CardContent({ className, ...props }: MTCardBodyProps) {
  return <MTCardBody {...(props as any)} className={cn('text-sm p-4', className)} />
}


