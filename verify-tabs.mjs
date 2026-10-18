import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {views,posts,routeFromUrl,initializeTabs} from './src/tabs.js';
assert.deepEqual(routeFromUrl('https://example.test/'),{view:'home',post:null});
assert.deepEqual(routeFromUrl('https://example.test/?view=portfolio'),{view:'home',post:null});
assert.deepEqual(routeFromUrl('https://example.test/#proyectos'),{view:'projects',post:null});
assert.deepEqual(routeFromUrl('https://example.test/#contacto'),{view:'about',post:null});
assert.deepEqual(routeFromUrl('https://example.test/?view=blog&post=api&lang=ja'),{view:'blog',post:'api'});
assert.deepEqual(routeFromUrl('https://example.test/?view=blog&post=invalid'),{view:'blog',post:null});
assert.deepEqual(routeFromUrl('https://example.test/?view=home&post=api'),{view:'home',post:null});
assert.deepEqual(routeFromUrl('https://example.test/#blog'),{view:'blog',post:null});
class Element extends EventTarget {
 constructor(dataset={},attributes={}){super();this.dataset=dataset;this.attributes=attributes;this.focused=false;this.hidden=false;}
 getAttribute(key){return this.attributes[key];}setAttribute(key,value){this.attributes[key]=value;}focus(){this.focused=true;}
}
const buttons=views.map(view=>new Element({view},{'aria-controls':`panel-${view}`}));
const elements={};for(const view of views)elements['panel-'+view]=new Element();
elements['blog-index']=new Element();elements['blog-heading']=new Element();
for(const slug of Object.keys(posts)){elements['article-'+slug]=new Element();elements[`article-${slug}-title`]=new Element();}
const previews=Object.keys(posts).map(post=>new Element({post}));
const back=new Element(),home=new Element(),top=new Element(),cta=new Element({navigateView:'projects'});
const meta={setAttribute(key,value){this[key]=value;}};
globalThis.document={documentElement:{dir:'ltr'},title:'',
 querySelectorAll:selector=>({'[role="tab"][data-view]':buttons,'[data-post]':previews,'[data-blog-back]':[back],'[data-navigate-view]':[cta],'[data-portfolio-home]':[home],'[data-back-top]':[top]})[selector]||[],
 getElementById:id=>elements[id],querySelector:()=>meta};
globalThis.window=Object.assign(new EventTarget(),{location:{href:'https://example.test/?lang=fr&view=blog&post=api'},scrollTo(value){this.lastScroll=value;},matchMedia:()=>({matches:true})});
globalThis.history={pushState(_,__,url){window.location.href=String(url);}};
initializeTabs();
function assertActive(view,post=null){
 for(const button of buttons){const selected=button.dataset.view===view;assert.equal(elements['panel-'+button.dataset.view].hidden,!selected);assert.equal(button.attributes['aria-selected'],String(selected));assert.equal(button.tabIndex,selected?0:-1);}
 assert.equal(elements['blog-index'].hidden,Boolean(post));
 for(const slug of Object.keys(posts))assert.equal(elements['article-'+slug].hidden,slug!==post);
}
const click=element=>element.dispatchEvent(new Event('click',{cancelable:true}));
const key=(element,key)=>{const event=new Event('keydown',{cancelable:true});Object.defineProperty(event,'key',{value:key});element.dispatchEvent(event);};
assertActive('blog','api');assert(document.title.includes('modelos'));
click(back);assertActive('blog');assert.equal(elements['blog-heading'].focused,true);assert(!new URL(window.location.href).searchParams.has('post'));
for(const preview of previews){click(preview);assertActive('blog',preview.dataset.post);assert.equal(elements[`article-${preview.dataset.post}-title`].focused,true);assert.equal(new URL(window.location.href).searchParams.get('lang'),'fr');click(back);}
click(buttons[0]);assertActive('home');click(cta);assertActive('projects');
key(buttons[1],'ArrowRight');assertActive('blog');assert.equal(buttons[2].focused,true);
key(buttons[2],'End');assertActive('about');key(buttons[3],'Home');assertActive('home');
document.documentElement.dir='rtl';key(buttons[0],'ArrowRight');assertActive('about');
window.location.href='https://example.test/?lang=fr&view=blog&post=desktop';window.dispatchEvent(new Event('popstate'));assertActive('blog','desktop');
const modified=new Event('click',{cancelable:true});Object.defineProperty(modified,'ctrlKey',{value:true});previews[0].dispatchEvent(modified);assertActive('blog','desktop');assert.equal(modified.defaultPrevented,false);
assert(previews[0].href.includes('lang=fr'));assert(previews[0].href.includes('post=api'));
click(home);assertActive('home');
window.location.href='https://example.test/?view=about';window.dispatchEvent(new Event('popstate'));assertActive('about');
const html=readFileSync(new URL('./index.html',import.meta.url),'utf8');
for(const view of views)assert(html.includes(`id="panel-${view}" role="tabpanel" aria-labelledby="tab-${view}"`));
assert(!html.includes('data-back-top'));
assert(!html.includes('id="webgl"'));
assert(!html.includes('class="blog-post"'),'Blog readers must be separate views, not expanded list items');
console.log('Verified four independent tabs, legacy links, three article routes, back-to-list focus, keyboard navigation, history, language-preserving links, and modified clicks.');
