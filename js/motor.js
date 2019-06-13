const CP = 28027;
const KEY = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZHJpYW4ucGVyZXouZ2FyY2lhMjAxOEBnbWFpbC5jb20iLCJqdGkiOiI0OWM1ZmJmZS03ODc3LTQyYzItOGY5Ny04NWNiY2VlMjZlNmYiLCJpc3MiOiJBRU1FVCIsImlhdCI6MTU2MDMyMjE3MywidXNlcklkIjoiNDljNWZiZmUtNzg3Ny00MmMyLThmOTctODVjYmNlZTI2ZTZmIiwicm9sZSI6IiJ9.Hpv4mhwe0-2XJZrMmN9DtOJ-LEQClf_h5Gh02eCguis";
const URL = `https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/diaria/${CP}/?api_key=${KEY}`;

fetch(URL)
    .then(datos => datos.json())
    .then(tiempo => {
        let info = tiempo.datos;
        carga(info);
    })

function carga(info) {
    fetch(info)
        .then(query => query.json())
        .then(aemet => {
            for (let i = 0; i < aemet.length; i++) {
                //console.log(aemet[i].nombre);
                document.getElementById("titulo").innerHTML = aemet[i].nombre;
                document.getElementById("subT").innerHTML = aemet[i].provincia;
                for (let x = 0; x < aemet[i].prediccion.dia.length; x++) {
                    var estado = parseInt(aemet[i].prediccion.dia[x].estadoCielo[0].value);
                    estCielo(estado);
                    console.log(estado);
                }
            }
        })
}

function estCielo(estado) {
    // alert('hola');
    switch (estado) {
        case 12:
            document.getElementById("txt").innerHTML = estado;
    }
}