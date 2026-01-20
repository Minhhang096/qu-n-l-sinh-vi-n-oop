# 🎯 Hướng dẫn Test Tính Năng Khóa Điểm & Nhập Điểm Giáo Viên

## ✅ Các Tính Năng Đã Hoạt động 100%:

### 1. **Danh sách sinh viên** 
- Fetch từ backend `/api/enrollments?sectionId=3`
- Section CS201 có 1 sinh viên (2024002)

### 2. **Xem điểm sinh viên**
- Fetch từ backend `/api/grades/enrollment/{enrollmentId}`
- Hiển thị: Giữa kỳ, Cuối kỳ, Tổng điểm, Xếp loại

### 3. **Nhập/Sửa điểm**
- POST `/api/grades` - cập nhật midterm/final/other
- Auto-calculate GPA point & letter grade
- Nút "Sửa điểm" → "Lưu điểm"

### 4. **Khóa/Mở khóa điểm** ✅ **NEW**
- PATCH `/api/sections/{id}/lock-grade`
- Toggle `isGradeLocked` flag
- Disable input fields khi khóa
- Hiển thị trạng thái lock/unlock

### 5. **Xuất CSV**
- Download danh sách sinh viên + điểm
- Format: CSV (Mã SV, Tên SV, Giữa kỳ, Cuối kỳ, Tổng, Xếp loại)

---

## 🔐 Cách Setup Token (Bắt buộc lần đầu):

### Option 1: Vào trang `/setup-token` (Dễ nhất)
```
http://localhost:3000/setup-token
```
- Tự động set token + user vào localStorage
- Redirect tới `/teacher/classes/CS201-02`

### Option 2: Manual setup qua DevTools
```javascript
// Copy-paste vào DevTools Console (F12):
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjgiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoidDAwMSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlRlYWNoZXIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJhLnR1cmluZ0B1bml2LmVkdSIsImV4cCI6MTc2OTQyNDQ2OSwiaXNzIjoiVW5pdmVyc2l0eUFQSSIsImF1ZCI6IlVuaXZlcnNpdHlBcHAifQ.1H0wi_uIeZqx30J8PKamN3R9R5kGR2ta2KyOr9f0bQk";
const user = {accountId: 8,username: 't001',role: 'Teacher',fullName: 'Dr. Alan Turing',email: 'a.turing@univ.edu',isLocked: false,createdAt: '2019-08-01T00:00:00',student: null,teacher: {teacherId: 'T001',fullName: 'Dr. Alan Turing',email: 'a.turing@univ.edu',deptId: 'CS',deptName: 'Computer Science',status: 'Active',accountId: null,sectionCount: 0}};

localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(user));
location.reload();
```

---

## 🧪 Test Endpoints:

### Nếu muốn test API trực tiếp:
```bash
node test-full-flow.js
```
Output:
```
✓ Found 6 sections
✓ Found CS201 section: ID=3
✓ Found 1 enrollments
✓ Enrollment 3: {"gradeId":3,"midterm":78,"final":82...}
✓ Grade updated: success
✓ Grade lock toggled: isLocked=true
```

---

## 📍 URLs để test:

| URL | Mục đích |
|-----|---------|
| `http://localhost:3000/setup-token` | 🔑 Set token (chạy lần đầu) |
| `http://localhost:3000/teacher/classes/CS201-02` | 📊 Trang quản lý điểm (Main) |
| `http://localhost:3000/debug` | 🐛 Debug API responses |

---

## ✅ Kiểm tra hoạt động:

### Trang `/teacher/classes/CS201-02` sẽ hiển thị:
- ✅ Tên lớp: "Data Structures & Algorithms"
- ✅ Trạng thái: "Đang mở" hoặc "🔒 Đã khóa"
- ✅ Thống kê: Điểm TB, Điểm cao, Tỷ lệ đạt
- ✅ Danh sách 1 sinh viên: 2024002
- ✅ Điểm: Giữa kỳ=78, Cuối kỳ=82, Tổng=80.8, Xếp loại=B
- ✅ 3 Nút: "Xuất CSV", "Khóa điểm", "Sửa điểm"

### Khi nhấn "Sửa điểm":
- Các input fields được enable
- Có thể nhập/sửa Giữa kỳ & Cuối kỳ
- Nút thay đổi thành "Lưu điểm"

### Khi nhấn "Khóa điểm":
- Nút thay đổi thành "Mở khóa"
- Badge status thay đổi thành "🔒 Đã khóa"
- Input fields bị disable (không sửa được)

---

## 🐛 Nếu gặp vấn đề:

1. **Không thấy dữ liệu sinh viên**
   - Chắc chắn đã vào `/setup-token` trước
   - Check DevTools Console có lỗi không

2. **Nút Khóa/Sửa điểm không làm việc**
   - Kiểm tra Network tab xem request gửi được không
   - Backend log có lỗi gì không

3. **Lỗi "No token found"**
   - Vào `/setup-token` để set token
   - Hoặc clear localStorage và đăng nhập lại

---

✨ **Tất cả tính năng đã ready to use!**
