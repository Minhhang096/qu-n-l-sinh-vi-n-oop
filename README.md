# Hệ Thống Quản Lý Đại Học

Ứng dụng quản lý đại học full-stack với giao diện Next.js và backend C# ASP.NET Core.

## 🚀 Khởi Động Nhanh (Chỉ Frontend - Dữ Liệu Mẫu)

Không cần cài đặt backend! Frontend chạy với dữ liệu mẫu mặc định.

```bash
# Cài đặt dependencies
npm install

# Chạy server phát triển
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt.

### Tài Khoản Demo

| Tên đăng nhập | Mật khẩu | Vai trò |
|---------------|----------|---------|
| `admin` | `password123` | Quản trị viên |
| `department` | `password123` | Nhân viên Khoa |
| `turing` | `password123` | Giảng viên (CNTT) |
| `johnson` | `password123` | Giảng viên (Toán) |
| `alice` | `password123` | Sinh viên |
| `bob` | `password123` | Sinh viên |

---

## 📁 Cấu Trúc Dự Án

```
university-app/
├── app/                    # Trang Next.js App Router
│   ├── (admin)/           # Trang quản trị
│   ├── (auth)/            # Trang đăng nhập/đăng ký
│   └── (portal)/          # Cổng sinh viên/giảng viên/khoa
├── components/            # Các component React
│   ├── layouts/           # Layout (Navbar, Sidebar)
│   ├── ui/                # Component UI (shadcn/ui)
│   └── shared/            # Component dùng chung
├── lib/                   # Tiện ích và API client
│   ├── api-client.ts      # API client với dữ liệu mẫu
│   ├── auth-context.tsx   # Context xác thực
│   └── mock-api-data.ts   # Dữ liệu mẫu để test
├── backend/               # API C# ASP.NET Core
│   ├── UniversityAPI/     # Dự án API
│   └── database/          # Script SQL
└── hooks/                 # Custom React hooks
```

---

## 🖥️ Frontend

### Công Nghệ Sử Dụng
- **Framework**: Next.js 16 (App Router)
- **Giao diện**: shadcn/ui + Tailwind CSS
- **Animation**: Framer Motion
- **State**: React Context

### Chạy Frontend

```bash
npm run dev      # Phát triển (http://localhost:3000)
npm run build    # Build production
npm run start    # Chạy server production
```

### Biến Môi Trường

Tạo file `.env.local` cho production:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Chuyển Sang Backend Thật

Sửa file `lib/api-client.ts`:

```typescript
const USE_MOCK_DATA = false;  // Đổi từ true sang false
```

---

## ⚙️ Backend (Tùy Chọn)

### Yêu Cầu

1. [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
2. [MySQL 8.0+](https://dev.mysql.com/downloads/)

### Cài Đặt Database

1. Khởi động MySQL Server

2. Chạy script tạo database:
```bash
mysql -u root -p < backend/database/schema.sql
```

3. Cập nhật connection string trong `backend/UniversityAPI/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=university_db;User=root;Password=MẬT_KHẨU_CỦA_BẠN;"
  }
}
```

### Chạy Backend

```bash
cd backend/UniversityAPI
dotnet restore
dotnet run
```

API chạy tại: `http://localhost:5000`

Swagger UI: `http://localhost:5000/swagger`

### Các Endpoint API

| Phương thức | Endpoint | Mô tả |
|-------------|----------|-------|
| POST | `/api/auth/login` | Đăng nhập |
| POST | `/api/auth/register` | Đăng ký |
| GET | `/api/auth/me` | Lấy thông tin user hiện tại |
| GET/POST/PUT/DELETE | `/api/departments` | CRUD Khoa |
| GET/POST/PUT/DELETE | `/api/classes` | CRUD Lớp học |
| GET/POST/PUT/DELETE | `/api/students` | CRUD Sinh viên |
| GET/POST/PUT/DELETE | `/api/teachers` | CRUD Giảng viên |
| GET/POST/PUT/DELETE | `/api/courses` | CRUD Môn học |
| GET/POST/PUT/DELETE | `/api/sections` | CRUD Lớp học phần |
| GET/POST/PUT/DELETE | `/api/enrollments` | CRUD Đăng ký học |
| GET/POST | `/api/grades` | Quản lý điểm |
| GET | `/api/stats/dashboard` | Thống kê tổng quan |

---

## 🗄️ Cấu Trúc Database

Xem [DATABASE_SCHEMA.md](backend/DATABASE_SCHEMA.md) để biết chi tiết.

### Tổng Quan Các Bảng

| Bảng | Mô tả |
|------|-------|
| `departments` | Khoa (CNTT, Toán, v.v.) |
| `classes` | Lớp sinh viên theo khóa |
| `accounts` | Tài khoản và phân quyền |
| `students` | Thông tin sinh viên |
| `teachers` | Thông tin giảng viên |
| `courses` | Danh mục môn học |
| `sections` | Lớp học phần theo học kỳ |
| `enrollments` | Đăng ký học phần |
| `grades` | Điểm (giữa kỳ, cuối kỳ, GPA) |

### Công Thức Tính Điểm

| Trọng số | Thành phần |
|----------|------------|
| 30% | Giữa kỳ |
| 50% | Cuối kỳ |
| 20% | Khác |

---

## 👥 Phân Quyền Người Dùng

| Vai trò | Quyền hạn |
|---------|-----------|
| **Quản trị viên** | Toàn quyền hệ thống, quản lý người dùng |
| **Khoa** | Quản lý môn học, lớp học phần, sinh viên, đăng ký học |
| **Giảng viên** | Xem lớp được phân công, quản lý điểm |
| **Sinh viên** | Xem môn học, đăng ký, điểm |

---

## 🧪 Test Không Cần Backend

Frontend đã có sẵn dữ liệu mẫu đầy đủ:

- **5 Khoa**: CNTT, Toán, Vật lý, Văn học, Sinh học
- **4 Lớp**: CS2024A, CS2024B, MATH2024, PHYS2023
- **3 Sinh viên**: Alice, Bob, Charlie (có đăng ký & điểm)
- **3 Giảng viên**: Turing, Johnson, Hopper
- **5 Môn học**: CS101, CS201, CS450, MATH201, ENG102
- **4 Lớp học phần**: Học kỳ Xuân 2026

Tất cả thao tác CRUD hoạt động ở chế độ mock (dữ liệu lưu trong bộ nhớ trong phiên làm việc).

---

## 📝 Các Lệnh

```bash
npm run dev       # Khởi động server phát triển
npm run build     # Build cho production
npm run start     # Chạy server production
npm run lint      # Chạy ESLint
```

---

## 🛠️ Phát Triển

### Thêm Trang Mới

1. Tạo trang trong thư mục `app/` theo quy ước Next.js App Router
2. Sử dụng layout có sẵn từ `components/layouts/`
3. Sử dụng API client từ `lib/api-client.ts`

### Thêm API Endpoint Mới

1. Thêm types vào `lib/api-client.ts`
2. Thêm dữ liệu mẫu vào `lib/mock-api-data.ts`
3. Thêm phương thức API với mock fallback

---

## 📄 Giấy Phép

MIT
