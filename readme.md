# Notebook

This project is a modern, browser-based web application designed for managing notebooks. It allows users to create, edit, and organize notes directly in the browser, without the need for a backend. The app utilizes local storage for saving user data and leverages client-side technologies such as React, TypeScript, and Material-UI.

## Installation

```bash
yarn install
yarn start
```

## Architecture Overview

### Frontend (React Application):

- **Framework**: Built using **React** with **TypeScript** for type safety and **Material-UI** for a consistent, user-friendly interface.
- **Hosting**:
  - Hosted as a static website on **Vercel**, ensuring efficient deployment and access from anywhere.
  - **Route 53** is used to manage DNS for the custom domain `notebook.karuifeather.com`, routing traffic to Vercel.
- **Functionality**:
  - **Local Storage**: All user data (such as notebooks and notes) are stored directly in the browser using the **Web Storage API**. Data is persistent across sessions, ensuring that users can continue where they left off without requiring server-side storage.
- **Build and Deployment**:
  - Built using **Webpack** and **Babel** for optimal performance.
  - **Vercel** manages the deployment making the whole process simpler.

### Deployment Process:

Vercel picks up the commits to `main` and deploys them.

### Current Features

- **Frontend**:
  - **User Interface**: A clean and responsive UI built with **Material-UI**, designed for smooth note creation, editing, and management.
  - **Local Storage**: All notebooks, notes, and tags are stored directly in the browser using local storage, making the app fully functional without a backend server.

### How It All Comes Together in Production:

- **Frontend (Client)**:
  - Users visit `https://notebook.karuifeather.com`, where the app is served directly from **AWS S3** and distributed globally via **CloudFront** for fast load times.
  - All data (such as notebooks and notes) is stored locally in the browser, ensuring fast access and persistence across sessions.
  - The app does not require a backend server; everything happens in the browser, with real-time updates happening client-side.
- **Local Storage**:
  - User data, including notebooks and notes, is stored in the browser’s local storage, meaning no backend infrastructure is needed.
  - This also ensures that users can work offline, with all changes automatically saved and synced when they come online.

---

This project demonstrates the power of client-side development, using modern web technologies to provide a full-featured, scalable note-taking experience, entirely powered by the browser. The app is designed for users who need a fast, simple, and highly accessible note management tool without relying on external server infrastructure.
