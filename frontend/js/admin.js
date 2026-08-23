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
        <td>${u.region || '—'}</td>
        <td>${u.role}</td>
        <td>${u.role !== 'admin' ? `<span class="delete-btn" onclick="deleteUserById(${u.id})">✕</span>` : ''}</td>
      </tr>
    `).join('');
    document.getElementById('users-table').innerHTML = rows || '<tr><td colspan="5">No users found</td></tr>';
  }catch(err){ console.error(err); }
}

async function deleteUserById(id){
  if(!confirm('Delete this user and all their data? This cannot be undone.')) return;
  try{
    const res = await fetch(`${API_BASE}/admin/users/${id}`, { method:'DELETE', headers: authHeaders() });
    if(!res.ok){ alert('Error deleting user'); return; }
    loadUsers();
    loadStats();
  }catch(err){ alert('Could not connect to backend'); }
}

async function loadCropLookup(){
  try{
    const res = await fetch(`${API_BASE}/admin/crop-lookup`, { headers: authHeaders() });
    const data = await res.json();
    const rows = (data.entries || []).map(e => `
      <tr>
        <td>${e.region}</td><td>${e.season}</td><td>${e.soil_type}</td><td>${e.recommended_crops}</td>
        <td><span class="delete-btn" onclick="deleteCropLookupEntry(${e.id})">✕</span></td>
      </tr>
    `).join('');
    document.getElementById('crop-lookup-table').innerHTML = rows || '<tr><td colspan="5">No entries found</td></tr>';
  }catch(err){ console.error(err); }
}

async function addCropLookupEntry(){
  const region = document.getElementById('new-region').value.trim();
  const season = document.getElementById('new-season').value;
  const soilType = document.getElementById('new-soil').value;
  const recommendedCrops = document.getElementById('new-crops').value.trim();
  if(!region || !recommendedCrops){ alert('Fill in all fields'); return; }

  try{
    const res = await fetch(`${API_BASE}/admin/crop-lookup`, {
      method:'POST', headers: authHeaders(),
      body: JSON.stringify({ region, season, soilType, recommendedCrops })
    });
    if(!res.ok){ alert('Error adding entry'); return; }
    document.getElementById('new-crops').value = '';
    loadCropLookup();
  }catch(err){ alert('Could not connect to backend'); }
}

async function deleteCropLookupEntry(id){
  if(!confirm('Delete this entry?')) return;
  try{
    const res = await fetch(`${API_BASE}/admin/crop-lookup/${id}`, { method:'DELETE', headers: authHeaders() });
    if(!res.ok){ alert('Error deleting entry'); return; }
    loadCropLookup();
  }catch(err){ alert('Could not connect to backend'); }
}