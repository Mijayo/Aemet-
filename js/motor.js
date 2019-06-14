const CP = 28014;
const KEY = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZHJpYW4ucGVyZXouZ2FyY2lhMjAxOEBnbWFpbC5jb20iLCJqdGkiOiI0OWM1ZmJmZS03ODc3LTQyYzItOGY5Ny04NWNiY2VlMjZlNmYiLCJpc3MiOiJBRU1FVCIsImlhdCI6MTU2MDMyMjE3MywidXNlcklkIjoiNDljNWZiZmUtNzg3Ny00MmMyLThmOTctODVjYmNlZTI2ZTZmIiwicm9sZSI6IiJ9.Hpv4mhwe0-2XJZrMmN9DtOJ-LEQClf_h5Gh02eCguis";
const URL = `https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/diaria/${CP}/?api_key=${KEY}`;

var semana = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado", "Domingo"];
let sun = 0,
    nub = 0,
    nubrain = 0,
    thundernubrain = 0,
    cont = 0,
    franjahoraria = "";

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
            let fecha = new Date(),
                // posicionDia = fecha.getDay(),
                dia = fecha.getDate(),
                hora = fecha.getHours(),
                mes = "0" + (1 + fecha.getMonth()),
                ano = fecha.getFullYear(),
                fechaCompleta = ano + "-" + mes + "-" + dia;
            //Calculo de la franja horaria y cambio de fondo dependiendo de la hora
            cambioFondo(hora);
            for (let i = 0; i < aemet.length; i++) {
                var probabilidad = aemet[0].prediccion.dia[0].probPrecipitacion[i].value;
                document.getElementById("titulo").innerHTML = `${aemet[i].nombre} ${aemet[i].id}`;
                // Calculamos el estado del cielo 
                tiempoDia(aemet[i].prediccion.dia[1].estadoCielo[i].descripcion);
                // Calculamos los grados
                tiempoGrados(aemet[i].prediccion.dia, hora, fechaCompleta);
                //Calculo del dia en el que estamos
                calculoTiempXDia(aemet[i].prediccion.dia, hora, probabilidad);
            }
        });
}

function cambioFondo(x) {
    if (x >= 6 && x < 12) {
        franjahoraria = "mañana";
        $('body').css({ "background-color": "rgb(0, 119, 216)" });
    } else if (x >= 12 && x < 15) {
        franjahoraria = "media dia";
        $('body').css({ "background-color": "rgb(0, 171, 238)" });
    } else if (x >= 15 && x < 21) {
        franjahoraria = "tarde";
        $('body').css({ "background-color": "rgb(2, 89, 160)" });
    } else if (x >= 21 && x < 12) {
        franjahoraria = "noche";
        $('body').css({ "background-color": "rgb(0, 50, 92)" });
    } else if (x >= 12 && x < 6) {
        franjahoraria = "media noche";
        $('body').css({ "background-color": "rgb(0, 50, 92)" });
    }
}

function tiempoDia(x) {
    if (x == "Despejado") {
        document.getElementById("dude").innerHTML = '<img class="icondude" src="png/022-sun.png">';
    } else if (x == "Poco nuboso" || x == "Muy nuboso") {
        document.getElementById("dude").innerHTML = '<img class="icondude" src="png/023-sunny.png">';
    } else if (x == "Tormenta") {
        document.getElementById("dude").innerHTML = '<img class="icondude" src="png/029-storm.png">';
    }
}

function tiempoGrados(x, h, f) {
    for (let r = 0; r < x.length; x++) {
        if (x[r].fecha == f) {
            if (h >= 6 && h < 12) {
                document.getElementById("temp_tit").innerHTML = x[r].temperatura.dato[0].value + "º";
            } else if (h >= 12 && h < 18) {
                document.getElementById("temp_tit").innerHTML = x[r].temperatura.dato[1].value + "º";
            } else if (h >= 18 && h < 24) {
                document.getElementById("temp_tit").innerHTML = x[r].temperatura.dato[2].value + "º";
            } else {
                document.getElementById("temp_tit").innerHTML = x[r].temperatura.dato[3].value + "º";
            }
        }
    }
}

function calculoDiasSemana() {
    for (let r = 0; r < semana.length; r++) {
        if (r == days) {
            cont = r;
            return cont;
        }
    }
}

function calculoTiempXDia(x, r) {
    for (let z = 0; z < x.length; z++) {
        // let estadoCielo = Math.max(sun, nub, nubrain, thundernubrain);
        let estadollevar = "";
        for (let t = 0; t < x[z].estadoCielo.length; t++) {
            let estado = x[z].estadoCielo[t].descripcion;
            if (estado == "Despejado") {
                sun++;
            } else if (estado == "Poco nuboso") {
                nub++;
            } else if (estado == "Muy nuboso") {
                nubrain++;
            } else if (estado == "Tormenta") {
                thundernubrain++;
            }
            estadollevar = estado;
        }
        calculoDiaActual(cont, x[z], estadollevar, r);
    }
}

function calculoDiaActual(a, x, e, r) {
    if (a < 8) {
        actualday = semana[cont];
        cont++;
    } else {
        cont = 1;
        actualday = semana[cont - 1];
        cont++;
    }
    $('#grafo').append(`<div class="container">
        <h4 class="dia"> ${actualday} </h4>
        <div class="cajita">
            <p class="max">${x.temperatura.maxima} </p>
            <p class="min">${x.temperatura.minima} </p>
        </div>
    </div>`);
    // console.log(r);
    console.log(e);
    if (e == "Despejado") {
        $('.container').append('<div class="contimg"><img class="estadosky" src="png/022-sun.png"></div>');
    } else if (e == "Poco nuboso") {
        $('.container').append('<div class="contimg"><img class="estadosky" src="png/023-sunny.png"</div>');
    } else if (e == "nubes altas") {
        $('.container').append('<div class="contimg"><img class="estadosky" src="png/023-sunny.png"</div>');
    }
}