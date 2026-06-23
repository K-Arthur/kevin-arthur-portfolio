# Kevin Arthur - Personal Portfolio v2.0

This is the source code for the personal portfolio of Kevin Arthur. This project showcases his work, skills, and professional background using a modern, immersive design featuring glassmorphism, dark mode, and subtle 3D elements.

## ✨ Features

-   **Modern Tech Stack:** Built with Next.js 14 (App Router) for optimal performance and SEO.
-   **Responsive Design:** Fully responsive layout that looks great on all devices, from mobile to desktop.
-   **Glassmorphic UI:** A beautiful, layered UI with blurred, semi-transparent elements.
-   **Advanced Dark Mode:** A stunning, high-contrast dark theme managed with `next-themes`.
-   **Immersive 3D Elements:** An interactive 3D object on the homepage built with `react-three-fiber`.
-   **Dynamic Work Portfolio:** A filterable, responsive grid that automatically populates with your projects, categorized into UI/UX and Graphic Design.
-   **Smooth Animations:** Fluid animations and micro-interactions powered by Framer Motion.
-   **Data-Driven Content:** Centralized data management makes content updates simple and code-free.
-   **MDX for Case Studies:** Rich, component-based content for case studies.

## 🚀 Tech Stack

-   **Framework:** [Next.js](https://nextjs.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Animations:** [Framer Motion](https://www.framer.com/motion/)
-   **Theme Management:** [next-themes](https://github.com/pacocoursey/next-themes)
-   **3D Rendering:** [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) & [Drei](https://github.com/pmndrs/drei)
-   **Typography:** [Jost](https://fonts.google.com/specimen/Jost) and [Fira Code](https://fonts.google.com/specimen/Fira+Code) via `next/font`.
-   **Content:** [MDX](https://mdxjs.com/) for case studies.
-   **Deployment:** [Vercel](https://vercel.com/) with automated CI/CD from GitHub.

## 📂 Project Structure

Here is a high-level overview of the key directories in this project:

```
/kevin-arthur-portfolio
|-- content/            # MDX files for case studies
|-- public/             # Static assets (images, fonts, etc.)
|   |-- images/
|       |-- work/         # Folders for each project
|-- src/
|   |-- app/            # Next.js App Router pages and layouts
|   |-- components/     # Reusable React components (Header, Scene, etc.)
|   |-- data/           # Centralized data (portfolio-data.js, categories.json)
|-- tailwind.config.js  # Tailwind CSS configuration
|-- next.config.mjs     # Next.js configuration
```

## 🏁 Getting Started

To run the project locally, follow these steps:

### 1. Clone the Repository

```bash
git clone <repository-url>
cd kevin-arthur-portfolio
```

### 2. Install Dependencies

This project uses npm as the package manager.

```bash
npm install
```

### 3. Run the Development Server

```bash
npm run dev
```

The site will be available at [http://localhost:3000](http://localhost:3000).

---

## 📝 Content Management

This project is designed for easy content updates without needing to modify the React components.

### Personal Info, Skills, Experience, and Education

All personal and professional data is managed in a single file:

-   **File Path:** `src/data/portfolio-data.js`

### Work Portfolio Projects

The work portfolio is generated dynamically. To add or manage projects, follow these steps:

1.  **Add Project Assets:**
    -   Create a new folder inside `public/images/work/`.
    -   The folder name should match the project name exactly as it will appear in the categories file (e.g., `My Awesome Project`).
    -   Place all images and videos for the project inside this new folder.
    -   The first image found will automatically be used as the thumbnail.

2.  **Assign to a Category:**
    -   Open the `src/data/categories.json` file.
    -   Add the exact project name (matching the folder name) to the `"projects"` array of the desired category (e.g., `"UI/UX Design"` or `"Graphic Design & Branding"`).

### Case Studies

Case studies are written in MDX, allowing you to use Markdown and custom components.

1.  **Create a file:** Add a new `.mdx` file in the `content/case-studies/` directory.
2.  **Add frontmatter:** Include the title, publication date, and a brief summary at the top of the file.

### Professional Headshot

To update your headshot on the "About" page, replace the file at `public/placeholder-headshot.png` with your photo. Keep the filename the same.

---

## 🎨 Customization

### Theme & Colors

The color palette for both light and dark modes is defined using CSS variables in `src/app/globals.css`. You can modify these variables to change the site's color scheme.

Look for the `:root` and `.dark` selectors to adjust the color scheme to your liking.

### 3D Scene

The immersive 3D sphere on the homepage can be customized.

-   **File Path:** `src/components/Scene.js`

You can change the object's color, distortion, speed, and other properties within the `AnimatedSphere` component.

---

## ⚡ Performance Optimizations

This portfolio is optimized for fast loading and smooth interactions across all devices.

### Key Optimizations Implemented

#### 1. Lazy Loading & Code Splitting
- 3D Scene component loads asynchronously via dynamic imports
- Reduces initial bundle size by ~40%
- Prevents blocking of critical content rendering
- Graceful loading fallback with animated placeholder

#### 2. Adaptive Quality System
Automatically adjusts 3D rendering quality based on device capabilities.

**Performance Impact:**
- Mobile: 70% reduction in geometry complexity
- Maintains visual quality on capable devices
- Adaptive frame rate (30fps mobile, 60fps desktop)

#### 3. Smart Rendering
- Viewport-based rendering (stops when tab hidden)
- Frame-rate throttling based on device quality
- Demand-based rendering (only renders when scene changes)
- Material simplification on low-end devices

#### 4. Animation Optimization
- Reduced animation delays for faster perceived performance
- Progressive content loading (text → 3D → full interactions)
- Optimized Framer Motion transitions

### Performance Metrics

#### Target Core Web Vitals
- **LCP** (Largest Contentful Paint): < 2.0s
- **FID** (First Input Delay): < 50ms
- **CLS** (Cumulative Layout Shift): < 0.05
- **FCP** (First Contentful Paint): < 1.5s
- **TBT** (Total Blocking Time): < 150ms

### Testing Performance

#### Using Lighthouse (Recommended)
1. Open Chrome DevTools (F12)
2. Navigate to Lighthouse tab
3. Select Performance category
4. Run audit for Mobile and Desktop
5. Target score: > 90

#### Real Device Testing
Always test on actual devices, not just DevTools emulation.

### Monitoring Setup (Optional)

Install web-vitals to track performance:
```bash
npm install web-vitals
```

See documentation for implementation details.

---