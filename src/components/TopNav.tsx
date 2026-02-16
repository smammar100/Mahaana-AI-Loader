import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"

interface TopNavProps {
  theme: "dark" | "light"
  setTheme: (t: "dark" | "light") => void
}

export function TopNav({ theme, setTheme }: TopNavProps) {
  const bg = theme === "dark" ? "#010109" : "#F2F2F0"
  const textColor = theme === "dark" ? "text-zinc-100" : "text-zinc-900"
  const borderColor = theme === "dark" ? "border-zinc-800" : "border-zinc-300"
  const btnVariant = theme === "dark"
    ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
    : "bg-zinc-200 hover:bg-zinc-300 text-zinc-800"

  return (
    <header
      className={`h-14 border-b ${borderColor} flex items-center justify-between px-4 shrink-0`}
      style={{ backgroundColor: bg }}
    >
      <span className={`font-semibold text-lg ${textColor}`}>Mahaana AI Loader</span>
      <Button
        variant="ghost"
        size="icon"
        className={`${btnVariant} focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2`}
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      >
        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>
    </header>
  )
}
