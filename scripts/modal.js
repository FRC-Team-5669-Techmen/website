var PicModal = {
    init: function () {
        this.modalParent = q.get("#imgModal");
        this.modalImg = q.get("#modalImg");
        this.modalImgParent = q.get("#modalImgParent");
        this.modalTitle = q.get("#modalTitle");
        this.modalPage = q.get("#modalPaginator");
        this.hammer = new Hammer(this.modalParent);
        this.hammer.on("swipe", function (ev) {
            if (directions[ev.direction] == 'left') {
                shiftForward()
            } else if (directions[ev.direction] == 'right') {
                shiftBack()
            }
        });
        var tempImg = q.getAll("[data-modal-img]")
        tempImg.forEach((e, i) => {
            var obj = {
                src: e.src || null,
                name: e.alt || null,
                el: e,
                index: i,
                vert: e.naturalWidth < e.naturalHeight
            }
            this.eventListeners(e)
            e.setAttribute("data-modal-index", i)
            this.images[i] = obj
        })

        this.images.length = tempImg.length

        this.modalParent.addEventListener("click", (e) => {
            if (e.target == this.modalParent || e.target == this.modalImgParent) {
                this.closeModal()
            }
        })
    },
    toggleModal: function () {

    },
    shiftForward: function () {
        this.curIndex += 1;
        this.modalImg.classList.add("modalFade")
        if (this.curIndex > this.images.length - 1) {
            this.curIndex -= this.images.length
        }
        setTimeout(() => {
            this.updateModal()
            this.modalImg.classList.remove("modalFade")
        }, 300);
    },
    shiftBack: function () {
        this.curIndex -= 1;
        if (this.curIndex < 0) {
            this.curIndex += this.images.length
        }
        this.modalImg.classList.add("modalFade")
        setTimeout(() => {
            this.updateModal()
            this.modalImg.classList.remove("modalFade")
        }, 300);

    },
    updateModal: function () {
        this.modalImg.removeAttribute("data-modal-vert")
        let image = this.images[this.curIndex]
        if (image.vert) this.modalImg.setAttribute("data-modal-vert", "a")
        smoothScroll(image.el)
        this.modalImg.src = image.src
        this.modalTitle.innerHTML = image.name
        this.modalPage.innerHTML = (parseInt(this.curIndex) + 1) + "/" + this.images.length
        this.modalImg.alt = image.name || ""
    },
    openModal: function (e) {
        this.modalImg.removeAttribute("data-modal-vert")
        if (!"data-modal-img" in e.target.attributes) {
            return
        }
        this.curIndex = parseInt(e.target.attributes["data-modal-index"].value)
        this.updateModal()
        disableScroll()
        this.modalParent.classList.remove("modalClosed")

    },
    closeModal: function () {
        enableScroll()
        this.modalParent.classList.add("modalClosed")
    },
    eventListeners: function (e) {
        e.addEventListener("click", openModal)
        e.addEventListener("touchEnd", openModal)
    },
    modalParent: null,
    modalImg: null,
    hammer: null,
    modalOpen: false,
    modalImgParent: null,
    modalTitle: null,
    modalPage: null,
    curIndex: null,
    images: {

    }
}

function shiftForward() {
    PicModal.shiftForward()
}

function shiftBack() {
    PicModal.shiftBack()
}


function smoothScroll(el) {
    el.scrollIntoView({
        behavior: 'smooth',
        block: "center"
    });
}

function toggleModal() {
    PicModal.toggleModal()
}

function openModal(e) {
    PicModal.openModal(e)
}

function closeModal(e) {
    PicModal.closeModal()
}


var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

function preventDefault(e) {
    e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

var supportsPassive = false;
try {
    window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
        get: function () { supportsPassive = true; }
    }));
} catch (e) { }

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
function disableScroll() {
    window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
    window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
    window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}
function enableScroll() {
    window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
    window.removeEventListener('touchmove', preventDefault, wheelOpt);
    window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}







let oTtext;
let oTupdating = true;
let oTspeed;
let oTtitle;
function writeOutTitle() {
    setTimeout(() => {
        oTtext = oTtext.slice(0, -1);
        oTtitle.innerHTML = oTtext;
        if (oTtitle.innerHTML == 0) {
            oTupdating = false;
        }
        if (oTupdating) writeOutTitle();
    }, oTspeed)
}
function initWOT() {
    oTtitle = q.get("#title");
    q.c.log(oTtitle)
    oTtext = oTtitle.innerHTML;
    oTspeed = Math.round(300 / oTtext.length); // ms before text updates again
    oTupdating = true;
    writeOutTitle()
}


let tcontent;
let tindex = 0;
let tframe = 0;
let trand = "";
let tnorm = "";
let tintervals = 8; // how many times text glitches before going normal
let tupdating = true;
let tspeed; // ms before text updates again

let char = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*_+-=";
function writeOnT(t) {
    tcontent = t;
    tspeed = 700 / ((tintervals + 1) * tcontent.length)
    setTimeout(() => {
        if (tupdating) {
            tframe++;
            trand = char.charAt(Math.floor(Math.random() * char.length));
            if (tindex <= tcontent.length) {
                //q.get("#title").innerHTML = tnorm + trand;
                console.log(tnorm + trand)
            } else {
                //q.get("#title").innerHTML = tnorm;
                console.log(tnorm)
            }
            if (tframe == tintervals) {
                if (tnorm == undefined) {
                    tnorm = tcontent.charAt(tindex);
                } else {
                    tnorm = tnorm + tcontent.charAt(tindex);
                }
                tframe = 0;
                tindex++;
            }
            if (tindex == tcontent.length) {
                //q.get("#title").innerHTML = tnorm;
                console.log(tnorm)
                tupdating = false;
            }
            writeOnT(t);
        }
    }, tspeed);
    if (tupdating == false) {
        //q.get("#title").innerHTML = t;
        console.log(t)
        tcontent = "";
        tindex = 0;
        tframe = 0;
        trand = "";
        tnorm = "";
        tintervals = 8; // how many times text glitches before going normal
        tspeed = 0; // ms before text updates again
    }

}