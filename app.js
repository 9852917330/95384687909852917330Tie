const $=id=>document.getElementById(id);
const fmt0=new Intl.NumberFormat('vi-VN',{maximumFractionDigits:0});
const fmt2=new Intl.NumberFormat('vi-VN',{minimumFractionDigits:0,maximumFractionDigits:2});
const fmt4=new Intl.NumberFormat('vi-VN',{minimumFractionDigits:0,maximumFractionDigits:4});

const PAGES={
  eur:{
    route:'VND → USDT → EUR → VND',capital:'VND',highlight:1,
    rates:[
      {label:'USDT / VND',tag:'P2P',unit:'VND',placeholder:'Ví dụ 26.300',receive:'USDT',op:'divide',vndThousands:true},
      {label:'USDT / EUR',tag:'P2P',unit:'EUR',placeholder:'Ví dụ 0,8600',receive:'EUR',op:'multiply'},
      {label:'EUR / VND',tag:'',unit:'VND',placeholder:'Ví dụ 30.700',receive:'VND',op:'multiply',vndThousands:true}
    ]
  },
  try:{
    route:'TRY → EUR → USDT → TRY',capital:'TRY',highlight:3,
    rates:[
      {label:'EUR / TRY',tag:'',unit:'TRY',placeholder:'Ví dụ 48,50',receive:'EUR',op:'divide'},
      {label:'USDT / EUR',tag:'',unit:'EUR',placeholder:'Ví dụ 0,8550',receive:'USDT',op:'divide'},
      {label:'USDT / TRY',tag:'',unit:'TRY',placeholder:'Ví dụ 41,50',receive:'TRY',op:'multiply'}
    ]
  },
  jpy:{
    route:'VND → JPY → USDT → VND',capital:'VND',highlight:2,
    rates:[
      {label:'JPY / VND',tag:'',unit:'VND',placeholder:'Ví dụ 165,50',receive:'JPY',op:'divide'},
      {label:'USDT / JPY',tag:'',unit:'JPY',placeholder:'Ví dụ 155,00',receive:'USDT',op:'divide'},
      {label:'USDT / VND',tag:'P2P',unit:'VND',placeholder:'Ví dụ 26.300',receive:'VND',op:'multiply',vndThousands:true}
    ]
  }
};

let page=localStorage.getItem('tiendien_page');
if(!PAGES[page])page='eur';

function capitalNum(v){return Number(String(v??'').replace(/\D/g,''))||0}
function rateNum(v,thousands=false){
  let s=String(v??'').trim().replace(/\s/g,'');
  if(!s)return 0;
  if(s.includes(',')){
    s=s.replace(/\./g,'').replace(',','.');
  }else if(thousands&&/^\d{1,3}(?:\.\d{3})+$/.test(s)){
    s=s.replace(/\./g,'');
  }
  const n=Number(s);
  return Number.isFinite(n)?n:0;
}
function formatCapital(){
  const el=$('capital');
  const digits=el.value.replace(/\D/g,'');
  el.value=digits?fmt0.format(Number(digits)):'';
}
function money(v,unit){return `${v>=0?'+':'−'}${fmt0.format(Math.abs(v))} ${unit}`}
function pct(v){return `${v>=0?'+':''}${fmt2.format(v)}%`}
function tone(el,v){el.classList.remove('good','bad','neutral');el.classList.add(v>0.01?'good':v<-0.01?'bad':'neutral')}
function formatReceived(v,unit){
  if(!(v>0))return `Nhận: — ${unit}`;
  const fmt=(unit==='VND'||unit==='TRY')?fmt2:fmt4;
  return `Nhận: ${fmt.format(v)} ${unit}`;
}
function key(name){return `tiendien_${page}_${name}`}
function save(){['capital','rate1','rate2','rate3'].forEach(id=>localStorage.setItem(key(id),$(id).value))}
function migrateReciprocalRate2(){
  if(page!=='try'&&page!=='jpy')return;
  const flag=`tiendien_${page}_rate2_quote_v2`;
  if(localStorage.getItem(flag)==='1')return;
  const oldKey=`tiendien_${page}_rate2`;
  const old=localStorage.getItem(oldKey);
  if(old){
    const n=rateNum(old,false);
    if(n>0)localStorage.setItem(oldKey,String(1/n).replace('.',','));
  }
  localStorage.setItem(flag,'1');
}
function restorePage(){
  migrateReciprocalRate2();
  const defaultCapital=page==='try'?'100.000':'100.000.000';
  if(page==='eur'&&localStorage.getItem(key('capital'))===null){
    const legacy={capital:'tiendien_capitalVnd',rate1:'tiendien_usdtVnd',rate2:'tiendien_usdtEur',rate3:'tiendien_eurVnd'};
    Object.entries(legacy).forEach(([id,k])=>{const v=localStorage.getItem(k);if(v!==null)localStorage.setItem(key(id),v)});
  }
  $('capital').value=localStorage.getItem(key('capital'))??defaultCapital;
  ['rate1','rate2','rate3'].forEach(id=>$(id).value=localStorage.getItem(key(id))??'');
  formatCapital();
}
function renderPage(){
  const cfg=PAGES[page];
  $('routeText').textContent=cfg.route;
  $('capitalUnit').textContent=cfg.capital;
  cfg.rates.forEach((r,i)=>{
    const n=i+1;
    $( `rate${n}Label` ).innerHTML=`${r.label}${r.tag?` <small>${r.tag}</small>`:''}`;
    $( `rate${n}Unit` ).textContent=r.unit;
    $( `rate${n}` ).placeholder=r.placeholder;
    $( `received${n}` ).textContent=`Nhận: — ${r.receive}`;
    $( `rate${n}` ).closest('.field').classList.toggle('rate-highlight',n===cfg.highlight);
  });
  document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
  localStorage.setItem('tiendien_page',page);
  restorePage();
  calculate();
}
function calculate(){
  const cfg=PAGES[page];
  const capital=capitalNum($('capital').value);
  const rates=cfg.rates.map((r,i)=>rateNum($(`rate${i+1}`).value,!!r.vndThousands));
  let amount=capital;
  const received=[];
  for(let i=0;i<3;i++){
    const r=rates[i],op=cfg.rates[i].op;
    if(!(amount>0&&r>0)){amount=0;received.push(0);continue}
    amount=op==='divide'?amount/r:amount*r;
    received.push(amount);
  }
  cfg.rates.forEach((r,i)=>$(`received${i+1}`).textContent=formatReceived(received[i],r.receive));
  if(!(capital>0&&amount>0)){
    $('profit').textContent='—';$('roi').textContent='—';
    $('profit').className='';$('roi').className='';save();return;
  }
  const profit=amount-capital;
  const roi=profit/capital*100;
  $('profit').textContent=money(profit,cfg.capital);
  $('roi').textContent=pct(roi);
  tone($('profit'),profit);tone($('roi'),profit);
  save();
}

$('capital').addEventListener('input',()=>{formatCapital();calculate()});
['rate1','rate2','rate3'].forEach(id=>$(id).addEventListener('input',calculate));
document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>{save();page=btn.dataset.page;renderPage()}));
let deferredPrompt=null;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;$('installBtn').classList.remove('hidden')});
$('installBtn').addEventListener('click',async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$('installBtn').classList.add('hidden')});
if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('./sw.js').catch(()=>{});
renderPage();
