import * as React from 'react'
import { cn } from '@/lib/utils'

export function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return <table className={cn('w-full caption-bottom text-sm', className)} {...props} />
}
export function Thead(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead {...props} className={cn('text-muted-foreground', props.className)} />
}
export function Tbody(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props} className={cn('', props.className)} />
}
export function Tr(props: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr {...props} className={cn('border-b border-border hover:bg-muted/30', props.className)} />
}
export function Th(props: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th {...props} className={cn('h-10 px-2 text-left align-middle font-medium', props.className)} />
}
export function Td(props: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td {...props} className={cn('p-2 align-middle', props.className)} />
}


