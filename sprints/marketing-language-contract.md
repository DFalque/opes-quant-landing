# Sprint F-MARKETING-001: Marketing language for OPES

## What
La landing debe vender OPES como un sistema de inteligencia de mercado: comunicar beneficios, diferenciación y claridad para el cliente, usando la arquitectura reciente como base sin exponer estados internos de runtime.

## Implementation
- Reescribir hero, métricas, principios, método y convergencia con lenguaje comercial.
- Traducir las features recientes de cada servicio a beneficios comprensibles.
- Eliminar estados operativos como `READ-ONLY`, `SHADOW` y `BOOTSTRAP` del catálogo y de la UI pública.
- Mantener la navegación, el diseño editorial y las páginas de detalle.

## Test plan
1. Navegar a `http://127.0.0.1:4322/`.
2. Verificar que el hero, el método y las tarjetas muestran copy comercial actualizado.
3. Verificar que no aparecen estados internos de runtime en la landing.
4. Interactuar con el paso `Decidir` y confirmar su detalle.
5. Comprobar las diez rutas de detalle y la navegación móvil.
6. Capturar screenshots desktop y mobile y comprobar que no hay overflow horizontal.

## Pass criteria
- La portada comunica beneficios sin claims de estado interno.
- Las features recientes siguen representadas de forma comprensible.
- La navegación y la interacción del método funcionan.
- Las diez rutas de servicio cargan correctamente.
- Los cuatro criterios de frontend-eval puntúan al menos 3/5.
