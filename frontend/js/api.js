// ===================== SHARED CONFIG & AUTH STORAGE =====================
// Every page includes this file first. Because this is now a multi-page
// site (each click loads a new HTML page), we can't keep the login token
// in a plain JS variable — it would be lost on every page change.
// Instead we store it in the browser's localStorage, which survives
// page navigation and reloads.

const API_BASE = 'http://localhost:5000/api';

function saveSession(token, user){
  localStorage.setItem('km_token', token);
  localStorage.setItem('km_user', JSON.stringify(user));
}

function getToken(){
  return localStorage.getItem('km_token');
}

function getUser(){
  const raw = localStorage.getItem('km_user');
  return raw ? JSON.parse(raw) : null;
}

function clearSession(){
  localStorage.removeItem('km_token');
  localStorage.removeItem('km_user');
}

function authHeaders(){
  return { 'Content-Type':'application/json', 'Authorization': 'Bearer ' + getToken() };
}

// Call this at the top of every page that requires login.
// If there's no token, it sends the user back to the login page.
function requireAuth(){
  if(!getToken()){
    window.location.href = 'login.html';
    return false;
  }
  const user = getUser();
  const nameEl = document.getElementById('user-name-display');
  if(nameEl && user){ nameEl.textContent = user.name; }
  return true;
}

function doLogout(){
  clearSession();
  window.location.href = 'home.html';
}
