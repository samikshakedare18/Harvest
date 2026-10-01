// The full-recipe pop-up: ingredients, method, and the "add to plan" form.
import { useState } from 'react'
import { DAYS, SLOTS } from '../hooks/useMealPlan.js'

export default function RecipeModal({ recipe, onClose, onAssign }) {
  // The two dropdowns are remembered in state
  const [day, setDay] = useState(DAYS[0])
  const [slot, setSlot] = useState(SLOTS[0])
  // Used to briefly change the button text to "Added ✓"
  const [justAdded, setJustAdded] = useState(false)

  function handleAdd() {
    onAssign(day, slot, recipe.id)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1600) // back to normal after 1.6 seconds
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="modal-kicker">
              {recipe.category} · {recipe.cuisine}
            </p>
            <h2 className="modal-title">{recipe.name}</h2>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-summary">{recipe.summary}</p>

          <div className="modal-facts">
            <span>{recipe.minutes} min</span>
            <span>Serves {recipe.servings}</span>
            <span>{recipe.difficulty}</span>
            <span>{recipe.calories} kcal / serving</span>
          </div>

          <div className="modal-columns">
            <div>
              <h3 className="modal-heading">Ingredients</h3>
              <ul className="ingredient-list">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i}>
                    <span>{ing.name}</span>
                    <span className="ingredient-amount">
                      {ing.amount} {ing.unit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="modal-heading">Method</h3>
              <ol className="method-list">
                {recipe.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          </div>

          <div className="add-plan">
            <h3 className="modal-heading">Add to this week</h3>
            <div className="add-plan-row">
              <select className="select" value={day} onChange={(e) => setDay(e.target.value)}>
                {DAYS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <select className="select" value={slot} onChange={(e) => setSlot(e.target.value)}>
                {SLOTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <button className="btn-forest" onClick={handleAdd}>
                {justAdded ? 'Added ✓' : 'Add to plan'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
