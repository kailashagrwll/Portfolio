export const portfolioData = {
  personal: {
    name: "Kailash Agarwal",
    title: "Software Engineer & Full-Stack Developer | Data & ML Enthusiast",
    tagline: "Building scalable full-stack applications, intelligent machine learning models, and insightful data analytics.",
    location: "Phagwara, Punjab / Digboi, Assam",
    status: "Available for Software Engineering & Full-Stack Roles",
    bio: "Computer Science & Engineering student at Lovely Professional University (CGPA 8.37) with a proven track record in Data Structures & Algorithms, full-stack web engineering, and data analytics. Solved 200+ DSA problems across LeetCode (Rating 1557), HackerRank, and Codeforces. Experienced in C++, Python, SQL, React, Node.js, and Power BI.",
    stats: [
      { label: "DSA Problems Solved", value: "200+" },
      { label: "LeetCode Rating", value: "1557" },
      { label: "B.Tech CGPA", value: "8.37" },
      { label: "HackerRank Ratings", value: "4★ SQL / C++" }
    ],
    socials: {
      github: "https://github.com/kailashagrwl",
      linkedin: "https://www.linkedin.com/in/kailash-agarwal47/",
      twitter: "https://github.com/kailashagrwl",
      email: "kailashagarwal957@gmail.com",
      phone: "+91-9707026697",
      website: "https://github.com/kailashagrwl"
    },
    resumeUrl: "#resume-download"
  },

  zones: [
    {
      id: "spawn",
      title: "Spawn Plaza",
      subtitle: "Arrival Beacon",
      position: [0, 0, 0],
      color: "#00f0ff",
      icon: "Compass",
      description: "Welcome to Kailash Agarwal's interactive 3D universe! Use WASD to explore, Shift to sprint, and press E near stations."
    },
    {
      id: "about",
      title: "About Pavilion",
      subtitle: "Education & Profile",
      position: [0, 0, -18],
      color: "#a855f7",
      icon: "User",
      description: "Explore my academic background at LPU, school credentials, coding milestones, and technical mindset."
    },
    {
      id: "projects",
      title: "Projects Lab",
      subtitle: "Featured Engineering Creations",
      position: [-18, 0, -6],
      color: "#10b981",
      icon: "Terminal",
      description: "Discover my full-stack email scheduling platform, healthcare analytics dashboard, and e-commerce ML model."
    },
    {
      id: "skills",
      title: "Skills Arena",
      subtitle: "Technical Arsenal",
      position: [18, 0, -6],
      color: "#ff007f",
      icon: "Zap",
      description: "Inspect my proficiency in C++, Python, SQL, React, Big Data (Hadoop/Hive), Databases, and Power BI."
    },
    {
      id: "experience",
      title: "Training & Achievements",
      subtitle: "Certifications & Milestones",
      position: [-16, 0, 16],
      color: "#f59e0b",
      icon: "Briefcase",
      description: "View my DSA summer training, HackerRank star ratings, LeetCode rating, and NPTEL certifications."
    },
    {
      id: "contact",
      title: "Contact Relay",
      subtitle: "Direct Communications Hub",
      position: [16, 0, 16],
      color: "#00d2ff",
      icon: "Send",
      description: "Connect directly via Email (kailashagarwal957@gmail.com), Phone (+91-9707026697), LinkedIn, or GitHub."
    },
    {
      id: "resume",
      title: "Resume Terminal",
      subtitle: "Verified CV & Credentials",
      position: [0, 0, 14],
      color: "#e2e8f0",
      icon: "FileText",
      description: "Review my complete resume summary or download a print-ready formatted CV."
    }
  ],

  projects: [
    {
      id: "3d-interactive-portfolio",
      title: "3D Interactive Game Portfolio",
      tag: "Three.js & WebGL",
      category: "Full-Stack",
      period: "Feb' 26 — Present",
      featured: true,
      description: "An explorable 3D low-poly futuristic island portfolio game with real-time character physics, Web Audio synthesizer, and instant 2D recruiter toggle.",
      highlights: [
        "Built custom third-person procedural character controller with jump, sprint, and smooth camera rig.",
        "Engineered 7 interactive island campus stations (Spawn, About, Projects, Skills, Training, Contact, and Resume).",
        "Developed custom Web Audio API synthesizer for spatial ambient music and procedural sound effects without external audio assets.",
        "Included high-contrast dual mode: gamified 3D exploration and a recruiter-friendly 2D portfolio."
      ],
      tech: ["React", "Three.js", "React Three Fiber", "@react-three/drei", "Vite", "Web Audio API", "Vanilla CSS"],
      github: "https://github.com/kailashagrwll/Portfolio",
      demo: "https://github.com/kailashagrwll/Portfolio",
      gradient: "linear-gradient(135deg, #0284c7 0%, #00f0ff 50%, #a855f7 100%)"
    },
    {
      id: "email-scheduling-platform",
      title: "Email Scheduling & Delivery Platform",
      tag: "Full-Stack System",
      category: "Full-Stack",
      period: "Sep' 26 – Sep' 26",
      featured: true,
      description: "A full-stack email scheduling platform with JWT authentication, email composition, background queue processing, and dashboard-based status tracking.",
      highlights: [
        "Developed an automated email scheduling workflow with background job processing for reliable and scalable delivery.",
        "Built a dedicated email worker with configurable concurrency and rate limiting for controlled email dispatch.",
        "Integrated Ethereal SMTP for testing email delivery with Scheduled, Processing, Sent, and Failed status tracking.",
        "Designed persistent email storage with SQLite and Prisma, ensuring scheduled jobs and records survive backend restarts."
      ],
      tech: ["React", "TypeScript", "Node.js", "Express", "SQLite", "Redis", "Nodemailer", "Prisma"],
      github: "https://github.com/kailashagrwl",
      demo: "https://github.com/kailashagrwl",
      gradient: "linear-gradient(135deg, #0284c7 0%, #00f0ff 100%)"
    },
    {
      id: "healthcare-analytics-dashboard",
      title: "Healthcare Analytics Dashboard",
      tag: "Data Analytics & BI",
      category: "Data Analytics",
      period: "Nov' 25 – Dec' 25",
      featured: true,
      description: "An interactive healthcare analytics dashboard to analyze patient demographics, hospital admissions, billing trends, and diagnostic outcomes for data-driven decisions.",
      highlights: [
        "Applied star schema data modeling and data warehousing concepts for hospital operations analysis.",
        "Performed ETL data pipeline transformations using Power Query to clean and prepare clinical data.",
        "Created sophisticated DAX measures to calculate metrics including total patients, hospital revenue, and average length of stay.",
        "Engineered interactive dashboards enabling healthcare stakeholders to perform trend analysis and visualization."
      ],
      tech: ["Power BI", "DAX", "Power Query", "Data Warehousing", "Star Schema"],
      github: "https://github.com/kailashagrwl",
      demo: "https://github.com/kailashagrwl",
      gradient: "linear-gradient(135deg, #059669 0%, #10b981 100%)"
    },
    {
      id: "ecommerce-sales-prediction",
      title: "E-Commerce Sales Prediction",
      tag: "Machine Learning & Python",
      category: "Machine Learning",
      period: "Jan' 25 – Mar' 25",
      featured: true,
      description: "A machine learning predictive model to forecast e-commerce sales using historical retail sales data for accurate demand forecasting and inventory planning.",
      highlights: [
        "Conducted end-to-end data preprocessing, feature engineering, exploratory data analysis (EDA), and data transformation.",
        "Handled missing values, encoded categorical variables, and eliminated statistical outliers to elevate data quality.",
        "Trained regression algorithms using Scikit-Learn and evaluated performance metrics (RMSE, R² score).",
        "Generated granular sales forecasts to empower smart inventory planning and executive business decision-making."
      ],
      tech: ["Python", "NumPy", "Pandas", "Scikit-Learn", "Matplotlib", "Seaborn"],
      github: "https://github.com/kailashagrwl",
      demo: "https://github.com/kailashagrwl",
      gradient: "linear-gradient(135deg, #a855f7 0%, #ff007f 100%)"
    }
  ],

  skills: [
    {
      category: "Programming Languages",
      color: "#00f0ff",
      items: [
        { name: "C++", level: 92, exp: "4★ HackerRank" },
        { name: "Python", level: 90, exp: "2★ HackerRank / ML" },
        { name: "C", level: 85, exp: "Core Systems" },
        { name: "SQL", level: 94, exp: "4★ HackerRank / Certified" }
      ]
    },
    {
      category: "Data Science & Libraries",
      color: "#10b981",
      items: [
        { name: "NumPy & Pandas", level: 90, exp: "ETL & Data Manipulation" },
        { name: "Matplotlib & Seaborn", level: 88, exp: "Data Visualization" },
        { name: "Scikit-Learn", level: 86, exp: "Machine Learning Models" },
        { name: "Power Query & DAX", level: 88, exp: "Business Intelligence" }
      ]
    },
    {
      category: "Databases & Big Data",
      color: "#ff007f",
      items: [
        { name: "MySQL", level: 92, exp: "Relational Modeling" },
        { name: "Apache Cassandra", level: 84, exp: "NoSQL Distributed DB" },
        { name: "SQLite & Redis", level: 88, exp: "Embedded & In-Memory Cache" },
        { name: "Apache Hadoop & Hive", level: 82, exp: "Big Data Processing" }
      ]
    },
    {
      category: "Full-Stack & Analytics Tools",
      color: "#f59e0b",
      items: [
        { name: "React & TypeScript", level: 88, exp: "Frontend Engineering" },
        { name: "Node.js & Express", level: 86, exp: "Backend Services" },
        { name: "Power BI", level: 90, exp: "Executive Dashboards" },
        { name: "Microsoft Excel", level: 92, exp: "Advanced Analytics" }
      ]
    }
  ],

  experience: [
    {
      role: "Data Structures & Algorithms Training",
      company: "Summer Training Program",
      period: "Jun' 25 — Jul' 25",
      location: "Intensive Program",
      description: "Completed an intensive training program focused on core Data Structures and Algorithms, strengthening problem-solving and foundational computational thinking skills.",
      achievements: [
        "Practiced implementing essential data structures like arrays, stacks, queues, trees, and graphs through structured exercises.",
        "Enhanced ability to write efficient, production-grade code using time–space asymptotic complexity analysis.",
        "Applied algorithmic patterns to solve 200+ problems across LeetCode and HackerRank."
      ]
    }
  ],

  achievements: [
    {
      title: "200+ DSA Problems Solved",
      description: "Solved across LeetCode, HackerRank, and Codeforces with deep problem-solving expertise."
    },
    {
      title: "LeetCode Rating: 1557",
      description: "Consistent competitive programming performer with solid algorithm implementation speed."
    },
    {
      title: "HackerRank Star Badges",
      description: "Earned 4-star in SQL, 4-star in C++, and 2-star in Python."
    }
  ],

  certificates: [
    {
      title: "SQL (Intermediate)",
      issuer: "HackerRank",
      date: "Feb' 26",
      credentialUrl: "https://www.hackerrank.com"
    },
    {
      title: "Privacy and Security in Online Social Media",
      issuer: "NPTEL",
      date: "Apr' 25",
      credentialUrl: "https://nptel.ac.in"
    }
  ],

  education: [
    {
      degree: "Bachelor of Technology - Computer Science and Engineering",
      institution: "Lovely Professional University",
      location: "Phagwara, Punjab",
      period: "Aug' 23 — Present",
      honors: "CGPA: 8.37",
      focus: "Data Structures, Algorithms, Database Management Systems, Big Data Technologies, Machine Learning"
    },
    {
      degree: "Intermediate (Class XII)",
      institution: "Delhi Public School",
      location: "Digboi, Assam",
      period: "Apr' 20 — Mar' 22",
      honors: "Score: 71.4%",
      focus: "Science, Physics, Chemistry, Mathematics"
    },
    {
      degree: "Matriculation (Class X)",
      institution: "Delhi Public School",
      location: "Digboi, Assam",
      period: "Apr' 19 — Mar' 20",
      honors: "Score: 84.0%",
      focus: "Foundational Sciences & Mathematics"
    }
  ],

  resumeSummary: {
    headline: "Kailash Agarwal — Computer Science Engineer & Full-Stack Developer",
    summary: "Dedicated Computer Science & Engineering student at Lovely Professional University (CGPA 8.37) with strong problem-solving skills (200+ DSA problems solved, LeetCode 1557) and expertise spanning C++, Python, SQL, full-stack web engineering, machine learning, and data analytics.",
    coreCompetencies: [
      "Data Structures & Algorithms (200+ Solved, LeetCode 1557)",
      "Programming: C++, C, Python, SQL",
      "Full-Stack Web: React, TypeScript, Node.js, Express, SQLite, Redis",
      "Data Analytics & ML: NumPy, Pandas, Scikit-Learn, Power BI, DAX, Power Query",
      "Databases & Big Data: MySQL, Apache Cassandra, Apache Hadoop, Apache Hive"
    ]
  }
};
