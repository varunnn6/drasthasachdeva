/* ============================================================
   SCRIPT.JS — Dr. Astha Sachdeva Physiotherapy Website
   ============================================================ */

// ── PRELOADER & INTRO SEQUENCE ──────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const preloader = document.getElementById("preloader");
  const nav = document.getElementById("nav");
  const heroContent = document.getElementById("heroContent");
  const heroPhoto = document.getElementById("heroPhoto");
  const waFloat = document.getElementById("wa-float");

  // Set initial hidden states for intro animation
  if (nav) {
    nav.style.opacity = '0';
    nav.style.transition = 'opacity 0.6s ease';
  }
  if (heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(30px)';
    heroContent.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  }
  if (heroPhoto) {
    heroPhoto.style.opacity = '0';
    heroPhoto.style.transform = 'translateX(30px)'; // matches original fade-left
    heroPhoto.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  }
  if (waFloat) {
    waFloat.style.opacity = '0';
    waFloat.style.transform = 'translateY(20px)';
    waFloat.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    waFloat.style.pointerEvents = 'none'; // Prevent clicks while hidden
  }

  if (preloader) {
    // 0.2s delay + 1.5s fill animation + 0.3s hold = 2000ms total
    setTimeout(() => {
      // PRELOADER FADES OUT (takes 0.7s as per CSS)
      preloader.style.opacity = "0";
      
      // Wait 0.7s for preloader to completely fade out before showing anything
      setTimeout(() => {
        preloader.style.display = "none";

        // 1. Navbar fades in first (no translate movement)
        if (nav) {
          nav.style.opacity = '1';
        }

        // 2. Hero elements fade in 400ms AFTER navbar starts
        setTimeout(() => {
          if (heroContent) {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
          }
          if (heroPhoto) {
            heroPhoto.style.opacity = '1';
            heroPhoto.style.transform = 'translateX(0)';
          }

          // 3. WhatsApp button fades in 400ms AFTER hero elements start
          setTimeout(() => {
            if (waFloat) {
              waFloat.style.opacity = '1';
              waFloat.style.transform = 'translateY(0)';
              waFloat.style.pointerEvents = 'auto';
            }

            // 4. Finally, unlock scrolling once everything is done loading
            document.body.classList.remove("no-scroll");

          }, 400);

        }, 400);

      }, 700); // Wait for the 0.7s fade out transition
    }, 2000);
  }
});

// ── NAV SCROLL SHADOW ────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── RIGHT-SIDE DRAWER ────────────────────────────────────
const hamburger     = document.getElementById('hamburger');
const mobileMenu    = document.getElementById('mobileMenu');
const drawerOverlay = document.getElementById('drawerOverlay');
const mmClose       = document.getElementById('mmClose');

function openDrawer() {
  drawerOverlay.classList.add('open');
  requestAnimationFrame(() => drawerOverlay.classList.add('visible'));
  mobileMenu.classList.add('open');
  hamburger.classList.add('open');
  mobileMenu.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  drawerOverlay.classList.remove('visible');
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  setTimeout(() => drawerOverlay.classList.remove('open'), 350);
}

hamburger.addEventListener('click', () => {
  mobileMenu.classList.contains('open') ? closeDrawer() : openDrawer();
});

mmClose.addEventListener('click', closeDrawer);
drawerOverlay.addEventListener('click', closeDrawer);

document.querySelectorAll('.mm-link').forEach(link => {
  link.addEventListener('click', closeDrawer);
});

// ── SCROLL REVEAL ─────────────────────────────────────────────
const animateEls = document.querySelectorAll('[data-animate]');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // stagger children in grids
      const siblings = entry.target.parentElement
        ? [...entry.target.parentElement.children].filter(el => el.hasAttribute('data-animate'))
        : [];
      const idx = siblings.indexOf(entry.target);
      const delay = siblings.length > 1 ? idx * 80 : 0;

      setTimeout(() => {
        entry.target.classList.add('animated');
      }, delay);

      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

animateEls.forEach(el => revealObserver.observe(el));

// ── MARQUEE — seamless loop via CSS, nothing extra needed ────
// The CSS @keyframes marquee handles it. Just ensure the
// content is doubled exactly in HTML (which it is).

// ── CONTACT FORM → WHATSAPP ──────────────────────────────────
function handleSubmit(e) {
  e.preventDefault();
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  // Validation
  const inputs = form.querySelectorAll('input[required]');
  let valid = true;
  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.style.borderColor = '#f87171';
      valid = false;
    } else {
      input.style.borderColor = '';
    }
  });
  if (!valid) return;

  // Collect values
  const name      = document.getElementById('name').value.trim();
  const age       = document.getElementById('age').value.trim();
  const phone     = document.getElementById('phone').value.trim();
  const condition = document.getElementById('condition').value;
  const address   = document.getElementById('address').value.trim();
  const message   = document.getElementById('message').value.trim();

  // Build WhatsApp message
  let waMsg = `🏥 *New Patient Request*\n\n`;
  waMsg += `*Name:* ${name}\n`;
  if (age)       waMsg += `*Age:* ${age}\n`;
  waMsg += `*Phone:* ${phone}\n`;
  if (address)   waMsg += `*Address:* ${address}\n`;
  if (condition) waMsg += `*Condition:* ${condition}\n`;
  if (message)   waMsg += `*Note:* ${message}\n`;
  waMsg += `\n_Sent via website form_`;

  // Open WhatsApp with pre-filled message
  const encoded = encodeURIComponent(waMsg);
  window.open(`https://wa.me/917011700787?text=${encoded}`, '_blank');

  form.style.opacity = '0';
  form.style.transform = 'translateY(10px)';
  form.style.transition = 'opacity .35s, transform .35s';

  setTimeout(() => {
    form.style.display = 'none';
    success.style.display = 'flex';
    success.style.opacity = '0';
    requestAnimationFrame(() => {
      success.style.transition = 'opacity .5s';
      success.style.opacity = '1';
    });
  }, 350);
}

// ── SERVICE CARDS — subtle tilt on hover (desktop only) ──────
if (window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.service-card, .why-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width  / 2);
      const dy    = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-8px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg)`;
      card.style.transition = 'transform .1s';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform .4s cubic-bezier(.4,0,.2,1)';
    });
  });
}

// ── SMOOTH ANCHOR SCROLL ─────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
