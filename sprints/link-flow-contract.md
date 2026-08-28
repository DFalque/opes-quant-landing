# Sprint F-LINK-001: Link world-context flow

## What
La página de detalle de Link conserva el chrome común de OPES, pero incorpora una narrativa visual propia: fuentes oficiales y research entran por una rama macro/sectorial o por una rama micro/empresa; Link las normaliza, contrasta y enriquece con LLM; el contexto resultante llega a Cortex y a las inteligencias que lo consumen.

## Implementation
- Mantener la navegación, el hero y el footer compartidos de `ServiceDetail`.
- Renderizar un componente específico para `link` con un diagrama responsive.
- Usar etiquetas funcionales `MACRO / SECTOR` y `MICRO / EMPRESA` sin fijar el nombre pendiente `Link Value`.
- Hacer que el contenido sea comprensible aunque se desactive el movimiento.

## Test plan
1. Navegar a `http://127.0.0.1:4322/landing/link`.
2. Verificar que aparecen las dos ramas de fuentes y el motor `LINK`.
3. Verificar que aparecen las operaciones `CAPTURA`, `CONTRASTA`, `CLASIFICA` y `CONECTA`.
4. Verificar que aparecen `CORTEX`, `ATLAS`, `LENS` y `OPES INTELLIGENCE` como consumidores.
5. Capturar screenshots desktop y mobile y comprobar que no hay overflow horizontal.

## Pass criteria
- La ruta carga sin errores de consola.
- El flujo visual se entiende en desktop y móvil.
- La página mantiene navegación y footer comunes.
- Los cuatro criterios de frontend-eval puntúan al menos 3/5.
