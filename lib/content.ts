import {
  BadgeCheck,
  Blocks,
  Box,
  BrainCircuit,
  Cable,
  CircuitBoard,
  Cloud,
  Code2,
  Cog,
  Component,
  Cpu,
  Factory,
  FileText,
  FlaskConical,
  Gauge,
  Globe2,
  Handshake,
  Layers3,
  Lightbulb,
  MonitorSmartphone,
  PackageCheck,
  PenTool,
  Printer,
  RadioTower,
  Repeat,
  Scissors,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Waves,
  Wrench,
  Zap
} from "lucide-react";

export const navItems = [
  { label: "Services", href: "/services" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Careers", href: "/careers" }
];

export const services = [
  {
    slug: "software-iot",
    title: "Software & AI Solutions",
    short: "Bridge physical operations and digital scale with intelligent software.",
    icon: Code2,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    deliverables: [
      "Custom ERP Solutions",
      "Web & Mobile Applications",
      "Cloud & Infrastructure Solutions",
      "AI & Data Analytics"
    ],
    subServices: [
      { icon: Settings,          title: "Custom ERP Solutions",                desc: "Tailor-made ERP platforms unifying inventory, HR, and finance with real-time dashboards." },
      { icon: MonitorSmartphone, title: "Web & Mobile Applications",           desc: "Full-stack web platforms and native iOS/Android apps with enterprise-grade security." },
      { icon: Cloud,             title: "Cloud & Infrastructure Solutions",    desc: "AWS/Azure cloud architecture, CI/CD pipelines, and proactive infrastructure monitoring." },
      { icon: BrainCircuit,      title: "AI & Data Analytics",                 desc: "Custom AI models, intelligent data pipelines, and predictive analytics solutions." }
    ]
  },
  {
    slug: "product-engineering",
    title: "Product Engineering",
    short: "Turn complex concepts into market-ready physical products.",
    icon: Cpu,
    image: "https://images.unsplash.com/photo-1581092335878-2d9ff86ca2bf?auto=format&fit=crop&w=1200&q=80",
    deliverables: [
      "Industrial & Mechanical Design",
      "Hardware & PCB Design",
      "Embedded & IoT Solutions",
      "Rapid Prototyping & Validation"
    ],
    subServices: [
      { icon: PenTool,           title: "Industrial & Mechanical Design",      desc: "Market analysis, 3D CAD modelling, CMF, and DFM optimisation for physical products." },
      { icon: CircuitBoard,      title: "Hardware & PCB Design",               desc: "Schematic design, multi-layer PCB layout, and compliance-ready circuit engineering." },
      { icon: Cpu,               title: "Embedded & IoT Solutions",            desc: "Bare-metal firmware, RTOS development, and multi-protocol IoT connectivity." },
      { icon: Box,               title: "Rapid Prototyping & Product Validation", desc: "3D printing, CNC machining, and comprehensive physical and environmental validation." }
    ]
  },
  {
    slug: "procurement",
    title: "Procurement Services",
    short: "Strategic component sourcing and resilient supply chain management.",
    icon: PackageCheck,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    deliverables: [
      "Component Sourcing",
      "Supply Chain Management",
      "BOM Optimization",
      "Supplier Quality Control"
    ],
    subServices: [
      { icon: PackageCheck,      title: "Component Sourcing",                  desc: "Global distributor network securing premium long-lifecycle components at optimal price points." },
      { icon: Waves,             title: "Supply Chain Management",             desc: "Resilient logistics pipelines, dual-sourcing strategies, and JIT inventory coordination." },
      { icon: FileText,          title: "BOM Optimization",                    desc: "Strategic BOM cost reduction through vendor negotiation and obsolescence profiling." }
    ]
  },
  {
    slug: "manufacturing-support",
    title: "Manufacturing Support",
    short: "Factory-ready support from prototype to high-volume production.",
    icon: Factory,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    deliverables: [
      "DFM/DFA Optimization",
      "Production Transfer",
      "Production Test Solutions",
      "Scale-Up Support"
    ],
    subServices: [
      { icon: Cog,               title: "DFM/DFA Optimization",                desc: "Part simplification, tolerance analysis, and assembly process refinement before tooling begins." },
      { icon: Repeat,            title: "Production Transfer",                  desc: "End-to-end prototype-to-production handoffs with full manufacturing documentation." },
      { icon: ShieldCheck,       title: "Production Test Solutions",            desc: "Custom test fixtures and automated ICT systems for 100% end-of-line quality control." },
      { icon: Gauge,             title: "Scale-Up Support",                    desc: "Yield optimization, factory auditing, and continuous cost engineering as volumes grow." }
    ]
  }
];

export const processSteps = [
  {
    title: "Requirement Analysis",
    copy: "We clarify product intent, technical constraints, target market, compliance needs, and build priorities before engineering begins."
  },
  {
    title: "Design & Engineering",
    copy: "Mechanical, electrical, embedded, procurement, and software teams convert the brief into manufacturable product architecture."
  },
  {
    title: "Prototyping & Testing",
    copy: "We validate critical assumptions through CAD reviews, PCB iterations, firmware checks, fit trials, and performance testing."
  },
  {
    title: "Delivery & Optimization",
    copy: "Texawave supports documentation, production readiness, vendor coordination, value engineering, and launch improvements."
  }
];

export const caseStudies = [
  {
    title: "Semi-Automatic Washer Cutting Machine",
    problem:
      "The client needed a repeatable washer cutting workflow that reduced manual variation and improved throughput.",
    solution:
      "Texawave engineered a semi-automatic machine concept with guided cutting, fixture control, operator-safe ergonomics, and production-ready drawings.",
    deliverables: "Machine design, 3D CAD, assemblies, BOM, fabrication drawings, prototype support.",
    result: "Improved cutting consistency, reduced operator dependency, and a clearer path to batch manufacturing."
  },
  {
    title: "SPM Machine Design and Manufacturing",
    problem:
      "A manufacturing team required a custom special purpose machine for a constrained industrial operation.",
    solution:
      "We developed the mechanical architecture, selected core components, prepared manufacturing documentation, and supported build coordination.",
    deliverables: "SPM design, motion layout, component selection, manufacturing drawings, production support.",
    result: "A purpose-built machine aligned to the client process, footprint, and cost objectives."
  },
  {
    title: "Sterilization Performance Improvement",
    problem:
      "A medical-adjacent product needed better sterilization performance without overhauling the entire product platform.",
    solution:
      "Texawave reviewed the system architecture, identified performance gaps, and refined mechanical and electrical factors affecting sterilization output.",
    deliverables: "Engineering review, design optimization, test support, documentation, implementation guidance.",
    result: "Higher performance reliability and a more controlled validation path for production teams."
  }
];

export const reasons = [
  ["Certified Engineers", BadgeCheck],
  ["Dedicated Support", Handshake],
  ["Cost Efficient Solutions", Gauge],
  ["AI-Driven Solutions", BrainCircuit],
  ["Transparent Project Communication", Globe2],
  ["End-to-End Execution", Layers3],
  ["Subject Matter Experts", ShieldCheck],
  ["Custom Build Approach", PenTool]
] as const;

export interface Client {
  name: string;
  logo: string;
}

export const clients: Client[] = [
  { name: "HBT", logo: "/hbt_logo.webp" },
  { name: "AtumX", logo: "/atumX_logo.webp" },
  { name: "IHL", logo: "/ihl_logo.webp" },
  { name: "R2D2 IIT Madras", logo: "/R2D2_logo.webp" },
  { name: "Auckam Technologies", logo: "/auckum_logo.webp" },
  { name: "Srushty", logo: "/srushty_logo.webp" },
  { name: "FCS", logo: "/fcs_logo.webp" },
  { name: "United Industries", logo: "/united_industries_logo.webp" },
  { name: "Salem Technologies", logo: "/salem_technologies_logo.webp" },
  { name: "Phoenix Medical", logo: "/Phoenix_logo.webp" }
];

export const testimonials = [
  {
    quote:
      "Working with Texawave has been a great experience. Their custom ERP solution streamlined our operations, improved process visibility, and reduced manual work. In addition, their support in mechanical projects and PLC automation helped us improve productivity and efficiency across our manufacturing processes. Texawave has been a reliable partner, consistently delivering solutions that add real value to our business.",
    name: "FCS Fluoro Carbon Seals",
    designation: "Industrial Manufacturing Solutions",
    company: "FCS Fluoro Carbon Seals",
    initials: "FC",
    logo: "/fcs_logo.webp",
    accentColor: "#8CC63F",
    tags: ["Custom ERP", "Mechanical Projects", "PLC Automation"]
  },
  {
    quote:
      "We’ve had an excellent experience working with TexaWave Innovations for our component sourcing needs across India. Their ability to provide high-quality components at competitive prices is truly impressive. The team is professional, responsive, and consistently goes the extra mile to meet our requirements. We highly recommend TexaWave Innovations to organizations seeking reliable and cost-effective sourcing solutions.",
    name: "Prabakaran",
    designation: "Co-Founder & COO",
    company: "AtumX Innovations Pvt. Ltd.",
    initials: "P",
    logo: "/atumX_logo.webp",
    accentColor: "#14B8A6",
    tags: ["Component Sourcing", "Electronics Procurement", "Supply Chain Support", "Vendor Management"]
  },
  {
    quote:
      "Working with TexaWave Innovations for manufacturing our prototype was an excellent experience. Their attention to detail, technical expertise, and commitment to quality resulted in a final product that exceeded our expectations. The team was professional, responsive, and supportive throughout the development process. We highly recommend TexaWave Innovations for product design, prototyping, and manufacturing solutions.",
    name: "Vishnu S",
    designation: "Automation Engineering Mechanical Packaging – India",
    company: "HBT Engineering Pvt. Ltd.",
    initials: "VS",
    logo: "/hbt_logo.webp",
    accentColor: "#8CC63F",
    tags: ["Product Design", "Prototype Development", "Manufacturing Support"]
  },
  {
    quote:
      "Working with TexaWave Innovations was a positive experience. They understood our requirements well, provided accurate drawings, and delivered them within the agreed timeline. The team was friendly, approachable, and professional throughout the project.",
    name: "Karthick",
    designation: "Engineering Lead",
    company: "Inlab Equipments",
    initials: "K",
    logo: "/lab_equiment.webp",
    accentColor: "#14B8A6",
    tags: ["Mechanical Design", "Engineering Drawings", "Product Development Support"]
  },
  {
    quote:
      "We've had a great experience working with TexaWave Innovations. Their customer service is excellent, and the team consistently delivers with impressive speed and reliability. The lead times were significantly shorter compared to other vendors, helping us meet our project requirements efficiently. We look forward to continuing our partnership with TexaWave.",
    name: "Anisha A",
    designation: "Procurement Manager",
    company: "Sourcing Partner",
    initials: "AA",
    logo: "/source_partner.webp",
    accentColor: "#8CC63F",
    tags: ["Component Sourcing", "Procurement Support", "Fast Turnaround", "Supply Chain Solutions"]
  },
  {
    quote:
      "Working with TexaWave Innovations on our PCB assembly project was a great experience. Their professionalism, attention to detail, and commitment to quality were evident throughout the project. The team consistently went above and beyond to meet our requirements, and their expertise contributed significantly to the successful outcome. We highly recommend TexaWave Innovations to organizations seeking reliable manufacturing and engineering support.",
    name: "M. Rajkumar",
    designation: "Senior Procurement Engineer",
    company: "Salem Technologies Private Limited",
    initials: "MR",
    logo: "/salem_technologies_logo.webp",
    accentColor: "#14B8A6",
    tags: ["PCB Assembly", "Electronics Manufacturing", "Procurement Support", "Engineering Services"]
  },
  {
    quote:
      "We have purchased components from TexaWave Innovations, and we are very pleased with the overall experience. The product quality met our expectations, and the team was responsive and helpful in addressing our requirements. We were particularly impressed by the wide range of components available, which made sourcing the right parts for our project both convenient and efficient. We look forward to continuing our partnership with TexaWave Innovations.",
    name: "Arun Babu R.S",
    designation: "Engineering",
    company: "United Industries Plastic Pvt. Ltd.",
    initials: "AB",
    logo: "/united_industries_logo.webp",
    accentColor: "#8CC63F",
    tags: ["Electronic Components", "Industrial Components", "Procurement Support", "Component Sourcing"]
  },
  {
    quote:
      "We partnered with TexaWave Innovations to support our product development initiatives, and the experience has been excellent. Their team successfully developed our web dashboard and mobile applications for both Android and iOS platforms, delivering solutions that aligned perfectly with our requirements. Their expertise in electrical product design also added significant value to our development process. The team was responsive, technically skilled, and committed to delivering high-quality results. We appreciate their professionalism and look forward to continuing our partnership.",
    name: "Shape 3DTech",
    designation: "Product Development Partners",
    company: "Shape 3DTech",
    initials: "S3",
    logo: "/shape3d_tech.webp",
    accentColor: "#14B8A6",
    tags: ["Web Dashboard Development", "Android App Development", "iOS App Development", "Electrical Product Design"]
  }
];


export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage: string;
  readTime: string;
  viewCount: number;
  authorPhoto: string;
  name: string;
  organization: string;
  submittedAt: string;
  isFeatured?: boolean;
}

export const blogPosts: BlogPost[] = [];

export const stats = [
  { value: 50, suffix: "+", label: "Projects Delivered" },
  { value: 98, suffix: "%", label: "Happy clients" },
  { value: 24, suffix: "", label: "Clutch Reviews" },
  { value: 4.9, suffix: "/5", label: "Average Rating" }
];

export const capabilityIcons = [Blocks, Cpu, Factory, MonitorSmartphone, Sparkles, Cable];


