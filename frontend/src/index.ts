import './base.scss';//estilos
import $ from "jquery";//para requests

declare let global: any;
global.jQuery = $;

// CO: 2
// HUM: 3
// O3: 7
// PM10: 8
// PM2.5: 9
// Temp: 12
// AQI: 1001


jQuery(function() {
    //Función que maipula indicador del Índice de Calidad del Aire
    //El indicador consta de dos semicíruclos, se rota uno y al salir del
    //div, se deja de visibilisar. La vista del div está acotada
    function setAQI(value: number) {
        const clampedValue = Math.min(Math.max(value, 0), 500);
        const rotation = (clampedValue / 500) * 180;

        // Rangos de calidad -> colores
        var desc = "";
        if (clampedValue < 50) {
            desc = "Buena";
            $(".aqi-background").css("border-color", "green");
        } else if (clampedValue < 100) {
            desc = "Moderada";
            $(".aqi-background").css("border-color", "yellow");
        } else if (clampedValue < 150) {
            desc = "Grupos Sensibles";
            $(".aqi-background").css("border-color", "orange");
        } else if (clampedValue < 200) {
            desc = "Dañina";
            $(".aqi-background").css("border-color", "red");
        } else if (clampedValue < 300) {
            desc = "Muy Dañina";
            $(".aqi-background").css("border-color", "purple");
        } else {
            desc = "Peligrosa";
            $(".aqi-background").css("border-color", "maroon");
        }

        $('.aqi-bar').css('transform', `rotate(${rotation}deg)`)
        $('.aqi-value').text(`${clampedValue} ${desc}`);
    }

    // Función para pedir data al proxy que a su vez pida a Smability
    // La petición no puede ser directa debido CORS policy
    // (medida de seguridad)
    function updateData() {
        // Obtención de rangos de datos
        const now = new Date();

        const dtStartDate = new Date(now.getTime() - 5 * 60000);

        const formatDate = (date: Date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');

            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        };

        const dtStart = formatDate(dtStartDate);
        const dtEnd = formatDate(now);
        // Fin: Obtención de rangos de datos

        // Cada llamada hace lo mismo sobre un sensor diferente
        $.ajax({
            url: "/smability/api/GetData",// URL a backend local (proxy)
            type: "GET",// verbo para req local
            data: {
                "token": "b8c1bac206b358bde62cb25c374339c3", // token del dispositivo en BD Smability
                "idSensor": "2", // Id sensor, en este caso CO
                // Rangos para obtención de datos
                "dtStart": dtStart,
                "dtEnd": dtEnd
            },
            success: function(data) {// Si funciona se modifica el valor de la UI
                $("#co-value").text(`${data.Data} ppb`);
            },
            error: function(error) {// Si falla se imprime el error en consola
                console.log(`Error ${error}`);
            }
        });

        $.ajax({
            url: "/smability/api/GetData",
            type: "GET",
            data: {
                "token": "b8c1bac206b358bde62cb25c374339c3",
                "idSensor": "9",
                "dtStart": dtStart,
                "dtEnd": dtEnd
            },
            success: function(data) {
                $("#pm25-value").text(`${data.Data} ug/m³`);
            },
            error: function(error) {
                console.log(`Error ${error}`);
            }
        });

        $.ajax({
            url: "/smability/api/GetData",
            type: "GET",
            data: {
                "token": "b8c1bac206b358bde62cb25c374339c3",
                "idSensor": "8",
                "dtStart": dtStart,
                "dtEnd": dtEnd
            },
            success: function(data) {
                $("#pm10-value").text(`${data.Data} ug/m³`);
            },
            error: function(error) {
                console.log(`Error ${error}`);
            }
        });

        $.ajax({
            url: "/smability/api/GetData",
            type: "GET",
            data: {
                "token": "b8c1bac206b358bde62cb25c374339c3",
                "idSensor": "7",
                "dtStart": dtStart,
                "dtEnd": dtEnd
            },
            success: function(data) {
                $("#o3-value").text(`${data.Data} ppb`);
            },
            error: function(error) {
                console.log(`Error ${error}`);
            }
        });

        $.ajax({
            url: "/smability/api/GetData",
            type: "GET",
            data: {
                "token": "b8c1bac206b358bde62cb25c374339c3",
                "idSensor": "12",
                "dtStart": dtStart,
                "dtEnd": dtEnd
            },
            success: function(data) {
                $("#temp-value").text(`${data.Data} °C`);
            },
            error: function(error) {
                console.log(`Error ${error}`);
            }
        });

        $.ajax({
            url: "/smability/api/GetData",
            type: "GET",
            data: {
                "token": "b8c1bac206b358bde62cb25c374339c3",
                "idSensor": "3",
                "dtStart": dtStart,
                "dtEnd": dtEnd
            },
            success: function(data) {
                $("#hum-value").text(`${data.Data} %`);
            },
            error: function(error) {
                console.log(`Error ${error}`);
            }
        });

        $.ajax({
            url: "/smability/api/GetData",
            type: "GET",
            data: {
                "token": "b8c1bac206b358bde62cb25c374339c3",
                "idSensor": "1001",
                "dtStart": dtStart,
                "dtEnd": dtEnd
            },
            success: function(data) {
                const aqiData = JSON.parse(data.Data);
                setAQI(aqiData.Data);
                $(".aqi-gas").text(`Gas dominante: ${aqiData.Sensor}`);
            },
            error: function(error) {
                console.log(`Error ${error}`);
            }
        });
    }

    // Primera petición
    updateData();
    // Peticiones subsecuentes casa 5 minutos
    setInterval(updateData, 300000);
});

