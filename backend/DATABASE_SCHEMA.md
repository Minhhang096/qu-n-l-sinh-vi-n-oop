# Hệ Thống Quản Lý Đại Học - Cấu Trúc Database

## Tổng Quan

Tài liệu này mô tả cấu trúc database MySQL cho Hệ Thống Quản Lý Đại Học.

---

## Sơ Đồ Quan Hệ Thực Thể

```
┌─────────────────┐
│   departments   │
│   (Khoa)        │
│─────────────────│
│ dept_id (PK)    │◄──────────────────────────────────────────┐
│ dept_name       │                                           │
└────────┬────────┘                                           │
         │                                                    │
         │ 1:N                                                │
         ▼                                                    │
┌─────────────────┐       ┌─────────────────┐                │
│     classes     │       │    accounts     │                │
│     (Lớp)       │       │   (Tài khoản)   │                │
│─────────────────│       │─────────────────│                │
│ class_id (PK)   │◄──┐   │ account_id (PK) │◄──────┐        │
│ class_name      │   │   │ username        │       │        │
│ dept_id (FK)────│───┘   │ password        │       │        │
│ cohort_year     │       │ is_locked       │       │        │
└────────┬────────┘       │ created_at      │       │        │
         │                │ role            │       │        │
         │ 1:N            │ full_name       │       │        │
         ▼                │ email           │       │        │
┌─────────────────┐       └────────┬────────┘       │        │
│    students     │                │                │        │
│   (Sinh viên)   │                │ 1:1            │        │
│─────────────────│                │                │        │
│ student_id (PK) │◄───────────────┼────────────────┤        │
│ fullname        │                │                │        │
│ dob             │                │                │        │
│ email           │                ▼                │        │
│ dept_id (FK)────│───────────────────────┐        │        │
│ status          │       ┌─────────────────┐      │        │
│ class_id (FK)───│──┐    │    teachers     │      │        │
│ account_id (FK) │  │    │  (Giảng viên)   │      │        │
└────────┬────────┘  │    │─────────────────│      │        │
         │           │    │ teacher_id (PK) │◄─────┼────────┤
         │           │    │ full_name       │      │        │
         │           │    │ email           │      │        │
         │           │    │ dept_id (FK)────│──────┼────────┘
         │           │    │ account_id (FK) │──────┘
         │           │    │ status          │
         │           │    └────────┬────────┘
         │           │             │
         │           │             │ 1:N
         │           │             ▼
         │           │    ┌─────────────────┐       ┌─────────────────┐
         │           │    │    sections     │       │     courses     │
         │           │    │ (Lớp học phần)  │       │    (Môn học)    │
         │           │    │─────────────────│       │─────────────────│
         │           │    │ section_id (PK) │       │ course_id (PK)  │◄──┐
         │           │    │ course_id (FK)──│──────►│ course_name     │   │
         │           │    │ semester        │       │ credits         │   │
         │           │    │ teacher_id (FK) │       │ dept_id (FK)────│───┘
         │           │    │ capacity        │       │ description     │
         │           │    │ status          │       └─────────────────┘
         │           │    │ is_grade_locked │
         │           │    │ schedule        │
         │           │    │ room            │
         │           │    └────────┬────────┘
         │           │             │
         │           │             │ 1:N
         │           │             ▼
         │           │    ┌─────────────────┐
         │           │    │   enrollments   │
         │           │    │  (Đăng ký học)  │
         │           │    │─────────────────│
         │           └───►│ enrollment_id   │
         │                │ (PK)            │
         └───────────────►│ student_id (FK) │
                          │ section_id (FK) │
                          │ enroll_date     │
                          │ status          │
                          └────────┬────────┘
                                   │
                                   │ 1:1
                                   ▼
                          ┌─────────────────┐
                          │     grades      │
                          │     (Điểm)      │
                          │─────────────────│
                          │ grade_id (PK)   │
                          │ enrollment_id   │
                          │ (FK, UNIQUE)    │
                          │ midterm         │
                          │ final           │
                          │ other           │
                          │ gpa_point       │
                          │ letter_grade    │
                          │ updated_at      │
                          │ updated_by      │
                          └─────────────────┘
```

---

## Các Bảng

### 1. `departments` (Khoa)

Lưu thông tin các khoa trong trường.

| Cột | Kiểu | Ràng buộc | Mô tả |
|-----|------|-----------|-------|
| `dept_id` | VARCHAR(10) | PRIMARY KEY | Mã khoa (vd: "CS", "MATH") |
| `dept_name` | VARCHAR(100) | NOT NULL | Tên đầy đủ của khoa |

**Dữ liệu mẫu:**
```sql
('CS', 'Công nghệ Thông tin')
('MATH', 'Toán học')
('PHYS', 'Vật lý')
```

---

### 2. `classes` (Lớp)

Lưu thông tin các lớp sinh viên theo khóa.

| Cột | Kiểu | Ràng buộc | Mô tả |
|-----|------|-----------|-------|
| `class_id` | VARCHAR(20) | PRIMARY KEY | Mã lớp (vd: "CS2024A") |
| `class_name` | VARCHAR(100) | NOT NULL | Tên lớp |
| `dept_id` | VARCHAR(10) | FOREIGN KEY | Tham chiếu `departments.dept_id` |
| `cohort_year` | INT | NOT NULL | Năm nhập học (vd: 2024) |

**Dữ liệu mẫu:**
```sql
('CS2024A', 'CNTT 2024 - Nhóm A', 'CS', 2024)
('MATH2024', 'Toán 2024', 'MATH', 2024)
```

---

### 3. `accounts` (Tài khoản)

Lưu thông tin xác thực và phân quyền người dùng.

| Cột | Kiểu | Ràng buộc | Mô tả |
|-----|------|-----------|-------|
| `account_id` | INT | PRIMARY KEY, AUTO_INCREMENT | ID tài khoản |
| `username` | VARCHAR(50) | NOT NULL, UNIQUE | Tên đăng nhập |
| `password` | VARCHAR(255) | NOT NULL | Mật khẩu đã mã hóa BCrypt |
| `is_locked` | BOOLEAN | DEFAULT FALSE | Trạng thái khóa tài khoản |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Ngày tạo |
| `role` | VARCHAR(20) | NOT NULL, DEFAULT 'Student' | Vai trò |
| `full_name` | VARCHAR(100) | | Họ tên đầy đủ |
| `email` | VARCHAR(100) | | Địa chỉ email |

**Các vai trò:** `Admin` (Quản trị), `Department` (Khoa), `Teacher` (Giảng viên), `Student` (Sinh viên)

---

### 4. `students` (Sinh viên)

Lưu thông tin sinh viên.

| Cột | Kiểu | Ràng buộc | Mô tả |
|-----|------|-----------|-------|
| `student_id` | VARCHAR(20) | PRIMARY KEY | Mã sinh viên (vd: "2024001") |
| `fullname` | VARCHAR(100) | NOT NULL | Họ tên sinh viên |
| `dob` | DATE | | Ngày sinh |
| `email` | VARCHAR(100) | | Email |
| `dept_id` | VARCHAR(10) | FOREIGN KEY, NOT NULL | Khoa |
| `status` | VARCHAR(20) | DEFAULT 'Active' | Trạng thái |
| `class_id` | VARCHAR(20) | FOREIGN KEY, NOT NULL | Lớp |
| `account_id` | INT | FOREIGN KEY | Tài khoản liên kết |

**Các trạng thái:** `Active` (Đang học), `OnLeave` (Bảo lưu), `Graduated` (Đã tốt nghiệp), `Suspended` (Đình chỉ)

---

### 5. `teachers` (Giảng viên)

Lưu thông tin giảng viên.

| Cột | Kiểu | Ràng buộc | Mô tả |
|-----|------|-----------|-------|
| `teacher_id` | VARCHAR(20) | PRIMARY KEY | Mã giảng viên (vd: "T001") |
| `full_name` | VARCHAR(100) | NOT NULL | Họ tên giảng viên |
| `email` | VARCHAR(100) | | Email |
| `dept_id` | VARCHAR(10) | FOREIGN KEY, NOT NULL | Khoa |
| `account_id` | INT | FOREIGN KEY | Tài khoản liên kết |
| `status` | VARCHAR(20) | DEFAULT 'Active' | Trạng thái công việc |

**Các trạng thái:** `Active` (Đang làm việc), `Inactive` (Nghỉ việc)

---

### 6. `courses` (Môn học)

Lưu danh mục môn học.

| Cột | Kiểu | Ràng buộc | Mô tả |
|-----|------|-----------|-------|
| `course_id` | VARCHAR(20) | PRIMARY KEY | Mã môn (vd: "CS101") |
| `course_name` | VARCHAR(100) | NOT NULL | Tên môn học |
| `credits` | INT | NOT NULL | Số tín chỉ |
| `dept_id` | VARCHAR(10) | FOREIGN KEY, NOT NULL | Khoa phụ trách |
| `description` | VARCHAR(500) | | Mô tả môn học |

**Dữ liệu mẫu:**
```sql
('CS101', 'Nhập môn Lập trình', 4, 'CS', 'Các khái niệm cơ bản về lập trình')
('MATH201', 'Đại số Tuyến tính', 3, 'MATH', 'Vector và ma trận')
```

---

### 7. `sections` (Lớp học phần)

Lưu các lớp học phần mở theo từng học kỳ.

| Cột | Kiểu | Ràng buộc | Mô tả |
|-----|------|-----------|-------|
| `section_id` | INT | PRIMARY KEY, AUTO_INCREMENT | ID lớp học phần |
| `course_id` | VARCHAR(20) | FOREIGN KEY, NOT NULL | Môn học |
| `semester` | VARCHAR(20) | NOT NULL | Học kỳ (vd: "HK1-2026") |
| `teacher_id` | VARCHAR(20) | FOREIGN KEY, NOT NULL | Giảng viên phụ trách |
| `capacity` | INT | NOT NULL | Sĩ số tối đa |
| `status` | VARCHAR(20) | DEFAULT 'Open' | Trạng thái |
| `is_grade_locked` | BOOLEAN | DEFAULT FALSE | Khóa nhập điểm |
| `schedule` | VARCHAR(100) | | Lịch học |
| `room` | VARCHAR(50) | | Phòng học |

**Các trạng thái:** `Open` (Đang mở), `Closed` (Đã đóng), `Canceled` (Đã hủy)

---

### 8. `enrollments` (Đăng ký học)

Lưu thông tin đăng ký học phần của sinh viên.

| Cột | Kiểu | Ràng buộc | Mô tả |
|-----|------|-----------|-------|
| `enrollment_id` | INT | PRIMARY KEY, AUTO_INCREMENT | ID đăng ký |
| `student_id` | VARCHAR(20) | FOREIGN KEY, NOT NULL | Sinh viên |
| `section_id` | INT | FOREIGN KEY, NOT NULL | Lớp học phần |
| `enroll_date` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Ngày đăng ký |
| `status` | VARCHAR(20) | DEFAULT 'Enrolled' | Trạng thái |

**Ràng buộc:** `UNIQUE (student_id, section_id)` - tránh đăng ký trùng

**Các trạng thái:** `Enrolled` (Đã đăng ký), `Completed` (Hoàn thành), `Dropped` (Hủy), `Canceled` (Bị hủy)

---

### 9. `grades` (Điểm)

Lưu điểm của sinh viên.

| Cột | Kiểu | Ràng buộc | Mô tả |
|-----|------|-----------|-------|
| `grade_id` | INT | PRIMARY KEY, AUTO_INCREMENT | ID điểm |
| `enrollment_id` | INT | FOREIGN KEY, UNIQUE, NOT NULL | Đăng ký học |
| `midterm` | DECIMAL(5,2) | | Điểm giữa kỳ (0-100) |
| `final` | DECIMAL(5,2) | | Điểm cuối kỳ (0-100) |
| `other` | DECIMAL(5,2) | | Điểm khác (0-100) |
| `gpa_point` | DECIMAL(3,2) | | Điểm GPA (0.0-4.0) |
| `letter_grade` | VARCHAR(5) | | Điểm chữ (A, B+, v.v.) |
| `updated_at` | DATETIME | AUTO UPDATE | Thời gian cập nhật |
| `updated_by` | VARCHAR(20) | | Người cập nhật |

**Công thức tính điểm:**
- Giữa kỳ: 30%
- Cuối kỳ: 50%
- Khác: 20%

**Bảng quy đổi GPA:**
| Điểm | GPA | Xếp loại |
|------|-----|----------|
| 90-100 | 4.0 | A (Xuất sắc) |
| 85-89 | 3.7 | A- |
| 80-84 | 3.3 | B+ (Giỏi) |
| 75-79 | 3.0 | B |
| 70-74 | 2.7 | B- |
| 65-69 | 2.3 | C+ (Khá) |
| 60-64 | 2.0 | C |
| 55-59 | 1.7 | C- |
| 50-54 | 1.0 | D (Trung bình) |
| 0-49 | 0.0 | F (Không đạt) |

---

## Chỉ Mục (Indexes)

```sql
CREATE INDEX idx_students_dept ON students(dept_id);
CREATE INDEX idx_students_class ON students(class_id);
CREATE INDEX idx_teachers_dept ON teachers(dept_id);
CREATE INDEX idx_courses_dept ON courses(dept_id);
CREATE INDEX idx_sections_course ON sections(course_id);
CREATE INDEX idx_sections_teacher ON sections(teacher_id);
CREATE INDEX idx_sections_semester ON sections(semester);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_section ON enrollments(section_id);
```

---

## Truy Vấn Mẫu

### Lấy tất cả sinh viên trong một khoa
```sql
SELECT s.*, c.class_name, d.dept_name
FROM students s
JOIN classes c ON s.class_id = c.class_id
JOIN departments d ON s.dept_id = d.dept_id
WHERE s.dept_id = 'CS';
```

### Lấy các lớp học phần của giảng viên với số lượng sinh viên
```sql
SELECT sec.*, c.course_name, COUNT(e.enrollment_id) as so_sv_dang_ky
FROM sections sec
JOIN courses c ON sec.course_id = c.course_id
LEFT JOIN enrollments e ON sec.section_id = e.section_id
WHERE sec.teacher_id = 'T001'
GROUP BY sec.section_id;
```

### Lấy điểm của sinh viên với thông tin môn học
```sql
SELECT e.*, c.course_name, g.midterm, g.final, g.other, g.gpa_point, g.letter_grade
FROM enrollments e
JOIN sections sec ON e.section_id = sec.section_id
JOIN courses c ON sec.course_id = c.course_id
LEFT JOIN grades g ON e.enrollment_id = g.enrollment_id
WHERE e.student_id = '2024001';
```

### Tính GPA trung bình của sinh viên
```sql
SELECT s.student_id, s.fullname, AVG(g.gpa_point) as gpa_tb
FROM students s
JOIN enrollments e ON s.student_id = e.student_id
JOIN grades g ON e.enrollment_id = g.enrollment_id
WHERE e.status = 'Completed'
GROUP BY s.student_id;
```

---

## Tham Khảo Nhanh

| Bảng | Khóa chính | Khóa ngoại chính |
|------|------------|------------------|
| departments | dept_id | - |
| classes | class_id | dept_id |
| accounts | account_id | - |
| students | student_id | dept_id, class_id, account_id |
| teachers | teacher_id | dept_id, account_id |
| courses | course_id | dept_id |
| sections | section_id | course_id, teacher_id |
| enrollments | enrollment_id | student_id, section_id |
| grades | grade_id | enrollment_id |
