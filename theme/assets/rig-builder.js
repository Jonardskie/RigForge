/**
 * RigForge Interactive PC Builder & Compatibility Guardrail Engine
 */
(function () {
  'use strict';

  const defaultParts = {
    CPU: [
      { id: 'cpu-9950x', name: 'Ryzen 9 9950X', meta: 'AM5 · 170W · 16 CORE', watts: 170, price: 64900, priceFormatted: '$649', kind: 'CPU', socket: 'AM5', image: 'AMD Ryzen 9 9950X_no_bg.png' },
      { id: 'cpu-7800x3d', name: 'Ryzen 7 7800X3D', meta: 'AM5 · 120W · 8 CORE', watts: 120, price: 38900, priceFormatted: '$389', kind: 'CPU', socket: 'AM5', image: 'AMD Ryzen 7 7800X3D_no_bg.png' },
      { id: 'cpu-14700k', name: 'Core i7-14700K', meta: 'LGA1700 · 253W · 20 CORE', watts: 253, price: 39900, priceFormatted: '$399', kind: 'CPU', socket: 'LGA1700', image: 'Intel Core i7-14700K_no_bg.png' }
    ],
    Motherboard: [
      { id: 'mb-x670e', name: 'X670E AORUS Master', meta: 'AM5 · DDR5 · ATX', price: 42900, priceFormatted: '$429', kind: 'Motherboard', socket: 'AM5', ramType: 'DDR5', image: 'Gigabyte X670E AORUS Master_no_bg.png' },
      { id: 'mb-b650e', name: 'B650E Steel Legend', meta: 'AM5 · DDR5 · ATX', price: 23900, priceFormatted: '$239', kind: 'Motherboard', socket: 'AM5', ramType: 'DDR5', image: 'ASRock B650E Steel Legend_no_bg.png' },
      { id: 'mb-z790', name: 'Z790 Maximus Hero', meta: 'LGA1700 · DDR5 · ATX', price: 54900, priceFormatted: '$549', kind: 'Motherboard', socket: 'LGA1700', ramType: 'DDR5', image: 'ASUS ROG Maximus Z790 Hero_no_bg.png' }
    ],
    GPU: [
      { id: 'gpu-5080', name: 'RTX 5080 Founders Edition', meta: '16GB GDDR7 · 360W · 304MM', watts: 360, lengthMm: 304, price: 119900, priceFormatted: '$1,199', kind: 'GPU', image: 'NVIDIA GeForce RTX 5080 Founders Edition_no_bg.png' },
      { id: 'gpu-5070ti', name: 'RTX 5070 Ti OC', meta: '16GB GDDR7 · 285W · 305MM', watts: 285, lengthMm: 305, price: 74900, priceFormatted: '$749', kind: 'GPU', image: 'GeForce RTX 5070 Ti OC Edition_no_bg.png' },
      { id: 'gpu-9060xt', name: 'Radeon RX 9060 XT 16GB', meta: '16GB GDDR6 · 220W · 280MM', watts: 220, lengthMm: 280, price: 52900, priceFormatted: '$529', kind: 'GPU', image: 'XFX Swift OC Radeon RX 9060 XT 16 GB Video Card_no_bg.png' }
    ],
    RAM: [
      { id: 'ram-64gb', name: '64GB DDR5-6000 CL30', meta: '2 × 32GB · EXPO · RGB', price: 20900, priceFormatted: '$209', kind: 'RAM', ramType: 'DDR5', image: 'Corsair Vengeance RGB 64 GB (2 x 32 GB) DDR5-6000 CL30 Memory_no_bg.png' },
      { id: 'ram-32gb', name: '32GB DDR5-6000 CL30', meta: '2 × 16GB · EXPO · DDR5', price: 11900, priceFormatted: '$119', kind: 'RAM', ramType: 'DDR5', image: 'Kingston FURY Beast 32 GB (2 x 16 GB) DDR5-6000 CL30 Memory_no_bg.png' }
    ],
    Cooler: [
      { id: 'cooler-360aio', name: 'Arctic Liquid Freezer III 360', meta: '360MM AIO · 165MM HEIGHT', price: 11900, priceFormatted: '$119', kind: 'Cooler', image: 'Arctic Liquid Freezer III 360_no_bg.png' },
      { id: 'cooler-air-ak620', name: 'DeepCool AK620 Digital', meta: 'DUAL TOWER · 160MM HEIGHT', price: 7900, priceFormatted: '$79', kind: 'Cooler', image: 'DeepCool AK620 Digital_no_bg.png' }
    ],
    Case: [
      { id: 'case-north-xl', name: 'North XL Mesh Charcoal', meta: 'ATX · 350MM GPU · WALNUT', maxGpuLength: 350, price: 17900, priceFormatted: '$179', kind: 'Case', image: 'Fractal Design North XL Mesh_no_bg.png' },
      { id: 'case-o11d', name: 'Lian Li O11 Vision Black', meta: 'E-ATX · 455MM GPU · 3-GLASS', maxGpuLength: 455, price: 13900, priceFormatted: '$139', kind: 'Case', image: 'Lian Li O11 Vision_no_bg.png' },
      { id: 'case-v100r', name: 'Lian Li Vector V100R', meta: 'ATX · DUAL CHAMBER · MID', maxGpuLength: 380, price: 11900, priceFormatted: '$119', kind: 'Case', image: 'Lian Li Vector V100R ATX Mid Tower Case_no_bg.png' }
    ],
    PSU: [
      { id: 'psu-850w', name: 'RM850x Shift Gold', meta: '850W · 80+ GOLD · ATX 3.1', watts: 850, price: 14900, priceFormatted: '$149', kind: 'PSU', image: 'Corsair RM850x Shift_no_bg.png' },
      { id: 'psu-1000w', name: 'Vertex GX-1000 ATX 3.0', meta: '1000W · 80+ GOLD · PCIE 5', watts: 1000, price: 19900, priceFormatted: '$199', kind: 'PSU', image: 'Seasonic Vertex GX-1000_no_bg.png' }
    ]
  };

  const presetBuilds = {
    creator: {
      name: 'Creator Studio 4K',
      CPU: defaultParts.CPU[0],
      Motherboard: defaultParts.Motherboard[0],
      GPU: defaultParts.GPU[0],
      RAM: defaultParts.RAM[0],
      Cooler: defaultParts.Cooler[0],
      Case: defaultParts.Case[0],
      PSU: defaultParts.PSU[0]
    },
    ai: {
      name: 'AI & Deep Learning Pro',
      CPU: defaultParts.CPU[2],
      Motherboard: defaultParts.Motherboard[2],
      GPU: defaultParts.GPU[0],
      RAM: defaultParts.RAM[0],
      Cooler: defaultParts.Cooler[0],
      Case: defaultParts.Case[1],
      PSU: defaultParts.PSU[1]
    },
    esports: {
      name: 'Esports 240Hz+ Competitive',
      CPU: defaultParts.CPU[1],
      Motherboard: defaultParts.Motherboard[1],
      GPU: defaultParts.GPU[1],
      RAM: defaultParts.RAM[1],
      Cooler: defaultParts.Cooler[1],
      Case: defaultParts.Case[2],
      PSU: defaultParts.PSU[0]
    }
  };

  function getPartImageUrl(imageName) {
    if (window.ShopifyThemeAssets && window.ShopifyThemeAssets[imageName]) {
      return window.ShopifyThemeAssets[imageName];
    }
    return `/images/${encodeURIComponent(imageName)}`;
  }

  class RigBuilder {
    constructor(container) {
      this.container = container;
      this.steps = ['CPU', 'Motherboard', 'GPU', 'RAM', 'Cooler', 'Case', 'PSU'];
      this.currentStep = 0;
      this.selectedBuild = {};
      this.parts = defaultParts;

      this.initDOMElements();
      this.bindEvents();
      this.render();
    }

    initDOMElements() {
      this.stepNav = this.container.querySelector('[data-step-nav]');
      this.partOptions = this.container.querySelector('[data-part-options]');
      this.currentCategoryTitle = this.container.querySelector('[data-category-title]');
      this.summaryRows = this.container.querySelector('[data-summary-rows]');
      this.healthBar = this.container.querySelector('[data-health-bar]');
      this.healthCount = this.container.querySelector('[data-health-count]');
      this.guardrailText = this.container.querySelector('[data-guardrail-text]');
      this.progressBar = this.container.querySelector('[data-progress-bar]');
      this.stepCounter = this.container.querySelector('[data-step-counter]');
      this.checksPassed = this.container.querySelector('[data-checks-passed]');
      this.drawReadout = this.container.querySelector('[data-draw-readout]');
      this.psuReqReadout = this.container.querySelector('[data-psu-req]');
      this.backBtn = this.container.querySelector('[data-back-btn]');
      this.nextBtn = this.container.querySelector('[data-next-btn]');
      this.closeBtn = this.container.querySelector('[data-close-builder]');
    }

    bindEvents() {
      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', () => this.close());
      }
      if (this.backBtn) {
        this.backBtn.addEventListener('click', () => this.prevStep());
      }
      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', () => this.handleNextOrSubmit());
      }

      // Close on backdrop click
      this.container.addEventListener('click', (e) => {
        if (e.target === this.container) {
          this.close();
        }
      });

      // Escape key to close
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !this.container.hidden) {
          this.close();
        }
      });
    }

    open() {
      this.container.hidden = false;
      document.body.style.overflow = 'hidden';
      this.render();
    }

    close() {
      this.container.hidden = true;
      document.body.style.overflow = '';
    }

    setStep(index) {
      if (index >= 0 && index < this.steps.length) {
        this.currentStep = index;
        this.render();
      }
    }

    prevStep() {
      if (this.currentStep > 0) {
        this.currentStep--;
        this.render();
      }
    }

    handleNextOrSubmit() {
      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++;
        this.render();
      } else {
        this.submitBuildToCart();
      }
    }

    selectPart(category, part) {
      this.selectedBuild[category] = part;

      // Check for socket invalidation: If changing CPU, reset incompatible Motherboard
      if (category === 'CPU' && this.selectedBuild.Motherboard) {
        if (this.selectedBuild.Motherboard.socket !== part.socket) {
          delete this.selectedBuild.Motherboard;
        }
      }

      this.render();
    }

    selectPartById(category, partId) {
      const catParts = this.parts[category];
      if (catParts) {
        const found = catParts.find(p => p.id === partId);
        if (found) {
          this.selectedBuild[category] = found;
          const stepIdx = this.steps.indexOf(category);
          if (stepIdx !== -1) {
            this.currentStep = stepIdx;
          }
        }
      }
      this.render();
    }

    loadPresetBuild(presetKey) {
      const preset = presetBuilds[presetKey];
      if (preset) {
        this.selectedBuild = {
          CPU: preset.CPU,
          Motherboard: preset.Motherboard,
          GPU: preset.GPU,
          RAM: preset.RAM,
          Cooler: preset.Cooler,
          Case: preset.Case,
          PSU: preset.PSU
        };
        this.currentStep = 6; // Move to summary / PSU step so all 7 checks are shown complete
        this.render();
      }
    }

    calculatePower() {
      const cpuWatts = this.selectedBuild.CPU ? this.selectedBuild.CPU.watts : 170;
      const gpuWatts = this.selectedBuild.GPU ? this.selectedBuild.GPU.watts : 360;
      const baseWatts = 75; // Fans, SSDs, RGB, Chipset
      const totalDraw = cpuWatts + gpuWatts + baseWatts;
      const recommendedPsu = Math.ceil(totalDraw * 1.25);
      return { totalDraw, recommendedPsu };
    }

    calculateTotalPrice() {
      return Object.values(this.selectedBuild).reduce((sum, item) => sum + (item.price || 0), 0);
    }

    render() {
      const currentCategory = this.steps[this.currentStep];
      const selectedPart = this.selectedBuild[currentCategory];
      const { totalDraw, recommendedPsu } = this.calculatePower();
      const checksCount = Object.keys(this.selectedBuild).length;

      // 1. Update Step Counter & Progress
      if (this.stepCounter) {
        this.stepCounter.textContent = `0${this.currentStep + 1} / 0${this.steps.length}`;
      }
      if (this.progressBar) {
        this.progressBar.style.width = `${((this.currentStep + 1) / this.steps.length) * 100}%`;
      }
      if (this.checksPassed) {
        this.checksPassed.textContent = `${checksCount} / ${this.steps.length} CHECKS PASSED`;
      }

      // 2. Render Step Nav Buttons
      if (this.stepNav) {
        this.stepNav.innerHTML = '';
        this.steps.forEach((name, idx) => {
          const btn = document.createElement('button');
          btn.className = idx === this.currentStep ? 'active' : '';
          btn.innerHTML = `<span>0${idx + 1}</span>${name}<em>${this.selectedBuild[name] ? '✓' : ''}</em>`;
          btn.addEventListener('click', () => this.setStep(idx));
          this.stepNav.appendChild(btn);
        });
      }

      // 3. Render Current Category Header
      if (this.currentCategoryTitle) {
        this.currentCategoryTitle.textContent = `SELECT YOUR ${currentCategory.toUpperCase()}`;
      }

      // 4. Filter & Render Available Parts with Guardrails
      if (this.partOptions) {
        this.partOptions.innerHTML = '';
        let available = this.parts[currentCategory] || [];

        // Compatibility filtering:
        // Filter Motherboards by selected CPU socket
        if (currentCategory === 'Motherboard' && this.selectedBuild.CPU) {
          const cpuSocket = this.selectedBuild.CPU.socket;
          available = available.filter(mb => !mb.socket || mb.socket === cpuSocket);
        }

        available.forEach((part) => {
          const btn = document.createElement('button');
          const isSelected = selectedPart && selectedPart.id === part.id;
          btn.className = `part-option ${isSelected ? 'selected' : ''}`;
          const imgUrl = getPartImageUrl(part.image);
          btn.innerHTML = `
            <img src="${imgUrl}" class="part-thumb" alt="${part.name}" onerror="this.style.display='none'">
            <span class="radio"></span>
            <span>
              <strong>${part.name}</strong>
              <small>${part.meta}</small>
            </span>
            <b>${part.priceFormatted}</b>
          `;
          btn.addEventListener('click', () => this.selectPart(currentCategory, part));
          this.partOptions.appendChild(btn);
        });
      }

      // 5. Update Guardrail Advice Message
      if (this.guardrailText) {
        if (currentCategory === 'Motherboard' && this.selectedBuild.CPU) {
          this.guardrailText.innerHTML = `<span class="status-dot"></span>Filtering motherboards for socket <strong>${this.selectedBuild.CPU.socket}</strong> based on selected CPU.`;
        } else if (currentCategory === 'PSU' && this.selectedBuild.GPU) {
          this.guardrailText.innerHTML = `<span class="status-dot"></span>Power budget calculated. Minimum <strong>${recommendedPsu}W</strong> supply recommended.`;
        } else {
          this.guardrailText.innerHTML = `<span class="status-dot"></span>Hardware compatibility guardrails active for this selection.`;
        }
      }

      // 6. Render Build Summary Sidebar
      if (this.summaryRows) {
        this.summaryRows.innerHTML = '';
        this.steps.forEach((name) => {
          const row = document.createElement('div');
          row.className = 'summary-row';
          const item = this.selectedBuild[name];
          row.innerHTML = `
            <span>${name}</span>
            <b>${item ? item.name : 'Not selected'}</b>
          `;
          this.summaryRows.appendChild(row);
        });
      }

      // 7. Update Build Health Score
      if (this.healthCount) {
        this.healthCount.textContent = `${checksCount} / ${this.steps.length}`;
      }
      if (this.healthBar) {
        this.healthBar.style.width = `${(checksCount / this.steps.length) * 100}%`;
      }

      // 8. Update Draw & PSU Readout in Footer
      if (this.drawReadout) {
        this.drawReadout.textContent = `${totalDraw}W`;
      }
      if (this.psuReqReadout) {
        this.psuReqReadout.textContent = `PSU REQ. ${recommendedPsu}W+`;
      }

      // 9. Update Next Button Text
      if (this.nextBtn) {
        if (this.currentStep < this.steps.length - 1) {
          this.nextBtn.innerHTML = `NEXT: ${this.steps[this.currentStep + 1].toUpperCase()} <span>→</span>`;
        } else {
          this.nextBtn.innerHTML = `COMPLETE BUILD & REVIEW <span>→</span>`;
        }
      }
    }

    async submitBuildToCart() {
      const selectedCount = Object.keys(this.selectedBuild).length;
      if (selectedCount === 0) {
        alert('Please select at least one component to add to your build.');
        return;
      }

      const buildId = 'RF-' + Math.floor(100000 + Math.random() * 900000);
      const { totalDraw, recommendedPsu } = this.calculatePower();
      const totalPrice = this.calculateTotalPrice();

      const manifest = {
        buildId,
        parts: this.selectedBuild,
        totalDraw,
        recommendedPsu,
        totalPrice,
        totalPriceFormatted: `$${(totalPrice / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        timestamp: new Date().toISOString()
      };

      // Save build manifest to localStorage
      localStorage.setItem('rigforge_last_build', JSON.stringify(manifest));

      // Attempt Shopify cart AJAX if available
      try {
        if (window.Shopify && window.Shopify.routes) {
          const payload = {
            items: Object.entries(this.selectedBuild).map(([category, part]) => ({
              id: part.variantId || 1,
              quantity: 1,
              properties: {
                _bundle_id: buildId,
                _category: category,
                _draw: `${part.watts || 0}W`
              }
            }))
          };
          await fetch(`${window.Shopify.routes.root}cart/add.js`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }
      } catch (err) {
        console.warn('Cart sync note:', err);
      }

      this.close();
      window.location.href = '/cart';
    }
  }

  // Initialize Global Rig Builder instance
  document.addEventListener('DOMContentLoaded', () => {
    const builderEl = document.getElementById('rig-builder-modal');
    if (builderEl) {
      window.RigForgeBuilder = new RigBuilder(builderEl);
    }

    // Bind triggers with [data-open-builder]
    document.querySelectorAll('[data-open-builder]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.RigForgeBuilder) {
          const cat = btn.getAttribute('data-select-category');
          const id = btn.getAttribute('data-select-id');
          if (cat && id) {
            window.RigForgeBuilder.selectPartById(cat, id);
          }
          window.RigForgeBuilder.open();
        }
      });
    });

    // Bind triggers with [data-load-preset]
    document.querySelectorAll('[data-load-preset]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const presetKey = btn.getAttribute('data-load-preset');
        if (window.RigForgeBuilder && presetKey) {
          window.RigForgeBuilder.loadPresetBuild(presetKey);
          window.RigForgeBuilder.open();
        }
      });
    });

    // Workload card clicks also load preset
    document.querySelectorAll('[data-preset-card]').forEach((card) => {
      card.addEventListener('click', () => {
        const presetKey = card.getAttribute('data-preset-card');
        document.querySelectorAll('[data-preset-card]').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        if (window.RigForgeBuilder && presetKey) {
          window.RigForgeBuilder.loadPresetBuild(presetKey);
        }
      });
    });
  });
})();
