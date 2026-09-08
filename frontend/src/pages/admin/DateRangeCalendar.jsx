import React, { useEffect, useRef, useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import './DateRangeCalendar.css'

const pad = (n) => String(n).padStart(2, '0')
const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const fromKey = (s) => {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}
const fmt = (s) => fromKey(s).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })

const WD = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const preset = (key) => {
  const t = new Date()
  t.setHours(0, 0, 0, 0)
  const end = toKey(t)
  const back = (n) => {
    const s = new Date(t)
    s.setDate(s.getDate() - n)
    return toKey(s)
  }
  if (key === 'today') return { from: end, to: end }
  if (key === '7d') return { from: back(6), to: end }
  if (key === '30d') return { from: back(29), to: end }
  return { from: toKey(new Date(t.getFullYear(), t.getMonth(), 1)), to: end } // this month
}

const DateRangeCalendar = ({ value, onChange }) => {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState(() => fromKey(value.to || value.from))
  const [sel, setSel] = useState({ a: null, b: null }) // in-progress selection
  const ref = useRef(null)

  // Reset the in-progress selection + jump to the right month only when opening.
  useEffect(() => {
    if (!open) return
    setView(fromKey(value.to || value.from))
    setSel({ a: null, b: null })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Outside click closes; a half-finished pick commits as a single day.
  useEffect(() => {
    if (!open) return undefined
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        if (sel.a && !sel.b) onChange({ from: sel.a, to: sel.a })
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open, sel.a, sel.b, value, onChange])

  const applyPreset = (key) => {
    onChange(preset(key))
    setSel({ a: null, b: null })
    setOpen(false)
  }

  const clickDay = (d) => {
    const k = toKey(d)
    if (!sel.a || sel.b) {
      setSel({ a: k, b: null })
      onChange({ from: k, to: k })
    } else {
      const [from, to] = sel.a <= k ? [sel.a, k] : [k, sel.a]
      onChange({ from, to })
      setSel({ a: null, b: null })
      setOpen(false)
    }
  }

  const done = () => {
    if (sel.a && !sel.b) onChange({ from: sel.a, to: sel.a })
    setSel({ a: null, b: null })
    setOpen(false)
  }

  const y = view.getFullYear()
  const m = view.getMonth()
  const daysInMonth = new Date(y, m + 1, 0).getDate()
  const lead = new Date(y, m, 1).getDay()
  const cells = [
    ...Array(lead).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(y, m, i + 1)),
  ]

  // range to visualise: in-progress single day, else the committed value
  const shown = sel.a && !sel.b ? { from: sel.a, to: sel.a } : value
  const todayK = toKey(new Date())
  const label = value.from === value.to ? fmt(value.from) : `${fmt(value.from)} – ${fmt(value.to)}`

  return (
    <div className="drc" ref={ref}>
      <button type="button" className="drc-trigger" onClick={() => setOpen((o) => !o)}>
        <Calendar size={15} strokeWidth={1.9} />
        <span>{label}</span>
      </button>

      {open && (
        <div className="drc-pop">
          <div className="drc-presets">
            <button type="button" onClick={() => applyPreset('today')}>Today</button>
            <button type="button" onClick={() => applyPreset('7d')}>Last 7 days</button>
            <button type="button" onClick={() => applyPreset('30d')}>Last 30 days</button>
            <button type="button" onClick={() => applyPreset('month')}>This month</button>
          </div>

          <div className="drc-cal">
            <div className="drc-head">
              <button type="button" onClick={() => setView(new Date(y, m - 1, 1))} aria-label="Previous month">
                <ChevronLeft size={16} />
              </button>
              <span>{MONTHS[m]} {y}</span>
              <button type="button" onClick={() => setView(new Date(y, m + 1, 1))} aria-label="Next month">
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="drc-grid">
              {WD.map((w) => <span key={w} className="drc-wd">{w}</span>)}
              {cells.map((d, i) => {
                if (d === null) return <span key={`b${i}`} className="drc-cell drc-empty" />
                const k = toKey(d)
                const cls = [
                  'drc-cell',
                  k >= shown.from && k <= shown.to ? 'in-range' : '',
                  k === shown.from || k === shown.to ? 'is-edge' : '',
                  k === todayK ? 'is-today' : '',
                ].join(' ')
                return (
                  <button key={k} type="button" className={cls} onClick={() => clickDay(d)}>
                    {d.getDate()}
                  </button>
                )
              })}
            </div>
            <div className="drc-footer">
              <p className="drc-hint">
                {sel.a && !sel.b
                  ? 'Pick an end date for a range, or click Done for a single day.'
                  : 'Click a day, then a second day for a range.'}
              </p>
              <button type="button" className="drc-done" onClick={done}>Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DateRangeCalendar
