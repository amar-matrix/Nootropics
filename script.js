/* ═══════════════════════════════════════════════
   GUTROOTZ — CONSOLIDATED SCRIPT
   ═══════════════════════════════════════════════ */

(() => {
  'use strict';

  /* ─── PARTICLES BACKGROUND ─── */
  const canvas = document.getElementById('particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, dots = [];
    const COLORS = ['#1e6e46', '#b84a2e', '#3d8a96', '#c4863a'];
    const COUNT = 50;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    function init() {
      resize();
      dots = [];
      for (let i = 0; i < COUNT; i++) {
        dots.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 2.5 + 1,
          dx: (Math.random() - 0.5) * 0.4,
          dy: (Math.random() - 0.5) * 0.4,
          c: COLORS[Math.floor(Math.random() * COLORS.length)]
        });
      }
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      dots.forEach(d => {
        d.x += d.dx;
        d.y += d.dy;
        if (d.x < 0 || d.x > w) d.dx *= -1;
        if (d.y < 0 || d.y > h) d.dy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = d.c;
        ctx.globalAlpha = 0.35;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    }
    init();
    draw();
    window.addEventListener('resize', resize);
  }

  /* ─── NAVBAR SCROLL ─── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ─── MOBILE MENU ─── */
  const toggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => navLinks.classList.remove('open'))
    );
  }

  /* ─── ANIMATED COUNTERS ─── */
  const counters = document.querySelectorAll('.stat-num');
  if (counters.length) {
    const animateCounter = (el) => {
      const target = +el.dataset.target;
      const duration = 2000;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(target * ease);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      };
      requestAnimationFrame(step);
    };
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          counterObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObs.observe(c));
  }

  /* ─── FAQ ACCORDION ─── */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
      btn.setAttribute('aria-expanded', !isOpen);
    });
  });

  /* ─── SCROLL REVEAL ─── */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => revealObs.observe(el));
  }

  /* ─── ACTIVE NAV HIGHLIGHT ─── */
  const sections = document.querySelectorAll('section[id]');
  if (sections.length) {
    const highlight = () => {
      const scrollY = window.scrollY + 120;
      sections.forEach(s => {
        const top = s.offsetTop;
        const h = s.offsetHeight;
        const id = s.getAttribute('id');
        const link = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (link) link.classList.toggle('active', scrollY >= top && scrollY < top + h);
      });
    };
    window.addEventListener('scroll', highlight, { passive: true });
  }

  /* ═══════════════════════════════════════════════
     SHOP — FILTER
  ═══════════════════════════════════════════════ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const shopCards = document.querySelectorAll('.shop-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      shopCards.forEach(card => {
        if (filter === 'all') {
          card.classList.remove('hidden');
        } else {
          const tags = card.dataset.tags || '';
          card.classList.toggle('hidden', !tags.includes(filter));
        }
      });
    });
  });

  /* ═══════════════════════════════════════════════
     SHOP — CART SYSTEM
  ═══════════════════════════════════════════════ */
  const cart = [];
  const toastEl = document.getElementById('cartToast');
  const toastMsg = document.getElementById('toastMsg');
  const toastClose = document.getElementById('toastClose');
  const cartCount = document.getElementById('cartCount');
  const cartFab = document.getElementById('cartFab');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const drawerClose = document.getElementById('drawerClose');
  const drawerItems = document.getElementById('drawerItems');
  const drawerFooter = document.getElementById('drawerFooter');
  const drawerTotal = document.getElementById('drawerTotal');

  function showToast(msg) {
    if (!toastEl) return;
    toastMsg.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastEl._timer);
    toastEl._timer = setTimeout(() => toastEl.classList.remove('show'), 3000);
  }
  if (toastClose) toastClose.addEventListener('click', () => toastEl.classList.remove('show'));

  function openDrawer() {
    if (cartDrawer) cartDrawer.classList.add('open');
    if (cartOverlay) cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    if (cartDrawer) cartDrawer.classList.remove('open');
    if (cartOverlay) cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (cartFab) cartFab.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (cartOverlay) cartOverlay.addEventListener('click', closeDrawer);

  function updateCartUI() {
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const count = cart.reduce((s, i) => s + i.qty, 0);
    if (cartCount) cartCount.textContent = count;

    if (!drawerItems) return;
    if (cart.length === 0) {
      drawerItems.innerHTML = '<p class="empty-cart">Your cart is empty.<br/><a href="#shop">Browse herbs →</a></p>';
      if (drawerFooter) drawerFooter.style.display = 'none';
    } else {
      drawerItems.innerHTML = cart.map((item, idx) => `
        <div class="drawer-item">
          <div class="drawer-item-info">
            <h4>${item.name}</h4>
            <span class="drawer-item-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</span>
          </div>
          <div class="drawer-item-qty">
            <button data-idx="${idx}" data-action="dec">−</button>
            <span>${item.qty}</span>
            <button data-idx="${idx}" data-action="inc">+</button>
          </div>
        </div>`).join('');
      if (drawerFooter) drawerFooter.style.display = '';
      if (drawerTotal) drawerTotal.textContent = `₹${total.toLocaleString('en-IN')}`;

      drawerItems.querySelectorAll('button[data-idx]').forEach(btn => {
        btn.addEventListener('click', () => {
          const i = +btn.dataset.idx;
          if (btn.dataset.action === 'inc') {
            cart[i].qty++;
          } else {
            cart[i].qty--;
            if (cart[i].qty <= 0) cart.splice(i, 1);
          }
          updateCartUI();
        });
      });
    }
  }

  document.querySelectorAll('.add-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.product;
      const price = +btn.dataset.price;
      const existing = cart.find(i => i.name === name);
      if (existing) {
        existing.qty++;
      } else {
        cart.push({ name, price, qty: 1 });
      }
      updateCartUI();
      showToast(`${name} added to cart!`);
    });
  });

  /* ─── DIET PACKAGE TAB SWITCHING ─── */
  const pkgTabs = document.querySelectorAll('.pkg-tab');
  const pkgPanels = document.querySelectorAll('.pkg-panel');
  pkgTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      pkgTabs.forEach(t => t.classList.remove('active'));
      pkgPanels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.pkg);
      if (target) target.classList.add('active');
    });
  });

  /* ─── NUTRITION TILE EXPAND/COLLAPSE ─── */
  document.querySelectorAll('.nutrition-tile-header').forEach(btn => {
    btn.addEventListener('click', () => {
      const tile = btn.parentElement;
      const isOpen = tile.classList.contains('open');
      tile.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', !isOpen);
    });
  });

  /* ─── CURSOR GLOW ─── */
  const glow = document.getElementById('cursorGlow');
  if (glow && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', e => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    }, { passive: true });
  }

  /* ─── SCROLL-TO-TOP BUTTON ─── */
  const scrollBtn = document.getElementById('scrollTop');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─── CARD TILT ON HOVER ─── */
  document.querySelectorAll('.product-card, .shop-card, .pathway-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-8px) perspective(600px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

})();
