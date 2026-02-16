import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"

const SIZES = [32, 48, 64, 96, 120, 200, 256, 400]

interface LeftSidebarProps {
  theme: "dark" | "light"
  size: number
  setSize: (s: number) => void
  scale: number
  setScale: (s: number) => void
  playbackSpeed: number
  setPlaybackSpeed: (v: number) => void
  duration: number
  setDuration: (d: number) => void
}

export function LeftSidebar({
  theme,
  size,
  setSize,
  scale,
  setScale,
  playbackSpeed,
  setPlaybackSpeed,
  duration,
  setDuration,
}: LeftSidebarProps) {
  const isDark = theme === "dark"
  return (
    <aside
      className={`w-[280px] border-r flex flex-col overflow-hidden shrink-0 ${isDark ? "border-zinc-800" : "border-zinc-300"}`}
      style={{ backgroundColor: isDark ? "#010109" : "#F2F2F0" }}
    >
      <div className="p-4 space-y-6 overflow-y-auto">
        <section>
          <h3 className={`text-sm font-medium mb-3 ${isDark ? "text-zinc-200" : "text-zinc-700"}`}>Input Source</h3>
          <div className="space-y-3">
            <div>
              <label className={`text-xs mb-2 block ${isDark ? "text-zinc-500" : "text-zinc-600"}`}>Size</label>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((s) => (
                  <Button
                    key={s}
                    variant={size === s ? "default" : "outline"}
                    size="sm"
                    className={`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 ${
                      size === s
                        ? isDark
                          ? "bg-zinc-600 hover:bg-zinc-500 text-white border-2 border-zinc-500"
                          : "bg-zinc-500 hover:bg-zinc-600 text-white border-2 border-zinc-600"
                        : isDark
                          ? "border-2 border-zinc-600 text-zinc-200 bg-zinc-800/50 hover:bg-zinc-700"
                          : "border-2 border-zinc-400 text-zinc-800 bg-white hover:bg-zinc-100"
                    }`}
                    onClick={() => setSize(s)}
                    aria-label={`Set size to ${s} pixels`}
                    aria-pressed={size === s}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="scale-input" className={`text-xs mb-2 block ${isDark ? "text-zinc-500" : "text-zinc-600"}`}>Scale</label>
              <div className="flex gap-2 items-center">
                <Slider
                  value={[scale]}
                  onValueChange={([v]) => setScale(v)}
                  min={0.25}
                  max={2}
                  step={0.05}
                  className="flex-1"
                  aria-label="Scale factor"
                />
                <Input
                  id="scale-input"
                  type="number"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value) || 1)}
                  aria-label="Scale value"
                  className={`w-14 h-8 text-center text-sm ${isDark ? "border-zinc-700 bg-zinc-800 text-zinc-200" : "border-zinc-400 bg-white text-zinc-900"}`}
                  min={0.25}
                  max={2}
                  step={0.05}
                />
              </div>
            </div>
          </div>
        </section>

        <Collapsible defaultOpen>
          <CollapsibleTrigger
            className={`flex items-center justify-between w-full text-sm font-medium cursor-pointer py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 ${isDark ? "text-zinc-200 hover:text-zinc-100" : "text-zinc-700 hover:text-zinc-900"}`}
            aria-label="Expand or collapse Animation settings"
          >
            Animation
            <ChevronDown className="h-4 w-4 text-zinc-500" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 space-y-3">
            <div>
              <label htmlFor="playback-speed-input" className={`text-xs mb-2 block ${isDark ? "text-zinc-500" : "text-zinc-600"}`}>Playback Speed</label>
              <div className="flex gap-2 items-center">
                <Slider
                  value={[playbackSpeed]}
                  onValueChange={([v]) => setPlaybackSpeed(v)}
                  min={0.25}
                  max={2}
                  step={0.25}
                  className="flex-1"
                  aria-label="Playback speed"
                />
                <Input
                  id="playback-speed-input"
                  type="number"
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value) || 1)}
                  aria-label="Playback speed value"
                  className={`w-14 h-8 text-center text-sm ${isDark ? "border-zinc-700 bg-zinc-800 text-zinc-200" : "border-zinc-400 bg-white text-zinc-900"}`}
                  min={0.25}
                  max={2}
                  step={0.25}
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible defaultOpen>
          <CollapsibleTrigger
            className={`flex items-center justify-between w-full text-sm font-medium cursor-pointer py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 ${isDark ? "text-zinc-200 hover:text-zinc-100" : "text-zinc-700 hover:text-zinc-900"}`}
            aria-label="Expand or collapse Basic Settings"
          >
            Basic Settings
            <ChevronDown className="h-4 w-4 text-zinc-500" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 space-y-3">
            <div>
              <label className={`text-xs mb-2 block ${isDark ? "text-zinc-500" : "text-zinc-600"}`}>Duration (s)</label>
              <Slider
                value={[duration]}
                onValueChange={([v]) => setDuration(v)}
                min={1}
                max={6}
                step={0.5}
                aria-label="Animation duration in seconds"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
      <div className={`mt-auto p-4 border-t ${isDark ? "border-zinc-800" : "border-zinc-300"}`}>
        <p className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-600"}`}>Mahaana AI Loader</p>
        <a href="#" className={`text-xs ${isDark ? "text-zinc-500 hover:text-zinc-400" : "text-zinc-600 hover:text-zinc-800"}`}>Report bug</a>
      </div>
    </aside>
  )
}
