# 🏋️‍♂️ Olympia Workout Tracker Engine

A full-stack, enterprise-grade Workout Tracker application built with **Java 21**, **Spring Boot 3.4**, **Spring Security (JWT)**, **Spring Data JPA (SQL/H2)**, **OpenAPI 3.0 / Swagger UI**, and a modern **React 18** frontend featuring classical dark-luxury aesthetics.

---

## 🌟 Features

### 🔐 User Authentication & Security
- **JWT Authentication**: Secure user signup, login, and profile lookup using stateless JSON Web Tokens.
- **Password Protection**: Industry-standard **BCrypt** password hashing.
- **Resource Ownership**: Strict security controls ensuring users only access and manage their own workout data.

### 🏋️ Exercise Data Library & Seeder
- **Auto-Seeded Database**: Pre-populates 16 exercises across STRENGTH, CARDIO, FLEXIBILITY, and BODYWEIGHT categories upon startup.
- **Search & Filter API**: Filter exercises by category, target muscle group (Chest, Back, Legs, Shoulders, Arms, Core, Cardiovascular), or search keywords.

### 📅 Workout Management & Scheduling
- **Custom Workout Creator**: Build routines with target sets, repetitions, resistance weight (kg), rest intervals, scheduled date & time, and notes.
- **Status Lifecycle**: Manage workouts across statuses: `SCHEDULED`, `IN_PROGRESS`, `COMPLETED`, and `CANCELLED`.
- **Chronological Sorting**: Pending and active workouts sorted by date and time.

### 📊 Progress & Analytics Reports
- **Volume Load Calculation**: Total resistance volume (kg) tracked across completed sets.
- **Active Training Streak**: Consecutive active training day tracker.
- **Category Breakdown**: Muscle group and discipline distribution percentage breakdown.
- **Progression Timeline**: Historical performance trend metrics.

### 📖 Interactive OpenAPI / Swagger Documentation
- Live interactive API testing interface powered by **SpringDoc OpenAPI 3.0**.
- Includes JWT Bearer Token authorization setup directly in the Swagger UI.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Backend Framework** | Java 21, Spring Boot 3.4.3 |
| **Security & Auth** | Spring Security 6, JJWT (`io.jsonwebtoken` 0.12.6), BCrypt |
| **Database & Persistence** | Spring Data JPA, Hibernate ORM, H2 Database (in-memory/file mode), MySQL driver |
| **API Documentation** | SpringDoc OpenAPI 3.0 (`springdoc-openapi-starter-webmvc-ui` 2.8.5) |
| **Frontend Framework** | HTML5, CSS3, JavaScript (ES6+), React 18, Vite |
| **Styling & Aesthetics** | Custom Classical Dark Luxury UI system (Obsidian base `#0b0f19`, Amber Gold `#f59e0b`, Glassmorphism) |
| **Build & Testing Tools** | Apache Maven, JUnit 5, MockMvc |

---

## 🔌 REST API Endpoints Overview

### 🔑 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user account & get JWT token |
| `POST` | `/api/auth/login` | Public | Authenticate credentials & get JWT token |
| `GET` | `/api/auth/me` | Authenticated | Fetch current authenticated user profile |

### 🏋️ Exercise Library (`/api/exercises`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/exercises` | Public | List and search seeded exercises with filters |
| `GET` | `/api/exercises/{id}` | Public | Get exercise details by ID |

### 📋 Workout Management (`/api/workouts`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/workouts` | Authenticated | Create and schedule a new workout plan |
| `GET` | `/api/workouts` | Authenticated | List user workouts sorted chronologically |
| `GET` | `/api/workouts/{id}` | Authenticated | Fetch workout details and exercise set breakdown |
| `PUT` | `/api/workouts/{id}` | Authenticated | Update workout plan, date, and exercise list |
| `PATCH` | `/api/workouts/{id}/status` | Authenticated | Update workout status (e.g. `COMPLETED`) |
| `DELETE` | `/api/workouts/{id}` | Authenticated | Delete a workout plan |

### 📊 Analytics & Reports (`/api/reports`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/reports/summary` | Authenticated | Generate report summary (streak, volume, category ratios) |

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- **Java Development Kit (JDK 21)** or higher
- **Node.js** (v18+ recommended) & **NPM**

### 1. Clone the Repository
```bash
git clone <YOUR_REPOSITORY_URL>
cd workoutTracker
```

### 2. Run Application (Backend + Integrated React Frontend)
Run the Spring Boot application using the included Maven Wrapper:

```bash
./mvnw spring-boot:run
```

Once started, open your browser:
- 🌐 **Web Application UI**: [http://localhost:8080](http://localhost:8080)
- 📚 **Swagger UI Docs**: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- 🗄️ **H2 Database Console**: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
  - **JDBC URL**: `jdbc:h2:mem:workoutdb`
  - **User**: `sa`
  - **Password**: `password`

---

### 3. (Optional) Run React Frontend in Vite Dev Server Mode
If you wish to make live frontend modifications with hot reload:

```bash
cd frontend
npm install
npm run dev
```
- Frontend Dev Server: [http://localhost:5173](http://localhost:5173) (Automatically proxies `/api` requests to Spring Boot on port `8080`)

---

## 🧪 Running Unit & Integration Tests

Execute the automated test suite covering authentication, services, and security filters:

```bash
./mvnw test
```

---

## 📦 Production Package

To generate a single, self-contained executable JAR file containing both the REST API backend and the production-optimized static React frontend:

```bash
# 1. Build frontend distribution assets
cd frontend && npm run build && cd ..

# 2. Package Spring Boot application
./mvnw package -DskipTests
```

The resulting executable production JAR will be created at:
`target/workoutTracker-0.0.1-SNAPSHOT.jar`

To run the JAR on any server:
```bash
java -jar target/workoutTracker-0.0.1-SNAPSHOT.jar
```

---

## 📄 License
Distributed under the MIT License.
