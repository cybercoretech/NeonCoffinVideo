(()=>{
  try{
    const path=location.pathname.replace(/\/{2,}/g,'/').slice(0,180)||'/';
    let source='direct';
    const ref=document.referrer;
    if(ref){try{const h=new URL(ref).hostname.toLowerCase();source=/google\./.test(h)?'google':/youtube\.com$|youtu\.be$/.test(h)?'youtube':/facebook\.com$|instagram\.com$/.test(h)?'meta':/tiktok\.com$/.test(h)?'tiktok':/reddit\.com$/.test(h)?'reddit':'other'}catch{source='other'}}
    const utm=(new URLSearchParams(location.search).get('utm_source')||'').toLowerCase();
    if(['youtube','google','facebook','instagram','tiktok','reddit','newsletter'].includes(utm))source=utm;
    const send=(url,data)=>fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),keepalive:true,credentials:'same-origin'}).catch(()=>{});
    send('/api/community/page-view',{path,source});
    let token;
    try{token=sessionStorage.getItem('ncv-site-presence');if(!/^[a-f0-9]{64}$/.test(token||'')){const bytes=crypto.getRandomValues(new Uint8Array(32));token=[...bytes].map(v=>v.toString(16).padStart(2,'0')).join('');sessionStorage.setItem('ncv-site-presence',token)}}catch{token=[...crypto.getRandomValues(new Uint8Array(32))].map(v=>v.toString(16).padStart(2,'0')).join('')}
    const beat=()=>{if(document.visibilityState==='visible')send('/api/community/site-presence',{token,path})};
    beat();
    setInterval(beat,30000);
    document.addEventListener('visibilitychange',beat);
  }catch{}
})();
