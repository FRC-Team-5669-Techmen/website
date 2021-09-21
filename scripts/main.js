/*
██╗░░██╗░█████╗░██████╗░███████╗░░███╗░░██╗███████╗███╗░░██╗██╗
██║░██╔╝██╔══██╗██╔══██╗██╔════╝░░████╗░██║██╔══██║████╗░██║██║
█████═╝░██║░░██║██████╔╝███████╗░░██╔██╗██║███████║██╔██╗██║██║
██╔═██╗░██║░░██║██╔══██╗██╔════╝░░██║░████║██╔══██║██║░████║██║
██║░░██╗╚█████╔╝██║░░██║███████╗░░██║░░███║██║░░██║██║░░███║██║
╚═╝░░╚═╝░╚════╝░╚═╝░░╚═╝╚══════╝░░╚═╝░░╚══╝╚═╝░░╚═╝╚═╝░░╚══╝╚═╝
███╗░░██╗███████╗██╗░░██╗░█████╗░
████╗░██║██╔════╝██║░██╔╝██╔══██╗
██╔██╗██║███████╗█████═╝░██║░░██║
██║░████║██╔════╝██╔═██╗░██║░░██║
██║░░███║███████╗██║░░██╗╚█████╔╝
╚═╝░░╚══╝╚══════╝╚═╝░░╚═╝░╚════╝░
*/

async function checkIfDebug() {
  await fetch("../DEBUG")
    .then(response => response.json()).catch(() => {
      debug = false
    })
}

var debug = true;

function page(site) {
  console.log(site)
  console.log(window.location.pathname.split("/").pop())
  if (site != window.location.pathname.split("/").pop()) {
    document.getElementById('loader').style.opacity = "1";
    setTimeout(() => {
      if (debug && site != "../") window.location.href = site + ".html"
      if (!debug) {
        window.location.href = site
        console.warn("cum")
      }
    }, 300)
  }
  return false
}
function homeUnfocusBg() {
  let yt = (document.getElementById("home-yt"))
  yt.style.filter = "blur(5px)"
}
function homeFocusBg() {
  let yt = (document.getElementById("home-yt"))
  yt.style.filter = "blur(0px)"
}
function openNav() {
  document.getElementById('nav-cont').classList.remove('closed');
}
function closeNav() {
  document.getElementById('nav-cont').classList.add('closed');
}
let grid
function load() {

  if (document.querySelector('.pic-grid')) document.querySelector('.pic-grid').style.opacity = 1;
  else if (document.querySelector('.spon-grid')) document.querySelector('.spon-grid').style.opacity = 1;

  function layout() {
    /* keep track of column heights */
    let initial_height = grid.items[0]._el.getBoundingClientRect().top;
    grid.col_heights = new Map();
    grid.items.forEach(c => {
      /* get left offset for every item of the current grid */
      let rect = c._el.getBoundingClientRect();
      c.off = rect.left;
      grid.col_heights.set(c.off, initial_height);
    });

    /* if the number of columns has changed */
    if (grid.ncol === grid.col_heights.size) {
      return "fuck"
    }
    /* update number of columns */
    grid.ncol = grid.col_heights.size;

    /* revert to initial positioning, no margin */
    grid.items.forEach(c => c._el.style.removeProperty('margin-top'));

    if (grid.ncol === 1) {
      return "me"
    }
    /* if we have more than one column */

    grid.items.forEach(grid_item => {
      let rect = grid_item._el.getBoundingClientRect();
      /* get height of masonry-ed column */
      let col_height = grid.col_heights.get(grid_item.off);
      /* set marginTop to different between where it is and where it should be */
      grid_item._el.style.marginTop = `${col_height - rect.top}px`;
      /* update col_height with element height */
      col_height += grid_item._el.offsetHeight + grid.gap;
      grid.col_heights.set(grid_item.off, col_height);
    })
    return "aa"
  }

  if (document.querySelector('.pic-grid')) {
    grid = { _el: document.querySelector('.pic-grid'), ncol: 0 };

    grid.items = [...grid._el.childNodes].filter(c => c.nodeType === 1).map(c => ({ _el: c }));
    grid.gap = parseFloat(getComputedStyle(grid._el).gridRowGap);


    layout(); /* initial load */
    addEventListener('resize', layout, false) /* on resize */
  } else if (document.querySelector('.spon-grid')) {
    grid = { _el: document.querySelector('.spon-grid'), ncol: 0 };

    grid.items = [...grid._el.childNodes].filter(c => c.nodeType === 1).map(c => ({ _el: c }));
    grid.gap = parseFloat(getComputedStyle(grid._el).gridRowGap);


    layout(); /* initial load */
    addEventListener('resize', layout, false) /* on resize */
  }
  //populate navbar
  if (document.getElementById("footer")) document.getElementById("footer").innerHTML = `
    
    
          <div class='footer-left'>
            <div class="footer-col footer-logo">
              <img src="../assets/logos/marks/svg/Mark-Gold.svg" />
            </div>
            <div class="footer-col footer-links">
              <div class="footer-links-cont">
              <strong>Techmen<br>Robotics</strong>
                <a href="../" onclick="page('../'); return false;" data-anchor>Home</a>
                <a href="../about" onclick="page('../about'); return false;" data-anchor>About</a>
              </div>
            </div>
          </div>
          <div class="footer-col footer-links">
            <div class="footer-links-cont">
              <strong>Resources</strong>
              <a href="https://handbook.frcteam5669.com" target="_blank">Handbook</a>
              <a href="https://drive.google.com/drive/folders/1ATOVMiWe1gzM9hSd882fIrN3rH25tqjJ?usp=sharing" target="_blank">CAD</a>
              <a href="https://github.com/FRC-Team-5669-Techmen" target="_blank">Code</a>
            </div>
          </div>
          <div class="footer-col footer-links">
            <div class="footer-links-cont">
              <strong>Outreach</strong>
              <a href="../outreach/contact" onclick="page('../outreach/contact'); return false;" data-anchor>Contact</a>
              <a href="../outreach/branding" onclick="page('../outreach/branding'); return false;" data-anchor>Branding</a>
              <a href="../outreach/pictures" onclick="page('../outreach/pictures'); return false;" data-anchor>Pictures</a>
              <a href="../outreach/sponsors" onclick="page('../outreach/sponsors'); return false;" data-anchor>Sponsors</a>
            </div>
          </div>`

  document.getElementById('navbar').innerHTML = `
    <div class='nav-logo' onclick="page('../')"><img src="../assets/logos/logo-border.svg" alt="Logo"></div>
    <div id="nav-open" onclick="openNav()"><i class="ri-menu-line"></i></div>
    <div id="nav-cont" class="nav-cont closed">
        <div id="nav-close" onclick="closeNav()"><i class="ri-close-fill"></i></div>
        <div class='nav-logo-text' onclick="page('../')">Techmen Robotics</div>
        <div class="nav-buttons">
            <div id="nav-index" class="nav-btn unselect" onclick="page('../index.html')">
                <div class='nav-btn-title'>home</div>
            </div>
            <div id="nav-about" class="nav-btn unselect" onclick="page('../about.html')">
                <div class='nav-btn-title'>about</div>
            </div>
            <div id="nav-resources" class="nav-btn dropdown unselect">
                <div class='nav-btn-title' onclick="openNavDrop(this)">Resources +</div>
                    <div class="nav-dropdown" data-dropdown>
                        <div id="nav-handbook" class="drop-btn" onclick="window.open('https://handbook.frcteam5669.com', '_blank').focus();">handbook</div>
                        <div id="nav-cad" class="drop-btn" onclick="window.open('https://drive.google.com/drive/folders/1ATOVMiWe1gzM9hSd882fIrN3rH25tqjJ?usp=sharing', '_blank').focus();">CAD</div>
                        <div id="nav-code" class="drop-btn" onclick="window.open('https://github.com/FRC-Team-5669-Techmen', '_blank').focus();">code</div>` +
    //<div id="nav-videos" class="drop-btn" onclick="page('../resources/videos.html')">videos</div>
    //<div id="nav-commentary" class="drop-btn" onclick="page('../resources/commentary.html')">commentary</div>
    ` </div>
            </div>
            <div id="nav-outreach" class="nav-btn dropdown unselect">
                <div class='nav-btn-title' onclick="openNavDrop(this)">Outreach +</div>
                <div class="nav-dropdown" data-dropdown>
                    <div id="nav-contact" class="drop-btn" onclick="page('../outreach/contact.html')">Contact</div>
                    <div id="nav-branding" class="drop-btn" onclick="page('../outreach/branding.html')">Branding</div>
                    <div id="nav-pictures" class="drop-btn" onclick="page('../outreach/pictures.html')">Pictures</div>
                    <div id="nav-sponsors" class="drop-btn" onclick="page('../outreach/sponsors.html')">Sponsors</div>
                </div>
            </div>
        </div>
        
    </div>`
  checkIfDebug().then(() => {
    let anchors = document.querySelectorAll("[data-anchor]").forEach(e => {
      if (e.href.split("/").pop() != "") {
        if (e.href.split("/").pop().endsWith(".html") == false) {
          if (debug) e.href = e.href + ".html"
        }
      }
    });

  })
  let page = window.location.pathname.split("/")[1].replace('.html', '') || "index"
  document.getElementById("nav-" + page).classList.add('active')
  if (window.location.pathname.split("/").length > 2) {
    document.getElementById("nav-" + window.location.pathname.split("/")[2].replace('.html', '')).classList.add('active')
  }



  //clearInterval(interv)
  //load loader
  var t1 = performance.now();
  console.log(1000 - t1 + t0)
  function handleLoad() {
    document.getElementById('loader').style.opacity = "0";
    document.getElementById('main').classList.remove('hidden');
    document.querySelectorAll('[data-dropdown]').forEach((e) => {

      let height = (e.scrollHeight + "px")
      console.log(height)
      e.style.setProperty("--transHeight", height)
    })
    setTimeout(() => {
      document.getElementById('loader-cont').style.opacity = "0";
      layout()
      if (document.querySelector('.pic-grid')) document.querySelector('.pic-grid').style.opacity = 1;
      else if (document.querySelector('.spon-grid')) document.querySelector('.spon-grid').style.opacity = 1;
      if (AOS) AOS.init()
    }, 301)
  }
  if (1000 - t1 + t0 <= 0) {
    handleLoad()
  } else if (1000 - t1 + t0 > 0) {
    let interval = 1000 - elapsed
    setTimeout(() => {
      handleLoad()
    }, 1000 - t1 + t0)
  }



}
let elapsed = 0
var t0 = performance.now();
console.log(t0)


function openNavDrop(e) {
  if (e.nextElementSibling.classList.contains("nav-dropdown-vis")) {
    e.nextElementSibling.classList.remove("nav-dropdown-vis")
  } else {
    e.nextElementSibling.classList.add("nav-dropdown-vis")
  }
}



var clipboardToIE11Formatting = {
  "text/plain": "Text",
  "text/html": "Url",
  "default": "Text"
}

var defaultMessage = "Copy to clipboard: #{key}, Enter";

function format(message) {
  var copyKey = (/mac os x/i.test(navigator.userAgent) ? "⌘" : "Ctrl") + "+C";
  return message.replace(/#{\s*key\s*}/g, copyKey);
}

function copy(text, options) {
  var debug,
    message,
    reselectPrevious,
    range,
    selection,
    mark,
    success = false;
  if (!options) {
    options = {};
  }
  debug = options.debug || false;
  try {

    range = document.createRange();
    selection = document.getSelection();

    mark = document.createElement("span");
    mark.textContent = text;
    // reset user styles for span element
    mark.style.all = "unset";
    // prevents scrolling to the end of the page
    mark.style.position = "fixed";
    mark.style.top = 0;
    mark.style.clip = "rect(0, 0, 0, 0)";
    // used to preserve spaces and line breaks
    mark.style.whiteSpace = "pre";
    // do not inherit user-select (it may be `none`)
    mark.style.webkitUserSelect = "text";
    mark.style.MozUserSelect = "text";
    mark.style.msUserSelect = "text";
    mark.style.userSelect = "text";
    mark.addEventListener("copy", function (e) {
      e.stopPropagation();
      if (options.format) {
        e.preventDefault();
        if (typeof e.clipboardData === "undefined") { // IE 11
          debug && console.warn("unable to use e.clipboardData");
          debug && console.warn("trying IE specific stuff");
          window.clipboardData.clearData();
          var format = clipboardToIE11Formatting[options.format] || clipboardToIE11Formatting["default"]
          window.clipboardData.setData(format, text);
        } else { // all other browsers
          e.clipboardData.clearData();
          e.clipboardData.setData(options.format, text);
        }
      }
      if (options.onCopy) {
        e.preventDefault();
        options.onCopy(e.clipboardData);
      }
    });

    document.body.appendChild(mark);

    range.selectNodeContents(mark);
    selection.addRange(range);

    var successful = document.execCommand("copy");
    if (!successful) {
      throw new Error("copy command was unsuccessful");
    }
    success = true;
  } catch (err) {
    debug && console.error("unable to copy using execCommand: ", err);
    debug && console.warn("trying IE specific stuff");
    try {
      window.clipboardData.setData(options.format || "text", text);
      options.onCopy && options.onCopy(window.clipboardData);
      success = true;
    } catch (err) {
      debug && console.error("unable to copy using clipboardData: ", err);
      debug && console.error("falling back to prompt");
      message = format("message" in options ? options.message : defaultMessage);
      window.prompt(message, text);
    }
  } finally {
    if (selection) {
      if (typeof selection.removeRange == "function") {
        selection.removeRange(range);
      } else {
        selection.removeAllRanges();
      }
    }

    if (mark) {
      document.body.removeChild(mark);
    }
  }

  return success;
}