import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Moteur } from './moteurs'

export function useMoteurs() {
  const [moteurs, setMoteurs] = useState<Moteur[]>([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState<string | null>(null)

  useEffect(() => {
    let annule = false

    supabase
      .from('moteurs')
      .select('*')
      .order('id')
      .then(({ data, error }) => {
        if (annule) return
        if (error) {
          setErreur('Impossible de charger les moteurs. Réessayez dans quelques instants.')
        } else {
          setMoteurs(
            (data ?? []).map((m) => ({
              id: m.id,
              nom: m.nom,
              code: m.code,
              etat: 'Occasion',
              compatibilite: m.compatibilite,
              prix: m.prix,
              kilometrage: m.kilometrage ?? undefined,
              disponibilite: m.disponibilite,
              photos: m.photos ?? [],
              description: m.description,
              vehicule_origine: m.vehicule_origine,
              statut_titre: m.statut_titre,
              vin: m.vin,
              source_achat: m.source_achat,
              historique: m.historique,
              compression: m.compression,
              kilometrage_miles: m.kilometrage_miles,
            }))
          )
        }
        setChargement(false)
      })

    return () => {
      annule = true
    }
  }, [])

  return { moteurs, chargement, erreur }
}