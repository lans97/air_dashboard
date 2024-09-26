package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type SensorData struct {
    Data      string `json:"Data"`
    TimeStamp string `json:"TimeStamp"`
}

func main() {
	e := echo.New()// Instanciar Echo

	e.Use(middleware.Logger())// Usar Logger para imprimir información en pantalla
    e.Static("/", "frontend/dist")// ligar el directorio "frontend/dist" a "/" (root)
	e.Static("/assets", "frontend/assets")

	e.GET("smability/api/GetData", func(c echo.Context) error {// Definición de ruta sitio.com/smability/api/GetData
        //Obtención de parametros de query
		token := c.QueryParam("token")
		sensor_id := c.QueryParam("idSensor")
		date_start := c.QueryParam("dtStart")
		date_end := c.QueryParam("dtEnd")

        // Petición a API de smability solo se crea, no se manda
		req, err := http.NewRequest("GET", "http://smability.sidtecmx.com/SmabilityAPI/GetData", nil)
        if err != nil {
			fmt.Fprintf(os.Stderr, "Error: %v", err)
            return err
        }

        // inyección de parametros en petición
        q := req.URL.Query()
        q.Add("token", token)
        q.Add("idSensor", sensor_id)
        q.Add("dtStart", date_start)
        q.Add("dtEnd", date_end)
        req.URL.RawQuery = q.Encode()

        // Se manda la petición
        resp, err := http.DefaultClient.Do(req)
        if err != nil {
			fmt.Fprintf(os.Stderr, "Error: %v", err)
            return err
        }

        // Lectura
        resBody, err := io.ReadAll(resp.Body)
        if err != nil {
			fmt.Fprintf(os.Stderr, "Error: %v", err)
            return err
        }

        var values []SensorData

        // La respuesta en formato json se guarda en la estructura values
        err = json.Unmarshal([]byte(resBody), &values)
        if err != nil {
			fmt.Fprintf(os.Stderr, "Error: %v", err)
            return err
        }

        // Se reenvía al frontend (o browser)
		return c.JSON(200, SensorData{
			Data:      values[0].Data,
			TimeStamp: values[0].TimeStamp,
		})
	})

    // Comienza la ejecución del servidor.
	e.Logger.Fatal(e.Start(":8080"))
}
