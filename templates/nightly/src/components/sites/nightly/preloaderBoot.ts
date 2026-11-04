/** Inline in <body> so the overlay shows before React hydrates; plays once per browser session. */
export const PRELOADER_BOOT = `(function(){try{var h=document.documentElement;if(matchMedia("(prefers-reduced-motion: reduce)").matches){h.setAttribute("data-ngw","seen");return}if(sessionStorage.getItem("ngw")){h.setAttribute("data-ngw","seen")}else{sessionStorage.setItem("ngw","1");h.setAttribute("data-ngw","run")}}catch(e){}})()`;

