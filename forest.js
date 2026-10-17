import * as T from './vendor/three.module.min.js';
const region=document.querySelector('#work'),host=region.querySelector('.tree-scene');
try{await build()}catch(error){console.warn('The 3D garden could not start; the project tree and list remain available.',error)}
async function build(){
 const projects=await fetch('projects.json').then(r=>r.json());
 if(!host.querySelector('.perch'))await new Promise(resolve=>{const observer=new MutationObserver(()=>{if(host.querySelector('.perch')){observer.disconnect();resolve()}});observer.observe(host,{childList:true})});
 const renderer=new T.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;renderer.domElement.className='forest-canvas';renderer.domElement.setAttribute('aria-hidden','true');host.prepend(renderer.domElement);
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(34,1,.1,60),world=new T.Group();scene.add(world);world.position.x=innerWidth>700?-1.3:0;
 scene.add(new T.HemisphereLight(0xfff9e3,0x4c6954,2.7));const sun=new T.DirectionalLight(0xffe5b2,4.2);sun.position.set(-4,9,6);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-7,right:7,top:9,bottom:-4,near:.1,far:30});sun.shadow.normalBias=.025;scene.add(sun);const rim=new T.DirectionalLight(0xc2e3ef,2);rim.position.set(4,5,-5);scene.add(rim);
 const mat=(color,roughness=.85)=>new T.MeshStandardMaterial({color,roughness});const bark=mat('#79684b'),barkLight=mat('#a28a61'),green=mat('#788d43'),darkgreen=mat('#506833'),earth=mat('#a3976d');
 function mesh(geometry,material,parent=world){const m=new T.Mesh(geometry,material);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
 const v=a=>new T.Vector3(...a);
 function limb(a,b,r1,r2,material=bark,parent=world){const start=v(a),end=v(b),delta=end.clone().sub(start);const length=delta.length();const geom=new T.CylinderGeometry(r2,r1,length,12,6);const attr=geom.attributes.position;for(let i=0;i<attr.count;i++){const y=attr.getY(i);const phase=(y/length+.5)*Math.PI;attr.setX(i,attr.getX(i)+Math.sin(phase)*length*.045);attr.setZ(i,attr.getZ(i)+Math.sin(phase)*length*.025)}geom.computeVertexNormals();const m=mesh(geom,material,parent);m.position.copy(start.add(end).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());return m}
 function ball(pos,scale,material,parent=world){const m=mesh(new T.SphereGeometry(1,16,12),material,parent);m.position.set(...pos);m.scale.set(...scale);return m}
 // A wind-shaped sculpture: continuous tapered curves and translucent leaf washes.
 let seed=32;const rand=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646};
 const wood=new T.MeshStandardMaterial({color:'#766b63',roughness:1,vertexColors:true});
 function stroke(points,radius,endRadius=.003,material=wood){
  const curve=new T.CatmullRomCurve3(points.map(v));const geo=new T.TubeGeometry(curve,48,1,9,false);const positions=geo.attributes.position,colors=[];
  for(let i=0;i<positions.count;i++){const step=Math.floor(i/10)/48,t=Math.min(step,1),center=curve.getPointAt(t);const radial=new T.Vector3().fromBufferAttribute(positions,i).sub(center);const r=radius*Math.pow(1-t,.85)+endRadius*t;positions.setXYZ(i,center.x+radial.x*r,center.y+radial.y*r,center.z+radial.z*r);const c=new T.Color().setHSL(.09,.10,.65+Math.sin(t*17+i%10)*.09);colors.push(c.r,c.g,c.b)}
  geo.setAttribute('color',new T.Float32BufferAttribute(colors,3));geo.computeVertexNormals();return mesh(geo,material);
 }
 const ground=mesh(new T.PlaneGeometry(40,40),new T.ShadowMaterial({opacity:.12}),scene);ground.rotation.x=-Math.PI/2;ground.position.y=-.22;
 const rock=mesh(new T.SphereGeometry(1,32,14),mat('#c5c3b5'));rock.scale.set(1.2,.18,.82);rock.position.set(.05,-.13,0);const rockPos=rock.geometry.attributes.position;for(let i=0;i<rockPos.count;i++){let x=rockPos.getX(i),y=rockPos.getY(i),z=rockPos.getZ(i);const r=1+.09*Math.sin(x*8+z*7);rockPos.setXYZ(i,x*r,y,z*r)}rock.geometry.computeVertexNormals();
 stroke([[.1,0,0],[-.38,1,.14],[-.24,2.05,-.1],[.22,3,.02],[.15,4.2,-.2],[.85,5.2,-.35],[1.65,5.6,-.45]],.24);
 for(let i=0;i<5;i++){let a=i*1.35;stroke([[.05,.5,0],[Math.cos(a)*.25,.1,Math.sin(a)*.3],[Math.cos(a)*.9,-.04,Math.sin(a)*.65]],.09,.009)}
 const tips=[[-1.9,4.45,.45],[1.8,4.9,-.1],[-2.05,3.05,-.2],[2.0,3.6,.7],[-1.3,1.9,1],[1.55,2.25,-.65]];
 const branches=[[[.1,3,.02],[-.45,3.5,0],[-1.4,3.8,.25],tips[0],[-2.4,4.95,.35]],[[.15,4.05,-.15],[.7,4.5,-.3],tips[1],[2.35,5.5,-.3]],[[-.25,1.95,0],[-.8,2.4,-.1],tips[2],[-2.5,3.6,-.3]],[[.1,2.8,.1],[.9,3.05,.3],tips[3],[2.65,4.25,.6]],[[-.34,.85,.1],[-.95,1.2,.5],tips[4],[-1.8,2.35,.9]],[[-.2,1.55,-.1],[.6,1.8,-.5],tips[5],[2.3,2.7,-.8]]];
 branches.forEach((points,i)=>stroke(points,i<2?.105:.085));
 const foliage=[];
 const leafColors=['#849c9b','#a3b6ad','#b8b79a','#d0b591','#7c9595','#a6a895'];
 const leafMaterials=leafColors.map(color=>new T.MeshStandardMaterial({color,roughness:1,side:T.DoubleSide,transparent:true,opacity:.72,depthWrite:false}));
 const leafShape=new T.Shape();leafShape.moveTo(0,0);leafShape.bezierCurveTo(-.13,.2,-.10,.48,0,.62);leafShape.bezierCurveTo(.1,.43,.12,.16,0,0);const leafGeo=new T.ShapeGeometry(leafShape,10);
 branches.forEach((points,i)=>{
  const end=points.at(-1);
  for(let j=0;j<7;j++){
   const a=j*.62+i*.4;const anchor=[end[0]+Math.cos(a)*(.25+rand()*.4),end[1]+rand()*.2,end[2]+Math.sin(a)*.5];
   const droop=[anchor[0]+.3,anchor[1]-.5-rand()*.45,anchor[2]+.12];
   stroke([points[2],anchor,droop],.014,.001);
   for(let k=0;k<5;k++){
    const t=k/5;const leaf=mesh(leafGeo,leafMaterials[(i+j+k)%leafMaterials.length]);leaf.castShadow=false;leaf.position.set(anchor[0]+(droop[0]-anchor[0])*t,anchor[1]+(droop[1]-anchor[1])*t,anchor[2]+(droop[2]-anchor[2])*t);leaf.scale.setScalar(.45+rand()*.4);leaf.rotation.set(.2+rand()*.7,rand()*5,Math.PI+(k%2?-.6:.5));foliage.push({leaf,z:leaf.rotation.z,phase:rand()*6});
   }
  }
 });
 // Fine etched lines follow the trunk rather than a repeated bark texture.
 const ink=new T.LineBasicMaterial({color:'#5d5952',transparent:true,opacity:.3});
 for(let i=0;i<8;i++){let x=(i-3.5)*.028;const curve=new T.CatmullRomCurve3([[.1+x,.12,.20],[-.38+x,1,.28],[-.24+x,2.05,.05],[.22+x,3,.13],[.15+x,4.1,-.14]].map(v));world.add(new T.Line(new T.BufferGeometry().setFromPoints(curve.getPoints(80)),ink))}
 const birds=[],pickable=[];
 const palettes=[['#28899e','#d08c43'],['#82745b','#be652e'],['#6e986c','#c3bdb0'],['#3b4a58','#e4d3ad'],['#b3a04d','#e6d7a3'],['#c6c5bc','#eae8dd']];
 tips.forEach((tip,i)=>{
 const bird=new T.Group();world.add(bird);bird.position.set(tip[0]*.92,tip[1]+.25,tip[2]);bird.rotation.y=i%2?-.8:1;const [main,breast]=palettes[i],bodymat=mat(main,.55),bellymat=mat(breast,.7),black=mat('#242b21');
 ball([0,.16,0],[.22,.30,.19],bodymat,bird);ball([0,.12,.12],[.17,.24,.12],bellymat,bird);const head=new T.Group();bird.add(head);head.position.set(0,.43,.06);ball([0,0,0],[.17,.16,.16],bodymat,head);
 for(let sign of [-1,1]){ball([sign*.145,.015,.07],[.026,.029,.026],black,head);ball([sign*.16,.025,.082],[.008,.009,.008],mat('#fff7db'),head)}
 const beak=mesh(new T.ConeGeometry(.045,i===0||i===2?.23:.12,6),mat('#5c5140'),head);beak.rotation.x=Math.PI/2;beak.position.set(0,-.025,.2);
 const wings=[];for(let sign of [-1,1]){const pivot=new T.Group();pivot.position.set(sign*.17,.24,0);bird.add(pivot);const wing=ball([sign*.025,-.08,-.04],[.065,.23,.14],mat(main).clone(),pivot);wing.rotation.x=-.3;wings.push(pivot)}
 const tail=ball([0,-.08,-.22],[.10,.055,i===3?.37:.22],bodymat,bird);tail.rotation.x=-.2;
 for(let sign of [-1,1]){limb([sign*.07,-.03,.03],[sign*.07,-.19,.04],.012,.009,black,bird);limb([sign*.07,-.19,.04],[sign*.07,-.19,.14],.009,.004,black,bird)}
 if(i===0){const crest=mesh(new T.ConeGeometry(.08,.14,5),bodymat,head);crest.position.set(0,.13,-.04)}
 bird.traverse(o=>{if(o.isMesh){o.userData.index=i;pickable.push(o)}});
 const button=host.querySelector(`[data-project="${projects[i].id}"]`);birds.push({bird,head,wings,button,base:bird.position.clone(),turn:bird.rotation.y,fly:-10,phase:i*1.7});
 });
 const dustGeometry=new T.BufferGeometry();const dustPositions=[];for(let i=0;i<50;i++)dustPositions.push((rand()-.5)*9,rand()*6,(rand()-.5)*5);dustGeometry.setAttribute('position',new T.Float32BufferAttribute(dustPositions,3));const dust=new T.Points(dustGeometry,new T.PointsMaterial({color:'#fff8cf',size:.035,transparent:true,opacity:.65}));world.add(dust);
 let angle=.15,tilt=.13,zoom=1,velocity=0,drag=null,active=true,selected=0;const mobile=()=>innerWidth<=700;const reduced=()=>matchMedia('(prefers-reduced-motion:reduce)').matches||document.body.classList.contains('still');
 const controls=document.createElement('div');controls.className='forest-controls';controls.innerHTML='<button type="button" aria-label="Turn tree left">↶</button><button type="button" aria-label="Turn tree right">↷</button><button type="button" aria-label="Zoom in">+</button><button type="button" aria-label="Zoom out">−</button><button type="button" class="forest-reset">Reset view</button>';host.append(controls);const hint=document.createElement('span');hint.className='forest-instruction';hint.textContent='a small world, yours to wander · drag to turn';host.append(hint);
 const buttons=controls.querySelectorAll('button');buttons[0].onclick=()=>angle-=.4;buttons[1].onclick=()=>angle+=.4;buttons[2].onclick=()=>zoom=Math.min(1.35,zoom+.12);buttons[3].onclick=()=>zoom=Math.max(.75,zoom-.12);buttons[4].onclick=()=>{angle=.15;tilt=.13;zoom=1;velocity=0};
 const ray=new T.Raycaster(),pointer=new T.Vector2();function hit(e){const r=host.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);return ray.intersectObjects(pickable)[0]?.object.userData.index}
 renderer.domElement.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,moved:false};renderer.domElement.setPointerCapture(e.pointerId)});
 renderer.domElement.addEventListener('pointermove',e=>{if(!drag){renderer.domElement.style.cursor=hit(e)!==undefined?'pointer':'grab';return}const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)>7)drag.moved=true;angle+=dx*.008;tilt=T.MathUtils.clamp(tilt+dy*.004,-.12,.45);velocity=dx*.002;drag.x=e.clientX;drag.y=e.clientY;host.classList.add('dragging')});
 function release(e){if(!drag)return;const was=drag.moved;drag=null;host.classList.remove('dragging');if(!was){const index=hit(e);if(index!==undefined)birds[index].button.click()}}
 renderer.domElement.addEventListener('pointerup',release);renderer.domElement.addEventListener('pointercancel',()=>{drag=null;host.classList.remove('dragging');velocity=0});
 region.addEventListener('projectselect',e=>{selected=projects.findIndex(p=>p.id===e.detail.id);if(birds[selected]&&!reduced())birds[selected].fly=performance.now()/1000});
 // Clicking the current bird still lets it fly, even when its project is already selected.
 birds.forEach(b=>b.button.addEventListener('click',()=>{if(!reduced())b.fly=performance.now()/1000}));
 region.querySelector('.garden-toggle').addEventListener('click',()=>region.classList.toggle('list-mode',!region.querySelector('.project-list').hidden));
 region.classList.add('forest-ready');region.querySelector('.garden-toolbar span').textContent='6 birds · 6 projects · a world to explore';
 function resize(){const r=host.getBoundingClientRect();if(r.width<1||r.height<1)return;renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();world.position.x=mobile()?0:-1.2}
 const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);resize();new IntersectionObserver(entries=>active=entries[0].isIntersecting,{rootMargin:'100px'}).observe(host);
 let last=0;const position=new T.Vector3();
 function frame(ms){requestAnimationFrame(frame);if(!active||document.hidden)return;const t=ms/1000,dt=Math.min((ms-last)/1000,.05);last=ms;
 if(!drag&&!reduced()){angle+=velocity;velocity*=.94}
 const distance=(mobile()?12.8:12.5)/zoom;camera.position.set(Math.sin(angle)*distance,3+Math.sin(tilt)*distance,Math.cos(angle)*distance);camera.lookAt(0,2.8,0);camera.updateMatrixWorld();
 if(!reduced()){foliage.forEach(({leaf,z,phase})=>leaf.rotation.z=z+Math.sin(t*1.3+phase)*.12);dust.rotation.y=t*.015}
 birds.forEach((b,i)=>{b.bird.position.copy(b.base);b.bird.rotation.y=b.turn;let f=t-b.fly;if(f>=0&&f<2.8&&!reduced()){let arc=Math.sin(f/2.8*Math.PI);b.bird.position.x+=Math.sin(f*2.2)*arc*1.2;b.bird.position.y+=arc*1.8;b.bird.position.z+=Math.cos(f*2.2)*arc;b.bird.rotation.y+=f*2;b.wings.forEach((w,j)=>w.rotation.z=(j?1:-1)*(Math.sin(f*30)*.7+.6))}else{b.wings.forEach(w=>w.rotation.z=0);if(!reduced())b.head.rotation.y=Math.sin(t*.8+b.phase)*.23}b.bird.scale.setScalar(i===selected?1.12:1);b.bird.getWorldPosition(position);position.y-=.3;position.project(camera);b.button.style.left=`${(position.x*.5+.5)*host.clientWidth}px`;b.button.style.top=`${(-position.y*.5+.5)*host.clientHeight}px`;b.button.style.zIndex=String(10-Math.round(position.z*5));});renderer.render(scene,camera);
 }
 requestAnimationFrame(frame);
}
