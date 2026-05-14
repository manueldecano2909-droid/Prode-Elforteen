'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/Navbar'
import MatchCard from '@/components/MatchCard'
import type { Match, Prediction, Stage } from '@/lib/types'
import { STAGE_LABELS } from '@/lib/types'

const STAGE_ORDER: Stage[] = [
  'group', 'round_of_32', 'round_of_16', 'quarterfinal', 'semifinal', 'third_place', 'final',
]

export default function FixturePage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [matches, setMatches] = useState<Match[]>([])
  const [predictions, setPredictions] = useState<Record<number, Prediction>>({})
  const [loading, setLoading] = useState(true)
  const [activeGroup, setActiveGroup] = useState<string | null>(null)
  const [activeStage, setActiveStage] = useState<Stage>('group')

  const loadData = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    setUserId(user.id)

    const [{ data: matchesData }, { data: predsData }] = await Promise.all([
      supabase.from('matches').select('*').order('match_date'),
      supabase.from('predictions').select('*').eq('user_id', user.id),
    ])

    setMatches(matchesData ?? [])

    const predsMap: Record<number, Prediction> = {}
    for (const p of predsData ?? []) predsMap[p.match_id] = p
    setPredictions(predsMap)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Stages that have matches
  const availableStages = STAGE_ORDER.filter((s) => matches.some((m) => m.stage === s))

  // Groups within current stage
  const groups = activeStage === 'group'
    ? [...new Set(matches.filter((m) => m.stage === 'group').map((m) => m.group_name))].sort() as string[]
    : []

  const displayGroup = activeStage === 'group' ? (activeGroup ?? groups[0] ?? null) : null

  const filteredMatches = activeStage === 'group'
    ? matches.filter((m) => m.stage === 'group' && m.group_name === displayGroup)
    : matches.filter((m) => m.stage === activeStage)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400">Cargando fixture...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-white mb-4">⚽ Fixture Mundial 2026</h1>

        {/* Tabs de etapa */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {availableStages.map((stage) => (
            <button
              key={stage}
              onClick={() => { setActiveStage(stage); setActiveGroup(null) }}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeStage === stage
                  ? 'bg-green-700 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {STAGE_LABELS[stage]}
            </button>
          ))}
        </div>

        {/* Sub-tabs de grupo */}
        {activeStage === 'group' && groups.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
            {groups.map((g) => (
              <button
                key={g}
                onClick={() => setActiveGroup(g)}
                className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${
                  (displayGroup === g)
                    ? 'bg-yellow-500 text-gray-950'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        )}

        {/* Partidos */}
        <div className="flex flex-col gap-3">
          {filteredMatches.length === 0 ? (
            <div className="text-center text-gray-600 py-12">No hay partidos para mostrar</div>
          ) : (
            filteredMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                prediction={predictions[match.id] ?? null}
                userId={userId!}
                onSaved={loadData}
              />
            ))
          )}
        </div>

        <p className="text-center text-xs text-gray-700 mt-8">
          +3 resultado exacto · +1 ganador o empate correcto · +0 fallo
        </p>
      </main>
    </div>
  )
}
