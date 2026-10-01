// The "Today" landing screen: greeting, quick stats, and today's 3 meals.
import { useState } from 'react'
import recipes from '../data/recipes.js'
import { DAYS, SLOTS } from '../hooks/useMealPlan.js'
import RecipePicker from './RecipePicker.jsx'

// Plain helper functions (not components) — they return a value, not JSX.
function getToday() {
  const jsDay = new Date().getDay() // JavaScript: 0 = Sunday, 1 = Monday ...
  const index = jsDay === 0 ? 6 : jsDay - 1 // our DAYS list starts on Monday
  return DAYS[index]
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

// A small decorative SVG drawing for the hero banner
function HeroDoodle() {
  return (
    <svg viewBox="0 0 220 160" className="hero-doodle" aria-hidden="true">
      <circle cx="60" cy="90" r="46" fill="#EFC978" opacity="0.5" />
      <circle cx="150" cy="55" r="30" fill="#B85C38" opacity="0.18" />
      <path d="M40 95 a45 30 0 0 0 90 0 Z" fill="#1F3A2E" />
      <ellipse cx="85" cy="95" rx="45" ry="9" fill="#152B21" />
      <path
        d="M70 70 Q65 55 75 45 Q85 35 78 22"
        stroke="#1F3A2E"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        opacity="0.35"
      />
      <path
        d="M95 70 Q90 55 100 45 Q110 35 103 22"
        stroke="#1F3A2E"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        opacity="0.35"
      />
      <path d="M150 90 Q175 80 180 55 Q150 60 150 90 Z" fill="#2C4F3D" />
      <path d="M175 100 Q195 100 198 120 Q198 135 185 132 Q168 128 175 100 Z" fill="#B85C38" />
    </svg>
  )
}

export default function Home({
  plan,
  assignMeal,
  clearMeal,
  recipeById,
  plannedDayCount,
  onView,
  onGoToPlanner,
}) {
  // pickerTarget = which slot the user is choosing for (null = picker closed)
  const [pickerTarget, setPickerTarget] = useState(null)
  // justSurprised = true for a moment after "Surprise me" is clicked
  const [justSurprised, setJustSurprised] = useState(false)

  const today = getToday()
  const greeting = getGreeting()

  // Numbers for the stats bar
  const cuisineCount = new Set(recipes.map((r) => r.cuisine)).size
  const mealsToday = SLOTS.filter((slot) => plan[today][slot]).length
  const openThisWeek = DAYS.reduce(
    (sum, day) => sum + SLOTS.filter((slot) => !plan[day][slot]).length,
    0
  )

  function handlePick(recipeId) {
    assignMeal(pickerTarget.day, pickerTarget.slot, recipeId)
    setPickerTarget(null)
  }

  // "Surprise me": put a random recipe into today's first empty slot
  function handleSurprise() {
    const emptySlot = SLOTS.find((slot) => !plan[today][slot])
    if (!emptySlot) return // today is already full

    // Prefer recipes whose category matches the slot (e.g. Breakfast recipe for Breakfast)
    const matching = recipes.filter((r) => r.category === emptySlot)
    const pool = matching.length > 0 ? matching : recipes
    const pick = pool[Math.floor(Math.random() * pool.length)]

    assignMeal(today, emptySlot, pick.id)
    setJustSurprised(true)
    setTimeout(() => setJustSurprised(false), 1800)
  }

  const stats = [
    { label: 'Recipes in library', value: recipes.length },
    { label: 'Cuisines to explore', value: cuisineCount },
    { label: 'Days planned this week', value: `${plannedDayCount}/7` },
    { label: 'Meal slots still open', value: openThisWeek },
  ]

  return (
    <section>
      <div className="hero reveal reveal-1">
        <div>
          <p className="hero-day">{today}</p>
          <h1 className="hero-title">{greeting}. What's cooking?</h1>
          <p className="hero-text">
            Fill in today's meals, raid the recipe library, or let the plan surprise you.
          </p>
          <button className="btn-gold" onClick={handleSurprise}>
            {justSurprised ? 'Added to today ✓' : 'Surprise me for today'}
          </button>
        </div>
        <HeroDoodle />
      </div>

      <div className="stats reveal reveal-2">
        {stats.map((stat) => (
          <div key={stat.label} className="stat">
            <p className="stat-value">{stat.value}</p>
            <p className="stat-label">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="reveal reveal-3">
        <div className="section-head">
          <h2 className="section-title">Today's plate — {mealsToday}/3 filled</h2>
          <button className="link-btn" onClick={onGoToPlanner}>
            View full week
          </button>
        </div>

        <div className="plate-grid">
          {SLOTS.map((slot) => {
            const recipeId = plan[today][slot]
            const recipe = recipeId ? recipeById[recipeId] : null
            return (
              <div key={slot} className="plate-card">
                <p className="slot-label">{slot}</p>

                {recipe ? (
                  <>
                    <button className="plate-recipe" onClick={() => onView(recipe)}>
                      <p className="plate-name">{recipe.name}</p>
                      <p className="plate-meta">
                        {recipe.minutes} min · {recipe.calories} kcal
                      </p>
                    </button>
                    <button className="remove-btn" onClick={() => clearMeal(today, slot)}>
                      Remove
                    </button>
                  </>
                ) : (
                  <button
                    className="choose-btn"
                    onClick={() => setPickerTarget({ day: today, slot })}
                  >
                    + Choose a recipe
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

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
