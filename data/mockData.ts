export type CourseSchedule = {
  day: 2 | 3 | 4 | 5 | 6 | 7 | 8;
  startPeriod: number;
  countPeriod: number;
};

export type Course = {
  id: string;
  name: string;
  code: string;
  credits: number;
  lecturer: string;
  room: string;
  schedule: CourseSchedule;
  color: {
    from: string;
    to: string;
  };
  isThucHanh?: boolean; // true nếu là thực hành
};
