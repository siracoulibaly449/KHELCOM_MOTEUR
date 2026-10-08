import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type ArticlePanier = {
  id: number
  nom: string
  code: string
  prix: number
  photo: string | null
}

type PanierValeur = {
  articles: ArticlePanier[]
  nombre: number
  total: number
  ajouter: (article: ArticlePanier) => void
  retirer: (id: number) => void
  vider: () => void
}

export const PanierContext = createContext<PanierValeur | null>(null)

const CLE_STOCKAGE = 'moteurs-pro-panier'

function lireStockage(): ArticlePanier[] {
  try {
    const brut = localStorage.getItem(CLE_STOCKAGE)
    return brut ? JSON.parse(brut) : []
  } catch {
    return []
  }
}

export function PanierProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<ArticlePanier[]>(lireStockage)

  useEffect(() => {
    try {
      localStorage.setItem(CLE_STOCKAGE, JSON.stringify(articles))
    } catch {
      // Stockage indisponible (navigation privée, par exemple) : le panier reste en mémoire
    }
  }, [articles])

  const valeur = useMemo<PanierValeur>(() => ({
    articles,
    nombre: articles.length,
    total: articles.reduce((somme, a) => somme + a.prix, 0),
    // Un moteur est unique : on ne l'ajoute pas deux fois
    ajouter: (article) =>
      setArticles((actuels) =>
        actuels.some((a) => a.id === article.id) ? actuels : [...actuels, article]
      ),
    retirer: (id) => setArticles((actuels) => actuels.filter((a) => a.id !== id)),
    vider: () => setArticles([]),
  }), [articles])

  return <PanierContext.Provider value={valeur}>{children}</PanierContext.Provider>
}