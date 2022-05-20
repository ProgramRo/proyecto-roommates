// Se importan los módulos nativos
const http = require('http')
const fs = require('fs')
const url = require('url')

// Se importa el módulo externo
const { v4: uuidv4 } = require('uuid')

// Se importan las funciones a través de módulos externos
const { nuevoRoommate, guardarRoommate } = require('./roommates')

http.createServer((req, res) => {

    // Ruta para leer el archivo index.html
    if(req.url === '/' && req.method === 'GET') {
        res.setHeader('Content-Type', 'text/html')
        res.end(fs.readFileSync('index.html', 'utf-8'))
    }

    // Ruta que agrega roommates a roommates.json
    if(req.url.startsWith('/roommate') && req.method === 'POST') {
        nuevoRoommate().then( async (roommate) => {
            guardarRoommate(roommate)
            res.end(JSON.stringify(roommate))
        }).catch((e) => {
            res.statusCode = 500
            res.end()
            console.log('Error al registrar el nuevo roommate', e)
        })
    }

    // Ruta que muestra todos los roommates
    if(req.url.startsWith('/roommates') && req.method === 'GET') {
        res.setHeader('Content-Type', 'application/json')
        res.end(fs.readFileSync('roommates.json', 'utf-8'))
    }

    // Ruta que muestra todos los gastos
    if(req.url.startsWith('/gastos') && req.method === 'GET') {
        res.setHeader('Content-Type', 'application/json')
        res.end(fs.readFileSync('gastos.json', 'utf-8'))
    }

    // Ruta que agrega gastos a gastos.json
    if(req.url.startsWith('/gasto') && req.method === 'POST') {
        let body
        req.on('data', (payload) => {
            body = JSON.parse(payload)
        })
        req.on('end', () => {
            const gasto = {
                id: uuidv4().slice(30),
                roommate: body.roommate,
                descripcion: body.descripcion,
                monto: body.monto,
            }
            const gastosJSON = JSON.parse(fs.readFileSync('gastos.json', 'utf-8'))
            gastosJSON.gastos.push(gasto)
            fs.writeFileSync('gastos.json', JSON.stringify(gastosJSON))
            res.end()
        })
    }

    // Ruta que actualiza los gastos
    if(req.url.startsWith('/gasto') && req.method === 'PUT') {
        let body
        req.on('data', (payload) => {
            body = JSON.parse(payload)
        })
        req.on('end', () => {
            const gastosJSON = JSON.parse(fs.readFileSync('gastos.json', 'utf-8'))
            const gastos = gastosJSON.gastos
            const { id } = url.parse(req.url, true).query
            const gastosActualizados = gastos.map((g) => {
                if (id === g.id) {
                    return {id, ...body}
                }
                return g
            })
            const nuevosGastos = {
                gastos: gastosActualizados,
            }
            //console.log(gastosActualizados)
            fs.writeFileSync('gastos.json', JSON.stringify(nuevosGastos))
            res.end()
        })
    }
    

}).listen(3000, console.log('Server ON!'))