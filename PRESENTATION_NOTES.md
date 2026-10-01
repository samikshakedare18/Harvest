# Presentation notes — Harvest Meal Planner

## One-line pitch
"A React app where you browse recipes, plan your week's meals, and get a shopping list generated automatically."

## The React concepts used (and only these)

| Concept | Where to show it | Simple explanation |
|---|---|---|
| **Components** | every file in `components/` | Small reusable pieces of UI. Each is a function that returns JSX. |
| **JSX** | any component | HTML-looking code written inside JavaScript. `{ }` lets you put JS values inside it. |
| **Props** | `App.jsx` → `Home`, `Planner`… | How a parent passes data/functions to a child, like function arguments. |
| **useState** | `App.jsx` (`activeTab`), `RecipeLibrary.jsx` (`query`) | Memory for a component. When it changes, React re-draws the screen. |
| **Event handling** | `onClick`, `onChange` | Running a function when the user clicks or types. |
| **Lists with .map() and key** | `RecipeLibrary.jsx`, `Header.jsx` | Turn an array into many elements. `key` helps React track each item. |
| **Conditional rendering** | `App.jsx` tabs, `{openRecipe && ...}` | Show something only if a condition is true (`&&`, `? :`). |
| **useEffect** | `hooks/useMealPlan.js` | Run code after a change — here, save to localStorage whenever the plan changes. |
| **Custom hook** | `hooks/useMealPlan.js` | Our own function starting with `use` that holds state + logic, so components stay simple. |

## How the app flows (say this while demoing)
1. `main.jsx` starts React and imports `style.css`.
2. `App.jsx` keeps two states: which tab is open, which recipe pop-up is open. It also calls `useMealPlan()` to get the plan.
3. Depending on `activeTab`, App shows Home, Recipes, Planner or Shopping list.
4. Data flows **down** as props. Actions flow **up** as functions (e.g. `onView`, `assignMeal`).
5. Recipes live in `data/recipes.js` — plain JavaScript objects, no backend.

## Why CSS in `style.css` (not Tailwind)
- One normal CSS file; every class name in JSX (`className="recipe-card"`) matches a rule in the file.
- Colours are CSS variables (`--forest`, `--gold`) at the top, so changing the theme means editing one place.
- Phone-first: base styles are for mobile, `@media (min-width: ...)` adds desktop layout.
- Dynamic style example: `className={active === tab.id ? 'tab active' : 'tab'}`.

## Likely questions & easy answers

**Q: What is React?**
A JavaScript library for building UIs out of components. You describe what the screen should look like for the current data, and React updates it when data changes.

**Q: What is a component?**
A function that returns JSX. Example: `RecipeCard` is written once and used for every recipe.

**Q: What are props? How are they different from state?**
Props come *from the parent* and are read-only. State is *owned by the component* and can be changed with its setter (`setQuery`).

**Q: What does useState do?**
`const [query, setQuery] = useState('')` — `query` is the current value, `setQuery` changes it, `''` is the starting value. Calling `setQuery` makes React re-render.

**Q: What is useEffect and why did you use it?**
It runs code after render when something changes. `useEffect(() => saveState(...), [plan])` saves the plan to localStorage every time `plan` changes. The `[plan]` is the dependency list.

**Q: Why the `key` in `.map()`?**
So React can identify which item is which when the list changes. We use the recipe's unique `id`.

**Q: Why don't you change state directly (e.g. `plan.Monday.Lunch = 'r3'`)?**
React only notices changes made through the setter. We copy with the spread operator (`{ ...plan, [day]: {...} }`) and pass the new object to `setPlan`.

**Q: How does search/filter work?**
`recipes.filter(...)` keeps only recipes matching the typed text, category and cuisine. Each keystroke updates state → React re-renders → the filtered list changes.

**Q: How is the shopping list made?**
In `useMealPlan.js`: loop over every planned meal, take each ingredient, and group by ingredient name so duplicates become one row.

**Q: Where is data stored? Is there a database?**
No database. Recipes are in `recipes.js`. The user's plan is saved in the browser's `localStorage` (`utils/storage.js`), so it survives refresh.

**Q: What is a custom hook?**
A normal function whose name starts with `use` and which can use other hooks. `useMealPlan` bundles plan state + helper functions so `App` stays short.

**Q: What is `import`/`export`?**
Lets us split code into files. `export default` makes a file's main thing importable elsewhere.

**Q: What is Vite?**
The tool that runs the dev server (`npm run dev`) and builds the project (`npm run build`).

**Q: How would you add a new recipe?**
Add an object to the array in `data/recipes.js`. Search, filters, planner and shopping list pick it up automatically.

**Q: What does `e.stopPropagation()` do in the modal?**
The dark background closes the pop-up on click. Clicks inside the white box would "bubble up" to it, so we stop that.

## Run it
```
npm install
npm run dev
```
