import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Định nghĩa dữ liệu học phần từ hình ảnh
const coursesToAdd = [
  // Thứ 2
  {
    ten_mon_hoc: 'Kinh tế chính trị Mác Lênin',
    ten_giao_vien: 'Khoa Huy',
    thu: 2, // Thứ 2
    ca_hoc: 1, // Ca 1
    so_phong: '', // Chưa có thông tin
  },
  {
    ten_mon_hoc: 'Cấu trúc máy tính',
    ten_giao_vien: 'Võ Tấn Linh',
    thu: 2, // Thứ 2
    ca_hoc: 2, // Ca 2
    so_phong: '', // Chưa có thông tin
  },
  {
    ten_mon_hoc: 'Thể dục 2',
    ten_giao_vien: 'Lương Phương Bình',
    thu: 2, // Thứ 2
    ca_hoc: 3, // Ca 3
    so_phong: '', // Chưa có thông tin
  },
  // Thứ 5
  {
    ten_mon_hoc: 'Hệ điều hành',
    ten_giao_vien: 'Phan Vĩnh Thuần',
    thu: 5, // Thứ 5
    ca_hoc: 2, // Ca 2
    so_phong: '', // Chưa có thông tin
  },
  {
    ten_mon_hoc: 'Toán cao cấp A3',
    ten_giao_vien: '', // Không có giảng viên
    thu: 5, // Thứ 5
    ca_hoc: 4, // Ca 4
    so_phong: '', // Chưa có thông tin
  },
  // Thứ 6
  {
    ten_mon_hoc: 'Lý thuyết Lập trình nâng cao',
    ten_giao_vien: 'Phạm Văn Tính',
    thu: 6, // Thứ 6
    ca_hoc: 1, // Ca 1
    so_phong: '', // Chưa có thông tin
  },
];

async function addCourses() {
  console.log('📚 Bắt đầu thêm các học phần từ hình ảnh...\n');

  for (const courseInfo of coursesToAdd) {
    try {
      // Tính toán startPeriod và countPeriod từ ca_hoc (1 ca = 3 tiết)
      const startPeriod = (courseInfo.ca_hoc - 1) * 3 + 1;
      const countPeriod = 3;
      
      // Tạo mã môn học tự động
      const ma_mh = `MH${Date.now()}${Math.random().toString(36).substr(2, 5)}`;
      
      // Map sang format DatabaseCourse
      const courseData = {
        ma_mh: ma_mh,
        ten_mon_hoc: courseInfo.ten_mon_hoc,
        so_tin_chi: 3, // Mặc định 3 tín chỉ cho 1 ca
        so_tin_chi_hoc_phi: 3,
        tong_tiet: 45,
        ly_thuyet: 30,
        thuc_hanh: 15,
        mon_bat_buoc: false,
        da_hoc: false,
        hoc_ky: null,
        nam_hoc: null,
        chuyen_nganh: courseInfo.ten_giao_vien || null,
        mon_hoc_da_hoc_va_dat: JSON.stringify({
          thu: courseInfo.thu,
          startPeriod: startPeriod,
          countPeriod: countPeriod,
          so_phong: courseInfo.so_phong || "Chưa xác định",
        }),
      };
      
      // Kiểm tra xem học phần đã tồn tại chưa (dựa vào tên và thứ/ca)
      const { data: existingCourses } = await supabase
        .from('courses')
        .select('*')
        .eq('ten_mon_hoc', courseInfo.ten_mon_hoc);
      
      const isDuplicate = existingCourses?.some((course: any) => {
        try {
          const schedule = JSON.parse(course.mon_hoc_da_hoc_va_dat || '{}');
          return schedule.thu === courseInfo.thu && 
                 schedule.startPeriod === startPeriod;
        } catch {
          return false;
        }
      });
      
      if (isDuplicate) {
        console.log(`⏭️  Đã tồn tại: ${courseInfo.ten_mon_hoc} (Thứ ${courseInfo.thu}, Ca ${courseInfo.ca_hoc})`);
        continue;
      }
      
      const { data, error } = await supabase
        .from('courses')
        .insert([courseData])
        .select()
        .single();
      
      if (error) {
        console.error(`❌ Lỗi khi thêm "${courseInfo.ten_mon_hoc}":`, error.message);
        continue;
      }
      
      console.log(`✅ Đã thêm: ${courseInfo.ten_mon_hoc} (Thứ ${courseInfo.thu}, Ca ${courseInfo.ca_hoc})${courseInfo.ten_giao_vien ? ` - GV: ${courseInfo.ten_giao_vien}` : ''}`);
    } catch (err: any) {
      console.error(`❌ Lỗi khi thêm "${courseInfo.ten_mon_hoc}":`, err.message);
    }
  }
  
  console.log('\n✨ Hoàn tất thêm học phần!');
}

addCourses().catch(console.error);

