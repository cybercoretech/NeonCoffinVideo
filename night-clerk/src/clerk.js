export const identity = Object.freeze({handle:'NightManager',displayName:'The Night Manager',role:'BOT / HOUSE HOST'});
export const genres = Object.freeze({slashers:'Slashers',creatures:'Creature features',body:'Body horror',supernatural:'Supernatural',scifi:'Sci-fi horror',chaos:'Splatter & horror comedy',corman:'Corman shelf'});
export const prompts = [
  'Which horror sequel actually improves on the original?',
  'What movie scared you as a kid and still works now?',
  'Build the perfect midnight double feature. What are you pairing?',
  'Which practical effect deserves a standing ovation?',
  'What is your favorite horror movie with a terrible reputation?',
  'Which forgotten rental-store discovery deserves another chance?',
  'Choose one creature effect from the 1980s. Why does it still hold up?',
  'What is the best opening scene in a 1990s horror movie?',
  'Which horror soundtrack belongs on the turntable tonight?',
  'Would you rather survive a haunted house or an alien invasion?',
  'Which remake earns a spot beside the original on your shelf?',
  'What is your favorite low-budget horror idea that absolutely works?',
  'Pick a horror-comedy for someone who thinks they hate horror.',
  'Which horror villain needs less backstory and more mystery?',
  'What movie has the best rainy-night atmosphere?',
  'Which regional horror oddity should every tape collector see?',
  'What is the best monster reveal that keeps its promise?',
  'What horror movie would you rescue from a closing video store?',
  'What makes an effective slow-burn horror movie?',
  'Which 1980s or 1990s horror director deserves a deeper dive?',
  'Pick an underrated horror performance. What makes it memorable?',
  'What is your go-to film for introducing friends to cult horror?',
  'Which sci-fi horror movie makes technology feel most dangerous?',
  'What horror poster made you rent a movie without knowing the plot?',
  'Which film has the strongest final act without spoiling it?',
  'Design a three-film marathon around one practical-effects theme.',
  'Which horror movie has your favorite small-town setting?',
  'What is the strangest film that still feels like a comfort watch?',
  'Which horror film gets better when watched with a crowd?',
  'What belongs in the perfect midnight snack-and-movie pairing?',
  'Which overlooked 1990s horror film belongs back on the counter?'
];
export function localClock(time=Date.now(),zone='America/Los_Angeles') {
  const parts=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',hourCycle:'h23'}).formatToParts(time).map(p=>[p.type,p.value]));
  return {date:`${parts.year}-${parts.month}-${parts.day}`,hour:Number(parts.hour)};
}
export function promptFor(date) {
  const day=Math.floor(Date.parse(date+'T00:00:00Z')/86400000);
  return prompts[((day%prompts.length)+prompts.length)%prompts.length];
}
export function normalizeCatalog(rows) {
  if(!Array.isArray(rows)||rows.length>3000)throw new Error('Invalid catalog');
  const seen=new Set();
  return rows.filter(m=>m&&/^[a-z0-9-]{1,100}$/.test(m.id)&&typeof m.title==='string'&&m.title.length<=150&&Number.isInteger(m.year)&&m.year>=1900&&m.year<=2100&&!seen.has(m.id)&&seen.add(m.id)).map(m=>({id:m.id,title:m.title,year:m.year,category:typeof m.category==='string'?m.category:'',note:typeof m.note==='string'?m.note.slice(0,900):'',director:typeof m.director==='string'?m.director.slice(0,120):''}));
}
const normalize=s=>s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
const hash=s=>[...s].reduce((n,c)=>(Math.imul(n,31)+c.charCodeAt(0))>>>0,0);
const card=(m,origin)=>({...m,genre:genres[m.category]||'Cult horror',url:origin+'/#film/'+m.id});
const help={
  town:['The Night Manager’s back-room invitation','The store is here in Old Orchard Beach, Maine. I grew up near Boston; the Massachusetts accent stuck. Looking for something you cannot find on the rental shelves? The Viewing Room is out back. Green sofa, old television. Take your time choosing a tape. I’ll keep the light on.','/viewing-room'],
  profiles:['Your Night Shift identity','Open My membership to edit your handle, display name, bio, avatar, banner, and privacy settings. Avatar and banner source files can be up to 5 MB each.','/community#profile'],
  shelves:['Your personal rental shelf','Save films with My shelf on the main site. In your membership, open My movie shelf to import browser-saved tapes into your account.','/community#profile'],
  reviews:['Leave a skull rating','Sign in, open your membership, and choose My reviews. Pick a film, rate it from one to five skulls, and mark spoilers before publishing.','/community#profile'],
  rules:['Keep the lounge cool','Swearing is welcome. Harassment, hate, threats, spam, and targeting other members are not. Mark spoilers. The Lounge is for adults 18 and older. Open House rules for the full reminder.','/community#rules'],
  support:['Find the right counter','General: info@neoncoffinvideo.site\nHelp and issues: help@neoncoffinvideo.site\nLounge questions: neondemon_74@neoncoffinvideo.site','mailto:help@neoncoffinvideo.site']
};
export function commandReply(input,catalog,{origin='https://neoncoffinvideo.site',date=localClock().date}={}) {
  if(typeof input!=='string'||!input.trim()||input.length>200)throw Object.assign(new Error('Enter a command up to 200 characters.'),{status:400});
  const [name,...args]=input.trim().replace(/^\//,'').split(/\s+/),query=args.join(' '),command=name.toLowerCase();
  let result;
  if(command==='help') {
    const entry=help[query.toLowerCase()];
    result=entry?{title:entry[0],text:entry[1],links:[{label:query.toLowerCase()==='town'?'Step into The Viewing Room':'Open the counter',url:entry[2].startsWith('/')?origin+entry[2]:entry[2]}]}:{title:'Ask the Night Manager',text:'Try /town for the back room, /recommend 1980s creatures, /recommend 1990s supernatural, /find Near Dark, /double-feature body, /prompt, or /help profiles. Help topics: town, profiles, shelves, reviews, rules, support. Ask a normal question for AI conversation, or use these catalog commands for direct results.',commands:['/town','/recommend 1980s creatures','/find Near Dark','/double-feature body','/prompt','/help support']};
  } else if(command==='town') {
    const entry=help.town;
    result={title:entry[0],text:entry[1],links:[{label:'Step into The Viewing Room',url:origin+entry[2]}]};
  } else if(command==='prompt') {
    result={title:'Tonight’s question',text:promptFor(date)+'\n\nTell us your take in Movie talk. Mark spoilers before the reveal.',links:[{label:'Open Movie talk',url:origin+'/community#room/movie-talk'}]};
  } else if(command==='find') {
    if(query.length<2)throw Object.assign(new Error('Add a movie title, for example /find Near Dark.'),{status:400});
    const needle=normalize(query);const matches=catalog.filter(m=>normalize(m.title).includes(needle)||normalize(m.id).includes(needle)).sort((a,b)=>(normalize(a.title)===needle?-1:0)-(normalize(b.title)===needle?-1:0)).slice(0,5);
    result={title:matches.length?'Found on the rental shelf':'No matching tape',text:matches.length?'Here are the matching films from our catalog.':'That title is not on our curated shelf. Try another title or ask the host to add it.',movies:matches.map(m=>card(m,origin))};
  } else if(command==='recommend'||command==='double-feature') {
    const decadeMatch=query.match(/\b(19\d0|20\d0)s?\b/),decade=decadeMatch?Number(decadeMatch[1]):null;
    const aliases={slasher:'slashers',slashers:'slashers',creature:'creatures',creatures:'creatures',monster:'creatures',monsters:'creatures',body:'body',supernatural:'supernatural',ghost:'supernatural',ghosts:'supernatural',scifi:'scifi','sci-fi':'scifi',space:'scifi',chaos:'chaos',comedy:'chaos',splatter:'chaos',corman:'corman'};
    const tokens=query.toLowerCase().replace(/sci fi/g,'scifi').split(/\s+/),category=tokens.map(t=>aliases[t]).find(Boolean);
    const unknown=tokens.filter(t=>t&&!aliases[t]&&!/^(19\d0|20\d0)s?$/.test(t));
    if(unknown.length)throw Object.assign(new Error('Use a decade and shelf: slashers, creatures, body, supernatural, scifi, chaos, or corman.'),{status:400});
    const candidates=catalog.filter(m=>(!decade||m.year>=decade&&m.year<decade+10)&&(!category||m.category===category)&&((decade||category)||m.year>=1980&&m.year<2000));
    const selected=candidates.sort((a,b)=>hash(date+input+a.id)-hash(date+input+b.id)).slice(0,command==='double-feature'?2:3);
    result={title:command==='double-feature'?'Tonight’s double feature':'Pulled from the shelf',text:selected.length?(command==='double-feature'?(selected.length===2?`Two tapes from ${category?genres[category]:'the cult shelves'}${decade?' in the '+decade+'s':''}. Start with the first and keep the lights low.`:'Only one tape matches that combination. Widen the decade or shelf for a pair.'):'A few spoiler-light picks from the requested shelf.'): 'That combination has no tapes yet. Try a different decade or shelf.',movies:selected.map(m=>card(m,origin))};
  } else throw Object.assign(new Error('Unknown command. Try /town, /help, /find, /recommend, /double-feature, or /prompt.'),{status:400});
  return {bot:identity,command,date,...result};
}
