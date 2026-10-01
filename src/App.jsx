
import { useState } from 'react'
import Header from './components/Header.jsx'
import Home from './components/Home.jsx'
import RecipeLibrary from './components/RecipeLibrary.jsx'
import Planner from './components/Planner.jsx'
import ShoppingList from './components/ShoppingList.jsx'
import RecipeModal from './components/RecipeModal.jsx'
import useMealPlan from './hooks/useMealPlan.js'

export default function App() {
  // Which tab is showing, and which recipe (if any) is open in the pop-up
  const [activeTab, setActiveTab] = useState('today')
  const [openRecipe, setOpenRecipe] = useState(null)

  // All the meal-plan data and functions come from our custom hook
  const {
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
  } = useMealPlan()

  return (
    <div className="app">
      <Header active={activeTab} onChange={setActiveTab} plannedDayCount={plannedDayCount} />

      <main className="main container">
        {/* Conditional rendering: only ONE of these shows, depending on activeTab */}
        {activeTab === 'today' && (
          <Home
            plan={plan}
            assignMeal={assignMeal}
            clearMeal={clearMeal}
            recipeById={recipeById}
            plannedDayCount={plannedDayCount}
            onView={setOpenRecipe}
            onGoToPlanner={() => setActiveTab('planner')}
          />
        )}

        {activeTab === 'recipes' && (
          <RecipeLibrary onView={setOpenRecipe} onQuickAdd={setOpenRecipe} />
        )}

        {activeTab === 'planner' && (
          <Planner
            plan={plan}
            caloriesByDay={caloriesByDay}
            recipeById={recipeById}
            assignMeal={assignMeal}
            clearMeal={clearMeal}
            clearWeek={clearWeek}
            onView={setOpenRecipe}
          />
        )}

        {activeTab === 'shopping' && (
          <ShoppingList
            shoppingList={shoppingList}
            checkedItems={checkedItems}
            toggleChecked={toggleChecked}
          />
        )}
      </main>

      <footer className="footer">
        Your plan is saved in this browser, so it's here next time you open the app.
      </footer>

      {/* The recipe pop-up only exists while a recipe is selected */}
      {openRecipe && (
        <RecipeModal
          recipe={openRecipe}
          onClose={() => setOpenRecipe(null)}
          onAssign={assignMeal}
        />
      )}
    </div>
  )
}
