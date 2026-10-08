import { useContext } from 'react'
import { PanierContext } from './PanierContext'

export function usePanier() {
  const contexte = useContext(PanierContext)
  if (!contexte) throw new Error('usePanier doit être utilisé à l\'intérieur de PanierProvider')
  return contexte
}