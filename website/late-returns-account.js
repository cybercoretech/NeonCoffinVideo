// Late Returns header: the same membership state as the Midnight Lounge header.
(()=>{
 const link=document.getElementById('lrMembership'),logout=document.getElementById('lrLogout');
 if(!link||!logout)return;
 async function api(path,body){const response=await fetch('/api/'+path,{method:body?'POST':'GET',credentials:'same-origin',cache:'no-store',headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined});if(!response.ok)throw new Error('The membership counter is unavailable.');return response.json()}
 function show(member){if(member){link.replaceChildren(Object.assign(document.createElement('span'),{className:'lr-member-prefix',textContent:'Membership · '}),'@'+member.handle)}else link.textContent='My membership';link.setAttribute('aria-label',member?'Open membership for @'+member.handle:'Open membership');logout.hidden=!member}
 async function refresh(){try{show((await api('community/me')).member)}catch{show(null)}}
 logout.addEventListener('click',async()=>{logout.disabled=true;try{await api('auth/logout',{})}catch{}logout.disabled=false;await refresh()});
 refresh();
})();
