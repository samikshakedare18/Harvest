// The pop-up list shown when you tap an empty slot ("+ Choose a recipe").
// Props: which day/slot it's for, plus onClose and onPick functions from the parent.
import { useState } from 'react'
import recipes, { CATEGORIES } from '../data/recipes.js'

export default function RecipePicker({ day, slot, onClose, onPick }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

  const filtered = recipes.filter((r) => {
    const matchesCategory = category === 'All' || r.category === category
    const matchesQuery = query.trim() === '' || r.name.toLowerCase().includes(query.toLowerCase())
    return matchesCategory && matchesQuery
  })

  return (
    // Clicking the dark background closes the pop-up...
    <div className="overlay" onClick={onClose}>
      {/* ...but clicking inside the white box must NOT close it, so we stop the click here */}
      <div className="modal small" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="modal-kicker">
              {day} · {slot}
            </p>
            <h2 className="modal-title">Choose a recipe</h2>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="picker-body">
          <input
            type="search"
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search recipes…"
            autoFocus
          />

          <div className="chips scroll-row">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={category === c ? 'chip active' : 'chip'}
              >
                {c}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="empty-text">No recipes match that search.</p>
          ) : (
            <ul className="picker-list">
              {filtered.map((r) => (
                <li key={r.id}>
                  <button className="picker-item" onClick={() => onPick(r.id)}>
                    <div className="picker-item-top">
                      <span className="picker-item-name">{r.name}</span>
                      <span className="picker-item-time">{r.minutes} min</span>
                    </div>
                    <p className="picker-item-cat">{r.category}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
