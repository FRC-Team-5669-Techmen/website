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
function page(site) {
    console.log(site)
    console.log(window.location.pathname.split("/").pop())
    if (site != window.location.pathname.split("/").pop()) {
        document.getElementById('loader').style.opacity = "1";
        setTimeout(() => {
            window.location.href = site
        }, 300)
    }
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
    document.getElementById('navbar').innerHTML = `
    <div class='nav-logo'><img src="../logo.svg" alt="Logo"></div>
    <div id="nav-open" onclick="openNav()"><i class="ri-menu-line"></i></div>
    <div id="nav-cont" class="nav-cont closed">
        <div id="nav-close" onclick="closeNav()"><i class="ri-close-fill"></i></div>
        <div class='nav-logo-text'>Techmen Robotics</div>
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
                    <div id="nav-brand" class="drop-btn" onclick="page('../outreach/brand.html')">Brand</div>
                    <div id="nav-pictures" class="drop-btn" onclick="page('../outreach/pictures.html')">Pictures</div>
                    <div id="nav-sponsors" class="drop-btn" onclick="page('../outreach/sponsors.html')">Sponsors</div>
                </div>
            </div>
        </div>
        
    </div>`
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
