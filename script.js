
(() => {
  const header = document.getElementById("siteHeader");
  const menuButton = document.getElementById("menuButton");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll("a") : [];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Add a Privacy Policy link to the footer on every page without requiring
  // separate edits to each HTML file.
  const footerMeta = document.querySelector(".footer-meta");
  if (footerMeta && !footerMeta.querySelector('a[href="privacy.html"]')) {
    const careerLink = footerMeta.querySelector('a[href="careers.html"]');
    if (careerLink && careerLink.parentElement) {
      careerLink.parentElement.insertAdjacentHTML("beforeend", ' • <a href="privacy.html">Privacy Policy</a>');
    } else {
      footerMeta.insertAdjacentHTML("beforeend", '<p><a href="privacy.html">Privacy Policy</a></p>');
    }
  }


  // Highlight the current page in both desktop and mobile navigation.
  const currentPage = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".desktop-nav a, .mobile-menu a").forEach(link => {
    const target = (link.getAttribute("href") || "").split("#")[0].split("?")[0].toLowerCase();
    if (target === currentPage) link.classList.add("active");
  });

  const updateHeader = () => header?.classList.toggle("scrolled", window.scrollY > 28);
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  const closeMenu = () => {
    if (!mobileMenu || !menuButton) return;
    mobileMenu.classList.remove("open");
    header?.classList.remove("menu-visible");
    document.body.classList.remove("menu-open");
    menuButton.setAttribute("aria-expanded","false");
    menuButton.setAttribute("aria-label","Open menu");
    menuButton.innerHTML = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 7h14M5 12h14M5 17h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
  };

  const openMenu = () => {
    if (!mobileMenu || !menuButton) return;
    mobileMenu.classList.add("open");
    header?.classList.add("menu-visible");
    document.body.classList.add("menu-open");
    menuButton.setAttribute("aria-expanded","true");
    menuButton.setAttribute("aria-label","Close menu");
    menuButton.innerHTML = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
  };

  menuButton?.addEventListener("click",()=>mobileMenu.classList.contains("open") ? closeMenu() : openMenu());
  mobileLinks.forEach(link=>link.addEventListener("click",closeMenu));
  window.addEventListener("resize",()=>{ if(window.innerWidth>1120) closeMenu(); });

  const reveals = document.querySelectorAll(".reveal");
  if (!reduced && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },{threshold:.1,rootMargin:"0px 0px -35px 0px"});
    reveals.forEach(el=>observer.observe(el));
  } else {
    reveals.forEach(el=>el.classList.add("visible"));
  }

  const tilt = (card,strength=10)=>{
    card.addEventListener("pointermove",e=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width;
      const y=(e.clientY-r.top)/r.height;
      card.style.setProperty("--lx",(x*100)+"%");
      card.style.setProperty("--ly",(y*100)+"%");
      card.style.transform=`perspective(900px) rotateX(${(0.5-y)*strength}deg) rotateY(${(x-0.5)*strength}deg) translateY(-5px)`;
    });
    card.addEventListener("pointerleave",()=>card.style.transform="");
  };
  if(canHover && !reduced) document.querySelectorAll(".tilt").forEach(card=>tilt(card,10));

  const faqs=document.querySelectorAll(".faq-item");
  faqs.forEach(item=>{
    const btn=item.querySelector(".faq-q");
    btn?.addEventListener("click",()=>{
      const isOpen=item.classList.toggle("open");
      btn.setAttribute("aria-expanded",String(isOpen));
    });
  });

  const lightbox=document.getElementById("lightbox");
  const lightboxImage=document.getElementById("lightboxImage");
  const lightboxClose=document.getElementById("lightboxClose");
  const closeLightbox=()=>{
    if(!lightbox) return;
    lightbox.classList.remove("open");
    document.body.classList.remove("lightbox-open");
    if(lightboxImage) lightboxImage.src="";
  };
  document.querySelectorAll("[data-lightbox]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const img=btn.querySelector("img");
      lightboxImage.src=btn.dataset.lightbox;
      lightboxImage.alt=img?.alt || "Peaceful Harmony photo";
      lightbox.classList.add("open");
      document.body.classList.add("lightbox-open");
      lightboxClose?.focus();
    });
  });
  lightboxClose?.addEventListener("click",closeLightbox);
  lightbox?.addEventListener("click",e=>{if(e.target===lightbox) closeLightbox();});

  document.addEventListener("keydown",e=>{
    if(e.key==="Escape"){closeMenu();closeLightbox();}
  });
})();
