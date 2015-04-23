/**
 * Created by papostol on 23/04/2015.
 */


;(function(window, document) {
  var markdownEl = document.getElementsByTagName('xmp')[0] || document.getElementsByTagName('textarea')[0];
  if (!markdownEl) {
    return;
  }

  // Hide body until we're done fiddling with the DOM
  //document.body.style.display = 'none';


  // Get theme
  var theme = markdownEl.getAttribute('theme') || 'bootstrap';
  theme = theme.toLowerCase();

  // Stylesheets
  var linkEl = document.createElement('link');
  linkEl.href = 'themes/layout/'+theme+'/bootstrap.min.css';
  linkEl.rel = 'stylesheet';
  document.head.appendChild(linkEl);


  // Get highlighing
  var codeTheme = markdownEl.getAttribute('code') || 'arta';
  codeTheme = codeTheme.toLowerCase();

  var linkCode = document.createElement('link');
  linkCode.href = 'themes/highlight/'+codeTheme+'.css';
  linkCode.rel = 'stylesheet';
  document.head.appendChild(linkCode);


  //////////////////////////////////////////////////////////////////////
  //
  // <body> stuff
  //
  var markdown = markdownEl.textContent || markdownEl.innerText;

  var container = document.createElement('div');
  container.className = 'container';
  container.id = 'content';
  container.innerHTML = marked(markdown);
  document.body.replaceChild(container, markdownEl);


  // KaTeXing
  renderMathInElement(document.body);

  // Highlighting
  hljs.initHighlightingOnLoad();

  hljs.initLineNumbersOnLoad();

  // All done - show body
  document.body.style.display = '';
})(window, document);

// Collapsible menu
function nbar_toggle(){
  var nbar=document.getElementById("navbar-main");
  var nbar_t=nbar.className;
  if(nbar_t.indexOf("collapse")>-1){
    nbar.className=nbar.className.replace(/collapse/g,"open");
  }else{
    nbar.className=nbar.className.replace(/open/g,"collapse");
  }
}

function dmenu_toggle(p,x){
  var dmenu=(x===1)?p.parentNode:p;
  var dmenu_t=dmenu.className;
  if(dmenu_t.indexOf("open")>-1||x===2){
    dmenu.className=dmenu.className.replace(/open/g,"");
  }else{
    dmenu.className=dmenu.className + " open";
  }
}

// Add handler : Hide Dropdowns when clicking outside
document.documentElement.addEventListener('mouseup', function(e){
  var ddowns = document.getElementsByClassName("dropdown");
  for (var i = 0; i < ddowns.length; i++) {
    var ddown = ddowns[i];
    if (!ddown.contains(e.target))
      dmenu_toggle(ddown,2);
  }
});



