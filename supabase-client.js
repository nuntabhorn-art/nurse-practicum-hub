// Safe, browser-side Supabase client bootstrap.
// The app remains on the legacy API until SUPABASE_CONFIG is configured.
(function () {
  const config = window.SUPABASE_CONFIG || {};
  const hasConfig = Boolean(config.url && config.anonKey &&
    !config.url.includes("YOUR_PROJECT_ID") &&
    !config.anonKey.includes("YOUR_SUPABASE_ANON_KEY"));

  window.NurseSupabase = {
    enabled: hasConfig,
    client: null,
    async init() {
      if (!hasConfig || !window.supabase) return null;
      if (!this.client) this.client = window.supabase.createClient(config.url, config.anonKey);
      return this.client;
    }
  };
})();
