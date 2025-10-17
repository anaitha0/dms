# Document Management System

A responsive React frontend for a document management system with user management functionality.
<img width="3467" height="1852" alt="image" src="https://github.com/user-attachments/assets/a487b4df-b4cd-4758-ad51-52a27b4c37ba" />

## Features

- **Authentication System**: User login functionality with session management using Redux
- **User Management**: View, create, edit, and delete users with search, filtering, and pagination
- **Document Management**: View, upload, manage and organize documents with comprehensive filtering and search
- **Responsive Design**: Works seamlessly across all device sizes
- **Modern UI**: Beautiful and professional interface with animations and transitions
<img width="3465" height="1848" alt="image" src="https://github.com/user-attachments/assets/630327bb-6358-4391-81f1-77ab983a3226" />

## Tech Stack

- **React**: Frontend library for building user interfaces
- **Redux Toolkit**: State management with advanced tooling
- **Material UI**: Component library for modern UI design
- **Formik & Yup**: Form handling and validation
- **Framer Motion**: Animation library for smooth transitions
- **Axios**: HTTP client for API requests
- **React Router**: Navigation and routing
- **React Toastify**: Toast notifications

## Project Structure

```
document-management-system/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── Login.js
│   │   │   └── ProtectedRoute.js
│   │   ├── layout/
│   │   │   ├── Dashboard.js
│   │   │   ├── Sidebar.js
│   │   │   ├── Header.js
│   │   │   └── PageContainer.js
│   │   ├── users/
│   │   │   ├── UserList.js
│   │   │   ├── UserForm.js
│   │   │   └── UserFilters.js
│   │   ├── documents/
│   │   │   ├── DocumentList.js
│   │   │   ├── DocumentForm.js
│   │   │   └── DocumentFilters.js
│   │   └── common/
│   │       ├── DataTable.js
│   │       ├── Pagination.js
│   │       ├── SearchBar.js
│   │       ├── FilterPanel.js
│   │       ├── FormField.js
│   │       └── LoadingSpinner.js
│   ├── store/
│   │   ├── index.js
│   │   ├── authSlice.js
│   │   ├── userSlice.js
│   │   └── documentSlice.js
│   ├── services/
│   │   ├── api.js
│   │   ├── userService.js
│   │   └── documentService.js
│   ├── utils/
│   │   ├── animations.js
│   │   └── helpers.js
│   ├── assets/
│   │   ├── images/
│   │   └── styles/
│   │       └── index.css
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (>= 14.x)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/document-management-system.git
   cd document-management-system
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```bash
   npm start
   # or
   yarn start
   ```

4. Start the backend server
   ```bash
   # In a separate terminal
   cd backend
   python app.py
   ```

### Demo Credentials

- **Username**: admin
- **Password**: admin123

