import { useState } from "react"
import { type Ref } from "react"
import { Button } from "@/components/ui/button"

interface SpiralCanvasProps {
  theme: "dark" | "light"
  containerRef: Ref<HTMLDivElement>
  size: number
  bgColor?: string
  exportGIF: () => Promise<void>
}

export function SpiralCanvas({
  theme,
  containerRef,
  size,
  bgColor = "#010109",
  exportGIF,
}: SpiralCanvasProps) {
  const [gifEncoding, setGifEncoding] = useState(false)
  const isDark = theme === "dark"
  const bg = isDark ? "#010109" : "#F2F2F0"

  const handleExportGIF = async () => {
    setGifEncoding(true)
    try {
      await exportGIF()
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return
      }
      console.error("GIF export failed:", err)
      const message = err instanceof Error ? err.message : "GIF export failed"
      alert(message)
    } finally {
      setGifEncoding(false)
    }
  }

  return (
    <main className="flex-1 flex items-center justify-center overflow-auto p-8" style={{ backgroundColor: bg }}>
      <div className="flex flex-col items-center">
        <div
          ref={containerRef}
          className="shrink-0 rounded-lg overflow-hidden"
          style={{
            width: size,
            height: size,
            backgroundColor: bgColor,
            minWidth: 32,
            minHeight: 32,
            maxWidth: 400,
            maxHeight: 400,
          }}
        />
        <Button
          variant="default"
          className="w-full max-w-[400px] bg-[#7042D2] text-white border-2 border-[#7042D2] hover:bg-[#5a36b8] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
          style={{ marginTop: 24 }}
          onClick={handleExportGIF}
          disabled={gifEncoding}
          aria-label={gifEncoding ? "Encoding GIF, please wait" : "Export loader as animated GIF"}
          aria-busy={gifEncoding}
        >
          {gifEncoding ? "Encoding..." : "Export GIF"}
        </Button>
      </div>
    </main>
  )
}
