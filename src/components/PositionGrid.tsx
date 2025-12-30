import type { Position } from '../types'

const positions: readonly Position[] = [
  'top-left',
  'top',
  'top-right',
  'left',
  'center',
  'right',
  'bottom-left',
  'bottom',
  'bottom-right',
] as const

interface PositionGridProps {
  value: Position
  onChange: (value: Position) => void
}

export function PositionGrid({ value, onChange }: PositionGridProps) {
  return (
    <div className="position-grid">
      {positions.map((pos) => (
        <button
          key={pos}
          className={`position-btn ${value === pos ? 'active' : ''}`}
          onClick={() => onChange(pos)}
          title={pos}
        >
          {pos === 'center' ? '\u25CF' : '\u25CB'}
        </button>
      ))}
    </div>
  )
}
