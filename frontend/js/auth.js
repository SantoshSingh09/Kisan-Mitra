function showAuthError(msg) {
  const el = document.getElementById('auth-error');
  el.textContent = msg;
  el.style.display = 'block';
}

async function doLogin() {
  const el = document.getElementById('auth-error');
  el.style.display = 'none';
  const phone = document.getElementById('login-phone').value.trim();
  const password = document.getElementById('login-password').value;
  if (!phone || !password) { showAuthError('फ़ोन और पासवर्ड दोनों ज़रूरी हैं'); return; }

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password })
    });
    const data = await res.json();
    if (!res.ok) { showAuthError(hiMsg(data.message)); return; }
    saveSession(data.token, data.user);
    window.location.href = 'dashboard.html';
  } catch (err) {
    showAuthError('बैकएंड से जुड़ नहीं पाया। सर्वर चल रहा है या नहीं जांचें।');
  }
}

async function doSignup() {
  const el = document.getElementById('auth-error');
  el.style.display = 'none';
  const name = document.getElementById('signup-name').value.trim();
  const phone = document.getElementById('signup-phone').value.trim();
  const password = document.getElementById('signup-password').value;
  const region = document.getElementById('signup-district').value;
  const block = document.getElementById('signup-block').value;
  if (!name || !phone || !password) { showAuthError('सभी फील्ड भरना ज़रूरी है'); return; }
  if (!region) { showAuthError('कृपया अपना जिला चुनें'); return; }
  if (!block) { showAuthError('कृपया अपना ब्लॉक चुनें'); return; }

  try {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, password, region, block})
    });
    const data = await res.json();
    if (!res.ok) { showAuthError(hiMsg(data.message)); return; }
    document.getElementById('auth-status').textContent = 'साइन अप सफल! लॉगिन पेज पर भेजा जा रहा है...';
    setTimeout(() => { window.location.href = 'login.html'; }, 1200);
  } catch (err) {
    showAuthError('बैकएंड से जुड़ नहीं पाया। सर्वर चल रहा है या नहीं जांचें।');
  }
}