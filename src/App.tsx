import { useState } from "react"
import { TopNav } from "@/components/TopNav"
import { LeftSidebar } from "@/components/LeftSidebar"
import { SpiralCanvas } from "@/components/SpiralCanvas"
import { useSpiral } from "@/hooks/useSpiral"

export default function App() {
  const [size, setSize] = useState(400)
  const [scale, setScale] = useState(1)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [bgMode, setBgMode] = useState<"dark" | "light">("dark")
  const [duration, setDuration] = useState(3)

  const displaySize = Math.round(size * scale)
  const bgColor = bgMode === "dark" ? "#010109" : "#F2F2F0"
  const spiralOptions = {
    dotColor: "#7042D2",
    bgColor,
    duration: duration / playbackSpeed,
  }

  const { containerRef, exportGIF } = useSpiral(displaySize, spiralOptions)

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: theme === "dark" ? "#010109" : "#F2F2F0" }}>
      <TopNav theme={theme} setTheme={setTheme} />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar
          theme={theme}
          size={size}
          setSize={setSize}
          scale={scale}
          setScale={setScale}
          playbackSpeed={playbackSpeed}
          setPlaybackSpeed={setPlaybackSpeed}
          bgMode={bgMode}
          setBgMode={setBgMode}
          duration={duration}
          setDuration={setDuration}
        />
        <SpiralCanvas
          theme={theme}
          containerRef={containerRef}
          size={displaySize}
          bgColor={spiralOptions.bgColor}
          exportGIF={exportGIF}
        />
      </div>
    </div>
  )
}
