
const fm = FlexMasonry.init(".pic-grid", {
    responsive: true,
    breakpointCols: {
        "min-width: 960px": 2,
        "min-width: 768px": 2,
        "min-width: 576px": 1,
        "min-width: 450px": 1,
    },
});
var directions = {
    0: null,
    1: "up",
    2: "left",
    3: "down",
    4: "right"
}
document.addEventListener("DOMContentLoaded", init);
function init() {
    fm.refreshAll();

}
