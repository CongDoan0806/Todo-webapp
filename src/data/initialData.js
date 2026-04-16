export const columns = [
  { id: 'todo', label: 'To Do', color: '#f59e0b', dot: '#f59e0b' },
  { id: 'inprogress', label: 'In Progress', color: '#2563eb', dot: '#2563eb' },
  { id: 'done', label: 'Done', color: '#16a34a', dot: '#16a34a' },
];

export const initialTasks = [
  {
    id: 1,
    title: 'Thiết kế UI cho màn hình Login',
    desc: 'Tạo mockup và prototype cho trang đăng nhập, bao gồm responsive design cho mobile.',
    col: 'todo',
    priority: 'high',
    tag: 'Design',
  },
  {
    id: 2,
    title: 'Cài đặt CI/CD Pipeline',
    desc: 'Cấu hình GitHub Actions để tự động deploy lên staging environment.',
    col: 'todo',
    priority: 'medium',
    tag: 'DevOps',
  },
  {
    id: 3,
    title: 'Viết unit test cho API',
    desc: 'Coverage tối thiểu 80% cho các endpoint quan trọng.',
    col: 'todo',
    priority: 'low',
    tag: 'Backend',
  },
  {
    id: 4,
    title: 'Tích hợp thanh toán Stripe',
    desc: 'Kết nối Stripe API để xử lý thanh toán, bao gồm webhook handling.',
    col: 'inprogress',
    priority: 'high',
    tag: 'Backend',
  },
  {
    id: 5,
    title: 'Tối ưu hiệu suất trang chủ',
    desc: 'Giảm Largest Contentful Paint xuống dưới 2.5s bằng lazy loading và code splitting.',
    col: 'inprogress',
    priority: 'medium',
    tag: 'Frontend',
  },
  {
    id: 6,
    title: 'Thiết lập database schema',
    desc: 'Định nghĩa các bảng và quan hệ trong PostgreSQL theo ERD đã phê duyệt.',
    col: 'done',
    priority: 'high',
    tag: 'Backend',
  },
  {
    id: 7,
    title: 'Research competitor products',
    desc: 'Phân tích 5 sản phẩm cạnh tranh chính, đưa ra báo cáo điểm mạnh/yếu.',
    col: 'done',
    priority: 'low',
    tag: 'Research',
  },
];
