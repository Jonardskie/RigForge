/**
 * RigForge Main Theme Script & Checkout Engine
 */
(function () {
  'use strict';

  // Mobile Menu Toggle
  function initMobileNav() {
    const toggleBtn = document.querySelector('.mobile-menu');
    const nav = document.querySelector('.desktop-nav');
    if (toggleBtn && nav) {
      toggleBtn.addEventListener('click', () => {
        const isOpen = nav.style.display === 'flex';
        nav.style.display = isOpen ? 'none' : 'flex';
        nav.style.flexDirection = 'column';
        nav.style.position = 'absolute';
        nav.style.top = '76px';
        nav.style.left = '0';
        nav.style.right = '0';
        nav.style.background = '#FFFFFF';
        nav.style.padding = '20px 5vw';
        nav.style.borderBottom = '1px solid var(--line)';
        nav.style.boxShadow = '0 10px 25px rgba(15, 23, 42, 0.08)';
      });
    }
  }

  // Workload Performance Profiles Selector
  function initProfileSelector() {
    const profileCards = document.querySelectorAll('.profile-card');
    if (!profileCards.length) return;

    profileCards.forEach((card) => {
      card.addEventListener('click', () => {
        profileCards.forEach((c) => c.classList.remove('selected'));
        card.classList.add('selected');
      });
    });
  }

  // Checkout Modal Controller
  function initCheckoutModal() {
    const modal = document.getElementById('mock-checkout-modal');
    if (!modal) return;

    const formView = document.getElementById('checkout-form-view');
    const successView = document.getElementById('checkout-success-view');
    const summaryId = document.getElementById('checkout-summary-id');
    const summaryPrice = document.getElementById('checkout-summary-price');
    const dispatchBtn = document.getElementById('btn-dispatch-order');
    const successOrderNum = document.getElementById('checkout-success-order-num');

    function openCheckout() {
      const savedBuild = localStorage.getItem('rigforge_last_build');
      let manifest = { buildId: 'RF-8492', totalPriceFormatted: '$2,934.00', totalDraw: 605, recommendedPsu: 750, totalPrice: 293400, parts: {} };
      
      if (savedBuild) {
        try {
          manifest = JSON.parse(savedBuild);
        } catch (e) {
          console.warn('Could not parse saved build', e);
        }
      }

      if (summaryId) summaryId.textContent = `BUILD ID: ${manifest.buildId || 'RF-CUSTOM'}`;
      if (summaryPrice) summaryPrice.textContent = manifest.totalPriceFormatted || '$2,934.00';

      if (formView) formView.style.display = 'block';
      if (successView) successView.style.display = 'none';

      modal.hidden = false;
      document.body.style.overflow = 'hidden';
    }

    function closeCheckout() {
      modal.hidden = true;
      document.body.style.overflow = '';
    }

    // Bind close buttons
    modal.querySelectorAll('[data-close-checkout]').forEach((btn) => {
      btn.addEventListener('click', closeCheckout);
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeCheckout();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hidden) closeCheckout();
    });

    // Handle Order Submission
    if (dispatchBtn) {
      dispatchBtn.addEventListener('click', async () => {
        const nameInput = document.getElementById('checkout-name');
        const emailInput = document.getElementById('checkout-email');
        const addressInput = document.getElementById('checkout-address');

        const customerName = nameInput ? nameInput.value : 'Alex Rivers';
        const customerEmail = emailInput ? emailInput.value : 'alex.rivers@rigforge.io';
        const customerAddress = addressInput ? addressInput.value : '742 Precision Blvd, SF';

        const savedBuild = localStorage.getItem('rigforge_last_build');
        let manifest = { buildId: 'RF-8492', totalPrice: 293400, totalDraw: 605, recommendedPsu: 750, parts: {} };
        if (savedBuild) {
          try { manifest = JSON.parse(savedBuild); } catch (e) {}
        }

        const orderNumber = `#RF-${Math.floor(1000 + Math.random() * 9000)}`;

        dispatchBtn.disabled = true;
        dispatchBtn.innerHTML = `DISPATCHING ORDER TO BACKEND...`;

        const orderPayload = {
          orderNumber,
          customerName,
          customerEmail,
          customerAddress,
          profile: manifest.profile || 'CUSTOM',
          totalWatts: manifest.totalDraw || 605,
          recommendedPsu: manifest.recommendedPsu || 750,
          totalPrice: manifest.totalPrice || 293400,
          items: Object.entries(manifest.parts || {}).map(([cat, part]) => ({
            name: part.name,
            category: cat,
            price: part.price || 0,
            watts: part.watts || 0
          }))
        };

        try {
          // POST to live backend server
          await fetch('http://localhost:3001/api/builds', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderPayload)
          });
        } catch (err) {
          console.warn('Backend offline or note:', err);
        }

        // Show success state
        if (successOrderNum) successOrderNum.textContent = `Order ${orderNumber} Confirmed!`;
        if (formView) formView.style.display = 'none';
        if (successView) successView.style.display = 'block';

        // Clear last build from local storage
        localStorage.removeItem('rigforge_last_build');
        dispatchBtn.disabled = false;
        dispatchBtn.innerHTML = `PLACE ORDER & DISPATCH TO MERCHANT ADMIN <span>↗</span>`;
      });
    }

    // Expose globally
    window.openRigCheckout = openCheckout;
  }

  // Cart Page Dynamic Build Manifest Reader
  function initCartManifest() {
    const cartWrap = document.querySelector('.cart-wrap');
    if (!cartWrap) return;

    // Attach checkout opener to checkout buttons
    document.querySelectorAll('button[name="checkout"], [data-open-checkout]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.openRigCheckout) {
          window.openRigCheckout();
        }
      });
    });

    const savedBuild = localStorage.getItem('rigforge_last_build');
    if (!savedBuild) return;

    try {
      const manifest = JSON.parse(savedBuild);
      const emptyState = cartWrap.querySelector('div[style*="text-align: center"]');
      if (emptyState && manifest.parts && Object.keys(manifest.parts).length > 0) {
        // Construct dynamic manifest view
        const partsListHtml = Object.entries(manifest.parts).map(([cat, part]) => `
          <tr>
            <td>
              <span class="cart-item-title">${part.name}</span>
              <span class="cart-item-meta">${cat} · ${part.meta || ''}</span>
            </td>
            <td>1</td>
            <td style="text-align: right;"><strong style="color: var(--amber); font-size: 16px;">${part.priceFormatted || '$0'}</strong></td>
          </tr>
        `).join('');

        emptyState.outerHTML = `
          <div style="margin-top: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; background: #FFFFFF; padding: 14px 20px; border-radius: var(--radius-md); border: 1px solid var(--line); box-shadow: var(--neu-raised-sm);">
              <span style="font: 12px var(--font-mono); font-weight: 700; color: var(--text-main);">CUSTOM RIG BUNDLE: <strong style="color: var(--amber);">${manifest.buildId}</strong></span>
              <span style="font: 11px var(--font-mono); color: var(--green); font-weight: 600;">● ALL COMPATIBILITY CHECKS VERIFIED</span>
            </div>

            <table class="cart-table">
              <thead>
                <tr>
                  <th>CONFIGURED COMPONENT</th>
                  <th>QTY</th>
                  <th style="text-align: right;">PRICE</th>
                </tr>
              </thead>
              <tbody>
                ${partsListHtml}
              </tbody>
            </table>

            <div class="cart-summary">
              <div>
                <button type="button" class="outline-button" data-open-builder>RE-EDIT THIS BUILD</button>
              </div>
              <div style="text-align: right;">
                <span class="eyebrow">ESTIMATED SYSTEM TOTAL</span>
                <div class="cart-total">${manifest.totalPriceFormatted}</div>
                <p style="color: var(--text-muted); font-size: 12px; margin: 8px 0 20px;">
                  Estimated draw: ${manifest.totalDraw}W · PSU requirement: ${manifest.recommendedPsu}W+
                </p>
                <button type="button" class="primary-button" style="height: 52px; padding: 0 32px; width: 100%;" onclick="window.openRigCheckout ? window.openRigCheckout() : null">
                  PROCEED TO SECURE CHECKOUT <span>↗</span>
                </button>
              </div>
            </div>
          </div>
        `;
      }
    } catch (e) {
      console.error('Error rendering cart manifest:', e);
    }
  }

  // Auto-init on load
  document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initProfileSelector();
    initCheckoutModal();
    initCartManifest();
  });
})();
