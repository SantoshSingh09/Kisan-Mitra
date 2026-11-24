// ===================== DISEASE DETECTOR (real AI analysis) =====================

let selectedImage = null; // { dataUrl, mimeType }

function esc(s){
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// Shrink the photo in the browser: faster upload on slow village networks,
// and keeps us well under the server's size limit.
function resizeImage(file, maxSide = 1024){
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve({ dataUrl: canvas.toDataURL('image/jpeg', 0.85), mimeType: 'image/jpeg' });
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('bad image')); };
    img.src = url;
  });
}

async function handleFile(e){
  const file = e.target.files[0]; if(!file) return;
  const box = document.getElementById('disease-result');
  box.style.display = 'none';
  try{
    selectedImage = await resizeImage(file);
    const img = document.getElementById('preview-img');
    img.src = selectedImage.dataUrl; img.style.display = 'block';
  }catch(err){
    selectedImage = null;
    box.style.display = 'block';
    box.textContent = 'यह फोटो खुल नहीं सकी। कृपया दूसरी फोटो चुनें।';
  }
}

function list(title, items){
  if(!items || !items.length) return '';
  return `<div style="margin-top:12px;"><b>${title}</b><ul style="margin:6px 0 0 18px;">${items.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>`;
}

function renderResult(data){
  const r = data.result;
  let head;
  if(r.status === 'healthy') head = `✅ <b>पौधा स्वस्थ दिख रहा है</b>`;
  else if(r.status === 'diseased') head = `⚠️ <b>${esc(r.disease || 'रोग के लक्षण')}</b>`;
  else head = `❓ <b>साफ़ पहचान नहीं हो पाई</b>`;

  const crop = r.crop ? `<div>फसल: ${esc(r.crop)}</div>` : '';
  const conf = r.status !== 'unclear' ? `<div>भरोसा: ${r.confidence}%</div>` : '';
  return `${head}${crop}${conf}
    <p style="margin:10px 0 0;">${esc(r.summary)}</p>
    ${list('लक्षण', r.symptoms)}
    ${list('इलाज', r.treatment)}
    ${list('बचाव', r.prevention)}
    ${r.alsoPossible && r.alsoPossible.length ? `<p style="margin-top:12px;color:#666;font-size:13px;">दूसरी संभावनाएं: ${r.alsoPossible.map(esc).join(', ')}</p>` : ''}
    <p style="margin-top:14px;color:#8B5A2B;font-size:13px;">${esc(data.disclaimer || '')}</p>`;
}

async function runDiseaseCheck(){
  const spinner = document.getElementById('disease-spinner');
  const box = document.getElementById('disease-result');
  if(!selectedImage){
    box.style.display = 'block';
    box.textContent = 'पहले पत्ते की फोटो चुनें।';
    return;
  }
  spinner.style.display = 'block';
  spinner.textContent = 'फोटो की जांच हो रही है... इसमें 30-60 सेकंड लग सकते हैं, कृपया रुकें।';
  box.style.display = 'none';
  try{
    const res = await fetch(`${API_BASE}/disease/detect`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ image: selectedImage.dataUrl, mimeType: selectedImage.mimeType })
    });
    if(res.status === 401 || res.status === 403){ clearSession(); window.location.href = 'login.html'; return; }
    const data = await res.json();
    spinner.style.display = 'none';
    box.style.display = 'block';
    box.innerHTML = res.ok ? renderResult(data) : esc(hiMsg(data.message));
  }catch(err){
    spinner.style.display = 'none';
    box.style.display = 'block';
    box.textContent = 'सर्वर से कनेक्ट नहीं हो पाया।';
  }
}
