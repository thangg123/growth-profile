export const INITIAL_DATA = {
  lastUpdated: "2026-04-02",
  updateHistory: [
    {
      date: "2026-04-02",
      note: "Đánh giá ban đầu dựa trên lịch sử làm việc với Claude"
    }
  ],
  skills: [
    {
      id: "tech-exec",
      name: "Technical Execution",
      icon: "⚡",
      score: 4,
      maxScore: 5,
      trend: "stable",
      category: "core",
      details: "Node.js, Next.js, PM2, Ubuntu VPS, ufw/iptables, DNS, WordPress",
      evidence: [
        "Quản lý server ARX trên Ubuntu VPS với PM2",
        "Xử lý crash loop arena-web, DNS migration",
        "Cấu hình firewall, WAF evaluation (Bizfly, Cloudflare)",
        "Troubleshoot ESC/POS thermal printer compatibility"
      ],
      nextSteps: [
        "Học thêm containerization (Docker/K8s)",
        "Thực hành CI/CD pipeline tự động",
        "Explore serverless architecture patterns"
      ]
    },
    {
      id: "system-arch",
      name: "System Thinking & Architecture",
      icon: "🧠",
      score: 4,
      maxScore: 5,
      trend: "up",
      category: "core",
      details: "Service decomposition, WebSocket, Load balancing, Impact/Effort scoring",
      evidence: [
        "Thiết kế ARX V.1 architecture với service decomposition",
        "Per-service WebSocket servers planning",
        "Đánh giá Impact/Effort cho từng component",
        "Backup/recovery strategy design"
      ],
      nextSteps: [
        "Học Domain-Driven Design (DDD)",
        "Nghiên cứu event-driven architecture",
        "Practice system design interviews"
      ]
    },
    {
      id: "spec-writing",
      name: "Spec Writing & Requirements",
      icon: "📋",
      score: 4,
      maxScore: 5,
      trend: "up",
      category: "core",
      details: "Feature spec, Epic/Sprint planning, Bug report chi tiết",
      evidence: [
        "Epic AR2-17 Report Module — 9 report types",
        "Timezone handling & data sync spec chi tiết",
        "Sprint T.4 planning có cấu trúc rõ ràng",
        "Testcase generation methodology"
      ],
      nextSteps: [
        "Thêm acceptance criteria dạng Given/When/Then",
        "Viết spec có kèm metrics đo lường thành công",
        "Tập viết RFC/Design Doc chuẩn"
      ]
    },
    {
      id: "tooling",
      name: "Tooling & Automation",
      icon: "🔧",
      score: 5,
      maxScore: 5,
      trend: "up",
      category: "core",
      details: "Custom plugins, MCP servers, CLI tools, Workflow automation",
      evidence: [
        "Testcase plugin: CF Workers → Desktop → Slash command",
        "Multi-Agent MD Generator HTML app",
        "Claude Code CLI configuration & workflows",
        "Git co-authorship automation"
      ],
      nextSteps: [
        "Publish 1 tool lên npm/marketplace",
        "Viết docs/README chuyên nghiệp cho tools",
        "Xây tool có user base ngoài team"
      ]
    },
    {
      id: "product-strategy",
      name: "Product Strategy & Metrics",
      icon: "📊",
      score: 2,
      maxScore: 5,
      trend: "stable",
      category: "growth",
      details: "Cần phát triển: User research, Analytics, A/B testing",
      evidence: [
        "Tập trung execution nhiều hơn strategy",
        "Chưa thấy data-driven decision making rõ ràng",
        "Thiếu competitive analysis có hệ thống"
      ],
      nextSteps: [
        "Setup analytics cho ARX (Mixpanel/Amplitude)",
        "Chạy 1 vòng user interview (5 users)",
        "Định nghĩa North Star Metric cho ARX",
        "Học framework: RICE, ICE scoring"
      ]
    },
    {
      id: "leadership",
      name: "Leadership & Delegation",
      icon: "👥",
      score: 2,
      maxScore: 5,
      trend: "stable",
      category: "growth",
      details: "Cần phát triển: Delegation, Team management, Stakeholder mgmt",
      evidence: [
        "Có xu hướng tự làm hết (PM+Dev+Ops)",
        "Chưa rõ delegation strategy",
        "Reflections về PM role trong AI era là tín hiệu tốt"
      ],
      nextSteps: [
        "Xác định 3 task delegate được ngay tuần này",
        "Practice 1:1 meeting framework",
        "Đọc: The Manager's Path (Camille Fournier)",
        "Thử coaching thay vì làm hộ"
      ]
    },
    {
      id: "visibility",
      name: "Public Visibility & Branding",
      icon: "🌐",
      score: 1,
      maxScore: 5,
      trend: "stable",
      category: "growth",
      details: "Cần xây dựng: Blog, Portfolio, Open-source presence",
      evidence: [
        "GitHub thangg123 chưa có project showcase nổi bật",
        "Chưa có blog/writing public",
        "Chưa có portfolio website"
      ],
      nextSteps: [
        "Viết 1 bài blog/week trên dev.to hoặc Viblo",
        "Tạo portfolio site với case study ARX",
        "Contribute 1 PR cho open-source project",
        "Share learnings trên LinkedIn"
      ]
    },
    {
      id: "ai-workflow",
      name: "AI-Augmented Workflow",
      icon: "🤖",
      score: 4.5,
      maxScore: 5,
      trend: "up",
      category: "emerging",
      details: "Claude Code, MCP ecosystem, AI-assisted development",
      evidence: [
        "Sử dụng Claude Code thành thạo (config, commands)",
        "Build MCP server ecosystem cho testcase",
        "Multi-agent architecture exploration",
        "Tư duy sâu về PM role trong AI era"
      ],
      nextSteps: [
        "Explore AI agents cho QA automation",
        "Thử Cursor/Copilot song song Claude Code",
        "Xây AI workflow template cho team"
      ]
    }
  ],
  careerPaths: [
    {
      id: "pm-lead",
      name: "Senior PM → Head of Product",
      icon: "🎯",
      fit: 60,
      requirements: ["Product strategy", "User research", "Stakeholder management", "Team leadership"],
      gaps: ["Analytics depth", "Delegation", "Cross-functional leadership"]
    },
    {
      id: "tech-lead",
      name: "Technical Lead → CTO",
      icon: "🏗️",
      fit: 75,
      requirements: ["System architecture", "Technical execution", "Code review", "Tech strategy"],
      gaps: ["Team scaling", "Budget management", "Vendor management"]
    },
    {
      id: "indie",
      name: "Indie Developer / Technical Founder",
      icon: "🚀",
      fit: 85,
      requirements: ["Full-stack dev", "Product sense", "Tooling", "Self-driven"],
      gaps: ["Distribution/Marketing", "Revenue model", "Public presence"]
    }
  ],
  weeklyActions: [
    { id: 1, text: "Setup Mixpanel cho ARX App", done: false, priority: "high", skill: "product-strategy" },
    { id: 2, text: "Viết 1 blog post về ARX architecture", done: false, priority: "high", skill: "visibility" },
    { id: 3, text: "Xác định 3 tasks để delegate", done: false, priority: "medium", skill: "leadership" },
    { id: 4, text: "Đọc Chapter 1-3 The Manager's Path", done: false, priority: "medium", skill: "leadership" },
    { id: 5, text: "Define North Star Metric cho ARX", done: false, priority: "high", skill: "product-strategy" },
    { id: 6, text: "Publish testcase plugin lên npm", done: false, priority: "low", skill: "tooling" }
  ]
};
