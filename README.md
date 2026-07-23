# Texawave

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/Texawave-Innovations/texawave/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/Texawave-Innovations/texawave/releases)

> An end-to-end product engineering, custom software, PCB layout design, and cloud IoT platform solutions portal for startups and enterprises.

---

## 📖 Project Description

Startups and established enterprises often face significant friction when trying to transition a product concept from prototype to scale, or when bridging physical operations with modern cloud and AI infrastructure. Texawave solves this by providing a unified, performant, and beautifully animated hub that outlines engineering capabilities, case studies, procurement services, and manufacturing support.

Built using modern web standards, the site acts as an interactive showcase of Texawave's services, integrating state-of-the-art animations via GSAP and Framer Motion, and leveraging Next.js's static/dynamic hybrid rendering. It empowers clients to explore case studies (like semi-automatic washer cutting machines and automated test fixtures) and connect seamlessly with engineering teams.

### Key Features

* **Interactive Showcase**: Smooth GSAP/Framer Motion animations highlighting product engineering, procurement, and software offerings.
* **Case Studies Database**: Dynamic retrieval and display of real-world engineering project success stories.
* **Firebase-backed Portal**: Secure user and admin dashboard integration for handling project requests and client management.
* **Responsive, Performance-First Design**: Optimized bundle sizes using Next.js 15, dynamic imports, and Lenis smooth scrolling.
* **Resilient Contact System**: Email routing using Nodemailer for inquiry dispatch and processing.

---

## 🛠️ Prerequisites

Before you begin, ensure you have met the following requirements:

* **Node.js**: `v18.17.0` or higher (Recommended: `v20.x`)
* **Package Manager**: `npm` (v9+) or `yarn` (v1.22+)
* **Firebase Project**: A Firebase project set up for Authentication, Realtime Database, and Firestore.

---

## 🚀 Installation

Follow these steps to set up the project locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Texawave-Innovations/texawave.git
   cd texawave
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Copy the template env file:
   ```bash
   cp .env.local.example .env.local
   ```
   Open `.env.local` and populate it with your Firebase project keys:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://texawave-website-default-rtdb.firebaseio.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

4. **Start the local development server:**
   ```bash
   npm run dev
   ```

---

## 💻 Usage

To run the project or build it for production, use the following scripts:

```bash
# Start development server on http://localhost:3000
npm run dev

# Build the production bundle
npm run build

# Start the built application in production mode
npm run start

# Run ESLint to check for code quality issues
npm run lint

# Analyze the Webpack bundle size
npm run analyze
```

### Preview

![Texawave Portal Preview](/hero_video_poster.webp)

---

## 🤝 Contributing

We welcome contributions to Texawave! To contribute, follow these guidelines:

1. **Create an Issue**: Before making significant changes, please open an issue to discuss your proposal.
2. **Branch Naming Conventions**:
   * Features: `feature/your-feature-name`
   * Bug fixes: `bugfix/issue-description`
   * Hotfixes: `hotfix/critical-fix`
3. **Submit a Pull Request**:
   * Fork the repository.
   * Create your branch from `main`.
   * Ensure your code passes all linting rules (`npm run lint`).
   * Commit your changes with clear, descriptive commit messages.
   * Open a PR with a detailed description of your changes.

---

## 📄 License

This project is open-source and licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

## 👥 Authors & Contact

* **Lead Maintainer**: Texawave Innovations - [@Texawave-Innovations](https://github.com/Texawave-Innovations)
* **Project Link**: [https://github.com/Texawave-Innovations/texawave](https://github.com/Texawave-Innovations/texawave)
* **Email Contact**: [contact@texawave.com](mailto:contact@texawave.com)
