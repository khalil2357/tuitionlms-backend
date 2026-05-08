# TuitionLMS Backend

TuitionLMS is a backend system for a learning platform built with NestJS, MongoDB, and Prisma. It is designed to manage students, teachers, courses, lessons, enrollments, quizzes, and admin activities in a structured way.

---

## What This Project Does

This backend powers a complete learning system where:

- Users can register and login
- Students can enroll in courses
- Teachers/admin can create courses and lessons
- Quizzes can be created and solved
- Admin can manage everything from one place
- Emails can be sent for important actions like password reset

---

## Main Features

### Authentication
- User registration and login
- Secure JWT-based authentication
- Role-based access (Admin, Student)

### User Management
- View and update user profile
- Separate roles for different access levels

### Course System
- Create and manage courses
- View all available courses
- Update or delete courses

### Lesson System
- Add lessons inside courses
- Organize learning content properly

### Enrollment System
- Students can enroll in courses
- Track enrolled courses per user

### Quiz System
- Create quizzes for courses
- Students can attempt quizzes
- Store and evaluate results

### Email System
- Send emails for important actions
- Used for password reset and notifications

### Admin Panel Support
- Manage users
- Manage courses and content
- View system overview data

---

## Project Structure Overview

The project is divided into clean modules:

- **Auth Module** → login, register, security
- **User Module** → user profile and management
- **Course Module** → course creation and management
- **Lesson Module** → course content handling
- **Enrollment Module** → student course enrollment
- **Quiz Module** → exam and assessment system
- **Mail Module** → email service handling
- **Admin Module** → admin controls
- **Common** → shared utilities like guards and decorators
- **Prisma** → database connection and schema

---

## Database Overview

The system uses MongoDB with Prisma ORM.

Main data models:

- User → stores student and admin info
- Course → stores course details
- Lesson → stores course content
- Enrollment → tracks student course joining
- Quiz → stores questions and answers

---

## System Flow

1. User registers and logs in
2. JWT token is generated for authentication
3. Student browses courses
4. Student enrolls in a course
5. Lessons become accessible after enrollment
6. Quizzes are attempted after lessons
7. Admin manages all system data

---

## API Structure

The backend exposes APIs for:

- Authentication (login/register)
- Users (profile management)
- Courses (create/read/update/delete)
- Lessons (course content)
- Enrollments (student joining system)
- Quizzes (assessment system)

---

## Architecture Style

- Modular architecture (each feature separated)
- Clean code structure
- Scalable service-based design
- Reusable common utilities
- Secure authentication flow

---

## Goal of This Project

The goal of TuitionLMS backend is to simulate a real-world online learning platform where students and teachers can interact through courses, lessons, and assessments in a structured and scalable system.