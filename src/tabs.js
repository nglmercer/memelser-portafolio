import {t} from './i18n.js';

export const views = ['home','projects','blog','about'];
export const posts = {api:'blogApiTitle',live:'blogLiveTitle',desktop:'blogDesktopTitle'};
const excerpts = {api:'blogApiExcerpt',live:'blogLiveExcerpt',desktop:'blogDesktopExcerpt'};
export function routeFromUrl(value) {
  const url = new URL(value);let view = url.searchParams.get('view');
  if(view === 'portfolio') view = 'home';
  if(!views.includes(view)) {
    if(url.hash === '#blog' || url.hash.startsWith('#blog-') || Object.hasOwn(posts,url.searchParams.get('post'))) view='blog';
    else if(url.hash === '#proyectos') view='projects';
    else if(['#sobre','#contacto'].includes(url.hash)) view='about';
    else view='home';
  }
  const candidate=url.searchParams.get('post');
  return {view,post:view === 'blog' && Object.hasOwn(posts,candidate) ? candidate : null};
}
export function viewFromUrl(value) {return routeFromUrl(value).view;}

export function initializeTabs() {
  const buttons = [...document.querySelectorAll('[role="tab"][data-view]')];
  let route = routeFromUrl(window.location.href);
  const urlFor = (view,post=null) => {
    const url=new URL(window.location.href);url.searchParams.set('view',view);url.hash='';
    if(post) url.searchParams.set('post',post);else url.searchParams.delete('post');
    return url;
  };
  function updateLinks() {
    document.querySelectorAll('[data-post]').forEach(link=>{link.href=String(urlFor('blog',link.dataset.post));});
    document.querySelectorAll('[data-blog-back]').forEach(link=>{link.href=String(urlFor('blog'));});
    document.querySelectorAll('[data-navigate-view]').forEach(link=>{link.href=String(urlFor(link.dataset.navigateView));});
  }
  function updateMetadata() {
    document.title = route.post ? `${t(posts[route.post])} | memelser` : route.view === 'home' ? t('metaTitle') : `${t(route.view)} | memelser`;
    const description = route.post ? excerpts[route.post] : route.view === 'blog' ? 'metaBlogDescription' : 'metaDescription';
    document.querySelector('meta[name="description"]').setAttribute('content',t(description));
    updateLinks();
  }
  function activate(view,{post=null,push=false,focus=false,focusContent=false,scroll=false}={}) {
    route={view:views.includes(view)?view:'home',post:view==='blog'&&Object.hasOwn(posts,post)?post:null};
    for(const button of buttons) {
      const selected=button.dataset.view===route.view;
      button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1;
      document.getElementById(button.getAttribute('aria-controls')).hidden=!selected;
      if(selected&&focus) button.focus();
    }
    document.getElementById('blog-index').hidden=Boolean(route.post);
    for(const slug of Object.keys(posts)) document.getElementById('article-'+slug).hidden=route.post!==slug;
    if(push) history.pushState(null,'',urlFor(route.view,route.post));
    updateMetadata();
    if(scroll) window.scrollTo({top:0,behavior:'instant'});
    if(focusContent) document.getElementById(route.post?`article-${route.post}-title`:'blog-heading').focus();
  }
  buttons.forEach((button,index)=>{
    button.addEventListener('click',()=>activate(button.dataset.view,{push:true,scroll:true}));
    button.addEventListener('keydown',event=>{
      let next;const rtl=document.documentElement.dir==='rtl';
      if(event.key==='ArrowRight') next=(index+(rtl?-1:1)+buttons.length)%buttons.length;
      if(event.key==='ArrowLeft') next=(index+(rtl?1:-1)+buttons.length)%buttons.length;
      if(event.key==='Home') next=0;if(event.key==='End') next=buttons.length-1;
      if(next!==undefined){event.preventDefault();activate(buttons[next].dataset.view,{push:true,focus:true,scroll:true});}
    });
  });
  const intercept = (link,callback) => link.addEventListener('click',event=>{
    if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||(event.button!==undefined&&event.button!==0)) return;
    event.preventDefault();callback();
  });
  document.querySelectorAll('[data-post]').forEach(link=>intercept(link,()=>activate('blog',{post:link.dataset.post,push:true,scroll:true,focusContent:true})));
  document.querySelectorAll('[data-blog-back]').forEach(link=>intercept(link,()=>activate('blog',{push:true,scroll:true,focusContent:true})));
  document.querySelectorAll('[data-navigate-view]').forEach(link=>intercept(link,()=>activate(link.dataset.navigateView,{push:true,scroll:true})));
  document.querySelectorAll('[data-portfolio-home]').forEach(link=>intercept(link,()=>activate('home',{push:true,scroll:true})));
  const restore=()=>{const next=routeFromUrl(window.location.href);activate(next.view,{post:next.post});};
  window.addEventListener('popstate',restore);window.addEventListener('hashchange',restore);
  window.addEventListener('portfolio:languagechange',updateMetadata);
  activate(route.view,{post:route.post});
}
if(typeof document!=='undefined') initializeTabs();
