# 🍳 Cook's Delight

Cook's Delight is a React-based recipe and cooking companion web application. It provides a structured experience for browsing recipes, viewing recipe details, discovering cooking tips, learning about the project, contacting the team, and managing user-facing profile and authentication flows.

The project is organized around user-facing domains such as recipes, recipe details, cooking tips, authentication, profile, contact, home, and about pages. Shared UI, layout, hooks, and reusable types are separated into common folders to support consistency across the application.

## 🏗️ Project Architecture & Strategy

> The project is currently transitioning to a Feature-Based Architecture. While core features are modularized in `src/features`, some logic remains centralized to ensure stability and meet the delivery deadline. A full migration to Feature-Sliced Design (FSD) is the primary goal for the next sprint.

## 🛠️ Tech Stack

| Category | Technology |
| --- | --- |
| UI Library | React 19 |
| Language | TypeScript |
| Build Tool | Vite |
| Routing | React Router |
| HTTP Client | Axios |
| Icons | React Icons |
| Code Quality | ESLint |
| Styling | CSS modules and feature-level stylesheets |

## 🚀 Features

- Home page with showcase and introduction sections
- Recipe listing and recipe detail pages
- Cooking tips page with modular content sections
- Authentication screens for login and registration
- Profile area with favorites support
- About Us and Contact pages
- Shared layout, reusable UI components, and common hooks
- Not Found page for unmatched routes

## 📁 Folder Structure

```text
public/
src/
+-- assets/                 # Static images, icons, logos, and page-specific media
+-- features/               # Domain-focused feature areas and their local components
+-- pages/                  # Top-level route pages and fallback screens
+-- shared/                 # Reusable components, layout, hooks, cards, and shared types
+-- styles/                 # Global and section-level styling
```

### 🧭 Organization Overview

- `src/features` contains the main product domains, including authentication, recipes, recipe details, profile, cooking tips, contact, about, home, and search.
- `src/shared` contains reusable building blocks such as layout components, UI elements, recipe cards, section grids, hooks, and shared types.
- `src/assets` stores visual assets grouped by page or feature.
- `src/pages` contains route-level pages and the `NotFound` fallback.
- `src/styles` contains global and reusable section styles.

## ⚙️ Getting Started

### ✅ Prerequisites

- Node.js
- npm

### 📦 Installation

```bash
npm install
```

### ▶️ Run the Development Server

```bash
npm run dev
```

The application will be available at the local URL printed by Vite, typically:

```text
http://localhost:5173
```

### 🏭 Build for Production

```bash
npm run build
```

### 🔍 Preview the Production Build

```bash
npm run preview
```

### 🧹 Lint the Project

```bash
npm run lint
```

## 🧭 Available Routes

- `/` - Home
- `/recipes` - Recipe listing
- `/recipes/:id` - Recipe details
- `/tips` - Cooking tips
- `/about` - About Us
- `/contact` - Contact
- `/profile` - User profile
- `/login` - Login
- `/register` - Registration

## 📝 Project Notes

This project uses Vite for fast local development and optimized production builds. Routing is managed with React Router, while feature-specific services, hooks, components, styles, and types are kept close to their related domain folders.

## 🔮 Future Roadmap

- Complete refactoring of the shared layer.
- Implementation of advanced state management (Zustand/Redux).
- Adding comprehensive Unit and Integration tests using Vitest.
