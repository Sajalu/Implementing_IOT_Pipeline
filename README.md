# Implementing_IOT_Pipeline

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
server.js -> This is the main entry point of your app.
```

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
