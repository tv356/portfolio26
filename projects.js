(() => {
  const region=document.querySelector('#work');
  const scene=region.querySelector('.tree-scene');
  const list=region.querySelector('.project-list');
  const preview=region.querySelector('.project-preview');
  const toggle=region.querySelector('.garden-toggle');
  const make=(tag,className,text)=>{const el=document.createElement(tag);if(className)el.className=className;if(text)el.textContent=text;return el};
  let selected='';
  function select(project){
    if(selected===project.id)return;selected=project.id;region.dispatchEvent(new CustomEvent('projectselect',{detail:project}));
    region.querySelectorAll('[data-project]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.project===project.id)));
    preview.querySelector('.preview-category').textContent=project.category;
    preview.querySelector('h3').textContent=project.title;
    preview.querySelector('.preview-summary').textContent=project.summary;
    preview.querySelector('.preview-metric').textContent=project.metric;
    preview.querySelector('.preview-species').textContent=project.name+' / '+project.bird;
    const image=preview.querySelector('img');image.hidden=!project.image;if(project.image){image.src=project.image;image.alt=project.name+' project preview'}else image.removeAttribute('src');
    const link=preview.querySelector('.preview-link');link.href=project.url;link.textContent=project.id==='microsoft'?'Visit Windows 365':'Read the full case study';
    if(project.id==='microsoft'){link.target='_blank';link.rel='noopener'}else{link.removeAttribute('target');link.removeAttribute('rel')}
    preview.classList.remove('changing');requestAnimationFrame(()=>preview.classList.add('changing'));
    region.querySelector('.garden-status').textContent=project.name+' selected. '+project.title+'.';
  }
  fetch('projects.json').then(response=>{if(!response.ok)throw new Error('Projects unavailable');return response.json()}).then(projects=>{
    for(const project of projects){
      const x=project.sprite%3*50,y=Math.floor(project.sprite/3)*100;
      const spriteStyle=`--sprite-x:${x}%;--sprite-y:${y}%;`;
      const perch=make('button','perch');perch.type='button';perch.dataset.project=project.id;perch.setAttribute('aria-label',project.name+' — '+project.bird);perch.setAttribute('aria-pressed','false');perch.setAttribute('aria-controls','project-preview');perch.style.cssText=spriteStyle+`--x:${project.x}%;--y:${project.y}%;`;
      const sprite=make('span','bird-sprite');sprite.innerHTML=window.sketchBird(project.sprite);perch.style.setProperty('--bird-delay', `${-project.sprite*1.7}s`);sprite.setAttribute('aria-hidden','true');perch.append(sprite,make('span','perch-name',project.name));
      const item=make('li');const row=make('button');row.type='button';row.dataset.project=project.id;row.setAttribute('aria-pressed','false');row.setAttribute('aria-controls','project-preview');row.style.cssText=spriteStyle;
      const rowBird=make('span','list-bird');rowBird.innerHTML=window.sketchBird(project.sprite);rowBird.setAttribute('aria-hidden','true');const label=make('span');label.append(make('strong','',project.name),make('small','',project.category));row.append(rowBird,label);item.append(row);list.append(item);
      for(const button of [perch,row]){
        button.addEventListener('click',()=>{if(!region.classList.contains("forest-ready"))window.birdTakeoff(perch,project.sprite);select(project);if(matchMedia('(max-width:640px)').matches)preview.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'start'})});
        button.addEventListener('focus',()=>select(project));
      }
      scene.append(perch);
    }
    select(projects[0]);region.querySelector('.garden-fallback').hidden=true;
  }).catch(()=>{region.querySelector('.garden-fallback').hidden=false;toggle.hidden=true;scene.hidden=true;preview.hidden=true});
  toggle.addEventListener('click',()=>{const showList=list.hidden;list.hidden=!showList;scene.hidden=showList;toggle.textContent=showList?'Explore the tree':'Browse as a list';toggle.setAttribute('aria-pressed',String(showList))});
})();
