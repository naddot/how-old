function populateTimeSelects() {
  const hourSelect = document.getElementById("hour");
  const minuteSelect = document.getElementById("minute");
  for (let i = 0; i < 24; i++) hourSelect.appendChild(new Option(String(i).padStart(2, "0"), i));
  for (let i = 0; i < 60; i++) minuteSelect.appendChild(new Option(String(i).padStart(2, "0"), i));
}

document.addEventListener("DOMContentLoaded", () => {
  populateTimeSelects();

  const form = document.getElementById("dob-form");
  const formView = document.getElementById("form-view");
  const resultView = document.getElementById("result-view");
  const unitExplorer = document.getElementById("unit-explorer");
  const countdownView = document.getElementById("countdown-view");

  const currentAges = document.getElementById("current-ages");
  const milestoneProgress = document.getElementById("milestone-progress");
  const unitMilestones = document.getElementById("unit-milestones");
  const unitTitle = document.getElementById("unit-title");

  const goBackBtn = document.getElementById("go-back");
  const backToSummaryBtn = document.getElementById("back-to-summary");
  const backToUnitBtn = document.getElementById("back-to-unit");

  const countdownLabel = document.getElementById("countdown-label");
  const countdownETA = document.getElementById("countdown-eta");
  const countdownTimer = document.getElementById("countdown-timer");

  let countdownInterval = null;
  let dob;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const dobDate = document.getElementById("dob").value;
    const hour = parseInt(document.getElementById("hour").value) || 0;
    const minute = parseInt(document.getElementById("minute").value) || 0;
    if (!dobDate) return;

    dob = new Date(dobDate);
    dob.setHours(hour);
    dob.setMinutes(minute);

    const now = new Date();
    const msAlive = now - dob;

    const units = [
      { label: "Years", ms: 365.25 * 24 * 60 * 60 * 1000, roundTo: 10 },
      { label: "Months", ms: 30.4375 * 24 * 60 * 60 * 1000, roundTo: 100 },
      { label: "Days", ms: 24 * 60 * 60 * 1000, roundTo: 1000 },
      { label: "Hours", ms: 60 * 60 * 1000, roundTo: 100000 },
      { label: "Minutes", ms: 60 * 1000, roundTo: 1000000 },
      { label: "Seconds", ms: 1000, roundTo: 1000000000 }
    ];

    currentAges.innerHTML = "";
    milestoneProgress.innerHTML = "";

    let milestoneArray = [];
    let ageLines = [];

    for (let unit of units) {
      const age = msAlive / unit.ms;
      const nextMilestone = Math.ceil(age / unit.roundTo) * unit.roundTo;
      const percent = ((age / nextMilestone) * 100).toFixed(2);
      const milestoneDate = new Date(dob.getTime() + nextMilestone * unit.ms);

      ageLines.push(`<strong>${Math.floor(age).toLocaleString()}</strong> ${unit.label.toLowerCase()} old`);

      milestoneArray.push({
        label: unit.label,
        value: nextMilestone,
        percent,
        date: milestoneDate,
        unit
      });
    }

    // Summary format: You are X, or Y, or Z...
    currentAges.innerHTML = `
      <p>You are ${ageLines[0]},</p>
      ${ageLines.slice(1, -1).map(line => `<p>or ${line},</p>`).join("")}
      <p>or ${ageLines.at(-1)}.</p>
    `;

    milestoneArray.sort((a, b) => a.date - b.date);

    milestoneArray.forEach((item, index) => {
      const milestoneCard = document.createElement("div");
      milestoneCard.classList.add("milestone-card");
      if (index === 0) milestoneCard.classList.add("next-up");
      milestoneCard.style.cursor = "pointer";

      milestoneCard.innerHTML = `
        ${index === 0 ? `<p>🔥 <strong>Next Up!</strong></p>` : ""}
        <p>🎯 ${item.value.toLocaleString()} ${item.label} milestone</p>
        <div class="progress-bar">
          <div class="progress-bar-fill" style="width:${item.percent}%">${item.percent}%</div>
        </div>
        <p style="font-size:0.9rem;color:#666;">⏱ ETA: ${item.date.toLocaleString()}</p>
      `;

      milestoneCard.addEventListener("click", () => showUnitExplorer(item.unit));
      milestoneProgress.appendChild(milestoneCard);
    });

    formView.style.display = "none";
    resultView.style.display = "block";
  });

  goBackBtn.onclick = () => {
    resultView.style.display = "none";
    formView.style.display = "block";
  };

  backToSummaryBtn.onclick = () => {
    unitExplorer.style.display = "none";
    resultView.style.display = "block";
  };

  backToUnitBtn.onclick = () => {
    clearInterval(countdownInterval);
    countdownView.style.display = "none";
    unitExplorer.style.display = "block";
  };

  function showUnitExplorer(unit) {
    const now = new Date();
    const msAlive = now - dob;
    const currentValue = Math.floor(msAlive / unit.ms);

    unitTitle.textContent = `📊 ${unit.label} Milestones`;
    unitMilestones.innerHTML = "";

    const niceMilestones = generateMilestoneNumbers(currentValue, unit.label);
    for (let value of niceMilestones) {
      const milestoneDate = new Date(dob.getTime() + value * unit.ms);
      const card = document.createElement("div");
      card.classList.add("unit-milestone");

      const state = value === currentValue ? "now" : value < currentValue ? "past" : "future";
      card.classList.add(state);

      const icon = state === "now" ? "📍" : state === "past" ? "✅" : "🎯";
      card.innerHTML = `
        <div class="label">${icon} ${value.toLocaleString()} ${unit.label}</div>
        <div class="timestamp">${milestoneDate.toLocaleString()}</div>
      `;

      if (state === "future") {
        card.style.cursor = "pointer";
        card.addEventListener("click", () => showCountdown(`${value.toLocaleString()} ${unit.label}`, milestoneDate));
      }

      unitMilestones.appendChild(card);
    }

    resultView.style.display = "none";
    unitExplorer.style.display = "block";
  }

  function generateMilestoneNumbers(current, unitLabel) {
    const baseSet = new Set([current]);
  
    if (unitLabel === "Seconds") {
      [100_000_000, 250_000_000, 500_000_000, 750_000_000, 1_000_000_000, 1_500_000_000, 2_000_000_000]
        .forEach(val => baseSet.add(val));
    } else if (unitLabel === "Minutes") {
      [100_000, 250_000, 500_000, 1_000_000, 2_000_000, 5_000_000, 10_000_000, 25_000_000, 50_000_000]
        .forEach(val => baseSet.add(val));
    } else {
      [10, 100, 1000, 10000, 100000, 1000000].forEach((b) => {
        baseSet.add(Math.floor(current / b) * b);
        baseSet.add(Math.ceil(current / b) * b);
      });
      for (let i = 1; i <= 10; i++) {
        baseSet.add(i * 1000);
        baseSet.add(i * 5000);
      }
      [256, 512, 1024, 2048, 4096, 8192, 16384].forEach(v => baseSet.add(v));
      if (unitLabel === "Years") {
        [18, 21, 30, 40, 50, 60, 65, 70, 80, 100].forEach(y => baseSet.add(y));
      }
    }
  
    const sorted = [...baseSet].filter(n => n > 0).sort((a, b) => a - b);
    const near = sorted.filter(n => Math.abs(n - current) < current * 2);
    return [
      ...near.filter(n => n < current).slice(-5),
      current,
      ...near.filter(n => n > current).slice(0, 5)
    ];
  }  

  function showCountdown(label, targetDate) {
    countdownLabel.textContent = `🎯 Countdown to ${label}`;
    countdownETA.textContent = `📅 ETA: ${targetDate.toLocaleString()}`;
    updateCountdown(targetDate);
    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => updateCountdown(targetDate), 1000);

    unitExplorer.style.display = "none";
    countdownView.style.display = "block";

    document.getElementById("copy-share-link").onclick = () => {
      const url = new URL(window.location.href);
      url.searchParams.set("dob", dob.toISOString());
      url.searchParams.set("unit", label.split(" ")[1]);
      url.searchParams.set("value", label.split(" ")[0].replace(/,/g, ""));
      navigator.clipboard.writeText(url.href);
      alert("✅ Shareable link copied!");
    };

    document.getElementById("add-to-calendar").onclick = () => {
      const start = new Date(targetDate);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      const startStr = start.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      const endStr = end.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      const ics = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:Milestone: ${label}
DTSTART:${startStr}
DTEND:${endStr}
DESCRIPTION=Celebrate your milestone!
END:VEVENT
END:VCALENDAR`;
      const blob = new Blob([ics.trim()], { type: "text/calendar" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Milestone-${label}.ics`;
      link.click();
    };

    document.getElementById("google-calendar-link").onclick = () => {
      const start = new Date(targetDate);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      const format = d => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      const url = new URL("https://calendar.google.com/calendar/render");
      url.searchParams.set("action", "TEMPLATE");
      url.searchParams.set("text", `Milestone: ${label}`);
      url.searchParams.set("dates", `${format(start)}/${format(end)}`);
      url.searchParams.set("details", "Milestone generated via Age Explorer 🎉");
      url.searchParams.set("sf", "true");
      url.searchParams.set("output", "xml");
      window.open(url.toString(), "_blank");
    };
  }

  function updateCountdown(targetDate) {
    const now = new Date();
    const diff = targetDate - now;
    if (diff <= 0) {
      countdownTimer.textContent = "🚀 It's happening!";
      clearInterval(countdownInterval);
      return;
    }
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24)) % 365;
    const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    const seconds = Math.floor(diff / 1000) % 60;
    countdownTimer.textContent = `${years}y ${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  // Handle shareable URL loading
  const params = new URLSearchParams(window.location.search);
  if (params.has("dob") && params.has("unit") && params.has("value")) {
    dob = new Date(params.get("dob"));
    const unit = params.get("unit");
    const value = parseInt(params.get("value"));
    const msMap = {
      Years: 365.25 * 24 * 60 * 60 * 1000,
      Months: 30.4375 * 24 * 60 * 60 * 1000,
      Days: 24 * 60 * 60 * 1000,
      Hours: 60 * 60 * 1000,
      Minutes: 60 * 1000,
      Seconds: 1000
    };
    const targetDate = new Date(dob.getTime() + value * msMap[unit]);
    showCountdown(`${value.toLocaleString()} ${unit}`, targetDate);
  }
});
