// Marques composées de deux mots, à reconnaître en premier
const MARQUES_COMPOSEES = ['Land Rover', 'Mercedes-Benz', 'Alfa Romeo', 'Aston Martin', 'Rolls-Royce']

export type Vehicule = {
  marque: string
  modele: string
  annee: string
}

export function parserVehicule(texte?: string | null): Vehicule | null {
  if (!texte || !texte.trim()) return null

  let reste = texte.trim()
  let marque = ''

  for (const m of MARQUES_COMPOSEES) {
    if (reste.toLowerCase().startsWith(m.toLowerCase())) {
      marque = m
      reste = reste.slice(m.length).trim()
      break
    }
  }

  const morceaux = reste.split(/\s+/).filter(Boolean)
  if (!marque) marque = morceaux.shift() ?? ''

  let annee = ''
  const dernier = morceaux[morceaux.length - 1]
  if (dernier && /^(19|20)\d{2}$/.test(dernier)) {
    annee = dernier
    morceaux.pop()
  }

  return { marque, modele: morceaux.join(' '), annee }
}