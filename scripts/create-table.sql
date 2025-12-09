-- Tạo bảng courses trong Supabase
CREATE TABLE IF NOT EXISTS courses (
  id BIGSERIAL PRIMARY KEY,
  stt INTEGER,
  ma_mh VARCHAR(50) NOT NULL,
  ten_mon_hoc VARCHAR(255) NOT NULL,
  chuyen_nganh VARCHAR(100),
  mon_cot_loi VARCHAR(100),
  so_tin_chi INTEGER,
  so_tin_chi_hoc_phi INTEGER,
  mon_bat_buoc BOOLEAN DEFAULT FALSE,
  da_hoc BOOLEAN DEFAULT FALSE,
  nhom VARCHAR(50),
  nhanh VARCHAR(50),
  so_tin_chi_toi_thieu INTEGER,
  so_tin_chi_toi_da INTEGER,
  mon_hoc_da_hoc_va_dat TEXT,
  tong_tiet INTEGER,
  ly_thuyet INTEGER,
  thuc_hanh INTEGER,
  tiet_thanh_phan VARCHAR(100),
  hoc_ky VARCHAR(10),
  nam_hoc VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Tạo index cho các trường thường tìm kiếm
CREATE INDEX IF NOT EXISTS idx_courses_ma_mh ON courses(ma_mh);
CREATE INDEX IF NOT EXISTS idx_courses_hoc_ky ON courses(hoc_ky);
CREATE INDEX IF NOT EXISTS idx_courses_nam_hoc ON courses(nam_hoc);

-- Bật RLS (Row Level Security) nếu cần
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Tạo policy để cho phép đọc công khai (tùy chỉnh theo nhu cầu)
CREATE POLICY "Cho phép đọc công khai" ON courses
  FOR SELECT
  USING (true);

-- Tạo policy để cho phép insert (chỉ admin, có thể tùy chỉnh)
CREATE POLICY "Cho phép insert" ON courses
  FOR INSERT
  WITH CHECK (true);

-- Tạo policy để cho phép update
CREATE POLICY "Cho phép update" ON courses
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Tạo policy để cho phép delete
CREATE POLICY "Cho phép delete" ON courses
  FOR DELETE
  USING (true);

-- Tạo trigger để tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE
    ON courses FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

