const canvas = document.querySelector('#hero-canvas');
const hero = document.querySelector('.hero');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Keep the portrait and all content usable if WebGL or the library is unavailable.
import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js').then(THREE => {
  const renderer = new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45,1,.1,100);
  camera.position.z=10;
  const positions=[];
  let seed=73;
  const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646};
  for(let i=0;i<600;i++)positions.push((random()-.5)*28,(random()-.5)*16,-2-random()*12);
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  const stars=new THREE.Points(geo,new THREE.PointsMaterial({color:0xcfb9fc,size:.027,transparent:true,opacity:.65}));
  scene.add(stars);
  const eclipse=new THREE.Group();
  const color=0xac5cff;
  [1.22,1.3,1.43].forEach((r,i)=>{
    const ring=new THREE.Mesh(new THREE.TorusGeometry(r,.02-i*.005,10,160),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.8-i*.22}));
    eclipse.add(ring);
  });
  const glow=new THREE.Mesh(new THREE.TorusGeometry(1.27,.11,16,160),new THREE.MeshBasicMaterial({color:0x8735e0,transparent:true,opacity:.12,blending:THREE.AdditiveBlending,depthWrite:false}));
  eclipse.add(glow);scene.add(eclipse);
  let pointerX=0,pointerY=0,visible=true,last=0;
  const resize=()=>{const w=hero.clientWidth,h=hero.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();eclipse.position.set(0,4.8,-1);renderer.render(scene,camera)};
  new ResizeObserver(resize).observe(hero);resize();
  hero.addEventListener('pointermove',e=>{if(reduceMotion)return;const r=hero.getBoundingClientRect();pointerX=(e.clientX-r.left)/r.width-.5;pointerY=(e.clientY-r.top)/r.height-.5});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting},{threshold:0}).observe(hero);
  function frame(t){requestAnimationFrame(frame);if(!visible||document.hidden||t-last<33)return;last=t;if(!reduceMotion){stars.rotation.y+=(pointerX*.025-stars.rotation.y)*.04;stars.rotation.x+=(pointerY*.02-stars.rotation.x)*.04;eclipse.rotation.z=t*.00003;glow.material.opacity=.12+Math.sin(t*.001)*.035}renderer.render(scene,camera)}
  if(!reduceMotion)requestAnimationFrame(frame);
  document.documentElement.dataset.hero3d='ready';
}).catch(()=>{document.documentElement.dataset.hero3d='fallback'});
