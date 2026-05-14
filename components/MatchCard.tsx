'use client'

import { useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Match, Prediction } from '@/lib/types'

const FLAGS: Record<string, string> = {
  'México': 'mx', 'Sudáfrica': 'za', 'Corea del Sur': 'kr', 'Chequia': 'cz',
  'Canadá': 'ca', 'Suiza': 'ch', 'Qatar': 'qa', 'Bosnia y Herzegovina': 'ba',
  'Brasil': 'br', 'Marruecos': 'ma', 'Haití': 'ht', 'Escocia': 'gb-sct',
  'Estados Unidos': 'us', 'Paraguay': 'py', 'Australia': 'au', 'Turquía': 'tr',
  'Alemania': 'de', 'Curazao': 'cw', 'Costa de Marfil': 'ci', 'Ecuador': 'ec',
  'Países Bajos': 'nl', 'Japón': 'jp', 'Túnez': 'tn', 'Suecia': 'se',
  'Bélgica': 'be', 'Egipto': 'eg', 'Irán': 'ir', 'Nueva Zelanda': 'nz',
  'España': 'es', 'Cabo Verde': 'cv', 'Arabia Saudita': 'sa', 'Uruguay': 'uy',
  'Francia': 'fr', 'Senegal': 'sn', 'Noruega': 'no', 'Irak': 'iq',
  'Argentina': 'ar', 'Argelia': 'dz', 'Austria': 'at', 'Jordania': 'jo',
  'Portugal': 'pt', 'Uzbekistán': 'uz', 'Colombia': 'co', 'Congo DR': 'cd',
  'Inglaterra': 'gb-eng', 'Croacia': 'hr', 'Ghana': 'gh', 'Panamá': 'pa',
}

function Flag({ team }: { team: string }) {
  const code = FLAGS[team]
  if (!code) return null
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      alt={team}
      className="w-8 h-6 object-cover rounded-sm mx-auto"
    />
  )
}

interface Props {
  match: Match
  prediction: Prediction | null
  userId: string
  onSaved: () => void
}

function pointsBadge(points: number | null) {
  if (points === null) return null
  const color = points === 3 ? 'bg-green-600' : points === 1 ? 'bg-yellow-500' : 'bg-red-600'
  const label = points === 3 ? '+3 Exacto' : points === 1 ? '+1 Ganador' : '+0 Falló'
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${color}`}>
      {label}
    </span>
  )
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('es-AR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function MatchCard({ match, prediction, userId, onSaved }: Props) {
  const isLocked = new Date(match.match_date) <= new Date()
  const [home, setHome] = useState(prediction?.home_score?.toString() ?? '')
  const [away, setAway] = useState(prediction?.away_score?.toString() ?? '')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  async function handleSave() {
    const h = parseInt(home)
    const a = parseInt(away)
    if (isNaN(h) || isNaN(a) || h < 0 || a < 0) {
      setError('Ingresá números válidos (0 o más)')
      return
    }
    setError('')

    const supabase = createClient()
    const { error: err } = await supabase.from('predictions').upsert(
      { user_id: userId, match_id: match.id, home_score: h, away_score: a },
      { onConflict: 'user_id,match_id' }
    )
    if (err) {
      setError('Error al guardar. Intentá de nuevo.')
    } else {
      onSaved()
    }
  }

  return (
    <div className={`bg-gray-900 rounded-xl p-4 border ${match.is_finished ? 'border-gray-700' : 'border-gray-800'}`}>
      {/* Header: fecha y sede */}
      <div className="flex justify-between items-center mb-3 text-xs text-gray-500">
        <span>{formatDate(match.match_date)}</span>
        {match.venue && <span>{match.venue}</span>}
      </div>

      {/* Equipos y resultado */}
      <div className="flex items-center justify-between gap-2">
        {/* Local */}
        <div className="flex-1 text-center">
          <div className="mb-1"><Flag team={match.home_team} /></div>
          <div className="font-semibold text-white text-sm leading-tight">{match.home_team}</div>
        </div>

        {/* Marcador */}
        <div className="flex items-center gap-1 shrink-0">
          {match.is_finished ? (
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold text-green-400 w-8 text-center">{match.home_score}</span>
              <span className="text-gray-500 font-bold">-</span>
              <span className="text-2xl font-bold text-green-400 w-8 text-center">{match.away_score}</span>
            </div>
          ) : (
            <span className="text-gray-600 font-bold text-sm px-2">VS</span>
          )}
        </div>

        {/* Visitante */}
        <div className="flex-1 text-center">
          <div className="mb-1"><Flag team={match.away_team} /></div>
          <div className="font-semibold text-white text-sm leading-tight">{match.away_team}</div>
        </div>
      </div>

      {/* Sección de pronóstico */}
      <div className="mt-3 pt-3 border-t border-gray-800">
        {isLocked ? (
          /* Partido bloqueado: mostrar pronóstico guardado */
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Tu pronóstico:</span>
            {prediction ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-300">
                  {prediction.home_score} - {prediction.away_score}
                </span>
                {match.is_finished && pointsBadge(prediction.points)}
                {!match.is_finished && (
                  <span className="text-xs text-gray-600 italic">En curso...</span>
                )}
              </div>
            ) : (
              <span className="text-xs text-gray-600 italic">No pronosticaste</span>
            )}
          </div>
        ) : (
          /* Partido abierto: inputs de pronóstico */
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 flex-1 text-right">{match.home_team.split(' ')[0]}</span>
              <input
                type="number"
                min={0}
                max={99}
                value={home}
                onChange={(e) => setHome(e.target.value)}
                placeholder="0"
                className="w-12 text-center bg-gray-800 border border-gray-700 rounded-lg py-1.5 text-white font-bold focus:outline-none focus:border-green-500"
              />
              <span className="text-gray-500 font-bold">-</span>
              <input
                type="number"
                min={0}
                max={99}
                value={away}
                onChange={(e) => setAway(e.target.value)}
                placeholder="0"
                className="w-12 text-center bg-gray-800 border border-gray-700 rounded-lg py-1.5 text-white font-bold focus:outline-none focus:border-green-500"
              />
              <span className="text-xs text-gray-500 flex-1">{match.away_team.split(' ')[0]}</span>
              <button
                onClick={() => startTransition(handleSave)}
                disabled={isPending}
                className="px-3 py-1.5 bg-green-700 hover:bg-green-600 disabled:bg-gray-700 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                {isPending ? '...' : prediction ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
            {error && <p className="text-red-400 text-xs mt-1 text-center">{error}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
