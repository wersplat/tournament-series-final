import { getStandings, getTeams } from '@/lib/api/public'
export const revalidate = 60
import { Table, Tbody, Thead, Tr, Th, Td } from '@/components/ui/table'

export default async function StandingsPage() {
  const [standings, teams] = await Promise.all([getStandings(), getTeams()])
  const teamName = Object.fromEntries(teams.map((t) => [t.id, t.name])) as Record<string, string>
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Standings</h1>
      {(['East', 'West'] as const).map((conf) => (
        <div key={conf} className="tile p-4">
          <h2 className="font-medium mb-2">{conf} Conference</h2>
          <Table>
            <Thead>
              <Tr>
                <Th>Team</Th>
                <Th>W</Th>
                <Th>L</Th>
                <Th>PD</Th>
              </Tr>
            </Thead>
            <Tbody>
              {standings
                .filter((s) => s.conference === conf)
                .sort((a, b) => b.w - a.w)
                .map((s) => (
                  <Tr key={s.id}>
                    <Td>{teamName[s.team_id]}</Td>
                    <Td>{s.w}</Td>
                    <Td>{s.l}</Td>
                    <Td>{s.pd ?? 0}</Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </div>
      ))}
    </div>
  )
}


