(()=>{
 const sidebar=document.querySelector('.sidebar'),links=[...document.querySelectorAll('.project-nav')],reduce=matchMedia('(prefers-reduced-motion:reduce)');
 const palettes={microsoft:['#7fa6d8','#bfa9b0','#35496c','#142a3c'],vanguardai:['#dc9687','#b96388','#57416f','#341c35'],disney:['#b4a1df','#d399c2','#4e72b4','#251f46'],'urban-outfiters':['#c8c694','#e1a66c','#6c865f','#313d2b'],atlas:['#dfa778','#b7a3cf','#547c8f','#3c292d'],impactvesting:['#b5ca95','#9bc2be','#427970','#173a36']};
 let current=palettes.microsoft.map(hex),target=current,previousId='',frame=0,last=0;
 function hex(s){return[1,3,5].map(i=>parseInt(s.slice(i,i+2),16))}
 function paint(){const sky=document.querySelector('.dashboard-sky');['--main-a','--main-b','--main-c','--main-base'].forEach((key,i)=>sky?.style.setProperty(key,`rgb(${current[i].map(Math.round).join(',')})`))}
 function tick(ms){frame=0;const dt=Math.min(50,last?ms-last:16);last=ms;let remaining=0;current=current.map((color,i)=>color.map((c,j)=>{const d=target[i][j]-c;remaining+=Math.abs(d);return c+d*(1-Math.exp(-dt/430))}));paint();if(remaining>.5)frame=requestAnimationFrame(tick);else{current=target.map(c=>[...c]);paint();last=0}}
 function sync(){const active=links.find(a=>a.classList.contains('active'));const id=active?.hash.replace('#project-','');if(!palettes[id]||id===previousId)return;previousId=id;sidebar.dataset.palette=id;target=palettes[id].map(hex);if(reduce.matches||document.body.classList.contains('still')){current=target.map(c=>[...c]);paint()}else if(!frame)frame=requestAnimationFrame(tick)}
 links.forEach(a=>new MutationObserver(sync).observe(a,{attributes:true,attributeFilter:['class']}));reduce.addEventListener('change',()=>{previousId='';sync()});new MutationObserver(()=>{previousId='';sync()}).observe(document.body,{attributes:true,attributeFilter:['class']});paint();sync();
})();
