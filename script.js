const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navigation');
function setMenu(open) {
  navigation.classList.toggle('is-open', open);
  navigation.inert = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  if (open) navigation.querySelector('button').focus();
}
menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
document.querySelector('.close-menu').addEventListener('click', () => { setMenu(false); menuButton.focus(); });
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('click', event => {
  if (!navigation.contains(event.target) && !menuButton.contains(event.target)) setMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') { setMenu(false); menuButton.focus(); }
  if (event.key === 'Tab' && menuButton.getAttribute('aria-expanded') === 'true') {
    const items = [...navigation.querySelectorAll('a, button')];
    const first = items[0]; const last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
const projectData = {
  factcheck: {
    title: 'VERA.CHECK', category: 'APPLIED AI / DOCUMENT VERIFICATION',
    description: 'An AI-powered fact-checking agent that processes PDF documents, extracts factual statements, and checks them against publicly available web sources. Results include claim classifications, evidence references, and model-estimated confidence scores.',
    details: [
      ['WORKFLOW', 'PDF text extraction → factual claim detection → batched web verification → progressive results.'],
      ['IMPLEMENTATION', 'React, TypeScript, Vite, Tailwind CSS, and Framer Motion. Structured JSON parsing and incremental result rendering keep the verification flow visible.'],
      ['RESULTS & LIMITS', 'Claims are classified as verified, disputed, contradicted, or unknown. The screenshot shows an example run; confidence scores are model estimates, not measured benchmark accuracy. Verification quality depends on available evidence.']
    ], source: 'https://github.com/r3d-slayer/fact-check-agent'
  },
  blog: {
    title: 'LOCAL LLM / BLOG GENERATOR', category: 'GENERATIVE AI / TEXT GENERATION',
    description: 'A blog-generation project using mistral-7b-instruct-v0.1.Q4_K_M. The supplied screenshot shows an example technology article on The Weber Info, connecting language-model output to a readable blog experience.',
    details: [
      ['MODEL', 'Mistral 7B Instruct v0.1, using the Q4_K_M quantized model variant.'],
      ['APPLICATION', 'Generating long-form blog content. The screenshot presents an example article about mobile graphics technology.'],
      ['FOCUS', 'Applying an instruction-tuned language model to a practical writing workflow.']
    ]
  },
  vendor: {
    title: 'VENDOR PERFORMANCE', category: 'DATA ANALYTICS / BUSINESS INTELLIGENCE',
    description: 'An end-to-end vendor performance analysis combining Python exploratory data analysis with a Power BI dashboard. The project examines purchase and sales trends, vendor contribution, profitability, freight costs, and quantities.',
    details: [
      ['WORKFLOW', 'Python data ingestion and SQLite summaries → exploratory notebooks → vendor-level metrics → Power BI dashboard.'],
      ['TOOLKIT', 'Python, pandas, NumPy, Matplotlib, Seaborn, SQLite, and Power BI.'],
      ['DELIVERABLES', 'Exploratory analysis notebooks, data-processing scripts, and an interactive Power BI report for exploring vendor performance.']
    ], source: 'https://github.com/r3d-slayer/Vendor_Performance_Analysis_Project'
  },
  hotel: {
    title: 'HOTEL BOOKING DEMAND', category: 'DATA ANALYTICS / EXPLORATORY ANALYSIS',
    description: 'An exploratory analysis of booking demand across city and resort hotels. The notebook investigates booking patterns, cancellation behaviour, daily rates, seasonality, and guest demographics.',
    details: [
      ['QUESTIONS', 'How do bookings vary by month? How do cancellation patterns differ between hotel types? What relationships appear between daily rates, waiting lists, and cancellations?'],
      ['TOOLKIT', 'Python, pandas, NumPy, Matplotlib, Seaborn, and Jupyter Notebook.'],
      ['DELIVERABLES', 'An analysis notebook and charts covering reservations, cancellations, monthly trends, and guest geography.']
    ], source: 'https://github.com/r3d-slayer/Hotel_Booking_EDA_Project'
  },
  zomato: {
    title: 'ZOMATO PERFORMANCE', category: 'DATA ANALYTICS / EXPLORATORY ANALYSIS',
    description: 'An analysis of Bangalore restaurant data exploring ratings, cost, locations, restaurant types, online ordering, and table booking. Cleaning and visualization make patterns in the dataset easier to investigate.',
    details: [
      ['WORKFLOW', 'Handle missing and inconsistent values, prepare categorical fields, explore distributions, and compare restaurant characteristics through visualizations.'],
      ['TOOLKIT', 'Python, pandas, NumPy, Matplotlib, Seaborn, and Jupyter Notebook.'],
      ['DELIVERABLES', 'An analysis notebook with charts examining ratings, pricing, locations, restaurant types, and services.']
    ], source: 'https://github.com/r3d-slayer/Zomato_Performance_Analysis'
  }
};
const dialog = document.querySelector('#project-dialog');
function openProject(key) {
  const project = projectData[key];
  const card = document.querySelector(`[data-project="${key}"]`);
  document.querySelector('#dialog-title').textContent = project.title;
  document.querySelector('#dialog-category').textContent = project.category;
  document.querySelector('#dialog-description').textContent = project.description;
  document.querySelector('#dialog-art').replaceChildren(card.querySelector('.project-image').cloneNode(true));
  document.querySelector('#dialog-details').replaceChildren(...project.details.map(([label, text]) => {
    const row = document.createElement('div');
    const heading = document.createElement('h3');
    const copy = document.createElement('p');
    heading.textContent = label; copy.textContent = text;
    row.append(heading, copy); return row;
  }));
  const source = document.querySelector('#dialog-source');
  source.hidden = !project.source;
  if (project.source) source.href = project.source;
  else source.removeAttribute('href');
  document.querySelector('#dialog-image').href = card.querySelector('img').getAttribute('src');
  dialog.showModal();
  animateEntrance(dialog, 0, 340, 14);
}
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => openProject(button.dataset.project)));
document.querySelectorAll('[data-open-project]').forEach(button => button.addEventListener('click', () => openProject(button.dataset.openProject)));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
document.querySelector('#discuss-project').addEventListener('click', () => {
  dialog.close();
  document.querySelector('.contact-email').focus({ preventScroll: true });
});
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(item => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  let count = 0;
  document.querySelectorAll('[data-category]').forEach(card => {
    card.hidden = filter !== 'all' && card.dataset.category !== filter;
    if (!card.hidden) count += 1;
  });
  document.querySelector('#project-count').textContent = `${count} PROJECT${count === 1 ? '' : 'S'}`;
  document.querySelectorAll('[data-category]:not([hidden])').forEach((card, index) => {
    revealObserver?.unobserve(card);
    revealed.add(card);
    animateEntrance(card, Math.min(index, 3) * 55, 430, 16);
  });
}));
document.querySelector('#year').textContent = new Date().getFullYear();

// Animate only when needed. Content stays visible if motion or JS is unavailable.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const activeAnimations = new Map();
const revealed = new WeakSet();
let revealObserver;
function animateEntrance(element, delay = 0, duration = 650, distance = 24) {
  if (reducedMotion.matches || !element.animate) return;
  activeAnimations.get(element)?.cancel();
  const animation = element.animate([
    { opacity: 0, transform: `translateY(${distance}px)` },
    { opacity: 1, transform: 'translateY(0)' }
  ], { duration, delay, easing: 'cubic-bezier(.16, 1, .3, 1)', fill: 'backwards' });
  activeAnimations.set(element, animation);
  const release = () => { if (activeAnimations.get(element) === animation) activeAnimations.delete(element); };
  animation.addEventListener('finish', release, { once: true });
  animation.addEventListener('cancel', release, { once: true });
}
if (!reducedMotion.matches) {
  ['.hero .eyebrow', '.hero h1', '.hero-actions', '.hero-art', '.hero-bottom', '.hero-footer'].forEach((selector, index) => {
    animateEntrance(document.querySelector(selector), index * 100, 850, 24);
  });
  if ('IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || revealed.has(entry.target)) return;
        revealed.add(entry.target);
        revealObserver.unobserve(entry.target);
        animateEntrance(entry.target);
      });
    }, { threshold: .06, rootMargin: '0px 0px -24px 0px' });
    document.querySelectorAll('.section-heading, .section-intro, .project-entry, .lab-entry, .lab-foot, .about-layout, .service-list, .contact-layout').forEach(element => revealObserver.observe(element));
  }
}
document.querySelectorAll('.service-list details').forEach(details => details.addEventListener('toggle', () => {
  if (details.open) animateEntrance(details.querySelector('.service-body'), 0, 360, 10);
}));
reducedMotion.addEventListener('change', () => {
  if (!reducedMotion.matches) return;
  revealObserver?.disconnect();
  activeAnimations.forEach(animation => animation.cancel());
  activeAnimations.clear();
});

// Pause the decorative PNG animation when it leaves the viewport.
if ('IntersectionObserver' in window) {
  const artObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('is-active', entry.isIntersecting));
  });
  document.querySelectorAll('.hero-art, .about-mark').forEach(element => artObserver.observe(element));
}
window.matchMedia('(min-width: 1001px)').addEventListener('change', event => {
  if (event.matches) setMenu(false);
});
