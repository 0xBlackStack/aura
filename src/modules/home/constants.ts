export const PROJECT_TEMPLATES = [
    {
        emoji: "🎬",
        title: "Build a Netflix clone",
        prompt:
            "Build a complete Netflix-style homepage using React and modern best practices. Use Tailwind CSS for styling and Framer Motion for animations. Include all required dependencies explicitly (react, react-dom, framer-motion, tailwindcss). Create a cinematic hero banner that animates in on initial page load using spring-based motion. Use a dark, glassy gradient background with subtle animated noise or grain effects implemented via CSS. Movie rows should support smooth horizontal scrolling with inertia, and movie cards should animate on hover with scale, slight 3D tilt, glow, and shadow transitions. Use mock data stored locally. Add staggered entrance animations for each section. Implement a glassmorphic modal component that opens on card click, using backdrop blur, opacity transitions, scale animation, and proper mount/unmount exit animations via Framer Motion. Ensure dark mode throughout, high contrast typography, and red neon accent highlights. Avoid external APIs and ensure the project runs without runtime errors.",
    },
    {
        emoji: "📦",
        title: "Build an admin dashboard",
        prompt:
            "Create a fully functional admin dashboard using React, Tailwind CSS, and Framer Motion. Include all necessary dependencies and imports explicitly to avoid build errors. Build a fixed sidebar layout with animated navigation items that slide and glow on hover and animate active states. Create stat cards that animate numeric values counting up on mount using local state. Add chart placeholders using simple divs (no external chart libraries) with subtle animated grid backgrounds. Implement a data table with mock data, animated row hover states, filtering, and pagination handled via local state. Use staggered entrance animations for dashboard sections. Apply glassmorphic card styles, subtle neon blue and teal accents, and restrained motion designed to guide attention without overwhelming usability.",
    },
    {
        emoji: "📋",
        title: "Build a kanban board",
        prompt:
            "Build a fully working kanban board using React with react-beautiful-dnd for drag-and-drop and Framer Motion for animations. Explicitly include and import all required dependencies. Create multiple columns with consistent widths and spacing. Tasks should be stored in local state. Animate task movement, reordering, adding, and removal using spring physics and layout animations. Add hover elevation and shadow effects on cards, glowing borders while dragging, and animated empty column states. Use glassmorphic column containers, dark mode styling, neon accent colors, and smooth motion transitions to create a tactile, responsive experience without relying on any backend or external APIs.",
    },
    {
        emoji: "🗂️",
        title: "Build a file manager",
        prompt:
            "Build a modern file manager UI using React, Tailwind CSS, and Framer Motion. Explicitly install and import all required dependencies. Create a glassy sidebar for folders and a responsive grid layout for files. Use mock file and folder data stored in local state. Animate files and folders on hover with scale, glow, and shadow effects. Implement rename and delete actions with smooth animated transitions where items fade, slide, and reflow using layout animations. Add animated context menus using Framer Motion. Ensure dark mode styling, soft neon highlights, and error-free local-only logic.",
    },
    {
        emoji: "📺",
        title: "Build a YouTube clone",
        prompt:
            "Build a YouTube-style homepage using React, Tailwind CSS, and Framer Motion with all dependencies explicitly defined. Create a clean grid layout of mock video thumbnails stored in local state. Animate video cards with fade-and-slide entrance animations on initial render. Add hover preview effects using scale and shadow transitions. Implement an animated category sidebar. Create a glassmorphic modal preview component that opens on click with spring-based scale and opacity animations. Use scroll-based animations where appropriate. Ensure dark mode, restrained red accent usage, and no external APIs.",
    },
    {
        emoji: "🛍️",
        title: "Build a store page",
        prompt:
            "Build a complete e-commerce store page using React, Tailwind CSS, and Framer Motion with all required dependencies included. Use mock product data stored in local state. Create category filters with smooth animated transitions between filtered states. Design glassy product cards that animate on hover and press. Implement a local shopping cart with add and remove functionality, animated cart count updates, sliding item entries, and bounce feedback for interactions. Use warm accent colors for call-to-action buttons, clear typography for trust, and ensure all animations are smooth, consistent, and error-free.",
    },
    {
        emoji: "🏡",
        title: "Build an Airbnb clone",
        prompt:
            "Build an Airbnb-style listings interface using React, Tailwind CSS, and Framer Motion with explicit dependency setup. Display mock property listings in a responsive grid. Animate cards on initial load with staggered entrance animations and on hover with lift and shadow effects. Add a glassy filter sidebar that slides in and out smoothly. Implement a property detail modal with backdrop blur, soft scale, and opacity transitions. Use warm neutral colors, gentle easing curves, and calm motion to create a welcoming, trustworthy experience without using external APIs.",
    },
    {
        emoji: "🎵",
        title: "Build a Spotify clone",
        prompt:
            "Build a Spotify-style music player UI using React, Tailwind CSS, and Framer Motion. Explicitly include and import all required dependencies. Create a sidebar for playlists and a main content area for song details using mock data in local state. Animate playlist selection, song changes, and playback controls with smooth spring-based transitions. Add animated progress bars, pulsing play states, and subtle background glow effects tied to playback state changes. Use dark glass surfaces, neon green accent highlights, fluid layout animations, and ensure the project runs without missing imports or runtime errors.",
    }
] as const;
