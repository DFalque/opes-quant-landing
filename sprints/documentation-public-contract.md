# Sprint F-DOC-001: Documentacion publica de API

## What

La landing ofrece una pagina publica y utilitaria para que un consumidor externo
entienda que endpoints puede usar, como autenticarse y cual es el contrato minimo
de Wave sin recibir secretos ni detalles internos del VPS.

## Implementation

- Crear `/documentation` con navegacion, endpoint actual, request minima, cURL,
  respuesta esperada, errores y limites read-only.
- Enlazar la pagina desde la navegacion de la portada y de arquitectura.
- Mantener ejemplos seguros: placeholder para el Bearer, nunca el token real.
- Hacer la pagina legible en desktop y mobile, incluyendo bloques de codigo con scroll.

## Test plan (Playwright)

1. Navegar a `/documentation`.
2. Comprobar que aparecen `POST /api/wave/analyze`, `market` y `ticker`.
3. Comprobar que no aparece ningun token real.
4. Pulsar el enlace `Arquitectura` desde la portada y volver a `Documentacion`.
5. Capturar screenshots desktop/mobile y verificar ausencia de overflow horizontal.

## Pass criteria

- La pagina se construye sin errores.
- Los enlaces de navegacion llevan a `/documentation`.
- El contrato publico es visible y no contiene secretos.
- Desktop y mobile son legibles, sin overflow ni errores de consola.
