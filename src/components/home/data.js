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

export const featuresNotice = [
  {
    dialogueImage: dialogue1, image: notice1,
    title: 'Administration & Management',
    accent: '#0ea5e9',
    list: [
      "Campus Management", "Manage Student & Alumni", "Manage Teacher & Staff Profile",
      "Manage Parents' Profile", "Admissions", "Fee Management", "Announcement & Newsletter",
      "Communication by SMS & Email", "Manage Events & Birthday Updates",
      "Health Record Management System", "Attendance System", "Library Management",
      "Data Import & Export", "Integrated with Google Meet & Drive",
    ],
  },
  {
    dialogueImage: dialogue2, image: notice2,
    title: 'Teachers',
    accent: '#f59e0b',
    list: [
      "Manage Classes & Subjects", "Students' online Attendance", "Homework & Assignments",
      "Class Announcements", "Classes Schedule", "Events & Birthday Updates", "Behavior & Discipline",
      "Examination Management", "Grading & Assignments", "Transcript & Progress Reports",
      "Academic Reports", "Integrated with Google Meet & Drive", "Learning Management System",
    ],
  },
  {
    dialogueImage: dialogue3, image: notice3,
    title: 'Students',
    accent: '#10b981',
    list: [
      "Gradebook", "Interactive Assignments", "Access to Classes Schedule & Subject",
      "Attendance Record", "Announcement & Notifications", "Academic Reports",
      "Progress Report", "Events & Birthday Updates", "Integrated with Google Meet & Drive",
    ],
  },
  {
    dialogueImage: dialogue4, image: notice4,
    title: 'Parents',
    accent: '#8b5cf6',
    list: [
      "Grade Book", "Interactive Assignments", "Access to Classes Schedules & Subject",
      "School Attendance", "Progress Report", "Announcement & Notifications", "Academic Reports",
    ],
  },
]

export const moduleFeatures = [
  { icon: module1, title: "Learning Hub", description: "Dive into a comprehensive platform for managing and delivering educational content. From creating engaging courses to tracking progress and performance, our Learning Hub makes it easy to facilitate effective learning." },
  { icon: module2, title: "Attendance Tracker", description: "Simplify the process of monitoring attendance with our intuitive system. Keep tabs on participation, generate detailed reports, and ensure accurate record-keeping with minimal effort." },
  { icon: module3, title: "Profile Central", description: "Take control of user profiles with a robust management system. Effortlessly update and maintain personal information, preferences, and access settings, all in one central location." },
  { icon: module4, title: "Insightful Reports", description: "Unlock the power of data with our advanced reporting tools. Generate customized reports that provide actionable insights and help you make informed decisions based on comprehensive analytics." },
]
