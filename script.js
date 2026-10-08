/**
 * Head Brand Partner - Digital Agency Scripts
 * Handles Sticky Navbar, Active Navigation Spy, Filter Tabs, Service Selection,
 * Contact Form Validation & WhatsApp Direct URL generator.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navigation on Scroll
  const siteHeader = document.getElementById('siteHeader');
  const scrollThreshold = 40;

  const handleScrollHeader = () => {
    if (window.scrollY > scrollThreshold) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScrollHeader, { passive: true });
  handleScrollHeader();

  // 2. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      navLinks.classList.toggle('open');
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 3. Active Link Scroll Spy
  const sections = document.querySelectorAll('section[id], header[id]');
  const navItems = document.querySelectorAll('.nav-link');

  const highlightNavOnScroll = () => {
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

  // 4. Services Filter Tabs
  const filterBtns = document.querySelectorAll('.service-tab-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 4b. Clients Sector Filter Tabs
  const clientFilterBtns = document.querySelectorAll('.client-filter-btn');
  const clientCards = document.querySelectorAll('#clientsGrid .client-logo-card');

  if (clientFilterBtns.length > 0 && clientCards.length > 0) {
    clientFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        clientFilterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const filterValue = btn.getAttribute('data-client-filter');

        clientCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          if (filterValue === 'all' || cardCategory === filterValue) {
            card.style.display = 'flex';
            requestAnimationFrame(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          } else {
            card.style.display = 'none';
            card.style.opacity = '0';
          }
        });
      });
    });
  }

  // 5. Pre-select Service in Contact Form when clicking "Solicitar" on a service card
  const serviceSelectInput = document.getElementById('contactService');
  const serviceCtas = document.querySelectorAll('[data-service-select]');

  serviceCtas.forEach(cta => {
    cta.addEventListener('click', (e) => {
      const selectedService = cta.getAttribute('data-service-select');
      if (serviceSelectInput && selectedService) {
        serviceSelectInput.value = selectedService;
      }
    });
  });

  // 6. Interactive Contact Form & WhatsApp Generator
  const agencyContactForm = document.getElementById('agencyContactForm');
  const formStatusMsg = document.getElementById('formStatusMsg');
  const sendDirectWhatsAppBtn = document.getElementById('sendDirectWhatsAppBtn');

  // WhatsApp Agency Phone Number (Argentina format: +54 9 351 616-6554)
  const AGENCY_WHATSAPP_PHONE = '5493516166554';

  /**
   * Helper to construct WhatsApp URL from Form Data
   */
  const buildWhatsAppMessage = () => {
    const name = document.getElementById('contactName')?.value.trim() || 'No especificado';
    const company = document.getElementById('contactCompany')?.value.trim() || 'No especificada';
    const email = document.getElementById('contactEmail')?.value.trim() || 'No especificado';
    const phone = document.getElementById('contactPhone')?.value.trim() || 'No especificado';
    const service = document.getElementById('contactService')?.value || 'Consulta General';
    const message = document.getElementById('contactMessage')?.value.trim() || 'Hola, me gustaría recibir más información.';

    const text = `*Nueva Consulta - Head Brand Partner*\n` +
                 `👤 *Nombre:* ${name}\n` +
                 `🏢 *Empresa:* ${company}\n` +
                 `📧 *Email:* ${email}\n` +
                 `📱 *Teléfono:* ${phone}\n` +
                 `🎯 *Servicio:* ${service}\n` +
                 `💬 *Mensaje:* ${message}`;

    return `https://wa.me/${AGENCY_WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
  };

  // Button: Send via WhatsApp immediately
  if (sendDirectWhatsAppBtn) {
    sendDirectWhatsAppBtn.addEventListener('click', () => {
      const url = buildWhatsAppMessage();
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  // Form Submit Handler
  if (agencyContactForm) {
    agencyContactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic validation
      const name = document.getElementById('contactName').value.trim();
      const company = document.getElementById('contactCompany').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const phone = document.getElementById('contactPhone').value.trim();
      const service = document.getElementById('contactService').value;
      const message = document.getElementById('contactMessage').value.trim();

      if (!name || !company || !email || !phone || !service || !message) {
        showStatus('Por favor completá todos los campos requeridos marcados con (*).', 'error');
        return;
      }

      // Email format check
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        showStatus('Por favor ingresá una dirección de correo electrónico válida.', 'error');
        return;
      }

      // Simulate successful submission
      const submitBtn = document.getElementById('submitFormBtn');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Enviando propuesta...</span>';

      setTimeout(() => {
        showStatus(`¡Excelente, ${name}! Hemos recibido tu consulta sobre "${service}". Nos pondremos en contacto contigo dentro de las próximas 2 horas hábiles.`, 'success');
        agencyContactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Enviar Consulta</span><svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>`;
      }, 1000);
    });
  }

  function showStatus(msg, type) {
    if (!formStatusMsg) return;
    formStatusMsg.textContent = msg;
    formStatusMsg.className = `form-status ${type}`;
    formStatusMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // 7. Subtle Reveal Animation on Scroll using IntersectionObserver
  const revealElements = document.querySelectorAll('.service-card, .methodology-card, .client-logo-card, .testimonial-card');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersectObserver ? entry.isIntersecting : true) {
          entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      observer.observe(el);
    });
  }
});
