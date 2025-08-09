import { getTeamProfile } from '@/lib/api/public'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export default async function TeamProfilePage({ params }: { params: { id: string } }) {
  const bundle = await getTeamProfile(params.id)
  if (!bundle.team) return <div>Team not found</div>
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <h1 className="text-2xl font-semibold">{bundle.team.name}</h1>
        <div className="text-xs text-muted-foreground">{bundle.team.conference}</div>
      </div>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-3">
          <div className="tile p-4">
            <div className="font-medium mb-2">Roster</div>
            <ul className="grid sm:grid-cols-2 gap-2">
              {bundle.players.map((p) => (
                <li key={p.id} className="text-sm text-muted-foreground">
                  {p.gamertag} {p.role ? `· ${p.role}` : ''}
                </li>
              ))}
            </ul>
          </div>
          <div className="tile p-4">
            <div className="font-medium mb-2">Recent Matches</div>
            <ul className="text-sm text-muted-foreground grid sm:grid-cols-2 gap-2">
              {bundle.matches.map((m) => (
                <li key={m.id}>Match {m.id} — {new Date(m.scheduled_at).toLocaleString()}</li>
              ))}
            </ul>
          </div>
        </TabsContent>
        <TabsContent value="stats">Stats coming soon.</TabsContent>
        <TabsContent value="media">Media coming soon.</TabsContent>
      </Tabs>
    </div>
  )
}


