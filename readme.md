# LawLens

LawLens is a modern, AI-powered legal document management and collaboration system built on the MERN stack and integrated with Google Cloud services. It connects users and lawyers to securely upload, analyze, draft, and manage legal documents while leveraging powerful AI capabilities for document insights and reminders.

---

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Folder Structure](#folder-structure)
- [Google Cloud Integration](#google-cloud-integration)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Features

- **User & Lawyer Authentication** — Secure registration and login with JWT authentication and role-based access control.
- **Document Upload & Storage** — Upload legal documents stored securely on Google Cloud Storage.
- **AI-powered Document Analysis** — Analyze documents using Google Cloud Natural Language API to detect key entities and potential issues.
- **Draft Document Generation** — Create legal drafts with placeholders for quick customization.
- **Activity & Reminder Management** — Schedule legal activities with email notifications and recurring reminders.
- **Audit Trail** — Maintain history of document actions for accountability.
- **Role-based Authorization** — Separate access levels for users and lawyers.

---

## Technology Stack

- **Frontend:** React.js (planned)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **File Storage:** Google Cloud Storage
- **AI & NLP:** Google Cloud Natural Language API
- **Authentication:** JWT, bcryptjs
- **Email:** Nodemailer via SMTP
- **Other:** Multer (file upload), Helmet (security), CORS, Morgan (logging)

---

## Getting Started

### Prerequisites

- Node.js v18+ installed
- MongoDB instance (local or cloud)
- Google Cloud project with:
  - Service Account with Storage and Natural Language API permissions
  - Storage Bucket created
  - Service Account JSON key downloaded
- SMTP email account for sending reminders

---

## Environment Variables

Create a `.env` file in the root and configure the following variables: