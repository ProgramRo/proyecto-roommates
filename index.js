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
        try {
            res.setHeader('Content-Type', 'text/html')
            res.statusCode = 200
            res.end(fs.readFileSync('index.html', 'utf-8'))
        } catch (error) {
            res.statusCode = 500
            res.end()
            console.log('Error al acceder al servidor', error)
        }
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
        try {
            res.setHeader('Content-Type', 'application/json')
            res.statusCode = 200
            res.end(fs.readFileSync('roommates.json', 'utf-8'))
        } catch (error) {
            res.statusCode = 500
            res.end()
            console.log('Error al mostrar los roommates', error)
        }
    }

    // Ruta que muestra todos los gastos
    if(req.url.startsWith('/gastos') && req.method === 'GET') {
        try {
            res.setHeader('Content-Type', 'application/json')
            res.statusCode = 200
            res.end(fs.readFileSync('gastos.json', 'utf-8'))
        } catch (error) {
            res.statusCode = 500
            res.end()
            console.log('Error al mostrar los gastos', error)
        }
    }

    // Ruta que agrega gastos a gastos.json
    if(req.url.startsWith('/gasto') && req.method === 'POST') {
        let body
        req.on('data', (payload) => {
            body = JSON.parse(payload)
        })
        req.on('end', () => {
            try {
                const gasto = {
                    id: uuidv4().slice(30),
                    roommate: body.roommate,
                    descripcion: body.descripcion,
                    monto: body.monto,
                }
                const gastosJSON = JSON.parse(fs.readFileSync('gastos.json', 'utf-8'))
                gastosJSON.gastos.push(gasto)
                fs.writeFileSync('gastos.json', JSON.stringify(gastosJSON))
                res.statusCode = 201
                res.end()
            } catch (error) {
                res.statusCode = 500
                res.end()
                console.log('Error al registrar el nuevo gasto', error)
            }
        })
    }

    // Ruta que actualiza los gastos
    if(req.url.startsWith('/gasto') && req.method === 'PUT') {
        try {
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
                    // En ...body, se captan los elementos por separado del 
                    return {id, ...body}
                }
                return g
            })
            const nuevosGastos = {
                gastos: gastosActualizados,
            }
            fs.writeFileSync('gastos.json', JSON.stringify(nuevosGastos))
            res.statusCode = 200
            res.end()
        })
        } catch (error) {
            res.statusCode = 500
            res.end()
            console.log('Error al actualizar los gastos', error)
        }
    }

    // Ruta que elimina un gasto
    if (req.url.startsWith("/gasto") && req.method === "DELETE") {
        try {
            const { id } = url.parse(req.url, true).query
            const gastosJSON = JSON.parse(fs.readFileSync('gastos.json', 'utf-8'))
            const gastos = gastosJSON.gastos
            gastosJSON.gastos = gastos.filter((b) => b.id !== id)
            fs.writeFileSync("gastos.json", JSON.stringify(gastosJSON))
            res.statusCode = 200
            res.end()
        } catch (error) {
            res.statusCode = 500
            res.end()
            console.log('Error al eliminar el gasto', error)
        }
    }

}).listen(3000, console.log('Server ON!'))