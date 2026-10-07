import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const canvas = document.querySelector('#hero-canvas');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, .1, 100);
camera.position.set(0, 0, 7);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
renderer.setSize(innerWidth, innerHeight);

const group = new THREE.Group();
group.position.x = innerWidth > 900 ? 2.45 : .9;
scene.add(group);
const geometry = new THREE.IcosahedronGeometry(1.72, 2);
const material = new THREE.MeshBasicMaterial({ color: 0x4ee7d1, wireframe: true, transparent: true, opacity: .28 });
const core = new THREE.Mesh(geometry, material);
group.add(core);
const pointsGeo = new THREE.BufferGeometry();
const positions=[];
for(let i=0;i<900;i++){const r=2.3+Math.random()*2.7;const a=Math.random()*Math.PI*2;const z=(Math.random()-.5)*5;positions.push(Math.cos(a)*r,Math.sin(a)*r,z)}
pointsGeo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
const points=new THREE.Points(pointsGeo,new THREE.PointsMaterial({color:0x5b8cff,size:.018,transparent:true,opacity:.48}));
group.add(points);
const ringMat=new THREE.MeshBasicMaterial({color:0x5b8cff,wireframe:true,transparent:true,opacity:.17});
[2.1,2.55,3.05].forEach((r,i)=>{const ring=new THREE.Mesh(new THREE.TorusGeometry(r,.005,3,160),ringMat);ring.rotation.set(i*.55,.7+i*.3,.2);group.add(ring)});
let mouseX=0,mouseY=0;
addEventListener('pointermove',e=>{mouseX=(e.clientX/innerWidth-.5)*.5;mouseY=(e.clientY/innerHeight-.5)*.5});
function animate(t){group.rotation.y+=(mouseX-group.rotation.y)*.015;group.rotation.x+=(-mouseY-group.rotation.x)*.015;if(!reduceMotion){core.rotation.y=t*.00013;core.rotation.z=t*.00008;points.rotation.z=t*.000018}renderer.render(scene,camera);requestAnimationFrame(animate)}
requestAnimationFrame(animate);
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);group.position.x=innerWidth>900?2.45:.9});
