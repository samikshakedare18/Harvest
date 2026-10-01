// The Shopping list tab. The list itself is built in useMealPlan.js;
// this component only displays it and reports ticks back to the parent.
export default function ShoppingList({ shoppingList, checkedItems, toggleChecked }) {
  const remaining = shoppingList.filter((item) => !checkedItems[item.name.toLowerCase()]).length

  return (
    <section>
      <div className="page-head">
        <h1 className="page-title">Shopping list</h1>
        <p className="page-sub">Built automatically from everything on this week's plan.</p>
      </div>

      {shoppingList.length === 0 ? (
        <div className="empty-box">
          Nothing here yet. Add a few meals to the plan and their ingredients will show up.
        </div>
      ) : (
        <>
          <p className="shop-count">
            {remaining} of {shoppingList.length} items left to pick up
          </p>

          <ul className="shop-list">
            {shoppingList.map((item) => {
              const key = item.name.toLowerCase()
              const checked = !!checkedItems[key]
              return (
                <li key={key} className="shop-item">
                  <input
                    type="checkbox"
                    id={`item-${key}`}
                    checked={checked}
                    onChange={() => toggleChecked(key)}
                  />
                  <label
                    htmlFor={`item-${key}`}
                    className={checked ? 'shop-label checked' : 'shop-label'}
                  >
                    <p className="shop-name">{item.name}</p>
                    <p className="shop-detail">
                      {item.uses.map((u) => `${u.amount} ${u.unit}`.trim()).join(' + ')} · for{' '}
                      {item.uses.map((u) => u.recipe).join(', ')}
                    </p>
                  </label>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </section>
  )
}
