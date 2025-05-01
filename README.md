# 🏋️‍♂️ GYM Management System

A simple gym management web application built using **HTML**, **CSS**, **JavaScript**, and **Firebase**.  
This system supports admin and member roles with features like member management, bill generation, notifications, supplement store, and export options.

---

## ✨ Features

### Admin
- Login
- Add, view, update, delete members
- Assign fee packages
- Generate monthly bills & notifications
- Add supplement/diet items
- View and manage item requests
- Export reports (CSV)
- Search/filter members, bills, and requests

### Member
- Login
- View personal bills
- View supplement/diet store
- Request items
- Track request status

---

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend/Database**: Firebase Firestore
- **Auth**: Firebase Authentication
- **Hosting**: Firebase Hosting (optional)

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

git clone https://github.com/your-username/gym-management-system.git
cd gym-management-system

## 2. Firebase config.js

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

## 3. File structure 

gym-management-system/
├── index.html          # Login page
├── dashboard.html      # Admin dashboard
├── member.html         # Member view
├── scripts/
│   ├── firebase-config.js
│   ├── auth.js
│   ├── admin.js
│   └── member.js
├── styles/
│   └── style.css
└── README.md
