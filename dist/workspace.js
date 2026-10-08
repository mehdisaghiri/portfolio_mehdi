import {openStudioPanel} from './studio-dialog.js';

const viewport=document.querySelector('#studio-viewport');
const canvas=document.querySelector('#studio-canvas');
const toggle=document.querySelector('#lights-toggle');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js').then(THREE=>{
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.3;
  const scene=new THREE.Scene();
  scene.fog=new THREE.FogExp2(0x0b0714,.035);
  const camera=new THREE.PerspectiveCamera(38,1,.1,80);
  const target=new THREE.Vector3(0,1.35,0);
  const world=new THREE.Group();scene.add(world);
  const materials={};
  const material=(name,color,options={})=>materials[name]||(materials[name]=new THREE.MeshStandardMaterial({color,roughness:.65,metalness:.12,...options}));
  const dark=material('dark',0x151223,{roughness:.45,metalness:.45});
  const desk=material('desk',0x44314f,{roughness:.48});
  const lilac=material('lilac',0xa588c8);
  const purple=material('purple',0x653bb2);
  const pink=material('pink',0xca77a5);
  const mint=material('mint',0x83c5b2);
  const warm=material('warm',0xead7ba);
  const black=material('black',0x090713);
  const cyanGlow=material('cyanGlow',0x9be4ff,{emissive:0x6dbedf,emissiveIntensity:1.8});
  const purpleGlow=material('purpleGlow',0xc394ff,{emissive:0xa45ff3,emissiveIntensity:1.6});
  const lampGlow=material('lampGlow',0xffd89c,{emissive:0xffc276,emissiveIntensity:2.2});
  function box(w,h,d,mat,x,y,z,parent=world){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
  function cylinder(top,bottom,height,mat,x,y,z,parent=world,segments=28){const o=new THREE.Mesh(new THREE.CylinderGeometry(top,bottom,height,segments),mat);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
  function sphere(r,mat,x,y,z,parent=world){const o=new THREE.Mesh(new THREE.SphereGeometry(r,24,16),mat);o.position.set(x,y,z);o.castShadow=true;parent.add(o);return o}
  function tube(a,b,r,mat,parent=world){const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...b),delta=bv.clone().sub(av);const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,delta.length(),12),mat);mesh.position.copy(av.add(bv).multiplyScalar(.5));mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());mesh.castShadow=true;parent.add(mesh);return mesh}

  // A small, original workstation scene built entirely as real Three.js geometry.
  box(8.6,.12,6.2,material('floor',0x151025,{roughness:1}),0,-.06,0);
  const grid=new THREE.GridHelper(8.6,20,0x413157,0x2b223c);grid.position.y=.003;world.add(grid);
  box(8.6,4.4,.12,material('wall',0x171027),0,2.1,-2.8);
  box(.12,4.4,5.65,material('wallSide',0x130e21),-4.25,2.1,0);
  box(7.9,.025,.025,purpleGlow,0,.12,-2.7);
  box(.025,.025,5.3,purpleGlow,-4.13,.12,0);

  // Desk: floating bevel-like top, inset surface and slender metal legs.
  box(5.45,.19,2.2,dark,0,1.47,0);
  box(5.4,.095,2.15,desk,0,1.6,0);
  box(5.1,.022,.035,purpleGlow,0,1.49,1.11);
  [[-2.3,-.82],[-2.3,.82],[2.3,-.82],[2.3,.82]].forEach(([x,z])=>box(.1,1.4,.1,dark,x,.73,z));
  box(4.6,.08,.08,dark,0,.35,-.82);

  // Textures are actual interface content rather than project screenshots.
  function screenTexture(kind){
    const c=document.createElement('canvas');c.width=1024;c.height=640;
    const ctx=c.getContext('2d');ctx.fillStyle='#10101f';ctx.fillRect(0,0,1024,640);
    ctx.fillStyle='#18162b';ctx.fillRect(0,0,1024,58);
    ['#e4789f','#e9b76f','#8bcbb5'].forEach((col,i)=>{ctx.fillStyle=col;ctx.beginPath();ctx.arc(25+i*23,29,6,0,Math.PI*2);ctx.fill()});
    ctx.fillStyle='#b7a4d4';ctx.font='18px monospace';ctx.fillText(kind==='code'?'mehdi / studio.ts':'data / insights',110,35);
    if(kind==='code'){
      ctx.fillStyle='#1b1730';ctx.fillRect(0,58,180,582);
      ctx.font='18px monospace';[['EXPLORER','#b194d0'],['portfolio','#dfc4ff'],['  projects','#8abfc9'],['  skills','#8abfc9'],['  servicenow','#8abfc9'],['  data','#8abfc9'],['  about','#8abfc9']].forEach(([s,col],i)=>{ctx.fillStyle=col;ctx.fillText(s,20,99+i*39)});
      const lines=[['const engineer = {','#bc91ee'],['  name: "Mehdi Saghiri",','#acd1e8'],['  location: "Fès, Morocco",','#cdb279'],['  focus: [','#bc91ee'],['    "ServiceNow",','#9aceb7'],['    "Data Engineering",','#9aceb7'],['    "Full Stack"','#9aceb7'],['  ],','#bc91ee'],['  mindset: "Keep learning"','#cdb279'],['};','#bc91ee'],['','#bc91ee'],['buildSomethingUseful();','#ddb3f0']];
      ctx.font='24px monospace';lines.forEach(([s,col],i)=>{ctx.fillStyle='#544966';ctx.font='18px monospace';ctx.fillText(String(i+1).padStart(2,' '),201,112+i*39);ctx.fillStyle=col;ctx.font='24px monospace';ctx.fillText(s,255,112+i*39)});
    }else{
      ctx.fillStyle='#eadcff';ctx.font='bold 36px sans-serif';ctx.fillText('From data to decisions.',50,120);
      ctx.font='22px sans-serif';ctx.fillStyle='#ad95c3';ctx.fillText('SQL  /  ETL  /  POWER BI',52,157);
      const heights=[90,140,110,190,170,255,215,285];
      heights.forEach((h,i)=>{const grad=ctx.createLinearGradient(0,560-h,0,560);grad.addColorStop(0,i%2?'#b681f6':'#71c9ce');grad.addColorStop(1,'#29203d');ctx.fillStyle=grad;ctx.fillRect(55+i*63,560-h,43,h)});
      ctx.strokeStyle='#463651';ctx.beginPath();ctx.moveTo(45,562);ctx.lineTo(595,562);ctx.stroke();
      ctx.fillStyle='#251b36';ctx.fillRect(665,220,290,335);
      ctx.fillStyle='#cfa9ff';ctx.font='20px monospace';['BRONZE','  ↓','SILVER','  ↓','GOLD'].forEach((s,i)=>ctx.fillText(s,730,280+i*48));
    }
    const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),4);return texture;
  }
  const clickable=[];
  function monitor(x,y,z,w,h,rotation,kind){const g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=rotation;world.add(g);box(w,h,.13,dark,0,0,0,g);box(w-.085,h-.085,.018,new THREE.MeshBasicMaterial({map:screenTexture(kind)}),0,0,.078,g);box(.085,.46,.08,dark,0,-h/2-.19,-.015,g);box(.56,.045,.36,dark,0,-h/2-.44,.03,g);box(w,.018,.016,kind==='code'?purpleGlow:cyanGlow,0,-h/2+.01,.073,g);g.traverse(o=>{if(o.isMesh){o.userData.href=kind==='code'?'#projects':'#skills';clickable.push(o)}});return g}
  monitor(-.23,2.64,-.61,2.45,1.47,0,'code');
  monitor(-1.98,2.37,-.32,1.02,1.44,.27,'data');

  // Keyboard with individually lit keys and a mouse on a desk mat.
  box(1.46,.045,.51,black,-.2,1.685,.5);
  for(let row=0;row<4;row++)for(let col=0;col<14;col++)box(.075,.016,.068,(row+col)%5===0?purpleGlow:(row+col)%7===0?cyanGlow:lilac,-.83+col*.096,1.722,.34+row*.095);
  box(.49,.022,.055,lilac,-.16,1.72,.75);
  box(.74,.014,.7,material('mat',0x281a40),1.0,1.66,.5);
  const mouse=sphere(.13,lilac,1.04,1.714,.47);mouse.scale.set(.65,.43,1.05);
  box(.02,.012,.055,purpleGlow,1.04,1.78,.43);
  // Compact speakers.
  [-1.55,1.4].forEach(x=>{box(.31,.43,.3,dark,x,1.86,-.28);const speaker=cylinder(.095,.095,.018,black,x,1.86,-.117);speaker.rotation.x=Math.PI/2;const rim=new THREE.Mesh(new THREE.TorusGeometry(.093,.012,8,30),purpleGlow);rim.position.set(x,1.86,-.099);world.add(rim)});

  // Warm desk lamp: a real point light that responds to the control.
  cylinder(.22,.25,.05,dark,2.05,1.685,.05);
  tube([2.05,1.71,.05],[2.05,2.25,.05],.036,lilac);
  tube([2.05,2.25,.05],[1.86,2.65,.05],.036,lilac);
  const shade=cylinder(.08,.29,.23,warm,1.86,2.68,.05);
  cylinder(.23,.23,.018,lampGlow,1.86,2.57,.05);
  const bulb=sphere(.075,lampGlow,1.86,2.55,.05);
  const lampLight=new THREE.PointLight(0xffca8b,9,5,2);lampLight.position.set(1.86,2.52,.05);world.add(lampLight);

  // Books and a plant make this an inhabited studio rather than a wireframe.
  box(.59,.08,.45,purple,-1.87,1.71,.58);box(.56,.065,.43,lilac,-1.83,1.79,.56);box(.5,.06,.4,pink,-1.88,1.86,.58);
  cylinder(.15,.13,.25,material('pot',0xc9a2c4),-2.33,1.78,-.68);
  cylinder(.12,.12,.013,material('soil',0x211328),-2.33,1.912,-.68);
  const leafMat=material('leaves',0x588b81,{roughness:.9});
  for(let i=0;i<7;i++){const a=i*2.4;const leaf=sphere(.15,leafMat,-2.33+Math.cos(a)*.085,2.03+i%3*.09,-.68+Math.sin(a)*.07);leaf.scale.set(.45,1.8,.8);leaf.rotation.z=Math.cos(a)*.55;leaf.rotation.x=Math.sin(a)*.4}
  // Mug and steam-like glass orb accent.
  cylinder(.105,.092,.19,warm,.92,1.78,-.55);cylinder(.086,.086,.01,material('coffee',0x26151d),.92,1.88,-.55);
  const handle=new THREE.Mesh(new THREE.TorusGeometry(.075,.019,10,24),warm);handle.position.set(1.048,1.78,-.55);world.add(handle);

  const shelf=new THREE.Group();shelf.position.set(2.95,0,-1.56);world.add(shelf);
  [0.32,1.05,1.78,2.51].forEach(y=>box(1.08,.07,.5,desk,0,y,0,shelf));
  [-.52,.52].forEach(x=>box(.045,2.7,.5,dark,x,1.4,0,shelf));
  const colors=[purple,pink,lilac,mint,warm];
  [0.64,1.37,2.1].forEach((y,row)=>{for(let i=0;i<7;i++){const height=.34+(i%3)*.08;const book=box(.09,height,.29,colors[(i+row)%5],-.4+i*.12,y-.1+height/2,.025,shelf);book.userData.href='#about';clickable.push(book);box(.074,.014,.006,warm,-.4+i*.12,y+.08,.174,shelf)}});
  sphere(.17,purpleGlow,2.95,2.84,-1.56);

  // Floating wall cards use real platform and data labels.
  function wallCard(text,x,y){const c=document.createElement('canvas');c.width=512;c.height=180;const ctx=c.getContext('2d');ctx.fillStyle='#241633';ctx.fillRect(0,0,512,180);ctx.strokeStyle='#a471d6';ctx.lineWidth=5;ctx.strokeRect(4,4,504,172);ctx.fillStyle='#d6b7fb';ctx.font='bold 31px monospace';ctx.fillText(text,33,105);const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;box(1.37,.48,.035,new THREE.MeshBasicMaterial({map:tex}),x,y,-2.71)}
  wallCard('BUILD. LEARN.',-.95,3.72);wallCard('REPEAT.',.75,3.72);

  // Low lounge stool at the front of the workspace.
  cylinder(.44,.4,.2,purple,.15,.47,1.89);
  cylinder(.34,.29,.26,dark,.15,.27,1.89);
  cylinder(.38,.41,.06,dark,.15,.08,1.89);
  const cushion=sphere(.43,material('cushion',0x573887,{roughness:.95}),.15,.56,1.89);cushion.scale.set(1,.23,1);

  const ambient=new THREE.HemisphereLight(0xdcc4ff,0x29183d,2.05);scene.add(ambient);
  const key=new THREE.DirectionalLight(0xe5d1ff,3.1);key.position.set(-3,7,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-5;key.shadow.camera.right=5;key.shadow.camera.top=5;key.shadow.camera.bottom=-5;key.shadow.normalBias=.035;scene.add(key);
  const rim=new THREE.PointLight(0xa855ff,18,9,2);rim.position.set(-2,2.8,-1.8);scene.add(rim);
  const fill=new THREE.PointLight(0x6fd4ff,8,7,2);fill.position.set(1.5,2.4,1.5);scene.add(fill);

  const anchors=[['hotspot-projects',new THREE.Vector3(-.24,3.23,-.52)],['hotspot-skills',new THREE.Vector3(-1.98,2.95,-.18)],['hotspot-about',new THREE.Vector3(2.95,2.65,-1.32)]];
  let mx=0,my=0,visible=false,last=0,lightsOn=true;
  const raycaster=new THREE.Raycaster();
  const pointer=new THREE.Vector2();
  const project=new THREE.Vector3();
  function placeMarkers(){anchors.forEach(([id,point])=>{project.copy(point).applyMatrix4(world.matrixWorld).project(camera);const el=document.getElementById(id);el.style.left=`${(project.x*.5+.5)*100}%`;el.style.top=`${(-project.y*.5+.5)*100}%`})}
  function render(){world.updateMatrixWorld();renderer.render(scene,camera);placeMarkers()}
  function resize(){const w=viewport.clientWidth,h=viewport.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;const compact=w<650;camera.fov=compact?43:38;const s=compact?1.29:1;camera.position.set(6.2*s,5.5*s,8.9*s);camera.lookAt(target);camera.updateProjectionMatrix();render()}
  new ResizeObserver(resize).observe(viewport);resize();
  viewport.addEventListener('pointermove',e=>{if(reduced)return;const r=viewport.getBoundingClientRect();mx=(e.clientX-r.left)/r.width-.5;my=(e.clientY-r.top)/r.height-.5});
  viewport.addEventListener('pointerleave',()=>{mx=0;my=0});
  canvas.addEventListener('click',e=>{const r=canvas.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height)*2+1);raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(clickable,false)[0];if(hit?.object.userData.href){openStudioPanel(hit.object.userData.href.slice(1))}});
  toggle.addEventListener('click',()=>{lightsOn=!lightsOn;toggle.setAttribute('aria-pressed',String(lightsOn));toggle.innerHTML=lightsOn?'<span>☀</span> Lights on':'<span>☾</span> Night mode';ambient.intensity=lightsOn?2.05:.6;key.intensity=lightsOn?3.1:.6;lampLight.intensity=lightsOn?9:0;lampGlow.emissiveIntensity=lightsOn?2.2:.12;rim.intensity=lightsOn?18:23;fill.intensity=lightsOn?8:4;renderer.toneMappingExposure=lightsOn?1.3:1.1;render()});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)render()},{rootMargin:'80px',threshold:0}).observe(viewport);
  function frame(t){requestAnimationFrame(frame);if(!visible||document.hidden||t-last<33)return;last=t;if(!reduced){world.rotation.y+=(mx*.1-world.rotation.y)*.04;world.rotation.x+=(-my*.025-world.rotation.x)*.04;bulb.scale.setScalar(1+Math.sin(t*.0015)*.025)}render()}
  if(!reduced)requestAnimationFrame(frame);
  viewport.classList.add('ready');document.documentElement.dataset.studio3d='ready';
}).catch(()=>{
  document.documentElement.dataset.studio3d='fallback';
  toggle.disabled=true;
  toggle.setAttribute('aria-label','Lighting control unavailable without WebGL');
});
