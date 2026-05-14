'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types'

interface Props {
  profile: Profile
  onAvatarUpdated: (url: string) => void
}

export function Avatar({ url, username, small = false }: { url: string | null; username: string; small?: boolean }) {
  const sizeClass = small ? 'w-7 h-7 text-xs' : 'w-8 h-8 text-sm'
  if (url) {
    return (
      <img
        src={url}
        alt={username}
        className={`${sizeClass} rounded-full object-cover border-2 border-gray-700 shrink-0`}
      />
    )
  }
  return (
    <div className={`${sizeClass} rounded-full bg-green-800 flex items-center justify-center text-white font-bold border-2 border-gray-700 shrink-0`}>
      {username.charAt(0).toUpperCase()}
    </div>
  )
}

export default function UserMenu({ profile, onAvatarUpdated }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setOpen(false)
    const supabase = createClient()

    const ext = file.name.split('.').pop()
    const path = `${profile.id}/avatar.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true })

    if (!uploadError) {
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      const publicUrl = `${data.publicUrl}?t=${Date.now()}`

      await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id)

      onAvatarUpdated(publicUrl)
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
      >
        {uploading ? (
          <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse" />
        ) : (
          <Avatar url={profile.avatar_url} username={profile.username} />
        )}
        <span className="text-sm font-medium text-white">{profile.username}</span>
        <span className="text-gray-500 text-xs">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              📷 Cambiar foto de perfil
            </button>
            <div className="border-t border-gray-700" />
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              🚪 Cerrar sesión
            </button>
          </div>
        </>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}
