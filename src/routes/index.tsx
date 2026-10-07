import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { z } from "zod";
import emailIcon from "@/assets/icons/email.svg";
import whatsappIcon from "@/assets/icons/whatsapp.svg";
import themeIcon from "@/assets/icons/header-icon.svg";
import {
  profile,
  skills,
  learning,
  services,
  futureServices,
  projects,
  nav,
  journey,
  process,
  faqs,
} from "@/data/portfolio";

const Hero3D = lazy(() => import("@/components/Hero3D"));

const TITLE = "Inam Sediqi — Frontend Developer Portfolio";
const DESC =
  "CS student and frontend developer building fast, responsive and accessible websites — with 3D, motion and modern web technology.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Index,
});

/* Three.js can't read CSS oklch colors, so the 3D scene gets hex per theme */
const SCENE_COLORS = {
  dark: { primary: "#f08a5d", accent: "#6fd3d0" },
  light: { primary: "#e0623a", accent: "#2a9d9a" },
};

type Theme = "dark" | "light";

function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");
  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);
  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* ignore */
    }
    setTheme(next);
  };
  return { theme, toggle };
}

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.8, ease: [0.22, 0.61, 0.36, 1] as const },
};

function Index() {
  const { theme, toggle } = useTheme();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });
  return (
    <>
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-50 h-1 origin-left bg-gradient-to-r from-primary to-accent"
      />
      <MovingBackground />
      <Header theme={theme} onToggle={toggle} />
      <main className="relative">
        <Hero theme={theme} />
        <About />
        <Skills />
        <Journey />
        <Services />
        <Process />
        <Projects />
        <Faq />
        <CtaBand />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

function MovingBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="aurora-blob drift-a -left-[10vw] -top-[10vh] size-[55vmax] bg-blob-1" />
      <div className="aurora-blob drift-b -right-[15vw] top-[20vh] size-[50vmax] bg-blob-2" />
      <div className="aurora-blob drift-c bottom-[-20vh] left-[20vw] size-[45vmax] bg-blob-3" />
      <div className="grid-lines absolute inset-0" />
      <div className="noise absolute inset-0" />
    </div>
  );
}

/* ---------- Interactive helpers ---------- */

function spot(e: MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    spot(e);
    const el = ref.current;
    if (!el || window.matchMedia("(hover: none)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(0)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={`glass spotlight rounded-3xl transition-transform duration-300 ease-out [transform-style:preserve-3d] ${className}`}
    >
      {children}
    </div>
  );
}

function Magnetic({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  return (
    <span
      ref={ref}
      className="inline-block transition-transform duration-300"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
      }}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
    >
      {children}
    </span>
  );
}

const ROLES = ["Frontend Developer", "UI Engineer", "CS Student", "Future Full-Stack Dev"];

function Typewriter() {
  const [state, setState] = useState({ i: 0, n: 0, del: false });
  useEffect(() => {
    const word = ROLES[state.i] ?? "";
    let delay = state.del ? 40 : 80;
    if (!state.del && state.n === word.length) delay = 1600;
    const t = setTimeout(() => {
      setState((s) => {
        const w = ROLES[s.i] ?? "";
        if (!s.del && s.n === w.length) return { ...s, del: true };
        if (s.del && s.n === 0) return { i: (s.i + 1) % ROLES.length, n: 0, del: false };
        return { ...s, n: s.n + (s.del ? -1 : 1) };
      });
    }, delay);
    return () => clearTimeout(t);
  }, [state]);
  return (
    <span className="font-mono text-primary">
      {(ROLES[state.i] ?? "").slice(0, state.n)}
      <span className="caret">▍</span>
    </span>
  );
}

function SectionHead({ kicker, title, text }: { kicker: string; title: string; text?: string }) {
  return (
    <motion.header {...fadeUp} className="mb-12 max-w-2xl">
      <p className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-accent">
        <span className="h-px w-8 bg-accent" /> {kicker}
      </p>
      <h2 className="mt-4 text-4xl font-bold text-balance sm:text-5xl">{title}</h2>
      {text && <p className="mt-4 text-lg text-pretty text-muted-foreground">{text}</p>}
    </motion.header>
  );
}

/* ---------- Header ---------- */

function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  const dark = theme === "dark";
  return (
    <button
      onClick={onToggle}
      aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
      className="glass relative flex h-10 w-[4.5rem] shrink-0 items-center rounded-full p-1"
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className={`grid size-8 place-items-center rounded-full bg-primary text-primary-foreground ${dark ? "ml-auto" : ""}`}
      >
        <img src={themeIcon} alt="" width={16} height={16} className="size-4" />
      </motion.span>
    </button>
  );
}

function Header({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    document.querySelectorAll("main section[id]").forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);
  return (
    <header className="fixed inset-x-0 top-3 z-40 px-3">
      <nav
        aria-label="Main"
        className="glass mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-full px-4 py-2 md:flex md:justify-between"
      >
        <a href="#home" className="truncate font-display text-xl font-bold">
          inam<span className="text-primary">.</span>dev
        </a>
        <div className="flex items-center gap-2 md:order-last">
          <ThemeToggle theme={theme} onToggle={onToggle} />
          <button
            className="glass grid size-10 place-items-center rounded-full md:hidden"
            aria-expanded={open}
            aria-controls="nav-menu"
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="relative block h-3 w-4">
              <span
                className={`absolute left-0 h-0.5 w-4 bg-foreground transition-all ${open ? "top-1.5 rotate-45" : "top-0"}`}
              />
              <span
                className={`absolute left-0 h-0.5 w-4 bg-foreground transition-all ${open ? "top-1.5 -rotate-45" : "top-3"}`}
              />
            </span>
          </button>
        </div>
        <ul
          id="nav-menu"
          className={`${open ? "flex" : "hidden"} glass col-span-2 flex-col gap-1 rounded-2xl p-2 md:flex md:flex-row md:border-0 md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none`}
        >
          {nav.map((n) => (
            <li key={n.id} className="relative">
              <a
                href={`#${n.id}`}
                onClick={() => setOpen(false)}
                className={`relative z-10 block rounded-full px-4 py-2 text-sm font-semibold transition-colors ${active === n.id ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {n.label}
              </a>
              {active === n.id && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

/* ---------- Sections ---------- */

function Hero({ theme }: { theme: Theme }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const colors = SCENE_COLORS[theme];
  return (
    <section id="home" ref={ref} className="relative flex min-h-[100svh] items-center pt-24">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-6 px-5 md:grid-cols-2">
        <motion.div style={{ y, opacity }} className="relative z-10 order-2 md:order-1">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold"
          >
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-whatsapp opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-whatsapp" />
            </span>
            Available for projects
          </motion.p>
          <h1 className="mt-6 text-5xl font-bold leading-[0.95] sm:text-6xl lg:text-7xl">
            {["Hi, I'm", "Inam Sediqi."].map((w, wi) => (
              <span key={w} className="block [perspective:800px]" aria-label={w}>
                {Array.from(w).map((ch, ci) => (
                  <motion.span
                    key={ci}
                    aria-hidden
                    className={`inline-block origin-bottom whitespace-pre ${wi === 1 ? "text-primary" : ""}`}
                    initial={{ rotateX: -95, opacity: 0, y: 30, filter: "blur(8px)" }}
                    animate={{ rotateX: 0, opacity: 1, y: 0, filter: "blur(0px)" }}
                    whileHover={{ y: -10, color: "var(--accent)", transition: { duration: 0.15 } }}
                    transition={{
                      delay: 0.2 + wi * 0.25 + ci * 0.04,
                      type: "spring",
                      stiffness: 180,
                      damping: 14,
                    }}
                  >
                    {ch}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>
          <p className="mt-5 h-8 text-xl sm:text-2xl">
            <Typewriter />
          </p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-4 max-w-md text-lg text-pretty text-muted-foreground"
          >
            I craft fast, responsive and accessible websites — turning ideas into interfaces people
            love to use.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Magnetic>
              <a href="#projects" className="btn-primary">
                View my work
              </a>
            </Magnetic>
            <Magnetic>
              <a href={profile.cv} download className="btn-ghost">
                Download CV
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>
        <div className="relative order-1 h-[42svh] min-h-[300px] md:order-2 md:h-[600px]">
          <ClientOnly fallback={<div className="size-full" />}>
            <Suspense fallback={<div className="size-full" />}>
              <Hero3D primary={colors.primary} accent={colors.accent} />
            </Suspense>
          </ClientOnly>
        </div>
      </div>
      <a
        href="#about"
        aria-label="Scroll down"
        className="absolute bottom-6 left-1/2 hidden h-12 w-7 -translate-x-1/2 justify-center rounded-full border-2 border-muted-foreground/50 pt-2 md:flex"
      >
        <motion.span
          animate={{ y: [0, 14, 0] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
          className="h-2 w-1 rounded-full bg-primary"
        />
      </a>
    </section>
  );
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min((t - start) / 1200, 1);
        setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return (
    <span ref={ref}>
      {String(n).padStart(2, "0")}
      {suffix}
    </span>
  );
}

function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24">
      <SectionHead kicker="01 · About" title="Building skills. Creating solutions." />
      <div className="grid gap-5 md:grid-cols-6">
        <motion.div {...fadeUp} className="md:col-span-4">
          <TiltCard className="h-full space-y-4 p-7 text-lg text-pretty text-muted-foreground sm:p-9">
            <p>
              I'm <strong className="text-foreground">{profile.name}</strong>, a second-year
              Computer Science student at Kateb University with a strong interest in software
              development, modern web technologies and IT.
            </p>
            <p>
              I'm building my foundation in JavaScript, WordPress, databases and modern frontend
              development — I love both designing interfaces and solving the problems behind them.
            </p>
            <p>
              My goal: websites and apps for e-commerce, restaurants, travel agencies, SaaS products
              and other modern businesses.
            </p>
          </TiltCard>
        </motion.div>
        <div className="grid grid-cols-2 gap-5 md:col-span-2 md:grid-cols-1">
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
            <TiltCard className="h-full p-6">
              <p className="font-display text-5xl font-bold text-gradient">
                <Counter to={5} />
              </p>
              <p className="mt-1 text-sm text-muted-foreground">Projects built</p>
            </TiltCard>
          </motion.div>
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }}>
            <TiltCard className="h-full p-6">
              <p className="font-display text-5xl font-bold text-gradient">
                <Counter to={7} suffix="+" />
              </p>
              <p className="mt-1 text-sm text-muted-foreground">Technologies</p>
            </TiltCard>
          </motion.div>
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.3 }}
            className="col-span-2 md:col-span-1"
          >
            <TiltCard className="h-full p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-accent">
                IT & Networking
              </p>
              <p className="mt-2 font-semibold">Cisco foundation → CCNA → CCNP</p>
            </TiltCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section id="skills" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHead
          kicker="02 · Toolbox"
          title="Skills & technologies"
          text="The tools I use every day to turn ideas into fast, clean, responsive websites."
        />
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {skills.map((s, i) => (
            <motion.li
              key={s.name}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.06 }}
            >
              <TiltCard className="group h-full p-5 sm:p-7">
                <div className="grid size-14 place-items-center rounded-2xl bg-secondary [transform:translateZ(40px)]">
                  <img
                    src={s.icon}
                    alt=""
                    width={32}
                    height={32}
                    loading="lazy"
                    className="size-8 transition-transform duration-500 group-hover:rotate-[360deg]"
                  />
                </div>
                <h3 className="mt-5 text-xl font-bold">{s.name}</h3>
                <p className="mt-2 hidden text-sm text-muted-foreground sm:block">{s.text}</p>
              </TiltCard>
            </motion.li>
          ))}
        </ul>
        <motion.h3
          {...fadeUp}
          className="mt-16 font-mono text-xs uppercase tracking-[0.25em] text-accent"
        >
          Next on my roadmap
        </motion.h3>
      </div>
      <div className="mt-5 overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <ul className="marquee flex w-max gap-4">
          {[...learning, ...learning, ...learning].map((l, i) => (
            <li
              key={i}
              aria-hidden={i >= learning.length}
              className="glass flex items-center gap-3 rounded-full px-5 py-3 font-semibold"
            >
              <img src={l.icon} alt="" width={22} height={22} loading="lazy" className="size-5" />
              {l.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24">
      <SectionHead
        kicker="03 · Services"
        title="What I can do for you"
        text="Modern, responsive, user-friendly websites that help businesses and people grow online."
      />
      <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <motion.li
            key={s.title}
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: (i % 3) * 0.08 }}
          >
            <TiltCard className="group flex h-full flex-col p-7">
              <span className="font-display text-6xl font-bold text-foreground/10 transition-colors group-hover:text-primary/40">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-xl font-bold">{s.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{s.text}</p>
              <a href="#contact" className="mt-5 text-sm font-bold text-primary">
                Let's talk
              </a>
            </TiltCard>
          </motion.li>
        ))}
      </ol>
      <motion.aside {...fadeUp} className="glass mt-8 rounded-3xl p-7">
        <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-accent">Coming soon</h3>
        <ul className="mt-4 flex flex-wrap gap-2">
          {futureServices.map((f) => (
            <li
              key={f.title}
              className="rounded-full border bg-secondary/60 px-4 py-2 text-sm font-semibold"
            >
              {f.title} <span className="ml-1 font-normal text-muted-foreground">· {f.status}</span>
            </li>
          ))}
        </ul>
      </motion.aside>
    </section>
  );
}

function ProjectCard({ p, i }: { p: (typeof projects)[number]; i: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  return (
    <motion.li ref={ref} {...fadeUp} className={i === 0 ? "md:col-span-2" : ""}>
      <TiltCard className="group h-full overflow-hidden">
        <article>
          <a
            href={p.url}
            target="_blank"
            rel="noreferrer"
            className="relative block overflow-hidden"
          >
            <motion.img
              style={{ y: imgY }}
              src={p.image}
              alt={`${p.title} project screenshot`}
              loading="lazy"
              width={1200}
              height={750}
              className={`w-full scale-110 object-cover transition-[scale] duration-700 group-hover:scale-[1.18] ${i === 0 ? "aspect-[16/8]" : "aspect-[16/10]"}`}
            />
            <span className="glass absolute left-4 top-4 rounded-full px-3 py-1 font-mono text-xs">
              {String(i + 1).padStart(2, "0")} / 05
            </span>
          </a>
          <div className="p-6 sm:p-8">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">{p.category}</p>
            <h3 className="mt-2 text-3xl font-bold">{p.title}</h3>
            <p className="mt-3 text-pretty text-muted-foreground">{p.text}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {[...p.tags, ...p.stack].map((t) => (
                <li key={t} className="rounded-full bg-secondary px-3 py-1 font-mono text-[11px]">
                  {t}
                </li>
              ))}
            </ul>
            <a
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost mt-6 !py-2.5 text-sm"
            >
              View project
            </a>
          </div>
        </article>
      </TiltCard>
    </motion.li>
  );
}

function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24">
      <SectionHead
        kicker="04 · Selected work"
        title="Projects built while learning & creating"
        text="Frontend projects where I experiment with interfaces, layouts and real-world experiences."
      />
      <ul className="grid gap-6 md:grid-cols-2">
        {projects.map((p, i) => (
          <ProjectCard key={p.title} p={p} i={i} />
        ))}
      </ul>
    </section>
  );
}

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  message: z.string().trim().min(5, "Message is too short").max(1000),
});
type Errors = { name?: string; email?: string; message?: string };

function Contact() {
  const [errors, setErrors] = useState<Errors>({});
  const via = useRef<"email" | "whatsapp">("email");

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const res = schema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (!res.success) {
      const errs: Errors = {};
      res.error.issues.forEach((i) => (errs[i.path[0] as keyof Errors] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    const { name, email, message } = res.data;
    const body = `Hi Inam, I'm ${name} (${email}).\n\n${message}`;
    if (via.current === "whatsapp") {
      window.open(
        `https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(body)}`,
        "_blank",
        "noopener",
      );
      return;
    }
    // No access key yet → fall back to the visitor's email app
    if (!profile.web3formsKey) {
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(`Portfolio message from ${name}`)}&body=${encodeURIComponent(body)}`;
      return;
    }
    // Web3Forms delivers the message straight to your Gmail — no domain needed
    setStatus("sending");
    try {
      const r = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: profile.web3formsKey,
          subject: `New portfolio message from ${name}`,
          from_name: "Portfolio contact form",
          name,
          email,
          message,
        }),
      });
      const json = (await r.json()) as { success?: boolean };
      if (!json.success) throw new Error("failed");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const field =
    "peer mt-2 w-full rounded-2xl border bg-input px-4 py-3.5 outline-none transition-all focus:border-primary focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_20%,transparent)]";

  return (
    <section id="contact" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24">
      <SectionHead
        kicker="05 · Contact"
        title="Let's build something great together."
        text="Have a project, idea or opportunity? Reach me by email or WhatsApp — I'd love to hear from you."
      />
      <div className="grid gap-6 md:grid-cols-[1fr_1.5fr]">
        <motion.address {...fadeUp} className="grid content-start gap-4 not-italic">
          <TiltCard className="p-0">
            <a href={`mailto:${profile.email}`} className="flex min-w-0 items-center gap-4 p-6">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary">
                <img src={emailIcon} alt="" width={22} height={22} className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs uppercase tracking-widest text-muted-foreground">
                  Email
                </span>
                <span className="block truncate font-bold">{profile.email}</span>
              </span>
            </a>
          </TiltCard>
          <TiltCard className="p-0">
            <a
              href={`https://wa.me/${profile.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 p-6"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-whatsapp">
                <img src={whatsappIcon} alt="" width={22} height={22} className="size-5" />
              </span>
              <span>
                <span className="block text-xs uppercase tracking-widest text-muted-foreground">
                  WhatsApp
                </span>
                <span className="block font-bold">Chat with me directly</span>
              </span>
            </a>
          </TiltCard>
        </motion.address>
        <motion.form
          {...fadeUp}
          noValidate
          onSubmit={send}
          onMouseMove={spot}
          className="glass spotlight grid gap-5 rounded-3xl p-6 sm:p-9"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-semibold">
              Your name
              <input
                name="name"
                autoComplete="name"
                placeholder="Jane Doe"
                className={field}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <span className="mt-1 block text-xs text-destructive">{errors.name}</span>
              )}
            </label>
            <label className="text-sm font-semibold">
              Your email
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@email.com"
                className={field}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <span className="mt-1 block text-xs text-destructive">{errors.email}</span>
              )}
            </label>
          </div>
          <label className="text-sm font-semibold">
            Your message
            <textarea
              name="message"
              rows={5}
              placeholder="Tell me about your project…"
              className={`${field} resize-none`}
              aria-invalid={!!errors.message}
            />
            {errors.message && (
              <span className="mt-1 block text-xs text-destructive">{errors.message}</span>
            )}
          </label>
          {status === "sent" && (
            <p role="status" className="rounded-2xl bg-whatsapp/15 px-4 py-3 text-sm font-semibold">
              Thanks! Your message was sent — I'll reply soon.
            </p>
          )}
          {status === "error" && (
            <p
              role="alert"
              className="rounded-2xl bg-destructive/15 px-4 py-3 text-sm font-semibold"
            >
              Something went wrong. Please try WhatsApp or email me directly.
            </p>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="submit"
              disabled={status === "sending"}
              onClick={() => (via.current = "email")}
              className="btn-primary"
            >
              {status === "sending" ? "Sending…" : "Send message"}
            </button>
            <button
              type="submit"
              onClick={() => (via.current = "whatsapp")}
              className="btn-primary !bg-whatsapp [box-shadow:0_14px_40px_-14px_var(--whatsapp)]"
            >
              Send via WhatsApp
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative mx-auto max-w-6xl px-5 pb-8">
      <div className="glass flex flex-col gap-4 rounded-3xl p-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 {profile.name}. Crafted with React, Three.js & Motion.</p>
        <ul className="flex gap-5 font-semibold">
          <li>
            <a href={profile.github} className="hover:text-primary">
              GitHub
            </a>
          </li>
          <li>
            <a href={`mailto:${profile.email}`} className="hover:text-primary">
              Email
            </a>
          </li>
          <li>
            <a href="#home" className="hover:text-primary">
              Top ↑
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}

function Journey() {
  return (
    <section id="journey" className="mx-auto max-w-4xl scroll-mt-24 px-5 py-24">
      <SectionHead
        kicker="Journey"
        title="From first tag to full-stack"
        text="Where I've been, where I am now, and where I'm heading."
      />
      <ol className="relative ml-3 border-l-2 border-dashed border-primary/40">
        {journey.map((j, i) => (
          <motion.li
            key={j.title}
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: i * 0.08 }}
            className="relative mb-8 pl-8 last:mb-0"
          >
            <span
              className={`absolute -left-[11px] top-6 grid size-5 place-items-center rounded-full ${j.done ? "bg-primary" : "border-2 border-primary bg-background"}`}
            >
              {j.done && (
                <span className="size-2 animate-ping rounded-full bg-primary-foreground" />
              )}
            </span>
            <TiltCard className="p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-accent">{j.when}</p>
              <h3 className="mt-1 text-xl font-bold">{j.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{j.text}</p>
            </TiltCard>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}

function Process() {
  return (
    <section id="process" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24">
      <SectionHead kicker="How I work" title="A simple process, a solid result" />
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {process.map((p, i) => (
          <motion.li
            key={p.title}
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: i * 0.1 }}
          >
            <TiltCard className="group relative h-full overflow-hidden p-7">
              <span className="absolute -right-3 -top-6 font-display text-[7rem] font-bold leading-none text-foreground/5 transition-transform duration-500 group-hover:-translate-y-2 group-hover:text-primary/15">
                {i + 1}
              </span>
              <span className="grid size-12 place-items-center rounded-2xl bg-primary font-display text-lg font-bold text-primary-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-xl font-bold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
            </TiltCard>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-5 py-24">
      <SectionHead kicker="FAQ" title="Questions people often ask" />
      <ul className="grid gap-3">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <motion.li key={f.q} {...fadeUp} className="glass overflow-hidden rounded-2xl">
              <h3>
                <button
                  className="flex w-full items-center justify-between gap-4 p-5 text-left font-bold"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  {f.q}
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary text-xl text-primary"
                  >
                    +
                  </motion.span>
                </button>
              </h3>
              <motion.div
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-5 text-muted-foreground">{f.a}</p>
              </motion.div>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}

function CtaBand() {
  return (
    <section aria-label="Start a project" className="overflow-hidden py-16">
      <div className="-rotate-2 bg-primary py-5 text-primary-foreground">
        <p className="marquee flex w-max gap-10 whitespace-nowrap font-display text-4xl font-bold sm:text-6xl">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} aria-hidden={i > 0}>
              Let's work together
            </span>
          ))}
        </p>
      </div>
      <div className="rotate-1 bg-accent py-4 text-accent-foreground">
        <p className="marquee flex w-max gap-10 whitespace-nowrap font-mono text-lg [animation-direction:reverse]">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} aria-hidden>
              HTML · CSS · JavaScript · React · Responsive ·{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
