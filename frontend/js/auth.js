// ===================== LOGIN / SIGNUP LOGIC =====================
// Used by login.html and register.html

function showAuthError(msg){
  const el = document.getElementById('auth-error');
  el.textContent = msg;
  el.style.display = 'block';
}

async function doLogin(){
  const el = document.getElementById('auth-error');
  el.style.display = 'none';
  const phone = document.getElementById('login-phone').value.trim();
  const password = document.getElementById('login-password').value;
  if(!phone || !password){ showAuthError('Phone aur password dono chahiye'); return; }

  try{
    const res = await fetch(`${API_BASE}/auth/login`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({phone, password})
    });
    const data = await res.json();
    if(!res.ok){ showAuthError(data.message || 'Login failed'); return; }
    saveSession(data.token, data.user);
    window.location.href = 'dashboard.html';
  }catch(err){
    showAuthError('Backend se connect nahi ho paya. Check karein ki server chal raha hai.');
  }
}

async function doSignup(){
  const el = document.getElementById('auth-error');
  el.style.display = 'none';
  const name = document.getElementById('signup-name').value.trim();
  const phone = document.getElementById('signup-phone').value.trim();
  const password = document.getElementById('signup-password').value;
  const region = document.getElementById('signup-region').value.trim();
  if(!name || !phone || !password){ showAuthError('Sab fields bharna zaroori hai'); return; }

  try{
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({name, phone, password, region})
    });
    const data = await res.json();
    if(!res.ok){ showAuthError(data.message || 'Signup failed'); return; }
    document.getElementById('auth-status').textContent = 'Signup ho gaya! Login page pe bhej rahe hain...';
    setTimeout(()=>{ window.location.href = 'login.html'; }, 1200);
  }catch(err){
    showAuthError('Backend se connect nahi ho paya. Check karein ki server chal raha hai.');
  }
}
