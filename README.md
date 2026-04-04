# Finance Dashboard 🚀

A modern, highly-responsive finance management dashboard built with React and Vite. This application provides a premium, data-driven experience for tracking income, expenses, and financial insights with sophisticated visualizations.

## ✨ Features

- **📊 Comprehensive Dashboard**: Get a birds-eye view of your financial health with interactive spending charts and recent activities.
- **📝 Transaction CRUD**: Full "Create, Read, Update, Delete" capabilities for transactions. Manage your history directly from the dedicated Transactions page.
- **🧩 Advanced Insights**:
  - **🔋 Cash Flow Battery**: A creative visualization tracking your net savings vs. drain.
  - **📉 Burn Rate Analysis**: Monitor "Silent Recurring Drains" (subscriptions) to optimize your budget.
  - **🥧 Categorized Spending**: Real-time radial and pie charts breaking down your monthly habits.
- **🛡️ Admin vs. User Modes**: Toggle between view-only "User" mode and a controlled "Admin" mode for secure transaction manipulation.
- **📱 Responsive by Design**: A custom CSS Grid system optimized for:
  - **Desktop (3 Columns)**: Full feature visibility.
  - **Tablet/Laptop (2 Columns)**: Intelligent reflow at 1100px.
  - **Mobile (1 Column)**: Slimmed-down, vertical stacked experience at 768px.
- **☁️ Local Persistence**: State is managed via a custom `useTransactions` hook that syncs instantly with `localStorage`, ensuring your data survives page reloads.

## 🛠️ Technology Stack

- **Framework**: [React.js](https://reactjs.org/)
- **Bundler**: [Vite](https://vitejs.dev/) (for lightning-fast development)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) (smooth page transitions and micro-interactions)
- **Charts**: [Recharts](https://recharts.org/) (RadialBar, Pie, and Area/Bar charts)
- **Styling**: Vanilla CSS (Modern CSS variables, Flexbox, and Grid)

## 🚀 Getting Started

Follow these steps to get the project running locally:

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (LTS version recommended).

### 2. Installation
Clone or move into the project directory and install dependencies:
```bash
npm install
```

### 3. Development Server
Start the local development server:
```bash
npm run dev
```
The app will typically be available at `http://localhost:5173`.

### 4. Production Build
To create an optimized production build:
```bash
npm run build
```

## 🧠 Architectural Approach

### 1. State Management Pattern
I opted for a **Hook-based central state** architecture. Instead of a heavy Redux setup, the project uses a custom `useTransactions.js` hook. This hook acts as the "Single Source of Truth," managing the `localStorage` interface and using custom events to trigger re-renders across disjointed components (like updating the Dashboard when a transaction is deleted on the Transactions page).

### 2. Design System & Layout
The application uses a **Glassmorphic design language** with:
- **Consistent Tokens**: Centralized variables for colors (Emerald, Slate, Rose) and spacing.
- **Custom Grid**: Avoided generic UI frameworks to maintain maximum control over the responsiveness breakpoints (specifically the 3-2-1 column reflow on the Insights page).

### 3. Optimization
- **Dynamic Calculation**: Memoized insights calculations ensures that complex math (like Net Cash Flow and Burn Rates) doesn't re-run on every render unless the transaction data actually changes.
- **Stable Scrollbars**: Implemented `scrollbar-gutter: stable` to prevent "layout jump" during navigation.

---
*Built with ❤️ for a better financial future.*
