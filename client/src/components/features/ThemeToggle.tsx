import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
export default function ThemeToggle() { const { dark, toggle } = useTheme(); return <button onClick={toggle} aria-label="Toggle dark mode" className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">{dark ? <Sun size={19}/> : <Moon size={19}/>}</button>; }
