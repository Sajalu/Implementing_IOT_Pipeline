# Rakkaranta API version(V1)

## **Project Team**

- Project manager: Mukhtar
- Backend: Samir
- System administer: Abdulsalam
- Front end/Design: Krishna
- Front end/Tester: Rabin

---

# MVC

```
config ->  This file manages database connections.
models -> This file contains database queries.
controllers -> This file handles HTTP requests and responses.
routes -> This file maps routes to controllers.
server.js -> This is the main entry point of our app.
```

## **Overview**

This is a Node.js backend server built with Express.js, PostgreSQL, and various security and logging middlewares. The server provides a RESTful API with features such as security, logging, database connection, rate limiting, and error handling.

This server is developed for a hackathon project by Rakkaranta.

## Features

- Security Enhancements: Uses `helmet`, `cors`, and disables `x-powered-by` header.

- Logging: Logs requests with `morgan`.

- Database Connection: Connects to PostgreSQL using `pg`.

- Rate Limiting: Protects against API abuse using `express-rate-limit`.

- Error Handling: Includes custom 404 and global error handlers.

- Modular Routing: Routes are separated into dedicated files.

## Installation

#### 1. Clone the repository:

```
git clone <repository-url>
cd <project-folder>
```

#### 2. Install dependencies:

```
npm install express dotenv nodemon pg morgan helmet cors express-rate-limit
```

#### 3. Create a .env file and configure environment variables:

```
NODE_ENV=development
PORT=4001
DATABASE_URL=<your_postgresql_connection_url>
CLIENT_URL=<your_frontend_url>
```

#### 4. Start the server:

```
npm run dev
```

---

```
CREATE TABLE IF NOT EXISTS users (
id SERIAL PRIMARY KEY,
username VARCHAR(100) UNIQUE NOT NULL,
email VARCHAR(100) UNIQUE NOT NULL,
password TEXT NOT NULL,
role VARCHAR(10) CHECK (role IN ('user', 'admin')) DEFAULT 'user'
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

```
