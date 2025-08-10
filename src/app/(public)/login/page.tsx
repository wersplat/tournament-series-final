import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createServerSupabase } from '@/lib/supabase/server'
import { getUserRole } from '@/lib/auth'

type SearchParams = Promise<{ next?: string }>

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const supabase = createServerSupabase()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (session) {
    const role = await getUserRole()
    const sp = await searchParams
    const nextParam = (sp.next && sp.next.startsWith('/')) ? sp.next : '/'
    if (role === 'admin' || role === 'league_staff') {
      // Admins can go wherever they intended, defaulting to /admin
      redirect(nextParam || '/admin')
    }
    // Non-admins should never be redirected back to /admin
    const safeNext = nextParam.startsWith('/admin') ? '/' : nextParam
    redirect(safeNext)
  }
  return (
    <div className="max-w-md mx-auto tile p-6">
      <h1 className="text-xl font-semibold mb-4">Sign in</h1>
      <form className="space-y-3" action="/auth/signin/password" method="post">
        <Input name="email" type="email" placeholder="you@example.com" required />
        <Input name="password" type="password" placeholder="Your password" required />
        <Button type="submit" className="w-full">Sign in</Button>
      </form>
      <div className="h-px bg-border my-4" />
      <form className="space-y-3" action="/auth/signin/email" method="post">
        <Input name="email" type="email" placeholder="you@example.com" required />
        <Button type="submit" variant="outline" className="w-full">Send magic link</Button>
      </form>
      <div className="h-px bg-border my-4" />
      <div className="grid gap-2">
        <form action="/auth/signin/oauth" method="post"><input type="hidden" name="provider" value="google" /><Button className="w-full" type="submit" variant="outline">Continue with Google</Button></form>
        <form action="/auth/signin/oauth" method="post"><input type="hidden" name="provider" value="discord" /><Button className="w-full" type="submit" variant="outline">Continue with Discord</Button></form>
        <form action="/auth/signin/oauth" method="post"><input type="hidden" name="provider" value="twitter" /><Button className="w-full" type="submit" variant="outline">Continue with X / Twitter</Button></form>
      </div>
    </div>
  )
}


