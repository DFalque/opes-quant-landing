# Sprint F-ARCH-001: Public architecture map

## What
La landing incorpora un recorrido público de arquitectura para explicar cómo OPES transforma datos de mercado en una lectura revisable. La portada conserva su función de marketing y enlaza a una vista separada con un mapa Archify de alto nivel, una lectura en tres etapas y un glosario de servicios sin exponer implementación privada.

## Implementation
- Generar y validar un artefacto Archify `architecture` con una topología pública y sanitizada.
- Añadir la ruta `/architecture` con el mapa embebido y un enlace al HTML independiente.
- Explicar el flujo con vocabulario no técnico y enlazar las fichas existentes de servicios.
- Añadir un teaser visual en la portada sin incrustar el diagrama técnico completo en el hero.
- Mantener responsive la página y respetar `prefers-reduced-motion`.

## Test plan
1. Ejecutar `npm run dev -- --port 4322` en la raíz del proyecto.
2. Navegar a `http://127.0.0.1:4322/architecture`.
3. Verificar que el iframe contiene el mapa Archify y que el enlace "Abrir mapa completo" apunta al HTML generado.
4. Verificar que aparecen las etapas "Recibe", "Interpreta" y "Revisa" y el glosario de servicios.
5. Navegar a `http://127.0.0.1:4322/` y verificar el teaser "Cómo funciona OPES".
6. Capturar screenshots desktop y mobile y comprobar que no hay overflow horizontal ni errores de consola.

## Pass criteria
- El JSON Archify pasa los 9 checks de validación `showcase` sin errores ni warnings.
- La ruta `/architecture` carga sin errores de consola.
- El flujo se entiende sin leer código ni conocer los nombres internos del runtime.
- La página mantiene la identidad visual de OPES y funciona en desktop y móvil.
- Los cuatro criterios de frontend-eval puntúan al menos 3/5.
