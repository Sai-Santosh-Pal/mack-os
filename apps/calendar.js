// View switching logic
const navBtns = document.querySelectorAll('.nav-btn');
const calendarEl = document.querySelector('.calendar');

function showView(view) {
  navBtns.forEach(btn => btn.classList.remove('active'));
  document.querySelector(`.nav-btn[data-view="${view}"]`).classList.add('active');
  // Hide all views first
  calendarEl.style.display = 'none';
  document.querySelector('.day-view').style.display = 'none';
  document.querySelector('.week-view').style.display = 'none';
  document.querySelector('.year-view').style.display = 'none';

  if (view === 'month') {
    calendarEl.style.display = '';
    renderCalendar(viewYear, viewMonth);
  } else if (view === 'day') {
    renderDayView();
    document.querySelector('.day-view').style.display = '';
  } else if (view === 'week') {
    renderWeekView();
    document.querySelector('.week-view').style.display = '';
  } else if (view === 'year') {
    renderYearView();
    document.querySelector('.year-view').style.display = '';
  }
}
// Render Day View
function renderDayView() {
  const dayView = document.querySelector('.day-view');
  const date = selectedDate;
  dayView.innerHTML = `<div style="padding:48px;text-align:left;">
    <h2 style="font-size:2rem;font-weight:600;margin-bottom:16px;">${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}</h2>
    <div style="font-size:1.2rem;color:#636366;">No events for this day.</div>
  </div>`;
}

// Render Week View
function renderWeekView() {
  const weekView = document.querySelector('.week-view');
  const date = selectedDate;
  // Find start of week (Sunday)
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());
  let html = `<div style="padding:48px;text-align:left;">
    <h2 style="font-size:2rem;font-weight:600;margin-bottom:16px;">Week of ${monthNames[start.getMonth()]} ${start.getDate()}, ${start.getFullYear()}</h2>
    <table style="width:100%;border-collapse:collapse;">
      <tr>`;
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    html += `<th style="padding:8px 0;font-size:1.1rem;color:#636366;border-bottom:1px solid #e5e5ea;">${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][i]}</th>`;
  }
  html += '</tr><tr>';
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    html += `<td style="padding:24px 0;text-align:center;font-size:1.3rem;">${d.getDate()}</td>`;
  }
  html += '</tr></table><div style="font-size:1.2rem;color:#636366;margin-top:24px;">No events for this week.</div></div>';
  weekView.innerHTML = html;
}

// Render Year View
function renderYearView() {
  const yearView = document.querySelector('.year-view');
  const year = viewYear;
  let html = `<div style="padding:48px;text-align:left;">
    <h2 style="font-size:2rem;font-weight:600;margin-bottom:16px;">${year}</h2>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:32px;">`;
  for (let m = 0; m < 12; m++) {
    html += `<div class="month-box">
      <div class="month-name" style="font-size:1.1rem;font-weight:600;margin-bottom:8px;">${monthNames[m]}</div>`;
    // Get first day and last date
    const firstDay = new Date(year, m, 1).getDay();
    const lastDate = new Date(year, m + 1, 0).getDate();
    html += '<div style="display:grid;grid-template-columns:repeat(7,1fr);font-size:0.95rem;color:#636366;">';
    for (let i = 0; i < firstDay; i++) html += `<div></div>`;
    for (let d = 1; d <= lastDate; d++) html += `<div>${d}</div>`;
    html += '</div></div>';
  }
  html += '</div></div>';
  yearView.innerHTML = html;
}

navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    showView(btn.getAttribute('data-view'));
  });
});


// macOS-style Calendar logic
const currentDate = document.querySelector('.current-date');
const daysContainer = document.querySelector('.days');
const prevBtn = document.querySelector('.icons span:first-child');
const nextBtn = document.querySelector('.icons span:last-child');
const todayBtn = document.querySelector('.today-btn');

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

let today = new Date();
let selectedDate = new Date(today);
let viewYear = today.getFullYear();
let viewMonth = today.getMonth();

// Default to month view
showView('month');

function renderCalendar(year, month) {
  currentDate.textContent = `${monthNames[month]} ${year}`;
  daysContainer.innerHTML = '';

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayIndex = firstDayOfMonth.getDay();
  const lastDate = lastDayOfMonth.getDate();

  // Previous month's trailing days
  const prevMonthLastDate = new Date(year, month, 0).getDate();
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const li = document.createElement('li');
    li.className = 'inactive';
    li.textContent = prevMonthLastDate - i;
    daysContainer.appendChild(li);
  }

  // Current month days
  for (let i = 1; i <= lastDate; i++) {
    const li = document.createElement('li');
    li.textContent = i;
    if (
      year === selectedDate.getFullYear() &&
      month === selectedDate.getMonth() &&
      i === selectedDate.getDate()
    ) {
      li.classList.add('selected');
    }
    if (
      year === today.getFullYear() &&
      month === today.getMonth() &&
      i === today.getDate()
    ) {
      li.classList.add('today-highlight');
    }
    li.addEventListener('click', () => {
      document.querySelectorAll('.days li').forEach(el => el.classList.remove('selected'));
      li.classList.add('selected');
      selectedDate = new Date(year, month, i);
      renderCalendar(viewYear, viewMonth);
    });
    daysContainer.appendChild(li);
todayBtn.addEventListener('click', () => {
  viewYear = today.getFullYear();
  viewMonth = today.getMonth();
  selectedDate = new Date(today);
  renderCalendar(viewYear, viewMonth);
});
// Optional: Add style for today-highlight in CSS
  }

  // Next month's leading days
  const totalCells = firstDayIndex + lastDate;
  const nextDays = 7 - (totalCells % 7);
  if (nextDays < 7) {
    for (let i = 1; i <= nextDays; i++) {
      const li = document.createElement('li');
      li.className = 'inactive';
      li.textContent = i;
      daysContainer.appendChild(li);
    }
  }
}

prevBtn.addEventListener('click', () => {
  viewMonth--;
  if (viewMonth < 0) {
    viewMonth = 11;
    viewYear--;
  }
  renderCalendar(viewYear, viewMonth);
});

nextBtn.addEventListener('click', () => {
  viewMonth++;
  if (viewMonth > 11) {
    viewMonth = 0;
    viewYear++;
  }
  renderCalendar(viewYear, viewMonth);
});

renderCalendar(viewYear, viewMonth);
