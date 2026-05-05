import feature1 from '../../assets/feature-1.png'
import feature2 from '../../assets/feature-2.png'
import feature3 from '../../assets/feature-3.png'
import feature4 from '../../assets/feature-4.png'
import list1 from '../../assets/01.svg'
import list2 from '../../assets/02.svg'
import list3 from '../../assets/03.svg'
import list4 from '../../assets/04.svg'
import list5 from '../../assets/05.svg'
import list6 from '../../assets/06.svg'
import notice1 from '../../assets/notice-icon-1.png'
import notice2 from '../../assets/notice-icon-2.png'
import notice3 from '../../assets/notice-icon-3.png'
import notice4 from '../../assets/notice-icon-4.png'
import dialogue1 from '../../assets/iSchool_files/admin.jpg'
import dialogue2 from '../../assets/iSchool_files/Teachers.jpg'
import dialogue3 from '../../assets/iSchool_files/Students.jpg'
import dialogue4 from '../../assets/iSchool_files/Parents.jpg'
import module1 from '../../assets/iSchool_files/LMS.svg'
import module2 from '../../assets/iSchool_files/AMS.svg'
import module3 from '../../assets/iSchool_files/PMS.svg'
import module4 from '../../assets/iSchool_files/GR.svg'

export const features = [
  { img: feature1, title: 'Academics & Learning', subTitle: 'Learning Management System' },
  { img: feature2, title: 'Communication', subTitle: 'Attendance Management System' },
  { img: feature3, title: 'Administration', subTitle: 'Profile Management System' },
  { img: feature4, title: 'Fee Management', subTitle: 'General Report' },
]

export const lists = [
  { img: list1, title: 'Simplicity', desc: "iSchool's intuitive interface ensures easy navigation for all users, regardless of technical expertise." },
  { img: list2, title: 'Reliability', desc: "iSchool's cutting-edge technology ensures seamless performance, data security, and regular updates." },
  { img: list3, title: 'Scalability', desc: "iSchool's scalable cloud model efficiently manages data growth, ensuring seamless performance and adaptability." },
  { img: list4, title: 'Affordability', desc: "iSchool's modular design offers cost-effective solutions, allowing schools to choose needed features." },
  { img: list5, title: 'Go Green with Paperless Environment', desc: 'iSchool leads with full automation, enabling paperless school administration for efficiency.' },
  { img: list6, title: "Reduces Teacher's Workload", desc: "iSchool enhances efficiency, allowing teachers to complete complex tasks with simple clicks." },
]

import { 
  Building2, Users, UserCheck, UsersRound, GraduationCap, CreditCard, Bell, 
  Mail, CalendarDays, HeartPulse, ClipboardCheck, Library, ArrowLeftRight, Video,
  BookOpen, FileText, Megaphone, Clock, Calendar, ShieldAlert, FileSpreadsheet, 
  PenTool, FileBarChart, PieChart, Globe, Laptop, Book, Pen, ClipboardList, 
  BellRing, FileBadge, LineChart, Gift, BarChart
} from 'lucide-react'

export const featuresNotice = [
  {
    dialogueImage: dialogue1, image: notice1,
    title: 'Administration & Management',
    accent: '#0ea5e9',
    list: [
      { text: "Campus Management", icon: Building2 },
      { text: "Manage Student & Alumni", icon: Users },
      { text: "Manage Teacher & Staff Profile", icon: UserCheck },
      { text: "Manage Parents' Profile", icon: UsersRound },
      { text: "Admissions", icon: GraduationCap },
      { text: "Fee Management", icon: CreditCard },
      { text: "Announcement & Newsletter", icon: Bell },
      { text: "Communication by SMS & Email", icon: Mail },
      { text: "Manage Events & Birthday Updates", icon: CalendarDays },
      { text: "Health Record Management System", icon: HeartPulse },
      { text: "Attendance System", icon: ClipboardCheck },
      { text: "Library Management", icon: Library },
      { text: "Data Import & Export", icon: ArrowLeftRight },
      { text: "Integrated with Google Meet & Drive", icon: Video },
    ],
  },
  {
    dialogueImage: dialogue2, image: notice2,
    title: 'Teachers',
    accent: '#f59e0b',
    list: [
      { text: "Manage Classes & Subjects", icon: BookOpen },
      { text: "Students' online Attendance", icon: UserCheck },
      { text: "Homework & Assignments", icon: FileText },
      { text: "Class Announcements", icon: Megaphone },
      { text: "Classes Schedule", icon: Clock },
      { text: "Events & Birthday Updates", icon: Calendar },
      { text: "Behavior & Discipline", icon: ShieldAlert },
      { text: "Examination Management", icon: FileSpreadsheet },
      { text: "Grading & Assignments", icon: PenTool },
      { text: "Transcript & Progress Reports", icon: FileBarChart },
      { text: "Academic Reports", icon: PieChart },
      { text: "Integrated with Google Meet & Drive", icon: Globe },
      { text: "Learning Management System", icon: Laptop },
    ],
  },
  {
    dialogueImage: dialogue3, image: notice3,
    title: 'Students',
    accent: '#10b981',
    list: [
      { text: "Gradebook", icon: Book },
      { text: "Interactive Assignments", icon: Pen },
      { text: "Access to Classes Schedule & Subject", icon: Calendar },
      { text: "Attendance Record", icon: ClipboardList },
      { text: "Announcement & Notifications", icon: BellRing },
      { text: "Academic Reports", icon: FileBadge },
      { text: "Progress Report", icon: LineChart },
      { text: "Events & Birthday Updates", icon: Gift },
      { text: "Integrated with Google Meet & Drive", icon: Video },
    ],
  },
  {
    dialogueImage: dialogue4, image: notice4,
    title: 'Parents',
    accent: '#8b5cf6',
    list: [
      { text: "Grade Book", icon: Book },
      { text: "Interactive Assignments", icon: Pen },
      { text: "Access to Classes Schedules & Subject", icon: Calendar },
      { text: "School Attendance", icon: UserCheck },
      { text: "Progress Report", icon: BarChart },
      { text: "Announcement & Notifications", icon: BellRing },
      { text: "Academic Reports", icon: FileText },
    ],
  },
]

export const moduleFeatures = [
  { icon: module1, title: "Learning Hub", description: "Dive into a comprehensive platform for managing and delivering educational content. From creating engaging courses to tracking progress and performance, our Learning Hub makes it easy to facilitate effective learning." },
  { icon: module2, title: "Attendance Tracker", description: "Simplify the process of monitoring attendance with our intuitive system. Keep tabs on participation, generate detailed reports, and ensure accurate record-keeping with minimal effort." },
  { icon: module3, title: "Profile Central", description: "Take control of user profiles with a robust management system. Effortlessly update and maintain personal information, preferences, and access settings, all in one central location." },
  { icon: module4, title: "Insightful Reports", description: "Unlock the power of data with our advanced reporting tools. Generate customized reports that provide actionable insights and help you make informed decisions based on comprehensive analytics." },
]
