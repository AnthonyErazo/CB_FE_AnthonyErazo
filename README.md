# Web — Banca (Angular 21 · cliente generado con OpenAPI)

Una SPA que **consulta una cuenta** y **registra movimientos**
(depósito / retiro) contra la API de Spring Boot. El **cliente HTTP se genera** desde el contrato OpenAPI del
backend, así los tipos del front no se desfasan de la API.

## Requisitos
- Node.js 24.x
- El **backend debe estar corriendo** en `http://localhost:8080` por defecto (ver `../backend`).
- Java 17 (lo usa OpenAPI Generator solo al regenerar el cliente).

## Ejecutar
```bash
npm install
npm start          # ng serve -> http://localhost:4200
```

Si cambias el puerto del backend, arranca Angular indicando la nueva URL:

```powershell
$env:BACKEND_URL='http://localhost:9090'
npm start
```
Escribe el **ID de la cuenta** (ej. `1`), pulsa **Consultar**, y registra un
depósito o retiro. El saldo se recarga tras cada movimiento.

## Cliente generado (OpenAPI Generator)
El cliente vive en [src/app/api/](src/app/api/) y **está versionado**, así que la
app compila sin pasos extra. Se genera a partir de [openapi.json](openapi.json)
(el contrato exportado del backend):

```bash
# (opcional) refrescar el contrato desde el backend en marcha:
curl http://localhost:8080/v3/api-docs > openapi.json

npm run generate:api   # openapi-generator-cli -> src/app/api
```

El cliente usa rutas relativas (`/api/**`) y Angular las reenvia al backend con
[proxy.conf.js](proxy.conf.js). El destino por defecto es `http://localhost:8080`;
puedes cambiarlo con la variable `BACKEND_URL`.

## Build / tests
```bash
npm run build      # ng build -> dist/
npm test           # ng test (Vitest)
```

## Estructura
```
src/app
├── api/         ← cliente HTTP generado (AccountsService, TransactionsService, modelos). No editar a mano.
├── core/        api.config.ts   (URL del backend en un único sitio -> BASE_PATH)
└── features/    account/        (componente contenedor: consulta + movimiento)
openapi.json     contrato del backend, entrada del generador
```

El componente no conoce URLs ni `HttpClient`: delega toda la red en los servicios
generados (`AccountsService`, `TransactionsService`).

## Documentación
Estructura del frontend y diagramas (pipeline de generación + flujo en tiempo de
ejecución) en [docs/frontend.md](docs/frontend.md).
