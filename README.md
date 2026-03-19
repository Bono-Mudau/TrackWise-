
# 🧾 TrackWise

## 🚀 Overview
**TrackWise** is a full-stack personal finance management application that helps users track income, manage expenses, and gain financial insights through an interactive and secure dashboard.

The system focuses on **security, real-time updates, and data-driven decision-making**, combining modern backend practices with a responsive frontend.

🌐 **Live Demo:** https://trackwise-9l4u.onrender.com

---

## ✨ Features

### 🔐 Authentication & Security
- JWT authentication (stored in secure cookies)
- Token expiry (15 minutes) with automatic regeneration
- Protected API routes
- Auto logout on expired/invalid tokens
- Password hashing using bcrypt
- OTP-based email verification
- Password recovery via OTP
- Rate limiting & security headers (Helmet)

---

### 📧 Email System
- Integrated with Mailgun
- OTP delivery for:
  - Signup verification
  - Password recovery
- Email notifications:
  - Account creation
  - Security alerts

---

### ⚙️ User Settings
- Update personal information (name, surname, email)
- Email preferences:
  - Receive emails
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
- View expenses for the last 1–6 months
- Sort expenses by:
  - Amount (ascending/descending)
  - Date (ascending/descending)
- Real-time updates on dashboard

---

### 💵 Income Management
- Add, edit, and delete income entries
- Categorize income sources
- View income for the last 1–6 months
- Sort income by:
  - Amount (ascending/descending)
  - Date (ascending/descending)
- Real-time updates to totals and dashboard

---

### 📊 Dashboard & Analytics

#### Overview
- Current balance
- Total income & expenses
- Budget usage indicator:
  - 🟢 Below 85%
  - 🔴 Above 85%
- Recent transactions (color-coded)
- Overdue expenses section

#### Charts (Chart.js)
- 📊 Income vs Expense (last 6 months)
- 🥧 Expense breakdown by category
- 🥧 Income breakdown by category

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
- HTML
- CSS
- JavaScript

### Database
- MySQL (Aiven)

### Tools & Libraries
- bcrypt
- jsonwebtoken (JWT)
- helmet
- express-rate-limit
- Chart.js
- Mailgun
- Git

---


