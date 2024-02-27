# Healthcare Management Admin Dashboard

## Overview

Welcome to the Healthcare Management Admin Dashboard, a robust and efficient solution designed for streamlined healthcare administration. This project combines the power of Firebase for backend services, React for the user interface, and Redux for state management, ensuring a seamless experience for healthcare professionals.

## Key Features

1. User Roles:

   - Differentiated user roles for doctors and patients, providing tailored functionalities and access levels.

2. Patient Management:

   - Comprehensive patient record management, allowing easy addition, modification, and deletion of patient information.

3. Doctor Management:

   - Efficient handling of doctor details, including names, specializations, hospital affiliations, and availability status.

4. Redux Integration:

   - Seamless integration of Redux for state management, enhancing the application's responsiveness and reliability.

5. Firebase Integration:
   - Secure and scalable backend support with Firebase, ensuring robust data storage and retrieval.

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Araddhya/React-Admin-Dashboard.git
```

### 2. Install Dependencies

```bash
cd react-dashboard
npm install
```

### 3. Configure Firebase

- Set up a Firebase project and obtain your configuration details.
- Create a `firebaseConfig.js` file in the `src/firebase` directory and export the configuration.

```javascript
const firebaseConfig = {
  // Your Firebase configuration details
};

export default firebaseConfig;
```

### 4. Run the Application

```bash
npm start
```

### 5. Access the Dashboard

Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to explore the admin dashboard.
