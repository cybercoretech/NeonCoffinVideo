// Harrow Point landmark stories, shared by the homepage, the Lounge town board and Late Returns.
// Any button with data-town-story="<key>" opens that landmark's story. Edit the story text here only.
(()=>{
 const stories={
 "pier": {
  "kicker": "DOWN BY THE WATER",
  "title": "THE AMUSEMENT PIER",
  "paragraphs": [
   "The pier opened on Memorial Day, 1951: a carousel with a brass band organ, a Ferris wheel lit end to end, and the Starlight Ballroom out over the water. For twenty-eight summers it was where Harrow Point went after dark.",
   "It burned on Labor Day night, 1979. The fire started in the ballroom after closing and the wind off the water did the rest. By morning there was nothing left but black pilings standing in the surf. The carousel organ was never found in the wreckage.",
   "The Night Manager watched it burn from the beach. He keeps a home movie of opening day, transferred to VHS, behind the counter and rents it to anyone who asks. It always comes back early."
  ],
  "rumor": "On foggy nights after midnight, people on Shore Street hear a band-organ waltz coming off the water, from where the carousel used to be. Watch the opening-day tape all the way through and count the riders: there is one more at the end than at the start.",
  "quote": "No charge for that one. Just don’t rewind it while the music’s playing."
 },
 "widows-rise": {
  "kicker": "UP ON THE HILL",
  "title": "WIDOW’S RISE BURIAL GROUND",
  "paragraphs": [
   "The hill is named for the women who climbed it to watch for fishing boats that never came home. The oldest stones are slate, carved with winged skulls, their names worn soft by a few hundred winters of salt wind.",
   "The iron gate is locked at dusk. Somebody locks it every night, though nobody in town will tell you who the caretaker is.",
   "Along the north wall stands a row of stones that are already cut and dated, with no one buried under them yet."
  ],
  "rumor": "On nights when a boat is overdue, a lantern moves between the graves. Follow it and it leads you to the edge of the cliff, then goes out. Kids dare each other to climb the wall and read the north-row names. The ones who do never say whose names they saw.",
  "quote": "Bring the tape back by noon. And don’t read the north wall."
 },
 "low-tide": {
  "kicker": "THE OLD MORTUARY",
  "title": "LOW TIDE MORTUARY",
  "paragraphs": [
   "Low Tide Mortuary sits in an old sea captain’s house where the coast road bends away from the water. The same family has run it for four generations.",
   "The cellar has a sea door. At high tide the water comes in, so viewings follow the tide table posted in the front window. That’s how the place got its name: nothing goes downstairs except at low tide.",
   "The mortuary rents more tapes than anyone else in town. Families sit up with their dead overnight, the old way, and a movie helps the hours go. Their account has never once been late."
  ],
  "rumor": "Not every arrival comes in by the road. On the lowest tides, people swear they’ve heard the sea door open from the inside.",
  "quote": "Best customers I’ve got. Always kind. Always rewound."
 }
};
 const el=(tag,props={},...children)=>{const node=Object.assign(document.createElement(tag),props);node.append(...children);return node};
 function dialogFor(key){
  const id='townStory-'+key;let dialog=document.getElementById(id);if(dialog)return dialog;
  const story=stories[key];if(!story)return null;
  const close=el('button',{type:'button',className:'town-story-close',textContent:'×'});close.setAttribute('aria-label','Close story');
  const quote=el('blockquote',{className:'town-story-quote'},el('p',{textContent:story.quote}),el('cite',{textContent:'The Night Manager'}));
  dialog=el('dialog',{className:'town-story',id},el('article',{className:'town-story-shell'},close,
   el('p',{className:'town-story-kicker',textContent:'HARROW POINT LORE / '+story.kicker}),
   el('h2',{id:id+'-title',textContent:story.title}),
   ...story.paragraphs.map(text=>el('p',{textContent:text})),
   el('p',{className:'town-story-rumor'},el('b',{textContent:'LOCAL RUMOR'}),story.rumor),
   quote,
   el('p',{className:'town-story-fine',textContent:'Fiction. Harrow Point and its landmarks are Neon Coffin Video lore, not the history of any real place.'})));
  dialog.setAttribute('aria-labelledby',id+'-title');
  close.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
  document.body.append(dialog);return dialog;
 }
 document.addEventListener('click',event=>{const button=event.target.closest('[data-town-story]');if(!button)return;dialogFor(button.dataset.townStory)?.showModal()});
})();
