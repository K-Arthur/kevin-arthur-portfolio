# Kevin Arthur — Product Designer & Design Engineer

Source code for [kevinarthur.design](https://www.kevinarthur.design),
a portfolio showcasing product design, design engineering, and
case studies for Varve, OpenCode Harness, and client work.

## What this site demonstrates

- Product design for complex workflows (local-first tools, AI interfaces)
- Design engineering: TypeScript, React, Next.js, Framer Motion
- Component systems, motion design, and accessibility

## Tech stack

- **Framework:** [Next.js](https://nextjs.org/) 14 (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **3D:** [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) + Drei
- **Content:** MDX for case studies
- **Deployment:** [Vercel](https://vercel.com/)

## Getting started

```bash
git clone https://github.com/K-Arthur/kevin-arthur-portfolio.git
cd kevin-arthur-portfolio
npm install
npm run dev
```

Site runs at [http://localhost:3000](http://localhost:3000).

## Project structure

```
content/          MDX case studies
public/images/    Static assets
src/app/          Next.js pages and layouts
src/components/   Reusable React components
src/data/         Portfolio data and categories
```

## Content management

- **Personal info, skills, experience:** `src/data/portfolio-data.js`
- **Work projects:** Add images to `public/images/work/<Project Name>/`,
  then assign in `src/data/categories.json`
- **Case studies:** Add `.mdx` files to `content/case-studies/`

## License

MIT
