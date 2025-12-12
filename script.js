// script.js — dynamically generate 2026 calendars with lyric snippets
(function(){
  const YEAR = 2026;
  const calendarRoot = document.getElementById('calendar');

  // Month names and required lyric snippets (exact strings provided)
  const months = [
    {name: "January", lyric: "January, you pretend to see life clearly, yearly"},
    {name: "February", lyric: "February is the time that you put the evil eye and the pride aside for the fantasy of gettin' married, very scary"},
    {name: "March", lyric: "March got you already second guessin' titles"},
    {name: "April", lyric: "April, spring is here and just like a spring, you start to spiral"},
    {name: "May", lyric: "May brings some warmer days, poolside, gettin' very tan"},
    {name: "June", lyric: "June have you movin' ice-cold, goin' back and forth with a married man"},
    {name: "July", lyric: "July, that's when I found out you lied"},
    {name: "August", lyric: "August, it was 'baby' this, 'baby' that like you had your tubes tied"},
    {name: "September", lyric: "September, we fallin' off, but I'm still the man you tryna win over"},
    {name: "October", lyric: "October is all about me 'cause your turn should've been over"},
    {name: "November", lyric: "November got you moodboardin' for next year and you're single"},
    {name: "December", lyric: "December the gift-givin' month and now you wanna rekindle our year"}
  ];

  // Weekday labels starting Sunday -> Saturday
  const weekdayLabels = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  // Deterministic function to choose a "toxic" date for each month.
  // Returns a day between 1 and daysInMonth.
  function toxicDateForMonth(monthIndex, daysInMonth){
    // Deterministic pseudo-random formula based on month index and YEAR.
    // Guarantees same result each load.
    // Formula: ((baseSeed + monthIndex * multiplier) mod daysInMonth) + 1
    const baseSeed = YEAR % 1000; // e.g., 26
    const multiplier = 13;
    const raw = (baseSeed + monthIndex * multiplier + 7);
    return (raw % daysInMonth) + 1;
  }

  // Create weekdays header node
  function createWeekdaysHeader(){
    const container = document.createElement('div');
    container.className = 'weekdays';
    weekdayLabels.forEach(w => {
      const el = document.createElement('div');
      el.className = 'weekday';
      el.textContent = w;
      container.appendChild(el);
    });
    return container;
  }

  // Build each month card
  months.forEach((m, idx) => {
    const card = document.createElement('article');
    card.className = 'month-card';
    card.setAttribute('aria-label', `${m.name} ${YEAR} calendar`);

    // Header
    const head = document.createElement('div');
    head.className = 'month-head';

    const title = document.createElement('h2');
    title.className = 'month-title';
    title.textContent = m.name;

    const yearSpan = document.createElement('div');
    yearSpan.className = 'month-year';
    yearSpan.textContent = YEAR;

    // Lyric snippet below the title
    const lyric = document.createElement('p');
    lyric.className = 'lyric';
    lyric.textContent = m.lyric;

    head.appendChild(title);
    head.appendChild(yearSpan);
    head.appendChild(lyric);

    // Calendar body
    const calWrap = document.createElement('div');
    calWrap.className = 'calendar';

    // Weekday headings
    calWrap.appendChild(createWeekdaysHeader());

    const daysGrid = document.createElement('div');
    daysGrid.className = 'days';

    // Compute number of days and starting weekday for the month
    const firstDay = new Date(YEAR, idx, 1).getDay(); // 0=Sun..6=Sat
    const daysInMonth = new Date(YEAR, idx + 1, 0).getDate(); // last day of month

    // Determine toxic date
    const toxic = toxicDateForMonth(idx, daysInMonth);

    // Fill leading empty slots
    for(let i=0;i<firstDay;i++){
      const empty = document.createElement('div');
      empty.className = 'day empty';
      empty.setAttribute('aria-hidden','true');
      daysGrid.appendChild(empty);
    }

    // Add day cells
    for(let d=1; d<=daysInMonth; d++){
      const dayEl = document.createElement('div');
      dayEl.className = 'day';
      dayEl.textContent = d;

      // Mark toxic date
      if(d === toxic){
        dayEl.classList.add('toxic');
        dayEl.setAttribute('title', `Toxic/Key Date — ${m.name} ${d}, ${YEAR}`);
        dayEl.setAttribute('aria-label', `Toxic date ${d} ${m.name} ${YEAR}`);
      } else {
        dayEl.setAttribute('aria-label', `Day ${d} ${m.name} ${YEAR}`);
      }

      daysGrid.appendChild(dayEl);
    }

    // Append everything
    calWrap.appendChild(daysGrid);
    card.appendChild(head);
    card.appendChild(calWrap);

    calendarRoot.appendChild(card);
  });

})();