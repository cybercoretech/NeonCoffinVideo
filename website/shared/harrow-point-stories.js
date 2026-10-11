// Opens the Harrow Point landmark story dialogs on the Lounge town board and Late Returns.
(()=>{
 document.querySelectorAll('[data-town-story]').forEach(button=>button.addEventListener('click',()=>document.getElementById('townStory-'+button.dataset.townStory)?.showModal()));
 document.querySelectorAll('.town-story').forEach(dialog=>{dialog.querySelector('[data-town-close]').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()})});
})();
