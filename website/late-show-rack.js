// Shared by the browser and build: posters and original editorial notes are in
// initial HTML. A search result is never described as verified streaming access.
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const posterURL=movie=>movie.poster||'/assets/late-show/rental-label.svg';
export const rackCategories=[
 {id:'all',label:'ALL TAPES',icon:'📼'},
 {id:'slashers',label:'SLASHER NIGHT',icon:'🔪'},
 {id:'supernatural',label:'FORBIDDEN DOORS',icon:'👻'},
 {id:'scifi',label:'DEAD SPACE',icon:'🛸'},
 {id:'creatures',label:'MONSTER SHELF',icon:'🦇'},
 {id:'body',label:'THE NEW FLESH',icon:'🧪'},
 {id:'psychological',label:'MIND GAMES',icon:'👁'},
 {id:'anthology',label:'TALES OF TERROR',icon:'📚'},
 {id:'chaos',label:'HORROR & CAMP',icon:'⚡'},
 {id:'corman',label:'DRIVE-IN MONSTERS',icon:'🎬'}
];
export function filterRentals(movies,{category='all',query='',decade='all',sort='title'}={}){
 const normalize=s=>String(s).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
 const words=normalize(query).split(/\s+/).filter(Boolean);
 const list=movies.filter(m=>(category==='all'||m.aisle===category)&&(decade==='all'||Math.floor(m.year/10)*10===Number(decade))&&words.every(w=>normalize([m.title,m.director,m.year].join(' ')).includes(w)));
 return list.sort((a,b)=>sort==='oldest'?a.year-b.year||a.title.localeCompare(b.title):sort==='newest'?b.year-a.year||a.title.localeCompare(b.title):a.title.localeCompare(b.title));
}
export function rentalFiltersHTML(movies){return rackCategories.map(c=>`<button type="button" data-ls-filter="${c.id}" aria-pressed="${c.id==='all'}"><span aria-hidden="true">${c.icon}</span> ${c.label} <b>${c.id==='all'?movies.length:movies.filter(m=>m.aisle===c.id).length}</b></button>`).join('')}
export function rentalRackHTML(movies,saved=new Set()){
 return movies.map(movie=>`<article class="ls-rental-card" data-rental-id="${escape(movie.id)}"><button class="ls-rental-art" type="button" data-ls-tape="${escape(movie.id)}" aria-label="Open ${escape(movie.title)} (${movie.year}) tape file"><img src="${escape(posterURL(movie))}" width="600" height="900" alt="${escape(movie.title)} (${movie.year}) film poster" loading="lazy" decoding="async"></button><div class="ls-rental-copy"><h3>${escape(movie.title)}</h3><p class="ls-mono">${movie.year} / ${escape(rackCategories.find(c=>c.id===movie.aisle)?.label||'RENTAL PICK')}</p><p class="ls-fine">DIRECTED BY ${escape(movie.director)}</p><p class="ls-rental-note">${escape(movie.note)}</p><div class="ls-actions"><button type="button" class="ls-button" data-ls-tape="${escape(movie.id)}">TAPE FILE ↗</button><button type="button" class="ls-button" data-ls-save="${escape(movie.id)}" aria-pressed="${saved.has(movie.id)}">${saved.has(movie.id)?'ON MY SHELF ✓':'SAVE TAPE +'}</button></div><p class="ls-fine ls-poster-credit">Film artwork © respective rights holders. <a href="${escape(movie.posterSource)}" target="_blank" rel="noopener noreferrer">Poster source ↗</a></p></div></article>`).join('');
}
