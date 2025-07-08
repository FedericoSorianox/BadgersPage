import { createSupabaseClient, CookieAuthStorageAdapter } from "@supabase/auth-helpers-shared";
var SvelteKitServerAuthStorageAdapter = class extends CookieAuthStorageAdapter {
  constructor(event, cookieOptions, expiryMargin = 60) {
    super(cookieOptions);
    this.event = event;
    this.expiryMargin = expiryMargin;
    this.isServer = true;
    this.isInitialDelete = true;
    this.currentSession = null;
  }
  getCookie(name) {
    return this.event.cookies.get(name);
  }
  setCookie(name, value) {
    this.event.cookies.set(name, value, {
      httpOnly: false,
      path: "/",
      ...this.cookieOptions
    });
  }
  deleteCookie(name) {
    this.event.cookies.delete(name, {
      httpOnly: false,
      path: "/",
      ...this.cookieOptions
    });
  }
  async getItem(key) {
    const sessionStr = await super.getItem(key);
    if (!sessionStr) {
      this.currentSession = null;
      return null;
    }
    const session = JSON.parse(sessionStr);
    this.currentSession = session;
    if (session == null ? void 0 : session.expires_at) {
      session.expires_at -= this.expiryMargin;
    }
    return JSON.stringify(session);
  }
  removeItem(key) {
    var _a;
    if (this.isInitialDelete && ((_a = this.currentSession) == null ? void 0 : _a.expires_at)) {
      const now = Math.round(Date.now() / 1e3);
      if (this.currentSession.expires_at < now + 10) {
        this.isInitialDelete = false;
        return;
      }
    }
    super.removeItem(key);
  }
};
function createSupabaseServerClient({
  supabaseUrl,
  supabaseKey,
  event,
  options,
  cookieOptions,
  expiryMargin
}) {
  var _a;
  const client = createSupabaseClient(supabaseUrl, supabaseKey, {
    ...options,
    global: {
      ...options == null ? void 0 : options.global,
      headers: {
        ...(_a = options == null ? void 0 : options.global) == null ? void 0 : _a.headers,
        "X-Client-Info": `${"@supabase/auth-helpers-sveltekit"}@${"0.13.0"}`
      }
    },
    auth: {
      storage: new SvelteKitServerAuthStorageAdapter(event, cookieOptions, expiryMargin)
    }
  });
  return client;
}
const handle = async ({ event, resolve }) => {
  event.locals.supabaseClient = createSupabaseServerClient({
    supabaseUrl: "https://hmohjwrwpuwmyecdxgon.supabase.co",
    supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhtb2hqd3J3cHV3bXllY2R4Z29uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4ODYyMTMsImV4cCI6MjA2NDQ2MjIxM30.MBVkKFd4zfvXxfG_TH5QZTyUTRNeBCTXXFZrB3Q4fEc",
    // NO la service key, solo la anon key pública
    event
  });
  const { data: { session } } = await event.locals.supabaseClient.auth.getSession();
  event.locals.session = session;
  return resolve(event);
};
export {
  handle
};
