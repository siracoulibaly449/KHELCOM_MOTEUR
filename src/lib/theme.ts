export type Theme = 'sombre' | 'clair'

const CLE = 'moteurs-pro-theme'

export function lireTheme(): Theme {
  try {
    return localStorage.getItem(CLE) === 'clair' ? 'clair' : 'sombre'
  } catch {
    return 'sombre'
  }
}

export function appliquerTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme === 'clair' ? 'light' : 'dark'
  try {
    localStorage.setItem(CLE, theme)
  } catch {
    // Stockage indisponible : le thème reste actif pour la session
  }
}

// Applique le thème mémorisé dès le chargement
appliquerTheme(lireTheme())