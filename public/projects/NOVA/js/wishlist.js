function wishRender(){let box=$('#wishlist-grid'),empty=$('#wishlist-empty');if(!box)return;let a=wishlist.map(id=>products.find(p=>p.id===id)).filter(Boolean);if(!a.length){box.innerHTML='';empty.classList.remove('hidden');return}empty.classList.add('hidden');box.innerHTML=a.map(p=>card(p)).join('')}
document.addEventListener('DOMContentLoaded',()=>wishRender());
