const CP = 28027;
const KEY = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZHJpYW4ucGVyZXouZ2FyY2lhMjAxOEBnbWFpbC5jb20iLCJqdGkiOiI0OWM1ZmJmZS03ODc3LTQyYzItOGY5Ny04NWNiY2VlMjZlNmYiLCJpc3MiOiJBRU1FVCIsImlhdCI6MTU2MDMyMjE3MywidXNlcklkIjoiNDljNWZiZmUtNzg3Ny00MmMyLThmOTctODVjYmNlZTI2ZTZmIiwicm9sZSI6IiJ9.Hpv4mhwe0-2XJZrMmN9DtOJ-LEQClf_h5Gh02eCguis";
const URL = `https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/diaria/${CP}/?api_key=${KEY}`;

let sun = 0;
let sunnub = 0;
let nub = 0;
let nubrain = 0;
let thundernub = 0;
let snow = 0;
let snownub = 0;
let thundernubrain = 0;
let dude;
var semana = [
    "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado", "Domingo"
];

//Hacemos la conexion con la web
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
            let hol = new Date(),
                days = hol.getDay(),
                hora = hol.getHours(),
                day = hol.getDate(),
                month = "0" + (1 + hol.getMonth()),
                year = hol.getFullYear(),
                fecha = year + "-" + month + "-" + day;

            //Cambio de fondo
            hora >= 6 && hora < 22 ? dude = "dia" : dude = "noche";
            cambiarFondo(hora)

            for (let i = 0; i < aemet.length; i++) {
                document.getElementById("titulo").innerHTML = aemet[i].provincia;
                if (dude == dude) {
                    document.getElementById("dude").innerHTML = '<img class="icondude" src="png/022-sun.png">';
                } else {
                    document.getElementById("dude").innerHTML = '<img class="icondude" src="png/011-night.png">';
                }

                // Calculo de los grados 
                calculoGrados(aemet[i].prediccion.dia, hora, fecha);

                // Calculo de dias de la semana
                calculoDiasSemana(semana, days);

                for (let z = 0; z < aemet[i].prediccion.dia.length; z++) {

                    for (let t = 0; t < aemet[i].prediccion.dia[z].estadoCielo.length; t++) {
                        let estado = aemet[i].prediccion.dia[z].estadoCielo[t].descripcion;
                        console.log(aemet[i].prediccion.dia[z].estadoCielo[t].descripcion);
                        switch (estado) {
                            case "Despejado":
                                sun++;
                                break;
                            case "Poco nuboso":
                                nub++;
                                break;
                        }
                    }

                    let estadoCielo = Math.max(sun, nub);


                    if (cont < 8) {
                        actualday = semana[cont - 1];
                        cont++;
                    } else {
                        cont = 1;
                        actualday = semana[cont - 1];
                        cont++;
                    }
                    $('#grafo').append('<div class="container"><p class="dia">' + actualday + '</p><div class="cajita">' +
                        '</p><p class="max">' + aemet[i].prediccion.dia[z].temperatura.maxima +
                        '</p><p class="min">' + aemet[i].prediccion.dia[z].temperatura.minima + '</p></div></div>');
                    switch (dude) {
                        case "dia":
                            if (estadoCielo == sun) {
                                $('.container').append('<div class="contimg"><img class="estadosky" src="png/022-sun.png"></div>');
                            } else if (estadoCielo == nub) {
                                $('.container').append('<div class="contimg"><img class="estadosky" src="png/023-sunny.png"</div>');
                            }
                            break;

                        case "noche":
                            if (estadoCielo == sun) {
                                $('.container').append('<div class="contimg"><img class="estadosky" src="png/012-night-1.png"></div>');
                            } else if (estadoCielo == nub) {
                                $('.container').append('<div class="contimg"><img class="estadosky" src="png/011-night.png"</div>');
                            }
                            break;

                    }

                }
            }
        });
}

function cambiarFondo(x) {
    if (x >= 6 && x < 8) {
        $('body').css({ "background-color": "rgb(0, 119, 216)" });
    } else if (x >= 8 && x < 22) {
        $('body').css({ "background-color": "rgb(0, 171, 238)" });
    } else if (x >= 22 && x < 23) {
        $('body').css({ "background-color": "rgb(2, 89, 160)" });
    } else {
        $('body').css({ "background-color": "rgb(0, 50, 92)" });
    }
}

function calculoGrados(m, hora, fecha) {
    for (let x = 0; x < m.length; x++) {
        if (m[x].fecha == fecha) {
            if (hora >= 6 && hora < 12) {
                document.getElementById("temp_tit").innerHTML = m[x].temperatura.dato[0].value + "º";
            } else if (hora >= 12 && hora < 18) {
                document.getElementById("temp_tit").innerHTML = m[x].temperatura.dato[1].value + "º";
            } else if (hora >= 18 && hora < 24) {
                document.getElementById("temp_tit").innerHTML = m[x].temperatura.dato[2].value + "º";
            } else {
                document.getElementById("temp_tit").innerHTML = m[x].temperatura.dato[3].value + "º";
            }
        }
    }
}

function calculoDiasSemana(s, d) {
    for (var r = 0; r < s.length; r++) {
        if (r == d) {
            var cont = r;
            return cont;
        }
    }
}