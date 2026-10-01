
export default function RecipeCard({ recipe, onView, onQuickAdd }) {
  return (
    <div className={`recipe-card accent-${recipe.accent}`}>
      <div>
        <div className="card-top">
          <h3 className="card-title">{recipe.name}</h3>
          <span className="card-tags">
            <span className="badge">{recipe.category}</span>
            <span className="card-cuisine">{recipe.cuisine}</span>
          </span>
        </div>

        <p className="card-summary">{recipe.summary}</p>

        <div className="card-facts">
          <span>{recipe.minutes} min</span>
          <span>Serves {recipe.servings}</span>
          <span>{recipe.difficulty}</span>
          <span>{recipe.calories} kcal</span>
        </div>
      </div>

      <div className="card-actions">
        <button className="view-btn" onClick={() => onView(recipe)}>
          View recipe
        </button>
        <span className="dot">·</span>
        <button className="add-btn" onClick={() => onQuickAdd(recipe)}>
          Add to plan
        </button>
      </div>
    </div>
  )
}
