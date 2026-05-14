# Setup - Prode Mundial 2026

## 1. Configurar Supabase

1. Ingresá a [supabase.com](https://supabase.com) y creá un nuevo proyecto
2. Andá a **SQL Editor** y ejecutá primero `supabase/schema.sql`
3. Luego ejecutá `supabase/seed.sql` para cargar los 72 partidos de la fase de grupos
4. En **Project Settings → API** copiá:
   - `Project URL`
   - `anon public key`

## 2. Variables de entorno

Editá `.env.local` y reemplazá los valores:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

## 3. Configurar confirmación de email (opcional)

Para que los amigos puedan registrarse sin confirmar email:
- En Supabase: **Authentication → Providers → Email**
- Desactivar "Confirm email"

## 4. Correr localmente

```bash
npm run dev
```

Abrí http://localhost:3000

## 5. Hacerte admin

Después de registrarte, andá al **Table Editor** de Supabase:
- Tabla `profiles` → buscá tu fila → cambiá `is_admin` a `true`

Esto te da acceso a la página `/admin` donde cargás los resultados.

## 6. Deploy en Vercel (gratis)

1. Creá cuenta en [vercel.com](https://vercel.com)
2. "Add New Project" → importá desde GitHub
3. En "Environment Variables" agregá las mismas dos variables de `.env.local`
4. Deploy → ¡listo!

---

## Cómo funciona el prode

| Situación | Puntos |
|-----------|--------|
| Resultado exacto (ej: pronóstico 2-1, resultado 2-1) | +3 |
| Ganador/empate correcto (ej: pronóstico 2-0, resultado 1-0) | +1 |
| Fallo total | +0 |

- Los pronósticos se **bloquean** cuando arranca el partido
- El admin carga los resultados desde `/admin`
- Los puntos se calculan automáticamente al guardar el resultado
