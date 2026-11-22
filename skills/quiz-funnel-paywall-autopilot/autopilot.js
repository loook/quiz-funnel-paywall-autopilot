(()=>{if(window.__ap)clearInterval(window.__ap);if(window.__recI)clearInterval(window.__recI);
const EMAIL=window.__email;if(!EMAIL||!/@/.test(EMAIL))return 'ERROR: set window.__email first';
window.__log=[];window.__rec=window.__rec||[];window.__ptr=window.__ptr||0;window.__done=false;window.__gate=null;window.__taps=window.__taps||0;window.__stall=0;let lastSig='',same=0;const T0=Date.now();
const COOK='[class*=ookie],[id*=ookie],[id*=onetrust],[id*=Cookiebot],[id*=usercentrics],[class*=CookieConsent],[id*=didomi],[class*=didomi],[class*=cky-],[id*=truste],[class*=truste],[class*=qc-cmp],[class*=osano],[class*=consent-banner],[id*=consent-banner],footer';
const FOOT=/manage|subscription|privacy|terms|policy|conditions|contact|about us|help|support|refund|affiliate|disclaimer|cookie settings/i;
const UNIT=/^(ft|ft, ?in|cm|kg|lbs?|in)$/i;
const vis=e=>{const r=e.getBoundingClientRect();const s=getComputedStyle(e);return r.width>4&&r.height>4&&s.visibility!=='hidden'&&s.display!=='none'&&r.left<innerWidth&&r.right>0};
const inCookie=e=>{if(e.closest(COOK))return true;let p=e.parentElement;for(let i=0;i<6&&p&&p!==document.body;i++,p=p.parentElement){const ps=getComputedStyle(p).position;if((ps==='fixed'||ps==='sticky')&&(p.innerText||'').length<700&&/cookie/i.test(p.innerText||''))return true}return false};
const hasRC=e=>{const k=Object.keys(e).find(k=>k.startsWith('__reactProps$'));return !!(k&&typeof e[k].onClick==='function')};
const tx=e=>(e.innerText||e.value||'').trim();
const big=e=>{const r=e.getBoundingClientRect();return r.width>60&&r.height>60};
const BT=()=>(document.body.innerText||document.body.textContent||'').replace(/\s+/g,' ');
const tap=el=>{window.__taps++;try{el.scrollIntoView({block:'center'})}catch(e){}if(same%2===0){(el.closest('label,button,a,[role=button]')||el).click();return}const r=el.getBoundingClientRect();const x=r.left+r.width/2,y=r.top+r.height/2;const t=document.elementFromPoint(x,y)||el;const o={bubbles:true,cancelable:true,clientX:x,clientY:y,pointerId:1,pointerType:'touch',isPrimary:true,button:0,buttons:1,view:window};const ev=(n,b)=>{o.buttons=b;try{t.dispatchEvent(/^pointer/.test(n)?new PointerEvent(n,o):/^touch/.test(n)?new Event(n,{bubbles:true}):new MouseEvent(n,o))}catch(e){}};ev('pointerdown',1);ev('mousedown',1);ev('touchstart',1);ev('pointerup',0);ev('mouseup',0);ev('touchend',0);ev('click',0)};
const setVal=(el,v)=>{const p=el.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(p,'value').set.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}))};
const CONT=/^(continuar|pr[oó]ximo|avan[cç]ar|seguinte|siguiente|comenzar|come[cç]ar|iniciar|vamos|entendi|empezar|continue|next|get started|start|start quiz|take the quiz|let.?s go|let.?s start|ok|okay|got it|i understand|sounds good|great|awesome|show me|see (my )?(results|plan)|get results|reveal.*|submit|done|confirm|proceed|go)\b/i;
const NEG=/^(voltar|volver|atr[aá]s|zur[uü]ck|retour|indietro|pular|omitir|no thanks|skip|maybe later|not now|back|close|cancel|log ?in|sign ?in|edit my answer|i.ll sign up later)/i;
const BUY=/\b(comprar|pagar|assinar|suscri\w*|buy|pay|payment|paypal|purchase|subscribe|order|checkout|check out|get my plan|build my plan|start (my )?(free )?trial|try (it )?(for )?free|claim|unlock|upgrade|join now|activate|kaufen|bezahlen|abonnieren|acheter|payer|acquista|abbonati)\b|zapła|kupuj|kup teraz|s.abonner/i;
const BUYSOFT=/\b(get my plan|build my plan|unlock)\b/i;
const CL='(?:USD|EUR|GBP|AED|SAR|QAR|KWD|PLN|CHF|CAD|AUD|NZD|INR|BRL|MXN|SEK|NOK|DKK|CZK|HUF|RON|UAH|JPY|zł|kr|Kč)',CS='(?:R\\$|د\\.إ|ر\\.س|ر\\.ق|د\\.ك|[$£€₹¥₺₽₴])',NUM='\\d+(?:[.,]\\d{1,2})?';
const PRICE=new RegExp('(?:(?<![A-Za-z])'+CL+'|'+CS+')\\s?'+NUM+'|'+NUM+'\\s?(?:'+CL+'(?![A-Za-z])|'+CS+')','g');
const prices=()=>(BT().match(PRICE)||[]).length;
const PAYPATH=/pay|checkout|paywall|subscri|purchase/i,PLANPATH=/pay|checkout|paywall|subscri|purchase|\/plan|offer/i;
const TERMS=/(per|\/)\s?(day|week|month|year)|billed|trial|cancel anytime|money.back|every \d+ (weeks|months)|auto.?renew/i;
const blocked=e=>{const t=tx(e);return BUY.test(t)&&(!BUYSOFT.test(t)||prices()>=2||PAYPATH.test(location.pathname)||TERMS.test(BT()))};
const paywall=()=>{if(window.__taps<3)return false;const n=prices(),p=location.pathname,b=BT();return (n>=3&&(PLANPATH.test(p)||TERMS.test(b)))||(n>=1&&PAYPATH.test(p)&&TERMS.test(b))};
const GATE=/selfie|take a (photo|picture)|scan your face|face scan|upload (a |your )?(photo|picture)|allow (camera|access to your camera)/i;
const LATER=/^(skip|later|maybe later|not now|no thanks|i.ll do it later)/i;
const captcha=()=>!!document.querySelector('iframe[src*="recaptcha"],iframe[src*="hcaptcha"],iframe[src*="challenges.cloudflare.com"],.g-recaptcha,.h-captcha,.cf-turnstile,#challenge-form')||/verify (that )?you are (a )?human|i.?m not a robot|checking your browser|press (and|&) hold/i.test(BT());
const OPTQ=/(receive|get|send|sign up for|subscribe to|join).{0,40}(e-?mails?|newsletters?|updates|tips|offers|promotions|news)|marketing (e-?mails?|communications?|messages)/i;
const DECL=/^(no\b|nope|i don.?t|don.?t|not now|no,? thanks|maybe later|skip)|don.?t want|not interested|unsubscribe/i;
const REJ=/^(deny|deny all|reject( all)?|decline( all)?|refuse( all)?|necessary only|only necessary|use necessary cookies only|continue without (accepting|agreeing))$/i;
const CSET=/^(cookie settings|cookies? preferences|manage (cookies|preferences|options|settings)|customi[sz]e|more options|preferences|settings)$/i;
const stop=(g,m)=>{clearInterval(window.__ap);window.__gate=g;window.__log.push(m)};
const today=n=>new Date(Date.now()+n*864e5).toISOString().slice(0,10);
window.__ap=setInterval(()=>{try{
if(paywall()){clearInterval(window.__ap);window.__done=true;window.__log.push('PAYWALL');return}
if(document.querySelector('input[autocomplete*=cc-number],iframe[src*="stripe"],iframe[src*="braintree"],iframe[name*=card i],iframe[title*=card i]')||/card number|cvc|cvv/i.test(BT())){clearInterval(window.__ap);window.__done=true;window.__gate='payment';window.__log.push('PAYMENT FORM');return}
const body=BT();
if(captcha()){stop('captcha','CAPTCHA');return}
if(GATE.test(body)){const l=[...document.querySelectorAll('button,a,[role=button]')].find(b=>vis(b)&&LATER.test(tx(b)));if(l){tap(l);return}stop('camera','CAMERA GATE');return}
if(/questionary_id_error/.test(location.href+body)){stop('bm-error','QUESTIONARY ERROR');return}
const head=body.slice(0,80);const sig=location.pathname+location.search+'|'+head;
if(window.__log[window.__log.length-1]!==head)window.__log.push(head);
if(sig===lastSig)same++;else{same=0;lastSig=sig}
window.__stall=same;
const btns=[...document.querySelectorAll('button,a,[role=button]')];
const cb=btns.find(b=>vis(b)&&REJ.test(tx(b)));
if(cb){tap(cb);return}
if(!window.__ckset){const cs=btns.find(b=>vis(b)&&CSET.test(tx(b))&&inCookie(b));if(cs){window.__ckset=1;tap(cs);return}}
const unit=[...document.querySelectorAll('button,[role=button],label,div,span,li')].find(b=>b.children.length===0&&vis(b)&&/^(cm|kg|centimeters|kilograms)$/i.test(tx(b))&&!b.__c);
if(unit){unit.__c=1;tap(unit);return}
const h=([...document.querySelectorAll('h1,h2,h3')].map(x=>x.innerText).join(' ')+' '+body.slice(0,130)).toLowerCase();
const di=[...document.querySelectorAll('input[type=date]')].find(i=>vis(i)&&!i.value);
if(di){di.focus();setVal(di,/birth|dob|born/i.test(h+di.name+di.id)?'1990-03-15':today(90));return}
const inp=[...document.querySelectorAll('input,textarea')].find(i=>vis(i)&&!inCookie(i)&&/^(email|number|tel|text|search)$/.test(i.type||'text')&&!i.readOnly);
if(inp){let want;const k=inp.name+inp.placeholder+inp.id;const tgt=!/current|right now|today/.test(h)&&/target|goal|desired|perfect|ideal|dream/.test(h);const bad=/smaller than|too low|too high|must be|invalid|larger than|greater than/i.test(body);
if(!/^(number|tel)$/.test(inp.type)&&inp.type!=='email'&&/call you|your name|first name/.test(h))want='Alex';else if(inp.type==='email'||/email/i.test(k)||(/e-?mail/.test(h.slice(0,160))&&!/^(number|tel)$/.test(inp.type)&&!/numeric|decimal/.test(inp.inputMode)))want=EMAIL;else if(/birth|dob/i.test(k+h))want='03151990';else if(/name/i.test(k))want='Alex';else{const kind=/tall|height|\bcm\b/.test(h)?'h':tgt?'t':/weigh|\bkg\b|\blbs?\b/.test(h)?'w':/\bage\b|how old/.test(h)?'a':'n';const V={h:['170','165','175','160'],t:['65','70','60','75'],w:['80','75','85','70'],a:['34','30','40','45'],n:['30','10','5','3']}[kind];want=bad&&same>=2?V[Math.floor(same/2)%4]:V[0]}
if(!inp.value||inp.value==='0'||(want===EMAIL&&inp.value!==EMAIL)||(want==='Alex'&&/@/.test(inp.value))||(bad&&same>=2&&same%2===0&&inp.value!==want)){inp.focus();setVal(inp,want);return}}
const cbx=[...document.querySelectorAll('input[type=checkbox]')].find(i=>window.__consent&&!i.checked&&!inCookie(i)&&vis(i)&&/agree|consent|terms|privacy|accept|health/i.test((i.closest('label,div')||{}).innerText||''));
if(cbx){tap(cbx);return}
const clab=[...document.querySelectorAll('label')].find(l=>window.__consent&&vis(l)&&!l.__c&&/consent|i agree/i.test(tx(l)));
if(clab){clab.__c=1;tap(clab);return}
let c=[...document.querySelectorAll('button,[role=button],a,label,input[type=radio],input[type=checkbox],div,li,span,img')].filter(e=>vis(e)&&(tx(e).length>0||big(e))&&!FOOT.test(tx(e))&&!UNIT.test(tx(e))&&!blocked(e)&&!/consent/i.test(tx(e))&&!(e.tagName==='INPUT'&&/consent|i agree|privacy|terms/i.test((e.closest('label,div')||{}).innerText||''))&&(/^(BUTTON|A|LABEL|INPUT)$/.test(e.tagName)||e.getAttribute('role')==='button'||((getComputedStyle(e).cursor==='pointer'||hasRC(e))&&tx(e).length<140))&&!inCookie(e));
c=c.filter(e=>!c.some(o=>o!==e&&e.contains(o)));
if(OPTQ.test(body.slice(0,250))&&!(window.__opt||{})[sig]){const d=c.find(e=>DECL.test(tx(e)));if(d){(window.__opt=window.__opt||{})[sig]=1;tap(d);return}}
const cont=c.find(e=>(CONT.test(tx(e))||BUYSOFT.test(tx(e)))&&!NEG.test(tx(e))&&!e.disabled&&!/\boff\b/.test(e.className));
const opts=c.filter(e=>!CONT.test(tx(e))&&!BUYSOFT.test(tx(e))&&!NEG.test(tx(e)));
const skip=c.find(e=>/^skip/i.test(tx(e)));
const medNo=/diagnos|medication|pregnan|eating disorder|medical|condition|health & safety/i.test(body.slice(0,160))?opts.find(e=>/^no$/i.test(tx(e))):null;
if(medNo&&same%2===0&&!window.__noTapped?.[sig]){(window.__noTapped=window.__noTapped||{})[sig]=1;tap(medNo);return}
if(same>=3&&skip){tap(skip);return}
if(same===0&&opts.length&&!cont){tap(opts[0]);return}
if(cont&&(same>0||!opts.length||/^(continue|next)$/i.test(tx(cont))||BUYSOFT.test(tx(cont)))){if(opts.length&&same%4===3){tap(opts[0]);return}tap(cont);return}
if(same===0&&opts.length){tap(opts[0]);return}
if(same>=2&&opts.length){tap(opts[(same-2)%opts.length]);return}
}catch(e){window.__log.push('ERR '+e.message)}},2000);
window.__recI=setInterval(()=>{const t=BT().trim();const k=location.pathname+'|'+t.replace(/^\d+\s*\/\s*\d+\s*/,'').slice(0,70).replace(/\d+/g,'#');if(k!==window.__recK){window.__recK=k;window.__rec.push({n:window.__rec.length+1,s:Math.round((Date.now()-T0)/1000),p:location.pathname,h:t.slice(0,300)})}},1000);
window.__poll=async(ms=25000)=>{const end=Date.now()+ms;while(Date.now()<end&&!window.__done&&!window.__gate)await new Promise(r=>setTimeout(r,500));if(window.__done||window.__gate)clearInterval(window.__recI);const n=window.__rec.slice(window.__ptr);window.__ptr=window.__rec.length;return JSON.stringify({d:window.__done,g:window.__gate,s:window.__stall,t:window.__taps,u:location.pathname,new:n.map(x=>x.n+' '+x.h.slice(0,90))})};
return 'ap v38'})()
