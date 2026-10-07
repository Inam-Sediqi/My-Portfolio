// All editable content lives here. Replace links/images with your own.
import cvFile from "@/assets/files/Inamullah-Sediqi-CV.pdf";
import htmlIcon from "@/assets/icons/html-5.svg";
import cssIcon from "@/assets/icons/css3-original.svg";
import javascriptIcon from "@/assets/icons/javascript.svg";
import gitIcon from "@/assets/icons/git.svg";
import githubIcon from "@/assets/icons/github-original.svg";
import bootstrapIcon from "@/assets/icons/bootstrap-original.svg";
import reactIcon from "@/assets/icons/React.svg";
import nextIcon from "@/assets/icons/next.svg";
import wordpressIcon from "@/assets/icons/wordpress.svg";
import dataIcon from "@/assets/icons/dashboard.svg";
import networkIcon from "@/assets/icons/Network.svg";
import hotelImage from "@/assets/images/Hotel.png";
import novaImage from "@/assets/images/NOVA.png";
import bigStoreImage from "@/assets/images/bigstore-preview.png";
import dashboardImage from "@/assets/images/dashboard.png";
import constructionImage from "@/assets/images/construction.png";

const projectUrl = (path: string) =>
  `${import.meta.env.BASE_URL}${path.split("/").map(encodeURIComponent).join("/")}`;

export const profile = {
  name: "Inam Sediqi",
  short: "Inam Sediqi",
  role: "Frontend Developer",
  email: "inam444sediqi@gmail.com",
  whatsapp: "93775491744", // international format, no + or spaces
  // Free key from https://web3forms.com (enter your Gmail, they email you the key).
  // While empty, "Send message" opens the visitor's email app instead.
  web3formsKey: "",
  cv: cvFile,
  github: "https://github.com/Inam-Sediqi",
};

export const skills = [
  {
    name: "HTML",
    icon: htmlIcon,
    text: "Clean, semantic structure that is accessible and easy to maintain.",
  },
  {
    name: "CSS",
    icon: cssIcon,
    text: "Polished layouts, color, spacing and modern responsive styling.",
  },
  {
    name: "JavaScript",
    icon: javascriptIcon,
    text: "Interactivity and smooth experiences with clean front-end logic.",
  },
  { name: "Git", icon: gitIcon, text: "Version control to track updates and keep work organized." },
  {
    name: "GitHub",
    icon: githubIcon,
    text: "Sharing projects, managing history and collaborating simply.",
  },
  {
    name: "Bootstrap",
    icon: bootstrapIcon,
    text: "Fast, consistent UI components that speed up development.",
  },
];

export const learning = [
  { name: "React", icon: reactIcon },
  { name: "React Native", icon: reactIcon },
  { name: "Tailwind CSS", icon: nextIcon },
  { name: "WordPress", icon: wordpressIcon },
  { name: "Databases", icon: dataIcon },
  { name: "Cisco / CCNA", icon: networkIcon },
];

export const services = [
  {
    title: "Frontend Web Development",
    text: "Responsive, modern websites with HTML, CSS, JavaScript and Bootstrap.",
  },
  {
    title: "Responsive Web Design",
    text: "Sites that work smoothly on mobile, tablet and desktop.",
  },
  {
    title: "Website UI Development",
    text: "Turning Figma designs or concepts into clean, functional interfaces.",
  },
  {
    title: "Landing Pages",
    text: "Professional pages for businesses, products, services and personal brands.",
  },
  {
    title: "Redesign & Improvement",
    text: "Modernizing existing sites — layout, responsiveness and UX.",
  },
  {
    title: "Website Maintenance",
    text: "Content updates, UI fixes, new sections and ongoing changes.",
  },
];

export const futureServices = [
  { title: "WordPress Development", status: "Near future" },
  { title: "React Web Apps", status: "Learning" },
  { title: "Full-Stack Development", status: "Learning" },
  { title: "API Integration", status: "Learning" },
  { title: "Dashboard Development", status: "Learning" },
  { title: "Custom Web Applications", status: "Later" },
];

// Replace `image` and `url` with your real screenshot + live link.
export const projects = [
  {
    title: "STRUCTURA",
    category: "Construction / Engineering",
    text: "An engineering business site with services, projects, a cost estimator, process, FAQ and contact flow.",
    tags: ["Estimator", "FAQ", "Testimonials"],
    stack: ["HTML5", "CSS3", "JS"],
    image: constructionImage,
    url: projectUrl("projects/Construction Engineer/contruction.html"),
  },
  {
    title: "NOVA",
    category: "Fashion Storefront",
    text: "A modern fashion store with product discovery, filtering, sorting, wishlist and cart interfaces.",
    tags: ["Filtering", "Cart", "Wishlist"],
    stack: ["HTML5", "CSS3", "JS"],
    image: novaImage,
    url: projectUrl("projects/NOVA/NOVA.html"),
  },
  {
    title: "Sunshine Hotel",
    category: "Hotel / Hospitality",
    text: "A luxury hotel website with premium presentation and an interactive booking and search experience.",
    tags: ["Booking UI", "Room Selection", "Guests"],
    stack: ["HTML5", "CSS3", "JS"],
    image: hotelImage,
    url: projectUrl("projects/HOTEL/SunShine.html"),
  },
  {
    title: "FinTrack",
    category: "Finance Dashboard",
    text: "Track income, expenses and savings with persistent storage, analytics, charts and CSV export.",
    tags: ["Charts", "Transactions", "CSV Export"],
    stack: ["HTML5", "CSS3", "JS"],
    image: dashboardImage,
    url: projectUrl("projects/FinTrack/Dashboard.html"),
  },
  {
    title: "BigStore",
    category: "E-commerce / Online Store",
    text: "A responsive e-commerce interface with product presentation, promotional areas and structured storefront navigation.",
    tags: ["Product Cards", "Responsive UI", "Newsletter"],
    stack: ["HTML5", "CSS3"],
    image: bigStoreImage,
    url: projectUrl("projects/Store/BigStore_Cleaned.html"),
  },
];

export const nav = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "journey", label: "Journey" },
  { id: "services", label: "Services" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export const journey = [
  {
    when: "Start",
    title: "First lines of HTML & CSS",
    text: "Learned semantic structure, layout and styling by rebuilding real websites.",
    done: true,
  },
  {
    when: "Now",
    title: "Computer Science · Kateb University",
    text: "Second-year student building a solid base in programming, databases and IT.",
    done: true,
  },
  {
    when: "Now",
    title: "5 frontend projects shipped",
    text: "E-commerce, fashion, hotel booking, finance dashboard and a construction business site.",
    done: true,
  },
  {
    when: "Next",
    title: "React, React Native & Tailwind",
    text: "Moving into component-driven web apps and mobile applications.",
    done: false,
  },
  {
    when: "Future",
    title: "Full-stack + CCNA",
    text: "Backends, APIs and databases — plus Cisco networking certification.",
    done: false,
  },
];

export const process = [
  { title: "Discover", text: "We talk about your goals, audience and the pages you need." },
  { title: "Design", text: "I plan the layout and look — or turn your Figma design into a plan." },
  { title: "Build", text: "Clean, responsive, accessible code that works on every screen." },
  { title: "Launch", text: "Testing, final polish and going live — plus help after launch." },
];

export const faqs = [
  {
    q: "What kind of websites can you build?",
    a: "Landing pages, business sites, portfolios, online store interfaces and dashboards — all responsive and mobile-first.",
  },
  {
    q: "How long does a website take?",
    a: "A landing page usually takes a few days; a multi-section site 1–3 weeks depending on content.",
  },
  {
    q: "Can you redesign my existing website?",
    a: "Yes — I can modernize the look, improve mobile layouts and make it faster and easier to use.",
  },
  {
    q: "How do we communicate?",
    a: "Whatever is easiest for you — WhatsApp or email. I reply quickly and share progress often.",
  },
];
