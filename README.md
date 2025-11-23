# Assignment Project

This project implements an interactive data table backed by a JSON server containing **1000+ rows**. The application includes search, sorting, filtering, row selection, and viewing state toggles. Basic UI-driven tests are included.

---

## Dependencies

The project uses the following key dependencies:

| Dependency               | Purpose                                                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------------------------- |
| **React + Vite**         | --                                                                                                            |
| **Faker**                | Used to generate large sets of mock ninja data (1000+ entries). _(Note: adds noticeable bundle size.)_        |
| **TanStack React Table** | Provides table logic for sorting, filtering, and row selection.                                               |
| **ShadCN UI**            | UI components and theme system throughout the project.                                                        |
| **Base UI**              | Used specifically for the dropdown component due to better performance compared to Radix with large datasets. |
| **TailwindCSS**          | Utility-first CSS framework for styling.                                                                      |
| **Vitest**               | Testing.                                                                                                      |

## 🛠️ Setup & Running the Project

Follow the steps below to install and run the project locally:

```sh
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

## Simulated Network Latency

The application introduces an artificial delay inside the `useNinjasData.ts` hook (`src/api/`) to mimic real backend response time. This allows the interface to properly display:

- **Loading states**
- **Error states**
- **Retry-safe UI behaviors**

This makes the experience closer to handling a live API rather than instant static data.

## Rendering Strategy

No **pagination** or **virtualization** (such as tanstack virtualizer or react-window or) was used on purpose. Instead, the project focuses on optimizing rendering performance for large datasets (1000+ rows) using modern React capabilities:

- `useTransition` — keeps the UI responsive during search filters, ui became unresponsive when clearing the search as more nodes needs to be added in dom, by using transtion and isPending state we are giving user feedback of update while the page is updated.
- `useDeferredValue` — prevents UI blocking when calculating **visible** selected rows, we could have done on submit, but i wanted to give feedback of how many rows are selected. Say we have 2 critical rows and 1 healthy row, now if i apply a filter of only healthy, then the **visible** rows will be only 1.
- `useDebounceCallback` — reduces unnecessary computation when users type quickly
- `React.memo` Reduces unnecessary re-renders for table rows and cells.

### P.S.

If you'd like to see this project extended with table **virtualization support** (e.g., using `react-virtual` or similar performance strategies), feel free to open an issue or leave a comment in the repository. I’d be happy to explore and implement it.
