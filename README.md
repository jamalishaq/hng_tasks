# HNG Tasks
This Repo contains all my solved HNG tasks in different branches

## ⚙️ Setup Instructions

Follow these steps to get the specific task code running on your local machine.

### 1. Clone the Repository

Clone the project repository using Git:

```bash
git clone https://github.com/jamalishaq/hng_tasks.git
````

### 2. Navigate and Change Branch

Change into the project directory and switch to the branch corresponding to this task (`task_0`):

```bash
cd hng_tasks
git checkout task_[number]
```

### 3. Install Dependencies

Install all necessary packages using **pnpm**:

```bash
pnpm install
```
-----

## General Dependencies

These dependencies are used across all task project

| Dependency | Description |
| :--- | :--- |
| **`yamljs`** | Module to load yaml file. |
| **`swagger-ui-express`** | Module that provides middlewares to setup and render swagger UI. |
| **`express`** | The core web framework for Node.js. |
| **`cors`** | Middleware to enable Cross-Origin Resource Sharing. |
| **`dotenv`** | Module to load environment variables from a `.env` file. |

-----


## ▶️ Instructions to Run Locally

Once the setup is complete, start the application using the `start` script:

1.  Ensure your `.env` file is configured correctly.
2.  Start the server:

<!-- end list -->

```bash
pnpm start
```

The server will start and be accessible at:

> `http://localhost:<PORT>` (e.g., `http://localhost:3000`)

-----

## 📖 APIs Documentation

The complete, interactive API documentation is generated from the OpenAPI specification and hosted live.

| Resource | URL |
| :--- | :--- |
| **Task** | [hngtasks-production.up.railway.app/api-docs](https://hngtasks-production.up.railway.app/api-docs) |

You can use this page to view all available endpoints, required parameters, and response schemas.

-----

## Tasks
* [Task 0: Dynamic Profile API with Rate Limiting](#task-0-dynamic-profile-api-with-rate-limiting)
* [Task 1: [Task Title Here]](#task-1-string-analyzer-api)

---

### task-0-dynamic-profile-api-with-rate-limiting

Simple API that exposes a dynamic `/me` profile endpoint which fetches a cat fact from an external service.

-----

#### 📦 Dependencies

This project uses the following key dependencies:

| Dependency | Description |
| :--- | :--- |
| **`express-rate-limit`** | Middleware to protect routes against too many requests. |

#### 🔑 Environment Variables

This application requires specific environment variables for configuration. Create a file named **`.env`** in the root directory and add the following:

| Variable | Description | Example |
| :--- | :--- | :--- |
| **`PORT`** | The port on which the server will run. | `3000` |
| **`RATE_LIMIT_WINDOW_MS`** | The time window (in milliseconds) for rate limiting. | `900000` (15 minutes) |
| **`RATE_LIMIT_MAX_REQUESTS`** | The maximum number of requests allowed per IP within the window. | `100` |

### Example `.env` File

```dotenv
PORT=3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

-----

#### Testing the Endpoint

To test the dynamic profile endpoint, send a GET request to:

> `http://localhost:<PORT>/me`

You will receive a JSON response that includes a dynamically fetched cat fact. Repeated requests will be subject to the configured rate limit.

### task-1-string-analyzer-api

A RESTful API service that analyzes strings and stores their computed properties.

-----

#### 📦 Dependencies

This project uses the following key dependencies:

| Dependency | Description |
| :--- | :--- |
| **`express-rate-limit`** | Middleware to protect routes against too many requests. |
| **`sqlite3`** | Package that builds sqlite database. |

#### 🔑 Environment Variables

This application requires specific environment variables for configuration. Create a file named **`.env`** in the root directory and add the following:

| Variable | Description | Example |
| :--- | :--- | :--- |
| **`PORT`** | The port on which the server will run. | `3000` |

### Example `.env` File

```dotenv
PORT=4000
```
-----