export type Etat = 'Neuf' | 'Occasion' | 'Reconditionné'

export type Moteur = {
  id: number
  nom: string
  code: string
  etat: Etat
  compatibilite: string
  prix: number
  kilometrage?: number
}

export const moteurs: Moteur[] = [
  { id: 1, nom: 'Moteur 1.6 TDI 105 ch', code: 'CAYC', etat: 'Occasion', compatibilite: 'Golf VI, Passat B7', prix: 1290, kilometrage: 85000 },
  { id: 2, nom: 'Moteur 2.0 TSI 180 ch', code: 'CJSA', etat: 'Reconditionné', compatibilite: 'Audi A3, Golf VII', prix: 2150 },
  { id: 3, nom: 'Moteur 1.2 PureTech 110 ch', code: 'EB2', etat: 'Neuf', compatibilite: 'Peugeot 308, 3008', prix: 2490 },
]