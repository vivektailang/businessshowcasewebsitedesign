# businessshowcasewebsitedesign

Business Showcase Website Design

This is a starter static website scaffold for a business-focused catalog and image gallery built with HTML5, Bootstrap 5, and vanilla JavaScript.

What’s included
- index.html: single-page responsive site
- assets/css/styles.css: custom styles and brand color overrides
- assets/js/main.js: site-wide behavior and lightbox
- assets/js/gallery.js: JSON-driven gallery rendering
- data/products.json: sample product metadata to drive the gallery
- assets/images/: placeholder SVGs for logo and product images

How to run
1. Prefer serving the site from a local static server to allow fetch requests to work.

   Using Python 3 (works in cmd.exe):

   ```cmd
   python -m http.server 8000
   ```

   Then open http://localhost:8000/businessshowcasewebsitedesign/ in your browser.

2. Or open `index.html` directly in the browser, but note some browsers block fetch() from file:// URLs.

Running under Apache httpd (Windows) and opening in Eclipse

This project is a static website and can be served by any static HTTP server. Below are step-by-step instructions to run it using Apache httpd on Windows and to view/edit it in Eclipse.

1) Check Apache httpd installation
- If `httpd` is not in your PATH or service, install Apache HTTP Server for Windows from https://httpd.apache.org/ or use the Apache distribution bundled with WAMP/XAMPP.
- After installing, confirm `httpd -v` works in cmd.exe.

2) Add a VirtualHost (example)
- Use the provided example virtual host configuration in `apache/httpd-vhost-example.conf`.
- Edit the paths if your Apache installation expects a different root. The example listens on port 8080 to avoid conflicts with other services.

3) Configure Windows hosts file (optional)
- To use the `ServerName` from the example, add this line to `C:\Windows\System32\drivers\etc\hosts` (run Notepad as Administrator):

```
127.0.0.1 businessshowcase.local
```

4) Restart Apache and open the site
- Restart Apache service or run `httpd -k restart` in an elevated cmd.
- Visit http://localhost:8080/ or http://businessshowcase.local:8080/ in your browser.

Serve directly from Eclipse (optional)
- Eclipse can edit files in your workspace; this project is already placed inside your workspace at `businessshowcasewebsitedesign`.
- To preview in Eclipse, right-click the `index.html` file and choose "Open With... > Web Browser" (works if Eclipse has the Web Tools installed).
- For a local server preview inside Eclipse, install the Eclipse Web Tools Platform (WTP) and add an External Web Server or use a local Tomcat if you prefer (Tomcat serves dynamic apps; for static files Apache or a static server is simpler).

Notes
- Browsers sometimes block fetch() for local `file://` pages; prefer serving via HTTP.
- If you use Python's `http.server` for quick tests, ensure you run it from the parent directory so the URL path matches (see README above).

Example virtual host content: `apache/httpd-vhost-example.conf`

````
<VirtualHost *:8080>
    DocumentRoot "C:/path/to/your/businessshowcasewebsitedesign"
    ServerName businessshowcase.local

    <Directory "C:/path/to/your/businessshowcasewebsitedesign">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
````

Customization
- Replace `assets/images/logo.svg` with your logo.
- Update brand colors in `assets/css/styles.css` (CSS variables at the top).
- Edit `data/products.json` to add/remove products. The gallery reads this file at page load (fetch).

Accessibility & Performance
- Images use `loading="lazy"` and the gallery supports keyboard navigation in the lightbox.
- For production, replace SVG placeholders with optimized JPEG/WebP images and add `srcset` for responsive sizes.

Next steps
- Provide brand colors, logo files, and real product images for a more refined visual style.