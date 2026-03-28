import type { Traits } from '../types'

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n))
}

export function PredictionPanel({
  last,
  prev,
}: {
  last: Traits
  prev?: Traits
}) {
  const keys = Object.keys(last) as (keyof Traits)[]
  const trend = (k: keyof Traits) => {
    if (!prev) return 0
    return last[k] - prev[k]
  }

  const forecast = keys
    .map((k) => ({
      k,
      next: clamp01(last[k] + trend(k) * 0.65),
      delta: trend(k),
    }))
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
    .slice(0, 3)

  return (
    <div className="grid gap-3">
      <div>
        <div className="text-[11px] font-semibold tracking-[0.18em] text-white/55">FUTURE PERSONALITY TRENDS</div>
        <div className="mt-2 text-sm text-white/70">
          Forecast uses your recent direction of change (demo heuristic).
        </div>
      </div>

      <div className="grid gap-2">
        {forecast.map((f) => {
          const dir = f.delta >= 0 ? '↑' : '↓'
          const mag = Math.round(Math.abs(f.delta) * 100)
          const pct = Math.round(f.next * 100)
          return (
            <div
              key={f.k}
              className="rounded-xl border border-white/10 bg-white/5 p-3 hover:border-white/20 transition"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-[#E0E7FF] capitalize">{f.k}</div>
                <div className="text-xs text-white/60">
                  {dir} {mag}% → {pct}%
                </div>
              </div>
              <div className="mt-2 h-[1px] w-full bg-gradient-to-r from-[#8B5CF6]/0 via-[#22D3EE]/35 to-[#3B82F6]/0" />
            </div>
          )
        })}
      </div>
    </div>
  )
}

