# Dashboard de Calidad del Aire

Luis Silva: luis.silva1mon@gmail.com

Dashboard para la presentación de datos de calidad del aire por medio de la API
proporcionada por Smability.

## Resumen

Debido a politicas de seguridad CORS (Cross Origin Resource Sharing) no se pueden
hacer llamadas a una API si no se encuentra en la misma red. Ésta es una protección
importante que evita ataques contra los usuarios de alguna plataforma.

Sin embargo, se quiere mostrar la información en una página para mayor facilidad.
La solución fue crear un "proxy" en el backend:

Si creamos una ruta del backend que consiga la información de la API y la pase
al frontend no tenemos que hacer la petición directo del navegador.

## Descripción

El proyecto consta de dos partes: un pequeño backend en Go que sirve tanto la ruta
del "proxy" como el frontend y el frontend mismo en Typescript y Sass compilado
utilizando la herramienta webpack.

Al ser necesario correrlo en una Raspberry Pi se incluye un script que lanza
el navegador Chromium junto con el proyecto completo después de ser compilado.

Se contemplo la posibilidad de ejecutar el script con systemd para automatizar
la ejecución junto con el encendido del sistema, sin embargo debido a particularidades
del sistema operativo de Raspberry Pi no funciona esta solución.

## Instrucciónes

Compilar frontend

    cd frontend
    npm install
    npm audit fix # en caso de ser necesario
    npm run build

Compilar backend (en el directorio raíz del proyecto)

    export GOHOSTARCH=arm
    export GOARCH=arm
    go build -o ./tmp/dashboard ./cmd/main.go

Servir backend

    ./tmp/dashboard

Visitar localhost:8080 ó 127.0.0.1:8080 en cualquier navegador

## Dependencias
- echo https://echo.labstack.com
- npm
- webpack https://webpack.js.org
- Typescript
- SASS
