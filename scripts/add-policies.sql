-- Thêm RLS policies cho UPDATE và DELETE
-- Chạy file này trong Supabase SQL Editor nếu các policies chưa tồn tại

-- Tạo policy để cho phép update
DROP POLICY IF EXISTS "Cho phép update" ON courses;
CREATE POLICY "Cho phép update" ON courses
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Tạo policy để cho phép delete
DROP POLICY IF EXISTS "Cho phép delete" ON courses;
CREATE POLICY "Cho phép delete" ON courses
  FOR DELETE
  USING (true);

