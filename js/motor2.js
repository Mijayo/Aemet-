const CP = 28014;
const KEY = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZHJpYW4ucGVyZXouZ2FyY2lhMjAxOEBnbWFpbC5jb20iLCJqdGkiOiI0OWM1ZmJmZS03ODc3LTQyYzItOGY5Ny04NWNiY2VlMjZlNmYiLCJpc3MiOiJBRU1FVCIsImlhdCI6MTU2MDMyMjE3MywidXNlcklkIjoiNDljNWZiZmUtNzg3Ny00MmMyLThmOTctODVjYmNlZTI2ZTZmIiwicm9sZSI6IiJ9.Hpv4mhwe0-2XJZrMmN9DtOJ-LEQClf_h5Gh02eCguis";
const URL = `https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/diaria/${CP}/?api_key=${KEY}`;

let fecha = new Date(),
    dia = fecha.getDate(),
    hora = fecha.getHours(),
    mes = "0" + (1 + fecha.getMonth()),
    ano = fecha.getFullYear(),
    fechaCompleta = ano + "-" + mes + "-" + dia,
    franjahoraria = "";

fetch(URL)
    .then(datos => datos.json())
    .then(tiempo => {
        let info = tiempo.datos;
        carga(info);
    });

function carga(info) {
    fetch(info)
        .then(query => query.json())
        .then(aemet => {
            cambioFondo();
            for (let i = 0; i < aemet.length; i++) {
                document.getElementById("titulo").innerHTML = `${aemet[i].nombre} ${aemet[i].id}`;
                // Calculamos el estado del cielo 
                tiempoDia(aemet[i].prediccion.dia[1].estadoCielo[i].descripcion);
                tiempoGrados(aemet[i].prediccion.dia, hora, fechaCompleta);
            }


        });
}

function cambioFondo() {
    if (hora >= 6 && hora < 12) {
        $('body').css({ "background-color": "rgb(0, 119, 216)" });
        return franjahoraria = "mañana";
    } else if (hora >= 12 && hora < 15) {
        $('body').css({ "background-color": "rgb(0, 171, 238)" });
        return franjahoraria = "media dia";
    } else if (hora >= 15 && hora < 21) {
        $('body').css({ "background-color": "rgb(2, 89, 160)" });
        return franjahoraria = "tarde";
    } else if (hora >= 21 && hora < 12) {
        $('body').css({ "background-color": "rgb(0, 50, 92)" });
        return franjahoraria = "noche";
    } else {
        $('body').css({ "background-color": "rgb(0, 50, 92)" });
        return franjahoraria = "media noche";
    }
}

function tiempoDia(descripcion) {
    if (descripcion == "Despejado") {
        document.getElementById("tiempo").innerHTML = '<img class="icondude" src="png/022-sun.png">';
    } else if (descripcion == "Poco nuboso" || descripcion == "Muy nuboso") {
        document.getElementById("tiempo").innerHTML = '<img class="icondude" src="png/023-sunny.png">';
    } else if (descripcion == "Tormenta") {
        document.getElementById("tiempo").innerHTML = '<img class="icondude" src="png/029-storm.png">';
    }
}
//Poner la descripcion en vez de los grados sera mas intuitivo 
function tiempoGrados(bucle, h, fch) {
    for (let r = 0; r < bucle.length; x++) {
        if (bucle[r].fecha == fch) {

            if (h >= 6 && h < 12) {
                document.getElementById("temp_tit").innerHTML = bucle[r].temperatura.dato[0].value + "º";
            } else if (h >= 12 && h < 18) {
                document.getElementById("temp_tit").innerHTML = bucle[r].temperatura.dato[1].value + "º";
            } else if (h >= 18 && h < 24) {
                document.getElementById("temp_tit").innerHTML = bucle[r].temperatura.dato[2].value + "º";
            } else {
                document.getElementById("temp_tit").innerHTML = bucle[r].temperatura.dato[3].value + "º";
            }
        }
    }
}