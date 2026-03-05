const filmSelect = document.getElementById('film-select');
const triggerSelect = document.getElementById('trigger-select');
const checkBtn = document.getElementById('check-btn');
const result = document.getElementById('result');
const resetBtn = document.getElementById('reset-btn');
const browseList = document.getElementById('browse-list');

// Populate film dropdown
Object.keys(films).sort().forEach(title => {
  const opt = document.createElement('option');
  opt.value = title;
  opt.textContent = title;
  filmSelect.appendChild(opt);
});

filmSelect.addEventListener('change', () => {
  const selected = filmSelect.value;

  // Reset downstream UI
  triggerSelect.innerHTML = '<option value="">-- Select an event --</option>';
  triggerSelect.disabled = true;
  checkBtn.disabled = true;
  result.classList.add('hidden');
  result.textContent = '';
  resetBtn.classList.add('hidden');

  if (!selected) {
    browseList.innerHTML = '<p class="muted">Select a film above to see all its event information.</p>';
    return;
  }

  // Populate triggers
  const triggers = films[selected];
  Object.keys(triggers).forEach(trigger => {
    const opt = document.createElement('option');
    opt.value = trigger;
    opt.textContent = trigger;
    triggerSelect.appendChild(opt);
  });
  triggerSelect.disabled = false;

  // Render browse list
  renderBrowseList(selected, triggers);
});

triggerSelect.addEventListener('change', () => {
  checkBtn.disabled = !triggerSelect.value;
  result.classList.add('hidden');
  result.textContent = '';
  resetBtn.classList.add('hidden');
});

checkBtn.addEventListener('click', () => {
  const film = filmSelect.value;
  const trigger = triggerSelect.value;
  if (!film || !trigger) return;

  const answer = films[film][trigger];
  const isYes = answer === 'Yes';

  result.className = 'result ' + (isYes ? 'yes' : 'no');
  result.innerHTML = `
    <span class="result-icon">${isYes ? '⚠️' : '✅'}</span>
    <span class="result-text">
      <strong>${trigger}</strong><br>
      ${isYes ? 'Yes, this occurs in <em>' + film + '</em>.' : 'No, this does not occur in <em>' + film + '</em>.'}
    </span>
  `;
  result.classList.remove('hidden');
  resetBtn.classList.remove('hidden');
});

resetBtn.addEventListener('click', () => {
  filmSelect.value = '';
  triggerSelect.innerHTML = '<option value="">-- Select an event --</option>';
  triggerSelect.disabled = true;
  checkBtn.disabled = true;
  result.className = 'result hidden';
  result.textContent = '';
  resetBtn.classList.add('hidden');
  browseList.innerHTML = '<p class="muted">Select a film above to see all its event information.</p>';
});

function renderBrowseList(film, triggers) {
  const items = Object.entries(triggers).map(([trigger, answer]) => {
    const isYes = answer === 'Yes';
    return `
      <div class="browse-item ${isYes ? 'yes' : 'no'}">
        <span class="browse-icon">${isYes ? '⚠️' : '✅'}</span>
        <span>${trigger}</span>
        <span class="browse-answer">${answer}</span>
      </div>
    `;
  }).join('');
  browseList.innerHTML = items;
}
