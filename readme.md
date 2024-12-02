# Notebook

This project is a modern, browser-based web application designed for managing notebooks. It allows users to create, edit, and organize notes directly in the browser, without the need for a backend. The app utilizes local storage for saving user data and leverages client-side technologies such as React, TypeScript, and Material-UI.

## Architecture Overview

### Frontend (React Application):

- **Framework**: Built using **React** with **TypeScript** for type safety and **Material-UI** for a consistent, user-friendly interface.
- **Hosting**:
  - Hosted as a static website on **AWS S3**, ensuring efficient deployment and access from anywhere.
  - Distributed globally via **AWS CloudFront** to provide fast load times.
  - **Route 53** is used to manage DNS for the custom domain `notebook.karuifeather.com`, routing traffic to CloudFront.
- **Functionality**:
  - **Local Storage**: All user data (such as notebooks and notes) are stored directly in the browser using the **Web Storage API**. Data is persistent across sessions, ensuring that users can continue where they left off without requiring server-side storage.
  - **Real-time Editing**: The app supports real-time updates and collaboration features using **WebSockets** or local updates, ensuring smooth interaction between users in a session.
  - **Search and Tagging**: Notebooks and notes can be tagged for easy searching and organization within the browser, allowing users to quickly find their content.
- **Build and Deployment**:
  - Built using **Webpack** and **Babel** for optimal performance.
  - Deployed to **AWS S3** for static file hosting, ensuring reliable and fast access.
  - **GitHub Actions** automates the deployment process whenever changes are pushed to the `main` branch.

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
