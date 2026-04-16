# Styling Quick Reference - Module 10 Implementation

## Color Palette Quick Replace

### Old Blue → New Indigo
```
Blue-600 (#2563EB)  → Indigo-600 (#4F46E5)
Blue-500 (#3B82F6)  → Indigo-500 (#6366F1)
Blue-100 (#DBEAFE)  → Indigo-100 (#E0E7FF)
Blue-50  (#EFF6FF)  → Indigo-50  (#EEF2FF)
```

### Commonly Used Classes
- Primary button: `btn btn-primary` (instead of `bg-blue-600 text-white`)
- Secondary button: `btn btn-secondary`
- Danger: `btn btn-danger`  
- Link/Ghost: `btn btn-ghost`

## Component Styling Templates

### Form Input
```jsx
// OLD
<input className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />

// NEW
<input className="input" />
```

### Card Container
```jsx
// OLD
<div className="bg-white rounded-lg shadow-md border border-gray-200">

// NEW
<div className="card">
  <div className="card-body">...</div>
</div>
```

### Buttons
```jsx
// OLD (primary)
<button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">

// NEW
<button className="btn btn-primary">
```

### Badges/Pills
```jsx
// OLD
<span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">

// NEW
<span className="badge badge-primary">
```

### Tables
```jsx
// OLD
<table className="w-full">

// NEW
<div className="table-wrapper">
  <table className="table">
```

### Skeleton Loaders
```jsx
// OLD
<div className="bg-gray-200 rounded-lg animate-pulse h-32 w-full">

// NEW
<div className="skeleton h-32">
```

## Button Styles Reference

```jsx
// Primary (Indigo, Main CTA)
<button className="btn btn-primary">Click Me</button>

// Secondary (White, Outline)
<button className="btn btn-secondary">Cancel</button>

// Danger (Red, Destructive)
<button className="btn btn-danger">Delete</button>

// Ghost (Transparent, Hover shows bg)
<button className="btn btn-ghost">More Info</button>

// Sizes
<button className="btn btn-sm">Small</button>
<button className="btn btn-lg">Large</button>

// Icon Button (Square, minimal padding)
<button className="btn-icon"><Icon size={20} /></button>

// Disabled State
<button className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed">Save</button>
```

## Common Replacements Cheatsheet

| Old Pattern | New Pattern | Usage |
|---|---|---|
| `bg-blue-600 text-white` | `btn btn-primary` | Primary buttons |
| `bg-white border border-gray-200` | `card` | Cards/containers |
| `border-gray-300 rounded-lg` | `input` | Form inputs |
| `text-sm font-semibold text-blue-600` | `badge badge-primary` | Status badges |
| `transform scale-105` | Group hover is included | Scale effects |
| `shadow-md` | `.card:hover { @apply shadow-lg }` | Hover shadows |
| `rounded-lg` | Vary by component (10-16px) | Border radius |
| `hover:text-blue-600` | `hover:text-indigo-600` | Link colors |
| `focus:ring-2 focus:ring-blue-500` | Handled by `.input` | Focus states |
| `divide-y` | `.divider` + margin wrapper | Dividers |

## Responsive Utilities (Tailwind)

```jsx
// Mobile first approach
<div className="block sm:hidden">Mobile only</div>
<div className="hidden md:block">Desktop only</div>

// Grids
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
```

Breakpoints:
- `sm`: 640px
- `md`: 768px  
- `lg`: 1024px
- `xl`: 1280px

## Icon Integration (lucide-react)

```jsx
import { ShoppingCart, Heart, Search, Menu, X, Home, LogOut } from 'lucide-react';

<ShoppingCart size={20} className="text-indigo-600" />
<Heart size={20} className="text-red-500" />
```

Common sizes: 16, 18, 20, 24, 28, 32, 40, 48

## Transition utilities

```jsx
// Smooth transition on hover/active
<button className="transition-all duration-300 hover:shadow-lg">

// Specific transitions
<button className="transition-colors duration-200">
<button className="transition-transform duration-300">

// Durations: 75ms, 100ms, 150ms, 200ms, 300ms, 500ms, 700ms, 1000ms
```

## Z-index Stack

```
z-50: Modals, Drawers
z-40: Backdrops
z-30: Dropdowns
z-10: Normal content
```

## Example: Complete Component Update

```jsx
// BEFORE
export default function MyComponent() {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Title</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Field</label>
          <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500" />
        </div>
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
          Submit
        </button>
      </form>
    </div>
  )
}

// AFTER
export default function MyComponent() {
  return (
    <div className="card">
      <div className="card-header">
        <h2>Title</h2>
      </div>
      <div className="card-body">
        <form className="space-y-4">
          <div className="form-group">
            <label className="label">Field</label>
            <input type="text" className="input" />
          </div>
          <button className="btn btn-primary w-full">
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}
```

## Testing Responsive Design

Use browser DevTools:
- iPhone SE: 375px width
- iPad: 768px width
- Desktop: 1280px+ width

Or use Tailwind's responsive preview:
- Prefix with `sm:`, `md:`, `lg:`, `xl:` for breakpoint-specific styles

---

**Keep this reference handy when updating remaining components!**
