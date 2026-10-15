(()=>{
 // "Be returned": the only way out of Harrow Point is back to the store's Viewing Room.
 document.addEventListener('click',e=>{const a=e.target.closest('[data-hp-return]');if(!a)return;try{sessionStorage.setItem('ncv-returned',String(Date.now()))}catch{}},true);
})();
