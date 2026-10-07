const {spawnSync}=require('node:child_process');
const result=spawnSync(process.execPath,[require('node:path').join(__dirname,'themes-browser.mjs')],{stdio:'inherit',env:{...process.env,NCV_CHECK_ORIGIN:process.env.NCV_CHECK_ORIGIN||process.env.TEST_URL||'http://127.0.0.1:8796'}});
process.exit(result.status??1);
