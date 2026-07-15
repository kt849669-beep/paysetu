import { supabase } from "../../user-app/js/config/supabase.js";
import { logActivity } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const profileName = document.getElementById("profileName");
  const profileEmail = document.getElementById("profileEmail");
  const profileCurrentPassword = document.getElementById("profileCurrentPassword");
  const profileNewPassword = document.getElementById("profileNewPassword");
  const saveProfileBtn = document.getElementById("saveProfileBtn");
  const profileMessage = document.getElementById("profileMessage");
  const profileDisplayName = document.getElementById("profileDisplayName");

  let adminData = null;

  async function fetchProfile() {
    try {
      const { data } = await supabase
        .from("admin_settings")
        .select("*")
        .limit(1);

      if (data && data.length > 0) {
        adminData = data[0];
        profileName.value = adminData.admin_name || "";
        profileEmail.value = adminData.admin_email || "";
        profileDisplayName.textContent = adminData.admin_name || "ShowPay Admin";
      } else {
        // No admin settings found, use defaults
        profileName.value = "ShowPay Admin";
        profileEmail.value = "admin@showpay.com";
      }
    } catch (e) {
      console.error("Error fetching profile:", e);
    }
  }

  function showMessage(text, type) {
    profileMessage.classList.remove("hidden");
    profileMessage.textContent = text;
    profileMessage.style.background = type === "success" ? "#f0fdf4" : "#fef2f2";
    profileMessage.style.color = type === "success" ? "#16a34a" : "#dc2626";
    profileMessage.style.border = `1px solid ${type === "success" ? "#bbf7d0" : "#fecaca"}`;
    setTimeout(() => {
      profileMessage.classList.add("hidden");
    }, 4000);
  }

  saveProfileBtn.addEventListener("click", async () => {
    const currentPass = profileCurrentPassword.value;

    // Verify current password
    if (!currentPass) {
      showMessage("Please enter your current password to save changes.", "error");
      return;
    }

    // Check against stored password or default
    const storedPassword = adminData ? adminData.admin_password : "admin@0123";
    if (currentPass !== storedPassword) {
      showMessage("Current password is incorrect.", "error");
      return;
    }

    saveProfileBtn.disabled = true;
    saveProfileBtn.textContent = "Saving...";

    try {
      const updateData = {
        admin_name: profileName.value,
        admin_email: profileEmail.value,
        updated_at: new Date().toISOString(),
      };

      // If new password provided, update it
      if (profileNewPassword.value) {
        if (profileNewPassword.value.length < 4) {
          showMessage("New password must be at least 4 characters.", "error");
          saveProfileBtn.disabled = false;
          saveProfileBtn.textContent = "Save Changes";
          return;
        }
        updateData.admin_password = profileNewPassword.value;
      }

      if (adminData) {
        await supabase
          .from("admin_settings")
          .update(updateData)
          .eq("id", adminData.id);
      } else {
        await supabase.from("admin_settings").insert(updateData);
      }

      // Update localStorage with new email if changed
      // (admin login checks localStorage session)
      profileDisplayName.textContent = profileName.value;
      profileCurrentPassword.value = "";
      profileNewPassword.value = "";

      showMessage("Profile updated successfully!", "success");
      logActivity("Profile Updated", `Admin profile updated`);

      // Refresh data
      fetchProfile();
    } catch (e) {
      console.error("Error saving profile:", e);
      showMessage("Failed to save profile. Try again.", "error");
    } finally {
      saveProfileBtn.disabled = false;
      saveProfileBtn.textContent = "Save Changes";
    }
  });

  fetchProfile();
});
