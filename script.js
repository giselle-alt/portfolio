document.addEventListener("DOMContentLoaded", function () {

  /* --------------------
     CHAT ANIMATION
  -------------------- */

  const hasPlayed = sessionStorage.getItem("chatAnimationPlayed");
  const bubbles = document.querySelectorAll(".chat-bubble");
  const avatar = document.querySelector(".chat-avatar");
  const mainContent = document.getElementById("main-content");

  if (!hasPlayed) {
    // First visit → play animation
    bubbles.forEach((bubble, index) => {
      setTimeout(() => {
        bubble.classList.add("show");
        avatar.style.transform = `translateY(${index * 54}px)`;

        // Reveal main content after last bubble
        if (index === bubbles.length - 1) {
          mainContent.style.display = "block";
          mainContent.style.opacity = 0;

          setTimeout(() => {
            mainContent.style.transition = "opacity 0.5s ease-in-out";
            mainContent.style.opacity = 1;
          }, 50);

          // Mark animation as played
          sessionStorage.setItem("chatAnimationPlayed", "true");
        }
      }, index * 600);
    });
  } else {
    // Returning visit → skip animation
    bubbles.forEach(bubble => bubble.classList.add("show"));
    avatar.style.transform = `translateY(${(bubbles.length - 1) * 54}px)`;
    mainContent.style.display = "block";
    mainContent.style.opacity = 1;
  }

  /* --------------------
     BACKGROUND MOTION
  -------------------- */
  const bgVector = document.querySelector(".bg-vector");
  if (bgVector && window.innerWidth >= 768) {
    document.addEventListener("mousemove", (e) => {
      const { innerWidth, innerHeight } = window;
      const x = e.clientX / innerWidth - 0.5;
      const y = e.clientY / innerHeight - 0.5;
      const rotateX = y * 100;   // subtle tilt
      const rotateY = x * -100;
      bgVector.style.transform = `translateZ(0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
  }

  /* -------------------------------
     INTERSECTION OBSERVER
     (Scroll-based reveal)
  -------------------------------- */
  const revealItems = document.querySelectorAll(
    ".chapter-card, .work-card, .fitness-description p, .main-image"
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -80px 0px",
    }
  );

  revealItems.forEach((el) => {
    el.classList.add("reveal");
    revealObserver.observe(el);
  });

  /* -------------------------------
     PARALLAX — FITNESS IMAGE
     (Very subtle)
  -------------------------------- */
  const fitnessImage = document.querySelector(".main-image");
  if (fitnessImage) {
    window.addEventListener("scroll", () => {
      const rect = fitnessImage.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      if (rect.top < viewportHeight && rect.bottom > 0) {
        const progress = 1 - rect.top / viewportHeight;
        const translateY = Math.min(progress * 24, 24);
        fitnessImage.style.transform = `translateY(${translateY}px)`;
      }
    });
  }

  /* -------------------------------
     NAVBAR SCROLL COMPRESSION
  -------------------------------- */
  const navbar = document.querySelector(".custom-navbar");
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 40 && currentScroll > lastScroll) {
      navbar.style.paddingTop = "8px";
      navbar.style.paddingBottom = "8px";
    } else {
      navbar.style.paddingTop = "14px";
      navbar.style.paddingBottom = "14px";
    }
    lastScroll = currentScroll;
  });

}); // End of DOMContentLoaded

/* -------------------------------
   REVEAL STYLES (JS-INJECTED)
-------------------------------- */
const style = document.createElement("style");
style.innerHTML = `
  .reveal {
    opacity: 0;
    transform: translateY(14px);
    transition:
      opacity 600ms cubic-bezier(0.4, 0, 0.2, 1),
      transform 600ms cubic-bezier(0.2, 0, 0, 1);
  }
  .reveal-visible {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);

// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      // Remove active class from all tabs and contents
      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(c => c.classList.remove("active"));

      // Add active class to clicked tab and corresponding content
      tab.classList.add("active");
      const targetId = tab.dataset.tab;
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add("active");
      }
    });
  });
});
