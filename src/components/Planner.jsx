// The "This week" tab: a grid of 7 days x 3 meals.
import { useState } from 'react'
import { DAYS, SLOTS } from '../hooks/useMealPlan.js'
import RecipePicker from './RecipePicker.jsx'

// A small component for ONE box in the grid.
// If nothing is planned it shows "+ Add ...", otherwise it shows the recipe.
function DaySlotCell({ day, slot, recipe, onOpenPicker, onRemove, onView }) {
  if (!recipe) {
    return (
      <button className="cell-empty" onClick={() => onOpenPicker(day, slot)}>
        + Add {slot.toLowerCase()}
      </button>
    )
  }

  return (
    <div className="cell-filled">
      <button className="cell-view" onClick={() => onView(recipe)}>
        <p className="cell-name">{recipe.name}</p>
        <p className="cell-meta">
          {recipe.minutes} min · {recipe.calories} kcal
        </p>
      </button>
      <button className="remove-btn" onClick={() => onRemove(day, slot)}>
        Remove
      </button>
    </div>
  )
}

export default function Planner({
  plan,
  caloriesByDay,
  recipeById,
  assignMeal,
  clearMeal,
  clearWeek,
  onView,
}) {
  // Which empty slot did the user tap? e.g. { day: 'Monday', slot: 'Lunch' } (null = none)
  const [pickerTarget, setPickerTarget] = useState(null)

  function handlePick(recipeId) {
    assignMeal(pickerTarget.day, pickerTarget.slot, recipeId)
    setPickerTarget(null) // close the picker
  }

  return (
    <section>
      <div className="page-head page-head-row">
        <div>
          <h1 className="page-title">This week</h1>
          <p className="page-sub">Tap an empty slot to fill it, or a filled one to see the recipe.</p>
        </div>
        <button className="clear-week-btn" onClick={clearWeek}>
          Clear week
        </button>
      </div>

      <div className="week-scroll scroll-row">
        <div className="week-grid">
          {/* Loop 1: one column per day */}
          {DAYS.map((day) => (
            <div key={day} className="day-col">
              <div className="day-head">
                <p className="day-name">{day.slice(0, 3)}</p>
                <p className="day-kcal">
                  {caloriesByDay[day] > 0 ? `${caloriesByDay[day]} kcal` : '—'}
                </p>
              </div>

              {/* Loop 2 (inside loop 1): three meal boxes per day */}
              <div className="day-slots">
                {SLOTS.map((slot) => {
                  const recipeId = plan[day][slot]
                  const recipe = recipeId ? recipeById[recipeId] : null
                  return (
                    <DaySlotCell
                      key={slot}
                      day={day}
                      slot={slot}
                      recipe={recipe}
                      onOpenPicker={(d, s) => setPickerTarget({ day: d, slot: s })}
                      onRemove={clearMeal}
                      onView={onView}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="scroll-hint">Scroll sideways to see the full week →</p>

      {pickerTarget && (
        <RecipePicker
          day={pickerTarget.day}
          slot={pickerTarget.slot}
          onClose={() => setPickerTarget(null)}
          onPick={handlePick}
        />
      )}
    </section>
  )
}
