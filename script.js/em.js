// Data - at least 6 cards
const cardsData = [
  {id:'c1', icon:'🚨', name:'জাতীয় জরুরি নম্বর', en:'National Emergency', number:'999', category:'All'},
  {id:'c2', icon:'👮‍♂️', name:'পুলিশ হেল্পলাইন', en:'Police Helpline', number:'999', category:'Police'},
  {id:'c3', icon:'🚒', name:'ফায়ার সার্ভিস', en:'Fire Service', number:'999', category:'Fire'},
  {id:'c4', icon:'🚑', name:'এম্বুলেন্স সার্ভিস', en:'Ambulance Service', number:'1994-999999', category:'Health'},
  {id:'c5', icon:'👩‍👧', name:'মহিলা ও শিশু হেল্পলাইন', en:'Women & Child Helpline', number:'109', category:'Help'},
  {id:'c6', icon:'⚡', name:'বিদ্যুৎ হেল্পলাইন', en:'Electricity Helpline', number:'16216', category:'Electricity'},
  {id:'c7', icon:'📻', name:'বাংলাদেশ রেলওয়ে হেল্পলাইন', en:'Bangladesh Railway', number:'163', category:'Travel'},
  {id:'c8', icon:'🛡️', name:'দুর্নীতি দমন হেল্পলাইন', en:'Anti-Corruption', number:'106', category:'Govt'},
  {id:'c9', icon:'🏥', name:'হাসপাতাল সেবা', en:'Hospital Service', number:'16263', category:'Health'},
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
      <button class="heart" aria-label="favorite" title="Add heart" data-id="${card.id}">💗</button>

      <div class="meta">
        <div class="icon" aria-hidden="true">${card.icon}</div>
        <div class="titles">
          <div class="name">${card.name}</div>
          <div class="en">${card.en}</div>
        </div>
      </div>

      <div>
        <div class="number">${card.number}</div>
        <div class="badge">${card.category}</div>

        <div class="actions">
          <button class="btn copy btn-copy" data-number="${card.number}" data-name="${card.en}" title="Copy number">
            📋 Copy
          </button>
          <button class="btn call btn-call" data-id="${card.id}" data-name="${card.en}" data-number="${card.number}" title="Call">
            📞 Call
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
