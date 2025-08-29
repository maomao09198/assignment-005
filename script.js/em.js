// Data - at least 6 cards
const cardsData = [
  {id:'c1', icon:'<img src="./assets/emergency.png" alt="" style="width:30px;height:30px;">', name:'National Emergency Number', en:'National Emergency', number:'999', category:'All'},
  {id:'c2', icon:'<img src="./assets/police.png" alt="" style="width:30px;height:30px;">', name:'Police Helpline Number', en:'Police', number:'999', category:'Police'},
  {id:'c3', icon:'<img src="./assets/fire-service.png" alt="" style="width:30px;height:30px;">', name:'Fire Service Number', en:'Fire Service', number:'999', category:'Fire'},
  {id:'c4', icon:'<img src="./assets/ambulance.png" alt="emergency" style="width:30px;height:30px;">', name:'Ambulance Service', en:'Ambulance', number:'1994-999999', category:'Health'},
  {id:'c5', icon:'<img src="./assets/emergency.png" alt="" style="width:30px;height:30px;">', name:'Women & Child Helpline', en:'Women & Child Helpline', number:'109', category:'Help'},
  {id:'c6', icon:'<img src="./assets/emergency.png" alt="" style="width:30px;height:30px;">', name:'Anti-Corruption Helpline', en:'Anti-Corruption', number:'106', category:'Govt'},
  {id:'c7', icon:'<img src="./assets/emergency.png" alt="" style="width:30px;height:30px;">', name:'Electricity Helpline', en:'Electricity Outage', number:'16216', category:'Electricity'},
  {id:'c8', icon:'<img src="./assets/emergency.png" alt="" style="width:30px;height:30px;">', name:'Brac Helpline', en:'Brac', number:'16445', category:'NGO'},
  {id:'c9', icon:'<img src="./assets/emergency.png" alt="" style="width:30px;height:30px;">', name:'Bangladesh Railway Helpline ', en:'Bangladesh Railway', number:'163', category:'Travel'},
];

// Counters & state
let heartCount = 0;
let coinCount = 100;
let copyCount = 0;
const costPerCall = 20;

// DOM refs
const cardsContainer = document.getElementById('cardsContainer');
const navHeart = document.getElementById('navHeartCount');
const navCoin = document.getElementById('navCoinCount');
const navCopy = document.getElementById('navCopyCount');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistory');

function updateNav(){
  navHeart.textContent = heartCount;
  navCoin.textContent = coinCount;
  navCopy.textContent = copyCount;
}

// create card HTML
function renderCards(){
  cardsContainer.innerHTML = '';
  cardsData.forEach(card => {
    const el = document.createElement('article');
    el.className = 'card';
    el.dataset.id = card.id;
    el.innerHTML = `
      <button class="heart" aria-label="favorite" title="Add heart" data-id="${card.id}"><i class="fa-regular fa-heart"></i></button>

      <div class="meta">
        <div class="icon" aria-hidden="true">${card.icon}</div>
        
      </div>

      <div>
      <div class="titles">
          <div class="name">${card.name}</div>
          <div class="en">${card.en}</div>
        </div>
        <div class="number">${card.number}</div>
        <div class="badge">${card.category}</div>

        <div class="actions">
          <button class="btn copy btn-copy" data-number="${card.number}" data-name="${card.en}" title="Copy number">
            <i class="fa-regular fa-copy"></i> Copy
          </button>
          <button class="btn call btn-call" data-id="${card.id}" data-name="${card.en}" data-number="${card.number}" title="Call">
            <i class="fa-solid fa-phone"></i> Call
          </button>
        </div>
      </div>
    `;
    cardsContainer.appendChild(el);
  });
}

// HISTORY utilities
function addHistoryItem(name, number){
  const timeStr = new Date().toLocaleTimeString();
  const li = document.createElement('li');
  li.className = 'item';
  li.innerHTML = `
    <div class="meta">
      <div class="name">${name}</div>
      <div class="time">${number} • ${timeStr}</div>
    </div>
    <div style="font-size:12px;color:var(--muted)">${timeStr}</div>
  `;
  historyList.prepend(li);
}

// COPY handler
async function handleCopy(number, name){
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(number);
    } else {
      const ta = document.createElement('textarea');
      ta.value = number;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    copyCount++;
    updateNav();
    alert(`Copied ${number} (${name}) to clipboard.`);
  } catch (err) {
    alert('Copy failed. You can manually select and copy the number: ' + number);
  }
}

// CALL handler
function handleCall(id, number, name){
  if (coinCount < costPerCall) {
    alert('Not enough coins to make the call. Each call costs ' + costPerCall + ' coins.');
    return;
  }
  alert(`Calling ${name} at ${number} ...`);
  coinCount -= costPerCall;
  updateNav();
  addHistoryItem(name, number);
}

// Event delegation
cardsContainer.addEventListener('click', function(e){
  const heartBtn = e.target.closest('.heart');
  if (heartBtn) {
    heartCount++;
    heartBtn.classList.add('favorite');
    setTimeout(()=>heartBtn.classList.remove('favorite'), 600);
    updateNav();
    return;
  }

  const copyBtn = e.target.closest('.btn-copy');
  if (copyBtn) {
    handleCopy(copyBtn.dataset.number, copyBtn.dataset.name || 'Service');
    return;
  }

  const callBtn = e.target.closest('.btn-call');
  if (callBtn) {
    handleCall(callBtn.dataset.id, callBtn.dataset.number, callBtn.dataset.name || 'Service');
    return;
  }
});

// Clear history
clearHistoryBtn.addEventListener('click', function(){
  if (!historyList.children.length) {
    alert('Call history is already empty.');
    return;
  }
  if (confirm('Clear all call history?')) {
    historyList.innerHTML = '';
  }
});

// initialize
renderCards();
updateNav();
