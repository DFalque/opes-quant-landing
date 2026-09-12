# Sprint F-DOC-003: Portal de documentación extensible

## What

Reorganizar `/documentation` como un portal focal de OPES. La página debe separar
architecture, API reference, conceptos de price action y consumidores de IA, y
presentar cada operación pública con una estructura tipo Swagger que pueda crecer
sin convertirse en otra página editorial monolítica.

## Implementation

- Crear navegación lateral por categorías y anchors estables.
- Separar el mapa `/architecture` de la referencia de contratos HTTP.
- Agrupar el catálogo, Wave, Flux y APIs planned.
- Mostrar método, path, estado, auth, contrato, request, response y boundary por operación.
- Añadir filtro local de endpoints para listas crecientes.
- Mantener `llms.txt` como contexto plano para agentes.

## Test plan (Playwright)

1. Navegar a `/documentation`.
2. Ver Overview, Architecture, API Reference, Concepts y AI Consumers en la navegación lateral.
3. Expandir operaciones de capabilities, Wave y Flux.
4. Filtrar por `flux` y comprobar que solo queda visible su operación.
5. Abrir `/architecture` y `/llms.txt` desde la documentación.
6. Validar desktop/mobile sin overflow ni errores de consola.

## Pass criteria

- Build y tests pasan.
- La API pública está agrupada por servicio y cada operación expone su contrato esencial.
- Architecture y price action no se mezclan con el catálogo HTTP.
- La página funciona como base extensible para nuevas facades.
