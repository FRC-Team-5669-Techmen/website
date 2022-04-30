var directions = {
    0: null,
    1: "up",
    2: "left",
    3: "down",
    4: "right"
}
document.addEventListener("DOMContentLoaded", init);

async function init() {
    readJsonFile(dataCallback);
}

function dataCallback(json) {
    var yearsEl = document.getElementById('year-selector');
    for (const key in json["order"]) {
        if (Object.hasOwnProperty.call(json["order"], key)) {
            const element = json["order"][key];
            createPictures(element, json)
            yearsEl.innerHTML += `<a href="javascript:scroll('#pic-${element}')">${element}</a>`
        }
    }
    const fm = FlexMasonry.init(".pic-grid", {
        responsive: true,
        breakpointCols: {
            "min-width: 960px": 2,
            "min-width: 768px": 2,
            "min-width: 576px": 1,
            "min-width: 450px": 1,
        },
    });
    fm.refreshAll();
}

function createPictures(t, json) {
    var photosEl = document.getElementById('photos-main');
    var picData = "";
    picData += `<h2 id="pic-${t}">${t}</h2>`
    picData += "<div class='pic-grid'>"
    for (let i = 0; i < json[t].length; i++) {
        const element = json[t][i];
        picData += `
        <div class="pic-parent" data-aos="fade-in">
            <div class="bottom-triangle"></div>
            <img src="${element}" alt="photo" data-modal-img />
        </div>
        <!--
-->`
    }
    picData += "</div>"
    photosEl.innerHTML = picData + photosEl.innerHTML
}

async function readJsonFile(callback) {

    var rawFile = await new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", "./photos.json", true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(JSON.parse(rawFile.responseText))
        }
    }
    rawFile.send(null);

}