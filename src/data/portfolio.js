// All the content of the site lives here. Edit this file to change what visitors see.

export const profile = {
  name: "Heng Jing Yu",
  role: "Backend Developer",
  email: "jingyu20958@gmail.com",
  phone: "+6011-5369-1109",
  showPhone: true, // set to false to hide the phone number everywhere
  github: "https://github.com/jingyu09",
  linkedin: "https://www.linkedin.com/in/heng-jing-yu-212015392",
  resume: "/CV_HENG_JING_YU.pdf" // put the PDF in the public/ folder with this exact name
};

// slot = position on the 3x3 workbench (0-8, left to right, top to bottom).
// 1 = top, 3 = left, 4 = centre, 5 = right, 7 = bottom, so the 5 items form a plus shape.
export const sections = [
  {
    id: "overview",
    title: "Overview",
    teaser: "Who I am in one minute.",
    icon: "book",
    slot: 4,
    blocks: [
      {
        type: "text",
        text:
          "Year 2 Computer Science (Information Systems) student at the University of Malaya with a strong foundation in backend development, Java, and database systems. Experienced in building high-concurrency systems and managing project logistics. Quick learner, adaptable, and comfortable working in multilingual environments."
      },
      {
        type: "facts",
        items: [
          { label: "Studying", value: "B.CS (Information System), University of Malaya" },
          { label: "CGPA", value: "3.90 (UM) · 4.00 (Matriculation)" },
          { label: "Focus", value: "Backend, Java, databases, high-concurrency" },
          { label: "Languages", value: "English, Chinese, Malay (fluent) · French (conversational)" }
        ]
      }
    ]
  },
  {
    id: "what-i-do",
    title: "What I do",
    teaser: "Backend systems that hold up under load.",
    icon: "compass",
    slot: 1,
    blocks: [
      {
        type: "list",
        items: [
          "Built the backend of a high-concurrency flash-sale system (Blueprint Seckill) with Java and Spring Boot.",
          "Prevented overselling under concurrent requests using Redis + Lua scripting for atomic inventory deduction.",
          "Decoupled database writes with RabbitMQ and kept data consistent using Snowflake IDs and MySQL unique indexes.",
          "Validated the system with Apache JMeter load testing: 0% error rate and zero oversold items.",
          "Built a Vanilla JS frontend console for real-time order polling."
        ]
      },
      {
        type: "links",
        items: [
          {
            label: "Blueprint Seckill",
            url: "https://github.com/jingyu09/blueprint-seckill",
            desc: "4-layer flash-sale architecture: rate limiting, Redis, message queue, MySQL"
          },
          {
            label: "Dating-App---Random-Forest",
            url: "https://github.com/jingyu09/Dating-App---Random-Forest",
            desc: "my part of a group project: Random Forest on PCA data, tuning and FLAML benchmarking"
          }
        ]
      }
    ]
  },
  {
    id: "skills",
    title: "Skills",
    teaser: "Tools I reach for.",
    icon: "gear",
    slot: 3,
    blocks: [
      {
        type: "tags",
        groups: [
          { title: "Languages", items: ["Java", "SQL", "JavaScript"] },
          {
            title: "Frameworks & tools",
            items: ["Spring Boot", "MyBatis", "RESTful APIs", "Git / GitHub", "Docker", "Apache JMeter"]
          },
          { title: "Databases & middleware", items: ["MySQL", "Redis", "RabbitMQ"] },
          {
            title: "Core concepts",
            items: [
              "High-concurrency architecture",
              "OOP",
              "Distributed systems",
              "Data structures",
              "API integration",
              "Database optimization"
            ]
          },
          { title: "Also used", items: ["Python (scikit-learn)", "FLAML"] }
        ]
      }
    ]
  },
  {
    id: "education",
    title: "Education",
    teaser: "Where I learn.",
    icon: "cap",
    slot: 5,
    blocks: [
      {
        type: "timeline",
        items: [
          {
            title: "Bachelor of Computer Science (Information System)",
            org: "University of Malaya",
            period: "Oct 2025 – Mar 2029",
            bullets: [
              "CGPA: 3.90",
              "Core courses: OOP, Data Structures, Distributed Systems",
              "Specializing in high-concurrency architecture and backend development"
            ]
          },
          {
            title: "Computer Science Program",
            org: "Johor Matriculation College",
            period: "2024 – 2025",
            bullets: ["CGPA: 4.00"]
          },
          {
            title: "SPM (Sijil Pelajaran Malaysia)",
            org: "SMK Sri Perhentian",
            period: "2019 – 2023",
            bullets: ["Result: 9As (3A+, 6A, 1B+)"]
          }
        ]
      }
    ]
  },
  {
    id: "experience",
    title: "Experience",
    teaser: "Leading, organising, helping.",
    icon: "briefcase",
    slot: 7,
    blocks: [
      {
        type: "timeline",
        items: [
          {
            title: "HOD of Logistics",
            org: "Mental Health Week 2025",
            period: "Oct 2025 – Dec 2025",
            bullets: [
              "Directed a logistics committee to execute end-to-end campus event operations, ensuring seamless execution for 178 attendees.",
              "Managed a strict RM3,000 budget by strategically procuring 85 essential items, negotiating vendor quotes for custom apparel, and sourcing bulk supplies.",
              "Developed a comprehensive inventory tracking and financial budgeting system using Google Workspace (Google Sheets) to monitor real-time expenses.",
              "Streamlined material distribution and event transport by coordinating on-demand courier schedules, achieving zero delivery delays."
            ]
          },
          {
            title: "7S Exco Kerohanian",
            org: "Kolej Matrikulasi Johor",
            period: "Jul 2024 – May 2025",
            bullets: [
              "Member of the 7S Exco under the Student Representative Council (Jawatankuasa Perwakilan Pelajar), 2024/2025 session.",
              "Acted as a bridge between students and the Exco Kerohanian unit, coordinating meaningful and value-driven activities."
            ]
          },
          {
            title: "PAL Leader",
            org: "Kolej Matrikulasi Johor",
            period: "Jul 2024 – May 2025",
            bullets: ["Facilitated peer learning sessions to help students strengthen their understanding of core subjects."]
          }
        ]
      }
    ]
  }
];
