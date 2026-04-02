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
const missionLine = document.getElementById("mission-line");

const switchUserBtn1 = document.getElementById("switch-user-btn-1");
const switchUserBtn2 = document.getElementById("switch-user-btn-2");

const missionMessages = [
  "USPS tracking refreshed 12 times today. No change.",
  "Someone built an entire website for this. Let that sink in.",
  "Day N of waiting. Morale is... fine.",
  "Bureaucracy boss fight: still active.",
  "Sources confirm the mail has not materialized.",
  "HR is asking questions. We need that card.",
];

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
  missionLine.textContent = "Session terminated. Please re-authenticate via dropdown.";
}

function formatDate(value) {
  return new Date(value).toLocaleString();
}

function setRows(rows) {
  if (!rows || rows.length === 0) {
    checksBody.innerHTML = '<tr><td colspan="2">No field reports yet. Someone check the mail.</td></tr>';
    return;
  }

  checksBody.innerHTML = rows
    .map((row) => {
      const foundText = row.found ? "Yes" : "No";
      const funnyLabel = row.found
        ? "Mission Complete"
        : "Mission Failed";
      return `<tr><td>${formatDate(row.checked_at)}</td><td>${funnyLabel}</td></tr>`;
    })
    .join("");
}

function rotateMissionMessage() {
  const pick = missionMessages[Math.floor(Math.random() * missionMessages.length)];
  missionLine.textContent = pick;
}

function celebrateTinyVictory() {
  document.body.classList.add("party");
  setTimeout(() => document.body.classList.remove("party"), 1200);
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

  submitStatus.textContent = "Transmitting report to HQ...";

  const { error } = await supabase.from("mail_checks").insert({
    found: foundValue,
    checked_by: "Lakshita",
  });

  if (error) {
    submitStatus.textContent = `Failed to save: ${error.message}`;
    return;
  }

  if (foundValue) {
    submitStatus.textContent = "Mission Complete. Finally. Someone tell HR.";
    celebrateTinyVictory();
  } else {
    submitStatus.textContent = "Mission Failed. Shocking. See you tomorrow.";
  }
  rotateMissionMessage();
  await loadLatestChecks();
}

function handleContinue() {
  const selectedUser = userSelect.value;

  if (!selectedUser) {
    alert("Access denied. Please select an identity from the dropdown.");
    return;
  }

  resetView();
  show(tableCard);

  if (selectedUser === "Lakshita") {
    show(lakshitaCard);
    missionLine.textContent = "Identity verified via dropdown. Welcome, Agent.";
  } else {
    show(shrirangCard);
    missionLine.textContent = "Identity verified via dropdown. Welcome, Captain.";
  }

  rotateMissionMessage();
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

rotateMissionMessage();
