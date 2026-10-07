// Optional browser check: npm install --no-save playwright, then node tests/footer-browser.cjs.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.BROWSER_PATH || '/usr/bin/brave',headless:true,chromiumSandbox:true,args:['--disable-extensions']});
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const base=process.env.TEST_URL || 'http://127.0.0.1:8794';
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 let postCount=0;
 await page.route('**/api/community/stats',route=>{
  if(route.request().method()==='POST')postCount++;
  return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({views:114,members:1,discussions:5,reviews:0})});
 });
 try {
  await page.goto(base,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.querySelector('[data-stat="views"]').textContent==='114');
  const actual=await page.evaluate(()=>({films:films.length,display:document.querySelector('[data-stat="films"]').textContent}));
  assert.equal(actual.display,String(actual.films));assert(actual.films>0);
  assert.equal(await page.locator('[data-stat="reviews"]').innerText(),'0');
  assert.equal(postCount,1);
  for(const width of [1440,768,390]){
   await page.setViewportSize({width,height:1000});
   await page.locator('.genre-footer').scrollIntoViewIfNeeded();
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Horizontal overflow at '+width);
   assert.equal(await page.locator('.genre-footer a[href="mailto:info@neoncoffinvideo.site"]').count(),1);
   assert.equal(await page.locator('.genre-footer a[href*="paypalme/elementxdesign"]').count(),1);
   if(process.env.ARTIFACT_DIR){await fs.mkdir(process.env.ARTIFACT_DIR,{recursive:true});await page.locator('.genre-footer').screenshot({path:`${process.env.ARTIFACT_DIR}/footer-${width}.png`});}
  }
  await page.locator('#creditsButton').click();assert(await page.locator('#detailDialog').isVisible());
  await page.keyboard.press('Escape');
  await page.evaluate(()=>openFilm('the-burning'));
  await page.waitForFunction(()=>document.querySelector('[data-art-credit] a')?.href.includes('ourculturemag.com'));
  await page.keyboard.press('Escape');
  await page.goto(base+'/community.html',{waitUntil:'networkidle'});
  assert.equal(await page.locator('.genre-footer').count(),1);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.locator('.genre-footer a[href="/#artwork-credits"]').click();
  await page.waitForSelector('#detailDialog[open]');
  assert.deepEqual(errors,[]);
  console.log('PASS: real page integration, catalogue count '+actual.films+', 1440/768/390 footer, donation/contact links, credits dialog, film image source, lounge footer, deep-linked credits; no page errors.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
