/* =========================================================
   SUNSHINE HOTEL
   COMPLETE ORIGINAL JAVASCRIPT
========================================================= */

/* =========================================================
   PRELOADER
========================================================= */

window.addEventListener("load", () => {
  const preloader = document.querySelector(".preloader");

  setTimeout(() => {
    preloader.classList.add("hide");
  }, 700);
});

/* =========================================================
   ELEMENTS
========================================================= */

const header = document.querySelector(".header");

const menuToggle = document.querySelector("#menuToggle");

const navbar = document.querySelector("#navbar");

const backToTop = document.querySelector("#backToTop");

const toast = document.querySelector("#toast");

const toastTitle = document.querySelector("#toastTitle");

const toastMessage = document.querySelector("#toastMessage");

const toastClose = document.querySelector("#toastClose");

/* =========================================================
   MOBILE NAVIGATION
========================================================= */

menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("active");

  navbar.classList.toggle("active");
});

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.classList.remove("active");

    navbar.classList.remove("active");
  });
});

/* =========================================================
   HEADER SCROLL
========================================================= */

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  if (window.scrollY > 500) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
});

/* =========================================================
   BACK TO TOP
========================================================= */

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

const sections = document.querySelectorAll("main section[id]");

const navigationLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 150;

    const sectionHeight = section.offsetHeight;

    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      currentSection = section.getAttribute("id");
    }
  });

  navigationLinks.forEach((link) => {
    link.classList.remove("active");

    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }
  });
});

/* =========================================================
   ROOM FILTER
========================================================= */

const filterButtons = document.querySelectorAll(".filter-btn");

const roomCards = document.querySelectorAll(".room-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    const filter = button.dataset.filter;

    roomCards.forEach((card) => {
      const category = card.dataset.category;

      if (filter === "all" || category === filter) {
        card.classList.remove("hidden");

        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, 20);
      } else {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";

        setTimeout(() => {
          card.classList.add("hidden");
        }, 300);
      }
    });
  });
});

/* =========================================================
   FAVORITE HEART BUTTONS
========================================================= */

const heartButtons = document.querySelectorAll(".room-heart");

heartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.toggle("liked");

    const icon = button.querySelector("i");

    if (button.classList.contains("liked")) {
      icon.classList.remove("fa-regular");

      icon.classList.add("fa-solid");

      showToast(
        "Added to Favorites",
        "This room has been saved to your favorites.",
      );
    } else {
      icon.classList.remove("fa-solid");

      icon.classList.add("fa-regular");
    }
  });
});

/* =========================================================
   BOOKING MODAL
========================================================= */

const bookingModal = document.querySelector("#bookingModal");

const modalClose = document.querySelector("#modalClose");

const bookingButtons = document.querySelectorAll(".open-booking");

function openBookingModal() {
  bookingModal.classList.add("active");

  document.body.classList.add("modal-open");
}

function closeBookingModal() {
  bookingModal.classList.remove("active");

  document.body.classList.remove("modal-open");
}

bookingButtons.forEach((button) => {
  button.addEventListener("click", openBookingModal);
});

modalClose.addEventListener("click", closeBookingModal);

bookingModal.addEventListener("click", (event) => {
  if (event.target === bookingModal) {
    closeBookingModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && bookingModal.classList.contains("active")) {
    closeBookingModal();
  }
});

/* =========================================================
   DATE INPUTS
========================================================= */

const today = new Date().toISOString().split("T")[0];

const dateInputs = document.querySelectorAll('input[type="date"]');

dateInputs.forEach((input) => {
  input.min = today;
});

const checkIn = document.querySelector("#checkIn");

const checkOut = document.querySelector("#checkOut");

const reservationCheckIn = document.querySelector("#reservationCheckIn");

const reservationCheckOut = document.querySelector("#reservationCheckOut");

function updateCheckoutMin(checkInElement, checkOutElement) {
  checkInElement.addEventListener("change", () => {
    checkOutElement.min = checkInElement.value;

    if (checkOutElement.value < checkInElement.value) {
      checkOutElement.value = "";
    }
  });
}

updateCheckoutMin(checkIn, checkOut);

updateCheckoutMin(reservationCheckIn, reservationCheckOut);

/* =========================================================
   MAIN BOOKING FORM
========================================================= */

const bookingForm = document.querySelector("#bookingForm");

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const checkInDate = document.querySelector("#checkIn").value;

  const checkOutDate = document.querySelector("#checkOut").value;

  const room = document.querySelector("#roomType").value;

  const guests = document.querySelector("#guests").value;

  if (!checkInDate || !checkOutDate) {
    showToast(
      "Choose Your Dates",
      "Please select both check-in and check-out dates.",
    );

    return;
  }

  const start = new Date(checkInDate);

  const end = new Date(checkOutDate);

  if (end <= start) {
    showToast("Invalid Dates", "Check-out must be after check-in.");

    return;
  }

  document.querySelector("#reservationCheckIn").value = checkInDate;

  document.querySelector("#reservationCheckOut").value = checkOutDate;

  if (room !== "all") {
    const roomMap = {
      deluxe: "Deluxe Room",

      suite: "Sunshine Suite",

      presidential: "Royal Sunshine",
    };

    document.querySelector("#reservationRoom").value =
      roomMap[room] || "Deluxe Room";
  }

  document.querySelector("#reservationGuests").value =
    `${guests} Guest${guests === "1" ? "" : "s"}`;

  openBookingModal();
});

/* =========================================================
   RESERVATION FORM
========================================================= */

const reservationForm = document.querySelector("#reservationForm");

reservationForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const checkInDate = reservationCheckIn.value;

  const checkOutDate = reservationCheckOut.value;

  if (new Date(checkOutDate) <= new Date(checkInDate)) {
    showToast("Invalid Dates", "Check-out must be after check-in.");

    return;
  }

  closeBookingModal();

  reservationForm.reset();

  showToast(
    "Reservation Request Sent",
    "Thank you! Our team will contact you shortly.",
  );
});

/* =========================================================
   GALLERY LIGHTBOX
========================================================= */

const lightbox = document.querySelector("#lightbox");

const lightboxImage = document.querySelector("#lightboxImage");

const lightboxClose = document.querySelector("#lightboxClose");

const galleryItems = document.querySelectorAll(".gallery-item");

galleryItems.forEach((item) => {
  item.addEventListener("click", () => {
    const image = item.dataset.image;

    lightboxImage.src = image;

    lightbox.classList.add("active");

    document.body.classList.add("modal-open");
  });
});

function closeLightbox() {
  lightbox.classList.remove("active");

  document.body.classList.remove("modal-open");
}

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

/* =========================================================
   TESTIMONIAL SLIDER
========================================================= */

const testimonials = document.querySelectorAll(".testimonial");

const dots = document.querySelectorAll(".dot");

const previousTestimonial = document.querySelector("#prevTestimonial");

const nextTestimonial = document.querySelector("#nextTestimonial");

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

  currentTestimonial = index;
}

previousTestimonial.addEventListener("click", () => {
  let index = currentTestimonial - 1;

  if (index < 0) {
    index = testimonials.length - 1;
  }

  showTestimonial(index);
});

nextTestimonial.addEventListener("click", () => {
  let index = currentTestimonial + 1;

  if (index >= testimonials.length) {
    index = 0;
  }

  showTestimonial(index);
});

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    showTestimonial(index);
  });
});

/* =========================================================
   AUTO TESTIMONIAL SLIDER
========================================================= */

setInterval(() => {
  let index = currentTestimonial + 1;

  if (index >= testimonials.length) {
    index = 0;
  }

  showTestimonial(index);
}, 6000);

/* =========================================================
   FAQ ACCORDION
========================================================= */

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");

  question.addEventListener("click", () => {
    const wasActive = item.classList.contains("active");

    faqItems.forEach((faq) => {
      faq.classList.remove("active");
    });

    if (!wasActive) {
      item.classList.add("active");
    }
  });
});

/* =========================================================
   CONTACT FORM
========================================================= */

const contactForm = document.querySelector("#contactForm");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  showToast("Message Sent", "Thank you! We will get back to you soon.");

  contactForm.reset();
});

/* =========================================================
   NEWSLETTER
========================================================= */

const newsletterForm = document.querySelector("#newsletterForm");

newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.querySelector("#newsletterEmail").value;

  if (!email) {
    return;
  }

  showToast("Welcome to Sunshine", "You are now subscribed to our newsletter.");

  newsletterForm.reset();
});

/* =========================================================
   TOAST
========================================================= */

let toastTimeout;

function showToast(title, message) {
  toastTitle.textContent = title;

  toastMessage.textContent = message;

  toast.classList.add("show");

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 4500);
}

toastClose.addEventListener("click", () => {
  toast.classList.remove("show");
});

/* =========================================================
   SCROLL REVEAL
========================================================= */

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

/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();

    closeBookingModal();
  }
});

/* =========================================================
   SMOOTH SCROLL FOR ANCHORS
========================================================= */

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const targetId = anchor.getAttribute("href");

    if (targetId === "#" || !document.querySelector(targetId)) {
      return;
    }

    event.preventDefault();

    const target = document.querySelector(targetId);

    const headerHeight = header.offsetHeight;

    const targetPosition = target.offsetTop - headerHeight;

    window.scrollTo({
      top: targetPosition,

      behavior: "smooth",
    });
  });
});

/* =========================================================
   PREVENT PAST CHECK-IN
========================================================= */

const todayDate = new Date();

todayDate.setHours(0, 0, 0, 0);

console.log("Sunshine Hotel website loaded successfully.");
