import { useCallback, useEffect, useRef } from "react"

const SIZE = 400
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))
const svgNS = "http://www.w3.org/2000/svg"

export interface SpiralOptions {
  dotColor?: string
  bgColor?: string
  duration?: number
}

function getParams(displaySize: number) {
  if (displaySize <= 32) return { n: 45, dotRadius: 4, margin: 2 }
  if (displaySize <= 64) return { n: 80, dotRadius: 3, margin: 2 }
  if (displaySize <= 120) return { n: 150, dotRadius: 2.5, margin: 2 }
  return { n: 600, dotRadius: 2, margin: 2 }
}

function buildSpiral(
  container: HTMLDivElement | null,
  size: number,
  options: SpiralOptions = {}
) {
  if (!container) return
  const { dotColor = "#7042D2", duration = 3 } = options
  const { n, dotRadius, margin } = getParams(size)
  const center = SIZE / 2
  const maxRadius = center - margin - dotRadius

  let svg = container.querySelector("svg")
  if (svg) svg.remove()

  svg = document.createElementNS(svgNS, "svg")
  svg.setAttribute("viewBox", `0 0 ${SIZE} ${SIZE}`)
  svg.setAttribute("width", "100%")
  svg.setAttribute("height", "100%")
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet")
  container.appendChild(svg)

  for (let i = 0; i < n; i++) {
    const idx = i + 0.5
    const frac = idx / n
    const r = Math.sqrt(frac) * maxRadius
    const theta = idx * GOLDEN_ANGLE
    const x = center + r * Math.cos(theta)
    const y = center + r * Math.sin(theta)

    const c = document.createElementNS(svgNS, "circle")
    c.setAttribute("cx", String(x))
    c.setAttribute("cy", String(y))
    c.setAttribute("r", String(dotRadius))
    c.setAttribute("fill", dotColor)
    svg.appendChild(c)

    const animR = document.createElementNS(svgNS, "animate")
    animR.setAttribute("attributeName", "r")
    animR.setAttribute(
      "values",
      `${dotRadius * 0.5};${dotRadius * 1.5};${dotRadius * 0.5}`
    )
    animR.setAttribute("dur", `${duration}s`)
    animR.setAttribute("begin", `${frac * duration}s`)
    animR.setAttribute("repeatCount", "indefinite")
    animR.setAttribute("calcMode", "spline")
    animR.setAttribute("keySplines", "0.4 0 0.6 1;0.4 0 0.6 1")
    c.appendChild(animR)

    const animO = document.createElementNS(svgNS, "animate")
    animO.setAttribute("attributeName", "opacity")
    animO.setAttribute("values", "0.3;1;0.3")
    animO.setAttribute("dur", `${duration}s`)
    animO.setAttribute("begin", `${frac * duration}s`)
    animO.setAttribute("repeatCount", "indefinite")
    animO.setAttribute("calcMode", "spline")
    animO.setAttribute("keySplines", "0.4 0 0.6 1;0.4 0 0.6 1")
    c.appendChild(animO)
  }
}

function renderFrame(
  ctx: CanvasRenderingContext2D,
  size: number,
  time: number,
  options: SpiralOptions = {}
) {
  const { dotColor = "#7042D2", bgColor = "#010109", duration = 3 } = options
  const { n, dotRadius, margin } = getParams(size)
  const center = SIZE / 2
  const maxRadius = center - margin - dotRadius

  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, size, size)
  const scale = size / SIZE
  ctx.fillStyle = dotColor

  for (let i = 0; i < n; i++) {
    const idx = i + 0.5
    const frac = idx / n
    const offset = frac * duration
    const localT = ((time - offset) % duration + duration) % duration
    const pulse = 0.5 + 0.5 * Math.sin((2 * Math.PI * localT) / duration)
    const r = dotRadius * (0.5 + pulse)
    const opacity = 0.3 + 0.7 * pulse

    const dist = Math.sqrt(frac) * maxRadius
    const theta = idx * GOLDEN_ANGLE
    const x = center + dist * Math.cos(theta)
    const y = center + dist * Math.sin(theta)

    ctx.globalAlpha = opacity
    ctx.beginPath()
    ctx.arc(x * scale, y * scale, r * scale, 0, 2 * Math.PI)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

export function useSpiral(size: number, options: SpiralOptions) {
  const containerRef = useRef<HTMLDivElement>(null)
  const displaySize = Math.max(32, Math.min(400, size))

  useEffect(() => {
    buildSpiral(containerRef.current, displaySize, options)
  }, [displaySize, options.dotColor, options.duration])

  const exportSVG = useCallback(() => {
    const container = containerRef.current
    const svg = container?.querySelector("svg")
    if (!svg) return
    const color = options.dotColor ?? "#7042D2"
    const clone = svg.cloneNode(true) as SVGElement
    const style = document.createElementNS("http://www.w3.org/2000/svg", "style")
    style.textContent = `circle { fill: ${color}; opacity: 0.6; }`
    clone.insertBefore(style, clone.firstChild)
    const xml = new XMLSerializer().serializeToString(clone)
    const blob = new Blob([`<?xml version="1.0" encoding="UTF-8"?>\n${xml}`], {
      type: "image/svg+xml",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "mahana-ai-loader.svg"
    a.click()
    URL.revokeObjectURL(url)
  }, [options.dotColor])

  const exportGIF = useCallback(async () => {
    const fps = 15
    const duration = options.duration ?? 3
    const frameCount = Math.ceil(duration * fps)
    const delay = 1000 / fps

    const canvas = document.createElement("canvas")
    canvas.width = displaySize
    canvas.height = displaySize
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const GIF = (await import("gif.js")).default
    const workerBlob = await fetch("/gif.worker.js").then((r) => r.blob())
    const workerUrl = URL.createObjectURL(workerBlob)

    const gif = new GIF({
      workers: 2,
      quality: 10,
      workerScript: workerUrl,
    })

    for (let i = 0; i < frameCount; i++) {
      const t = (i / frameCount) * duration
      renderFrame(ctx, displaySize, t, options)
      gif.addFrame(ctx, { copy: true, delay })
    }

    return new Promise<void>((resolve) => {
      gif.on("finished", (blob: Blob) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "mahana-ai-loader.gif"
        a.click()
        URL.revokeObjectURL(url)
        URL.revokeObjectURL(workerUrl)
        resolve()
      })
      gif.render()
    })
  }, [displaySize, options])

  return { containerRef, exportSVG, exportGIF }
}
