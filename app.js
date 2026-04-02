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
const loginNote = document.getElementById("login-note");
const lakshitaPrompt = document.getElementById("lakshita-prompt");
const shrirangIntro = document.getElementById("shrirang-intro");

const loginNotes = [
  "Two-factor authentication: step 1, open dropdown. Step 2, there is no step 2.",
  "Hackers hate this one weird trick. (It's a dropdown.)",
  "This dropdown has stopped exactly zero unauthorized users.",
  "We considered adding a password. Then we didn't.",
  "Please don't hack us. That's our entire security policy.",
  "Encrypted with 256-bit hope.",
  "We spent the security budget on sarcasm.",
  "If you can operate a dropdown, you're in. The bar is underground.",
  "Could this login *be* any more secure?",
  "Fort Knox wishes they had our dropdown technology.",
  "Password? Where we're going, we don't need passwords.",
  "Your identity is now protected by the honor system.",
];

const lakshitaPrompts = [
  "Go on. Ruin Shrirang's day. Or make it.",
  "Be honest. We can handle it. (We can't.)",
  "The fate of Shrirang's career is in your hands. No pressure.",
  "Just tap the button. Shrirang is probably watching.",
  "Quick, before Shrirang texts you asking.",
  "We both know how this ends. But go ahead.",
  "Shrirang's entire employment status depends on this click.",
  "One click. That's all that stands between Shrirang and a paycheck.",
  "Time for the daily heartbreak. Or miracle. Mostly heartbreak.",
  "So, did USPS finally remember we exist?",
  "On a scale of 'nothing' to 'something,' what showed up?",
  "You know the drill. Check. Report. Repeat until retirement.",
];

const shrirangIntros = [
  "You're here to watch. Lakshita's here to work. Classic.",
  "Your job: wait. Lakshita's job: everything else.",
  "Ah yes, the man who can't work until the package arrives. How's that going?",
  "You could text Lakshita. But this is more dramatic.",
  "Welcome, Captain. Your only job is to scroll and sigh.",
  "Lakshita does the fieldwork. You get the dashboard. Life is fair.",
  "Breaking: man who can't work checks if he can work yet.",
  "The real mission was getting Shrirang to stop asking. This website failed.",
  "Your contribution: refreshing this page. Noted.",
  "Observation deck activated. Doing nothing has never looked this professional.",
  "Sit back, Captain. Someone else is doing the actual work.",
];

const emptyTableLines = [
  "This space intentionally left blank. Just like our hopes.",
  "This is what despair looks like in table format.",
  "Table status: as empty as Shrirang's work calendar.",
  "Current occupancy: zero rows and one broken dream.",
  "This table has the same content as Shrirang's paycheck. Nothing.",
  "So empty, even USPS would be impressed.",
  "Even the table is waiting for something to happen.",
  "No data. No package. No surprises.",
  "Loading... just kidding. There's nothing to load.",
  "Error 404: Data not found. Package also not found.",
  "No reports yet. Much like the package, absolutely nothing is here.",
];

const logoutLabels = [
  "Abandon Mission",
  "Rage Quit",
  "Self-Destruct",
  "Eject",
  "I'm Out",
];

const missionMessages = [
  "USPS tracking refreshed 12 times. Still 'in transit.' Shocking.",
  "Someone built an entire website for this. And yet, here we are.",
  "Day N of waiting. But sure, 7-10 business days.",
  "Could this process *be* any slower?",
  "Pentagon called. They want their security system back.",
  "Fun fact: this website took less time to build than the package took to arrive.",
  "Refreshing this page won't make it arrive faster. But here we are.",
  "Powered by Supabase, hope, and mild desperation.",
  "Estimated delivery: eventually.",
  "Two people. One dropdown. Zero packages.",
  "This page loads faster than USPS delivers. Low bar, but still.",
  "Security level: vibes-based authentication.",
  "If you're reading this, you're probably Shrirang. Relax.",
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
    checksBody.innerHTML = `<tr><td colspan="2">${pickRandom(emptyTableLines)}</td></tr>`;
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
  "I'd like to thank USPS for eventually doing their job.",
  "Shrirang can finally stop doom-refreshing this page.",
  "This calls for a party. Or at least closing this website forever.",
  "Ladies and gentlemen, we got it.",
  "Alert all channels. This is not a drill.",
  "Pack it up everyone. The website served its purpose.",
  "USPS did something right. Mark the calendar.",
  "The package has landed. I repeat, the package has landed.",
  "We did it. Well, USPS did it. We just waited.",
  "Somebody throw confetti. Or just close this tab.",
  "One small step for USPS, one giant relief for Shrirang.",
];

const failureLines = [
  "Narrator: It did not arrive.",
  "Your daily dose of disappointment, delivered faster than USPS.",
  "USPS sends their regards. Just kidding, they sent nothing.",
  "Could USPS *be* any slower?",
  "Oh, what a surprise. Said no one. Ever.",
  "At this rate, Shrirang's grandkids will receive it.",
  "At this point, a carrier pigeon would've been faster.",
  "And the award for most predictable outcome goes to...",
  "If waiting was a sport, we'd be Olympic champions.",
  "Still nothing. But hey, at least this dropdown login is working flawlessly.",
  "The only thing arriving today is disappointment.",
  "Task failed successfully. Wait, no. Just failed.",
  "7-10 business days. And that was a lie.",
  "In a parallel universe, this package arrived weeks ago.",
  "We've been ghosted. By the postal service.",
  "Somewhere, a USPS truck just drove past your house. Without stopping.",
  "Maybe the real package was the friends we made along the way. Just kidding, we want the package.",
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
    lakshitaPrompt.textContent = pickRandom(lakshitaPrompts);
    switchUserBtn1.textContent = pickRandom(logoutLabels);
    missionLine.textContent = "Identity verified via dropdown. Welcome, Agent.";
  } else {
    show(shrirangCard);
    shrirangIntro.textContent = pickRandom(shrirangIntros);
    switchUserBtn2.textContent = pickRandom(logoutLabels);
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
loginNote.textContent = pickRandom(loginNotes);
