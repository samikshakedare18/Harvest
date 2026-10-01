// A "custom hook" is just a function whose name starts with "use".
// It holds ALL the meal-plan state and logic in one place, so the
// components only have to worry about how things look.
import { useState, useEffect } from 'react'
import recipes from '../data/recipes.js'
import { loadState, saveState } from '../utils/storage.js'

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
export const SLOTS = ['Breakfast', 'Lunch', 'Dinner']

const STORAGE_KEY = 'harvest-meal-plan'
const CHECKED_KEY = 'harvest-shopping-checked'

// Turn the recipes array into an object so we can find a recipe by its id quickly:
// { r1: {...recipe}, r2: {...recipe}, ... }
const recipeById = Object.fromEntries(recipes.map((r) => [r.id, r]))

// A blank week: every day has Breakfast / Lunch / Dinner set to null (= nothing chosen)
function emptyPlan() {
  const plan = {}
  DAYS.forEach((day) => {
    plan[day] = {}
    SLOTS.forEach((slot) => {
      plan[day][slot] = null
    })
  })
  return plan
}

export default function useMealPlan() {
  // STATE 1: the plan. The function passed to useState runs only once,
  // to load a saved plan from localStorage (or start with an empty week).
  const [plan, setPlan] = useState(() => loadState(STORAGE_KEY, null) || emptyPlan())

  // STATE 2: which shopping items are ticked, e.g. { "butter": true }
  const [checkedItems, setCheckedItems] = useState(() => loadState(CHECKED_KEY, {}))

  // useEffect: every time `plan` changes, save it to the browser.
  useEffect(() => {
    saveState(STORAGE_KEY, plan)
  }, [plan])

  useEffect(() => {
    saveState(CHECKED_KEY, checkedItems)
  }, [checkedItems])

  // --- Functions that change the plan ---
  // We never edit state directly. We make a COPY with the change (using ...)
  // and give it to setPlan, so React knows to re-render.
  function assignMeal(day, slot, recipeId) {
    setPlan({
      ...plan,
      [day]: { ...plan[day], [slot]: recipeId },
    })
  }

  function clearMeal(day, slot) {
    setPlan({
      ...plan,
      [day]: { ...plan[day], [slot]: null },
    })
  }

  function clearWeek() {
    setPlan(emptyPlan())
  }

  function toggleChecked(key) {
    setCheckedItems({ ...checkedItems, [key]: !checkedItems[key] })
  }

  // --- Values worked out from the plan (recalculated on every render) ---

  // How many days have at least one meal
  const plannedDayCount = DAYS.filter((day) => SLOTS.some((slot) => plan[day][slot])).length

  // Total calories for each day: { Monday: 1200, Tuesday: 0, ... }
  const caloriesByDay = {}
  DAYS.forEach((day) => {
    let total = 0
    SLOTS.forEach((slot) => {
      const id = plan[day][slot]
      if (id) total += recipeById[id].calories
    })
    caloriesByDay[day] = total
  })

  // Shopping list: go through every planned meal and collect its ingredients.
  // Same ingredient in two recipes => one row (grouped by name).
  const groups = {}
  DAYS.forEach((day) => {
    SLOTS.forEach((slot) => {
      const id = plan[day][slot]
      if (!id) return // empty slot, skip it
      const recipe = recipeById[id]
      recipe.ingredients.forEach((ing) => {
        const key = ing.name.toLowerCase()
        if (!groups[key]) {
          groups[key] = { name: ing.name, uses: [] }
        }
        groups[key].uses.push({ recipe: recipe.name, amount: ing.amount, unit: ing.unit })
      })
    })
  })
  const shoppingList = Object.values(groups).sort((a, b) => a.name.localeCompare(b.name))

  return {
    plan,
    assignMeal,
    clearMeal,
    clearWeek,
    plannedDayCount,
    caloriesByDay,
    shoppingList,
    checkedItems,
    toggleChecked,
    recipeById,
  }
}
