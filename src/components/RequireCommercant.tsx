import { useEffect, useState, type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function RequireCommercant({ children }: { children: ReactNode }) {
  const [etat, setEtat] = useState<'chargement' | 'ok' | 'refuse'>('chargement')

  useEffect(() => {
    let annule = false

    supabase.auth.getSession().then(async ({ data }) => {
      if (annule) return
      if (!data.session) {
        setEtat('refuse')
        return
      }
      // La politique de sécurité ne renvoie que la ligne de l'utilisateur connecté
      const { data: role } = await supabase
        .from('commercants')
        .select('user_id')
        .maybeSingle()
      if (annule) return
      setEtat(role ? 'ok' : 'refuse')
    })

    return () => {
      annule = true
    }
  }, [])

  if (etat === 'chargement') return <p style={{ padding: 40 }}>Vérification de votre accès…</p>
  if (etat === 'refuse') return <Navigate to="/connexion" replace />
  return <>{children}</>
}