import Image from 'next/image'
import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { approveSubmission, getSubmission, rejectSubmission } from '@/lib/api/admin'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

type Params = Promise<{ id: string }>

export default async function ReviewItemPage(
  { params }: { params: Params }
) {
  const resolvedParams = await params
  const can = await requireAdmin()
  if (!can.ok) return null
  const sub = await getSubmission(resolvedParams.id)
  if (!sub) notFound()
  async function approve() {
    'use server'
    await approveSubmission(resolvedParams.id)
  }
  async function reject(formData: FormData) {
    'use server'
    const reason = String(formData.get('reason') || '')
    await rejectSubmission(resolvedParams.id, reason)
  }
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Submission {sub.id}</h1>
      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <CardContent>
            <div className="font-medium mb-2">Images</div>
            <div className="grid grid-cols-2 gap-2">
              {sub.images.map((src, i) => (
                <Image key={i} src={src} alt="evidence" width={640} height={360} className="rounded-lg border border-border object-cover w-full h-auto" />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="font-medium mb-2">OCR JSON</div>
            <pre className="text-xs whitespace-pre-wrap text-muted-foreground">{JSON.stringify(sub.ocr_json, null, 2)}</pre>
          </CardContent>
        </Card>
      </div>
      <div className="flex gap-2">
        <form action={approve}><Button type="submit">Approve</Button></form>
        <form action={reject} className="flex gap-2">
          <input name="reason" placeholder="Reason" className="px-2 py-1 rounded-md bg-background border border-input text-sm" />
          <Button type="submit" variant="outline">Reject</Button>
        </form>
      </div>
    </div>
  )
}


