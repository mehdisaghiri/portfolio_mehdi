const dialog=document.querySelector('#studio-dialog');
const title=document.querySelector('#studio-dialog-title');
const description=document.querySelector('#studio-dialog-description');
const content=document.querySelector('#studio-dialog-content');
const closeButton=dialog.querySelector('.studio-dialog-close');
const panels={
  projects:{title:'My projects',description:'Selected work across enterprise platforms, analytics and product engineering.',selector:'#projects .project-copy'},
  skills:{title:'My toolkit',description:'The platforms, languages and tools I use to turn ideas into useful systems.',selector:'#skills .skill-block'},
  about:{title:'My story',description:'Mohamed El Mehdi Saghiri · Fès, Morocco',selector:'#about .about-copy'}
};
let opener;
let pagePosition={x:0,y:0};

export function openStudioPanel(key,trigger=document.querySelector(`[data-studio-panel="${key}"]`)){
  const panel=panels[key];
  if(!panel||dialog.open)return;
  opener=trigger;
  pagePosition={x:window.scrollX,y:window.scrollY};
  title.textContent=panel.title;
  description.textContent=panel.description;
  content.className=`studio-dialog-content studio-dialog-${key}`;
  content.replaceChildren();
  if(key==='about'){
    const portrait=document.querySelector('.portrait-card img').cloneNode(true);
    portrait.className='studio-dialog-portrait';
    portrait.removeAttribute('fetchpriority');
    content.append(portrait);
  }
  // Reuse the section content so the pop-ups always reflect the portfolio.
  document.querySelectorAll(panel.selector).forEach(source=>{
    const copy=source.cloneNode(true);
    copy.classList.remove('reveal');
    copy.removeAttribute('data-tilt');
    content.append(copy);
  });
  dialog.showModal();
  document.documentElement.classList.add('studio-modal-open');
  content.scrollTop=0;
  closeButton.focus({preventScroll:true});
  window.scrollTo({left:pagePosition.x,top:pagePosition.y,behavior:'instant'});
}

document.querySelectorAll('[data-studio-panel]').forEach(button=>{
  button.addEventListener('click',()=>openStudioPanel(button.dataset.studioPanel,button));
});
closeButton.addEventListener('click',()=>dialog.close());
let pressedBackdrop=false;
function isBackdrop(event){
  const bounds=dialog.getBoundingClientRect();
  return event.target===dialog&&(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom);
}
dialog.addEventListener('pointerdown',event=>{pressedBackdrop=isBackdrop(event)});
dialog.addEventListener('click',event=>{if(pressedBackdrop&&isBackdrop(event))dialog.close();pressedBackdrop=false});
dialog.addEventListener('close',()=>{
  document.documentElement.classList.remove('studio-modal-open');
  opener?.focus({preventScroll:true});
  window.scrollTo({left:pagePosition.x,top:pagePosition.y,behavior:'instant'});
});
