export type Stage = 'group' | 'round_of_32' | 'round_of_16' | 'quarterfinal' | 'semifinal' | 'third_place' | 'final'

export interface Profile {
  id: string
  username: string
  is_admin: boolean
  avatar_url: string | null
  created_at: string
}

export interface Match {
  id: number
  home_team: string
  away_team: string
  match_date: string
  stage: Stage
  group_name: string | null
  home_score: number | null
  away_score: number | null
  is_finished: boolean
  venue: string | null
}

export interface Prediction {
  id: number
  user_id: string
  match_id: number
  home_score: number
  away_score: number
  points: number | null
  created_at: string
  updated_at: string
}

export interface LeaderboardEntry {
  user_id: string
  username: string
  avatar_url: string | null
  total_points: number
  exact_results: number
  correct_outcomes: number
  total_predictions: number
}

export const STAGE_LABELS: Record<Stage, string> = {
  group: 'Fase de Grupos',
  round_of_32: 'Ronda de 32',
  round_of_16: 'Octavos de Final',
  quarterfinal: 'Cuartos de Final',
  semifinal: 'Semifinal',
  third_place: 'Tercer Puesto',
  final: 'Final',
}
