// ─── Texawave Services Data v2 ───────────────────────────────────────────────
// Single source of truth for all 4 service categories + their subpages.

export type Challenge = { title: string; desc: string };
export type Capability = { title: string; desc: string };
export type SubServiceCard = {
  slug: string;
  name: string;
  shortDesc: string;
  iconKey: string;
};

export type MainService = {
  id: string;
  slug: string;
  iconKey: string;
  label: string;
  title: string;
  tagline: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  challenges: Challenge[];
  highlights: string[];
  subServices: SubServiceCard[];
};

export type SubService = {
  parentId: string;
  parentSlug: string;
  parentTitle: string;
  slug: string;
  fullSlug: string;
  iconKey: string;
  title: string;
  heroTitle: string;
  tagline: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  capabilities: Capability[];
  highlights: string[];
};

// ─── MAIN SERVICES ───────────────────────────────────────────────────────────

export const MAIN_SERVICES: MainService[] = [
  // ── 1. Software & AI Solutions ─────────────────────────────────────────────
  {
    id: "software-ai",
    slug: "software-iot",
    iconKey: "brainCircuit",
    label: "SOFTWARE & AI",
    title: "Software & AI Solutions",
    tagline: "Bridge physical operations and digital scale with intelligent software.",
    description:
      "At Texawave, our custom software and enterprise AI solutions bridge the gap between physical operations and digital scale. We transform complex data streams into user-centric operational intelligence optimising data pipelines, application architecture, and real-time edge processing while ensuring seamless business scalability. From training machine learning models to deploying secure cloud backends, we engineer high-performance ecosystems built to scale.",
    metaTitle: "Software & AI Solutions Services | Texawave",
    metaDescription:
      "Custom software, ERP, cloud, web & mobile apps, and enterprise AI solutions. Texawave bridges physical operations and digital scale.",
    challenges: [
      {
        title: "Siloed Data Architecture",
        desc: "Disconnected hardware outputs, IoT streams, and legacy systems create blind spots. We unify them into a single high-throughput data pipeline.",
      },
      {
        title: "Stagnant Operational Efficiency",
        desc: "Manual data processing stalls growth. We replace legacy workflows with autonomous machine learning integration and predictive analytics.",
      },
      {
        title: "Cloud Scalability & Security Risks",
        desc: "Poorly architected cloud platforms invite downtime and data exposure. We build highly available systems protected by end-to-end encryption.",
      },
    ],
    highlights: [
      "Custom ERP Solutions",
      "Web & Mobile Applications",
      "Cloud & Infrastructure",
      "AI & Data Analytics",
    ],
    subServices: [
      {
        slug: "custom-erp",
        name: "Custom ERP Solutions",
        shortDesc: "Tailor-made ERP platforms unifying inventory, HR, and finance with real-time dashboards.",
        iconKey: "settings",
      },
      {
        slug: "web-mobile-apps",
        name: "Web & Mobile Applications",
        shortDesc: "Full-stack web platforms and native iOS/Android apps with enterprise-grade security.",
        iconKey: "monitorSmartphone",
      },
      {
        slug: "cloud-infrastructure",
        name: "Cloud & Infrastructure Solutions",
        shortDesc: "AWS/Azure cloud architecture, CI/CD pipelines, and proactive infrastructure monitoring.",
        iconKey: "cloud",
      },
      {
        slug: "ai-analytics",
        name: "AI & Data Analytics",
        shortDesc: "Custom AI models, intelligent data pipelines, and predictive analytics solutions.",
        iconKey: "brainCircuit",
      },
    ],
  },

  // ── 2. Product Engineering ─────────────────────────────────────────────────
  {
    id: "product-engineering",
    slug: "product-engineering",
    iconKey: "layers",
    label: "PRODUCT ENGINEERING",
    title: "Product Engineering",
    tagline: "Turn complex concepts into market-ready physical products.",
    description:
      "At Texawave, our product engineering services bridge the gap between creative concepts and production reality. We transform ideas into manufacturable physical products combining industrial design, electronics, embedded software, and validation under one roof. From initial sketches to factory-ready documentation, we engineer products built to scale.",
    metaTitle: "Product Engineering Services | Texawave",
    metaDescription:
      "End-to-end product engineering covering industrial design, hardware & PCB, embedded & IoT, and rapid prototyping. Texawave delivers market-ready products.",
    challenges: [
      {
        title: "Design-to-Manufacturing Gap",
        desc: "Concepts that look great in CAD often fail on the production floor. We close the gap by designing for manufacturability from day one.",
      },
      {
        title: "Multi-Discipline Coordination",
        desc: "Synchronising mechanical, electrical, and firmware teams across timelines causes costly delays. We handle all disciplines under one roof.",
      },
      {
        title: "Unverified Prototypes",
        desc: "Skipping rigorous validation leads to expensive tooling failures. We subject every design to physical, mechanical, and environmental stress testing.",
      },
    ],
    highlights: [
      "Industrial & Mechanical Design",
      "Hardware & PCB Design",
      "Embedded & IoT Development",
      "Rapid Prototyping & Validation",
    ],
    subServices: [
      {
        slug: "industrial-mechanical-design",
        name: "Industrial & Mechanical Design",
        shortDesc: "Market analysis, 3D CAD modelling, CMF, and DFM optimisation for physical products.",
        iconKey: "penTool",
      },
      {
        slug: "hardware-pcb",
        name: "Hardware & PCB Design",
        shortDesc: "Schematic design, multi-layer PCB layout, and compliance-ready circuit engineering.",
        iconKey: "circuitBoard",
      },
      {
        slug: "embedded-iot",
        name: "Embedded & IoT Solutions",
        shortDesc: "Bare-metal firmware, RTOS development, and multi-protocol IoT connectivity.",
        iconKey: "cpu",
      },
      {
        slug: "rapid-prototyping",
        name: "Rapid Prototyping & Product Validation",
        shortDesc: "3D printing, CNC machining, and comprehensive physical and environmental validation.",
        iconKey: "box",
      },
    ],
  },

  // ── 3. Procurement Services ────────────────────────────────────────────────
  {
    id: "procurement",
    slug: "procurement",
    iconKey: "packageCheck",
    label: "PROCUREMENT",
    title: "Procurement Services",
    tagline: "Strategic component sourcing and resilient supply chain management.",
    description:
      "At Texawave, our end-to-end procurement services bridge the gap between exceptional engineering designs and production reality. We transform complex supply chains into resilient manufacturing pipelines optimising material costs, BOM efficiency, and global vendor alignment while ensuring seamless production scalability. From proactive risk forecasting to compliant component sourcing, we secure production runs that stay on schedule, within budget, and are built to scale.",
    metaTitle: "Procurement Services | Texawave",
    metaDescription:
      "Strategic component sourcing, supply chain management, and BOM optimisation. Texawave secures production runs on schedule and within budget.",
    challenges: [
      {
        title: "Supply Chain Vulnerability & Lead Times",
        desc: "Obsolete parts and single-source dependencies halt production lines. We conduct continuous lifecycle analysis and qualify drop-in alternatives early.",
      },
      {
        title: "Inflated Bill of Materials Costs",
        desc: "Excessive BOM expenditures erode margins. We eliminate waste through strategic global vendor negotiations and bulk material sourcing.",
      },
      {
        title: "Unverified Supplier Reliability",
        desc: "Component defects and sub-par assembly batches reach production. We enforce uncompromising quality assurance standards across all international suppliers.",
      },
    ],
    highlights: [
      "Component Sourcing",
      "Supply Chain Management",
      "BOM Optimisation",
      "Supplier Quality Control",
    ],
    subServices: [
      {
        slug: "component-sourcing",
        name: "Component Sourcing",
        shortDesc: "Global distributor network securing premium long-lifecycle components at optimal price points.",
        iconKey: "packageCheck",
      },
      {
        slug: "supply-chain-management",
        name: "Supply Chain Management",
        shortDesc: "Resilient logistics pipelines, dual-sourcing strategies, and JIT inventory coordination.",
        iconKey: "waves",
      },
      {
        slug: "bom-optimization",
        name: "BOM Optimisation",
        shortDesc: "Strategic BOM cost reduction through vendor negotiation and obsolescence profiling.",
        iconKey: "fileText",
      },
    ],
  },

  // ── 4. Manufacturing Support ──────────────────────────────────────────────
  {
    id: "manufacturing",
    slug: "manufacturing-support",
    iconKey: "factory",
    label: "MANUFACTURING",
    title: "Manufacturing Support",
    tagline: "Factory-ready support from prototype to high-volume production.",
    description:
      "At Texawave, our comprehensive manufacturing support services bridge the gap between initial prototypes and high-volume production reality. We transform complex factory floor operations into optimised manufacturing systems streamlining assembly workflows, quality control protocols, and testing processes while ensuring seamless production scalability. From initial factory sourcing and tooling setup to end-to-end quality assurance, we deliver operational excellence that keeps your product quality high and scaling costs low.",
    metaTitle: "Manufacturing Support & DFM Services | Texawave",
    metaDescription:
      "DFM/DFA optimisation, production transfer, production test solutions, and scale-up support. Texawave delivers factory-ready manufacturing excellence.",
    challenges: [
      {
        title: "Low Assembly Line Yields",
        desc: "Overly complex part designs cause frequent manual assembly errors and slow production cycles. We overhaul designs to eliminate bottlenecks.",
      },
      {
        title: "Prohibitive Tooling Expenditures",
        desc: "Overly complex geometries drive up injection mould and stamping die costs. We fine-tune components to minimise structural complexity.",
      },
      {
        title: "Inconsistent Build Quality",
        desc: "Defective units leaving the facility damage brand reputation. We integrate automated testing fixtures directly onto the factory floor.",
      },
    ],
    highlights: [
      "DFM/DFA Optimisation",
      "Production Transfer",
      "Production Test Solutions",
      "Scale-Up Support",
    ],
    subServices: [
      {
        slug: "dfm-dfa",
        name: "DFM/DFA Optimisation",
        shortDesc: "Part simplification, tolerance analysis, and assembly process refinement before tooling begins.",
        iconKey: "cog",
      },
      {
        slug: "production-transfer",
        name: "Production Transfer",
        shortDesc: "End-to-end prototype-to-production handoffs with full manufacturing documentation.",
        iconKey: "repeat",
      },
      {
        slug: "production-test",
        name: "Production Test Solutions",
        shortDesc: "Custom test fixtures and automated ICT systems for 100% end-of-line quality control.",
        iconKey: "shieldCheck",
      },
      {
        slug: "scale-up",
        name: "Scale-Up Support",
        shortDesc: "Yield optimisation, factory auditing, and continuous cost engineering as volumes grow.",
        iconKey: "gauge",
      },
    ],
  },
];

// ─── SUB-SERVICES ─────────────────────────────────────────────────────────────

export const SUB_SERVICES: SubService[] = [
  // ── Software & AI subpages ─────────────────────────────────────────────────

  {
    parentId: "software-ai",
    parentSlug: "software-iot",
    parentTitle: "Software & AI Solutions",
    slug: "custom-erp",
    fullSlug: "software-iot/custom-erp",
    iconKey: "settings",
    title: "Custom ERP Solutions",
    heroTitle: "Empowering Enterprise Growth Through Intelligent Automation",
    tagline: "ERP systems built around your workflows, not the other way around.",
    description:
      "We design and deploy high-performance, tailor-made Enterprise Resource Planning (ERP) systems built around your specific operational workflows. Instead of forcing your business into the constraints of rigid, off-the-shelf software, we build scalable platforms that unify your data, optimise resource allocation, and give your teams the real-time intelligence they need to scale with confidence.",
    metaTitle: "Custom ERP Solutions & Software Development",
    metaDescription:
      "Optimize your business workflows with Texawave’s custom ERP solutions. We build tailored enterprise software platforms integrated with data automation.",
    highlights: [
      "Custom Enterprise Backends",
      "Centralised Inventory & HR Modules",
      "Real-time Reporting Dashboards",
      "Legacy System Migration",
    ],
    capabilities: [
      {
        title: "Custom Enterprise Software & Backend Development",
        desc: "Building scalable, maintainable enterprise backends with the architecture flexibility to adapt as your business evolves.",
      },
      {
        title: "Centralised Management Modules",
        desc: "Unified inventory, human resources, and financial management modules that eliminate departmental silos and data inconsistencies.",
      },
      {
        title: "Real-Time Reporting Dashboards",
        desc: "Executive-facing dashboards delivering live operational metrics, KPI tracking, and actionable business intelligence for faster decision-making.",
      },
      {
        title: "Legacy System Migration",
        desc: "Seamless migration from outdated legacy platforms with zero data loss, minimal downtime, and comprehensive staff training.",
      },
      {
        title: "Third-Party API Integrations",
        desc: "Connecting your ERP to existing tools—CRMs, payment gateways, logistics platforms—for a fully unified operational ecosystem.",
      },
      {
        title: "Workflow Automation",
        desc: "Replacing manual, repetitive processes with intelligent automation to reduce overhead, eliminate human error, and accelerate throughput.",
      },
    ],
  },

  {
    parentId: "software-ai",
    parentSlug: "software-iot",
    parentTitle: "Software & AI Solutions",
    slug: "web-mobile-apps",
    fullSlug: "software-iot/web-mobile-apps",
    iconKey: "monitorSmartphone",
    title: "Web & Mobile Applications",
    heroTitle: "Seamless Digital Experiences Engineered for Impact",
    tagline: "Production-ready digital platforms built for scale and retention.",
    description:
      "Turn your product vision into flawless, production-ready digital platforms. Our full-stack engineering teams combine robust frontend frameworks with highly scalable backends to deliver exceptional user experiences, high retention rates, and enterprise-grade security. From concept to app store, we handle the complete engineering lifecycle.",
    metaTitle: "Web & Mobile Applications Development Service",
    metaDescription:
      "TexaWave designs scalable Web & Mobile Applications for enterprises. We engineer responsive web apps, iOS/Android apps, and device-connected dashboards.",
    highlights: [
      "Native iOS & Android Apps",
      "Progressive Web Apps (PWA)",
      "React Native & Flutter",
      "UI/UX Design & Prototyping",
    ],
    capabilities: [
      {
        title: "Modern Web Platforms",
        desc: "Responsive, performant web applications built with modern frameworks (React, Next.js, Vue) optimised for speed, SEO, and accessibility.",
      },
      {
        title: "Native iOS & Android Apps",
        desc: "Platform-native mobile apps delivering premium performance, smooth animations, and deep OS integration for both consumer and enterprise markets.",
      },
      {
        title: "Progressive Web Apps (PWAs) & Cross-Platform Frameworks",
        desc: "Maximising reach with React Native and Flutter solutions that deliver near-native performance across platforms from a single codebase.",
      },
      {
        title: "Intuitive UI/UX Design",
        desc: "User-centric interface design, wireframing, and interactive prototyping that reduces friction, increases engagement, and drives conversion.",
      },
      {
        title: "Performance & Speed Optimisation",
        desc: "Code splitting, lazy loading, CDN configuration, and database query optimisation to ensure sub-second load times at any scale.",
      },
      {
        title: "Security & Compliance",
        desc: "End-to-end encryption, secure authentication (OAuth, MFA), GDPR compliance, and penetration-tested backends protecting user data.",
      },
    ],
  },

  {
    parentId: "software-ai",
    parentSlug: "software-iot",
    parentTitle: "Software & AI Solutions",
    slug: "cloud-infrastructure",
    fullSlug: "software-iot/cloud-infrastructure",
    iconKey: "cloud",
    title: "Cloud & Infrastructure Solutions",
    heroTitle: "Resilient, Cost-Efficient, and Secure Cloud Architectures",
    tagline: "Zero infrastructure headaches. Maximum uptime.",
    description:
      "Maximise your uptime and accelerate development velocity with zero infrastructure headaches. We design and maintain cloud-native frameworks and continuous deployment pipelines that grow effortlessly with your business demands. From day-one architecture to ongoing operations, we ensure your platform is always available, always secure, and always cost-efficient.",
    metaTitle: "Cloud & Infrastructure Solutions for IoT Systems",
    metaDescription:
      "TexaWave delivers secure Cloud & Infrastructure Solutions. We build automated AWS/Azure DevOps pipelines, serverless setups, and robust IoT data networks.",
    highlights: [
      "AWS & Azure Architecture",
      "Serverless & Microservices",
      "CI/CD Pipelines",
      "Disaster Recovery Planning",
    ],
    capabilities: [
      {
        title: "AWS & Azure Cloud Architecture",
        desc: "Designing highly available, fault-tolerant cloud infrastructures with serverless deployments, managed databases, and auto-scaling compute.",
      },
      {
        title: "Automated DevOps Pipelines (CI/CD)",
        desc: "Building fully automated continuous integration and deployment pipelines for rapid, reliable software releases with zero manual intervention.",
      },
      {
        title: "Infrastructure Monitoring & Alerting",
        desc: "Proactive real-time monitoring, automated anomaly detection, and incident response playbooks that catch issues before they affect users.",
      },
      {
        title: "Disaster Recovery & Failover Planning",
        desc: "Multi-region redundancy, automated backups, and tested recovery runbooks ensuring your platform survives any failure scenario.",
      },
      {
        title: "Cloud Cost Optimisation",
        desc: "Comprehensive audits to identify wasteful resource spending, right-size compute instances, and implement reserved capacity strategies.",
      },
      {
        title: "Security & Compliance Hardening",
        desc: "IAM policies, VPC configuration, end-to-end encryption, and compliance frameworks (SOC 2, ISO 27001) built into the infrastructure from day one.",
      },
    ],
  },

  {
    parentId: "software-ai",
    parentSlug: "software-iot",
    parentTitle: "Software & AI Solutions",
    slug: "ai-analytics",
    fullSlug: "software-iot/ai-analytics",
    iconKey: "brainCircuit",
    title: "AI & Data Analytics",
    heroTitle: "Turning Complex Enterprise Data into Actionable Business Intelligence",
    tagline: "Stop guessing. Start predicting.",
    description:
      "We construct the intelligent data pipelines and advanced AI models required to process raw data, automate repetitive workflows, and uncover high-value business insights. From deploying computer vision neural networks on the edge to building enterprise-wide business intelligence platforms, we bring the full spectrum of modern AI engineering to your operations.",
    metaTitle: "AI & Data Analytics Services & Engineering ",
    metaDescription:
      "TexaWave delivers predictive AI & Data Analytics for edge & enterprise systems. We engineer machine learning pipelines, computer vision, and BI tools.",
    highlights: [
      "Custom Machine Learning Models",
      "Computer Vision & Edge AI",
      "NLP Applications",
      "BI Dashboards & Data Pipelines",
    ],
    capabilities: [
      {
        title: "Machine Learning Integration & Edge AI",
        desc: "Deploying predictive models, computer vision neural networks, and lightweight edge-AI algorithms to make your systems autonomous and highly responsive.",
      },
      {
        title: "Enterprise Cloud AI Platforms",
        desc: "Engineering resilient cloud backends, scalable microservices, and responsive data dashboards designed to handle complex, concurrent enterprise operations.",
      },
      {
        title: "Hardware-Software Co-Design for AI",
        desc: "Optimising the synchronisation layer between physical hardware nodes, low-level firmware protocols, and high-level AI application interfaces for zero-latency performance.",
      },
      {
        title: "Data Analytics & Business Intelligence",
        desc: "Robust data pipelines, interactive visualisation dashboards, and comprehensive BI tools that transform raw operational data into strategic decisions.",
      },
      {
        title: "Predictive Modelling & Anomaly Detection",
        desc: "Statistical and deep learning models that forecast demand, detect quality defects, flag anomalies, and automate smart workflows.",
      },
      {
        title: "Natural Language Processing (NLP)",
        desc: "Custom NLP applications for document intelligence, conversational AI, sentiment analysis, and enterprise knowledge management systems.",
      },
    ],
  },

  // ── Product Engineering subpages ──────────────────────────────────────────

  {
    parentId: "product-engineering",
    parentSlug: "product-engineering",
    parentTitle: "Product Engineering",
    slug: "industrial-mechanical-design",
    fullSlug: "product-engineering/industrial-mechanical-design",
    iconKey: "penTool",
    title: "Industrial & Mechanical Design",
    heroTitle: "Turn Complex Concepts into Market-Ready Products",
    tagline: "From design research to production-ready architecture.",
    description:
      "At Texawave, our industrial and mechanical design services bridge the gap between creative concepts and production reality. We transform complex ideas into user-centric physical products—optimising form, functionality, and ergonomics while ensuring seamless manufacturability. From initial 3D modelling to production-ready architecture, we design products that stand out in the market and are built to scale.",
    metaTitle: "Industrial & Mechanical Design Services",
    metaDescription:
      "Transform complex engineering into beautiful, manufacturable products. Discover Texawave's expert industrial and mechanical design services.",
    highlights: [
      "3D Surface Modelling & CAD",
      "DFM-Optimised Geometry",
      "CMF Specification",
      "Prototyping & Form Validation",
    ],
    capabilities: [
      {
        title: "Design Research",
        desc: "Market analysis, competitive product teardowns, and user ergonomics studies to ground every design decision in real-world insight.",
      },
      {
        title: "Ergonomics & CMF",
        desc: "Optimising physical touchpoints and selecting robust Color, Material, and Finish (CMF) specifications for both aesthetics and durability.",
      },
      {
        title: "3D CAD & Rendering",
        desc: "Creating precise 3D surface models and photorealistic digital visualisations that communicate intent clearly to stakeholders and manufacturers.",
      },
      {
        title: "Engineering Integration",
        desc: "Blending industrial and mechanical design principles to align enclosure aesthetics with internal mechanical constraints, PCBs, and thermal pathways.",
      },
      {
        title: "DFM Optimisation",
        desc: "Structuring parting lines, wall thicknesses, and draft angles for seamless injection moulding and fabrication at scale.",
      },
      {
        title: "Prototyping & Form Validation",
        desc: "Creating physical high-fidelity mockups to test ergonomics, fit, and appearance before committing to expensive tooling.",
      },
    ],
  },

  {
    parentId: "product-engineering",
    parentSlug: "product-engineering",
    parentTitle: "Product Engineering",
    slug: "hardware-pcb",
    fullSlug: "product-engineering/hardware-pcb",
    iconKey: "circuitBoard",
    title: "Hardware & PCB Design",
    heroTitle: "Custom Hardware Development and PCB Design",
    tagline: "Reliable, compliance-ready circuits from schematic to layout.",
    description:
      "The electrical architecture is the central nervous system of your product. A single design flaw in your power rails or signal lines can lead to costly field failures and market delays. We provide elite custom hardware development and PCB design services, engineering energy-efficient, high-performance electronic systems for medical, industrial, consumer, and automotive applications.",
    metaTitle: "Custom Hardware Development & PCB Design",
    metaDescription:
      "Expert custom hardware development & PCB design services. From schematics to multilayer layouts, we design reliable, compliance-ready circuits.",
    highlights: [      
      "Schematic & BOM Optimisation",
      "Multi-layer PCB Layout",
      "Power & Battery Optimisation",
      "BIS/CE/FCC/RoHS Compliance",
    ],
    capabilities: [
      {
        title: "Hardware System Architecture",
        desc: "Mapping system block diagrams, defining interfaces, and balancing power budgets to minimise risk before a single trace is routed.",
      },
      {
        title: "Schematic & Component Selection",
        desc: "Building precise schematics and sourcing long-lifecycle components to optimise your Bill of Materials (BOM) for cost and supply chain resilience.",
      },
      {
        title: "Precision PCB Layout",
        desc: "Balancing multilayer stackups, trace widths, and shielding for flawless signal integrity and minimal noise in high-speed designs.",
      },
      {
        title: "Power & Battery Optimisation",
        desc: "Designing high-efficiency buck-boost regulators and low-power sleep states to maximise battery life in portable and IoT products.",
      },
      {
        title: "Analog & Digital Design",
        desc: "Isolating sensitive analog inputs and routing high-speed digital processors, wireless modules, and sensor arrays without interference.",
      },
      {
        title: "Regulatory Compliance",
        desc: "Engineering from day one to pass FCC, CE, and RoHS standards by eliminating EMI and thermal issues early in the design cycle.",
      },
    ],
  },

  {
    parentId: "product-engineering",
    parentSlug: "product-engineering",
    parentTitle: "Product Engineering",
    slug: "embedded-iot",
    fullSlug: "product-engineering/embedded-iot",
    iconKey: "cpu",
    title: "Embedded & IoT Solutions",
    heroTitle: "Integrated Embedded Firmware & IoT Solutions",
    tagline: "Reliable, secure firmware for edge devices and connected products.",
    description:
      "Many connected products fail not because of hardware design, but due to unstable software. Bugs, memory leaks, and unencrypted data transmissions stall launches and compromise user trust. We engineer hardware-aware embedded firmware and IoT solutions built for reliability, security, and long-term field deployment.",
    metaTitle: "Custom Embedded Firmware & IoT Solutions",
    metaDescription:
      "Secure your edge devices with custom embedded firmware & IoT solutions. We integrate hardware root of trust, encryption, and secure boot protocols.",
    highlights: [
      "Bare-Metal C/C++ & RTOS",
      "OTA Bootloaders",
      "Secure Boot & Encryption",
      "BLE, Wi-Fi, LoRaWAN, LTE-M",
    ],
    capabilities: [
      {
        title: "Edge & Node Firmware",
        desc: "Highly optimised, bare-metal C/C++ code and RTOS development (FreeRTOS, Zephyr) for low-resource microcontrollers (ARM Cortex, ESP32), ensuring every byte of RAM is fully utilised.",
      },
      {
        title: "Connected IoT Gateways",
        desc: "For complex multi-sensor systems requiring parallel processing, we configure custom ruggedised embedded Linux environments (Yocto Project) with robust local processing capabilities.",
      },
      {
        title: "Protocol Implementation",
        desc: "Seamless data routing from edge to cloud using Wi-Fi, Bluetooth Low Energy (BLE), Cellular (LTE-M/NB-IoT), LoRaWAN, and MQTT.",
      },
      {
        title: "OTA Update Systems",
        desc: "Fail-safe, encrypted Over-the-Air (OTA) bootloaders with automatic dual-image rollbacks, preventing bricked devices in the field.",
      },
      {
        title: "Security Architecture",
        desc: "Implementing hardware root of trust, secure boot, and cryptographic data encryption to eliminate security exploits and hacking vulnerabilities.",
      },
      {
        title: "Power Optimisation",
        desc: "Low-power states, peripheral clock gating, and optimised sleep-cycles to maximise battery life in battery-powered edge devices.",
      },
    ],
  },

  {
    parentId: "product-engineering",
    parentSlug: "product-engineering",
    parentTitle: "Product Engineering",
    slug: "rapid-prototyping",
    fullSlug: "product-engineering/rapid-prototyping",
    iconKey: "box",
    title: "Rapid Prototyping & Product Validation",
    heroTitle: "Rapid Prototyping & Product Validation Services",
    tagline: "From CAD to validated hardware before you commit to tooling.",
    description:
      "The bridge between a digital CAD design and high-volume manufacturing is a critical phase. Engineering oversights, unverified tolerances, or undetected material fatigue can lead to catastrophic tooling failures, costly production delays, and unexpected field rejections. We provide high-fidelity rapid prototyping and uncompromising product testing and validation services—subjecting your concepts to rigorous physical, mechanical, and environmental stress protocols before you commit to mass production tooling.",
    metaTitle: "Rapid Prototyping & Product Validation Services",
    metaDescription:
      "Speed up product launches. Texawave’s rapid prototyping and validation services de-risk engineering and bring your ideas to life fast. Learn how.",
    highlights: [
      "SLA / SLS / FDM 3D Printing",
      "Precision CNC Machining",
      "Environmental Stress Testing",
      "3D Scan Metrology & QA",
    ],
    capabilities: [
      {
        title: "Rapid 3D Printing (Additive)",
        desc: "High-resolution SLA, SLS, and FDM for fast form-study models, intricate geometries, and rapid spatial and ergonomic verification.",
      },
      {
        title: "Precision CNC Machining",
        desc: "Subtractive fabrication using production-grade plastics and metals for exceptionally tight tolerances and real-world mechanical performance.",
      },
      {
        title: "Functional Mockups",
        desc: "Pre-production assemblies integrating custom electronics, mechanisms, and premium finishes (CMF) that are indistinguishable from the final production run.",
      },
      {
        title: "Reliability & Life-Cycle Testing",
        desc: "Simulating years of product wear-and-tear in days using accelerated life testing (ALT) to catch mechanical fatigue before deployment.",
      },
      {
        title: "Environmental Stress Tests",
        desc: "Subjecting hardware to extreme temperature swings, high humidity, UV exposure, and ingress protection (IP rating) verification.",
      },
      {
        title: "QA & Metrology",
        desc: "Utilising advanced 3D scanning and precision metrology tools to verify physical prototypes match digital CAD specifications down to the micron.",
      },
    ],
  },

  // ── Procurement subpages ──────────────────────────────────────────────────

  {
    parentId: "procurement",
    parentSlug: "procurement",
    parentTitle: "Procurement Services",
    slug: "component-sourcing",
    fullSlug: "procurement/component-sourcing",
    iconKey: "packageCheck",
    title: "Component Sourcing",
    heroTitle: "Global Component Sourcing & Alternative Part Solutions",
    tagline: "The exact parts you need, at the best price, without the wait.",
    description:
      "Finding the exact parts required for sophisticated hardware should not stall your entire product roadmap. At Texawave, we utilise a vetted network of international distributors and manufacturers to secure premium parts while actively designing out single-source vulnerabilities. From semiconductors to custom enclosures, we close the supply gaps that delay production.",
    metaTitle: "Global Component Sourcing Services",
    metaDescription:
      "Global component sourcing, alternative part engineering, counterfeit prevention, and direct factory relationships for reliable hardware supply.",
    highlights: [
      "International Distributor Network",
      "Drop-In Alternative Engineering",
      "Counterfeit Prevention & Traceability",
      "Direct Factory Relationships",
    ],
    capabilities: [
      {
        title: "Global Component Sourcing",
        desc: "Leveraging an established international distributor network to secure high-quality, long-lifecycle hardware and electronic components at optimal price points.",
      },
      {
        title: "Cross-Reference & Alternative Part Engineering",
        desc: "If a primary component faces an extended lead time, our engineers instantly map out functionally identical drop-in replacements to keep production on schedule.",
      },
      {
        title: "Counterfeit Prevention & Traceability",
        desc: "Strict multi-point quality checks to guarantee component authenticity and full traceability compliance with international manufacturing standards.",
      },
      {
        title: "Direct Factory Relationships",
        desc: "Direct-to-source negotiations with manufacturers to bypass unnecessary distributor markups and secure preferential allocations during component shortages.",
      },
      {
        title: "Supply Chain Risk Mitigation",
        desc: "Running predictive obsolescence profiling on your engineering designs to establish resilient, multi-source component pipelines before shortages occur.",
      },
      {
        title: "BOM Alignment & Verification",
        desc: "Cross-checking every sourced component against your engineering BOM for specification accuracy, package compatibility, and compliance status.",
      },
    ],
  },

  {
    parentId: "procurement",
    parentSlug: "procurement",
    parentTitle: "Procurement Services",
    slug: "supply-chain-management",
    fullSlug: "procurement/supply-chain-management",
    iconKey: "waves",
    title: "Supply Chain Management",
    heroTitle: "Resilient Supply Chain Management & Manufacturing Logistics",
    tagline: "Your goods arrive exactly when and where they are needed.",
    description:
      "Volatile global markets require aggressive risk planning. We manage the heavy lifting of international transit, warehousing, and inventory management so your physical goods arrive exactly when and where they are needed. From dual-sourcing strategies to customs compliance, we build supply chains that absorb global shocks without halting your production line.",
    metaTitle: "Supply Chain Management Services",
    metaDescription:
      "Resilient supply chain management and manufacturing logistics. Multi-tiered risk mitigation, JIT coordination, and end-to-end compliance management.",
    highlights: [
      "Multi-Tiered Risk Mitigation",
      "JIT & Buffer Stock Coordination",
      "International Freight & Customs",
      "Dual-Sourcing Strategies",
    ],
    capabilities: [
      {
        title: "Multi-Tiered Risk Mitigation Plans",
        desc: "Active backup logistics pipelines, dual-sourcing strategies, and manufacturing site diversification to insulate production from geopolitical or shipping disruptions.",
      },
      {
        title: "Just-In-Time (JIT) & Buffer Stock Coordination",
        desc: "Balancing your warehouse footprint to minimise holding costs while ensuring sufficient safety stock to fulfil sudden spikes in market demand.",
      },
      {
        title: "End-to-End Compliance & Tariff Management",
        desc: "Seamless handling of international freight customs, tariff classifications, and local regulatory filings to prevent border holds and duty surprises.",
      },
      {
        title: "Inventory Management & Warehousing",
        desc: "Real-time inventory tracking, demand forecasting, and warehouse coordination to maintain optimal stock levels across multiple production sites.",
      },
      {
        title: "Supplier Performance Monitoring",
        desc: "Ongoing tracking of supplier KPIs—on-time delivery, defect rates, lead times—with structured escalation protocols for underperforming partners.",
      },
      {
        title: "Production Continuity Planning",
        desc: "Documenting and activating contingency sourcing and logistics plans that keep your line running through market disruptions, natural disasters, or supply shortages.",
      },
    ],
  },

  {
    parentId: "procurement",
    parentSlug: "procurement",
    parentTitle: "Procurement Services",
    slug: "bom-optimization",
    fullSlug: "procurement/bom-optimization",
    iconKey: "fileText",
    title: "BOM Optimisation",
    heroTitle: "Strategic Bill of Materials Optimisation",
    tagline: "Cut costs, eliminate risk, and future-proof your component strategy.",
    description:
      "Your Bill of Materials is one of the highest-leverage documents in your product's lifecycle. Poorly structured BOMs inflate unit costs, expose you to supply chain risk, and slow down procurement at every production run. We conduct deep-dive BOM audits and implement strategic optimisation to reduce material spend, extend component lifecycles, and align your supply chain to your production goals.",
    metaTitle: "Bill of materials optimisation services",
    metaDescription:
      "Strategic Bill of Materials optimisation for cost reduction, lifecycle management, and supply chain resilience. Expert BOM audits by Texawave.",
    highlights: [
      "BOM Audit & Cost Analysis",
      "Component Lifecycle Management",
      "Vendor Consolidation",
      "Obsolescence Risk Profiling",
    ],
    capabilities: [
      {
        title: "BOM Audit & Cost Analysis",
        desc: "Line-by-line review of your entire Bill of Materials to identify overpriced components, unnecessary variants, and consolidation opportunities.",
      },
      {
        title: "Component Lifecycle Management",
        desc: "Proactive monitoring of component end-of-life (EOL) and last-time-buy (LTB) dates to prevent unexpected production halts.",
      },
      {
        title: "Vendor Consolidation & Negotiation",
        desc: "Reducing supplier fragmentation by consolidating to fewer, stronger vendor relationships to unlock volume discounts and priority allocations.",
      },
      {
        title: "Obsolescence Risk Profiling",
        desc: "Running predictive obsolescence analysis to identify at-risk components and pre-qualify qualified drop-in alternatives before supply gaps emerge.",
      },
      {
        title: "Alternative Part Qualification",
        desc: "Engineering and qualifying functionally equivalent replacement components that maintain full electrical and mechanical compatibility with your design.",
      },
      {
        title: "BOM Revision Management",
        desc: "Structured version control and change management for BOM revisions, ensuring every engineering change is properly documented and communicated to production.",
      },
    ],
  },

  // ── Manufacturing Support subpages ────────────────────────────────────────

  {
    parentId: "manufacturing",
    parentSlug: "manufacturing-support",
    parentTitle: "Manufacturing Support",
    slug: "dfm-dfa",
    fullSlug: "manufacturing-support/dfm-dfa",
    iconKey: "cog",
    title: "DFM/DFA Optimisation",
    heroTitle: "Design for Manufacturing & Assembly Optimisation",
    tagline: "A brilliant design only succeeds if it can be reliably built.",
    description:
      "Our engineers perform rigorous diagnostic reviews on your product designs to simplify assembly processes, minimise component count, and reduce the risk of manufacturing defects before production tooling begins. We analyse every interface, fastener, and tolerance stack—transforming complex, difficult-to-assemble designs into streamlined, production-floor-ready architectures.",
    metaTitle: "DFM/DFA Design for Manufacturing Optimisation",
    metaDescription:
      "Design for Manufacturing & Assembly optimisation. Part simplification, tolerance analysis, and fastener reduction for cost-efficient production.",
    highlights: [
      "Part Count Reduction",
      "Tolerance Stack-Up Analysis",
      "Fastener Standardisation",
      "Assembly Time Reduction",
    ],
    capabilities: [
      {
        title: "Part Simplification & Consolidation",
        desc: "Re-engineering multi-part assemblies into integrated components to minimise assembly time, labour overhead, and the number of unique part numbers.",
      },
      {
        title: "Tolerance Analysis",
        desc: "Ensuring component dimensions align perfectly with industrial assembly line capabilities to eliminate production floor tolerance stack-up issues and rework.",
      },
      {
        title: "Fastener Reduction & Standardisation",
        desc: "Minimising the number of distinct hardware types across the assembly to streamline factory workflows and reduce tooling changeover times.",
      },
      {
        title: "Tooling Cost Reduction",
        desc: "Fine-tuning component geometries and parting lines to minimise the structural complexity and upfront cost of custom injection moulds and stamping dies.",
      },
      {
        title: "Assembly Sequence Optimisation",
        desc: "Restructuring the build sequence to reduce the number of operator motions, minimise re-orientations, and allow parallel sub-assembly workflows.",
      },
      {
        title: "Design Review & Documentation",
        desc: "Formal DFM/DFA review reports with annotated drawings, issue logs, and corrective action recommendations ready for implementation.",
      },
    ],
  },

  {
    parentId: "manufacturing",
    parentSlug: "manufacturing-support",
    parentTitle: "Manufacturing Support",
    slug: "production-transfer",
    fullSlug: "manufacturing-support/production-transfer",
    iconKey: "repeat",
    title: "Production Transfer",
    heroTitle: "Seamless Production Transfer & Factory Handoffs",
    tagline: "From bench to production line without losing a single specification.",
    description:
      "Moving a physical product from a laboratory bench to a commercial assembly line is a critical, risk-heavy milestone. We manage the entire transition process, ensuring that all engineering documentation, tooling specifications, and assembly instructions are flawlessly transferred to your mass production partners—with experienced engineers on the ground to oversee every detail.",
    metaTitle: "Production Transfer & NPI Services",
    metaDescription:
      "Seamless production transfer from prototype to high-volume assembly lines. Manufacturing documentation, tooling development, and NPI supervision.",
    highlights: [
      "Manufacturing Documentation Packets",
      "Tooling & Fixture Development",
      "NPI On-Site Supervision",
      "Golden Sample Definition",
    ],
    capabilities: [
      {
        title: "Manufacturing Documentation Packets",
        desc: "Building rigorous Standard Operating Procedures (SOPs), golden sample definitions, traveller documents, and full build-readiness documentation.",
      },
      {
        title: "Tooling & Fixture Development",
        desc: "Overseeing the fabrication and first-article validation of high-volume moulds, stamps, production dies, and assembly fixtures.",
      },
      {
        title: "NPI (New Product Introduction) Supervision",
        desc: "Sending experienced Texawave engineers on-site to oversee first-article inspections, run pilot builds, and resolve assembly friction before full production begins.",
      },
      {
        title: "Pilot Run Management",
        desc: "Orchestrating controlled pilot production runs to verify assembly sequences, test fixture performance, and validate yield rates before volume commitment.",
      },
      {
        title: "Engineering Change Management",
        desc: "Managing structured ECN (Engineering Change Notice) processes to ensure every design modification is captured, approved, and implemented without production disruption.",
      },
      {
        title: "Production Readiness Reviews",
        desc: "Formal gate reviews confirming tooling qualification, operator training completion, material availability, and test fixture validation before production kick-off.",
      },
    ],
  },

  {
    parentId: "manufacturing",
    parentSlug: "manufacturing-support",
    parentTitle: "Manufacturing Support",
    slug: "production-test",
    fullSlug: "manufacturing-support/production-test",
    iconKey: "shieldCheck",
    title: "Production Test Solutions",
    heroTitle: "Advanced Production Line Test Solutions & Custom Jigs",
    tagline: "Quality control at the speed of your assembly line.",
    description:
      "Quality control must run at the speed of your assembly line. We engineer custom, high-throughput testing systems that fit seamlessly into your factory layout, verifying the electrical, mechanical, and software functionality of every single unit before it gets boxed for shipment. Zero defective units leave the building.",
    metaTitle: "Production Test Solutions & Custom Test Jigs",
    metaDescription:
      "Custom production line test solutions and test jigs. ICT, functional testing, bed-of-nails fixtures, and data logging for 100% unit coverage.",
    highlights: [
      "Custom ICT & Functional Testers",
      "Bed-of-Nails Test Jigs",
      "Automated Data Logging",
      "100% End-of-Line Coverage",
    ],
    capabilities: [
      {
        title: "Custom ICT (In-Circuit Testing) & Functional Testing",
        desc: "Automated validation systems that read voltages, verify signal integrity, test device firmware, and confirm full functional compliance for every unit.",
      },
      {
        title: "Bed-of-Nails & Mechanical Test Jigs",
        desc: "Custom-machined hardware fixtures built for quick insertion, reliable mechanical contact, and high repeatability on fast-moving production floors.",
      },
      {
        title: "Data Logging & Traceability",
        desc: "Integrating automated test software to save diagnostic logs for every serial number, protecting your enterprise against warranty claims and enabling field failure analysis.",
      },
      {
        title: "Wireless & RF Testing",
        desc: "Shielded chamber testing and automated protocol verification for Wi-Fi, BLE, cellular, and LoRaWAN-enabled products before they leave the line.",
      },
      {
        title: "Mechanical Compliance Testing",
        desc: "Automated fixtures verifying assembly torque, connector insertion force, button actuation feel, and seal integrity against production specification limits.",
      },
      {
        title: "Yield Analytics & Reporting",
        desc: "Real-time dashboards surfacing first-pass yield rates, failure mode distributions, and station-level bottlenecks to drive continuous improvement.",
      },
    ],
  },

  {
    parentId: "manufacturing",
    parentSlug: "manufacturing-support",
    parentTitle: "Manufacturing Support",
    slug: "scale-up",
    fullSlug: "manufacturing-support/scale-up",
    iconKey: "gauge",
    title: "Scale-Up Support",
    heroTitle: "End-to-End Scale-Up Support & Factory Quality Auditing",
    tagline: "Small inefficiencies at scale become large losses. We stop them early.",
    description:
      "As production volumes surge from hundreds to hundreds of thousands, small inefficiencies quickly balloon into costly losses. We provide ongoing, on-the-ground support to stabilise manufacturing yields, audit factory workflows, and build an unshakeable quality assurance ecosystem that sustains excellence at any volume.",
    metaTitle: "Manufacturing Scale-Up Support & Quality Auditing",
    metaDescription:
      "End-to-end scale-up support with yield optimisation, factory auditing, supplier compliance, and continuous cost engineering as volumes grow.",
    highlights: [
      "Yield Optimisation & Root-Cause Analysis",
      "Supplier & Factory Auditing",
      "Continuous Cost Engineering",
      "Quality Management Systems",
    ],
    capabilities: [
      {
        title: "Yield Optimisation & Root-Cause Analysis",
        desc: "Tracking factory defect rates and performing deep-dive forensics to identify and permanently fix underlying component, process, or design errors.",
      },
      {
        title: "Supplier & Factory Auditing",
        desc: "Independent, multi-point on-site inspections to verify that manufacturing facilities maintain rigid compliance with safety and environmental protocols.",
      },
      {
        title: "Continuous Cost Engineering",
        desc: "Auditing steady-state production lines to uncover ongoing material, packaging, and logistics cost savings as you scale into higher volume brackets.",
      },
      {
        title: "Quality Management System (QMS) Integration",
        desc: "Implementing and maintaining ISO 9001-aligned quality management systems that standardise inspection criteria across all production facilities.",
      },
      {
        title: "Operator Training & SOP Refinement",
        desc: "Updating production SOPs and running targeted operator training programmes to eliminate human-error-driven defects at high throughput.",
      },
      {
        title: "Volume Ramp Coordination",
        desc: "Orchestrating controlled volume ramp schedules with your manufacturing partners to validate capacity, tooling performance, and quality metrics at each production tier.",
      },
    ],
  },
];

// ─── Lookup helpers ───────────────────────────────────────────────────────────

export function getMainService(slug: string): MainService | undefined {
  return MAIN_SERVICES.find((s) => s.slug === slug);
}

export function getSubService(parentSlug: string, slug: string): SubService | undefined {
  return SUB_SERVICES.find((s) => s.parentSlug === parentSlug && s.slug === slug);
}