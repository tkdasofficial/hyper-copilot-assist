import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { brokeredPreviewStorage } from "@/integrations/supabase/previewAuthStorage";

/**
 * Single source of truth for this project's PUBLIC backend connection.
 *
 * NOTE: no backend is connected to this project right now. The previous
 * project's credentials have been removed and these are inert placeholders,
 * so anything requiring logins or saved data will not work until a backend
 * is connected again.
 *
 * Only public identifiers belong here. Server-only credentials (service role
 * key, provider API keys) stay in the backend secret store.
 */
export const SUPABASE_URL = "https://placeholder.supabase.co";

export const SUPABASE_ANON_KEY = "placeholder-anon-key";

/** Alias — Supabase calls the anon key the "publishable" key in newer docs. */
export const SUPABASE_PUBLISHABLE_KEY = SUPABASE_ANON_KEY;

export const SUPABASE_REF_ID = "placeholder";

export type { Database } from "@/integrations/supabase/types";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: brokeredPreviewStorage(),
    persistSession: true,
    autoRefreshToken: true,
  },
});
