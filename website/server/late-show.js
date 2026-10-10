import {movieById,publishedIssues,currentIssue,screeningStart} from '../late-show-data.js';
const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
const reply=(data,status=200)=>Response.json(data,{status,headers});
const xml=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const encoder=new TextEncoder();
export function dispatchRSS(date=new Date()){
 const items=publishedIssues(date).slice().reverse().map(issue=>{const a=movieById(issue.feature),b=movieById(issue.pair);return `<item><title>${xml('Midnight Dispatch '+issue.id+' — '+issue.title)}</title><link>https://neoncoffinvideo.site/screening-room#issue/${issue.id}</link><guid isPermaLink="true">https://neoncoffinvideo.site/screening-room#issue/${issue.id}</guid><pubDate>${new Date(screeningStart(issue).getTime()-20*3600000).toUTCString()}</pubDate><description>${xml(issue.intro+' Featured rentals: '+a.title+' ('+a.year+') + '+b.title+' ('+b.year+'). Full films open on official services; availability varies by region.')}</description></item>`}).join('');
 return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Neon Coffin Video — The Midnight Dispatch</title><link>https://neoncoffinvideo.site/screening-room</link><description>Friday night features, cult rental picks, and Midnight Lounge conversation starters.</description><language>en-us</language><atom:link href="https://neoncoffinvideo.site/api/late-show/rss" rel="self" type="application/rss+xml"/>${items}</channel></rss>`;
}
export function issueCalendar(issue){
 const start=screeningStart(issue),a=movieById(issue.feature),b=movieById(issue.pair),end=new Date(start.getTime()+(a.minutes+b.minutes+20)*60000);
 const stamp=date=>date.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
 const esc=value=>String(value).replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Neon Coffin Video//The Late Show//EN','CALSCALE:GREGORIAN','BEGIN:VEVENT',`UID:late-show-${issue.id}-${issue.date}@neoncoffinvideo.site`,`DTSTAMP:${stamp(new Date(screeningStart(issue).getTime()-20*3600000))}`,`DTSTART:${stamp(start)}`,`DTEND:${stamp(end)}`,`SUMMARY:${esc('NCV Friday Night Frights: '+a.title+' + '+b.title)}`,`URL:https://neoncoffinvideo.site/screening-room#issue/${issue.id}`,`DESCRIPTION:${esc(issue.intro+'\nPersonal viewing suggestion at 8 PM Pacific. Watch individually on official services; availability varies by region. Includes a 20-minute break; advertisements may add time.\n'+a.title+': '+a.tubi+'\n'+b.title+': '+b.tubi+'\nDiscussion: https://neoncoffinvideo.site/community#screening/'+issue.id)}`,'END:VEVENT','END:VCALENDAR'];
 return lines.map(line=>{let folded='',length=0;for(const char of line){const bytes=encoder.encode(char).length;if(length+bytes>73){folded+='\r\n ';length=1}folded+=char;length+=bytes}return folded}).join('\r\n')+'\r\n';
}
export async function lateShow(request,env){
 const url=new URL(request.url),path=url.pathname;
 if(request.method!=='GET')return reply({error:'Method not allowed.'},405);
 if(path==='/api/late-show/rss')return new Response(dispatchRSS(),{headers:{'Content-Type':'application/rss+xml; charset=utf-8','Cache-Control':'public, max-age=300','X-Content-Type-Options':'nosniff'}});
 if(path==='/api/late-show/calendar'){const id=url.searchParams.get('issue')||currentIssue().id,issue=publishedIssues().find(issue=>issue.id===id);if(!issue)return reply({error:'This issue is not published.'},404);return new Response(issueCalendar(issue),{headers:{'Content-Type':'text/calendar; charset=utf-8','Content-Disposition':`attachment; filename="ncv-friday-${issue.date}.ics"`,'Cache-Control':'public, max-age=300'}})}
 if(path==='/api/late-show/newsletter'){
  const groupURL=typeof env.NEWSLETTER_GROUP_URL==='string'&&/^https:\/\/groups\.google\.com\/g\/[a-z0-9-]+$/.test(env.NEWSLETTER_GROUP_URL)?env.NEWSLETTER_GROUP_URL:null;
  return reply({mode:groupURL?'google-groups':'unavailable',groupURL});
 }
 return reply({error:'Not found.'},404);
}
