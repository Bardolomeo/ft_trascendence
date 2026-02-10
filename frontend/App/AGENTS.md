# AGENTS.md - ft_transcendence Frontend

## Role
Act as a senior web developer building the frontend for ft_transcendence (42school project, year 2025).

## Tech Stack
- **TypeScript** - Primary language
- **HTML** - Template markup
- **CSS** - Styling via TailwindCSS
- **TailwindCSS v4.1.12** - Utility-first CSS framework
- **@tailwindcss/cli** - Build tool for Tailwind

## Libraries & Dependencies
- **Fastify** (^5.5.0) - Web framework
- **@fastify/static** (^8.2.0) - Static file serving
- **@fastify/formbody** (^8.0.2) - Form body parsing

## Project Structure

```
frontend/App/
├── src/
│   ├── components/           # Route pages and reusable components
│   │   ├── orchestrator.ts   # Component framework core
│   │   ├── orchestrator/
│   │   │   ├── props.ts      # Props system implementation
│   │   │   └── utils.ts      # Framework utilities
│   │   ├── home/             # Root route (/)
│   │   │   ├── index.html    # Route entry point
│   │   │   └── comps/        # Route-specific components
│   │   │       └── GradientBackground.html
│   │   └── login/            # /login route
│   │       └── index.html
│   ├── scripts/              # Client-side TypeScript (compiled to JS)
│   │   └── login.ts
│   ├── public/
│   │   └── style/
│   │       ├── main.css      # Tailwind input
│   │       └── output.css    # Compiled Tailwind output
│   ├── routes/               # Fastify route handlers
│   │   ├── routes_all_get.ts # GET route handler using orchestrator
│   │   └── login.ts          # Auth routes
│   ├── index.ts              # Fastify server entry
│   ├── routing.ts            # Route logic
│   └── tailwind.config.ts    # Tailwind configuration
├── package.json
└── tsconfig.json             # Scripts compilation config
```

## Component Framework

The project uses a custom server-side HTML component framework defined in `src/components/orchestrator.ts`.

### Routing System

Routes map to directories inside `src/components/`:
- `/` → `src/components/home/index.html`
- `/login` → `src/components/login/index.html`
- `/profile` → `src/components/profile/index.html`

**Rules:**
- Each route directory contains an `index.html` file as the entry point
- The `home` directory is the base route (`/`)
- Component files (PascalCase) can exist anywhere in `src/components/`

### Component System

Components are HTML files that start with a capital letter (PascalCase).

**Component Discovery:**
- Components are auto-discovered recursively in `src/components/`
- Component filename must match class name (e.g., `GradientBackground.html`)
- Duplicate component names will error

**Component Usage:**
```html
<!-- In src/components/home/index.html -->
<body>
  <section class="GradientBackground">
  </section>
</body>
```

When an element has a class matching a component name, that component's HTML content is appended inside the element server-side.

### Props System

Props are declared using `$propName="value"` syntax on elements with component classes:

```html
<!-- Parent: src/components/home/index.html -->
<div class="Example" $bgColor="bg-red-600" $title="Welcome">
</div>
```

```html
<!-- Component: src/components/Example.html -->
<div class=$bgColor>
  <h1>$title</h1>
</div>
```

```html
<!-- Result (server-rendered) -->
<div class="Example" $bgColor="bg-red-600" $title="Welcome">
  <div class="bg-red-600">
    <h1>Welcome</h1>
  </div>
</div>
```

**Rules:**
- Props are declared with `$propName="value"` (without quotes around prop name in component)
- Props are exploded where `$propName` is found in child components
- Props are scoped to the component instance

### Component Nesting

Components can contain other components. The framework recursively processes all components until all are resolved.

## Scripts & Client-Side JS

TypeScript files in `src/scripts/` are compiled to non-module JavaScript files using `tsconfig.json`.

**Important:** HTML scripts cannot directly call functions from ES modules. The `tsconfig.json` compiles scripts with `"module": "none"` so functions are globally available.

```html
<!-- Reference compiled JS (not TS) -->
<script src="/scripts/login.js" onload="loadElements()"></script>
```

**Build Command:**
```bash
npm run watch-build-scripts
```

## Styling with TailwindCSS

**Version:** v4.1.12 (using new @tailwindcss/cli)

**Configuration:** `src/tailwind.config.ts`

**Custom Colors:**
- `zr-cream` - #ffc073
- `zr-darker-green` - #001d23
- `zr-dark-green` - #003232
- `zr-green` - #004f4d
- `zr-light-green` - #009479
- `zr-dark-orange` - #ad2f17
- `zr-orange` - #dd5928
- `zr-light-orange` - #ff8000

**Build Commands:**
```bash
# Development with watch mode
npm run dev

# One-time build and start
npm start
```

## Backend Integration

The frontend proxies requests to backend services via nginx:

- **Authentication:** `POST /login` → `https://nginx/signin`
- **Registration:** `POST /register` → `http://auth:3000/signUp`

**Static Assets:**
- `/public/` → `src/public/`
- `/scripts/` → `src/scripts/`
- `/components/` → `src/components/`

## Development Workflow

1. **Create a new route:**
   ```bash
   mkdir src/components/{routeName}
   touch src/components/{routeName}/index.html
   ```

2. **Create a component:**
   ```bash
   touch src/components/{RouteName}/comps/MyComponent.html
   ```

3. **Use the component:**
   ```html
   <div class="MyComponent" $prop="value"></div>
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

## Best Practices

- Use PascalCase for component filenames (e.g., `UserCard.html`)
- Place route-specific components in `src/components/{route}/comps/`
- Place shared components in `src/components/` root or subdirectories
- Use Tailwind utility classes for styling
- Compile TypeScript scripts before testing (or use `watch-build-scripts`)
- Test routes at `http://localhost:3000/{route}`
- Component class names in HTML must exactly match component filenames (without .html)

## File Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Route entry | `index.html` | `src/components/home/index.html` |
| Components | PascalCase.html | `UserProfile.html` |
| Scripts | camelCase.ts | `login.ts` → `login.js` |
| Routes | camelCase.ts | `routes_all_get.ts` |
