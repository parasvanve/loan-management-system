# Loan Management System

Express + MySQL based loan management backend with JWT authentication, EMI calculation, risk analysis, admin review, and email notifications.

## Features

- User registration and login with hashed passwords
- JWT-protected APIs
- Loan application flow with EMI and total payable calculation
- Risk analysis based on credit score
- Automatic loan decision engine
- Role-based access control for admin operations
- Email notifications for loan submission and status updates

## Folder Structure

```text
config/
controllers/
middleware/
models/
routes/
services/
utils/
validations/
```

## Setup

```bash
npm install
```

Create a `.env` file using `.env.example`, then start the server:

```bash
npm run dev
```

## Environment Variables

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=loan_management
JWT_SECRET=your_jwt_secret
EMAIL=your_email@gmail.com
PASSWORD=your_gmail_app_password
ADMIN_REGISTRATION_KEY=optional_admin_key
```

## API Endpoints

### Auth

- `POST /auth/register`
- `POST /auth/login`

### User

- `GET /loan/my-loans`

### Loan

- `POST /loan/apply`

### Admin

- `GET /loan/all`
- `PATCH /loan/:id/status`

## Example Request Payloads

### Register

```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "secret123",
  "role": "USER"
}
```

To create an admin user from the public register API, send `"role": "ADMIN"` and the matching `adminKey` from `ADMIN_REGISTRATION_KEY`.

### Login

```json
{
  "email": "rahul@example.com",
  "password": "secret123"
}
```

### Apply Loan

```json
{
  "amount": 200000,
  "tenure": 24,
  "income": 50000,
  "creditScore": 760
}
```

### Update Loan Status

```json
{
  "status": "APPROVED"
}
```

## Postman Flow

1. Register user/admin
2. Login and copy JWT token
3. Call protected routes with `Authorization: Bearer <token>`
4. Apply loan and review EMI, risk, and status
5. Use admin account to fetch all loans or update status
