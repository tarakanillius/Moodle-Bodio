# Moodle-Bodio

---

## Getting Started

### Backend Setup

1. **Ensure MongoDB is running** on your local machine.
2. Navigate to the `backend` folder and create a `.env` file with the following content:

    ```env
    PORT=5000
    MONGODB_URI=mongodb://admin:admin@localhost:27017
    DB_DATABASE=Moodle-Bodio
    JWT_SECRET=your_jwt_secret_key
    ```

3. Install dependencies and populate the database:

    ```bash
    cd backend
    npm install
    npm run populate
    ```

4. Start the backend server:

    ```bash
    npm run dev
    ```

> The server will be running at **http://localhost:5001**

---

### Frontend Setup

1. Open a new terminal window.
2. Navigate to the `frontend` folder:

    ```bash
    cd frontend
    npm install
    npm start
    ```

---

## Login Credentials

### Teachers

| Email                            | Password     |
|----------------------------------|--------------|
| davide.krahenbuhl@example.com    | password123  |
| gionata.genazzi@example.com      | password123  |
| simone.debortoli@example.com     | password123  |

### Students

- All students use the **same password:** `12345678`
- Email pattern: `firstname.lastname@example.com`

**Example Accounts:**

| Name             | Email                      | Password   |
|------------------|----------------------------|------------|
| Marco Rossi      | marco.rossi@example.com     | 12345678   |
| Sofia Bianchi    | sofia.bianchi@example.com   | 12345678   |

---

## Tech Stack

- **Backend:** Express.js, MongoDB, JWT Authentication
- **Frontend:** React.js
- **Database:** MongoDB

---
