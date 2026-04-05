/**
 * app.js
 * Shared UI utilities: toast notifications, loading state, form helpers.
 */

// ─── Toast Notifications ───────────────────────────────────────

let toastContainer;

function getToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

/**
 * Show a toast notification.
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 * @param {number} duration  ms before auto-dismiss
 */
function showToast(message, type = 'info', duration = 3500) {
  const container = getToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] ?? icons.info}</span>
    <span class="toast-msg">${message}</span>
    <button class="toast-close" aria-label="Dismiss">✕</button>
  `;

  toast.querySelector('.toast-close').addEventListener('click', () => dismissToast(toast));
  container.appendChild(toast);

  // Trigger entrance animation
  requestAnimationFrame(() => toast.classList.add('toast-visible'));

  // Auto-dismiss
  setTimeout(() => dismissToast(toast), duration);
}

function dismissToast(toast) {
  toast.classList.remove('toast-visible');
  toast.classList.add('toast-leaving');
  toast.addEventListener('transitionend', () => toast.remove(), { once: true });
}

// ─── Loading Overlay ───────────────────────────────────────────

let loadingOverlay;

function showLoading(msg = 'Loading…') {
  if (!loadingOverlay) {
    loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading-overlay';
    loadingOverlay.innerHTML = `
      <div class="loading-box">
        <div class="loading-spinner"></div>
        <p class="loading-msg"></p>
      </div>`;
    document.body.appendChild(loadingOverlay);
  }
  loadingOverlay.querySelector('.loading-msg').textContent = msg;
  loadingOverlay.classList.add('active');
}

function hideLoading() {
  loadingOverlay?.classList.remove('active');
}

// ─── Button Loading State ──────────────────────────────────────

/** Disable a button and show a spinner label */
function setBtnLoading(btn, loading, label = 'Saving…') {
  if (loading) {
    btn.dataset.originalText = btn.textContent;
    btn.disabled = true;
    btn.innerHTML = `<span class="btn-spinner"></span>${label}`;
  } else {
    btn.disabled = false;
    btn.textContent = btn.dataset.originalText ?? 'Submit';
  }
}

// ─── Form Validation ───────────────────────────────────────────

/**
 * Validate required fields on a form.
 * Marks invalid inputs with an .input-error class.
 * @returns {boolean} true if valid
 */
function validateForm(formEl) {
  let valid = true;
  formEl.querySelectorAll('[required]').forEach(input => {
    const err = input.nextElementSibling?.classList.contains('field-error')
      ? input.nextElementSibling
      : null;
    if (!input.value.trim()) {
      input.classList.add('input-error');
      if (err) err.style.display = 'block';
      valid = false;
    } else {
      input.classList.remove('input-error');
      if (err) err.style.display = 'none';
    }
  });
  return valid;
}

/** Clear all validation states */
function clearValidation(formEl) {
  formEl.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
}

// ─── Image Preview ─────────────────────────────────────────────

/**
 * Wire up a file input to show a live image preview.
 * @param {HTMLInputElement} fileInput
 * @param {HTMLImageElement} previewImg
 * @param {HTMLElement}      previewContainer
 */
function wireImagePreview(fileInput, previewImg, previewContainer) {
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    previewImg.src = url;
    previewContainer.style.display = 'block';
    previewImg.onload = () => URL.revokeObjectURL(url);
  });
}

// ─── Smooth Scroll ─────────────────────────────────────────────

/** Smooth-scroll to a section by id */
function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

// ─── Active Nav Highlight (IntersectionObserver) ───────────────

function initScrollSpy(navLinks) {
  if (!navLinks?.length) return;
  const sections = [...navLinks]
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.4 }
  );
  sections.forEach(s => observer.observe(s));
}

// ─── Staggered reveal on scroll ───────────────────────────────

function initRevealAnimations() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('revealed'), i * 80);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  els.forEach(el => observer.observe(el));
}

// ─── Unique filename for storage uploads ──────────────────────

function uniqueFilename(file) {
  const ext = file.name.split('.').pop();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
}

// ─── Run on DOMContentLoaded ───────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initRevealAnimations();
  initScrollSpy(document.querySelectorAll('.nav-link'));
});
