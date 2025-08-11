"use client"
import Image from "next/image"

export default function PlayerCard5({
  gamertag,
  role,
  avatarUrl,
}: {
  gamertag: string
  role?: string | null
  avatarUrl?: string | null
}) {
  return (
    <div className="rounded-3xl border border-custom-gray-200 bg-white px-4 py-4 dark:border-custom-gray-600 dark:bg-custom-gray-800">
      <div className="flex items-center gap-3">
        {avatarUrl ? (
          <Image src={avatarUrl} alt={gamertag} width={56} height={56} className="rounded-full border border-border object-cover" />
        ) : (
          <div className="h-14 w-14 rounded-full border border-border bg-muted" />
        )}
        <div>
          <div className="text-base font-semibold leading-tight">{gamertag}</div>
          <div className="text-xs text-muted-foreground">{role || "—"}</div>
        </div>
      </div>
    </div>
  )
}


