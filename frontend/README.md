# 🏨 MEGO – Multi-Vendor Hotel Booking Platform

<p align="center">
  <strong>A modern multi-vendor hotel booking platform built with React, TypeScript and Vite.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/MUI-7-007FFF?style=for-the-badge&logo=mui&logoColor=white" />
</p>

---

## 📖 Introduction

**MEGO** is a multi-vendor hotel booking platform that allows users to discover hotels, search for rooms, make reservations, manage bookings, and interact with hotel partners.

The system is designed with multiple roles, each having its own workflow and functionality.

### Main Roles

- 👤 Guest
- 🧑‍💼 Customer
- 🏨 Partner
- 👨‍💻 Admin

The frontend is developed using **React + TypeScript + Vite**, with a modular architecture that separates shared components, role-specific modules, routing, state management, themes, and utilities.

---

# ✨ Main Features

## 👤 Guest

Guests are users who have not logged into the system.

### Features

- View homepage
- Search hotels
- View hotel list
- Filter hotels
- View hotel details
- View room information
- View hotel facilities
- View hotel reviews
- Register account
- Login

---

## 🧑‍💼 Customer

Customers are authenticated users who can book hotel rooms.

### Account

- View profile
- Update personal information
- Change password
- Manage account

### Hotel

- Search hotels
- Filter hotels
- View hotel details
- View available rooms
- View room details
- Check room availability

### Booking

- Select check-in date
- Select check-out date
- Select number of guests
- Select room
- Create booking
- Confirm booking
- View booking history
- Track booking status
- Cancel booking

### Review

- Rate hotel
- Write reviews
- View reviews

---

## 🏨 Partner

Partners are hotel owners or accommodation providers who use MEGO to manage their properties.

### Hotel Management

- Register hotel
- Update hotel information
- Manage hotel information
- Manage hotel facilities
- Manage hotel images

### Room Management

- Add rooms
- Update rooms
- Delete rooms
- Manage room types
- Manage room prices
- Manage room availability

### Booking Management

- View bookings
- Confirm bookings
- Reject bookings
- Update booking status

### Dashboard

- View booking statistics
- View revenue
- View room statistics
- Monitor hotel performance

---

## 👨‍💻 Admin

Administrators manage the entire MEGO platform.

### User Management

- View users
- Search users
- Manage users
- Lock / unlock accounts
- Manage roles

### Partner Management

- View partners
- Approve partner registration
- Reject partner registration
- Manage partner accounts

### Hotel Management

- View hotels
- Approve hotels
- Reject hotels
- Manage hotels
- Hide hotels

### System Management

- Manage hotel categories
- Manage facilities
- Manage bookings
- Manage reviews
- View system statistics

---

# 🛠️ Technology Stack

## Frontend

| Technology     | Purpose                    |
| -------------- | -------------------------- |
| React          | User interface             |
| TypeScript     | Static typing              |
| Vite           | Development and build tool |
| Material UI    | UI components              |
| Emotion        | MUI styling engine         |
| React Router   | Client-side routing        |
| Redux Toolkit  | Global state management    |
| React Redux    | Redux integration          |
| Axios          | HTTP requests              |
| Formik         | Form management            |
| Yup            | Form validation            |
| React Toastify | Notifications              |
| AOS            | Animations                 |
| Recharts       | Data visualization         |
| React Icons    | Icon library               |

---

# 📁 Project Structure

The project follows a **role-based modular architecture**.

```text
mego-frontend/
│
├── public/
│
├── src/
│   │
│   ├── components/
│   │   ├── auth/
│   │   ├── footer/
│   │   └── header/
│   │
│   ├── hooks/
│   │
│   ├── modules/
│   │   │
│   │   ├── admin/
│   │   │   ├── components/
│   │   │   └── pages/
│   │   │       └── AdminHome.tsx
│   │   │
│   │   ├── customer/
│   │   │   ├── components/
│   │   │   └── pages/
│   │   │       └── CustomerHome.tsx
│   │   │
│   │   ├── guest/
│   │   │   ├── components/
│   │   │   └── pages/
│   │   │       └── GuestHome.tsx
│   │   │
│   │   └── partner/
│   │       ├── components/
│   │       └── pages/
│   │           └── PartnerHome.tsx
│   │
│   ├── routers/
│   │   ├── AdminRoutes.tsx
│   │   ├── AppRoutes.tsx
│   │   ├── CustomerRoutes.tsx
│   │   ├── GuestRoutes.tsx
│   │   ├── PartnerRoutes.tsx
│   │   ├── ProtectedRoutes.tsx
│   │   └── ScrollToTop.tsx
│   │
│   ├── stores/
│   │   └── store.ts
│   │
│   ├── themes/
│   │   └── CustomTheme.ts
│   │
│   ├── utils/
│   │
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

## AI chat widget

The shared chat widget is mounted in `src/App.tsx`. It reads the current role from Redux auth state, keeps conversation messages in Redux, and persists them in `sessionStorage` for the current browser tab. Logging out or clearing the conversation removes the saved messages.

### Local UI testing

Set `VITE_CHAT_USE_MOCK=true` in `frontend/.env.local`, then restart the Vite dev server. The mock waits about 800 ms and returns a role-aware reply without calling the backend. To exercise the error and retry state once, also set `VITE_CHAT_MOCK_FAIL_ONCE=true`; the first request fails and retry succeeds. Remove that setting or restart the dev server to reset the mock.

Check the widget as a guest and while signed in with each role. Since the demo login creates a Customer account, you can preview another role in the browser console by setting the same auth values Redux reads on startup, then reloading:

```js
localStorage.setItem("mego_auth_user", JSON.stringify({
  id: "chat-test",
  name: "Chat Tester",
  email: "chat@example.com",
  role: "PARTNER", // Change to CUSTOMER or ADMIN to check those prompts.
}));
localStorage.setItem("mego_auth_token", "chat-test");
location.reload();
```

Remove `mego_auth_user` and `mego_auth_token` from local storage and reload to check Guest. The role and suggested prompts come from `state.auth.user.role`; routes `/login`, `/register`, `/forgot-password`, `/reset-password`, and `/verify-email` hide the widget. Test narrow viewport behavior below 640 px, refresh after a conversation to confirm the tab history remains, then clear the conversation or log out and refresh to confirm it is gone. Press Escape to close the panel; Enter sends and Shift+Enter adds a line break.

### Backend contract

The frontend posts to `POST /api/chat` (change `CHAT_API_ENDPOINT` in `src/services/chatService.ts` if the backend path differs).

Request JSON:

```json
{
  "message": "How can I find a room?",
  "history": [
    { "role": "user", "content": "I need a hotel in Da Nang." },
    { "role": "assistant", "content": "What dates are you travelling?" }
  ],
  "role": "GUEST",
  "language": "en"
}
```

`history` contains prior turns only; the current user input is in `message`. Roles are `GUEST`, `CUSTOMER`, `PARTNER`, or `ADMIN`; message roles in history are `user` or `assistant`. Return JSON `{ "reply": "..." }`. On failure, the frontend displays a JSON `message` when available, or a translated fallback. The backend should select its own role-specific assistant context, validate the authenticated role from the server-side session/token, and treat the supplied `role` as a UI hint rather than an authorization claim.
