var PicModal = {
    init: function () {
        this.modalParent = q.get("#imgModal");
        this.modalImg = q.get("#modalImg");
        this.hammer = new Hammer(this.modalParent);
        this.hammer.on("swipe", function (ev) {
            console.log(directions[ev.direction]);
        });
        var tempImg = q.getAll("[data-modal-img]")
        tempImg.forEach((e, i) => {
            var obj = {
                src: e.src || null,
                name: e.name || null,
                el: e,
                index: i
            }
            this.eventListeners(e)
            e.setAttribute("data-modal-index", i)
            this.images[i] = obj
        })

        this.modalParent.addEventListener("click", (e) => {
            if (e.target == this.modalParent) {
                this.closeModal()
            }
        })
    },
    toggleModal: function () {

    },
    openModal: function () {
        disableScroll()
        this.modalParent.classList.remove("modalClosed")

    },
    closeModal: function () {
        enableScroll()
        this.modalParent.classList.add("modalClosed")
    },
    eventListeners: function(e) {
        e.addEventListener("click", openModal)
        e.addEventListener("touch", openModal)
    },
    modalParent: null,
    modalImg: null,
    hammer: null,
    modalOpen: false,
    images: {

    }
}


function toggleModal() {
    PicModal.toggleModal()
}

function openModal() {
    PicModal.openModal()
}

function closeModal() {
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