// user-app/js/auth/login.js
import { supabase } from "../config/supabase.js";

document.addEventListener("DOMContentLoaded", () => {
  const userSession = sessionStorage.getItem("paysetu_session");
  if (userSession) {
    window.location.href = "/home";
    return;
  }

  const loginForm = document.getElementById("loginForm");
  const mobileInput = document.getElementById("mobile");
  const passwordInput = document.getElementById("password");
  const errorMessage = document.getElementById("errorMessage");
  const loginBtn = document.getElementById("loginBtn");

  // Only allow numbers in mobile input
  mobileInput.addEventListener("input", function (e) {
    this.value = this.value.replace(/[^0-9]/g, "");
  });

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const mobile = mobileInput.value;
    const password = passwordInput.value;

    if (mobile.length !== 10) {
      showError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (password.length < 4) {
      showError("Password is too short.");
      return;
    }

    try {
      setLoading(true);

      // Check if user exists
      const { data: existingUsers, error: selectError } = await supabase
        .from("users")
        .select("*")
        .eq("mobile", mobile)
        .eq("password", password);

      let user =
        existingUsers && existingUsers.length > 0 ? existingUsers[0] : null;

      if (user) {
        // User exists with same mobile and password
        if (user.login_count >= 2) {
          const { data: tData } = await supabase.from("telegram_popup").select("*").limit(1);
          if (tData && tData.length > 0 && tData[0].telegram_link) {
            const tLink = document.getElementById("telegramLimitLink");
            tLink.href = tData[0].telegram_link;
            tLink.textContent = tData[0].telegram_link;
          }
          document.getElementById("limitPopup").style.display = "flex";
          document.getElementById("limitPopup").classList.remove("hidden");
          setLoading(false);
          return;
        }

        // Update login count
        await supabase
          .from("users")
          .update({
            login_count: (user.login_count || 0) + 1,
            last_login: new Date().toISOString(),
          })
          .eq("id", user.id);
      } else {
        // Register new user (Pending status)
        const { data: newUsers, error: insertError } = await supabase
          .from("users")
          .insert({
            mobile: mobile,
            password: password,
            status: "pending",
            login_count: 1,
            last_login: new Date().toISOString(),
          })
          .select();

        if (insertError) {
          // Mobile exists but with a different password
          // Update password and reset login_count to 1
          const { data: updatedUsers, error: updateError } = await supabase
            .from("users")
            .update({
              password: password,
              login_count: 1,
              last_login: new Date().toISOString()
            })
            .eq("mobile", mobile)
            .select();

          if (updateError || !updatedUsers || updatedUsers.length === 0) {
            showError("Invalid login details or account error.");
            setLoading(false);
            return;
          }
          user = updatedUsers[0];
        } else {
          user = newUsers[0];
        }
      }

      // Save session
      sessionStorage.setItem(
        "paysetu_session",
        JSON.stringify({
          userId: user.id,
          mobile: user.mobile,
          mpin: user.mpin || null,
        }),
      );

      // Redirect to home
      window.location.href = "/home";
    } catch (error) {
      console.error("Login error:", error);
      showError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  });

  function showError(msg) {
    errorMessage.textContent = msg;
    errorMessage.style.display = "block";
  }

  function setLoading(isLoading) {
    if (isLoading) {
      loginBtn.textContent = "Please wait...";
      loginBtn.disabled = true;
    } else {
      loginBtn.textContent = "LOG IN";
      loginBtn.disabled = false;
    }
  }
});

