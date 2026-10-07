/* =====================================================
   STRUCTURA ENGINEERING
   JAVASCRIPT
===================================================== */

/* =====================================================
   MOBILE NAVIGATION
===================================================== */

const menuBtn = document.getElementById("menuBtn");
const navbar = document.getElementById("navbar");

menuBtn.addEventListener("click", () => {
  navbar.classList.toggle("open");
});

const navLinks = document.querySelectorAll(".navbar a");

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navbar.classList.remove("open");
  });
});

/* =====================================================
   ACTIVE NAVIGATION
===================================================== */

const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 150;
    const sectionHeight = section.offsetHeight;

    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");

    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});

/* =====================================================
   ANIMATED STATISTICS
===================================================== */

const statNumbers = document.querySelectorAll("[data-target]");

let statsStarted = false;

function animateStats() {
  if (statsStarted) return;

  const statsSection = document.querySelector(".stats");

  const position = statsSection.getBoundingClientRect().top;

  if (position < window.innerHeight - 100) {
    statsStarted = true;

    statNumbers.forEach((number) => {
      const target = Number(number.dataset.target);

      let current = 0;

      const increment = Math.max(1, Math.ceil(target / 50));

      const timer = setInterval(() => {
        current += increment;

        if (current >= target) {
          current = target;

          clearInterval(timer);
        }

        number.textContent = current;
      }, 30);
    });
  }
}

window.addEventListener("scroll", animateStats);

animateStats();

/* =====================================================
   SCROLL REVEAL
===================================================== */

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
  },
);

revealElements.forEach((element) => {
  revealObserver.observe(element);
});

/* =====================================================
   PROJECT FILTER
===================================================== */

const filterButtons = document.querySelectorAll(".filter-btn");

const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    const filter = button.dataset.filter;

    projectCards.forEach((card) => {
      const category = card.dataset.category;

      if (filter === "all" || category === filter) {
        card.classList.remove("hide");
      } else {
        card.classList.add("hide");
      }
    });
  });
});

/* =====================================================
   PROJECT ESTIMATOR
===================================================== */

const calculateBtn = document.getElementById("calculateBtn");

const areaInput = document.getElementById("area");

const buildingType = document.getElementById("buildingType");

const estimate = document.getElementById("estimate");

calculateBtn.addEventListener("click", () => {
  const area = Number(areaInput.value);

  if (!area || area <= 0) {
    estimate.textContent = "Enter a valid area";

    return;
  }

  let lowRate;
  let highRate;

  switch (buildingType.value) {
    case "commercial":
      lowRate = 850;
      highRate = 1300;

      break;

    case "industrial":
      lowRate = 650;
      highRate = 1050;

      break;

    default:
      lowRate = 550;
      highRate = 900;
  }

  const low = area * lowRate;

  const high = area * highRate;

  const formatMoney = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  estimate.textContent = `${formatMoney(low)} — ${formatMoney(high)}`;
});

/* =====================================================
   TESTIMONIAL SLIDER
===================================================== */

const testimonials = document.querySelectorAll(".testimonial");

const dots = document.querySelectorAll(".dot");

const nextBtn = document.getElementById("nextTestimonial");

const prevBtn = document.getElementById("prevTestimonial");

let currentTestimonial = 0;

function showTestimonial(index) {
  testimonials.forEach((testimonial) => {
    testimonial.classList.remove("active");
  });

  dots.forEach((dot) => {
    dot.classList.remove("active");
  });

  testimonials[index].classList.add("active");

  dots[index].classList.add("active");
}

nextBtn.addEventListener("click", () => {
  currentTestimonial++;

  if (currentTestimonial >= testimonials.length) {
    currentTestimonial = 0;
  }

  showTestimonial(currentTestimonial);
});

prevBtn.addEventListener("click", () => {
  currentTestimonial--;

  if (currentTestimonial < 0) {
    currentTestimonial = testimonials.length - 1;
  }

  showTestimonial(currentTestimonial);
});

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    currentTestimonial = index;

    showTestimonial(currentTestimonial);
  });
});

/* =====================================================
   FAQ ACCORDION
===================================================== */

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");

  const answer = item.querySelector(".faq-answer");

  question.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");

    faqItems.forEach((otherItem) => {
      otherItem.classList.remove("open");

      otherItem.querySelector(".faq-answer").style.maxHeight = null;
    });

    if (!isOpen) {
      item.classList.add("open");

      answer.style.maxHeight = answer.scrollHeight + "px";
    }
  });
});

/* =====================================================
   CONTACT FORM
===================================================== */

const contactForm = document.getElementById("contactForm");

const formMessage = document.getElementById("formMessage");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();

  const email = document.getElementById("email").value.trim();

  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    formMessage.textContent = "Please complete all required fields.";

    formMessage.style.color = "#e89535";

    return;
  }

  formMessage.textContent =
    "Thank you. Your project request has been received.";

  formMessage.style.color = "#8ed6a5";

  contactForm.reset();
});

/* =====================================================
   HEADER BACKGROUND ON SCROLL
===================================================== */

const header = document.querySelector(".header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 40) {
    header.style.background = "rgba(9, 19, 31, 0.97)";
  } else {
    header.style.background = "rgba(16, 28, 43, 0.92)";
  }
});
