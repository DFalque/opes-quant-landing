# Sprint OPS-001: Command Center privado

## What

La landing ofrece un acceso privado y, tras autenticarse, un Command Center que resume la cuenta de Alpaca, la conexión read-only de Interactive Brokers, la curva de equity, la actividad del agente y el flujo de microservicios OPES en producción.

## Implementation

- Añadir accesos visibles a `/login` desde la portada.
- Usar el login de sesión `HttpOnly` del backend; mantener la compatibilidad Basic Auth fuera del flujo de navegador.
- Reemplazar el estado vacío de `/dashboard` por un island React tolerante a fallos parciales.
- Diferenciar datos observados por API de estados de catálogo que todavía no tienen health endpoint granular.
- Mantener la composición visual editorial de OPES y adaptar el Command Center a desktop y móvil.

## Test plan

1. Navegar a `/` y comprobar que existe el acceso a `Área privada`.
2. Navegar a `/login` y comprobar usuario, contraseña y CTA de entrada.
3. Navegar a `/dashboard` sin credenciales y comprobar que la pantalla explica el acceso requerido.
4. Mockear las respuestas de portfolio, accounts, services, equity curve, sesiones y health; comprobar KPIs, brokers, pipeline y gráfico.
5. Renderizar desktop y móvil y comprobar que no existe overflow horizontal.

## Pass criteria

- La build de Astro y la suite de Vitest pasan.
- El login envía las credenciales solo al endpoint de sesión y el navegador continúa con cookie `HttpOnly`.
- El login no contiene ninguna contraseña en el HTML ni en el JavaScript generado.
- Los errores parciales se muestran como estado explícito y no como cifras inventadas.
- Las cuatro dimensiones de evaluación visual obtienen al menos 3/5.
