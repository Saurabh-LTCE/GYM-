# 🏋️ Gym Management System (MERN Stack)

A full-stack **Gym Management System** built using the **MERN stack (MongoDB, Express, React, Node.js)**.
This project allows **Members and Trainers** to manage gym activities efficiently with authentication, dashboards, and data management.

---

## 🚀 Features

### 👤 Member

* Register & Login
* View personal profile
* Check membership plan
* View fee/payment status
* See assigned trainer

### 🏋️ Trainer

* Register & Login
* View profile details
* View assigned members
* Manage member data (optional)

### 🛠️ Admin (Optional / Extendable)

* Manage members, trainers, staff
* Track fees and branches

---

## 🧠 Tech Stack

### Frontend

* React (Vite)
* React Router
* Axios
* Context API

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT / Firebase Authentication

### Cloud (Planned)

* Microsoft Azure
* MongoDB Atlas

---

## 📁 Project Structure

```
gym-backend/
│
├── config/
├── controllers/
├── models/
├── routes/
├── middleware/
├── utils/
├── server.js
└── package.json

gym-frontend/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── context/
│   ├── routes/
│   └── App.jsx
└── package.json
```

---

## ⚙️ Installation & Setup

### 🔹 1. Clone Repository

```bash
git clone https://github.com/Saurabh-LTCE/GYM-.git
cd GYM-
```

---

### 🔹 2. Backend Setup

```bash
cd gym-backend
npm install
```

Create a `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm run dev
```

---

### 🔹 3. Frontend Setup

```bash
cd gym-frontend
npm install
```

Create a `.env` file:

```
VITE_API_URL=http://localhost:5000
```

Run frontend:

```bash
npm run dev
```

---

## 🔗 API Endpoints

### 👤 Members

* `GET /api/members`
* `POST /api/members`
* `GET /api/members/:id`
* `PUT /api/members/:id`
* `DELETE /api/members/:id`
* `GET /api/members/me` ✅ (Get logged-in member)

### 🏋️ Trainers

* `GET /api/trainers`
* `POST /api/trainers`
* `GET /api/trainers/:id`
* `PUT /api/trainers/:id`
* `DELETE /api/trainers/:id`
* `GET /api/trainers/me` ✅ (Get logged-in trainer)

---

## 🔥 Important Fixes Implemented

* ✅ Fixed `"Cast to ObjectId failed"` error
* ✅ Implemented `/me` routes for logged-in users
* ✅ Connected authentication with MongoDB
* ✅ Dashboard now fetches real data
* ✅ Proper role-based data loading

---

## 📊 Dashboard Functionality

### Member Dashboard

* Displays:

  * Name
  * Email
  * Membership Plan
  * Fee Status
  * Assigned Trainer

### Trainer Dashboard

* Displays:

  * Name
  * Email
  * Specialization
  * Experience
  * Assigned Members list

---

## 🌐 Deployment

### Backend (Render)

* Set environment variables
* Add build command: `npm install`
* Start command: `node server.js`

### Frontend (Vercel)

* Set `VITE_API_URL` to deployed backend URL

---

## 📸 Screenshots

<img width="1561" height="777" alt="Screenshot 2026-04-22 134823" src="https://github.com/user-attachments/assets/a9d46dda-6ecf-43f6-90f1-ef9e3183cd8b" />



<img width="1858" height="928" alt="Screenshot 2026-04-22 135057" src="https://github.com/user-attachments/assets/aa3fd6f8-405b-43ec-992b-039d7fc3db78" />

---

## 🧩 Future Improvements

* Payment integration (Stripe/Razorpay)
* Workout tracking
* Notifications system
* Admin analytics dashboard
* Mobile responsive UI

---

## 👨‍💻 Author

**Saurabh Sharma**
GitHub: https://github.com/Saurabh-LTCE

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!

---
