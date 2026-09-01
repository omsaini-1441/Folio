/**
 * ─────────────────────────────────────────────────────────────
 *  SINGLE SOURCE OF TRUTH for all portfolio content.
 *  Every section of the site reads from here.
 * ─────────────────────────────────────────────────────────────
 */

export const profile = {
  firstName: 'Om',
  lastName: 'Saini',
  fullName: 'Om Saini',
  role: 'Full-Stack Developer',
  location: 'Chandigarh, India',
  email: 'omsaini.tech@gmail.com',
  phone: '+91 77194 87204',
  availability: 'Open to opportunities',
  heroLines: ['FULL-STACK', 'DEVELOPER'],
  // Wrap any phrase in *asterisks* to paint it in the accent colour.
  heroBlurb:
    'I ship production *event-driven systems*: message pipelines, real-time sync engines and multi-tenant infrastructure, wrapped in interfaces that feel effortless.',
  aboutIntro:
    "I'm a full-stack developer who lives on the backend and shows off on the frontend. I've architected the backbone of a high-availability ERP platform serving hundreds of APIs, built *real-time sync engines* that shrug off dropped connections, and designed message pipelines where losing an event is simply not an option. These days I'm building *OrchOrb*, a multi-tenant Docker control plane that gives small teams big-league deploy workflows *without the Kubernetes tax*. Give me a hard infrastructure problem and an interface worth obsessing over, and I'm home.",
  socials: [
    { label: 'GitHub', url: 'https://github.com/omsaini-1441' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/om-saini' },
    { label: 'LeetCode', url: 'https://leetcode.com/u/om_saini' },
  ],
}

/**
 * Contact form delivery, powered by https://web3forms.com
 * The key lives in .env as VITE_WEB3FORMS_KEY (and in the Vercel dashboard
 * for production). It is public by design: it only permits sending mail to
 * the address it was issued for. If it is ever missing, the form degrades
 * to opening the visitor's mail app with the message pre-filled.
 */
export const contactFormAccessKey = import.meta.env.VITE_WEB3FORMS_KEY ?? ''

export const stats = [
  { value: 2, suffix: '+', label: 'Years shipping production systems' },
  { value: 330, suffix: '+', label: 'Production APIs designed & shipped' },
  { value: 15, suffix: '+', label: 'Platforms, products & modules delivered' },
  { value: 45, suffix: '%', label: 'Faster load times on my last launch' },
]

export const marqueeItems = [
  'Node.js',
  'NestJS',
  'React',
  'MongoDB',
  'RabbitMQ',
  'Docker',
  'PostgreSQL',
  'TypeScript',
  'Socket.IO',
  'Redis',
]

export const skillGroups = [
  {
    title: 'Backend',
    tagline: 'Event-driven & built to take a punch',
    skills: [
      'Node.js',
      'Express.js',
      'NestJS',
      'TypeScript',
      'REST APIs',
      'WebSockets',
      'Socket.IO',
      'Server-Sent Events',
      'RabbitMQ',
    ],
  },
  {
    title: 'Database',
    tagline: 'Data modeled with intent',
    skills: ['MongoDB', 'Mongoose', 'Redis', 'PostgreSQL', 'TypeORM', 'Change Streams'],
  },
  {
    title: 'Frontend',
    tagline: 'Interfaces that feel alive',
    skills: ['Next.js', 'React.js', 'JavaScript', 'Framer Motion', 'shadcn/ui', 'Tailwind CSS'],
  },
  {
    title: 'Infra & DevOps',
    tagline: 'Shipping is a feature',
    skills: ['Docker', 'dockerode', 'Traefik', 'PM2', 'Nginx', 'CI / CD', 'GHCR'],
  },
]

export const projects = [
  {
    index: '01',
    title: 'OrchOrb',
    category: 'Infra · Multi-Tenant Docker Control Plane',
    year: '2026',
    description:
      'A self-hosted control plane that makes Docker microservices *feel like a managed cloud*. Deploy from an image or a Git repo, route live traffic per organization, promote or roll back versions, scale replicas and watch logs stream in real time. Traefik handles the dynamic routing, NestJS and dockerode keep the runtime honest, and small teams get a deploy experience that feels expensive without the Kubernetes tax.',
    stack: ['NestJS', 'React', 'Traefik', 'PostgreSQL', 'Redis', 'RabbitMQ', 'dockerode'],
    image: '/projects/orchorb-ui.webp',
    accent: '#7c8cff',
  },
  {
    index: '02',
    title: 'Suryacon ERP',
    category: 'Enterprise · Construction Ops Platform',
    year: '2025',
    description:
      'The backend brain of a construction operations platform covering procurement, inventory, resource planning and multi-level billing. Hundreds of APIs power a dozen deeply relational modules with role-based access for the entire org chart. An *offline-first sync layer* keeps field teams working straight through dead zones, and message queues with *dead-letter safety nets* make sure a notification never quietly disappears.',
    stack: ['Node.js', 'Socket.IO', 'MongoDB', 'RabbitMQ', 'PouchDB', 'Redis'],
    image: '/projects/suryacon-ui.webp',
    accent: '#ff8a5c',
  },
  {
    index: '03',
    title: 'TradeSync',
    category: 'FinTech · Real-Time Copy Trading',
    year: '2025',
    description:
      'A real-time pipeline for a live copy trading platform, where every market move has to reach every connected trader instantly. *Multiplexed server-sent events* fan updates out across concurrent sessions while keeping server load impressively light. Built for the moment a market spikes and thousands of screens need to *agree on reality* at the same time.',
    stack: ['Node.js', 'Server-Sent Events', 'React', 'Redis', 'TypeScript'],
    image: '/projects/tradesync-ui.webp',
    accent: '#4de3b8',
  },
  {
    index: '04',
    title: 'Mailcraft',
    category: 'SaaS · Drag-and-Drop Email Studio',
    year: '2025',
    description:
      'A drag-and-drop email studio built in React, with deeply nested component state, live reordering and a *serialization layer* that turns visual layouts into production-ready templates. The kind of interface where *the engineering stays invisible* precisely because the state management underneath is anything but simple.',
    stack: ['React', 'DnD Pangea', 'TypeScript', 'Node.js'],
    image: '/projects/mailcraft-ui.webp',
    accent: '#cf9bff',
  },
]

export const experience = [
  {
    period: '07/2025 - Present',
    role: 'Full-Stack Developer',
    company: 'PSquare Company',
    description:
      'Architecting backend services for Suryacon ERP, a construction ops platform with deeply relational business logic across a dozen domain modules. Built the *offline-first* real-time sync layer, *RabbitMQ pipelines* with retry and dead-letter safety, cascading approval and soft-delete logic across a five-layer task hierarchy, and the data-heavy purchasing stack from cart negotiation to stock ledger.',
  },
  {
    period: '12/2024 - 06/2025',
    role: 'Software Engineer',
    company: 'Cloudberry Tech',
    description:
      'Engineered the real-time pipeline behind a live copy trading platform using multiplexed server-sent events, cutting server load by *nearly a third*. Built a drag-and-drop email editor in React and shipped the company website performance-first, with lazy loading and Framer Motion work that made it measurably faster and *noticeably stickier*.',
  },
]

export const education = {
  degree: 'B.E. Computer Science',
  school: 'Chitkara University, Punjab',
  period: '2020 - 2024',
  detail: 'CGPA 9.81 / 10',
}

export const footerNote = 'Designed & engineered with far too much attention to easing curves.'
