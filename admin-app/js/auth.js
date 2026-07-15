// auth.js
import { supabase } from "../../user-app/js/config/supabase.js";

document.addEventListener("DOMContentLoaded", async () => {
  const sessionToken = localStorage.getItem("showpay_admin_session_token");
  if (!sessionToken) {
    window.location.href = "/admin";
    return;
  }

  // Verify token asynchronously
  try {
    const { data } = await supabase.from("admin_sessions").select("token").eq("token", sessionToken).limit(1);
    if (!data || data.length === 0) {
      // Token not found in active sessions
      localStorage.removeItem("showpay_admin_session_token");
      window.location.href = "/admin";
      return;
    } else {
      // Update last_active
      await supabase.from("admin_sessions").update({ last_active: new Date().toISOString() }).eq("token", sessionToken);
    }
  } catch (e) {
    console.error("Auth token verification failed:", e);
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await supabase.from("admin_sessions").delete().eq("token", sessionToken);
      localStorage.removeItem("showpay_admin_session_token");
      window.location.href = "/admin";
    });
  }
});

export async function logActivity(action, details) {
  try {
    await supabase.from("activity_logs").insert({
      action,
      details,
    });
  } catch (e) {
    console.error("Failed to log activity:", e);
  }
}
