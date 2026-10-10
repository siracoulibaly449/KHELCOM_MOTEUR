export type Etat = 'Occasion'

export type Moteur = {
  id: number
  nom: string
  code: string
  etat: Etat
  compatibilite: string
  prix: number
  kilometrage?: number
  disponibilite: string
  photos?: string[]
  description?: string | null
  vehicule_origine?: string | null
  statut_titre?: string | null
  vin?: string | null
  source_achat?: string | null
  historique?: string | null
  compression?: string | null
  kilometrage_miles?: number | null
}