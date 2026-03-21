# 🧾 TrackWise

## 🚀 Overview
**TrackWise** is a full-stack personal finance management application that enables users to track income, manage expenses, and gain meaningful financial insights through a secure and interactive dashboard.

The system is designed with a strong focus on **security, automation, and data-driven decision-making**, combining modern backend architecture with a responsive frontend experience.

🌐 **Live Demo:** https://trackwise-9l4u.onrender.com

---

## ✨ Features

### 🔐 Authentication & Security
- JWT authentication (stored in secure HTTP-only cookies)
- Token expiry (15 minutes) with automatic regeneration
- Protected API routes (all post-login endpoints secured)
- Auto logout on expired/invalid tokens
- Password hashing using bcrypt
- OTP-based email verification before account creation
- Secure password recovery via OTP
- Rate limiting (brute-force protection)
- Security headers using Helmet

---

### 📧 Email & Notification System
- Integrated with Mailgun
- OTP delivery for:
  - Signup verification
  - Password recovery
- Email notifications:
  - Account creation
  - Security alerts

---

### ⏰ Scheduled Tasks & Automation
- Daily background job (runs automatically at a fixed time)
- Automated email reminders:
  - 📅 **Upcoming payments** (within 24 hours)
  - ⚠️ **Overdue expenses**
- User preference-based notifications
- Demonstrates real-world **time-based event processing**

---

### ⚙️ User Settings
- Update personal information (name, surname, email)
- Email preferences:
  - Receive general emails
  - Overdue alerts
  - Payment reminders
- Monthly budget limit (default: R2000)
- Account deletion

---

### 💰 Expense Management
- Add, edit, and delete expenses
- Categorize expenses
- Track payment status (paid/unpaid)
- Filter expenses by:
  - Paid
  - Unpaid
  - Overdue
- View expenses for the last **1–6 months**
- Sort expenses by:
  - Amount (ascending/descending)
  - Date (ascending/descending)
- Real-time updates on dashboard

---

### 💵 Income Management
- Add, edit, and delete income entries
- Categorize income sources
- View income for the last **1–6 months**
- Sort income by:
  - Amount (ascending/descending)
  - Date (ascending/descending)
- Real-time updates to totals and dashboard

---

### 📊 Dashboard & Analytics

#### 📌 Overview
- Current balance
- Total income & expenses
- Budget usage indicator:
  - 🟢 Below 85%
  - 🔴 Above 85%
- Recent transactions (color-coded)
- Overdue expenses table

---

#### 📈 Visualizations (Chart.js)
- 📊 Income vs Expense (last 6 months)
- 🥧 Expense breakdown by category
- 🥧 Income breakdown by category

---

### 📅 Monthly Financial Summary
- Displays up to **6 past months**
- Each summary card includes:
  - Month & Year
  - Total Income
  - Total Expenses
  - Highest spending (amount + description)
- Visual indicators:
  - 🟢 Green → Income ≥ Expenses
  - 🔴 Red → Expenses exceed Income

---

### 📱 Responsive Design
- Fully responsive across:
  - Desktop
  - Tablet
  - Mobile

---

## 🧠 Tech Stack

### Backend
- Node.js
- Express.js

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla)

### Database
- MySQL (Aiven Cloud)

### Tools & Libraries
- bcrypt
- jsonwebtoken (JWT)
- helmet
- express-rate-limit
- Chart.js
- Mailgun
- Git & GitHub

---

## 🏗 Architecture Highlights
- RESTful API design
- Modular backend structure (controllers, routes, middleware,service)
- Secure authentication flow with token lifecycle management
- Background task scheduling for automated processes

---


