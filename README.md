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
conceptos de price action y consumidores de IA. La referencia HTTP está agrupada
como un catálogo tipo Swagger por servicio: capabilities, Wave, Flux y facades
planned, con método, path, auth, contrato, request, response y boundary.

Wave es la primera capa de price action y documenta la fachada mínima
`market` + `ticker`, el contrato `wave-analysis-v3`, `fibonacciV3`, provenance,
errores y límites de ejecución. El gateway público está desplegado con Wave
`v0.5.1`. `/architecture` conserva el mapa público de alto nivel y no se mezcla
con los detalles HTTP.

`/llms.txt` contiene el catálogo y el mismo contrato en Markdown plano para consumidores
automatizados: APIs disponibles/planned, request exacta, defaults generados por Wave,
response map, reglas de provenance y límites de no ejecución.
