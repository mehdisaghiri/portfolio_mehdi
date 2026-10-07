const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
if(!reduceMotion&&matchMedia('(pointer:fine)').matches){document.querySelectorAll('[data-tilt]').forEach(card=>{card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(1100px) rotateX(${-y*2.5}deg) rotateY(${x*2.5}deg) translateY(-3px)`});card.addEventListener('pointerleave',()=>card.style.transform='')})}
