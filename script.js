const PROFILE = {
  "owner-name": " \n $ Varun Mangwani — He is a website, software, AI, and malware developer. Education: BCA (1 year in process). Projects: Personal portfolio, C library management, Bank management system, Python speech recognition Jarvis.",
  "owner-education": "$ Education:\n- BCA (1 year in process)\n- Self-learning web development, Python, and cybersecurity basics.",
  "owner-projects": "$ Projects:\n- Personal portfolio\n- C library management system\n- Bank management system\n- Python speech recognition Jarvis",
  "owner-future-plans": "$ Future Plans:\n- Build a productized web/marketing studio\n- Continue learning security & systems programming\n- Ship fun, shareable apps and tools",
  "help": "$ Available commands:\n- owner-name\n- owner-education\n- owner-projects\n- owner-future-plans\n- help"
};

const outputEl = document.getElementById('output');
const inputEl = document.getElementById('cmd');
const autoBtn = document.getElementById('autoBtn');
const stopAutoBtn = document.getElementById('stopAutoBtn');
const clearBtn = document.getElementById('clearBtn');
const minBtn = document.getElementById('minBtn');
const maxBtn = document.getElementById('maxBtn');
const termWrap = document.querySelector('.terminal-wrap');

let autoRunning = false;
function sleep(ms){return new Promise(r=>setTimeout(r, ms));}

async function typeOut(text, speed=18){
  const line = document.createElement('div');
  line.className='line out';
  line.style.marginBottom='16px';
  outputEl.appendChild(line);
  for (let i=0;i<text.length;i++){
    line.textContent += text[i];
    outputEl.scrollTop = outputEl.scrollHeight;
    await sleep(speed);
  }
}

async function runCommand(cmd){
  const answer = PROFILE[cmd];
  if(!answer) { await typeOut(`\"${cmd}\" is not specified`); return; }
  await typeOut(answer);
}

inputEl.addEventListener('keydown', async e=>{
  if(e.key==='Enter'){
    const val=inputEl.value.trim(); inputEl.value='';
    if(val==='auto'){ startAuto(); return; }
    if(val==='stop'){ stopAuto(); return; }
    await runCommand(val);
  }
});

document.querySelectorAll('.action-btn[data-cmd]').forEach(b=>{
  b.addEventListener('click', ()=> runCommand(b.dataset.cmd));
});

const WELCOME_HTML = '$Welcome to Varun Mangwani portfolio terminal<br>$Powered by Varun Mangwani';
clearBtn.addEventListener('click', ()=> outputEl.innerHTML = WELCOME_HTML);
minBtn.addEventListener('click', ()=>{
  if(termWrap.style.transform==='scale(0.7)') termWrap.style.transform='';
  else termWrap.style.transform='scale(0.7)';
});
maxBtn.addEventListener('click', ()=>{
  if(termWrap.style.width==='90vw'){
    termWrap.style.width='var(--card-w)'; termWrap.style.height='var(--card-h)';
  } else {
    termWrap.style.width='90vw'; termWrap.style.height='80vh';
  }
});

async function startAuto(){
  if(autoRunning) return; autoRunning=true;
  const seq=['owner-name','owner-education','owner-projects','owner-future-plans'];
  outputEl.appendChild(document.createElement('br'));
  for(let i=0;i<seq.length;i++){
    if(!autoRunning) break;
    await runCommand(seq[i]);
    await sleep(4000);
  }
  autoRunning=false;
}
function stopAuto(){ autoRunning=false; }
autoBtn.addEventListener('click', startAuto);
stopAutoBtn.addEventListener('click', stopAuto);

// Drag to move
let isDragging=false, startX, startY, origX, origY;
const rect=termWrap.getBoundingClientRect();
termWrap.style.position='absolute'; termWrap.style.left=`${rect.left}px`; termWrap.style.top=`${rect.top}px`;
termWrap.querySelector('.term-header').addEventListener('mousedown', e=>{
  isDragging=true; startX=e.clientX; startY=e.clientY;
  origX=parseInt(termWrap.style.left); origY=parseInt(termWrap.style.top);
  e.preventDefault();
});
window.addEventListener('mousemove', e=>{
  if(!isDragging) return;
  termWrap.style.left=`${origX + e.clientX - startX}px`;
  termWrap.style.top=`${origY + e.clientY - startY}px`;
});
window.addEventListener('mouseup', ()=>{isDragging=false;});

termWrap.style.resize='both'; termWrap.style.overflow='auto';
outputEl.innerHTML = WELCOME_HTML;
inputEl.focus();


const matrixArea = document.getElementById('matrixArea');
const statusText = document.getElementById('statusText');
const dotSpan = document.getElementById('dotSpan');
const accessText = document.getElementById('accessText');
const typedText = document.getElementById('typedText');
const overlay = document.getElementById('overlay');
const verifyBox = document.getElementById('verifyBox');
const successGlow = verifyBox.querySelector('.success-glow');
const mainContent = document.getElementById('mainContent');

function randomhex(len=6){
  const chars = '0123456789ABCDEF';
  let s='';
  for(let i=0;i<len;i++) s+=chars[Math.floor(Math.random()*chars.length)];
  return s;
}

function addMatrixLine(){
  // small random technical-looking lines
  const templates = [
    `auth.check(${randomhex(4)}) => OK`,
    `handshake: ${randomhex(8)}... established`,
    `payload hash: ${randomhex(12)}`,
    `cert.verify > ${Math.random()>0.2 ? 'PASS' : 'WARN'}`,
    `nonce: ${Math.floor(Math.random()*99999)}`,
    `session: ${randomhex(6)}-${randomhex(4)}`,
    `perm: read,write,exec`,
    `integrity: ${Math.random()>0.1 ? 'OK' : 'RETRY'}`
  ];
  const el = document.createElement('div');
  el.textContent = templates[Math.floor(Math.random()*templates.length)];
  matrixArea.appendChild(el);
  if(matrixArea.children.length>6) matrixArea.removeChild(matrixArea.firstChild);
}

// animate dots after "VERIFYING"
let dotIndex = 0;
const dotInterval = setInterval(()=>{
  dotIndex = (dotIndex+1)%4;
  dotSpan.textContent = '.'.repeat(dotIndex);
}, 300);

// matrix animation phase
let matrixTimer;
function startMatrixPhase(){
  // populate quickly for ~2.2s
  let t=0;
  matrixArea.innerHTML='';
  matrixTimer = setInterval(()=>{
    addMatrixLine();
    t += 120;
    if(t>2200){ // end matrix phase
      clearInterval(matrixTimer);
      clearInterval(dotInterval);
      runFlickerPhase();
    }
  }, 120);
}

// flicker/glitch phase
function runFlickerPhase(){
  statusText.textContent = 'ANALYSING';
  // add flicker class for a short time
  verifyBox.classList.add('reveal-success');
  verifyBox.classList.add('flicker');
  // occasional content shift
  verifyBox.style.transform = 'translateY(0)';
  setTimeout(()=>{
    verifyBox.classList.remove('flicker');
    // proceed to type ACCESS GRANTED
    runAccessGranted();
  }, 650);
}

// typewriter for ACCESS GRANTED
async function runAccessGranted(){
  const message = 'ACCESS GRANTED';
  accessText.style.opacity = '1';
  accessText.classList.add('typing');
  const typedEl = typedText;
  typedEl.textContent = '';
  for(let i=0;i<message.length;i++){
    typedEl.textContent += message[i];
    await new Promise(r=>setTimeout(r, 90)); // letter speed
  }
  // stop caret blink
  accessText.classList.remove('typing');
  // glow and reveal content
  setTimeout(()=> {
    // small success flash
    verifyBox.classList.add('reveal-success');
    successGlow.style.opacity = '1';
    // hide modal & reveal main
    setTimeout(()=> {
      overlay.style.transition = 'opacity 320ms ease';
      overlay.style.opacity = '0';
      setTimeout(()=> {
        overlay.remove();
        mainContent.style.display = 'block';
        // optional: focus main content or play a small entrance
        mainContent.style.opacity = 0;
        mainContent.style.transition = 'opacity 400ms ease';
        requestAnimationFrame(()=> mainContent.style.opacity = 1);
      }, 360);
    }, 600);
  }, 400);
}

// Start sequence after small initial delay to allow user to notice modal
setTimeout(()=> startMatrixPhase(), 250);

/* Accessibility: allow pressing Enter/Escape to reveal (for demo) */
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter' || e.key === 'Escape'){
    // quick skip to Access Granted
    clearInterval(matrixTimer);
    runFlickerPhase();
  }
});