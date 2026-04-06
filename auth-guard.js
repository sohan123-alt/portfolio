/**
 * auth-guard.js
 * Lightweight session guard for the admin panel.
 * No Supabase Auth required — works with the username/password
 * login system in admin/login.html.
 *
 * Load this script BEFORE any page-specific admin JS.
 */

const ADMIN_SESSION_KEY = 'portfolio_admin_session';

/**
 * Check if the admin is logged in.
 * Redirects to login.html if not.
 * @returns {{ email: string }} a minimal "session" object for UI display
 */
function adminGuard() {
  if (sessionStorage.getItem(ADMIN_SESSION_KEY) !== 'true') {
    window.location.replace('login.html');
    return null; // execution stops after redirect
  }
  // Return a minimal session-like object so existing UI code
  // (e.g. showing the admin email) continues to work.
  return { email: 'admin' };
}

/**
 * Sign the admin out and redirect to the login page.
 */
function adminSignOut() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  window.location.replace('login.html');
}
