/**
 * UMIYA CORPORATION - Interactive Web Application Logic
 * Features: Product Tabs, Tech Specs Search, Client Portfolio Filter,
 * CFM Calculator, Energy Savings Estimator, FAQ Accordion, WhatsApp Lead Gen.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileDrawer();
  initProductTabs();
  initSpecsTableFilter();
  initClientFilter();
  initCalculator();
  initEnergyEstimator();
  initFaqAccordion();
  initContactForm();
});

/* ===================================================================
   1. NAVBAR SCROLL & ACTIVE STATE
   =================================================================== */
function initNavbarScroll() {
  const header = document.querySelector('.main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ===================================================================
   2. MOBILE NAV DRAWER
   =================================================================== */
function initMobileDrawer() {
  const openBtn = document.getElementById('mobileMenuBtn');
  const closeBtn = document.getElementById('mobileMenuClose');
  const drawer = document.getElementById('mobileNavDrawer');
  const overlay = document.getElementById('drawerOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (openBtn) openBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ===================================================================
   3. PRODUCT TABS
   =================================================================== */
function initProductTabs() {
  const tabBtns = document.querySelectorAll('.product-tab-btn');
  const tabContents = document.querySelectorAll('.product-tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetElement = document.getElementById(targetTab);
      if (targetElement) {
        targetElement.classList.add('active');
      }
    });
  });
}

/* ===================================================================
   4. TECHNICAL SPECIFICATIONS SEARCH & FILTER
   =================================================================== */
function initSpecsTableFilter() {
  const searchInputs = document.querySelectorAll('.table-search-input');
  searchInputs.forEach(input => {
    input.addEventListener('keyup', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const targetTableId = input.getAttribute('data-target-table');
      const table = document.getElementById(targetTableId);
      if (!table) return;

      const rows = table.querySelectorAll('tbody tr');
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(query)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });
}

/* ===================================================================
   5. CLIENT LIST & PORTFOLIO FILTER (CORE REQUIREMENT)
   =================================================================== */
function initClientFilter() {
  const filterBtns = document.querySelectorAll('.client-filter-btn');
  const clientCards = document.querySelectorAll('.client-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      clientCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.35s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ===================================================================
   6. CFM & AIR COMPRESSOR SIZING CALCULATOR
   =================================================================== */
function initCalculator() {
  const form = document.getElementById('compressorCalcForm');
  if (!form) return;

  const industrySelect = document.getElementById('calcIndustry');
  const pressureSelect = document.getElementById('calcPressure');
  const cfmInput = document.getElementById('calcCfm');
  const toolCountInput = document.getElementById('calcTools');

  // Outputs
  const outModel = document.getElementById('calcOutModel');
  const outHP = document.getElementById('calcOutHp');
  const outDryer = document.getElementById('calcOutDryer');
  const outTank = document.getElementById('calcOutTank');
  const outPressure = document.getElementById('calcOutPressure');
  const whatsappCta = document.getElementById('calcWhatsappBtn');

  function calculateRequirements() {
    let cfm = parseFloat(cfmInput.value) || 0;
    const tools = parseInt(toolCountInput.value) || 1;
    const pressure = parseFloat(pressureSelect.value) || 8;
    const industry = industrySelect.value;

    // Auto-adjust CFM if tool count changed and cfm is low
    if (cfm <= 0 && tools > 0) {
      cfm = tools * 15; // default 15 CFM per industrial workstation
      cfmInput.value = cfm;
    }

    // Safety margin 20%
    const designCfm = Math.round(cfm * 1.2);

    let recModel = 'UMA-9-10';
    let recHp = '10 HP / 7.5 KW';
    let recDryer = 'UMA-9-40 (40 CFM)';
    let recTank = '300 Liters';
    let recPressStr = `${pressure} Bar`;

    if (pressure >= 16 && industry === 'plasma') {
      recModel = 'UMA-9-30 (16 Bar Package)';
      recHp = '30 HP / 22 KW (High Pressure)';
      recDryer = 'UMA-9-150 HP (35 Bar Rated)';
      recTank = '500 Liters (16 Bar Tested)';
      recPressStr = '16 Bar (Plasma Grade)';
    } else if (pressure >= 30 || industry === 'pet') {
      recModel = 'UMA-9-15T2 (Multi-Stage)';
      recHp = '20 HP (Multi-Stage High Pressure)';
      recDryer = 'UMA-9-100 High Pressure';
      recTank = '500 Liters (500 PSIG / 35 Bar)';
      recPressStr = '35 Bar / 500 PSIG';
    } else if (industry === 'pharma' || industry === 'dental') {
      recModel = 'UMA-9-242 O (Oil-Free Class 0)';
      recHp = '5 HP to 15 HP Oil-Free';
      recDryer = 'Heatless Desiccant -40°C Dew Point';
      recTank = '300L Epoxy Coated Vessel';
      recPressStr = '8 Bar (Zero Oil)';
    } else {
      // Standard Rotary Screw based on CFM
      if (designCfm <= 25) {
        recModel = 'UMA-9-7.5';
        recHp = '7.5 HP / 5.5 KW';
        recDryer = 'UMA-9-40 (40 CFM)';
        recTank = '250 Liters';
      } else if (designCfm <= 40) {
        recModel = 'UMA-9-10';
        recHp = '10 HP / 7.5 KW';
        recDryer = 'UMA-9-60 (60 CFM)';
        recTank = '300 Liters';
      } else if (designCfm <= 60) {
        recModel = 'UMA-9-15';
        recHp = '15 HP / 11 KW';
        recDryer = 'UMA-9-80 (80 CFM)';
        recTank = '500 Liters';
      } else if (designCfm <= 85) {
        recModel = 'UMA-9-20';
        recHp = '20 HP / 15 KW';
        recDryer = 'UMA-9-100 (100 CFM)';
        recTank = '500 Liters';
      } else if (designCfm <= 110) {
        recModel = 'UMA-9-25';
        recHp = '25 HP / 18 KW';
        recDryer = 'UMA-9-150 (150 CFM)';
        recTank = '500 Liters';
      } else if (designCfm <= 135) {
        recModel = 'UMA-9-30';
        recHp = '30 HP / 22 KW';
        recDryer = 'UMA-9-150 (150 CFM)';
        recTank = '1000 Liters';
      } else if (designCfm <= 170) {
        recModel = 'UMA-9-40';
        recHp = '40 HP / 30 KW';
        recDryer = 'UMA-9-200 (200 CFM)';
        recTank = '1000 Liters';
      } else if (designCfm <= 230) {
        recModel = 'UMA-9-50';
        recHp = '50 HP / 37 KW';
        recDryer = 'UMA-9-250 (250 CFM)';
        recTank = '1500 Liters';
      } else if (designCfm <= 290) {
        recModel = 'UMA-9-60';
        recHp = '60 HP / 45 KW';
        recDryer = 'UMA-9-300 (300 CFM)';
        recTank = '2000 Liters';
      } else if (designCfm <= 360) {
        recModel = 'UMA-9-75';
        recHp = '75 HP / 55 KW';
        recDryer = 'UMA-9-400 (400 CFM)';
        recTank = '2000 Liters';
      } else {
        recModel = 'UMA-9-100';
        recHp = '100 HP / 75 KW';
        recDryer = 'UMA-9-500 (500 CFM)';
        recTank = '3000 Liters';
      }
    }

    outModel.textContent = recModel;
    outHP.textContent = recHp;
    outDryer.textContent = recDryer;
    outTank.textContent = recTank;
    outPressure.textContent = recPressStr;

    // Update WhatsApp link
    const textMsg = encodeURIComponent(
      `Hello Umiya Corporation! I calculated my air requirement on your website:\n` +
      `- Application: ${industrySelect.options[industrySelect.selectedIndex].text}\n` +
      `- Required CFM: ${cfm} CFM\n` +
      `- Working Pressure: ${pressureSelect.value} Bar\n` +
      `- Recommended System: ${recModel} (${recHp}) with ${recDryer} & ${recTank} Tank.\n` +
      `Please provide best pricing, brochure & availability.`
    );
    if (whatsappCta) {
      whatsappCta.href = `https://wa.me/919426878342?text=${textMsg}`;
    }
  }

  industrySelect.addEventListener('change', calculateRequirements);
  pressureSelect.addEventListener('change', calculateRequirements);
  cfmInput.addEventListener('input', calculateRequirements);
  toolCountInput.addEventListener('input', calculateRequirements);

  // Run initial calculation
  calculateRequirements();
}

/* ===================================================================
   7. ENERGY SAVINGS ESTIMATOR
   =================================================================== */
function initEnergyEstimator() {
  const hpInput = document.getElementById('energyHp');
  const hoursInput = document.getElementById('energyHours');
  const tariffInput = document.getElementById('energyTariff');
  const outSavingsKwh = document.getElementById('savingsKwh');
  const outSavingsInr = document.getElementById('savingsInr');

  if (!hpInput || !hoursInput || !tariffInput) return;

  function calcSavings() {
    const hp = parseFloat(hpInput.value) || 30;
    const hours = parseFloat(hoursInput.value) || 16;
    const tariff = parseFloat(tariffInput.value) || 8.5; // ₹8.5/unit average industrial tariff in Gujarat

    const kw = hp * 0.746;
    // Typical PM-VFD screw compressor saves ~30% power over standard unloader/piston cycles
    const annualKwhSaved = Math.round(kw * hours * 300 * 0.30);
    const annualInrSaved = Math.round(annualKwhSaved * tariff);

    if (outSavingsKwh) outSavingsKwh.textContent = annualKwhSaved.toLocaleString('en-IN') + ' kWh / Year';
    if (outSavingsInr) outSavingsInr.textContent = '₹ ' + annualInrSaved.toLocaleString('en-IN') + ' / Year';
  }

  hpInput.addEventListener('input', calcSavings);
  hoursInput.addEventListener('input', calcSavings);
  tariffInput.addEventListener('input', calcSavings);

  calcSavings();
}

/* ===================================================================
   8. FAQ ACCORDION
   =================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ===================================================================
   9. FOOLPROOF CONTACT & RFQ FORM WITH WHATSAPP & MODAL CONFIRMATION
   =================================================================== */
function initContactForm() {
  const form = document.getElementById('rfqForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('rfqName').value.trim();
    const phone = document.getElementById('rfqPhone').value.trim();
    const email = document.getElementById('rfqEmail').value.trim();
    const company = document.getElementById('rfqCompany').value.trim();
    const product = document.getElementById('rfqProduct').value;
    const notes = document.getElementById('rfqNotes').value.trim();

    if (!name || !phone) {
      showToast('⚠️ Please enter your Full Name and Mobile Number.');
      return;
    }

    // Prepare human-readable WhatsApp message
    const rawMessage = 
      `*New Quotation Request - Umiya Corporation*\n\n` +
      `👤 *Name:* ${name}\n` +
      `📞 *Mobile:* ${phone}\n` +
      `🏢 *Company:* ${company || 'N/A'}\n` +
      `✉️ *Email:* ${email || 'N/A'}\n` +
      `⚙️ *Product Needed:* ${product}\n` +
      `📝 *Notes:* ${notes || 'Looking for pricing and technical catalog'}\n` +
      `📍 *Location:* Gujarat, India`;

    const encodedMessage = encodeURIComponent(rawMessage);

    // Desktop WhatsApp Web vs Mobile WhatsApp App URLs
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const waWebUrl = `https://web.whatsapp.com/send?phone=919426878342&text=${encodedMessage}`;
    const waAppUrl = `https://api.whatsapp.com/send?phone=919426878342&text=${encodedMessage}`;
    const mailtoUrl = `mailto:umiyacorp@gmail.com?subject=Quotation%20Request%20-%20${encodeURIComponent(product)}&body=${encodeURIComponent(rawMessage.replace(/\*/g, ''))}`;

    // 1. Immediately launch appropriate WhatsApp URL synchronously
    try {
      const targetUrl = isMobile ? waAppUrl : waWebUrl;
      const opened = window.open(targetUrl, '_blank');
      if (!opened) {
        // If popup was blocked by browser, try fallback
        console.warn('Popup blocked, modal fallback active');
      }
    } catch (err) {
      console.warn('Direct launch error:', err);
    }

    // 2. Display on-screen Success Modal with zero chance of being lost
    showSuccessModal({
      name,
      phone,
      company,
      email,
      product,
      waWebUrl,
      waAppUrl,
      mailtoUrl,
      rawMessage
    });

    // 3. Store in local storage for persistence
    try {
      const inquiries = JSON.parse(localStorage.getItem('umiya_inquiries') || '[]');
      inquiries.push({ name, phone, email, company, product, date: new Date().toISOString() });
      localStorage.setItem('umiya_inquiries', JSON.stringify(inquiries));
    } catch (e) {}

    showToast('✅ Quotation request generated successfully!');
  });
}

function showSuccessModal(data) {
  let modalOverlay = document.getElementById('quoteSuccessModal');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'quoteSuccessModal';
    modalOverlay.className = 'modal-overlay';
    document.body.appendChild(modalOverlay);
  }

  modalOverlay.innerHTML = `
    <div class="modal-dialog">
      <button class="modal-close-btn" id="modalCloseBtn" aria-label="Close Modal">&times;</button>
      <div class="modal-header-icon">✓</div>
      <h3 class="modal-title">Quotation Request Prepared!</h3>
      <p class="modal-subtitle">Thank you, <strong>${data.name}</strong>. Your inquiry has been processed.</p>

      <div class="modal-summary-box">
        <div class="modal-summary-row">
          <span class="modal-summary-label">Selected Equipment:</span>
          <span class="modal-summary-val" style="color: var(--gold-400);">${data.product}</span>
        </div>
        <div class="modal-summary-row">
          <span class="modal-summary-label">Mobile Number:</span>
          <span class="modal-summary-val">${data.phone}</span>
        </div>
        ${data.company ? `
        <div class="modal-summary-row">
          <span class="modal-summary-label">Company / Factory:</span>
          <span class="modal-summary-val">${data.company}</span>
        </div>` : ''}
        <div class="modal-summary-row">
          <span class="modal-summary-label">Target Support:</span>
          <span class="modal-summary-val">Umiya Corporation (Unjha)</span>
        </div>
      </div>

      <div class="modal-cta-buttons">
        <a href="${data.waWebUrl}" target="_blank" class="btn btn-whatsapp btn-lg" style="width: 100%;">
          💬 Open in WhatsApp Web (Desktop)
        </a>
        <a href="${data.waAppUrl}" target="_blank" class="btn btn-outline" style="width: 100%; border-color: #25d366; color: #25d366;">
          📱 Open in WhatsApp App (Mobile/PC)
        </a>
        <div class="modal-direct-actions">
          <a href="tel:+919426878342" class="btn btn-gold btn-sm">
            📞 Direct Call: 94268 78342
          </a>
          <a href="${data.mailtoUrl}" class="btn btn-outline btn-sm">
            ✉️ Email Inquiry
          </a>
        </div>
        <button id="copyInquiryBtn" class="btn btn-outline btn-sm" style="margin-top: 0.4rem;">
          📋 Copy Inquiry Details
        </button>
      </div>
    </div>
  `;

  modalOverlay.classList.add('active');

  // Close handlers
  const closeBtn = document.getElementById('modalCloseBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('active');
    }
  });

  // Copy handler
  const copyBtn = document.getElementById('copyInquiryBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(data.rawMessage).then(() => {
        copyBtn.textContent = '✅ Copied to Clipboard!';
        setTimeout(() => { copyBtn.textContent = '📋 Copy Inquiry Details'; }, 2500);
      });
    });
  }
}

/* ===================================================================
   10. TOAST NOTIFICATION UTILITY
   =================================================================== */
function showToast(message) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>${message}</span>`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
