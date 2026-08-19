// ===================== KHARCH-KAMAI (real backend API) =====================

let selectedCropId = null;

async function loadCrops() {
  try {
    const res = await fetch(`${API_BASE}/finance/crops`, { headers: authHeaders() });
    const data = await res.json();
    const select = document.getElementById('crop-select');
    select.innerHTML = '<option value="">— Fasal select karein —</option>';
    (data.crops || []).forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = `${c.crop_name} (${c.season || 'season?'})`;
      select.appendChild(opt);
    });
  } catch (err) { console.error(err); }
}

function toggleAddCropForm() {
  const form = document.getElementById('add-crop-form');
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

async function createCrop() {
  const cropName = document.getElementById('new-crop-name').value.trim();
  const season = document.getElementById('new-crop-season').value;
  const area = parseFloat(document.getElementById('new-crop-area').value) || null;
  if (!cropName) { alert('Fasal ka naam zaroori hai'); return; }
  try {
    const res = await fetch(`${API_BASE}/finance/crop`, {
      method: 'POST', headers: authHeaders(),
      body: JSON.stringify({ cropName, season, area, sowingDate: new Date().toISOString().slice(0, 10) })
    });
    const data = await res.json();
    if (!res.ok) { alert(data.message || 'Error adding crop'); return; }
    document.getElementById('new-crop-name').value = '';
    document.getElementById('new-crop-area').value = '';
    document.getElementById('add-crop-form').style.display = 'none';
    await loadCrops();
    document.getElementById('crop-select').value = data.cropId;
    onCropSelect();
  } catch (err) { alert('Backend se connect nahi ho paya'); }
}

function onCropSelect() {
  const val = document.getElementById('crop-select').value;
  selectedCropId = val || null;
  const body = document.getElementById('finance-body');
  const emptyMsg = document.getElementById('finance-empty-msg');
  if (selectedCropId) {
    body.style.display = 'block'; emptyMsg.style.display = 'none';
    loadSummary();
  } else {
    body.style.display = 'none'; emptyMsg.style.display = 'block';
  }
}

function switchFinanceTab(tab) {
  document.getElementById('tab-expense').classList.toggle('active', tab === 'expense');
  document.getElementById('tab-income').classList.toggle('active', tab === 'income');
  document.getElementById('finance-form-expense').style.display = tab === 'expense' ? 'block' : 'none';
  document.getElementById('finance-form-income').style.display = tab === 'income' ? 'block' : 'none';
}

async function addExpense() {
  const type = document.getElementById('exp-type').value;
  const amount = parseFloat(document.getElementById('exp-amount').value);
  if (!amount || amount <= 0) { alert('Sahi amount daalein'); return; }
  try {
    const res = await fetch(`${API_BASE}/finance/expense`, {
      method: 'POST', headers: authHeaders(),
      body: JSON.stringify({ cropId: selectedCropId, type, amount })
    });
    if (!res.ok) { const d = await res.json(); alert(d.message || 'Error'); return; }
    document.getElementById('exp-amount').value = '';
    loadSummary();
  } catch (err) { alert('Backend se connect nahi ho paya'); }
}

async function addSale() {
  const quantity = parseFloat(document.getElementById('inc-qty').value);
  const rate = parseFloat(document.getElementById('inc-rate').value);
  const mandiName = document.getElementById('inc-mandi').value.trim();
  if (!quantity || !rate) { alert('Quantity aur rate zaroori hai'); return; }
  try {
    const res = await fetch(`${API_BASE}/finance/sale`, {
      method: 'POST', headers: authHeaders(),
      body: JSON.stringify({ cropId: selectedCropId, quantity, rate, mandiName })
    });
    if (!res.ok) { const d = await res.json(); alert(d.message || 'Error'); return; }
    document.getElementById('inc-qty').value = '';
    document.getElementById('inc-rate').value = '';
    document.getElementById('inc-mandi').value = '';
    loadSummary();
  } catch (err) { alert('Backend se connect nahi ho paya'); }
}

async function loadSummary() {
  if (!selectedCropId) return;
  try {
    const res = await fetch(`${API_BASE}/finance/summary/${selectedCropId}`, { headers: authHeaders() });
    const data = await res.json();
    if (!res.ok) { return; }
    document.getElementById('sum-expense').textContent = '₹' + data.totalExpense.toLocaleString('en-IN');
    document.getElementById('sum-income').textContent = '₹' + data.totalIncome.toLocaleString('en-IN');
    const box = document.getElementById('sum-profit-box'), pEl = document.getElementById('sum-profit');
    pEl.textContent = (data.profit >= 0 ? '+' : '-') + '₹' + Math.abs(data.profit).toLocaleString('en-IN');
    box.className = 'summary-box ' + (data.profit >= 0 ? 'profit' : 'loss');

    const rows = [];
    (data.expenses || []).forEach(e => rows.push(`<div class="entry-row"><span>${e.type} (kharcha)</span><span class="amt exp">−₹${e.amount.toLocaleString('en-IN')}</span><span class="delete-btn" onclick="deleteEntry('expense', ${e.id})">✕</span></div>`));
    (data.sales || []).forEach(s => rows.push(`<div class="entry-row"><span>${s.quantity} qtl @ ₹${s.rate} (${s.mandi_name || 'bikri'})</span><span class="amt inc">+₹${(s.quantity * s.rate).toLocaleString('en-IN')}</span><span class="delete-btn" onclick="deleteEntry('sale', ${s.id})">✕</span></div>`));
    document.getElementById('finance-history').innerHTML = rows.length ? rows.join('') : '<div class="empty">Abhi tak koi entry nahi hui</div>';
  } catch (err) { console.error(err); }
}

async function deleteEntry(type, id) {
  if (!confirm('Kya aap yeh entry delete karna chahte hain?')) return;
  try {
    const res = await fetch(`${API_BASE}/finance/${type}/${id}`, {
      method: 'DELETE', headers: authHeaders()
    });
    if (!res.ok) { alert('Delete karne mein error aayi'); return; }
    loadSummary();
  } catch (err) {
    alert('Backend se connect nahi ho paya');
  }
}
async function deleteCurrentCrop() {
  if (!selectedCropId) { alert('Pehle ek fasal select karein'); return; }
  if (!confirm('Kya aap yeh poori fasal delete karna chahte hain? Iske saath judi saari kharcha/kamai entries bhi hata di jayengi (delete karne ke baad).')) return;
  try {
    const res = await fetch(`${API_BASE}/finance/crop/${selectedCropId}`, {
      method: 'DELETE', headers: authHeaders()
    });
    if (!res.ok) { const d = await res.json(); alert(d.message || 'Delete karne mein error aayi'); return; }
    selectedCropId = null;
    document.getElementById('finance-body').style.display = 'none';
    document.getElementById('finance-empty-msg').style.display = 'block';
    loadCrops();
  } catch (err) { alert('Backend se connect nahi ho paya'); }
}
