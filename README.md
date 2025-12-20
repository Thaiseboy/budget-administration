
# Budget Administration App
A fullstack budget administration application built with **React (TypeScript)** and **Laravel**, focused on clean architecture, reusability, and real world CRUD patterns.
This project is created as a learning and personal use project to deepen my understanding of modern frontend backend workflows.

## Project Motivation
This project was created as part of my preparation for working on a large scale application from the ground up.
In my professional work, I am transitioning from a **legacy PHP stack** (Zend Framework + Bootstrap) to a **modern stack** using **React, Laravel, and Tailwind CSS**.
This application allows me to practice and demonstrate how to:

- Design a modern frontend architecture with React and TypeScript
- Build a clean REST API using Laravel
- Replace legacy UI patterns with reusable, component based solutions
- Apply DRY principles and separation of concerns
- Think in terms of scalability, maintainability, and long term growth

The focus is not only on features, but on **clean structure, consistency, and future proof architecture**. 

## Features
### Core Functionality
- View all transactions (income & expenses)
- Create new transactions
- Edit existing transactions
- Delete transactions with confirmation
- Real API integration (no mock data)
- Instant UI updates after create/update/delete

### User Experience
- **Year Selector** - Filter transactions by year with dropdown
- **Monthly Grouping** - Transactions organized by month with collapsible sections
- **Smart Summary** - Dynamic totals showing either yearly overview or selected months
- **Toast Notifications** - Success/error feedback for user actions
- **Confirmation Dialogs** - Safe deletion with custom modal confirmations
- **Auto-open Current Month** - Latest month automatically expanded on page load

### Code Quality
- Reusable & DRY form components
- Type safe utilities with JSDoc documentation
- Performance optimized with useMemo hooks
- Clean separation of concerns
- Component-based architecture

## Tech Stack
### Frontend
- React 18 with Hooks (useState, useEffect, useMemo)
- TypeScript for type safety
- Vite for fast development and building
- Tailwind CSS v4 for styling
- React Router for navigation
- Fetch API (custom HTTP layer)
- React Icons for UI elements
- Context API for global state (Toast & Confirm)

### Backend
- Laravel
- RESTful API
- MySQL (local database)
- Eloquent ORM
- Validation & Route Model Binding
  
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