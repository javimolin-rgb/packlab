(() => {
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const state = {type:'box', color:'#d6e5b5', finish:'matte', rotation:false, art:null};
const names = {box:'Caja de producto', bottle:'Botella', pouch:'Bolsa flexible', cup:'Vaso'};
const toast = message => { const el=$('#toast'); el.textContent=message; el.classList.add('show'); clearTimeout(toast.timer); toast.timer=setTimeout(()=>el.classList.remove('show'),2600); };
function updatePreview(){
 const obj=$('#previewObject'); obj.className='preview-object'+(state.rotation?' rotated':'')+(state.finish==='gloss'?' gloss':state.finish==='kraft'?' kraft':'')+' '+state.type;
 const front=obj.querySelector('.object-front');
 front.style.backgroundColor=state.color;
 const dark = luminance(state.color)<95; const txt=dark?'#f7f5e9':'#3d4d37';
 front.style.color=txt;
 obj.querySelector('.object-side').style.backgroundColor=shade(state.color,-18);
 obj.querySelector('.object-top').style.backgroundColor=shade(state.color,12);
 $('#objectBrand').innerHTML=escapeHtml($('#brandText').value.trim()||'YOUR BRAND').replace(/\n/g,'<br>');
 $('#objectArt').innerHTML=state.art?'<img alt="Arte subido" src="'+state.art+'" style="max-width:58px;max-height:58px;object-fit:contain">':'✳';
 $('#previewType').textContent=names[state.type];
 $('#dimensionLabel').textContent=`${$('#dimW').value||120} × ${$('#dimH').value||180} × ${$('#dimD').value||60} mm`;
 if(window.packlabUpdate3D) window.packlabUpdate3D({type:state.type,color:state.color,finish:state.finish,brand:$('#brandText').value||'YOUR BRAND',art:state.art,w:Number($('#dimW').value)||120,h:Number($('#dimH').value)||180,d:Number($('#dimD').value)||60});
 if(typeof renderDieline==='function') renderDieline();
}
function luminance(hex){const c=hex.replace('#','');const rgb=[0,2,4].map(i=>parseInt(c.slice(i,i+2),16));return rgb[0]*.299+rgb[1]*.587+rgb[2]*.114}
function shade(hex,amt){let c=hex.replace('#','');return '#'+[0,2,4].map(i=>Math.max(0,Math.min(255,parseInt(c.slice(i,i+2),16)+amt)).toString(16).padStart(2,'0')).join('')}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function selectType(type){state.type=type;$$('.category-card').forEach(b=>b.classList.toggle('selected',b.dataset.type===type));updatePreview();$('#tools').scrollIntoView({behavior:'smooth',block:'start'})}
$$('.category-card').forEach(b=>b.addEventListener('click',()=>selectType(b.dataset.type)));
$$('.swatch').forEach(b=>b.addEventListener('click',()=>{state.color=b.dataset.color;$('#customColor').value=state.color;$$('.swatch').forEach(s=>s.classList.toggle('active',s===b));updatePreview()}));
$('#customColor').addEventListener('input',e=>{state.color=e.target.value;$$('.swatch').forEach(s=>s.classList.remove('active'));updatePreview()});
['brandText','dimW','dimH','dimD'].forEach(id=>$('#'+id).addEventListener('input',updatePreview));
$('#finish').addEventListener('change',e=>{state.finish=e.target.value;updatePreview()});
$('#rotateBtn').addEventListener('click',()=>{state.rotation=!state.rotation;updatePreview()});
$('#gridBtn').addEventListener('click',()=>{$('#previewCanvas').classList.toggle('no-grid')});
$('#fullscreenBtn').addEventListener('click',()=>{$('#previewCanvas').classList.toggle('expanded');const canvas=$('#previewCanvas');if(canvas.classList.contains('expanded')){canvas.style.position='fixed';canvas.style.inset='20px';canvas.style.zIndex='40';canvas.style.border='1px solid #dfe2d7';canvas.style.boxShadow='0 0 0 100vmax #202721aa';$('#fullscreenBtn').textContent='×'}else{canvas.style.position='';canvas.style.inset='';canvas.style.zIndex='';canvas.style.border='';canvas.style.boxShadow='';$('#fullscreenBtn').textContent='⛶'}});
$('#artUpload').addEventListener('change',e=>{const file=e.target.files[0];if(!file)return;if(!file.type.startsWith('image/'))return toast('Elige un archivo de imagen.');if(file.size>5*1024*1024)return toast('La imagen debe pesar menos de 5 MB.');const reader=new FileReader();reader.onload=()=>{state.art=reader.result;updatePreview();toast('Imagen añadida al diseño.')};reader.readAsDataURL(file)});
$('#resetDesign').addEventListener('click',()=>{state.type='box';state.color='#d6e5b5';state.finish='matte';state.rotation=false;state.art=null;$('#projectName').value='Mi packaging';$('#brandText').value='YOUR BRAND';$('#dimW').value=120;$('#dimH').value=180;$('#dimD').value=60;$('#finish').value='matte';$('#customColor').value=state.color;$('#artUpload').value='';$$('.swatch').forEach(s=>s.classList.toggle('active',s.dataset.color===state.color));$$('.category-card').forEach(b=>b.classList.toggle('selected',b.dataset.type==='box'));updatePreview();toast('Diseño restablecido.')});
function snapshot(){return {name:$('#projectName').value.trim()||'Proyecto sin nombre',brand:$('#brandText').value,color:state.color,finish:state.finish,type:state.type,rotation:state.rotation,art:state.art,w:$('#dimW').value,h:$('#dimH').value,d:$('#dimD').value,updated:new Date().toLocaleString('es-CL')}}
function loadSnapshot(p){$('#projectName').value=p.name;$('#brandText').value=p.brand||'YOUR BRAND';state.color=p.color||'#d6e5b5';state.finish=p.finish||'matte';state.type=p.type||'box';state.rotation=!!p.rotation;state.art=p.art||null;$('#dimW').value=p.w||120;$('#dimH').value=p.h||180;$('#dimD').value=p.d||60;$('#finish').value=state.finish;$('#customColor').value=state.color;$$('.swatch').forEach(s=>s.classList.toggle('active',s.dataset.color===state.color));$$('.category-card').forEach(b=>b.classList.toggle('selected',b.dataset.type===state.type));updatePreview()}
function getProjects(){try{return JSON.parse(localStorage.getItem('packlabProjects')||'[]')}catch{return []}}
function saveProject(){const p=snapshot();let list=getProjects();const idx=list.findIndex(x=>x.name===p.name);if(idx>=0)list[idx]=p;else list.unshift(p);try{localStorage.setItem('packlabProjects',JSON.stringify(list.slice(0,30)));toast('Proyecto guardado en este navegador.')}catch{toast('No se pudo guardar. Prueba una imagen más pequeña.')} }
$('#saveProject').addEventListener('click',saveProject);
function openProjects(){renderProjects();$('#projectsModal').classList.add('open')}
function renderProjects(){const list=getProjects(),container=$('#projectsList');container.innerHTML='';if(!list.length){container.innerHTML='<p>No tienes proyectos guardados todavía.</p>';return}list.forEach((p,i)=>{const item=document.createElement('div');item.className='project-item';const info=document.createElement('div'),title=document.createElement('strong'),meta=document.createElement('small'),load=document.createElement('button');title.textContent=p.name;meta.textContent=(names[p.type]||'Diseño')+' · '+(p.updated||'Guardado');load.textContent='Abrir';load.addEventListener('click',()=>{loadSnapshot(p);$('#projectsModal').classList.remove('open');toast('Proyecto cargado.')});info.append(title,meta);item.append(info,load);container.append(item)})}
$('#openProjects').addEventListener('click',openProjects);$('#closeProjects').addEventListener('click',()=>$('#projectsModal').classList.remove('open'));$('#projectsModal').addEventListener('click',e=>{if(e.target===$('#projectsModal'))$('#projectsModal').classList.remove('open')});
$('#newProject').addEventListener('click',()=>{$('#projectsModal').classList.remove('open');$('#resetDesign').click();$('#tools').scrollIntoView({behavior:'smooth'})});
function start(){ $('#tools').scrollIntoView({behavior:'smooth'}); }
['startTop','startHero','startBottom'].forEach(id=>$('#'+id).addEventListener('click',start));
$('#menuToggle').addEventListener('click',()=>{$('.topbar').classList.toggle('nav-open')});
$$('.topbar nav a').forEach(a=>a.addEventListener('click',()=>$('.topbar').classList.remove('nav-open')));
$('#exportBtn').addEventListener('click',()=>{
 if(window.packlabExport3D && window.packlabExport3D()) return;
 const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=900;const ctx=canvas.getContext('2d');
 ctx.fillStyle='#f2f3ed';ctx.fillRect(0,0,1200,900);
 ctx.strokeStyle='#dce1d5';ctx.globalAlpha=.45;for(let x=0;x<1200;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,900);ctx.stroke()}for(let y=0;y<900;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(1200,y);ctx.stroke()}ctx.globalAlpha=1;
 ctx.fillStyle='#65745e';ctx.font='bold 18px sans-serif';ctx.fillText('PACKLAB STUDIO  /  PREVIEW',70,75);
 const col=state.color, x=430,y=235,w=280,h=450,side=70;
 ctx.fillStyle=shade(col,-18);ctx.beginPath();ctx.moveTo(x+w,y);ctx.lineTo(x+w+side,y-65);ctx.lineTo(x+w+side,y+h-65);ctx.lineTo(x+w,y+h);ctx.closePath();ctx.fill();
 ctx.fillStyle=shade(col,12);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+side,y-65);ctx.lineTo(x+w+side,y-65);ctx.lineTo(x+w,y);ctx.closePath();ctx.fill();
 ctx.fillStyle=col;ctx.fillRect(x,y,w,h);ctx.strokeStyle='#35453630';ctx.strokeRect(x,y,w,h);
 ctx.fillStyle=luminance(col)<95?'#f7f5e9':'#3d4d37';ctx.textAlign='center';ctx.font='52px Georgia';const brand=($('#brandText').value||'YOUR BRAND').split(/\s+/);brand.slice(0,3).forEach((word,i)=>ctx.fillText(word,x+w/2,y+190+i*60));
 ctx.font='18px sans-serif';ctx.fillText(state.type.toUpperCase()+' / '+($('#dimW').value||120)+' × '+($('#dimH').value||180)+' × '+($('#dimD').value||60)+' MM',x+w/2,y+h-55);
 ctx.textAlign='left';ctx.fillStyle='#7b8377';ctx.font='16px sans-serif';ctx.fillText($('#projectName').value||'Mi packaging',70,830);ctx.fillText('Diseño conceptual · Packlab Studio',70,858);
 if(state.art){const img=new Image();img.onload=()=>{ctx.drawImage(img,x+w/2-35,y+245,70,70);downloadCanvas(canvas)};img.src=state.art}else downloadCanvas(canvas);
 function downloadCanvas(c){const a=document.createElement('a');a.download=(($('#projectName').value||'packlab-preview').trim().replace(/[^a-z0-9-_]+/gi,'-'))+'.png';a.href=c.toDataURL('image/png');a.click();toast('Vista previa PNG exportada.')}
});


// SVG dieline generator (conceptual carton net) with mm-based dimensions and editable vector paths.
function buildDielineSvg(){
 const W=Math.max(20,Math.min(500,Number($('#dimW').value)||120));
 const H=Math.max(20,Math.min(500,Number($('#dimH').value)||180));
 const D=Math.max(10,Math.min(300,Number($('#dimD').value)||60));
 // Drawing scale is capped for readability; SVG viewBox units correspond to a scaled drawing, labels retain mm.
 const scale=Math.min(2.0,620/(2*W+2*D+26),360/(H+2*D+24));
 const w=W*scale,h=H*scale,d=D*scale,glue=Math.max(8,12*scale),flap=Math.max(12,d*.48);
 const x0=30+glue, y0=30+flap;
 const xs=[x0,x0+w,x0+w+d,x0+2*w+d,x0+2*w+2*d];
 const yTop=y0, yBodyBottom=y0+h, yBottom=yBodyBottom+flap;
 const totalW=glue+2*w+2*d+26, totalH=2*flap+h+65;
 const cut=[],fold=[];
 // Glue tab and four connected panels: front, side, back, side.
 cut.push(`M ${x0} ${yTop} L ${x0-glue} ${yTop+5} L ${x0-glue} ${yBodyBottom-5} L ${x0} ${yBodyBottom}`);
 cut.push(`M ${x0} ${yTop} L ${x0+w/2-5} ${yTop-flap} L ${x0+w/2+5} ${yTop-flap} L ${x0+w} ${yTop}`);
 cut.push(`M ${x0+w} ${yTop} L ${x0+w+d/2} ${yTop-flap} L ${x0+w+d} ${yTop}`);
 cut.push(`M ${x0+w+d} ${yTop} L ${x0+w+d+w/2-5} ${yTop-flap} L ${x0+w+d+w/2+5} ${yTop-flap} L ${x0+2*w+d} ${yTop}`);
 cut.push(`M ${x0+2*w+d} ${yTop} L ${x0+2*w+d+d/2} ${yTop-flap} L ${x0+2*w+2*d} ${yTop}`);
 cut.push(`M ${x0+2*w+2*d} ${yTop} L ${x0+2*w+2*d} ${yBodyBottom} L ${x0+2*w+2*d-3} ${yBodyBottom+4} L ${x0+2*w+2*d} ${yBottom}`);
 // Bottom flaps and carton closure.
 cut.push(`M ${x0} ${yBodyBottom} L ${x0+w/2-5} ${yBottom} L ${x0+w/2+5} ${yBottom} L ${x0+w} ${yBodyBottom}`);
 cut.push(`M ${x0+w} ${yBodyBottom} L ${x0+w+d/2} ${yBottom} L ${x0+w+d} ${yBodyBottom}`);
 cut.push(`M ${x0+w+d} ${yBodyBottom} L ${x0+w+d+w/2-5} ${yBottom} L ${x0+w+d+w/2+5} ${yBottom} L ${x0+2*w+d} ${yBodyBottom}`);
 cut.push(`M ${x0+2*w+d} ${yBodyBottom} L ${x0+2*w+d+d/2} ${yBottom} L ${x0+2*w+2*d} ${yBodyBottom}`);
 // Fold lines between body panels and flap roots.
 [x0,x0+w,x0+w+d,x0+2*w+d,x0+2*w+2*d].forEach(x=>fold.push(`M ${x} ${yTop} L ${x} ${yBodyBottom}`));
 [x0,x0+w,x0+w+d,x0+2*w+d].forEach(x=>{fold.push(`M ${x} ${yTop} L ${x+ (x===x0?0:w/2)} ${yTop}`)});
 fold.push(`M ${x0} ${yTop} L ${x0+2*w+2*d} ${yTop}`);
 fold.push(`M ${x0} ${yBodyBottom} L ${x0+2*w+2*d} ${yBodyBottom}`);
 const panels=[{x:x0,w,label:'FRENTE',mm:W},{x:x0+w,w:d,label:'LATERAL',mm:D},{x:x0+w+d,w,label:'DORSO',mm:W},{x:x0+2*w+d,w:d,label:'LATERAL',mm:D}];
 const labels=panels.map(p=>`<text x="${p.x+p.w/2}" y="${y0+h/2}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${Math.max(7,9*scale)}" letter-spacing=".8" fill="#7b8477">${p.label}</text>`).join('');
 const panelDims=panels.map(p=>`<text x="${p.x+p.w/2}" y="${yBodyBottom+flap+22}" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" fill="#788173">${p.mm} mm</text>`).join('');
 const dimY=yBottom+42, right=x0+2*w+2*d;
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${Math.ceil(totalW)}mm" height="${Math.ceil(totalH)}mm" viewBox="0 0 ${Math.ceil(totalW)} ${Math.ceil(totalH)}" role="img" aria-label="Troquel conceptual de caja ${W} por ${H} por ${D} milímetros">
 <rect width="100%" height="100%" fill="#fbfcf8"/>
 <g fill="none" stroke="#dc795c" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">${cut.map(p=>`<path d="${p}"/>`).join('')}</g>
 <g fill="none" stroke="#718f9c" stroke-width="1.2" stroke-dasharray="5 4">${fold.map(p=>`<path d="${p}"/>`).join('')}</g>
 <g>${labels}${panelDims}</g>
 <g stroke="#9a9e91" stroke-width=".8" fill="none"><path d="M ${x0} ${dimY} L ${right} ${dimY} M ${x0} ${dimY-5} L ${x0} ${dimY+5} M ${right} ${dimY-5} L ${right} ${dimY+5}"/></g>
 <text x="${(x0+right)/2}" y="${dimY+14}" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" fill="#788173">Ancho desplegado aprox. ${Math.round(2*W+2*D)} mm + pestaña</text>
 <text x="16" y="17" font-family="Arial,sans-serif" font-size="9" letter-spacing="1.2" fill="#65745e">PACKLAB STUDIO · DIELINE CONCEPT</text>
 </svg>`;
 return {svg,W,H,D,total:Math.round(2*W+2*D),type:state.type};
}
function renderDieline(){const d=buildDielineSvg();$('#dielinePreview').innerHTML=d.svg;$('#dielineType').textContent=(names[state.type]||'Packaging')+' · plantilla conceptual';$('#dielineSize').textContent=`${d.total} mm de ancho desplegado aprox.`}
$('#refreshDieline').addEventListener('click',()=>{renderDieline();toast('Plano 2D actualizado.')});
$('#downloadDieline').addEventListener('click',()=>{const d=buildDielineSvg();const blob=new Blob([d.svg],{type:'image/svg+xml;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=(($('#projectName').value||'packlab-dieline').trim().replace(/[^a-z0-9-_]+/gi,'-'))+'-troquel.svg';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Troquel SVG descargado.')});

// Three.js enhancement: real interactive 3D preview. If the CDN is unavailable, CSS mockup remains usable.
(async function init3D(){
 const canvas=$('#threeCanvas'), host=$('#previewCanvas');
 try{
  const THREE=await import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js');
  const {OrbitControls}=await import('https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/controls/OrbitControls.js');
  const scene=new THREE.Scene(); scene.background=new THREE.Color('#f2f3ed');
  const camera=new THREE.PerspectiveCamera(35,1,.1,100); camera.position.set(4.3,3.2,5.4);
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,preserveDrawingBuffer:true,alpha:false});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2)); renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  const controls=new OrbitControls(camera,canvas); controls.enableDamping=true; controls.dampingFactor=.06; controls.minDistance=3; controls.maxDistance=12; controls.target.set(0,1.15,0);
  scene.add(new THREE.HemisphereLight(0xffffff,0x9ba58e,2.0));
  const key=new THREE.DirectionalLight(0xffffff,3.1);key.position.set(4,7,5);key.castShadow=true;scene.add(key);
  const fill=new THREE.DirectionalLight(0xe3edcf,1.2);fill.position.set(-4,3,-2);scene.add(fill);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.MeshStandardMaterial({color:'#f2f3ed',roughness:1}));floor.rotation.x=-Math.PI/2;floor.position.y=-.03;floor.receiveShadow=true;scene.add(floor);
  let product=new THREE.Group();scene.add(product);let brandTexture=null, artTexture=null, autoRotate=false;
  function makeMaterial(color,roughness=.82){return new THREE.MeshStandardMaterial({color,roughness,metalness:0.01})}
  function textureFromState(data){
    const c=document.createElement('canvas');c.width=512;c.height=768;const x=c.getContext('2d');
    x.fillStyle=data.color;x.fillRect(0,0,512,768);
    if(data.finish==='kraft'){x.globalAlpha=.09;for(let i=0;i<1400;i++){x.fillStyle=i%2?'#6a543c':'#fff';x.fillRect(Math.random()*512,Math.random()*768,1+Math.random()*2,1)}x.globalAlpha=1}
    if(data.finish==='gloss'){const g=x.createLinearGradient(0,0,512,0);g.addColorStop(0,'#ffffff05');g.addColorStop(.45,'#ffffff70');g.addColorStop(.62,'#ffffff05');x.fillStyle=g;x.fillRect(0,0,512,768)}
    const hex=data.color.replace('#','');const rgb=[0,2,4].map(i=>parseInt(hex.slice(i,i+2),16));x.fillStyle=rgb[0]*.299+rgb[1]*.587+rgb[2]*.114<95?'#f7f5e9':'#3d4d37';
    x.textAlign='center';x.textBaseline='middle';x.font='44px Georgia';const words=(data.brand||'YOUR BRAND').split(/\s+/).slice(0,4);
    words.forEach((w,i)=>x.fillText(w,256,300+(i-(words.length-1)/2)*53,420));
    x.font='15px sans-serif';x.fillText(data.type==='box'?'BOTANICAL GOODS':data.type.toUpperCase(),256,470);
    x.font='80px Georgia';x.fillText('✳',256,550);
    const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=renderer.capabilities.getMaxAnisotropy();return tex;
  }
  function disposeGroup(g){while(g.children.length){const o=g.children[0];g.remove(o);if(o.geometry)o.geometry.dispose();if(o.material){const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>{if(m.map)m.map.dispose();m.dispose()})}}}
  function rebuild(data){
    disposeGroup(product);
    const tex=textureFromState(data);const finishRough=data.finish==='gloss'?.22:data.finish==='kraft'?.95:.78;
    const frontMat=new THREE.MeshStandardMaterial({map:tex,roughness:finishRough,metalness:0});
    const sideMat=makeMaterial(data.color,finishRough);
    const scale=Math.max(data.w,data.h,data.d);const w=data.w/scale*1.25,d=data.d/scale*1.25,h=data.h/scale*2.35;
    const edge=makeMaterial(new THREE.Color(data.color).multiplyScalar(.78),finishRough);
    if(data.type==='box'){
      const body=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),[sideMat,sideMat,sideMat,sideMat,frontMat,sideMat]);body.position.y=h/2;body.castShadow=true;body.receiveShadow=true;product.add(body);
      const lid=new THREE.Mesh(new THREE.BoxGeometry(w*1.015,.035,d*1.015),makeMaterial(data.color,finishRough));lid.position.y=h+.018;lid.castShadow=true;product.add(lid);
    }else if(data.type==='bottle'){
      const radius=Math.min(w,d)*.47, bodyH=h*.78;
      const body=new THREE.Mesh(new THREE.CylinderGeometry(radius*.86,radius,bodyH,64,1,false),frontMat);body.position.y=bodyH/2+.03;body.castShadow=true;product.add(body);
      const neck=new THREE.Mesh(new THREE.CylinderGeometry(radius*.43,radius*.43,h*.12,48),sideMat);neck.position.y=bodyH+h*.06+.02;neck.castShadow=true;product.add(neck);
      const cap=new THREE.Mesh(new THREE.CylinderGeometry(radius*.46,radius*.46,h*.09,48),makeMaterial('#748268',.55));cap.position.y=bodyH+h*.165+.02;cap.castShadow=true;product.add(cap);
    }else if(data.type==='pouch'){
      const body=new THREE.Mesh(new THREE.BoxGeometry(w,h,d*.48),[sideMat,sideMat,sideMat,sideMat,frontMat,sideMat]);body.position.y=h/2;body.castShadow=true;product.add(body);
      const seal=new THREE.Mesh(new THREE.BoxGeometry(w*.88,.045,d*.5),edge);seal.position.y=h*.94;product.add(seal);
      const bottom=new THREE.Mesh(new THREE.BoxGeometry(w*.78,.07,d*.48),sideMat);bottom.position.y=.04;product.add(bottom);
    }else{
      const cupH=h*.88, topR=Math.min(w,d)*.48, botR=topR*.68;
      const body=new THREE.Mesh(new THREE.CylinderGeometry(botR,topR,cupH,64,1,true),frontMat);body.position.y=cupH/2+.03;body.castShadow=true;product.add(body);
      const rim=new THREE.Mesh(new THREE.TorusGeometry(topR,.025,10,64),sideMat);rim.rotation.x=Math.PI/2;rim.position.y=cupH+.03;product.add(rim);
      const bottom=new THREE.Mesh(new THREE.CylinderGeometry(botR*.98,botR*.98,.04,48),sideMat);bottom.position.y=.05;product.add(bottom);
    }
    // Ground contact shadow catcher under each object.
    const shadow=new THREE.Mesh(new THREE.CircleGeometry(Math.max(w,d)*.9,48),new THREE.MeshBasicMaterial({color:'#aab2a1',transparent:true,opacity:.17,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.005;product.add(shadow);
    product.rotation.y=autoRotate?-.35:0;
    camera.position.set(Math.max(w,d)*3.1,h*1.1+1.4,Math.max(w,d)*4.0);controls.target.set(0,h*.49,0);controls.update();
  }
  function resize(){const r=host.getBoundingClientRect();if(!r.width||!r.height)return;renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix()}
  const ro=new ResizeObserver(resize);ro.observe(host);resize();
  let current={type:'box',color:'#d6e5b5',finish:'matte',brand:'YOUR BRAND',w:120,h:180,d:60};
  window.packlabUpdate3D=data=>{current=data;rebuild(data)};
  window.packlabExport3D=()=>{try{renderer.render(scene,camera);const a=document.createElement('a');a.download=(($('#projectName').value||'packlab-preview').trim().replace(/[^a-z0-9-_]+/gi,'-'))+'-3d.png';a.href=renderer.domElement.toDataURL('image/png');a.click();toast('Vista 3D exportada como PNG.');return true}catch(e){toast('No se pudo exportar la vista 3D.');return true}};
  $('#rotateBtn').addEventListener('click',()=>{autoRotate=!autoRotate;product.rotation.y=autoRotate?-.75:0;controls.update()});
  $('#resetCameraBtn').addEventListener('click',()=>{controls.reset();camera.position.set(4.3,3.2,5.4);controls.target.set(0,1.15,0);controls.update()});
  // Rebuild when editor state updates; animation loop provides smooth orbit damping.
  rebuild(current);host.classList.add('webgl-ready');
  function animate(){requestAnimationFrame(animate);controls.update();renderer.render(scene,camera)}animate();
  window.addEventListener('resize',resize);
 }catch(err){console.warn('Vista 3D no disponible; se mantiene la vista de respaldo.',err);canvas.style.display='none'}
})();

$('#year').textContent=new Date().getFullYear();updatePreview();
})();