# Sprint: Production control center

## What
La portada pública enlaza a un acceso privado. Tras autenticarse, `dfalque` llega a un dashboard visual que resume las cuentas de Alpaca e IBKR, el estado de los servicios OPES y la actividad reciente, siempre en modo lectura.

## Implementation
- Sustituir el almacenamiento de contraseñas en el navegador por sesión `HttpOnly`.
- Exponer snapshots de cuentas por broker desde la API, con edad, procedencia y estados `stale`/`unavailable`.
- Añadir un overview con tarjetas de broker, curva de equity, actividad y mapa de microservicios.
- Mantener fallback explícito cuando el runtime todavía no publica un snapshot de IBKR o de salud de servicios.

## Test plan
1. Navegar a `/` y abrir `Acceso privado`.
2. Navegar a `/login` y comprobar el formulario sin sidebar de dashboard.
3. Ejecutar el login contra un backend de prueba y verificar redirección a `/dashboard`.
4. Verificar que el navegador no guarda la contraseña en `localStorage` ni `sessionStorage`.
5. Navegar a `/dashboard` y comprobar tarjetas de brokers, curva de equity y servicios.
6. Comprobar la vista en móvil sin overflow horizontal.

## Pass criteria
- La contraseña solo viaja en el POST de login y la sesión posterior usa cookie `HttpOnly`.
- Los datos no disponibles se muestran como no disponibles, nunca como saldo inventado.
- Build, tests unitarios y E2E de la landing pasan.
