// The Recipes tab: search box + filters + grid of cards.
// Three pieces of state: what was typed, which category, which cuisine.
import { useState } from 'react'
import recipes, { CATEGORIES } from '../data/recipes.js'
import RecipeCard from './RecipeCard.jsx'

export default function RecipeLibrary({ onView, onQuickAdd }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [cuisine, setCuisine] = useState('All')

  // Unique cuisines from the data. A Set removes duplicates.
  const cuisines = ['All', ...new Set(recipes.map((r) => r.cuisine))]

  // Keep only the recipes that match ALL three filters.
  // This runs again every time state changes, so the list updates as you type.
  const filtered = recipes.filter((r) => {
    const text = query.trim().toLowerCase()
    const matchesCategory = category === 'All' || r.category === category
    const matchesCuisine = cuisine === 'All' || r.cuisine === cuisine
    const matchesQuery =
      text === '' ||
      r.name.toLowerCase().includes(text) ||
      r.tags.some((t) => t.toLowerCase().includes(text))
    return matchesCategory && matchesCuisine && matchesQuery
  })

  return (
    <section>
      <div className="page-head">
        <h1 className="page-title">Recipes</h1>
        <p className="page-sub">
          Browse the library, then add anything that looks good straight to this week's plan.
        </p>
      </div>

      <div className="search-row">
        {/* "Controlled input": its value comes from state, and typing updates the state */}
        <input
          type="search"
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search recipes or tags…"
        />
      </div>

      <div className="chips scroll-row filter-row">
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

      <div className="cuisine-row scroll-row">
        <span className="cuisine-label">Cuisine</span>
        {cuisines.map((c) => (
          <button
            key={c}
            onClick={() => setCuisine(c)}
            className={cuisine === c ? 'cuisine-chip active' : 'cuisine-chip'}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="empty-text">
          Nothing matches "{query}". Try a different search, category or cuisine.
        </p>
      ) : (
        <div className="recipe-grid">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onView={onView} onQuickAdd={onQuickAdd} />
          ))}
        </div>
      )}
    </section>
  )
}
