import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium, firefox, webkit } from '@playwright/test';

const port = 4173;
const origin = `http://127.0.0.1:${port}`;
const pages = ['index.html','laboratorio-beyblade.html','ingles.html','memorias.html','alice.html'];
const campusPages = ['index.html','laboratorio-beyblade.html','ingles.html','memorias.html'];
const viewports = [{ width: 360, height: 800 }, { width: 1366, height: 768 }];
const browserTypes = { chromium, firefox, webkit };
const selected = (process.env.SMOKE_BROWSERS || 'chromium').split(',').map((v) => v.trim()).filter(Boolean);
const debtConfig = JSON.parse(await readFile(resolve(process.cwd(), 'config/audit-debt.json'), 'utf8'));
const knownDebt = new Set((debtConfig.items ?? []).map((item) => '/' + item.path.replace(/^\/+/, '')));

const viteBin = fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url));
const server = spawn(process.execPath, [viteBin,'preview','--host','127.0.0.1','--port',String(port),'--strictPort'], {
  stdio: ['ignore','pipe','pipe']
});
let serverOutput='';
server.stdout.on('data',(chunk)=>{serverOutput+=chunk.toString();});
server.stderr.on('data',(chunk)=>{serverOutput+=chunk.toString();});

async function waitForServer(){
  const deadline=Date.now()+20000;
  while(Date.now()<deadline){
    try{ const r=await fetch(origin+'/index.html'); if(r.ok)return; }catch{}
    await new Promise((resolve)=>setTimeout(resolve,200));
  }
  throw new Error('Preview não iniciou. Saída:\n'+serverOutput);
}

const failures=[];
const isKnownDebtUrl=(raw)=>{
  try{return knownDebt.has(new URL(raw,origin).pathname);}catch{return false;}
};

const protectedSelector=[
  'main h1','main h2','main h3','main p','main li','main a','main button','main input',
  'main textarea','main select','main pre','main code','main .hero-copy','main .hero-actions',
  'main .downloads','main .terminal-controls'
].join(',');

async function findDecorationOverlaps(page){
  return page.evaluate((selector)=>{
    const intersects=(a,b,padding=6)=>!(
      a.right+padding<=b.left || a.left-padding>=b.right ||
      a.bottom+padding<=b.top || a.top-padding>=b.bottom
    );
    const targets=[...document.querySelectorAll(selector)]
      .filter((el)=>!el.closest('.random-asset-plane'))
      .map((el)=>({el,rect:el.getBoundingClientRect()}))
      .filter(({rect})=>rect.width&&rect.height);
    return [...document.querySelectorAll('#random-asset-plane .random-asset:not([hidden])')]
      .map((asset)=>({asset,rect:asset.getBoundingClientRect()}))
      .filter(({rect})=>rect.width&&rect.height)
      .flatMap(({asset,rect})=>targets
        .filter(({rect:targetRect})=>intersects(rect,targetRect))
        .map(({el})=>({asset:asset.className,target:el.tagName+'.'+el.className})));
  },protectedSelector);
}

async function assertPdf(){
  const response=await fetch(origin+'/docs/alice-30-estados.pdf');
  if(!response.ok){ failures.push(`PDF Alice HTTP ${response.status}`); return; }
  const bytes=new Uint8Array(await response.arrayBuffer());
  if(String.fromCharCode(...bytes.slice(0,4))!=='%PDF') failures.push('PDF Alice sem assinatura %PDF');
}

try{
  await waitForServer();
  await assertPdf();

  for(const browserName of selected){
    const browserType=browserTypes[browserName];
    if(!browserType){ failures.push('browser desconhecido: '+browserName); continue; }
    const browser=await browserType.launch({headless:true});
    try{
      for(const viewport of viewports){
        const context=await browser.newContext({viewport});
        const page=await context.newPage();

        page.on('pageerror',(error)=>failures.push(`${browserName} ${viewport.width} pageerror: ${error.message}`));
        page.on('console',(message)=>{
          if(message.type()!=='error')return;
          const source=message.location().url||'';
          if(source&&isKnownDebtUrl(source))return;
          failures.push(`${browserName} ${viewport.width} console: ${message.text()}`);
        });
        page.on('response',(response)=>{
          if(response.status()<400)return;
          const url=response.url();
          if(!url.startsWith(origin)||isKnownDebtUrl(url))return;
          failures.push(`${browserName} ${viewport.width} HTTP ${response.status()}: ${url}`);
        });

        for(const path of pages){
          const response=await page.goto(`${origin}/${path}`,{waitUntil:'domcontentloaded',timeout:20000});
          await page.waitForTimeout(450);
          if(!response?.ok()){ failures.push(`${browserName} ${viewport.width} navegação ${path}: ${response?.status()}`); continue; }

          const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+1);
          if(overflow)failures.push(`${browserName} ${viewport.width} overflow horizontal: ${path}`);

          const sha=await page.locator('meta[name="upptb-build-sha"]').getAttribute('content');
          if(!sha)failures.push(`${browserName} ${viewport.width} sem build SHA: ${path}`);

          if(path==='alice.html'){
            if(await page.locator('.random-turtle').count()!==0) failures.push(`${browserName} ${viewport.width} tartaruga global na Alice`);
            if(await page.locator('.alice-do-not-feed').count()!==1) failures.push(`${browserName} ${viewport.width} mural Alice ausente`);
            for(const family of ['pink','blue','white','black']){
              if(await page.locator('.alice-butterfly-'+family).count()===0) failures.push(`${browserName} ${viewport.width} borboleta ${family} ausente`);
            }
          }

          const beybladeSelectors=[
            'img[src*="pretend-were-the-in-universe-general-public"]',
            'img[src*="ekusu-remade"]','img[src*="Beyblade_X_-_Ekusu_Kurosu"]','img[src*="multi-nanairo"]'
          ];
          if(path!=='laboratorio-beyblade.html'){
            for(const selector of beybladeSelectors){
              const count=await page.locator(selector).count();
              if(count!==0)failures.push(`${browserName} ${viewport.width} Beyblade fora do Lab em ${path}: ${selector}=${count}`);
            }
          }

          if(campusPages.includes(path)){
            const overlaps=await findDecorationOverlaps(page);
            if(overlaps.length) failures.push(`${browserName} ${viewport.width} sobreposição decorativa em ${path}: ${JSON.stringify(overlaps.slice(0,3))}`);
          }

          if(path==='index.html'){
            for(let reloadIndex=1;reloadIndex<=5;reloadIndex+=1){
              await page.reload({waitUntil:'domcontentloaded',timeout:20000});
              await page.waitForTimeout(350);
              for(const selector of beybladeSelectors){
                const count=await page.locator(selector).count();
                if(count!==0)failures.push(`${browserName} ${viewport.width} F5 #${reloadIndex}: Beyblade na Home ${selector}=${count}`);
              }
              const overlaps=await findDecorationOverlaps(page);
              if(overlaps.length)failures.push(`${browserName} ${viewport.width} F5 #${reloadIndex}: decoração cobre conteúdo na Home`);
            }

            if(await page.locator('img[src*="upptb-collage"]').count()!==1) failures.push(`${browserName} ${viewport.width} identidade duplicada Home`);
            if(await page.locator('img[src*="images-2-"], img[src*="images-1-"], img[src$="/images.jpg"]').count()!==0) failures.push(`${browserName} ${viewport.width} foto legada na Home`);

            const pageLinks=page.locator('.home-page-links .button');
            if(await pageLinks.count()!==4)failures.push(`${browserName} ${viewport.width} CTAs Home !=4`);
            const iconCount=await page.locator('.home-page-links .button img').count();
            if(iconCount!==4)failures.push(`${browserName} ${viewport.width} ícones Turtle !=4`);

            const titleSize=await page.locator('#hero-title').evaluate((el)=>parseFloat(getComputedStyle(el).fontSize));
            if(viewport.width>=1100&&titleSize>58)failures.push(`${browserName} ${viewport.width} título Home grande: ${titleSize}px`);

            const fossil=await page.locator('.fossil').evaluate((el)=>{
              const r=el.getBoundingClientRect(); return {left:r.left,width:r.width,viewport:innerWidth,textAlign:getComputedStyle(el).textAlign};
            });
            if(Math.abs(fossil.left+fossil.width/2-fossil.viewport/2)>3)failures.push(`${browserName} ${viewport.width} fóssil fora do centro`);
            if(viewport.width>=1100&&fossil.width>940)failures.push(`${browserName} ${viewport.width} fóssil largo ${fossil.width}px`);
            if(fossil.textAlign!=='center')failures.push(`${browserName} ${viewport.width} fóssil não centralizado`);

            if(await page.locator('.english-preview-grid article').count()!==3)failures.push(`${browserName} ${viewport.width} preview Inglês !=3`);
            const input=page.locator('[data-terminal-input]');
            await input.fill('help'); await input.press('Enter');
            const output=await page.locator('#terminal-output').textContent();
            if(!output?.includes('help · status · lore · clear'))failures.push(`${browserName} ${viewport.width} terminal não respondeu help`);
          }
        }
        await context.close();
      }

      // AUD-21 + AUD-08: estado determinístico para provar Efeito Alice e gato pelado local.
      {
        const context=await browser.newContext({viewport:{width:390,height:844}});
        const page=await context.newPage();
        await page.addInitScript(()=>{
          localStorage.setItem('upptb-alice-characters-v2',JSON.stringify({
            gato:{visible:true,page:'home',phrase:'QA gato'},
            chapeleiro:{visible:true,page:'home',phrase:'QA chapeleiro'},
            generatedAt:Date.now()
          }));
          localStorage.setItem('upptb-campus-distribution-v9',JSON.stringify({
            turtles:{},images:{},catPage:'home',generatedAt:Date.now()
          }));
        });
        await page.goto(origin+'/index.html',{waitUntil:'domcontentloaded'});
        await page.waitForTimeout(500);
        if(await page.locator('.alice-gato:not([hidden])').count()!==1)failures.push(`${browserName} Efeito Alice: gato não renderizou`);
        if(await page.locator('.alice-chapeleiro:not([hidden])').count()!==1)failures.push(`${browserName} Efeito Alice: chapeleiro não renderizou`);
        const sphynx=page.locator('.random-hairless-cat img');
        if(await sphynx.count()!==1 || !(await sphynx.getAttribute('src'))?.includes('sphynx-cat')) failures.push(`${browserName} gato pelado local não renderizou`);
        const overlaps=await findDecorationOverlaps(page);
        if(overlaps.length)failures.push(`${browserName} Efeito Alice/Sphynx sobrepõe conteúdo`);
        await context.close();
      }

      // AL-CT02/03: reduced-motion impede autoavanço e animação de borboletas.
      {
        const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
        const page=await context.newPage();
        await page.goto(origin+'/alice.html',{waitUntil:'domcontentloaded'});
        await page.waitForTimeout(400);
        const before=await page.locator('.alice-card-grid').evaluate((el)=>el.scrollLeft);
        await page.waitForTimeout(5800);
        const after=await page.locator('.alice-card-grid').evaluate((el)=>el.scrollLeft);
        if(before!==after)failures.push(`${browserName} reduced-motion: carrossel Alice avançou`);
        const animation=await page.locator('.alice-butterfly .butterfly-wings').first().evaluate((el)=>getComputedStyle(el).animationName);
        if(animation!=='none')failures.push(`${browserName} reduced-motion: borboleta animando (${animation})`);
        await context.close();
      }
    }finally{await browser.close();}
  }
}finally{
  if(server.exitCode===null){
    server.kill('SIGTERM');
    await Promise.race([once(server,'exit'),new Promise((resolve)=>setTimeout(resolve,2000))]);
    if(server.exitCode===null)server.kill('SIGKILL');
  }
}

if(failures.length){
  console.error('Runtime smoke: FAIL');
  failures.forEach((failure)=>console.error(' - '+failure));
  process.exit(1);
}
console.log(`Runtime smoke: OK (${selected.join(', ')} · regras canônicas Alice · colisão global · PDF)`);
