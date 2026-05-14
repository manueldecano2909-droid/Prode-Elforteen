'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/Navbar'
import { Avatar } from '@/components/UserMenu'
import type { LeaderboardEntry } from '@/lib/types'

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUserId(user?.id ?? null)

      // Obtener todos los pronósticos con resultados cargados
      const { data: predsData } = await supabase
        .from('predictions')
        .select('user_id, points, match_id')

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')

      if (!predsData || !profiles) { setLoading(false); return }

      const profileMap: Record<string, { username: string; avatar_url: string | null }> = {}
      for (const p of profiles) profileMap[p.id] = { username: p.username, avatar_url: p.avatar_url }

      const statsMap: Record<string, { total: number; exact: number; correct: number; total_preds: number }> = {}

      for (const pred of predsData) {
        if (!statsMap[pred.user_id]) {
          statsMap[pred.user_id] = { total: 0, exact: 0, correct: 0, total_preds: 0 }
        }
        statsMap[pred.user_id].total_preds++
        if (pred.points !== null) {
          statsMap[pred.user_id].total += pred.points
          if (pred.points === 3) statsMap[pred.user_id].exact++
          if (pred.points === 1) statsMap[pred.user_id].correct++
        }
      }

      // Incluir usuarios sin pronósticos también
      for (const p of profiles) {
        if (!statsMap[p.id]) statsMap[p.id] = { total: 0, exact: 0, correct: 0, total_preds: 0 }
      }

      const leaderboard: LeaderboardEntry[] = Object.entries(statsMap).map(([uid, stats]) => ({
        user_id: uid,
        username: profileMap[uid]?.username ?? 'Desconocido',
        avatar_url: profileMap[uid]?.avatar_url ?? null,
        total_points: stats.total,
        exact_results: stats.exact,
        correct_outcomes: stats.correct,
        total_predictions: stats.total_preds,
      }))

      leaderboard.sort((a, b) => b.total_points - a.total_points || b.exact_results - a.exact_results)

      setEntries(leaderboard)
      setLoading(false)
    }

    load()
  }, [])

  const medalEmoji = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `${rank}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400">Cargando tabla...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-white mb-6">🏆 Tabla de Posiciones</h1>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-800">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-5">Jugador</div>
            <div className="col-span-2 text-center">Pts</div>
            <div className="col-span-2 text-center">🎯</div>
            <div className="col-span-2 text-center">✅</div>
          </div>

          {entries.length === 0 ? (
            <div className="text-center text-gray-600 py-12">
              Todavía no hay pronósticos cargados
            </div>
          ) : (
            entries.map((entry, idx) => {
              const rank = idx + 1
              const isMe = entry.user_id === currentUserId
              return (
                <div
                  key={entry.user_id}
                  className={`grid grid-cols-12 gap-2 px-4 py-3.5 border-b border-gray-800 last:border-0 transition-colors ${
                    isMe ? 'bg-green-950/40' : 'hover:bg-gray-800/30'
                  }`}
                >
                  <div className="col-span-1 text-center font-bold text-sm">
                    {medalEmoji(rank)}
                  </div>
                  <div className="col-span-5 flex items-center gap-2">
                    <Avatar url={entry.avatar_url} username={entry.username} small />
                    <span className={`font-medium text-sm ${isMe ? 'text-green-400' : 'text-white'}`}>
                      {entry.username}
                    </span>
                    {isMe && (
                      <span className="text-xs bg-green-800 text-green-300 px-1.5 py-0.5 rounded">vos</span>
                    )}
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="text-lg font-bold text-white">{entry.total_points}</span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="text-sm text-green-400">{entry.exact_results}</span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="text-sm text-yellow-500">{entry.correct_outcomes}</span>
                  </div>
                </div>
              )
            })
          )}
        </div>

        <div className="mt-4 flex gap-4 text-xs text-gray-600 justify-center">
          <span>Pts = Puntos totales</span>
          <span>🎯 = Exactos (+3)</span>
          <span>✅ = Ganador correcto (+1)</span>
        </div>
      </main>
    </div>
  )
}
