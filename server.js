//Proměné
const express = require("express")
const app = express()
const http = require("http").createServer(app)
const port = 3000
const io = require("socket.io")(http, {
    //Nevím zjišťoval jsem to tak týden
    //Socket se nekamarádí s chromem
    cors: {
        origin: "*"
    }
})

//Počet uživatelů online
let totalUsers = 0

//Vytvořený server poslouchá sztánku
http.listen(port, function () {
    console.log("server running on port: " + port)

    //Sledování uživatele od doby co se připojí
    io.on("connection", function (socket) {
        //Logování do console serveru
        console.log("User " + socket.id + " connected")
        console.log("Total users online: " + (totalUsers += 1))

        //Posílání dat clientum o kreslení
        socket.on("draw", function (obj) {
            socket.to(obj.clientRoom).emit("draw-mult", obj)
        })

        //Logování jaký uživatel se odpojil
        socket.on("disconnect", function (socket) {
            console.log("User " + socket.id + " disconnected")
            console.log("Total users online: " + (totalUsers -= 1))
        })

        //Server vytvoří roomku
        socket.on("createRoom", function (room) {
            socket.join(room)
            console.log("User " + socket.id + " connected to room: " + room)
            socket.emit("updateRoom", room)
        })

        //Server připojí clienta na roomku
        socket.on("joinRoom", function (roomCode) {
            socket.join(roomCode)
            socket.emit("updateRoom", roomCode)
        })

        //Server sděluje clientům ve stejné roomce o smazání canvasu
        socket.on("clearCanvas", function (clientRoom) {
            socket.to(clientRoom).emit("setCanvasClear")
        })

        //Přeposílání dat ohledně chatu
        socket.on("chatmessage", function (data){
            io.emit("chatmessage", data)
        })
    })
})