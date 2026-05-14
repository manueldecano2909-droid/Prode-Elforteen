'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/Navbar'
import type { Match } from '@/lib/types'

export default function AdminPage() {
  const router = useRouter()
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<number | null>(null)
  const [scores, setScores] = useState<Record<number, { home: string; away: string }>>({})
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      if (!profile?.is_admin) { router.push('/fixture'); return }

      const { data } = await supabase
        .from('matches')
        .select('*')
        .order('match_date')

      setMatches(data ?? [])
      const initialScores: Record<number, { home: string; away: string }> = {}
      for (const m of data ?? []) {
        initialScores[m.id] = {
          home: m.home_score?.toString() ?? '',
          away: m.away_score?.toString() ?? '',
        }
      }
      setScores(initialScores)
      setLoading(false)
    }
    load()
  }, [router])

  async function saveResult(match: Match) {
    const s = scores[match.id]
    const h = parseInt(s.home)
    const a = parseInt(s.away)
    if (isNaN(h) || isNaN(a) || h < 0 || a < 0) return

    setSaving(match.id)
    setMessage('')
    const supabase = createClient()

    // Actualizar el partido
    await supabase
      .from('matches')
      .update({ home_score: h, away_score: a, is_finished: true })
      .eq('id', match.id)

    // Calcular y actualizar puntos de todos los pronósticos de este partido
    const { data: preds } = await supabase
      .from('predictions')
      .select('id, home_score, away_score')
      .eq('match_id', match.id)

    if (preds) {
      for (const pred of preds) {
        let points = 0
        if (pred.home_score === h && pred.away_score === a) {
          points = 3
        } else if (
          (pred.home_score > pred.away_score && h > a) ||
          (pred.home_score === pred.away_score && h === a) ||
          (pred.home_score < pred.away_score && h < a)
        ) {
          points = 1
        }
        await supabase
          .from('predictions')
          .update({ points })
          .eq('id', pred.id)
      }
    }

    setMatches((prev) =>
      prev.map((m) => m.id === match.id ? { ...m, home_score: h, away_score: a, is_finished: true } : m)
    )
    setMessage(`✅ Resultado guardado: ${match.home_team} ${h}-${a} ${match.away_team}`)
    setSaving(null)
  }

  async function reopenMatch(matchId: number) {
    const supabase = createClient()
    await supabase
      .from('matches')
      .update({ home_score: null, away_score: null, is_finished: false })
      .eq('id', matchId)
    await supabase
      .from('predictions')
      .update({ points: null })
      .eq('match_id', matchId)

    setMatches((prev) =>
      prev.map((m) => m.id === matchId ? { ...m, home_score: null, away_score: null, is_finished: false } : m)
    )
    setMessage('Partido reabierto.')
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('es-AR', {
      weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400">Cargando...</div>
      </div>
    )
  }

  const upcoming = matches.filter((m) => !m.is_finished)
  const finished = matches.filter((m) => m.is_finished)

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-white mb-2">⚙️ Panel de Admin</h1>
        <p className="text-gray-500 text-sm mb-6">Cargá los resultados de los partidos para que se calculen los puntos.</p>

        {message && (
          <div className="mb-4 bg-green-950 border border-green-800 rounded-lg px-4 py-3 text-green-300 text-sm">
            {message}
          </div>
        )}

        {/* Partidos pendientes */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Pendientes de resultado ({upcoming.length})
          </h2>
          <div className="flex flex-col gap-2">
            {upcoming.map((match) => (
              <div key={match.id} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs text-gray-600 w-32 shrink-0">{formatDate(match.match_date)}</span>
                  <span className="text-sm font-medium text-white flex-1 min-w-32">
                    {match.home_team} vs {match.away_team}
                  </span>
                  {match.group_name && (
                    <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">G{match.group_name}</span>
                  )}
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number" min={0} max={99}
                      value={scores[match.id]?.home ?? ''}
                      onChange={(e) => setScores((s) => ({ ...s, [match.id]: { ...s[match.id], home: e.target.value } }))}
                      placeholder="0"
                      className="w-10 text-center bg-gray-800 border border-gray-700 rounded py-1 text-white font-bold text-sm focus:outline-none focus:border-green-500"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number" min={0} max={99}
                      value={scores[match.id]?.away ?? ''}
                      onChange={(e) => setScores((s) => ({ ...s, [match.id]: { ...s[match.id], away: e.target.value } }))}
                      placeholder="0"
                      className="w-10 text-center bg-gray-800 border border-gray-700 rounded py-1 text-white font-bold text-sm focus:outline-none focus:border-green-500"
                    />
                    <button
                      onClick={() => saveResult(match)}
                      disabled={saving === match.id}
                      className="px-3 py-1 bg-green-700 hover:bg-green-600 disabled:bg-gray-700 text-white text-xs font-semibold rounded transition-colors"
                    >
                      {saving === match.id ? '...' : 'Guardar'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {upcoming.length === 0 && (
              <p className="text-gray-600 text-sm">Todos los partidos tienen resultado cargado.</p>
            )}
          </div>
        </section>

        {/* Partidos finalizados */}
        <section>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Finalizados ({finished.length})
          </h2>
          <div className="flex flex-col gap-2">
            {finished.map((match) => (
              <div key={match.id} className="bg-gray-900 rounded-xl p-4 border border-gray-700 flex items-center gap-3 flex-wrap">
                <span className="text-xs text-gray-600 w-32 shrink-0">{formatDate(match.match_date)}</span>
                <span className="text-sm text-gray-400 flex-1 min-w-32">
                  {match.home_team} <span className="text-white font-bold">{match.home_score}-{match.away_score}</span> {match.away_team}
                </span>
                <button
                  onClick={() => reopenMatch(match.id)}
                  className="text-xs text-gray-600 hover:text-red-400 transition-colors"
                >
                  Corregir
                </button>
              </div>
            ))}
            {finished.length === 0 && (
              <p className="text-gray-600 text-sm">Todavía no hay partidos finalizados.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
