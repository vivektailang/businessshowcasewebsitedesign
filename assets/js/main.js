// main.js - lightbox modal behavior and small helpers
(function(){
  // set year
  document.getElementById('year').textContent = new Date().getFullYear();

  const modalEl = document.getElementById('lightboxModal');
  const bsModal = new bootstrap.Modal(modalEl);
  const imgEl = document.getElementById('lightboxImage');
  const titleEl = document.getElementById('lightboxTitle');
  const captionEl = document.getElementById('lightboxCaption');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  let currentIndex = 0;
  let items = [];

  // openGalleryItem is called by gallery.js
  window.openGalleryItem = function(startIndex, list){
    items = list;
    currentIndex = startIndex || 0;
    showItem(currentIndex);
    bsModal.show();
  }

  function showItem(i){
    if(!items || !items.length) return;
    currentIndex = (i + items.length) % items.length;
    const it = items[currentIndex];
    titleEl.textContent = it.title || '';
    imgEl.src = it.image;
    imgEl.alt = it.title || '';
    captionEl.textContent = it.caption || '';
  }

  prevBtn.addEventListener('click', ()=> showItem(currentIndex-1));
  nextBtn.addEventListener('click', ()=> showItem(currentIndex+1));

  // keyboard navigation
  document.addEventListener('keydown', (e)=>{
    if(!document.body.classList.contains('modal-open')) return;
    if(e.key==='ArrowLeft') showItem(currentIndex-1);
    if(e.key==='ArrowRight') showItem(currentIndex+1);
    if(e.key==='Escape') bsModal.hide();
  });

})();

// Contact form JSON-export handler
(function () {
  'use strict';

  function sanitizeFilename(s) {
    if (!s) return '';
    return String(s)
      .toLowerCase()
      .trim()
      // replace any sequence of non-alphanumeric characters with underscore
      .replace(/[^a-z0-9]+/g, '_')
      // collapse multiple underscores
      .replace(/_+/g, '_')
      // trim leading/trailing underscores
      .replace(/^_+|_+$/g, '');
  }

  function buildFilenameFromFields(dataObj) {
    // prefer common names: name, email, subject (case-insensitive)
    var name = dataObj.name || dataObj.Name || dataObj.fullname || '';
    var email = dataObj.email || dataObj.Email || '';
    var subject = dataObj.subject || dataObj.Subject || '';
    var parts = [name, email, subject].map(sanitizeFilename).filter(Boolean);
    if (parts.length === 0) parts.push('message');
    // join with underscore and ensure no spaces/special chars
    return parts.join('_');
  }

  function formToObject(form) {
    var obj = {};
    try {
      var fd = new FormData(form);
      fd.forEach(function (value, key) {
        // If key repeats (checkboxes), convert to array
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          if (!Array.isArray(obj[key])) obj[key] = [obj[key]];
          obj[key].push(value);
        } else {
          obj[key] = value;
        }
      });
    } catch (e) {
      // fallback: find inputs
      var elems = form.querySelectorAll('input, textarea, select');
      elems.forEach(function (el) {
        var k = el.name || el.id || el.getAttribute('data-name');
        if (!k) return;
        var v = el.value;
        if (Object.prototype.hasOwnProperty.call(obj, k)) {
          if (!Array.isArray(obj[k])) obj[k] = [obj[k]];
          obj[k].push(v);
        } else {
          obj[k] = v;
        }
      });
    }
    return obj;
  }

  function triggerDownload(filenameBase, jsonObj) {
    var json = JSON.stringify(jsonObj, null, 2);
    var blob = new Blob([json], { type: 'application/json' });
    var filename = (filenameBase || 'message') + '.json';

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      // IE/Edge legacy
      window.navigator.msSaveOrOpenBlob(blob, filename);
      return;
    }

    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }

  async function saveFileToDirectory(filename, content) {
    // Try the File System Access API (Chromium-based browsers)
    if (window.showDirectoryPicker) {
      try {
        // Ask the user to pick a directory each time (can't reliably persist handle across sessions in all browsers)
        const dirHandle = await window.showDirectoryPicker();
        // Create or overwrite the file
        const fileHandle = await dirHandle.getFileHandle(filename, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(content);
        await writable.close();
        return { ok: true };
      } catch (err) {
        // User probably cancelled or permission denied
        return { ok: false, error: err && err.message ? err.message : String(err) };
      }
    }
    // File System Access API not available
    return { ok: false, error: 'no_fs_api' };
  }

  function handleContactSubmit(ev) {
    try {
      ev.preventDefault();
      var form = ev.target;
      // build object from all form fields
      var obj = formToObject(form);
      // build filename from name/email/subject
      // Always append a timestamp to ensure uniqueness
      var filenameBase = buildFilenameFromFields(obj) || 'message';
      var timestamp = Date.now();
      filenameBase = filenameBase + '_' + timestamp;
      var filename = filenameBase + '.json';
      var jsonString = JSON.stringify(obj, null, 2);

      // Try to save using File System Access API
      (async function () {
        var res = await saveFileToDirectory(filename, jsonString);
        if (res.ok) {
          // success
          var btn = form.querySelector('button[type="submit"]');
          if (btn) {
            var orig = btn.innerHTML;
            btn.innerHTML = 'Saved';
            setTimeout(function () { btn.innerHTML = orig; }, 1500);
          }
        } else {
          // fallback to download when FS API not available or user cancelled
          triggerDownload(filenameBase, obj);
          // Optionally log the reason
          console.warn('Save to directory failed, fallback to download:', res.error);
        }
      })();

      return false;
    } catch (err) {
      console.error('Contact form save error', err);
      return true; // allow default if something goes wrong
    }
  }

  function attachHandler() {
    // Try to find the contact form. Preference: form with onsubmit attribute from template
    var form = document.querySelector('form[onsubmit]') || document.querySelector('form.contact-form') || document.querySelector('form');
    if (!form) return;
    // remove any inline onsubmit to avoid duplicate handlers
    try { form.onsubmit = null; } catch (e) {}
    form.addEventListener('submit', handleContactSubmit, false);
  }

  // Attach on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachHandler);
  } else {
    attachHandler();
  }

})();