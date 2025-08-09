import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

type Variant = 'info' | 'success' | 'warning' | 'danger'

const variantStyles: Record<Variant, string> = {
  info: 'border-sky-400/40 bg-sky-400/10 text-sky-100',
  success: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-100',
  warning: 'border-amber-400/40 bg-amber-400/10 text-amber-100',
  danger: 'border-rose-400/40 bg-rose-400/10 text-rose-100',
}

const icons: Record<Variant, React.ReactNode> = {
  info: <Info className="h-4 w-4" />,
  success: <CheckCircle2 className="h-4 w-4" />,
  warning: <TriangleAlert className="h-4 w-4" />,
  danger: <AlertCircle className="h-4 w-4" />,
}

export function Callout({ variant = 'info', children }: { variant?: Variant; children: React.ReactNode }) {
  return (
    <div className={cn('rounded-xl border p-3 text-sm flex items-start gap-2', variantStyles[variant])}>
      <div className="mt-0.5">{icons[variant]}</div>
      <div className="space-y-2 leading-relaxed">{children}</div>
    </div>
  )
}


