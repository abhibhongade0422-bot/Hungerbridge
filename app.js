// ==================== STATE ====================
let currentRole = 'donor';
let listings = [];
let volunteerDispatch = [];
let countdownIntervals = [];

// ==================== SAMPLE DATA ====================
const sampleListings = [
  {
    id:1, name:'Paneer Biryani', type:'Cooked Meal', qty:50, address:'Hotel Grandeur, Andheri West, Mumbai',
    donor:'Hotel Grandeur', image:'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=200&fit=crop',
    status:'active', seconds:4800, claimed_by:null, notes:'Fresh, hot. Served in containers.', postedAt:'2:30 PM'
  },
  {
    id:2, name:'Mixed Veg Thali', type:'Cooked Meal', qty:120, address:'Celebration Banquet Hall, Bandra, Mumbai',
    donor:'Celebration Hall', image:'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=200&fit=crop',
    status:'active', seconds:2700, claimed_by:null, notes:'Wedding leftovers. Includes sweet.', postedAt:'3:00 PM'
  },
  {
    id:3, name:'Sandwich & Snack Boxes', type:'Snacks', qty:80, address:'Tech Park Canteen, Powai, Mumbai',
    donor:'Infosys Canteen', image:'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&h=200&fit=crop',
    status:'active', seconds:6600, claimed_by:null, notes:'Individually packed.', postedAt:'3:15 PM'
  },
  {
    id:4, name:'Dal & Rice Combo', type:'Cooked Meal', qty:35, address:'Sunrise Restaurant, Dadar, Mumbai',
    donor:'Sunrise Restaurant', image:'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=200&fit=crop',
    status:'claimed', seconds:3200, claimed_by:'Asha Foundation', notes:'Needs container pickup.', postedAt:'2:00 PM'
  },
  {
    id:5, name:'Bread Loaves & Pastries', type:'Snacks / Bakery', qty:40, address:'French Bakery, Colaba, Mumbai',
    donor:'French Bakery', image:'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=200&fit=crop',
    status:'active', seconds:3900, claimed_by:null, notes:'Day-end surplus. Best before tonight.', postedAt:'4:00 PM'
  },
  {
    id:6, name:'Chole Bhature', type:'Cooked Meal', qty:60, address:'Old Delhi Dhaba, Kurla, Mumbai',
    donor:'Old Delhi Dhaba', image:'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=200&fit=crop',
    status:'expired', seconds:0, claimed_by:null, notes:'Expired listing.', postedAt:'12:00 PM'
  }
];

const volunteerDispatches = [
  {
    id:1, food:'Paneer Biryani (50 servings)', pickup:'Hotel Grandeur, Andheri West',
    dropoff:'Asha Foundation, Bandra', distance:'4.2 km', urgency:'high', seconds:1800,
    ngo:'Asha Foundation'
  },
  {
    id:2, food:'Mixed Veg Thali (120 servings)', pickup:'Celebration Hall, Bandra',
    dropoff:'Care India NGO, Juhu', distance:'2.8 km', urgency:'medium', seconds:3600,
    ngo:'Care India NGO'
  },
  {
    id:3, food:'Sandwich Boxes (80 servings)', pickup:'Tech Park Canteen, Powai',
    dropoff:'Shelter Home, Vikhroli', distance:'1.9 km', urgency:'low', seconds:5400,
    ngo:'Shelter Home Trust'
  }
];

const leaderboardData = [
  { name:'Priya Menon', city:'Mumbai', deliveries:142, img:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop' },
  { name:'Arjun Sharma', city:'Mumbai', deliveries:67, img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop' },
  { name:'Kavya Nair', city:'Pune', deliveries:58, img:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop' },
  { name:'Rahul Desai', city:'Mumbai', deliveries:49, img:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop' },
  { name:'Sneha Patil', city:'Nagpur', deliveries:38, img:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop' }
];

const volHistoryData = [
  { food:'Dal Rice Combo', pickup:'Sunrise Restaurant', dropoff:'Asha Foundation', date:'Today, 1:15 PM', meals:35, status:'delivered' },
  { food:'Paneer Sabji', pickup:'Hotel Blue Diamond', dropoff:'Care India', date:'Yesterday, 6:30 PM', meals:45, status:'delivered' },
  { food:'Veg Biryani', pickup:'Raj Banquet', dropoff:'Hope Shelter', date:'Mar 22, 5:00 PM', meals:80, status:'delivered' },
  { food:'Snack Boxes', pickup:'Corp Canteen', dropoff:'Udaan NGO', date:'Mar 21, 3:45 PM', meals:30, status:'delivered' }
];

// ==================== PAGE NAVIGATION ====================
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  window.scrollTo(0,0);
  if (pageId === 'page-donor') initDonorDash();
  if (pageId === 'page-ngo') initNGODash();
  if (pageId === 'page-volunteer') initVolDash();
}

function loginAs(role) {
  currentRole = role;
  showPage('page-login');
  document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
  const idx = role === 'donor' ? 0 : role === 'ngo' ? 1 : 2;
  document.querySelectorAll('.role-btn')[idx] && document.querySelectorAll('.role-btn')[idx].classList.add('active');
}

function selectRole(role, btn) {
  currentRole = role;
  btn.closest('.role-selector').querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function doLogin() {
  showToast('Logging in... 🔐');
  setTimeout(() => {
    if (currentRole === 'donor') showPage('page-donor');
    else if (currentRole === 'ngo') showPage('page-ngo');
    else showPage('page-volunteer');
    showToast('Welcome back! 👋');
  }, 700);
}

function quickLogin(role) {
  currentRole = role;
  doLogin();
}

// ==================== DONOR DASHBOARD ====================
function initDonorDash() {
  listings = [...sampleListings];
  renderDonorActiveListings();
  renderDonorActivity();
  renderAllListings();
  renderDonorChart();
  startCountdowns();
}

function showDonorSection(id, el) {
  document.querySelectorAll('#page-donor .dash-section').forEach(s => s.classList.remove('active-section'));
  document.getElementById('donor-' + id).classList.add('active-section');
  document.querySelectorAll('#page-donor .nav-item').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');
  if (id === 'report') renderDonorChart();
}

function renderDonorActiveListings() {
  const container = document.getElementById('donor-active-listings');
  if (!container) return;
  const active = listings.filter(l => l.status === 'active');
  container.innerHTML = active.map(l => listingCardHTML(l, 'donor')).join('');
  startCountdowns();
}

function renderAllListings() {
  const container = document.getElementById('all-listings-grid');
  if (!container) return;
  container.innerHTML = listings.map(l => listingCardHTML(l, 'donor')).join('');
  startCountdowns();
}

function listingCardHTML(l, view) {
  const timeStr = formatSeconds(l.seconds);
  const urgent = l.seconds < 1800;
  const statusBadge = l.status === 'active'
    ? `<span class="status-badge status-active">● Active</span>`
    : l.status === 'claimed'
    ? `<span class="status-badge status-claimed">● Claimed</span>`
    : `<span class="status-badge status-expired">● Expired</span>`;

  const actionBtn = view === 'ngo' && l.status === 'active'
    ? `<button class="btn-claim" onclick="claimListing(${l.id})">Claim →</button>`
    : view === 'ngo' && l.status === 'claimed'
    ? `<button class="btn-claimed">✓ Claimed</button>`
    : statusBadge;

  return `
    <div class="listing-card" id="card-${l.id}">
      <img src="${l.image}" alt="${l.name}">
      <div class="listing-body">
        <h4>${l.name}</h4>
        <div class="listing-meta">🍱 ${l.qty} servings &nbsp;|&nbsp; 📍 ${l.address.split(',')[0]}</div>
        <div class="listing-meta">👤 ${l.donor}</div>
        <div class="listing-footer">
          ${l.status === 'active' ? `<span class="countdown-pill ${urgent ? 'urgent' : ''}" data-id="${l.id}">⏱ ${timeStr}</span>` : statusBadge}
          <span class="qty-tag">${l.qty} meals</span>
        </div>
        ${view === 'ngo' ? `<div style="margin-top:12px">${actionBtn}</div>` : ''}
      </div>
    </div>`;
}

function renderDonorActivity() {
  const container = document.getElementById('donor-activity');
  if (!container) return;
  const activities = [
    { icon:'✅', text:'Asha Foundation claimed your Paneer Biryani listing', time:'2 hours ago' },
    { icon:'📦', text:'Volunteer Arjun Sharma picked up your Veg Thali', time:'Yesterday' },
    { icon:'⭐', text:'Care India rated your listing 5 stars', time:'2 days ago' },
    { icon:'📝', text:'New listing "Bread Loaves" posted successfully', time:'Today' }
  ];
  container.innerHTML = activities.map(a => `
    <div class="activity-item">
      <div class="activity-icon">${a.icon}</div>
      <div class="activity-text"><strong>${a.text}</strong><span>${a.time}</span></div>
      <span class="activity-time">${a.time}</span>
    </div>`).join('');
}

function renderDonorChart() {
  const container = document.getElementById('donor-chart');
  if (!container) return;
  const data = [
    { label:'Week 1', val:280 }, { label:'Week 2', val:340 },
    { label:'Week 3', val:290 }, { label:'Week 4', val:330 }
  ];
  const max = Math.max(...data.map(d => d.val));
  container.innerHTML = data.map(d => `
    <div class="bar-item">
      <span style="font-size:.7rem;color:var(--amber-dark);font-weight:700">${d.val}</span>
      <div class="bar-col" style="height:${(d.val/max)*110}px"></div>
      <span>${d.label}</span>
    </div>`).join('');
}

function postListing() {
  const name = document.getElementById('food-name').value.trim();
  const qty = document.getElementById('food-qty').value;
  const address = document.getElementById('food-address').value.trim();
  const deadline = parseInt(document.getElementById('food-deadline').value);
  const type = document.getElementById('food-type').value;

  if (!name || !qty || !address) {
    showToast('⚠️ Please fill all required fields'); return;
  }

  const imgs = [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=200&fit=crop',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=200&fit=crop',
    'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&h=200&fit=crop'
  ];

  const newListing = {
    id: Date.now(), name, type, qty: parseInt(qty), address,
    donor: 'Hotel Grandeur', image: imgs[Math.floor(Math.random() * imgs.length)],
    status: 'active', seconds: deadline, claimed_by: null,
    notes: document.getElementById('food-notes').value, postedAt: 'Just now'
  };

  listings.unshift(newListing);
  sampleListings.unshift(newListing);

  document.getElementById('food-name').value = '';
  document.getElementById('food-qty').value = '';
  document.getElementById('food-address').value = '';
  document.getElementById('food-notes').value = '';
  document.getElementById('photo-preview').style.display = 'none';

  showToast('🚀 Listing posted! Countdown started.');
  showDonorSection('dashboard', null);
  renderDonorActiveListings();
}

function filterListings(filter, btn) {
  document.querySelectorAll('#donor-listings .tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  const container = document.getElementById('all-listings-grid');
  let filtered = filter === 'all' ? listings : listings.filter(l => l.status === filter);
  container.innerHTML = filtered.map(l => listingCardHTML(l, 'donor')).join('');
  startCountdowns();
}

function previewPhoto(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      const img = document.getElementById('photo-preview');
      img.src = e.target.result;
      img.style.display = 'block';
    };
    reader.readAsDataURL(input.files[0]);
  }
}

// ==================== NGO DASHBOARD ====================
function initNGODash() {
  renderNGOLiveListings();
  renderNGOClaimed();
  renderNGOChart();
  renderMapNearby();
  startCountdowns();
}

function showNGOSection(id, el) {
  document.querySelectorAll('#page-ngo .dash-section').forEach(s => s.classList.remove('active-section'));
  document.getElementById(id).classList.add('active-section');
  document.querySelectorAll('#page-ngo .nav-item').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');
}

function renderNGOLiveListings() {
  const container = document.getElementById('ngo-live-listings');
  if (!container) return;
  const active = sampleListings.filter(l => l.status === 'active');
  container.innerHTML = active.map(l => listingCardHTML(l, 'ngo')).join('');
  startCountdowns();
}

function filterNGOListings(type) {
  const container = document.getElementById('ngo-live-listings');
  let filtered = sampleListings.filter(l => l.status === 'active');
  if (type !== 'all') {
    filtered = filtered.filter(l => l.type.toLowerCase().includes(type));
  }
  container.innerHTML = filtered.map(l => listingCardHTML(l, 'ngo')).join('');
  startCountdowns();
}

function claimListing(id) {
  const listing = sampleListings.find(l => l.id === id);
  if (!listing || listing.status !== 'active') return;
  listing.status = 'claimed';
  listing.claimed_by = 'Asha Foundation';
  renderNGOLiveListings();
  renderNGOClaimed();
  showToast('✅ Claimed! Dispatching volunteers...');
  // Also add dispatch item for volunteers
  volunteerDispatch.unshift({
    id: Date.now(), food: `${listing.name} (${listing.qty} servings)`,
    pickup: listing.address, dropoff: 'Asha Foundation, Bandra',
    distance: (Math.random()*5+1).toFixed(1) + ' km', urgency: 'high',
    seconds: listing.seconds, ngo: 'Asha Foundation'
  });
}

function renderNGOClaimed() {
  const container = document.getElementById('ngo-claimed-list');
  if (!container) return;
  const claimed = sampleListings.filter(l => l.status === 'claimed');
  container.innerHTML = claimed.length
    ? claimed.map(l => listingCardHTML(l, 'ngo-claimed')).join('')
    : '<p style="color:var(--text-muted);padding:20px">No active claims yet.</p>';
}

function renderNGOChart() {
  const container = document.getElementById('ngo-chart');
  if (!container) return;
  const data = [
    { label:'Mon', val:120 }, { label:'Tue', val:200 }, { label:'Wed', val:160 },
    { label:'Thu', val:280 }, { label:'Fri', val:340 }, { label:'Sat', val:220 }, { label:'Sun', val:100 }
  ];
  const max = Math.max(...data.map(d => d.val));
  container.innerHTML = data.map(d => `
    <div class="bar-item">
      <span style="font-size:.7rem;color:var(--ngo-color);font-weight:700">${d.val}</span>
      <div class="bar-col" style="height:${(d.val/max)*110}px;background:linear-gradient(180deg,#2ECC71,#27AE60)"></div>
      <span>${d.label}</span>
    </div>`).join('');
}

function renderMapNearby() {
  const container = document.getElementById('map-nearby-list');
  if (!container) return;
  const active = sampleListings.filter(l => l.status === 'active').slice(0,4);
  container.innerHTML = active.map(l => `
    <div class="activity-item" style="margin-bottom:10px">
      <div class="activity-icon">📍</div>
      <div class="activity-text">
        <strong>${l.name}</strong>
        <span>${l.qty} servings • ${l.address.split(',')[1] || l.address}</span>
      </div>
      <button class="btn-claim" onclick="claimListing(${l.id})" style="font-size:.78rem;padding:6px 14px">Claim</button>
    </div>`).join('');
}

// ==================== VOLUNTEER DASHBOARD ====================
function initVolDash() {
  renderDispatchQueue();
  renderVolHistory();
  renderLeaderboard();
}

function showVolSection(id, el) {
  document.querySelectorAll('#page-volunteer .dash-section').forEach(s => s.classList.remove('active-section'));
  document.getElementById(id).classList.add('active-section');
  document.querySelectorAll('#page-volunteer .nav-item').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');
}

function renderDispatchQueue() {
  const container = document.getElementById('dispatch-cards');
  if (!container) return;
  const dispatches = [...volunteerDispatches, ...volunteerDispatch];
  container.innerHTML = dispatches.map(d => `
    <div class="dispatch-card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <h4>🍱 ${d.food}</h4>
        <span style="background:${d.urgency==='high'?'#FFF0F0':d.urgency==='medium'?'#FFF8E8':'#E8F8EF'};color:${d.urgency==='high'?'var(--danger)':d.urgency==='medium'?'var(--amber-dark)':'#27AE60'};padding:4px 10px;border-radius:50px;font-size:.75rem;font-weight:700">${d.urgency.toUpperCase()} PRIORITY</span>
      </div>
      <div class="dispatch-meta">📍 Pickup: ${d.pickup}</div>
      <div class="dispatch-meta">🏠 Dropoff: ${d.dropoff}</div>
      <div class="dispatch-meta">📏 Distance: ${d.distance}</div>
      <div class="dispatch-countdown">⏰ Pickup deadline: <span data-seconds="${d.seconds}">${formatSeconds(d.seconds)}</span></div>
      <div class="dispatch-actions">
        <button class="btn-accept" onclick="acceptDispatch(this, '${d.food}')">✓ Accept</button>
        <button class="btn-decline">✕ Skip</button>
      </div>
    </div>`).join('');
  startCountdowns();
}

function acceptDispatch(btn, food) {
  btn.closest('.dispatch-card').style.opacity = '.5';
  btn.closest('.dispatch-card').style.pointerEvents = 'none';
  showToast('🚴 Dispatch accepted! Navigation starting...');
  setTimeout(() => {
    showVolSection('vol-active', null);
  }, 1200);
}

function markDelivered() {
  showToast('🎉 Delivery confirmed! Great job!');
  setTimeout(() => {
    showVolSection('vol-history', null);
  }, 1000);
}

function toggleAvailability(checkbox) {
  const status = document.getElementById('avail-status');
  if (checkbox.checked) {
    status.innerHTML = '<span class="status-dot green"></span> Available';
    showToast('🟢 You are now available for dispatch');
  } else {
    status.innerHTML = '<span class="status-dot red"></span> Unavailable';
    showToast('🔴 You are now offline');
  }
}

function renderVolHistory() {
  const container = document.getElementById('vol-history-list');
  if (!container) return;
  container.innerHTML = volHistoryData.map(v => `
    <div class="activity-item">
      <div class="activity-icon">✅</div>
      <div class="activity-text">
        <strong>${v.food} — ${v.meals} meals to ${v.dropoff}</strong>
        <span>From: ${v.pickup} &nbsp;•&nbsp; ${v.date}</span>
      </div>
      <span class="status-badge status-active" style="margin-left:auto;white-space:nowrap">Delivered</span>
    </div>`).join('');
}

function renderLeaderboard() {
  const container = document.getElementById('leaderboard-list');
  if (!container) return;
  const rankClass = ['gold','silver','bronze','',''];
  container.innerHTML = leaderboardData.map((l, i) => `
    <div class="leader-item">
      <span class="leader-rank ${rankClass[i]}">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '#' + (i+1)}</span>
      <img src="${l.img}" alt="${l.name}">
      <div class="leader-info">
        <strong>${l.name}${i===1?' (You)':''}</strong>
        <span>${l.city} • ${l.deliveries} deliveries</span>
      </div>
      <span class="leader-score">${l.deliveries} 🍱</span>
    </div>`).join('');
}

// ==================== COUNTDOWNS ====================
function startCountdowns() {
  clearInterval(window.mainCountdown);
  window.mainCountdown = setInterval(() => {
    document.querySelectorAll('[data-id]').forEach(el => {
      const id = parseInt(el.dataset.id);
      const listing = sampleListings.find(l => l.id === id);
      if (!listing) return;
      if (listing.seconds > 0) {
        listing.seconds--;
        el.textContent = '⏱ ' + formatSeconds(listing.seconds);
        if (listing.seconds < 1800) el.classList.add('urgent');
        if (listing.seconds === 0) {
          listing.status = 'expired';
          el.textContent = 'Expired';
          el.classList.add('urgent');
        }
      }
    });
    document.querySelectorAll('[data-seconds]').forEach(el => {
      let s = parseInt(el.dataset.seconds);
      if (s > 0) {
        s--;
        el.dataset.seconds = s;
        el.textContent = formatSeconds(s);
      }
    });
  }, 1000);
}

function formatSeconds(s) {
  if (s <= 0) return 'Expired';
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m left`;
  if (m > 0) return `${m}m ${sec}s left`;
  return `${sec}s left`;
}

// Hero card countdowns
function startHeroCountdowns() {
  const heroCountdowns = document.querySelectorAll('.hero .countdown');
  heroCountdowns.forEach(el => {
    let s = parseInt(el.dataset.seconds) || 3600;
    setInterval(() => {
      if (s > 0) s--;
      el.textContent = formatSeconds(s);
    }, 1000);
  });
}

// ==================== TOAST ====================
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ==================== LIVE STATS COUNTER ====================
function animateStats() {
  const counters = document.querySelectorAll('.stat-num');
  counters.forEach(counter => {
    const target = parseInt(counter.textContent.replace(/,/g, ''));
    if (isNaN(target)) return;
    let count = 0;
    const step = target / 60;
    const interval = setInterval(() => {
      count += step;
      if (count >= target) { counter.textContent = target.toLocaleString(); clearInterval(interval); }
      else counter.textContent = Math.floor(count).toLocaleString();
    }, 20);
  });
}

// ==================== INIT ====================
window.addEventListener('DOMContentLoaded', () => {
  startHeroCountdowns();
  animateStats();
  // Live stat ticker on landing
  setInterval(() => {
    const el = document.querySelector('.hero-stats .stat:first-child .stat-num');
    if (el) {
      let val = parseInt(el.textContent.replace(/,/g, ''));
      val += Math.floor(Math.random() * 3);
      el.textContent = val.toLocaleString();
    }
  }, 4000);
});
