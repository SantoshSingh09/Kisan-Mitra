// ===================== DISEASE DETECTOR (backend demo mode) =====================

function handleFile(e){
  const file=e.target.files[0]; if(!file) return;
  const img=document.getElementById('preview-img');
  img.src=URL.createObjectURL(file); img.style.display='block';
  document.getElementById('disease-result').style.display='none';
}

async function runDiseaseCheck(){
  document.getElementById('disease-spinner').style.display='block';
  document.getElementById('disease-result').style.display='none';
  try{
    const res = await fetch(`${API_BASE}/disease/detect`, { method:'POST' });
    const data = await res.json();
    document.getElementById('disease-spinner').style.display='none';
    const r=document.getElementById('disease-result');
    r.style.display='block';
    r.innerHTML = `<b>${data.result.status}</b> (${data.result.confidence}% confidence)<br>${data.result.message}<br><br><span style="color:#8B5A2B;">${data.note}</span>`;
  }catch(err){
    document.getElementById('disease-spinner').style.display='none';
    document.getElementById('disease-result').style.display='block';
    document.getElementById('disease-result').innerHTML = 'Backend se connect nahi ho paya.';
  }
}
