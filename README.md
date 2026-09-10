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

## Documentación API pública

`/documentation` explica cómo consumir la fachada pública de Wave con el request
mínimo `market` + `ticker`, ejemplos cURL/Bruno, respuestas, errores y límites
read-only. Nunca incluye tokens ni credenciales.
