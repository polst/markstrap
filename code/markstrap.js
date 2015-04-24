/**
 * Created by papostol on 23/04/2015.
 */

;(function(window, document) {
  var markdownEl = document.getElementsByTagName('xmp')[0] || document.getElementsByTagName('textarea')[0];
  if (!markdownEl) {
    return;
  }

  // Get theme
  if(!window.localStorage['themes']) {
    var theme = markdownEl.getAttribute('theme') || 'bootstrap';
    theme = theme.toLowerCase();
    window.localStorage['themes'] = theme;
  }

  // Stylesheets
  //window.themes =
    create_style('themes', getLayoutTheme());

  // Get highlighing
  if(!window.localStorage['highlight']) {
    var codeTheme = markdownEl.getAttribute('code') || 'arta';
    codeTheme = codeTheme.toLowerCase();
    window.localStorage['highlight'] = codeTheme;
  }

  //window.highlight =
    create_style('highlight', getCodeTheme());

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

function getLayoutTheme() {
  return '/themes/layout/' + window.localStorage['themes'] + '/bootstrap.min.css';
}

function getCodeTheme() {
  return '/themes/highlight/' + window.localStorage['highlight'] + '.css';
}

function getTheme(type, theme) {
  window.localStorage[type] = theme;
  switch (type) {
    case 'themes':
      return getLayoutTheme();
      break;
    case 'highlight':
      return getCodeTheme();
      break;
  }
}


function change_theme(str, theme) {
  var type = str.toLowerCase();
  document.getElementById('style-' + type).href = getTheme(type, theme);
}

// create element to attach style
function create_style(type, href) {
  var linkEl = document.createElement('link');
  linkEl.href = href;
  linkEl.rel = 'stylesheet';
  linkEl.id = 'style-' + type;
  document.head.appendChild(linkEl);
  return linkEl;
}

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
//Toggle dropdown menus
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


// makes mermaid to display SVG labels instead of HTML ones
var mermaid_config = {
  startOnLoad:true,
  htmlLabels:false
};

