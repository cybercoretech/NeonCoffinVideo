const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/brave',headless:true,chromiumSandbox:true,args:['--disable-extensions']});
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 const page=await context.newPage(),errors=[],art=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.url().includes('halloween-scenes'))art.push(r.url());});
 const base=process.env.TEST_URL||'http://127.0.0.1:8794';
 const dir=process.env.ARTIFACT_DIR||'/tmp/ncv-theme-review';await fs.mkdir(dir,{recursive:true});
 try{
 await page.goto(base,{waitUntil:'networkidle'});
 assert.equal(await page.locator('html').getAttribute('data-cybercore-theme'),'original');assert.equal(art.length,0,'Original must not download theme artwork');
 await page.locator('.cybercore-theme-launch').click();await page.waitForLoadState('networkidle');
 assert.equal(await page.locator('.ctp-card').count(),8);await page.screenshot({path:dir+'/picker-desktop.png'});
 const ids=await page.locator('.ctp-card').evaluateAll(cards=>cards.map(c=>c.dataset.themeId));
 for(const id of ids){
  await page.locator(`[data-theme-id="${id}"]`).click();assert.equal(await page.locator('html').getAttribute('data-halloween-theme'),id);
  assert.equal(await page.locator('.ctp-card[aria-pressed=true]').count(),1);
  await page.keyboard.press('Escape');await page.evaluate(()=>scrollTo(0,0));
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert.equal(await page.locator('.halloween-scene image').count(),1);
  await page.screenshot({path:dir+'/'+id+'.png'});
  await page.locator('.cybercore-theme-launch').click();
 }
 await page.locator('#ctpMotion').uncheck();await page.keyboard.press('Escape');await page.reload({waitUntil:'networkidle'});
 assert.equal(await page.locator('html').getAttribute('data-halloween-theme'),'hell-fest');assert.equal(await page.locator('html').getAttribute('data-theme-motion'),'off');
 await page.goto(base+'/community.html',{waitUntil:'networkidle'});assert.equal(await page.locator('html').getAttribute('data-halloween-theme'),'hell-fest');
 await page.screenshot({path:dir+'/lounge.png'});
 await page.goto(base+'/?theme=sleepy-hollow&test=preserved#home',{waitUntil:'networkidle'});
 assert.equal(await page.locator('html').getAttribute('data-halloween-theme'),'sleepy-hollow');
 for(const width of [768,390]){
 await page.setViewportSize({width,height:900});await page.locator('.cybercore-theme-launch').click();
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 assert(await page.locator('#cybercoreThemePanel').evaluate(el=>el.scrollWidth<=el.clientWidth));
 await page.screenshot({path:dir+'/picker-'+width+'.png'});await page.keyboard.press('Escape');
 }
 await page.emulateMedia({reducedMotion:'reduce'});await page.locator('.cybercore-theme-launch').click();assert(await page.locator('#ctpMotion').isDisabled());
 await page.locator('.ctp-reset').click();assert.equal(await page.locator('html').getAttribute('data-halloween-theme'),null);assert(page.url().includes('test=preserved'));assert(!new URL(page.url()).searchParams.has('theme'));
 await page.keyboard.press('Escape');assert(await page.locator('.cybercore-theme-launch').evaluate(el=>el===document.activeElement));
 await page.goto(base+'/?theme=invalid',{waitUntil:'networkidle'});assert.equal(await page.locator('html').getAttribute('data-cybercore-theme'),'original');
 assert.deepEqual(errors,[]);console.log('PASS: eight themes, lazy artwork, desktop/tablet/mobile, saved selection, lounge, shared URL, reset, effects preference, reduced motion, Escape/focus, no overflow or JS errors.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
