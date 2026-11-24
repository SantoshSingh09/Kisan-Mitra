async function loadProfile() {
  try {
    const res = await fetch(`${API_BASE}/profile`, { headers: authHeaders() });
    const data = await res.json();
    if (!res.ok) { document.getElementById('profile-status').textContent = 'प्रोफाइल लोड करने में समस्या'; return; }

    document.getElementById('profile-name').value = data.user.name;
    document.getElementById('profile-phone').value = data.user.phone;
    setupDistrictBlock(document.getElementById('profile-district'), document.getElementById('profile-block'), data.user.region, data.user.block);
    document.getElementById('profile-status').style.display = 'none';
    document.getElementById('profile-form').style.display = 'block';
  } catch (err) {
    document.getElementById('profile-status').textContent = 'बैकएंड से जुड़ नहीं पाया';
  }
}

async function saveProfile() {
  const name = document.getElementById('profile-name').value.trim();
  const region = document.getElementById('profile-district').value;
  const block = document.getElementById('profile-block').value;
  const msg = document.getElementById('profile-msg');
  if (!name) { msg.textContent = 'नाम ज़रूरी है'; msg.style.color = '#A3432E'; return; }
  if (!region || !block) { msg.textContent = 'कृपया जिला और ब्लॉक दोनों चुनें'; msg.style.color = '#A3432E'; return; }

  try {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'PUT', headers: authHeaders(),
      body: JSON.stringify({ name, region, block})
    });
    const data = await res.json();
    if (!res.ok) { msg.textContent = hiMsg(data.message); msg.style.color = '#A3432E'; return; }

    const user = getUser();
    user.name = name;
    saveSession(getToken(), user);
    document.getElementById('user-name-display').textContent = name;

    msg.textContent = 'सफलतापूर्वक सहेजा गया';
    msg.style.color = '#35502E';
  } catch (err) {
    msg.textContent = 'बैकएंड से जुड़ नहीं पाया';
    msg.style.color = '#A3432E';
  }
}

async function savePassword() {
  const currentPassword = document.getElementById('current-password').value;
  const newPassword = document.getElementById('new-password').value;
  const msg = document.getElementById('password-msg');

  if (!currentPassword || !newPassword) { msg.textContent = 'दोनों फील्ड ज़रूरी हैं'; msg.style.color = '#A3432E'; return; }

  try {
    const res = await fetch(`${API_BASE}/profile/password`, {
      method: 'PUT', headers: authHeaders(),
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const data = await res.json();
    if (!res.ok) { msg.textContent = hiMsg(data.message); msg.style.color = '#A3432E'; return; }

    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    msg.textContent = 'पासवर्ड सफलतापूर्वक बदला गया';
    msg.style.color = '#35502E';
  } catch (err) {
    msg.textContent = 'बैकएंड से जुड़ नहीं पाया';
    msg.style.color = '#A3432E';
  }
}