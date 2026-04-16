# 📋 API Integration Status & Missing Fields

## ✅ Đã tích hợp xong

Frontend đã kết nối với các API endpoint sau:
- **POST /auth/register** - Đăng ký tài khoản
- **POST /auth/login** - Đăng nhập
- **GET /auth/me** - Lấy thông tin user hiện tại
- **GET /todos/** - Lấy danh sách todos
- **POST /todos/** - Tạo todo mới
- **PUT /todos/{todo_id}** - Cập nhật todo
- **DELETE /todos/{todo_id}** - Xóa todo
- **POST /chat/** - Chat với AI

## ⚠️ Fields đang Hard Data (Backend cần thêm)

### 1. **Todos: Cần thêm các field sau:**

```
col: string (enum: "todo" | "inprogress" | "done")
priority: string (enum: "high" | "medium" | "low")
tag: string (e.g., "Frontend", "Backend", "Design")
```

**Lý do:** Frontend hiện dùng kanban board với 3 cột. Backend trả `is_completed` (boolean) nhưng frontend cần `col` để track trạng thái chi tiết. Tag được dùng để phân loại task (Frontend, Backend, Design, Research, etc.)

**Ví dụ response mong muốn:**
```json
{
  "id": 1,
  "title": "Học FastAPI",
  "description": "Hoàn thành module authentication",
  "is_completed": false,
  "due_date": "2025-01-25T23:59:00",
  "start_date": "2025-01-20T08:00:00",
  "col": "inprogress",
  "priority": "high",
  "tag": "Backend",
  "user_id": 1,
  "created_at": "2025-01-20T08:00:00",
  "updated_at": null
}
```

---

### 2. **Chat: Response nên chi tiết hơn**

**Hiện tại:** Backend chỉ trả `answer` (text đơn giản)

**Frontend cần thêm** (tùy chọn - để cải thiện UX):
- Structured data để auto execute commands (e.g., tạo task tự động từ AI)
- Suggested actions (buttons nhanh để apply changes)

**Ví dụ:**
```json
{
  "answer": "Bạn hiện có 2 công việc chưa hoàn thành...",
  "suggested_action": {
    "type": "create_todo",
    "data": {...}
  }
}
```

---

## 📝 Test Checklist

- [ ] Frontend ghi nhớ token sau login (`localStorage`)
- [ ] Refresh page vẫn giữ session (auto re-auth)
- [ ] Logout xóa token
- [ ] Create/Update/Delete todo gọi API
- [ ] Chat API trả lời câu hỏi
- [ ] Error handling: hiển thị thông báo lỗi từ backend

---

## 🔧 Code Architecture

```
src/
├── services/
│   └── api.js          ← Centralized API calls (authService, todoService, chatService)
├── components/
│   ├── AuthPage.jsx    ← Login/Register form (dùng authService)
│   ├── Board.jsx       ← Todo kanban board
│   ├── ChatAssistant.jsx ← Chat UI (dùng chatService)
│   └── ... (other components)
├── App.jsx             ← Main app logic + auth state
└── data/
    └── initialData.js  ← Static data (columns, default tasks)
```

---

## 📌 Ghi chú

- Tất cả passwords được hash ở backend (✓)
- Tất cả API calls có Authorization bearer token (✓)
- Frontend tự động parse error & show toast message (✓)
- Loading state hiển thị khi waiting API response (✓)
