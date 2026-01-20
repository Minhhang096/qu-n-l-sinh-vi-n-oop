# Kết Nối Frontend và Backend - Hướng Dẫn Khởi Động

## Yêu Cầu
- .NET SDK 8.0 hoặc cao hơn
- Node.js 18+ và npm
- MySQL Server đang chạy (port 3306)
- Git Bash hoặc PowerShell

---

## 1. Chuẩn Bị Database

### Bước 1.1: Tạo Database
```sql
CREATE DATABASE university_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Bước 1.2: Chạy Schema
Sử dụng MySQL Client hoặc MySQL Workbench để chạy file schema:
```bash
mysql -u root -p university_db < database/schema.sql
```

---

## 2. Khởi Động Backend (.NET API)

### Bước 2.1: Mở PowerShell và Navigate
```powershell
cd "c:\Users\Admin\Downloads\Student-Management-main\backend\UniversityAPI"
```

### Bước 2.2: Restore Dependencies
```powershell
dotnet restore
```

### Bước 2.3: Chạy API
```powershell
dotnet run
```

**Output mong đợi:**
```
Now listening on: http://localhost:5000
Now listening on: https://localhost:5001
Application started. Press Ctrl+C to shut down.
```

### Bước 2.4: Kiểm Tra Swagger
Mở trình duyệt: http://localhost:5000/swagger

---

## 3. Khởi Động Frontend (Next.js)

### Bước 3.1: Mở Terminal Mới và Navigate
```bash
cd "c:\Users\Admin\Downloads\Student-Management-main"
```

### Bước 3.2: Install Dependencies
```bash
npm install
```

### Bước 3.3: Chạy Development Server
```bash
npm run dev
```

**Output mong đợi:**
```
> next dev
  ▲ Next.js 16.1.2
  - Local: http://localhost:3000
  - Environments: .env.local
```

---

## 4. Kiểm Tra Kết Nối

### Bước 4.1: Mở Ứng Dụng
Truy cập: http://localhost:3000

### Bước 4.2: Login Test
- Nếu thấy form login mà không có lỗi network → Backend và Frontend đã kết nối
- API base URL: `http://localhost:5000/api` (từ `.env.local`)
- Backend sử dụng JWT Authentication

### Bước 4.3: Kiểm Tra Browser Console (F12)
- Bật DevTools (F12)
- Chuyển sang tab **Network**
- Thực hiện login
- Bạn sẽ thấy các request đến `/api/auth/login`

---

## 5. Cấu Hình Quan Trọng

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend (appsettings.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=university_db;User=root;Password=root;"
  },
  "Jwt": {
    "Key": "YourSuperSecretKeyThatIs32BytesLong!",
    "Issuer": "UniversityAPI",
    "Audience": "UniversityApp"
  }
}
```

---

## 6. Troubleshooting

### Lỗi: "Cannot GET /api/auth/login"
- ✅ Kiểm tra Backend có chạy ở port 5000
- ✅ Kiểm tra CORS settings trong Program.cs

### Lỗi: "Network Error"
- ✅ Kiểm tra firewall cho phép port 5000
- ✅ Kiểm tra `.env.local` có `NEXT_PUBLIC_API_URL`

### Lỗi: "Connection refused" MySQL
- ✅ Kiểm tra MySQL Server đang chạy
- ✅ Kiểm tra `appsettings.json` connection string

### Lỗi: "USE_MOCK_DATA is true"
- ✅ Kiểm tra `/lib/api-client.ts` dòng 19: `const USE_MOCK_DATA = false;`

---

## 7. Endpoints Chính

| Phương Thức | Endpoint | Mô Tả |
|---|---|---|
| POST | `/api/auth/login` | Đăng nhập |
| POST | `/api/auth/register` | Đăng ký |
| GET | `/api/auth/me` | Lấy thông tin user hiện tại |
| GET | `/api/departments` | Danh sách khoa |
| GET | `/api/students` | Danh sách sinh viên |
| GET | `/api/teachers` | Danh sách giáo viên |
| GET | `/api/courses` | Danh sách khóa học |
| GET | `/api/stats` | Thống kê chung |

---

## 8. Các Ports Quan Trọng
- **Frontend**: http://localhost:3000 (Next.js)
- **Backend API**: http://localhost:5000 (ASP.NET Core)
- **Swagger UI**: http://localhost:5000/swagger
- **MySQL**: localhost:3306

---

## 9. Dừng Ứng Dụng
- Nhấn `Ctrl+C` trong mỗi terminal

---

**Chúc bạn thành công! 🚀**
