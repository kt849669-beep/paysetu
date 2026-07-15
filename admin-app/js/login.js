import { supabase } from "../../user-app/js/config/supabase.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("adminLoginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const errorMsg = document.getElementById("errorMsg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // First try to check against Supabase admin_settings
    try {
      const { data } = await supabase
        .from("admin_settings")
        .select("*")
        .eq("admin_email", email)
        .eq("admin_password", password)
        .limit(1);

      if (data && data.length > 0) {
        localStorage.setItem("showpay_admin_session", "true");
        window.location.href = "/admin-app/pages/dashboard.html";
        return;
      }
    } catch (err) {
      console.log("Supabase check failed, falling back to hardcoded:", err);
    }

    // Fallback to hardcoded credentials
    if (email === "admin@showpay.com" && password === "admin@0123") {
      localStorage.setItem("showpay_admin_session", "true");
      window.location.href = "/admin-app/pages/dashboard.html";
    } else {
      errorMsg.textContent = "Invalid credentials";
      errorMsg.classList.remove("hidden");
      errorMsg.style.display = "block";
      errorMsg.style.color = "#ef4444";
      errorMsg.style.textAlign = "center";
      errorMsg.style.marginBottom = "16px";
      errorMsg.style.fontSize = "14px";
    }
  });
});
