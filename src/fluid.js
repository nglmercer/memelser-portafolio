import * as THREE from './vendor/three.module.min.js';
import {streamline} from './vortex-model.js';
import {t} from './i18n.js';
const canvas=document.getElementById('fluid'),host=canvas.parentElement,button=document.getElementById('fluid-pause'),label=document.getElementById('fluid-pause-label');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');let paused=reduced.matches,visible=true,frame=0,last=0,drag=null;
function sync(){label.dataset.i18n=paused?'animate':'pause';label.textContent=t(label.dataset.i18n);button.setAttribute('aria-pressed',String(paused));}
window.addEventListener('portfolio:languagechange',sync);sync();
try{
const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(36,1,.1,40);camera.position.set(0,.35,9.3);camera.lookAt(0,0,0);
scene.add(new THREE.HemisphereLight(0xffffff,0x30415e,2.2));const light=new THREE.DirectionalLight(0xffffff,3);light.position.set(3,5,6);scene.add(light);const fill=new THREE.DirectionalLight(0x80cfff,2);fill.position.set(-4,0,-2);scene.add(fill);
const vortex=new THREE.Group();scene.add(vortex);vortex.rotation.set(.07,-.3,-.08);
const material=new THREE.MeshStandardMaterial({vertexColors:true,metalness:.42,roughness:.3});
for(let side of [-1,1])for(let s=0;s<32;s++){
 const angle=s/32*Math.PI*2+(side===1?.1:0),radius=1.5+(s%5)*.11,y=side*(.045+(s%7)*.008);
 const points=streamline([Math.cos(angle)*radius,y,Math.sin(angle)*radius]).map(p=>new THREE.Vector3(...p));
 const curve=new THREE.CatmullRomCurve3(points),segments=140,radial=5,frames=curve.computeFrenetFrames(segments,false),positions=[],normals=[],colors=[],indices=[];
 for(let i=0;i<=segments;i++){const f=i/segments,p=curve.getPointAt(f),r=Math.hypot(p.x,p.z);const color=new THREE.Color(r>.85?0x39d6d8:r>.5?0x4b91ed:0xf4ad64);const thickness=(.006+(s%4)*.0025)*Math.pow(Math.sin(Math.PI*f),.42)+.0005;
 for(let j=0;j<=radial;j++){const a=j/radial*Math.PI*2,normal=frames.normals[i].clone().multiplyScalar(Math.cos(a)).addScaledVector(frames.binormals[i],Math.sin(a));positions.push(p.x+normal.x*thickness,p.y+normal.y*thickness,p.z+normal.z*thickness);normals.push(normal.x,normal.y,normal.z);colors.push(color.r,color.g,color.b);}}
 for(let i=0;i<segments;i++)for(let j=0;j<radial;j++){const a=i*(radial+1)+j,b=a+radial+1;indices.push(a,b,a+1,b,b+1,a+1);}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));g.setIndex(indices);vortex.add(new THREE.Mesh(g,material));
}
// Quiet axis makes the axial stretching legible without introducing decorative labels.
const axis=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,-2.7,0),new THREE.Vector3(0,2.7,0)]),new THREE.LineBasicMaterial({color:0x8d9bac,transparent:true,opacity:.35}));vortex.add(axis);
function draw(){renderer.render(scene,camera);}
function tick(now){frame=0;if(paused||!visible||document.hidden)return;const dt=Math.min((now-last)/1000,.05);last=now;if(!drag)vortex.rotation.y+=dt*.1;draw();frame=requestAnimationFrame(tick);}
function resume(){if(frame)cancelAnimationFrame(frame);frame=0;last=performance.now();if(!paused&&visible&&!document.hidden)frame=requestAnimationFrame(tick);else draw();}
new ResizeObserver(()=>{const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();draw();}).observe(host);
new IntersectionObserver(e=>{visible=e[0].isIntersecting;resume();}).observe(canvas);
canvas.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')return;drag={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);});canvas.addEventListener('pointermove',e=>{if(!drag)return;vortex.rotation.y+=(e.clientX-drag.x)*.008;vortex.rotation.x=Math.max(-.6,Math.min(.6,vortex.rotation.x+(e.clientY-drag.y)*.004));drag={x:e.clientX,y:e.clientY};draw();});const release=()=>drag=null;canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);
button.addEventListener('click',()=>{paused=!paused;sync();resume();});document.getElementById('fluid-reset').addEventListener('click',()=>{vortex.rotation.set(.07,-.3,-.08);draw();});
reduced.addEventListener('change',()=>{paused=reduced.matches;sync();resume();});document.addEventListener('visibilitychange',resume);window.addEventListener('portfolio:themechange',draw);
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();if(frame)cancelAnimationFrame(frame);host.classList.add('vortex-unavailable');button.disabled=true;});canvas.addEventListener('webglcontextrestored',()=>{host.classList.remove('vortex-unavailable');button.disabled=false;resume();});resume();
}catch{host.classList.add('vortex-unavailable');document.querySelector('.fluid-controls').hidden=true;}
