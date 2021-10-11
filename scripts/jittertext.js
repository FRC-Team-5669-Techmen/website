class GlitchHandler {
    constructor(el, shake, randomize, rSpeed, rLength, sSpeed, sAmount) {
        this.shake = shake;
        this.randomize = randomize;
        this.rSpeed = rSpeed;
        this.rLength = rLength;
        this.sSpeed = sSpeed;
        this.sAmount = sAmount;
        this.el = el;
        this.rSet = "░▒▓";
        console.log('asdfasdfasdf')

        //randomize
        if (randomize) {
            setInterval(() => {
                //el.innerHTML = this.randomString();
                el.innerHTML = ""
                for (var i = 0; i < this.rLength; i++) {
                    var newEl = document.createElement('span')
                    newEl.innerHTML = this.rSet.charAt(Math.floor(Math.random() * this.rSet.length));
                    el.appendChild(newEl)
                }
                if (shake) {
                    el.childNodes.forEach(e => {
                        e.style.display = "inline-block"
                        e.style.transform = `translate(${Math.floor((Math.random() - .5) * this.sAmount)}px, ${Math.floor((Math.random() - .5) * this.sAmount)}px)`
                    })
                }
            }, this.rSpeed);
        }

        //shake
        if (shake) {
            el.style.display = `inline-block`
            setInterval(() => {
                let child = this.el.childNodes[0]
                if (child.nodeType == 3) {
                    this.processContentShake()
                }
                if (child.nodeType == 1) {
                    el.childNodes.forEach(e => {
                        e.style.display = "inline-block"
                        e.style.transform = `translate(${Math.floor((Math.random() - .5) * this.sAmount)}px, ${Math.floor((Math.random() - .5) * this.sAmount)}px)`
                    })
                }
            }, this.sSpeed);
        }
    }
    randomString() {
        let result = "";
        for (var i = 0; i < this.rLength; i++) {
            result += this.rSet.charAt(Math.floor(Math.random() * this.rSet.length));
        }
        return result;
    }
    processContentShake() {
        //this.el.style.transform = `translate(` + Math.floor((Math.random()-.5) * this.sAmount) + `px, `  + Math.floor((Math.random()-.5) * this.sAmount) + `px)`
        /*let characters = []
        for(let i=0; i<this.el.innerHTML.length; i++){
            characters.push(`<span>` + this.el.innerHTML.charAt(i) + "</span>")
        }
        let finalString = characters.join('')
        return finalString*/
        console.log('cum')
        let inner = this.el.innerHTML;
        this.el.innerHTML = ""
        for (var i = 0; i < inner.length; i++) {
            var newEEl = document.createElement('span')
            newEEl.innerHTML = inner.charAt(i)
            console.log('cumcum')
            this.el.appendChild(newEEl)
        }
    }
    turnOnShake() {
      this.shake = true
    }
    turnOffShake() {
      this.shake = false
    }
    setShake(speed,amt) {
      this.sSpeed = speed
      this.sAmount = amt
    }
}