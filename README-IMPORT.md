# Hướng dẫn Import Dữ liệu Môn học vào Supabase

## Bước 1: Tạo bảng trong Supabase

1. Vào [Supabase Dashboard](https://supabase.com/dashboard/project/porhqzwqaasasexywvlr)
2. Vào **SQL Editor** (menu bên trái)
3. Copy toàn bộ nội dung file `scripts/create-table.sql`
4. Paste vào SQL Editor và click **Run**

## Bước 2: Import dữ liệu

Sau khi tạo bảng thành công, chạy lệnh sau để import dữ liệu:

```bash
npm run import:courses
```

Script sẽ:
- Parse dữ liệu CSV từ file `scripts/parse-courses.ts`
- Xóa dữ liệu cũ (nếu có)
- Import tất cả môn học vào bảng `courses`

## Kiểm tra kết quả

Sau khi import, bạn có thể kiểm tra trong Supabase Dashboard:
- Vào **Table Editor** → chọn bảng `courses`
- Bạn sẽ thấy tất cả các môn học đã được import

## Cấu trúc dữ liệu

Bảng `courses` bao gồm các cột:
- `stt`: Số thứ tự
- `ma_mh`: Mã môn học
- `ten_mon_hoc`: Tên môn học
- `so_tin_chi`: Số tín chỉ
- `hoc_ky`: Học kỳ
- `nam_hoc`: Năm học
- Và nhiều trường khác...

