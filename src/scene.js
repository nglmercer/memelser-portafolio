import * as THREE from './vendor/three.module.min.js';
import {t} from './i18n.js';

const host = document.getElementById('scene');
const canvas = document.getElementById('webgl');
const motionButton = document.getElementById('motion');
const materialButton = document.getElementById('material');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
let paused = reduced.matches;
let wireframe = false;
let visible = true;
let frame = 0;

function syncMotion() {
  document.getElementById('motion-label').dataset.i18n = paused ? 'animate' : 'pause';
  document.getElementById('motion-label').textContent = t(document.getElementById('motion-label').dataset.i18n);
  motionButton.setAttribute('aria-pressed', String(paused));
}
function syncMaterial() {
  document.getElementById('material-label').dataset.i18n = wireframe ? 'solid' : 'mesh';
  document.getElementById('material-label').textContent = t(document.getElementById('material-label').dataset.i18n);
  materialButton.setAttribute('aria-pressed', String(wireframe));
}
window.addEventListener('portfolio:languagechange', () => {syncMotion();syncMaterial();});
syncMotion();
syncMaterial();

try {
  const renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: true, powerPreference: 'low-power'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, .1, 100);
  camera.position.set(0, 0, 7.5);
  const sculpture = new THREE.Group();
  scene.add(sculpture);

  const material = new THREE.ShaderMaterial({
    uniforms: {uAccent: {value: new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue('--accent').trim())}},
    vertexShader: `varying vec3 vNormal; varying vec3 vPosition;
      void main(){ vec4 p=modelViewMatrix*vec4(position,1.);vPosition=p.xyz;vNormal=normalize(normalMatrix*normal);gl_Position=projectionMatrix*p; }`,
    fragmentShader: `varying vec3 vNormal;varying vec3 vPosition;uniform vec3 uAccent;
      void main(){
        vec3 n=normalize(vNormal);vec3 v=normalize(-vPosition);vec3 r=reflect(-v,n);
        float f=pow(1.-max(dot(n,v),0.),2.2);
        float band=pow(max(0.,sin(r.y*5.5+r.x*2.5)),12.);
        float soft=pow(max(dot(n,normalize(vec3(-2.,3.,4.))),0.),2.);
        float strip=pow(max(0.,1.-abs(r.x*.6+r.y*.8-.3)),35.);
        vec3 base=vec3(.065)+uAccent*.025+vec3(.35)*soft;
        base+=vec3(.86)*band*.9+vec3(.9)*strip;
        base+=uAccent*f*.45;
        float green=pow(max(dot(n,normalize(vec3(3.,-2.,1.))),0.),5.);
        base+=uAccent*green*.55;
        gl_FragColor=vec4(base,1.);
      }`
  });
  const geometry = new THREE.TorusKnotGeometry(1.18, .28, 240, 48, 2, 3);
  const knot = new THREE.Mesh(geometry, material);
  knot.rotation.set(.35, -.5, -.2);
  sculpture.add(knot);
  const edgeMaterial = new THREE.MeshBasicMaterial({color:0xb7ea6b,wireframe:true,transparent:true,opacity:.35});

  const orbitMaterial = new THREE.LineBasicMaterial({color:0x74805e,transparent:true,opacity:.28});
  for(let i=0;i<2;i++){
    const points=[];
    for(let j=0;j<=160;j++){const a=j/160*Math.PI*2;points.push(new THREE.Vector3(Math.cos(a)*2.05,Math.sin(a)*2.05,0));}
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),orbitMaterial);
    line.rotation.set(i===0?1.1:.45,i===0?.2:1.15,i===0?.3:-.2);
    sculpture.add(line);
  }
  const pointer=new THREE.Vector2();let t=0;let last=0;
  const resize=()=>{const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();draw();};
  function draw(){sculpture.rotation.x=pointer.y*.13;sculpture.rotation.y=pointer.x*.22;renderer.render(scene,camera);}
  function syncSceneTheme(){
    const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    material.uniforms.uAccent.value.set(accent);edgeMaterial.color.set(accent);orbitMaterial.color.set(accent);
    draw();
  }
  window.addEventListener('portfolio:themechange',syncSceneTheme);
  syncSceneTheme();
  function tick(now){frame=0;if(!visible||document.hidden||paused)return;const delta=Math.min((now-last)/1000,.05);last=now;t+=delta;knot.rotation.y=-.5+t*.17;knot.rotation.z=-.2+Math.sin(t*.25)*.15;draw();frame=requestAnimationFrame(tick);}
  function resume(){if(frame)cancelAnimationFrame(frame);frame=0;last=performance.now();if(!paused&&visible&&!document.hidden)frame=requestAnimationFrame(tick);else draw();}
  host.addEventListener('pointermove',e=>{if(reduced.matches)return;const r=host.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,(e.clientY-r.top)/r.height*2-1);if(paused)draw();});
  host.addEventListener('pointerleave',()=>{pointer.set(0,0);if(paused)draw();});
  motionButton.addEventListener('click',()=>{paused=!paused;syncMotion();resume();});
  materialButton.addEventListener('click',()=>{wireframe=!wireframe;knot.material=wireframe?edgeMaterial:material;syncMaterial();draw();});
  reduced.addEventListener('change',()=>{paused=reduced.matches;pointer.set(0,0);syncMotion();resume();});
  document.addEventListener('visibilitychange',resume);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;resume();},{rootMargin:'100px'}).observe(host);
  new ResizeObserver(resize).observe(host);
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();if(frame)cancelAnimationFrame(frame);host.classList.remove('ready');motionButton.disabled=true;materialButton.disabled=true;});
  canvas.addEventListener('webglcontextrestored',()=>{host.classList.add('ready');motionButton.disabled=false;materialButton.disabled=false;resume();});
  host.classList.add('ready');resize();resume();
} catch(error) {
  motionButton.hidden=true;materialButton.hidden=true;
  host.dataset.i18nAria='codeSymbol';
  host.setAttribute('aria-label',t('codeSymbol'));
}
