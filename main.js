(function () {
  "use strict";

  /* ============================================
     Footer year
  ============================================ */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============================================
     Nav: shrink/darken on scroll
  ============================================ */
  var nav = document.getElementById("nav");
  function handleNavScroll() {
    if (window.scrollY > 40) {
      nav.classList.add("is-scrolled");
    } else {
      nav.classList.remove("is-scrolled");
    }
  }
  handleNavScroll();
  window.addEventListener("scroll", handleNavScroll, { passive: true });

  /* ============================================
     Mobile menu
  ============================================ */
  var burger = document.getElementById("burger");
  var navMobile = document.getElementById("navMobile");

  function closeMobileMenu() {
    burger.classList.remove("is-open");
    navMobile.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  }

  burger.addEventListener("click", function () {
    var isOpen = navMobile.classList.toggle("is-open");
    burger.classList.toggle("is-open", isOpen);
    burger.setAttribute("aria-expanded", String(isOpen));
  });

  document.querySelectorAll("[data-nav-mobile]").forEach(function (link) {
    link.addEventListener("click", closeMobileMenu);
  });

  /* ============================================
     Scroll reveal (IntersectionObserver)
  ============================================ */
  var revealEls = document.querySelectorAll(".reveal");
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );
  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ============================================
     Hero stat count-up
  ============================================ */
  var statEls = document.querySelectorAll(".stat__num");
  var statsAnimated = false;

  function animateStats() {
    if (statsAnimated) return;
    statsAnimated = true;
    statEls.forEach(function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      var duration = 1400;
      var start = null;

      function step(timestamp) {
        if (start === null) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          el.textContent = target;
        }
      }
      window.requestAnimationFrame(step);
    });
  }

  var heroStats = document.querySelector(".hero__stats");
  if (heroStats) {
    var statsObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateStats();
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    statsObserver.observe(heroStats);
  }

  /* ============================================
     Animated skill bars on scroll
  ============================================ */
  var skillFills = document.querySelectorAll(".skill__fill");
  var skillObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var level = el.getAttribute("data-level") || "0";
          // slight delay so it animates after the reveal transition starts
          window.setTimeout(function () {
            el.style.width = level + "%";
          }, 150);
          skillObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.4 }
  );
  skillFills.forEach(function (el) {
    skillObserver.observe(el);
  });

  /* ============================================
     Video modal — YouTube (landscape)
  ============================================ */
  var modal = document.getElementById("videoModal");
  var modalMedia = document.getElementById("modalMedia");
  var modalBackdrop = document.getElementById("modalBackdrop");
  var modalClose = document.getElementById("modalClose");

  function openModal(type, value) {
    modalMedia.innerHTML = "";
    modalMedia.classList.remove("is-portrait", "is-landscape");

    if (type === "youtube") {
      modalMedia.classList.add("is-landscape");
      var iframe = document.createElement("iframe");
      iframe.src = "https://www.youtube.com/embed/" + value + "?autoplay=1&rel=0";
      iframe.title = "YouTube video player";
      iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
      iframe.setAttribute("allowfullscreen", "");
      modalMedia.appendChild(iframe);
    }

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    // stop playback by clearing media after the closing transition
    window.setTimeout(function () {
      modalMedia.innerHTML = "";
    }, 300);
  }

  document.querySelectorAll("[data-modal]").forEach(function (card) {
    card.addEventListener("click", function () {
      var type = card.getAttribute("data-modal");
      if (type === "youtube") {
        openModal("youtube", card.getAttribute("data-yt"));
      }
    });
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.click();
      }
    });
  });

  modalBackdrop.addEventListener("click", closeModal);
  modalClose.addEventListener("click", closeModal);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  /* ============================================
     Lightbox — Concert Photography gallery
  ============================================ */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxBackdrop = document.getElementById("lightboxBackdrop");
  var lightboxClose = document.getElementById("lightboxClose");

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    window.setTimeout(function () {
      lightboxImg.src = "";
    }, 300);
  }

  document.querySelectorAll("[data-lightbox]").forEach(function (item) {
    item.addEventListener("click", function () {
      var img = item.querySelector("img");
      openLightbox(item.getAttribute("data-lightbox"), img ? img.alt : "");
    });
  });

  lightboxBackdrop.addEventListener("click", closeLightbox);
  lightboxClose.addEventListener("click", closeLightbox);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });

  /* ============================================
     Contact form — client-side feedback
  ============================================ */
  var form = document.getElementById("contactForm");
  var feedback = document.getElementById("formFeedback");
  var submitBtn = form.querySelector(".btn");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      feedback.textContent = "Please fill in every field before sending.";
      feedback.classList.remove("is-success");
      return;
    }

    submitBtn.classList.add("is-loading");
    feedback.classList.remove("is-success");
    feedback.textContent = "Sending...";

    window.setTimeout(function () {
      submitBtn.classList.remove("is-loading");
      feedback.textContent = "Message sent — thanks! I'll get back to you soon.";
      feedback.classList.add("is-success");
      form.reset();
    }, 900);
  });

  /* ============================================
     Smooth-scroll for in-page nav links (with mobile close)
  ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function () {
      closeMobileMenu();
    });
  });
})();
