
# Budget Administration App
A fullstack budget administration application built with **React (TypeScript)** and **Laravel**, focused on clean architecture, reusability, and real world CRUD patterns.
This project is created as a learning and portfolio project to deepen my understanding of modern frontend backend workflows.

## 🎯 Project Motivation
This project was created as part of my preparation for working on a large scale application from the ground up.
In my professional work, I am transitioning from a **legacy PHP stack** (Zend Framework + Bootstrap) to a **modern stack** using **React, Laravel, and Tailwind CSS**.
This application allows me to practice and demonstrate how to:

- Design a modern frontend architecture with React and TypeScript
- Build a clean REST API using Laravel
- Replace legacy UI patterns with reusable, component based solutions
- Apply DRY principles and separation of concerns
- Think in terms of scalability, maintainability, and long term growth

I am involved from the very beginning of building a much larger application, and this project serves as a controlled environment to learn, experiment, and apply best practices before implementing them in a production-scale system.

The focus is not only on features, but on **clean structure, consistency, and future proof architecture**. 

## Features
- View all transactions (income & expenses)
- Create new transactions
- Edit existing transactions
- Delete transactions
- Real API integration (no mock data)
- Reusable & DRY form components
- Instant UI updates after create/update/delete

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS v4
- React Router
- Fetch API (custom HTTP layer)

### Backend
- Laravel
- RESTful API
- MySQL (local database)
- Eloquent ORM
- Validation & Route Model Binding

---

## Architecture Highlights
-  **Separation of concerns**
- API logic isolated in `/api`
- UI split into pages & reusable components
-  **Reusable form system**
-  `FormField` and `FormFieldGroup` for DRY forms
- One form used for both *Create* and *Edit*
-  **Clean CRUD flow**
- GET / POST / PUT / DELETE endpoints
- Frontend state synced with backend
-  **Development friendly setup**
- Vite proxy for API requests (no CORS issues)
- Local development environment
  

---


## Getting Started (Local)

### Backend (Laravel)
- cd backend/budget-api
- composer install
- cp .env.example .env
- php artisan key:generate
- php artisan migrate
- php artisan serve

### Frontend (React)
- cd frontend/budget-frontend
- npm install
- npm run dev