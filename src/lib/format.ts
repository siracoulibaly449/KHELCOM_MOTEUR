export function formatPrix(montant: number): string {
  return `${Math.round(montant).toLocaleString('fr-FR')} FCFA`
}