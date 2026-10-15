import { useState } from 'react'
import { appliquerTheme, lireTheme, type Theme } from '../lib/theme'
import './ThemeBouton.css'

function ThemeBouton() {
  const [theme, setTheme] = useState<Theme>(() => lireTheme())

  function basculer() {
    const suivant: Theme = theme === 'clair' ? 'sombre' : 'clair'
    appliquerTheme(suivant)
    setTheme(suivant)
  }

  return (
    <button
      type="button"
      className="theme-bascule"
      onClick={basculer}
      aria-label={theme === 'clair' ? 'Passer en mode sombre' : 'Passer en mode clair'}
      title={theme === 'clair' ? 'Mode sombre' : 'Mode clair'}
    >
      {theme === 'clair' ? '☾' : '☀'}
    </button>
  )
}

export default ThemeBouton