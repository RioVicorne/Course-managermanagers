// Script chạy import dữ liệu vào Supabase
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

// Import parse function directly
const csvData = `STT,Mã MH,Tên môn học,Chuyên ngành,Môn cốt lõi,Số tín chỉ,Số tín chỉ học phí,Môn bắt buộc,Đã học,Nhóm,Nhánh,Số tín chỉ tối thiểu,Số tín chỉ tối đa,Môn học đã học và đạt,Tổng tiết,lý thuyết,thực hành,Tiết thành phần

Học kỳ 1 - Năm học 2025 - 2026,,,,,23,20,,,,,,,,,,,

1,200101,Triết học Mác Lênin,,,3,3,x,x,,,,,,45,45,,

2,202108,Toán cao cấp A1,,,3,3,x,x,,,,,,45,45,,

3,202109,Toán cao cấp A2,,,3,3,x,x,,,,,,45,45,,

4,202206,Vật lý 2,,,2,2,x,x,,,,,,30,30,,

5,202501,Giáo dục thể chất 1*,,,1,1,x,x,,,,,,45,,,

6,213603,Anh văn 1*,,,4,4,x,,,,,,,60,60,,

7,214202,Nhập môn công nghệ thông tin,,,3,0,x,x,,,,,,60,30,30,

8,214321,Lập trình cơ bản,,,4,4,x,x,,,,,,75,45,30,

Học kỳ 2 - Năm học 2025 - 2026,,,,,25,21,,,,,,,,,,,

1,200102,Kinh tế chính trị Mác- Lênin,,,2,2,x,,,,,,,30,30,,

2,200201,Quân sự 1 (lý thuyết)*,,,3,3,x,,,,,,,45,45,,

3,200202,Quân sự 2 (thực hành)*,,,3,3,x,,,,,,,90,,90,

4,202110,Toán cao cấp A3,,,3,3,x,,,,,,,45,45,,

5,202502,Giáo dục thể chất 2*,,,1,1,x,,,,,,,45,,,

6,213604,Anh văn 2*,,,3,3,x,,,,,,,45,45,,

7,214231,Cấu trúc máy tính,,,2,2,x,,,,,,,30,30,,

8,214294,Hệ điều hành,,,4,0,x,,,,,,,75,45,30,

9,214331,Lập trình nâng cao,,,4,4,x,,,,,,,75,45,30,

Học kỳ 1 - Năm học 2026 - 2027,,,,,23,22,,,,,,,,,,,

1,200103,Chủ nghĩa xã hội khoa học,,,2,2,x,,,,,,,30,30,,

2,202121,Xác suất thống kê,,,3,3,x,,,,,,,45,45,,

3,202504,Giáo dục thể chất 3*,,,1,0,x,,,,,,,45,,,

4,202620,Kỹ năng giao tiếp,,,2,2,,,101,,2,4,,30,30,,

5,202622,Pháp luật đại cương,,,2,2,x,,,,,,,30,30,,

6,208453,Marketing căn bản,,,2,2,,,101,,2,4,,30,30,,

7,214362,Giao tiếp người-máy,,,4,4,x,,,,,,,75,45,30,

8,214389,Toán rời rạc,,,3,3,x,,,,,,,45,45,,

9,214441,Cấu trúc dữ liệu,,,4,4,x,,,,,,,75,45,30,

Học kỳ 2 - Năm học 2026 - 2027,,,,,18,16,,,,,,,,,,,

1,200107,Tư tưởng Hồ Chí Minh,,,2,2,x,,,,,,,30,30,,

2,214241,Mạng máy tính cơ bản,,,3,3,x,,,,,,,45,45,,

3,214352,Thiết kế hướng đối tượng,,,4,4,x,,,,,,,75,45,30,

4,214354,Lý thuyết đồ thị,,,3,3,x,,,,,,,60,30,30,

5,214442,Nhập môn cơ sở dữ liệu,,,4,4,x,,,,,,,75,45,30,

6,214990,Phương pháp nghiên cứu khoa học,,,2,0,x,,,,,,,30,30,,

Học kỳ 1 - Năm học 2027 - 2028,,,,,30,26,,,,,,,,,,,

1,200105,Lịch sử Đảng Cộng sản Việt Nam,,,2,2,x,,,,,,,30,30,,

2,214252,Lập trình mạng,,,4,4,x,,,,,,,75,45,30,

3,214282,Mạng máy tính nâng cao,,,4,4,,,301,,4,12,,75,45,30,

4,214372,Lập trình .NET,,,4,4,,,301,,4,12,,75,45,30,

5,214386,Lập trình PHP,,,4,4,,,301,,4,12,,75,45,30,

6,214390,Lập trình Python,,,4,0,x,,,,,,,75,45,30,

7,214462,Lập trình Web,,,4,4,x,,,,,,,75,45,30,

8,214463,Nhập môn trí tuệ nhân tạo,,,4,4,x,,,,,,,75,45,30,

Học kỳ 2 - Năm học 2027 - 2028,,,,,33,33,,,,,,,,,,,

1,214271,Quản trị mạng,,,3,3,,,302,,6,18,,60,30,30,

2,214274,Lập trình trên thiết bị di động,,,3,3,x,,,,,,,60,30,30,

3,214353,Đồ họa máy tính,,,3,3,,,302,,6,18,,60,30,30,

4,214370,Nhập môn công nghệ phần mềm,,,4,4,x,,,,,,,75,45,30,

5,214451,Hệ quản trị cơ sở dữ liệu,,,3,3,,,302,,6,18,,60,30,30,

6,214461,Phân tích và thiết kế hệ thống thông tin,,,4,4,x,,,,,,,75,45,30,

7,214464,An toàn và bảo mật hệ thống thông tin,,,3,3,,,302,,6,18,,60,30,30,

8,214465,Hệ thống thông tin địa lý ứng dụng,,,3,3,,,302,,6,18,,60,30,30,

9,214492,Máy học,,,4,4,x,,,,,,,75,45,30,

10,214493,Thực tập lập trình Web,,,3,3,,,302,,6,18,,60,30,30,

Học kỳ 1 - Năm học 2028 - 2029,,,,,45,45,,,,,,,,,,,

1,214273,Lập trình mạng nâng cao,,,4,4,,,303,,8,24,,75,45,30,

2,214290,IoT,,,3,3,,,304,,9,21,,60,30,30,

3,214291,Xử lý ảnh và thị giác máy tính,,,4,4,,,303,,8,24,,75,45,30,

4,214292,An ninh mạng,,,3,3,,,304,,9,21,,60,30,30,

5,214293,Thực tập lập trình trên thiết bị di động,,,3,3,,,304,,9,21,,60,30,30,

6,214379,Đảm bảo chất lượng và kiểm thử phần mềm,,,4,4,,,303,,8,24,,75,45,30,

7,214383,Quản lý dự án phần mềm,,,3,3,,,304,,9,21,,60,30,30,

8,214388,Lập trình Front End,,,4,4,,,303,,8,24,,75,45,30,

9,214471,Hệ thống thông tin quản lý,,,3,3,,,304,,9,21,,60,30,30,

10,214483,Thương mại điện tử,,,3,3,,,304,,9,21,,60,30,30,

11,214485,Data Mining,,,4,4,,,303,,8,24,,75,45,30,

12,214490,Phân tích dữ liệu lớn,,,4,4,,,303,,8,24,,75,45,30,

13,214491,Data Warehouse,,,3,3,,,304,,9,21,,60,30,30,

Học kỳ 2 - Năm học 2028 - 2029,,,,,32,28,,,,,,,,,,,

1,214286,Chuyên đề Java,,,4,4,,,305,,12,32,,75,45,30,

2,214374,Chuyên đề WEB,,,4,4,,,305,,12,32,,75,45,30,

3,214984,Đồ án chuyên ngành,,,2,2,,,305,,12,32,,60,,,

4,214987,Khóa luận tốt nghiệp,,,12,12,,,305,,12,32,,180,,,

5,214988,Tiểu luận tốt nghiệp,,,6,6,,,305,,12,32,,90,,,

6,214989,Khởi nghiệp,,,2,0,,,305,,12,32,,30,30,,

7,214991,Thực tập doanh nghiệp,,,2,0,,,305,,12,32,,120,0,60,`;

interface ParsedCourse {
  stt: number | null;
  ma_mh: string;
  ten_mon_hoc: string;
  chuyen_nganh: string | null;
  mon_cot_loi: string | null;
  so_tin_chi: number | null;
  so_tin_chi_hoc_phi: number | null;
  mon_bat_buoc: boolean;
  da_hoc: boolean;
  nhom: string | null;
  nhanh: string | null;
  so_tin_chi_toi_thieu: number | null;
  so_tin_chi_toi_da: number | null;
  mon_hoc_da_hoc_va_dat: string | null;
  tong_tiet: number | null;
  ly_thuyet: number | null;
  thuc_hanh: number | null;
  tiet_thanh_phan: string | null;
  hoc_ky: string | null;
  nam_hoc: string | null;
}

function parseCSV(csvText: string): ParsedCourse[] {
  const lines = csvText.trim().split("\n");
  const courses: ParsedCourse[] = [];
  let currentSemester = "";
  let currentYear = "";

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.includes("Học kỳ")) {
      const match = trimmed.match(/Học kỳ (\d+) - Năm học (\d{4}) - (\d{4})/);
      if (match) {
        currentSemester = match[1];
        currentYear = `${match[2]}-${match[3]}`;
      }
      continue;
    }

    const parts = line.split(",").map((p) => p.trim());
    if (parts.length < 3 || parts[0] === "STT") continue;

    const parseNumber = (val: string): number | null => {
      if (!val || val === "") return null;
      const num = parseInt(val);
      return isNaN(num) ? null : num;
    };

    const parseBoolean = (val: string): boolean => {
      return val.toLowerCase() === "x";
    };

    courses.push({
      stt: parseNumber(parts[0]),
      ma_mh: parts[1] || "",
      ten_mon_hoc: parts[2] || "",
      chuyen_nganh: parts[3] || null,
      mon_cot_loi: parts[4] || null,
      so_tin_chi: parseNumber(parts[5]),
      so_tin_chi_hoc_phi: parseNumber(parts[6]),
      mon_bat_buoc: parseBoolean(parts[7]),
      da_hoc: parseBoolean(parts[8]),
      nhom: parts[9] || null,
      nhanh: parts[10] || null,
      so_tin_chi_toi_thieu: parseNumber(parts[11]),
      so_tin_chi_toi_da: parseNumber(parts[12]),
      mon_hoc_da_hoc_va_dat: parts[13] || null,
      tong_tiet: parseNumber(parts[14]),
      ly_thuyet: parseNumber(parts[15]),
      thuc_hanh: parseNumber(parts[16]),
      tiet_thanh_phan: parts[17] || null,
      hoc_ky: currentSemester || null,
      nam_hoc: currentYear || null,
    });
  }

  return courses;
}

const courses = parseCSV(csvData);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Make sure .env.local contains NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createTable() {
  console.log('📋 Tạo bảng courses...');
  
  const sql = `
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

    CREATE INDEX IF NOT EXISTS idx_courses_ma_mh ON courses(ma_mh);
    CREATE INDEX IF NOT EXISTS idx_courses_hoc_ky ON courses(hoc_ky);
    CREATE INDEX IF NOT EXISTS idx_courses_nam_hoc ON courses(nam_hoc);
  `;

  // Note: Supabase JS client không hỗ trợ chạy SQL trực tiếp từ client
  // Bạn cần chạy SQL này trong SQL Editor của Supabase Dashboard
  console.log('⚠️  Vui lòng chạy SQL sau trong Supabase SQL Editor:');
  console.log('=====================================');
  console.log(sql);
  console.log('=====================================');
}

async function importCourses() {
  console.log('\n🚀 Bắt đầu import dữ liệu...');
  console.log(`Tổng số môn học: ${courses.length}`);

  try {
    // Xóa dữ liệu cũ nếu có
    console.log('🗑️  Xóa dữ liệu cũ...');
    const { error: deleteError } = await supabase
      .from('courses')
      .delete()
      .neq('id', 0); // Xóa tất cả

    if (deleteError) {
      if (deleteError.code === 'PGRST116') {
        console.log('⚠️  Bảng chưa tồn tại, vui lòng tạo bảng trước');
        await createTable();
        return;
      }
      console.log('Lưu ý:', deleteError.message);
    } else {
      console.log('✅ Đã xóa dữ liệu cũ');
    }

    // Chia nhỏ để insert (Supabase có giới hạn)
    const batchSize = 50;
    let imported = 0;

    for (let i = 0; i < courses.length; i += batchSize) {
      const batch = courses.slice(i, i + batchSize);
      console.log(`📤 Đang import batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(courses.length / batchSize)}...`);
      
      const { data, error } = await supabase
        .from('courses')
        .insert(batch)
        .select();

      if (error) {
        console.error(`❌ Lỗi khi import batch ${Math.floor(i / batchSize) + 1}:`, error);
        throw error;
      }

      imported += data?.length || 0;
    }

    console.log(`✅ Import thành công ${imported} môn học!`);
  } catch (err: any) {
    console.error('❌ Lỗi:', err.message);
    if (err.code === 'PGRST116') {
      console.log('\n⚠️  Bảng courses chưa tồn tại!');
      console.log('Vui lòng:');
      console.log('1. Vào Supabase Dashboard -> SQL Editor');
      console.log('2. Chạy file scripts/create-table.sql');
      console.log('3. Sau đó chạy lại script này');
    }
    process.exit(1);
  }
}

// Chạy import
importCourses();

