import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const config = window.READ_OR_NOT_CONFIG || {};
const hasConfig = Boolean(config.supabaseUrl && config.supabaseAnonKey);
const supabase = hasConfig ? createClient(config.supabaseUrl, config.supabaseAnonKey) : null;

const userSelect = document.getElementById("user-select");
const continueBtn = document.getElementById("continue-btn");
const setupWarning = document.getElementById("setup-warning");

const lakshitaCard = document.getElementById("lakshita-card");
const shrirangCard = document.getElementById("shrirang-card");
const tableCard = document.getElementById("table-card");
const submitStatus = document.getElementById("submit-status");

const foundYesBtn = document.getElementById("found-yes-btn");
const foundNoBtn = document.getElementById("found-no-btn");
const refreshBtn = document.getElementById("refresh-btn");
const checksBody = document.getElementById("checks-body");

const switchUserBtn1 = document.getElementById("switch-user-btn-1");
const switchUserBtn2 = document.getElementById("switch-user-btn-2");

function show(el) {
  el.classList.remove("hidden");
}

function hide(el) {
  el.classList.add("hidden");
}

function resetView() {
  hide(lakshitaCard);
  hide(shrirangCard);
  hide(tableCard);
  submitStatus.textContent = "";
}

function formatDate(value) {
  return new Date(value).toLocaleString();
}

function setRows(rows) {
  if (!rows || rows.length === 0) {
    checksBody.innerHTML = '<tr><td colspan="2">No data yet.</td></tr>';
    return;
  }

  checksBody.innerHTML = rows
    .map((row) => {
      const foundText = row.found ? "Yes" : "No";
      return `<tr><td>${formatDate(row.checked_at)}</td><td>${foundText}</td></tr>`;
    })
    .join("");
}

async function loadLatestChecks() {
  if (!supabase) return;

  const { data, error } = await supabase
    .from("mail_checks")
    .select("checked_at,found")
    .order("checked_at", { ascending: false })
    .limit(20);

  if (error) {
    checksBody.innerHTML = `<tr><td colspan="2">Error: ${error.message}</td></tr>`;
    return;
  }

  setRows(data);
}

async function saveCheck(foundValue) {
  if (!supabase) return;

  submitStatus.textContent = "Saving...";

  const { error } = await supabase.from("mail_checks").insert({
    found: foundValue,
    checked_by: "Lakshita",
  });

  if (error) {
    submitStatus.textContent = `Failed to save: ${error.message}`;
    return;
  }

  submitStatus.textContent = `Saved: ${foundValue ? "Yes" : "No"}`;
  await loadLatestChecks();
}

function handleContinue() {
  const selectedUser = userSelect.value;

  if (!selectedUser) {
    alert("Please select a user.");
    return;
  }

  resetView();
  show(tableCard);

  if (selectedUser === "Lakshita") {
    show(lakshitaCard);
  } else {
    show(shrirangCard);
  }

  loadLatestChecks();
}

continueBtn.addEventListener("click", handleContinue);
foundYesBtn.addEventListener("click", () => saveCheck(true));
foundNoBtn.addEventListener("click", () => saveCheck(false));
refreshBtn.addEventListener("click", loadLatestChecks);
switchUserBtn1.addEventListener("click", resetView);
switchUserBtn2.addEventListener("click", resetView);

if (hasConfig) {
  hide(setupWarning);
} else {
  show(setupWarning);
}
