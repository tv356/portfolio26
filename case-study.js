(() => {
  const dialog=document.querySelector('dialog');let opener;
  document.querySelectorAll('.image-expand').forEach(button=>button.addEventListener('click',()=>{const image=button.querySelector('img');if(!image)return;opener=button;dialog.querySelector('img').src=image.src;dialog.querySelector('img').alt=image.alt;dialog.showModal()}));
  dialog.querySelector('.close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>opener?.focus());
  dialog.addEventListener('click',event=>{const rect=dialog.getBoundingClientRect();if(event.target===dialog&&(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom))dialog.close()});
})();
