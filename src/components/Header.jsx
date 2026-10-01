// The top bar: logo + navigation tabs.
// Props: `active` (current tab), `onChange` (function to switch tab),
//        `plannedDayCount` (number shown at the right).
const TABS = [
  { id: 'today', label: 'Today' },
  { id: 'recipes', label: 'Recipes' },
  { id: 'planner', label: 'This week' },
  { id: 'shopping', label: 'Shopping list' },
]

export default function Header({ active, onChange, plannedDayCount }) {
  return (
    <header className="header">
      <div className="container">
        <div className="header-top">
          <div className="logo">
            <span className="logo-name">Harvest</span>
            <span className="logo-sub">meal planner</span>
          </div>

          {plannedDayCount > 0 && (
            <p className="planned-count">{plannedDayCount} of 7 days planned this week</p>
          )}
        </div>

        <nav className="tabs scroll-row">
          {/* .map() turns the TABS array into one button per tab */}
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={active === tab.id ? 'tab active' : 'tab'}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
