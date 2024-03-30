const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const repertorioPath = './repertorio.json';

// Verifica si existe el archivo repertorio.json, si no, lo crea
if (!fs.existsSync(repertorioPath)) {
    fs.writeFileSync(repertorioPath, JSON.stringify([]));
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.post('/canciones', (req, res) => {
    const nuevaCancion = req.body; // Asume que la canción viene en el cuerpo de la petición
    const repertorio = JSON.parse(fs.readFileSync(repertorioPath));
    nuevaCancion.id = repertorio.length + 1; // Asignación simple de ID
    repertorio.push(nuevaCancion);
    fs.writeFileSync(repertorioPath, JSON.stringify(repertorio, null, 2));
    res.status(201).send('Canción agregada con éxito');
});

app.get('/canciones', (req, res) => {
    const repertorio = JSON.parse(fs.readFileSync(repertorioPath));
    res.status(200).json(repertorio);
});

app.put('/canciones/:id', (req, res) => {
    const { id } = req.params;
    const datosCancion = req.body;
    const repertorio = JSON.parse(fs.readFileSync(repertorioPath));
    const index = repertorio.findIndex(cancion => cancion.id == id);
    if (index !== -1) {
        repertorio[index] = { ...repertorio[index], ...datosCancion };
        fs.writeFileSync(repertorioPath, JSON.stringify(repertorio, null, 2));
        res.send('Canción actualizada con éxito');
    } else {
        res.status(404).send('Canción no encontrada');
    }
});

app.delete('/canciones/:id', (req, res) => {
    const { id } = req.params;
    const repertorio = JSON.parse(fs.readFileSync(repertorioPath));
    const newRepertorio = repertorio.filter(cancion => cancion.id != id);
    fs.writeFileSync(repertorioPath, JSON.stringify(newRepertorio, null, 2));
    res.send('Canción eliminada con éxito');
});
