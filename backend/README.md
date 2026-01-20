# University Management System - Backend API

A C# ASP.NET Core Web API backend with MySQL database for the University Management System.

## Technology Stack

- **Framework**: ASP.NET Core 8.0
- **Database**: MySQL 8.0+
- **ORM**: Entity Framework Core 8.0 with Pomelo MySQL Provider
- **Authentication**: JWT Bearer Tokens
- **Password Hashing**: BCrypt.Net
- **API Documentation**: Swagger/OpenAPI

## Database Schema

The system includes the following tables:

| Table | Description |
|-------|-------------|
| `departments` | Academic departments (CS, MATH, etc.) |
| `classes` | Student class groups with cohort year |
| `accounts` | User accounts with roles and authentication |
| `students` | Student records linked to departments and classes |
| `teachers` | Teacher records linked to departments |
| `courses` | Course catalog with credits and descriptions |
| `sections` | Course sections per semester with teacher assignments |
| `enrollments` | Student enrollments in sections |
| `grades` | Student grades (midterm, final, other, GPA) |

### Entity Relationships

```
Department ─┬─► Classes ─► Students
            ├─► Teachers
            └─► Courses ─► Sections ─► Enrollments ─► Grades
                            │
                            ├─► Teacher
                            └─► Student
```

## Setup Instructions

### Prerequisites

1. **.NET 8.0 SDK** - Download from [dotnet.microsoft.com](https://dotnet.microsoft.com/download)
2. **MySQL Server 8.0+** - Download from [mysql.com](https://dev.mysql.com/downloads/)

### Database Setup

1. Start MySQL Server
2. Run the schema script to create the database:

```bash
mysql -u root -p < database/schema.sql
```

Or run it through MySQL Workbench.

3. Update the connection string in `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=university_db;User=root;Password=your_password;"
  }
}
```

### Running the API

```bash
# Navigate to the API project
cd UniversityAPI

# Restore packages
dotnet restore

# Run the application
dotnet run
```

The API will start at:
- HTTP: `http://localhost:5000`
- HTTPS: `https://localhost:5001`

### API Documentation

Once running, access Swagger UI at:
- `http://localhost:5000/swagger`

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |
| GET | `/api/auth/me` | Get current user |

### Departments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/departments` | Get all departments |
| GET | `/api/departments/{id}` | Get department by ID |
| POST | `/api/departments` | Create department |
| PUT | `/api/departments/{id}` | Update department |
| DELETE | `/api/departments/{id}` | Delete department |

### Students
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | Get all students (with filters) |
| GET | `/api/students/{id}` | Get student by ID |
| POST | `/api/students` | Create student |
| PUT | `/api/students/{id}` | Update student |
| DELETE | `/api/students/{id}` | Delete student |

### Teachers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/teachers` | Get all teachers |
| GET | `/api/teachers/{id}` | Get teacher by ID |
| POST | `/api/teachers` | Create teacher |
| PUT | `/api/teachers/{id}` | Update teacher |
| DELETE | `/api/teachers/{id}` | Delete teacher |

### Courses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | Get all courses |
| GET | `/api/courses/{id}` | Get course by ID |
| POST | `/api/courses` | Create course |
| PUT | `/api/courses/{id}` | Update course |
| DELETE | `/api/courses/{id}` | Delete course |

### Sections
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sections` | Get all sections (with filters) |
| GET | `/api/sections/{id}` | Get section by ID |
| POST | `/api/sections` | Create section |
| PUT | `/api/sections/{id}` | Update section |
| PATCH | `/api/sections/{id}/lock-grade` | Toggle grade lock |
| DELETE | `/api/sections/{id}` | Delete section |

### Enrollments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/enrollments` | Get all enrollments (with filters) |
| GET | `/api/enrollments/{id}` | Get enrollment by ID |
| POST | `/api/enrollments` | Create enrollment |
| PATCH | `/api/enrollments/{id}/status` | Update enrollment status |
| DELETE | `/api/enrollments/{id}` | Delete enrollment |

### Grades
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/grades/enrollment/{id}` | Get grade by enrollment |
| GET | `/api/grades/student/{id}` | Get all grades for student |
| POST | `/api/grades` | Update/create grade |

### Statistics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats/dashboard` | Get dashboard statistics |
| GET | `/api/stats/department/{id}` | Get department statistics |

## Demo Accounts

All demo accounts use password: `password123`

| Username | Role | Description |
|----------|------|-------------|
| admin | Admin | System Administrator |
| department | Department | Department Staff |
| turing | Teacher | Dr. Alan Turing (CS) |
| johnson | Teacher | Dr. Katherine Johnson (MATH) |
| hopper | Teacher | Dr. Grace Hopper (CS) |
| alice | Student | Alice Weaver |
| bob | Student | Bob Miller |
| charlie | Student | Charlie Brown |

## Grade Calculation

Grades are calculated as follows:
- **Midterm**: 30%
- **Final**: 50%
- **Other**: 20%

GPA Point Scale:
| Score Range | GPA | Letter |
|-------------|-----|--------|
| 90-100 | 4.0 | A |
| 85-89 | 3.7 | A- |
| 80-84 | 3.3 | B+ |
| 75-79 | 3.0 | B |
| 70-74 | 2.7 | B- |
| 65-69 | 2.3 | C+ |
| 60-64 | 2.0 | C |
| 55-59 | 1.7 | C- |
| 50-54 | 1.0 | D |
| 0-49 | 0.0 | F |

## Security

- Passwords are hashed using BCrypt
- JWT tokens expire after 7 days
- Role-based authorization for protected endpoints

## CORS Configuration

The API is configured to accept requests from:
- `http://localhost:3000` (Next.js development)
- `http://localhost:3001` (Alternative port)

Modify `Program.cs` to add additional origins for production.
