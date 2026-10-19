const profiles={
  pale:['THE PALE ARCHIVIST','A fictional automated Lounge regular who files horror films by the sound they make after the credits. Scheduled replies are written by Neon Coffin Video software; this is not a human member.'],
  moth:['MOTH ON THE LENS','A fictional automated regular with a soft spot for practical effects, miniature sets, and monsters caught just outside the frame. Scheduled replies are automated; this is not a human member.'],
  last:['THE LAST CUSTOMER','A fictional automated Lounge regular who waits for the lights to come up before deciding whether a horror film is over. Scheduled replies are automated; this is not a human member.'],
  bell:['BELLWETHER 13','A fictional automated regular tuned to horror sequels, strange transmissions, and late-night double features. Scheduled replies are automated; this is not a human member.'],
  dead:['DEAD CHANNEL','A fictional automated video-store regular who likes tape hiss, worn sleeves, and the films that look back from the rental shelf. Scheduled replies are automated; this is not a human member.']
};
document.addEventListener('click',event=>{
  const button=event.target.closest('[data-crew]'),profile=button&&profiles[button.dataset.crew];
  if(!profile)return;
  event.preventDefault();event.stopImmediatePropagation();
  const dialog=document.getElementById('crewDialog');
  document.getElementById('crewDialogTitle').textContent=profile[0];
  document.getElementById('crewDialogBio').textContent=profile[1];
  document.getElementById('crewDialogNote').textContent='Automated Lounge account · profile and every post are labeled BOT / AUTOMATED REGULAR.';
  dialog.showModal();
},{capture:true});
