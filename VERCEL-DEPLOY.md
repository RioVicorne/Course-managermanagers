# Hướng dẫn Deploy lên Vercel

## Cấu hình Environment Variables trên Vercel

Để project hoạt động đúng trên Vercel, bạn cần thêm các biến môi trường sau:

### Bước 1: Vào Vercel Dashboard
1. Mở project trên Vercel
2. Vào **Settings** → **Environment Variables**

### Bước 2: Thêm các biến sau:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Bước 3: Redeploy
Sau khi thêm environment variables, click **Redeploy** để áp dụng thay đổi.

## Lưu ý:
- Đảm bảo các biến môi trường có prefix `NEXT_PUBLIC_` để có thể truy cập từ client-side
- Sau khi thêm env vars, cần redeploy lại project
- Kiểm tra build logs trên Vercel để đảm bảo build thành công

