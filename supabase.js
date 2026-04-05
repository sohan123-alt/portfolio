/**
 * supabase.js
 * Supabase client initialization and shared config.
 * ⚠️ Replace SUPABASE_URL and SUPABASE_ANON_KEY with your project values.
 */

const SUPABASE_URL = 'https://eivusobkrgnbasivoykt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_nuaxj2YYkmaCsbKgk72KKA_Rq8H-awu';

// Initialize the Supabase client (loaded via CDN in HTML)
const supabase = window.supabase.createClient(eivusobkrgnbasivoykt.supabase.co, sb_publishable_nuaxj2YYkmaCsbKgk72KKA_Rq8H-awu);

// ─── Table names ───────────────────────────────────────────────
const TABLES = {
  PROJECTS: 'projects',
  PROFILE:  'profile',
  MESSAGES: 'messages',
};

// ─── Storage bucket ────────────────────────────────────────────
const STORAGE_BUCKET = 'portfolio-images';

// ─── Auth helpers ──────────────────────────────────────────────

/** Returns the current session or null */
async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/**
 * Redirect to login if no session.
 * Call at the top of every protected admin page.
 */
async function requireAuth() {
  const session = await getSession();
  if (!session) {
    window.location.href = '/admin/login.html';
  }
  return session;
}

/**
 * Sign in with email + password.
 * @returns {{ session, error }}
 */
async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { session: data?.session, error };
}

/** Sign out and redirect to login */
async function signOut() {
  await supabase.auth.signOut();
  window.location.href = '/admin/login.html';
}

// ─── Profile helpers ───────────────────────────────────────────

/** Fetch the single profile row */
async function fetchProfile() {
  const { data, error } = await supabase
    .from(TABLES.PROFILE)
    .select('*')
    .limit(1)
    .single();
  return { data, error };
}

/** Upsert profile (insert or update) */
async function upsertProfile(profile) {
  const { data, error } = await supabase
    .from(TABLES.PROFILE)
    .upsert(profile)
    .select()
    .single();
  return { data, error };
}

// ─── Project helpers ───────────────────────────────────────────

/** Fetch all projects ordered by newest first */
async function fetchProjects() {
  const { data, error } = await supabase
    .from(TABLES.PROJECTS)
    .select('*')
    .order('id', { ascending: false });
  return { data, error };
}

/** Fetch a single project by id */
async function fetchProject(id) {
  const { data, error } = await supabase
    .from(TABLES.PROJECTS)
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
}

/** Insert a new project */
async function insertProject(project) {
  const { data, error } = await supabase
    .from(TABLES.PROJECTS)
    .insert(project)
    .select()
    .single();
  return { data, error };
}

/** Update an existing project */
async function updateProject(id, updates) {
  const { data, error } = await supabase
    .from(TABLES.PROJECTS)
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

/** Delete a project by id */
async function deleteProject(id) {
  const { error } = await supabase
    .from(TABLES.PROJECTS)
    .delete()
    .eq('id', id);
  return { error };
}

// ─── Message helpers ───────────────────────────────────────────

/** Insert a contact message */
async function insertMessage(msg) {
  const { data, error } = await supabase
    .from(TABLES.MESSAGES)
    .insert(msg)
    .select()
    .single();
  return { data, error };
}

/** Fetch all messages (admin only) */
async function fetchMessages() {
  const { data, error } = await supabase
    .from(TABLES.MESSAGES)
    .select('*')
    .order('id', { ascending: false });
  return { data, error };
}

// ─── Storage helpers ───────────────────────────────────────────

/**
 * Upload a file to Supabase Storage.
 * @param {File}   file     - The File object to upload
 * @param {string} path     - Destination path inside the bucket (e.g. "projects/uuid.jpg")
 * @returns {{ url: string|null, error }}
 */
async function uploadImage(file, path) {
  const { error: upErr } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { upsert: true });

  if (upErr) return { url: null, error: upErr };

  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(path);

  return { url: data.publicUrl, error: null };
}

/** Delete a file from Supabase Storage by its path */
async function deleteImage(path) {
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([path]);
  return { error };
}

/** Extract storage path from a public URL */
function pathFromUrl(url) {
  // publicUrl format: .../storage/v1/object/public/BUCKET/path
  const marker = `/public/${STORAGE_BUCKET}/`;
  const idx = url.indexOf(marker);
  return idx !== -1 ? url.slice(idx + marker.length) : null;
}
