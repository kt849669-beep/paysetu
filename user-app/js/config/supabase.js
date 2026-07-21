// user-app/js/config/supabase.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";

const SUPABASE_URL = "https://klrkdizvnhlbcvrpfnob.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_CXSVC0sTM7XRs2uRD4WcNQ_uk1OCUyr";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
