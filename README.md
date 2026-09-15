# OPES Landing

Landing page de OPES: un sistema de inteligencia para entender los mercados y
convertir contexto en decisiones.

## Desarrollo local

```bash
npm install
npm run dev
```

La portada queda disponible en `http://localhost:4321/`.

## Deploy

El workflow de GitHub Actions publica automáticamente el contenido estático en
GitHub Pages cuando cambia `main`.

Servicios presentados: Signal, Atlas, Lens, Wave, Flux, Cortex, Reflex, Link,
Vision y OPES Intelligence.

## Arquitectura pública

`/architecture` combina una explicación de alto nivel con un mapa interactivo
generado y validado por Archify. La fuente estructurada está en
`public/architecture/opes-public.architecture.json` y el HTML autónomo que se
publica junto a la landing en `public/architecture/opes-public.architecture.html`.

El mapa es deliberadamente público y sanitizado: explica responsabilidades y
flujos, pero no expone código, credenciales, configuración del VPS ni reglas
internas de ejecución.

## Portal de documentación pública

`/documentation` separa cuatro recorridos: arquitectura pública, referencia de APIs,
conceptos de price action y consumidores de IA. La referencia HTTP pública está agrupada
como un catálogo tipo Swagger por servicio: capabilities, Wave, Flux y facades
planned. Link aparece como una frontera privada; su catálogo completo vive en
`/dashboard/documentation` y se obtiene desde el backend únicamente después de
autenticar la sesión.

Wave es la primera capa de price action y documenta la fachada mínima
`market` + `ticker`, el contrato `wave-analysis-v3`, `fibonacciV3`, provenance,
errores y límites de ejecución. El gateway público está desplegado con Wave
`v0.6.0` y su MCP stateless. Wave Review `v0.7.3` también está disponible como
MCP separado: mantiene una sesión efímera para que el LLM del host interprete
secuencialmente Trend, Fibonacci, Volume, Pattern y Pitchfan. Flux `v0.7.1`
también está disponible como facade pública. `/architecture` conserva el mapa
público de alto nivel y no se mezcla con los detalles HTTP.

`/llms.txt` contiene el catálogo público y el contrato en Markdown plano para consumidores
automatizados: APIs disponibles/planned, request exacta, defaults generados por Wave,
response map, reglas de provenance y límites de no ejecución. No incluye contratos
privados de Link.
