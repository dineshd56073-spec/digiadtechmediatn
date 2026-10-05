// DigiAdTechMediaTN - Frontend Interactions & Lead Submission
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const hamburger = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = mobileNav ? mobileNav.querySelectorAll('a') : [];

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      const isOpen = mobileNav.classList.contains('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active Link Highlight on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function updateActiveNavLink() {
    const scrollY = window.pageYOffset + 120;
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // Contact Form Submission (with Java Backend & WhatsApp fallback)
  const contactForm = document.getElementById('contactForm');
  const formToast = document.getElementById('formToast');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('formName').value.trim();
      const phone = document.getElementById('formPhone').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const service = document.getElementById('formService').value;
      const language = document.getElementById('formLanguage').value;
      const message = document.getElementById('formMessage').value.trim();

      if (!name || !phone) {
        showToast('Please provide your name and phone/WhatsApp number.', 'error');
        return;
      }

      const payload = {
        name,
        phone,
        email,
        service,
        language,
        message,
        timestamp: new Date().toISOString()
      };

      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending...';
      submitBtn.disabled = true;

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const result = await response.json();
          showToast(result.message || 'Thank you! Your inquiry has been submitted successfully.', 'success');
          contactForm.reset();
        } else {
          fallbackToWhatsApp(payload, 'Inquiry received. Connecting you to WhatsApp...');
        }
      } catch (err) {
        // If Java backend is not currently running or static preview, open directly via WhatsApp
        fallbackToWhatsApp(payload, 'Opening WhatsApp to send your inquiry...');
      } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  }

  function fallbackToWhatsApp(data, noticeMessage) {
    showToast(noticeMessage, 'success');
    const text = encodeURIComponent(
      `Hello DigiAdTechMediaTN!%0A%0A` +
      `*Name:* ${data.name}%0A` +
      `*Phone:* ${data.phone}%0A` +
      `*Email:* ${data.email || 'N/A'}%0A` +
      `*Interested In:* ${data.service}%0A` +
      `*Language:* ${data.language}%0A` +
      `*Message:* ${data.message || 'Interested in details.'}`
    );
    setTimeout(() => {
      window.open(`https://wa.me/918122637441?text=${text}`, '_blank');
    }, 900);
  }

  function showToast(message, type) {
    if (!formToast) return;
    formToast.className = `toast ${type}`;
    formToast.textContent = message;
    setTimeout(() => {
      formToast.className = 'toast';
    }, 6000);
  }
});