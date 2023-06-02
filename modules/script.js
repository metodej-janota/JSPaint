//Server
const socket = io("http://localhost:3000")

//Canvasy
let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")
let canvasGRID = document.getElementById("canvasGRID")
let ctxGRID = canvasGRID.getContext("2d")
let canvasHOVER = document.getElementById("canvasHOVER")

//Proměné clienta
let ifMouseDown = false
let drawingHistory = []
let currentStep = -1
let steps = 0
let scale = 1
let clientRoom = "room" + (Math.random() * 1000).toFixed()
let name = prompt("Enter your nickname")
let saves = []
let zoomLevel = 1
let zoomIncrement = 0.1

//Nastavování barvy pozadí
document.getElementById("backgroundColor").addEventListener("change", function () {
    canvas.style.backgroundColor = document.getElementById("backgroundColor").value
})

document.getElementById("moreTools").style.display = "none"
document.getElementById("filtry").style.display = "none"

//Vykresluje pixely na pozici danou z funkce display()
function draw(x, y, range, colorMult) {
    console.log(clientRoom)
    let colorInput
    if (colorMult == undefined) {
        colorInput = document.getElementById("colorInput")
    } else {
        colorInput = colorMult
    }
    let shoda = false

    if (document.getElementById("rainbow").checked == true) {
        document.getElementById("colorInput").value = getRandomColor()
    }

    //Vykreslení bloku
    ctx.fillStyle = colorInput.value
    ctx.fillRect(x, y, range, range)
    ctx.restore()

    for (let i = 0; i < saves.length; i++) {
        if (saves[i].x == x &&
            saves[i].y == y &&
            saves[i].color == colorInput.value) {
            shoda = true
        }
    }

    //Pokud daný blok již existuje tak se nepřidá pro lepší optimalizaci
    if (shoda == false) {
        let block = {
            x: x,
            y: y,
            range: range,
            color: colorInput.value
        }
        saves.push(block)
    } else return

    let obj = {
        x: x,
        y: y,
        range: range,
        clientRoom: clientRoom,
        color: document.getElementById("colorInput").value
    }
    socket.emit("draw", obj)

    localStorage.setItem("saves", JSON.stringify(saves))

    //Přidání kroku pro undo/redo
    addKrok(x, y, range, range, document.getElementById("colorInput").value)
    redrawCanvas()
}

//Funkce která načítá objekty z localStorage
function loadSaves(x, y, range, color) {
    ctx.fillStyle = color
    ctx.fillRect(x, y, range, range)
    ctx.restore()
}

//Guma
function earser() {
    colorInput = document.getElementById("colorInput")
    colorInput.value = document.getElementById("backgroundColor").value
}

//Stahování savu z local storage
function downloadSave() {
    let savesData = localStorage.getItem("saves")
    let blob = new Blob([savesData], {
        type: "application/json"
    })
    let url = URL.createObjectURL(blob)
    let link = document.createElement("a")

    //Stahování savu
    link.href = url
    link.download = "saves.json"
    link.click()

    URL.revokeObjectURL(url)
}

//Načítání savu
let filosInput = document.getElementById("filos")
filosInput.addEventListener("change", (event) => {

    let file = event.target.files[0]
    let reader = new FileReader()

    reader.onload = function (event) {
        let jsonData = JSON.parse(event.target.result)

        clearCanvas()
        for (let i = 0; i < jsonData.length; i++) {
            loadSaves(jsonData[i].x, jsonData[i].y, jsonData[i].range, jsonData[i].color)
        }
    }

    reader.readAsText(file)
})

function saveAsik() {
    downloadSave()
}

//Bere pozici kurzoru z HTML a dosazuje ji do funkce draw()

function display(event) {
    let range = document.getElementById("rangeInput").value
    let X = event.clientX - (range % 4) * scale
    let Y = event.clientY - (range % 4) * scale

    if (document.getElementById("checkAlight").checked == true) {
        if (X % range !== 0) {
            X -= X % range
        } if (Y % range !== 0) {
            Y -= Y % range
        }
    } else {
        X -= (range / 2) * 1
        Y -= (range / 2) * 1

        //Zarovnání pixelů na jeden pixel

        if (X % range !== 10) {
            X -= X % 10
        } if (Y % range !== 10) {
            Y -= Y % 10
        }
    }

    //Kontroluje pokud uživatel nechce kreslit čáry

    if (document.getElementById("drawLines").checked == true) {
        showGrid(10)
        steps++

        if (steps == 1) {
            posX = X
            posY = Y

            draw(posX, posY, 10, 10)
            console.log("první krok")
        }

        if (steps == 2) {
            console.log("druhý krok")
            posX2 = X
            posY2 = Y

            let colorInput = document.getElementById("colorInput")
            drawLines(posX, posY, posX2, posY2, colorInput.value, range)
            steps = 0
        }
    } else {
        draw(X, Y, range)
        showGrid(range * 1)
    }
}

//překreslení canvasu
function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < currentStep; i++) {

        ctx.fillStyle = drawingHistory[i].color
        ctx.fillRect(
            drawingHistory[i].x,
            drawingHistory[i].y,
            drawingHistory[i].width,
            drawingHistory[i].height
        )
        ctx.restore()
    }
}

//Přidávání kroku 
function addKrok(x, y, width, height, color) {
    let step = {
        x: x,
        y: y,
        width: width,
        height: height,
        color: color
    }

    drawingHistory.push(step)
    currentStep++
}

//krok dozadu
function undo() {
    if (currentStep > 0) {

        currentStep--
        redrawCanvas()
    }
}

//Krok dopředu
function redo() {
    if (currentStep < drawingHistory.length - 1) {

        currentStep++
        redrawCanvas()
    }
}

//Sleduje jestli uživatel nezmáčkl jeden z inputů
document.addEventListener("keydown", function (e) {
    //Z pro krok dozadu
    if (e.ctrlKey && e.key == "z") {
        undo()

        //y pro krok dopředu
    } else if (e.ctrlKey && e.key == "y") {
        redo()

        //Z pro vyčištění canvasu
    } else if (e.ctrlKey && e.key == "c") {
        clearCanvas()

        //1 pro přiblížení canvasu
    } else if (e.ctrlKey && e.key == "1") {
        zoomInCanvas()

        //2 pro oddánení
    } else if (e.ctrlKey && e.key == "2") {
        zoomOutCanvas()

        //3 pro resetování zoomu
    } else if (e.ctrlKey && e.key == "3") {
        zoomReset()

    }
})

//Vykresluje GRID na druhý canvas
//a sleduje jestli se CHECKBOX nezměnil

document.getElementById("checkGrid").addEventListener("change", function () {
    if (document.getElementById("checkGrid").checked == true && document.getElementById("checkAlight").checked == false) {
        let range = document.getElementById("rangeInput").value
        showGrid(range * 1)

    } else if (document.getElementById("checkGrid").checked == true && document.getElementById("checkAlight").checked == true) {
        showGrid(range * 1)

    } else {
        ctxGRID.clearRect(0, 0, canvas.width, canvas.height)
    }
})

//Vykreslování rastru
function showGrid(range) {
    ctxGRID.clearRect(0, 0, canvas.width, canvas.height)
    let move = range

    if (document.getElementById("checkGrid").checked == true && document.getElementById("checkAlight").checked == true) {
        for (let i = 0; i < 400; i++) {
            ctxGRID.beginPath()
            ctxGRID.moveTo(move, 0)
            ctxGRID.lineTo(move, 10000)
            ctxGRID.stroke()
            move += range
        }
        move = range
        for (let i = 0; i < 100; i++) {
            ctxGRID.beginPath()
            ctxGRID.moveTo(0, move)
            ctxGRID.lineTo(10000, move)
            ctxGRID.stroke()
            move += range
        }

    } else if (document.getElementById("checkGrid").checked == true) {
        let move = 10
        for (let i = 0; i < 400; i++) {
            ctxGRID.beginPath()
            ctxGRID.moveTo(move, 0)
            ctxGRID.lineTo(move, 10000)
            ctxGRID.stroke()

            move += 10
        }

        move = 10

        for (let i = 0; i < 100; i++) {
            ctxGRID.beginPath()
            ctxGRID.moveTo(0, move)
            ctxGRID.lineTo(10000, move)
            ctxGRID.stroke()

            move += 10
        }
    } else {
        return
    }
}

//Duhové kreslení
function getRandomColor() {
    let letters = "0123456789ABCDEF"
    let color = "#"

    //for loop který do # přidá náhodné čísla a písmena = náhodná barva
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }

    return color
}

//Změna barvy při stisknutí mezerníku

document.addEventListener("keyup", (e) => {
    if (e.keyCode == 32) {
        document.getElementById("colorInput").value = getRandomColor()
    }
})

//Vyčistí canvas a localStorage
function clearCanvas() {

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    canvas.style.backgroundColor = "white"
    localStorage.setItem("saves", 0)
    socket.emit("clearCanvas", clientRoom)
    drawingHistory = []
    currentStep = -1
    redrawCanvas()
}

//Vyčištění canvasu v multiplayeru
socket.on("setCanvasClear", () => {

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    canvas.style.backgroundColor = "white"
    localStorage.setItem("saves", 0)
})

//Dovoluje držení myši

function mouseMove() {

    document.addEventListener("mousedown", function () {
        ifMouseDown = true
    })

    document.addEventListener("mouseup", function () {
        ifMouseDown = false
    })

    if (ifMouseDown == true) {
        display(event)
        draw()
    }
}

//Načtení Obrázku

let poleObrazky = []
let pbrazekInput = document.getElementById("obrazkos")
pbrazekInput.addEventListener("change", (event) => {

    let file = event.target.files[0]
    let reader = new FileReader()

    //Reader dokáže "přečíst" obrázek a následně ho canvas vykreslí
    reader.onload = function () {

        let image = new Image()
        poleObrazky.push(image)

        image.onload = function () {
            ctx.drawImage(image, 0, 0)
        }

        image.src = reader.result
    }

    reader.readAsDataURL(file)
})


//exportování

function nevimjakpojemnovat() {

    let image = canvas.toDataURL("image/png")
    let link = document.createElement("a")

    //Stažení obrázku
    link.href = image
    link.download = "canvas.png"
    link.click()
}

//Kreslení čáry
//Použit "Bresenham"s line algorithm"
//https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm

function drawLines(x0, y0, x1, y1, color, range) {
    ctx.fillStyle = color
    if (document.getElementById("rainbow").checked == true) {
        color = getRandomColor()
    }

    let dx = Math.abs(x1 - x0)
    let dy = Math.abs(y1 - y0)
    let sx = (x0 < x1) ? 10 : -10
    let sy = (y0 < y1) ? 10 : -10
    let err = dx - dy

    //Zjištění tvz. erroru kterým vypočítává jestli se pixel má položit nebo ne
    while (x0 !== x1 || y0 !== y1) {
        if (document.getElementById("rainbow").checked == true) {
            ctx.fillStyle = getRandomColor()
        }

        let e2 = err << 10
        if (e2 > -dy) {
            err -= dy
            x0 += sx
        }

        if (e2 < dx) {
            err += dx
            y0 += sy
        }

        ctx.fillRect(x0, y0, 10, 10)
        addKrok(x0, y0, 10, 10, color)
    }

    ctx.fillRect(x1, y1, 10, 10)
    addKrok(x1, y1, 10, 10, color)
}

//Načítání local storage
function load() {
    let pop = localStorage.getItem("saves")
    pop = JSON.parse(pop)

    for (let i = 0; i < pop.length; i++) {
        loadSaves(pop[i].x, pop[i].y, pop[i].range, pop[i].color)
    }
}

//Měnění všech canvasů/pláten na zvolenou velikost
function changeCanvasSize() {
    let canvas = document.getElementById("canvas")
    let canvasGRID = document.getElementById("canvasGRID")
    let canvasHOVER = document.getElementById("canvasHOVER")
    let newWidth = parseInt(widthInput.value)
    let newHeight = parseInt(heightInput.value)

    canvas.width = newWidth
    canvas.height = newHeight
    canvasGRID.width = newWidth
    canvasGRID.height = newHeight
    canvasHOVER.width = newWidth
    canvasHOVER.height = newHeight
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

//Funkce která volá změnu velikosti hned po spuštění
window.onload = function () {
    dynamic()
    load()
    redrawCanvas()
}

//Funkce která volá změnu velikosti po změně velikosti
window.onresize = function () {
    dynamic()
    load()
    redrawCanvas()
}

//Měnění všech canvasů/pláten na nativní velikost
//Vyřešeno je to přes procenta kvůli tabulce s nástroji napravo v UI
function dynamic() {
    if (window.innerWidth >= 1235) {
        let promenaSirka = (78.5 / 100) * window.innerWidth
        let promenaVyska = window.innerHeight - 20

        canvasHOVER.width = promenaSirka
        canvasGRID.width = promenaSirka
        canvas.width = promenaSirka

        canvasHOVER.height = promenaVyska
        canvasGRID.height = promenaVyska
        canvas.height = promenaVyska

    } else {

        let promenaVyska = (78.5 / 100) * window.innerHeight

        canvasHOVER.width = window.innerWidth - 30
        canvasGRID.width = window.innerWidth - 30
        canvas.width = window.innerWidth - 30

        canvasHOVER.height = promenaVyska
        canvasGRID.height = promenaVyska
        canvas.height = promenaVyska
    }
}

//Zomování
// Funkce pro přiblížení canvasu
function zoomInCanvas() {
    
    zoomLevel += zoomIncrement
    applyZoom()
}

// Funkce pro oddálení canvasu
function zoomOutCanvas() {

    if (zoomLevel > zoomIncrement) {
        zoomLevel -= zoomIncrement

    } else {
        zoomLevel = 1

    }

    applyZoom()
}

//Resetování přiblížení
function zoomReset() {
    zoomLevel = 1
    applyZoom()
}

// Změna velikosti canvasu na základě přiblížení
function applyZoom() {
    canvas.style.transform = `scale(${zoomLevel})`
}

//Více nastrojů
let toolky = false
//Funkce pro zobrazení/skrytí dalších nástrojů
function moreTools() {

    //Odkryje div moreTools
    document.getElementById("filtry").style.display = "none"
    if (toolky == false && filtry == false) {
        document.getElementById("moreTools").style.display = "block"
        toolky = true

        //Skryje div moreTools
    } else if (toolky == true) {
        document.getElementById("moreTools").style.display = "none"
        toolky = false
    }
}

//Otevírání menu

let filtry = false
function openFilters() {
    document.getElementById("moreTools").style.display = "none"
    document.getElementById("filtry").style.display = "block"
}

//Filtry
function brightness() {
    canvas.style.filter = `brightness(${document.getElementById("brightness").value})`
}

function contrast() {
    canvas.style.filter = `contrast(${document.getElementById("contrast").value}%)`
}

function grayscale() {
    canvas.style.filter = `grayscale(${document.getElementById("grayscale").value}%)`
}

function huerotate() {
    canvas.style.filter = `hue-rotate(${document.getElementById("huerotate").value}deg)`
}

function invert() {
    canvas.style.filter = `invert(${document.getElementById("invert").value}%)`
}

function opacity() {
    canvas.style.filter = `opacity(${document.getElementById("opacity").value}%)`
}

function saturate() {
    canvas.style.filter = `saturate(${document.getElementById("saturate").value}%)`
}

function sepia() {
    canvas.style.filter = `sepia(${document.getElementById("sepia").value}%)`
}


//Text na canvas (uz nevim co přidat abych měl 800 řádků)
function addText() {
    let text = prompt("Text value?")
    let font = prompt("Text font?")
    let size = prompt("text size?")
    let color = prompt("Text color?")
    let x = prompt("Text x?")
    let y = prompt("Text y?")

    //volání funkce pro přidání textu
    textCanvas(text, font, size, color, x, y)
}

//Přidání textu
function textCanvas(text, font, size, color, x, y) {
    ctx.font = `${size}px ${font}`
    ctx.fillStyle = color
    ctx.fillText(text, x, y)
}

//Odesílání zprávy
let typeMessage = document.getElementById("typeMessage")
let ul = document.getElementById("ul")
typeMessage.addEventListener("keypress", function (event) {
    if (event.key == "Enter") {
        let message = document.getElementById("typeMessage").value
        typeMessage.value = ""

        //Vytvoření objektu s informacemi o zprávě
        let data = {
            message: message,
            name: name
        }

        //Data se odesílají na server
        socket.emit("chatmessage", data)
    }
})

//Příjem zprávy
socket.on("chatmessage", (data) => {
    let li = document.createElement("li")
    li.textContent = data.name + ": " + data.message
    //Přidání zprávy
    ul.appendChild(li)
})

//Aktualizace informací
socket.on("connect", () => {
    updateUser()
})

//Příjem kreslení
socket.on("draw-mult", (obj) => {
    drawMult(obj.x, obj.y, obj.range, obj.color)
})

function drawMult(x, y, range, color) {
    ctx.fillStyle = color
    ctx.fillRect(x, y, range, range)
    ctx.restore()
}

//Aktualizace uživatele
function updateUser() {
    //Zobrazení ID uživatele
    document.getElementById("userID").innerHTML = "User ID: " + "<span>" + socket.id + "<span>"
    if (name == "" || name == undefined) {
        //Pokud si uživatel nezvolí jméno bude přejmenován
        name = "Guest"
    }
    document.getElementById("name").innerHTML = "Your name: " + "<span>" + name + "</span>"
}

//Vytvoření místnost
socket.emit("createRoom", (clientRoom))

//Zobrazení informací o místnosti
socket.on("updateRoom", (room) => {
    document.getElementById("room").innerHTML = "Your room: " + "<span>" + room + "<span>"
})

//Posluchač událostí a připojení k místnosti
let joinDoom = document.getElementById("joinRoom")
joinDoom.addEventListener("keypress", function (event) {
    if (event.key == "Enter") {
        //Připojení k místnosti
        clientRoom = joinDoom.value
        socket.emit("joinRoom", clientRoom)
        //Zobrazení informací o místnosti
        document.getElementById("room").innerHTML = "Your room: " + clientRoom
    }
})