# Salt & Light

Salt & Light is a mobile-first Christian personal-growth app that turns goals, devotions, and spiritual habits into an RPG-style progression system.

Built as a React web app, installable PWA, and Capacitor-powered native mobile app.

## Core features

* Google sign-in through Supabase Auth
* Character creation, RPG-style leveling, XP, faith, jobs, skills, and equipment
* Daily, weekly, and long-term goal planning
* Devotion journaling with built-in Bible passage selection and monthly progress tracking
* Achievements, activity history, friend requests, and in-app mail
* Character profile and devotion-progress image exports
* Responsive desktop, tablet, and mobile layouts
* Installable Progressive Web App
* Android native wrapper; iOS wrapper is configured through Capacitor

## Architecture

```text
React UI
  ├─ React Router routes and protected pages
  ├─ TanStack Query server-state cache
  ├─ AuthContext session state
  ├─ TailwindCSS + Radix UI components
  └─ Supabase client
       ├─ Auth
       ├─ PostgreSQL database
       ├─ Row Level Security
       └─ PostgreSQL RPC functions
```

## Tech stack

| Area                   | Technology                                     |
| ---------------------- | ---------------------------------------------- |
| Frontend               | React 18, React DOM                            |
| Build tool             | Vite 6                                         |
| Routing                | React Router DOM                               |
| Styling                | TailwindCSS, PostCSS, Autoprefixer             |
| UI primitives          | Radix UI                                       |
| Component utilities    | class-variance-authority, clsx, tailwind-merge |
| Icons                  | Lucide React                                   |
| Animation              | Framer Motion, GSAP                            |
| State and data caching | TanStack React Query                           |
| Forms and validation   | React Hook Form, Hookform Resolvers, Zod       |
| Backend                | Supabase                                       |
| Database               | Supabase PostgreSQL                            |
| Authentication         | Supabase Auth + Google OAuth                   |
| Data security          | Supabase Row Level Security                    |
| Database logic         | Supabase PostgreSQL RPC functions              |
| PWA                    | vite-plugin-pwa, Workbox                       |
| Native mobile          | Capacitor Core, Android, and iOS               |
| Android build          | Gradle, AndroidX, Android Studio               |
| iOS build              | Capacitor iOS, Xcode                           |
| Deployment             | Vercel                                         |
| Source control         | Git and GitHub                                 |
| Development editor     | Visual Studio Code                             |
| Date handling          | date-fns, Moment.js                            |
| Notifications          | Sonner, React Hot Toast                        |
| Image export           | html2canvas                                    |
| PDF export             | jsPDF                                          |
| Charts                 | Recharts                                       |
| Drag and drop          | @hello-pangea/dnd                              |
| Carousel               | Embla Carousel                                 |
| Maps                   | React Leaflet                                  |
| Rich text              | React Markdown, React Quill                    |
| Command menu           | cmdk                                           |
| Drawers                | Vaul                                           |
| 3D capability          | Three.js                                       |
| Effects                | canvas-confetti                                |
| Theme support          | next-themes                                    |
| Base project tooling   | Vite plugin                                    |

## UI system

Salt & Light uses TailwindCSS for layout, responsive behavior, spacing, typography, colors, and state styling.

The reusable component layer is built with Radix UI primitives:

* Accordion
* Alert Dialog
* Aspect Ratio
* Avatar
* Checkbox
* Collapsible
* Context Menu
* Dialog
* Dropdown Menu
* Hover Card
* Label
* Menubar
* Navigation Menu
* Popover
* Progress
* Radio Group
* Scroll Area
* Select
* Separator
* Slider
* Slot
* Switch
* Tabs
* Toast
* Toggle
* Toggle Group
* Tooltip

Visual elements include Lucide icons, Inter and Space Grotesk Google Fonts, Framer Motion page transitions, animated feedback, responsive navigation, safe-area support for mobile devices, and PWA standalone display mode.

## Authentication flow

Salt & Light currently uses Google OAuth as the public sign-in method.

1. A visitor selects **Continue with Google**.
2. The app calls `supabase.auth.signInWithOAuth()` with Google as the provider.
3. Supabase redirects the user to Google for authentication and consent.
4. Google redirects the user back to `/login`.
5. Supabase restores the authenticated session.
6. `AuthContext` listens for auth-state changes and stores the current user.
7. `ProtectedRoute` blocks app routes until authentication is confirmed.
8. The app reads and writes user-owned data through Supabase with Row Level Security.

The auth layer also contains password sign-in, sign-up, password recovery, password update, and sign-out helpers for future use. The current login screen intentionally exposes Google sign-in only.

## Supabase

Supabase provides:

* Google OAuth authentication
* Persistent sessions
* PostgreSQL database storage
* Row Level Security policies
* User metadata storage, including Bible-version preferences
* CRUD operations for app entities
* RPC functions for friend profiles and friendship handling
* Database-backed feedback, mail, activity logs, characters, goals, devotions, friendships, and progression data

Required environment variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Never commit real Supabase keys, service-role keys, `.env` files, or Google OAuth secrets.

## Progressive Web App

The app uses `vite-plugin-pwa` with automatic service-worker updates.

PWA configuration includes:

* App name: `Salt & Light`
* Standalone display mode
* Portrait orientation
* Installable home-screen experience
* 192×192 and 512×512 app icons
* Maskable 512×512 icon
* Theme color: `#1f7a45`
* Start URL and scope configured at `/`
* Development PWA support enabled

## Native mobile app

Capacitor packages the built web app into native mobile projects.

```text
App ID: com.glennpimentel.saltandlight
App name: Salt & Light
Web build directory: dist
```

### Android

The Android project uses:

* Capacitor Android
* Gradle
* AndroidX AppCompat
* AndroidX CoordinatorLayout
* AndroidX Core SplashScreen
* Android Studio for emulator testing, debugging, APK generation, and release builds

`google-services.json` is supported when Firebase services such as push notifications are configured.

### iOS

The project includes Capacitor iOS support. Use Xcode for simulator testing, signing, archiving, and App Store distribution.

## Local development

### Prerequisites

* Node.js 20+
* npm
* Git
* Supabase project
* Visual Studio Code recommended
* Android Studio for Android development
* Xcode on macOS for iOS development

### Install

```bash
git clone https://github.com/YOUR_USERNAME/salt-light.git
cd salt-light
npm install
```

Create a local environment file:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Start the development server:

```bash
npm run dev
```

Open the local URL shown by Vite, usually:

```text
http://localhost:5173
```

## Available scripts

```bash
npm run dev        # Start the Vite development server
npm run build      # Create a production web build in /dist
npm run preview    # Preview the production build locally
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues where possible
npm run typecheck  # Run TypeScript/JavaScript configuration checks
```

## Build Android APK

```bash
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```

The debug APK is normally generated at:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

For release work, open the `android` folder in Android Studio and create a signed release build.

## Build iOS

macOS and Xcode are required.

```bash
npm run build
npx cap sync ios
npx cap open ios
```

Use Xcode to run the app on a simulator or device, configure signing, archive the app, and submit it to App Store Connect.

## Deployment

The web app is designed for Vercel deployment.

Before deployment:

1. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to Vercel environment variables.
2. Add the deployed Vercel URL to Supabase Auth redirect URLs.
3. Add the same URL to the Google OAuth authorized redirect configuration through Supabase.
4. Deploy the Vite app with:

```bash
npm run build
```

Vercel should use:

```text
Build command: npm run build
Output directory: dist
```

## Dependency inventory

### Runtime dependencies

```text
@capacitor/android
@capacitor/cli
@capacitor/core
@capacitor/ios
@hello-pangea/dnd
@hookform/resolvers
@radix-ui/react-accordion
@radix-ui/react-alert-dialog
@radix-ui/react-aspect-ratio
@radix-ui/react-avatar
@radix-ui/react-checkbox
@radix-ui/react-collapsible
@radix-ui/react-context-menu
@radix-ui/react-dialog
@radix-ui/react-dropdown-menu
@radix-ui/react-hover-card
@radix-ui/react-label
@radix-ui/react-menubar
@radix-ui/react-navigation-menu
@radix-ui/react-popover
@radix-ui/react-progress
@radix-ui/react-radio-group
@radix-ui/react-scroll-area
@radix-ui/react-select
@radix-ui/react-separator
@radix-ui/react-slider
@radix-ui/react-slot
@radix-ui/react-switch
@radix-ui/react-tabs
@radix-ui/react-toast
@radix-ui/react-toggle
@radix-ui/react-toggle-group
@radix-ui/react-tooltip
@stripe/react-stripe-js
@stripe/stripe-js
@supabase/supabase-js
@tanstack/react-query
canvas-confetti
class-variance-authority
clsx
cmdk
date-fns
embla-carousel-react
framer-motion
gsap
html2canvas
input-otp
jspdf
lodash
lucide-react
moment
next-themes
react
react-day-picker
react-dom
react-hook-form
react-hot-toast
react-leaflet
react-markdown
react-quill
react-resizable-panels
react-router-dom
recharts
sonner
tailwind-merge
tailwindcss-animate
three
vaul
zod
```

### Development dependencies

```text
@eslint/js
@types/node
@types/react
@types/react-dom
@vitejs/plugin-react
autoprefixer
baseline-browser-mapping
eslint
eslint-plugin-react
eslint-plugin-react-hooks
eslint-plugin-react-refresh
eslint-plugin-unused-imports
globals
postcss
tailwindcss
typescript
vite
vite-plugin-pwa
```

## Project purpose

Salt & Light is designed to make intentional Christian growth easier to see, sustain, and reflect on—one goal, devotion, habit, and faithful day at a time.
