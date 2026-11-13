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
      var target = parseFloat(el.getAttribute("data-count")) || 0;
      var decimals = parseInt(el.getAttribute("data-decimals"), 10) || 0;
      var factor = Math.pow(10, decimals);
      var duration = 1400;
      var start = null;

      function step(timestamp) {
        if (start === null) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = (Math.round(eased * target * factor) / factor).toFixed(decimals);
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          el.textContent = target.toFixed(decimals);
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
     Video modal: YouTube (landscape)
  ============================================ */
  var modal = document.getElementById("videoModal");
  var modalMedia = document.getElementById("modalMedia");
  var modalBackdrop = document.getElementById("modalBackdrop");
  var modalClose = document.getElementById("modalClose");

  function openModal(type, value, start) {
    modalMedia.innerHTML = "";
    modalMedia.classList.remove("is-portrait", "is-landscape");

    if (type === "youtube") {
      modalMedia.classList.add("is-landscape");
      var iframe = document.createElement("iframe");
      iframe.src = "https://www.youtube.com/embed/" + value + "?autoplay=1&rel=0" + (start ? "&start=" + start : "");
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
        openModal("youtube", card.getAttribute("data-yt"), card.getAttribute("data-start"));
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
     Lightbox: Concert Photography gallery
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
    item.addEventListener("click", function (e) {
      // JS available: open the in-page lightbox instead of navigating.
      // Without JS the link still opens the full image in a new tab.
      e.preventDefault();
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
     Short Form: "all reels" pop-out
     (thumbnails for reels without a local image are
      pulled live from Instagram's own embed page)
  ============================================ */
  var reelsModal = document.getElementById("reelsModal");
  var reelsOpenBtn = document.getElementById("reelsOpen");
  var reelsBackdrop = document.getElementById("reelsBackdrop");
  var reelsCloseBtn = document.getElementById("reelsClose");
  var EMBED_W = 326; // Instagram embed's native width
  var EMBED_ZOOM = 1.18; // slight zoom so header/footer are cropped out
  var EMBED_HEADER = 62; // px height of the embed's header bar

  function igShortcode(href) {
    var m = href.match(/instagram\.com\/(?:p|reel|reels|tv)\/([^\/?#]+)/);
    return m ? m[1] : null;
  }

  // Fallback: crop Instagram's own embed page down to the picture.
  function addEmbedPreview(thumb, link, w) {
    var zoom = parseFloat(thumb.getAttribute("data-zoom")) || EMBED_ZOOM;
    var shiftY = (parseFloat(thumb.getAttribute("data-shifty")) || 0) * w;
    var k = (w / EMBED_W) * zoom;
    var iframe = document.createElement("iframe");
    iframe.src = link.href.replace(/\/?$/, "/") + "embed/";
    iframe.title = "Reel preview";
    iframe.loading = "lazy";
    iframe.setAttribute("tabindex", "-1");
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.width = EMBED_W + "px";
    iframe.style.height = "1000px";
    iframe.style.transform =
      "translate(" + (-(w * (zoom - 1)) / 2) + "px," + (-(EMBED_HEADER * k) - shiftY) + "px) scale(" + k + ")";
    thumb.insertBefore(iframe, thumb.firstChild);
    thumb.setAttribute("data-built", "embed");
  }

  // First choice: the post's picture straight from its link (same idea as
  // YouTube's /vi/ID/ thumbnail). If Instagram refuses, fall back to the embed crop.
  function buildEmbedThumbs(root) {
    (root || document).querySelectorAll("[data-embed]").forEach(function (thumb) {
      if (thumb.getAttribute("data-built")) return;
      var link = thumb.closest("a");
      var w = thumb.clientWidth;
      if (!link || !w) return;
      thumb.setAttribute("data-built", "pending");

      var code = igShortcode(link.href);
      if (!code) { addEmbedPreview(thumb, link, w); return; }

      var img = new Image();
      img.alt = "";
      img.className = "card__thumb-img";
      img.referrerPolicy = "no-referrer";
      img.onload = function () {
        if (img.naturalWidth > 60) {
          thumb.insertBefore(img, thumb.firstChild);
          thumb.setAttribute("data-built", "image");
        } else {
          addEmbedPreview(thumb, link, w);
        }
      };
      img.onerror = function () { addEmbedPreview(thumb, link, w); };
      img.src = "https://www.instagram.com/p/" + code + "/media/?size=l";
    });
  }

  var reelsTrigger = null;

  function openReels() {
    reelsTrigger = document.activeElement;
    reelsModal.classList.add("is-open");
    reelsModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    var panel = reelsModal.querySelector(".reels-panel");
    if (panel) panel.scrollTop = 0;
    [80, 250, 500].forEach(function (delay) {
      window.setTimeout(function () {
        if (reelsModal.classList.contains("is-open") && document.activeElement !== reelsCloseBtn) {
          reelsCloseBtn.focus({ preventScroll: true });
        }
      }, delay);
    });
    window.requestAnimationFrame(function () { buildEmbedThumbs(reelsModal); });
  }

  function closeReels() {
    reelsModal.classList.remove("is-open");
    reelsModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    if (reelsTrigger && reelsTrigger.focus) reelsTrigger.focus({ preventScroll: true });
  }

  // Instagram items in the Long Form grid get their previews on load
  // (built on load, again when scrolled into view, and on resize, so a card
  //  that had no width yet or whose first request failed still gets its thumbnail)
  function buildFilmThumbs() { buildEmbedThumbs(document.getElementById("films")); }
  window.addEventListener("load", function () {
    buildFilmThumbs();
    window.setTimeout(buildFilmThumbs, 1500);
  });
  var filmsSection = document.getElementById("films");
  if (filmsSection) {
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) buildFilmThumbs();
    }, { threshold: 0.05 }).observe(filmsSection);
  }
  window.addEventListener("resize", buildFilmThumbs);

  if (reelsOpenBtn) reelsOpenBtn.addEventListener("click", openReels);
  reelsBackdrop.addEventListener("click", closeReels);
  reelsCloseBtn.addEventListener("click", closeReels);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && reelsModal.classList.contains("is-open")) {
      closeReels();
    }
  });

  /* ============================================
     Contact form: client-side feedback
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
      feedback.textContent = "Message sent, thanks! I'll get back to you soon.";
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
