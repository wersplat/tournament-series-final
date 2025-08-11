"use client"
import type { ReactNode, Dispatch, SetStateAction } from 'react'
import { createContext, useContext, useState } from 'react'
import { Tabs as MTabs, TabsHeader, TabsBody, Tab as MTTab, TabPanel } from '@material-tailwind/react'
import { cn } from '@/lib/utils'

type TabsContextValue = {
  value: string
  setValue: Dispatch<SetStateAction<string>>
}

const TabsCtx = createContext<TabsContextValue | null>(null)

export function Tabs({ defaultValue, children, className }: { defaultValue?: string; children: ReactNode; className?: string }) {
  const [value, setValue] = useState<string>(defaultValue ?? '')
  return (
    <TabsCtx.Provider value={{ value, setValue }}>
      <MTabs value={value} className={className}>{children}</MTabs>
    </TabsCtx.Provider>
  )
}

export function TabsList({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <TabsHeader {...({ className: cn('rounded-2xl bg-muted text-muted-foreground', className) } as any)}>
      {children}
    </TabsHeader>
  )
}

export function TabsTrigger({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
  const ctx = useContext(TabsCtx)
  if (!ctx) return null
  const active = ctx.value === value
  return (
    <MTTab
      {...({ value, onClick: () => ctx.setValue(value), className: cn('px-3 py-1.5 text-sm font-medium rounded-xl', active && 'bg-background text-foreground shadow', className) } as any)}
    >
      {children}
    </MTTab>
  )
}

export function TabsContent({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
  return (
    <TabsBody {...({} as any)}>
      <TabPanel {...({ value, className } as any)}>
        {children}
      </TabPanel>
    </TabsBody>
  )
}


