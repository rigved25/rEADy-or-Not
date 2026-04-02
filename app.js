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
  "USPS tracking refreshed 12 times. Still 'in transit.' Shocking.",
  "Someone built an entire website for this. And yet, here we are.",
  "Day N of waiting. But sure, 7-10 business days.",
  "Could this process *be* any slower?",
  "On the bright side, at least the website works.",
  "HR is asking questions. We need that card.",
  "Pentagon called. They want their security system back.",
  "Sources confirm the package has not materialized. Again.",
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
    checksBody.innerHTML = '<tr><td colspan="2">No reports yet. Much like the package, absolutely nothing is here.</td></tr>';
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

const successLines = [
  "OH. MY. GOD. It actually came.",
  "Quick, someone pinch me. This can't be real.",
  "Mission Complete. Finally. Someone tell HR.",
];

const failureLines = [
  "Oh, what a surprise. Said no one. Ever.",
  "In other news, water is wet.",
  "Could USPS *be* any slower?",
  "Mission Failed. Shocking. See you tomorrow.",
];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rotateMissionMessage() {
  missionLine.textContent = pickRandom(missionMessages);
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
    submitStatus.textContent = pickRandom(successLines);
    celebrateTinyVictory();
  } else {
    submitStatus.textContent = pickRandom(failureLines);
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
