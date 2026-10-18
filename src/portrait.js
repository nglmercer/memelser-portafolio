const stage=document.querySelector('.portrait-stage');
const portrait=stage.querySelector('img');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
function reset(){portrait.style.transform='';}
stage.addEventListener('pointermove',event=>{if(reduced.matches||event.pointerType==='touch')return;const r=stage.getBoundingClientRect();const x=(event.clientX-r.left)/r.width-.5,y=(event.clientY-r.top)/r.height-.5;portrait.style.transform=`rotateX(${-y*10}deg) rotateY(${x*14}deg)`;});
stage.addEventListener('pointerleave',reset);reduced.addEventListener('change',reset);
