// gallery.js - loads data/products.json and renders product cards + gallery
(async function(){
  const dataUrl = 'data/products.json';
  try{
    const res = await fetch(dataUrl);
    if(!res.ok) throw new Error('Failed to load '+dataUrl+' ('+res.status+')');
    const data = await res.json();
    renderProducts(data.products || []);
    renderGallery(data.products || []);
  }catch(err){
    console.error('Gallery load error', err);
    document.getElementById('gallery-grid').innerHTML = '<div class="col-12 alert alert-warning">Could not load gallery data.</div>';
  }

  function renderProducts(products){
    const container = document.getElementById('product-list');
    container.innerHTML = products.map(p => (`
      <div class="col-md-6 col-lg-4">
        <article class="card product-card h-100">
          <img src="${p.images[0]}" loading="lazy" class="card-img-top" alt="${escapeHtml(p.images[0])}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${escapeHtml(p.title)}</h5>
            <p class="card-text text-muted">${escapeHtml(p.shortDescription)}</p>
            <div class="mt-auto">
              <button class="btn btn-sm btn-outline-primary view-product" data-id="${p.id}">View gallery</button>
            </div>
          </div>
        </article>
      </div>
    `)).join('');

    // attach handlers to 'View gallery' buttons
    container.querySelectorAll('.view-product').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id = btn.getAttribute('data-id');
        const idx = products.findIndex(x=>x.id==id);
        if(idx>=0) openLightbox(idx, products);
      });
    });
  }

  function renderGallery(products){
    const grid = document.getElementById('gallery-grid');
    const thumbs = [];
    products.forEach((p,pi)=>{
      p.images.forEach((img,ii)=>{
        const index = thumbs.length;
        thumbs.push({productIndex:pi,image:img, title:p.title, caption:p.shortDescription});
        grid.insertAdjacentHTML('beforeend', `
          <div class="col-6 col-sm-4 col-md-3">
            <div class="p-1">
              <img src="${img}" loading="lazy" class="img-fluid gallery-thumb rounded" data-index="${index}" alt="${escapeHtml(p.title)}">
            </div>
          </div>
        `);
      });
    });

    // add click handlers
    grid.querySelectorAll('.gallery-thumb').forEach(img=>{
      img.addEventListener('click', (e)=>{
        const idx = parseInt(img.getAttribute('data-index'));
        openLightbox(idx, thumbs);
      });
    });

    // expose for main.js
    window.__galleryThumbs = thumbs;
  }

  function openLightbox(startIndex, items){
    // delegate to main.js if available
    if(window.openGalleryItem) return window.openGalleryItem(startIndex, items);
    console.warn('No lightbox handler found');
  }

  function escapeHtml(s){
    return String(s).replace(/[&<>\\\"]/g, ch=>({
      '&':'&amp;', '<':'&lt;', '>':'&gt;', '\"':'&quot;'
    }[ch] || ch));
  }
})();
