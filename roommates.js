const axios = require('axios')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')

const nuevoRoommate = async () => {

    try {
        const { data } = await axios.get('https://randomuser.me/api')
        const roommate = data.results[0]
        const dataRoommate = {
            id: uuidv4().slice(30),
            correo: roommate.email,
            nombre: `${roommate.name.title} ${roommate.name.first} ${roommate.name.last}`,
        }
        return dataRoommate
    } catch (err) {
        throw(err)
    }
}

const guardarRoommate = (roommate) => {
    const roommatesJSON = JSON.parse(fs.readFileSync('roommates.json', 'utf-8'))
    roommatesJSON.roommates.push(roommate)
    fs.writeFileSync('roommates.json', JSON.stringify(roommatesJSON))
}

module.exports = { nuevoRoommate, guardarRoommate }