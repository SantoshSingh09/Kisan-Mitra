// ===================== ADMIN PANEL =====================

async function initAdminPage(){
  const user = getUser();
  if(!user || user.role !== 'admin'){
    document.getElementById('access-denied').style.display = 'block';
    return;
  }
  document.getElementById('admin-body').style.display = 'block';
  loadStats();
  loadUsers();
  loadCropLookup();
}

async function loadStats(){
  try{
    const res = await fetch(`${API_BASE}/admin/stats`, { headers: authHeaders() });
    const data = await res.json();
    document.getElementById('stat-users').textContent = data.totalUsers;
    document.getElementById('stat-crops').textContent = data.totalCrops;
    document.getElementById('stat-expenses').textContent = data.totalExpenses;
  }catch(err){ console.error(err); }
}

async function loadUsers(){
  try{
    const res = await fetch(`${API_BASE}/admin/users`, { headers: authHeaders() });
    const data = await res.json();
    const rows = (data.users || []).map(u => `
      <tr>
        <td>${u.name}</td>
        <td>${u.phone}</td>
        <td>${placeLabelHi(u.region, u.block)}</td>
        <td>${HI_ROLES[u.role] || u.role}</td>
        <td>${u.role !== 'admin' ? `<span class="delete-btn" onclick="deleteUserById(${u.id})">✕</span>` : ''}</td>
      </tr>
    `).join('');
    document.getElementById('users-table').innerHTML = rows || '<tr><td colspan="5">कोई उपयोगकर्ता नहीं मिला</td></tr>';
  }catch(err){ console.error(err); }
}

async function deleteUserById(id){
  if(!confirm('क्या आप इस उपयोगकर्ता और उसका पूरा डेटा हटाना चाहते हैं? यह वापस नहीं हो सकेगा।')) return;
  try{
    const res = await fetch(`${API_BASE}/admin/users/${id}`, { method:'DELETE', headers: authHeaders() });
    if(!res.ok){ alert('उपयोगकर्ता हटाने में समस्या आई'); return; }
    loadUsers();
    loadStats();
  }catch(err){ alert('सर्वर से जुड़ नहीं पाए'); }
}

async function loadCropLookup(){
  try{
    const res = await fetch(`${API_BASE}/admin/crop-lookup`, { headers: authHeaders() });
    const data = await res.json();
    const rows = (data.entries || []).map(e => `
      <tr>
        <td>${hiPlace(e.region)}</td><td>${hiSeason(e.season)}</td><td>${hiSoil(e.soil_type)}</td><td>${String(e.recommended_crops).split(',').map(c => hiCrop(c.trim())).join(', ')}</td>
        <td><span class="delete-btn" onclick="deleteCropLookupEntry(${e.id})">✕</span></td>
      </tr>
    `).join('');
    document.getElementById('crop-lookup-table').innerHTML = rows || '<tr><td colspan="5">कोई एंट्री नहीं मिली</td></tr>';
  }catch(err){ console.error(err); }
}

async function addCropLookupEntry(){
  const region = document.getElementById('new-region').value.trim();
  const season = document.getElementById('new-season').value;
  const soilType = document.getElementById('new-soil').value;
  const recommendedCrops = document.getElementById('new-crops').value.trim();
  if(!region || !recommendedCrops){ alert('सभी जानकारी भरें'); return; }

  try{
    const res = await fetch(`${API_BASE}/admin/crop-lookup`, {
      method:'POST', headers: authHeaders(),
      body: JSON.stringify({ region, season, soilType, recommendedCrops })
    });
    if(!res.ok){ alert('एंट्री जोड़ने में समस्या आई'); return; }
    document.getElementById('new-crops').value = '';
    loadCropLookup();
  }catch(err){ alert('सर्वर से जुड़ नहीं पाए'); }
}

async function deleteCropLookupEntry(id){
  if(!confirm('क्या आप यह एंट्री हटाना चाहते हैं?')) return;
  try{
    const res = await fetch(`${API_BASE}/admin/crop-lookup/${id}`, { method:'DELETE', headers: authHeaders() });
    if(!res.ok){ alert('एंट्री हटाने में समस्या आई'); return; }
    loadCropLookup();
  }catch(err){ alert('सर्वर से जुड़ नहीं पाए'); }
}