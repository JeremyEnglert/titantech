# Payload CMS with Tailwind CSS Starter

A modern, full-stack starter project combining Payload CMS with Tailwind CSS for building content-driven websites and applications.

## Features

- ✨ **Payload CMS** - Headless CMS for content management
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 📦 **MongoDB** - Database for content storage
- 👁️ **Live Preview** - Real-time content preview functionality
- 🖼️ **R2 Storage** - Cloudflare R2 configured for media storage
- 🧩 **Shadcn UI** - Beautiful, accessible UI components

## Prerequisites

- Node.js (version 20.9.0 or later)
- MongoDB running locally or a remote MongoDB instance
- pnpm, npm, or yarn (pnpm is recommended)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/materiell/payload-tailwind-starter.git
cd payload-tailwind-starter
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Environment setup

Create a `.env` file in the root directory with the following variables:

```
DATABASE_URI=mongodb://127.0.0.1/payload-tailwind-starter
PAYLOAD_SECRET=your-secret-key-here
```

Replace `your-secret-key-here` with a secure random string.

### 4. Start the development server

```bash
pnpm dev
```

The server will start at http://localhost:3000. The admin panel is accessible at http://localhost:3000/admin.

## Block Architecture

Block configs and React components are intentionally separated:

```
src/blocks/hero/config.ts    → Payload CMS config (admin panel fields)
src/components/hero.tsx       → Reusable React component
src/blocks/render-blocks.tsx  → Maps block types to components
```

- **`src/blocks/`** contains only Payload CMS block definitions — no React rendering
- **`src/components/`** contains reusable UI components — no Payload coupling
- **`src/blocks/render-blocks.tsx`** bridges the two, mapping each `blockType` to its component

This separation exists because components are used beyond blocks — in features, rich text embeds, and direct usage. Keeping them in `src/components/` avoids the awkwardness of importing a "block" component outside of block context.

