const aftercutDirectorFiles = [
  {
    no: '01', id: 'cronenberg-family', label: 'BODY HORROR / THE CRONENBERGS',
    title: 'CRONENBERG<br><i>FAMILY BUSINESS</i>',
    teaser: 'David rewired the flesh. Brandon keeps finding new ports.',
    bio: 'David Cronenberg made body horror feel clinical, intimate, and impossible to shake. His son Brandon carries that unease into a colder, contemporary world of identity, technology, and bodies treated as tools.',
    films: ['The Fly', 'Possessor'], search: 'David Cronenberg Brandon Cronenberg'
  },
  {
    no: '02', id: 'osgood-perkins', label: 'GRIM FAIRY TALES / FAMILY BUSINESS',
    title: 'OSGOOD<br><i>PERKINS</i>',
    teaser: 'Folklore, dread, and the slow click of a lock.',
    bio: 'Osgood Perkins favors quiet spaces, fractured memory, and dread that gathers at the edge of the frame. The result feels less like a jump scare than a strange story you cannot stop turning over.',
    films: ['The Blackcoat’s Daughter', 'Longlegs'], search: 'Osgood Perkins'
  },
  {
    no: '03', id: 'damien-leone', label: 'PRACTICAL CARNAGE / MILES COUNTY',
    title: 'DAMIEN<br><i>LEONE</i>',
    teaser: 'Old-school splatter, new-school stamina.',
    bio: 'Damien Leone built the Terrifier films around handmade effects and the wordless menace of Art the Clown. His DIY creature work grew into one of modern horror’s most recognizable independent franchises.',
    films: ['Terrifier', 'Terrifier 2', 'Terrifier 3'], search: 'Damien Leone Terrifier'
  },
  {
    no: '04', id: 'ti-west', label: 'THE NEW WAVE / X TRILOGY',
    title: 'TI WEST<br><i>IN X / PEARL</i>',
    teaser: 'Hollywood polish with a blade behind its back.',
    bio: 'Ti West moves between patient, period-set unease and sharp genre play. His X trilogy turns the making of movies, stardom, and ambition into three linked slasher-era portraits.',
    films: ['The House of the Devil', 'X', 'Pearl', 'MaXXXine'], search: 'Ti West X Pearl MaXXXine'
  },
  {
    no: '05', id: 'takashi-miike', label: 'EXTREME JAPAN / NO EASY EXITS',
    title: 'TAKASHI<br><i>MIIKE</i>',
    teaser: 'Two films that still dare you to keep watching.',
    bio: 'Takashi Miike is a prolific Japanese filmmaker who can jump from psychological horror to yakuza chaos and samurai spectacle. This expanded file starts with the unnerving Audition, Ichi the Killer, Gozu, One Missed Call, Imprint, and Yakuza Apocalypse, then follows his range into acclaimed action and crime films.',
    films: ['Audition', 'Ichi the Killer', 'One Missed Call', 'Gozu', 'Imprint', 'Yakuza Apocalypse', '13 Assassins', 'Hara-Kiri: Death of a Samurai', 'First Love', 'Visitor Q', 'The Happiness of the Katakuris', 'Dead or Alive', 'As the Gods Will', 'Blade of the Immortal'], search: 'Takashi Miike'
  },
  {
    no: '06', id: 'eli-roth', label: 'TORTURE / GRINDHOUSE',
    title: 'ELI<br><i>ROTH</i>',
    teaser: 'The cabin, the hostel, and the holiday parade.',
    bio: 'Eli Roth helped push early-2000s horror toward a raw, confrontational style with Cabin Fever and Hostel. He keeps returning to crowd-pleasing genre setups, including the holiday slasher Thanksgiving.',
    films: ['Cabin Fever', 'Hostel', 'Thanksgiving'], search: 'Eli Roth horror'
  },
  {
    no: '07', id: 'quentin-tarantino', label: 'GRINDHOUSE / GENRE-ADJACENT',
    title: 'QUENTIN<br><i>TARANTINO</i>',
    teaser: 'Video-store DNA. Grindhouse blood on the lens.',
    bio: 'Tarantino is a crime and exploitation filmmaker rather than a horror specialist, but his grindhouse roots belong in this conversation. Death Proof is his own slasher-styled feature; he also wrote and starred in From Dusk Till Dawn, directed by Robert Rodriguez.',
    films: ['Death Proof', 'From Dusk Till Dawn'], search: 'Quentin Tarantino horror grindhouse'
  },
  {
    no: '08', id: 'jordan-peele', label: 'SOCIAL HORROR / THE NEW WAVE',
    title: 'JORDAN<br><i>PEELE</i>',
    teaser: 'The subtext is staring right back.',
    bio: 'Jordan Peele uses the language of suspense and horror to examine race, class, spectacle, and American identity. Get Out, Us, and Nope each turn a high-concept hook into a conversation that follows the scare.',
    films: ['Get Out', 'Nope'], search: 'Jordan Peele horror'
  },
  {
    no: '09', id: 'james-wan', label: 'FRANCHISE ARCHITECT / MODERN SCARES',
    title: 'JAMES<br><i>WAN</i>',
    teaser: 'A sound in the room. A new universe begins.',
    bio: 'James Wan helped launch the Saw franchise, then became a defining studio-horror director with The Conjuring and Insidious. He builds scares around spaces, sound, and a sudden shift in what the audience can see.',
    films: ['Saw', 'The Conjuring'], search: 'James Wan horror'
  },
  {
    no: '10', id: 'ari-aster', label: 'FAMILY HORROR / GRIEF IN BLOOM',
    title: 'ARI<br><i>ASTER</i>',
    teaser: 'A family gathering with no safe exit.',
    bio: 'Ari Aster stretches family trauma into meticulously staged horror. Hereditary and Midsommar pair intimate grief with ritual, control, and images that stay lodged in the mind.',
    films: ['Hereditary', 'Midsommar'], search: 'Ari Aster horror'
  },
  {
    no: '11', id: 'robert-eggers', label: 'FOLKLORE / PERIOD DREAD',
    title: 'ROBERT<br><i>EGGERS</i>',
    teaser: 'Old worlds. New ways to lose your mind.',
    bio: 'Robert Eggers builds period horror from folklore, belief, and carefully researched detail. The Witch and The Lighthouse make isolation feel like its own supernatural force.',
    films: ['The Witch', 'The Lighthouse'], search: 'Robert Eggers horror'
  },
  {
    no: '12', id: 'wes-craven', label: 'THE RULES / THE FINAL GIRL',
    title: 'WES<br><i>CRAVEN</i>',
    teaser: 'He changed the rules, then made us watch them break.',
    bio: 'Wes Craven shaped multiple eras of American horror, from A Nightmare on Elm Street to the self-aware Scream cycle. His films understand both the mechanics of a scare and the audience waiting for it.',
    films: ['Scream', 'Scream 2', 'A Nightmare on Elm Street'], search: 'Wes Craven horror'
  },
  {
    no: '13', id: 'mike-flanagan', label: 'HAUNTED HOUSES / HUMAN HEARTS',
    title: 'MIKE<br><i>FLANAGAN</i>',
    teaser: 'The ghost story remembers everyone.',
    bio: 'Mike Flanagan blends supernatural dread with stories about family, addiction, and loss. Hush turns a home invasion into a stripped-down thriller; Oculus and Doctor Sleep bring haunted objects and psychic legacies into focus.',
    films: ['Hush', 'Oculus', 'Doctor Sleep'], search: 'Mike Flanagan horror'
  },
  {
    no: '14', id: 'alexandre-aja', label: 'FRENCH EXTREMITY / SURVIVAL',
    title: 'ALEXANDRE<br><i>AJA</i>',
    teaser: 'No soft landing. No easy way out.',
    bio: 'Alexandre Aja became a leading voice in the New French Extremity wave with High Tension, then carried his unflinching survival-horror approach into The Hills Have Eyes remake.',
    films: ['High Tension', 'The Hills Have Eyes'], search: 'Alexandre Aja horror'
  },
  {
    no: '15', id: 'sam-raimi', label: 'DEADITES / CAMERA IN OVERDRIVE',
    title: 'SAM<br><i>RAIMI</i>',
    teaser: 'The camera is possessed too.',
    bio: 'Sam Raimi’s horror runs on kinetic camera work, elastic physical comedy, and practical effects that feel alive. The Evil Dead films set the template; Drag Me to Hell brings that gleeful cruelty into the modern era.',
    films: ['The Evil Dead', 'Evil Dead II', 'Drag Me to Hell'], search: 'Sam Raimi horror'
  },
  {
    no: '16', id: 'rob-zombie', label: 'GRINDHOUSE / BACKROAD NIGHTMARES',
    title: 'ROB<br><i>ZOMBIE</i>',
    teaser: 'The roadside attraction has a body count.',
    bio: 'Musician and filmmaker Rob Zombie channels drive-in exploitation, Southern Gothic grime, and grindhouse excess into a distinct horror world. House of 1000 Corpses and The Devil’s Rejects introduced the Firefly family.',
    films: ['House of 1000 Corpses', 'The Devil’s Rejects', '3 from Hell'], search: 'Rob Zombie horror'
  }
];

const directorRail = document.querySelector('#directorRail');
if (directorRail) {
  directorRail.innerHTML = aftercutDirectorFiles.map((director) => {
    const filmsForDirector = director.films.map((title) => {
      const film = films.find((item) => item.t === title);
      return film ? `<button class="director-film-link" type="button" data-title="${title.replaceAll('&', '&amp;').replaceAll('"', '&quot;')}"><span>${film.y}</span><b>${title}</b><i>OPEN FILE ↗</i></button>` : '';
    }).filter(Boolean).join('');
    const query = encodeURIComponent(director.search);
    return `<article class="director-card" data-director-card="${director.id}">
      <span class="director-card-label">${director.no} / ${director.label}</span>
      <h3>${director.title}</h3>
      <p>${director.teaser}</p>
      <button class="director-open" type="button" aria-expanded="false" aria-controls="director-file-${director.id}">OPEN DIRECTOR FILE <span>↗</span></button>
      <div class="director-file" id="director-file-${director.id}" hidden>
        <p>${director.bio}</p>
        <div class="director-film-list">${filmsForDirector}</div>
        <div class="director-research" aria-label="Search this director and their films">
          <a href="https://www.imdb.com/find/?q=${query}" target="_blank" rel="noreferrer">IMDb ↗</a>
          <a href="https://www.rottentomatoes.com/search?search=${query}" target="_blank" rel="noreferrer">ROTTEN TOMATOES ↗</a>
          <a href="https://bloody-disgusting.com/?s=${query}" target="_blank" rel="noreferrer">BLOODY DISGUSTING ↗</a>
          <a href="https://www.justwatch.com/us/search?q=${query}" target="_blank" rel="noreferrer">JUSTWATCH ↗</a>
        </div>
      </div>
    </article>`;
  }).join('');

  directorRail.addEventListener('click', (event) => {
    const toggle = event.target.closest('.director-open');
    if (!toggle) return;
    const card = toggle.closest('.director-card');
    const file = card.querySelector('.director-file');
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.innerHTML = open ? 'CLOSE DIRECTOR FILE <span>−</span>' : 'OPEN DIRECTOR FILE <span>↗</span>';
    file.hidden = !open;
    card.classList.toggle('is-open', open);
  });
}
