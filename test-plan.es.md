# Plan De Tests

## Estrategia De Tests

Usar TDD desde la Fase 3. Empezar cada tarea escribiendo el test minimo que falle para el comportamiento definido aqui, confirmar la falla esperada, implementar el codigo minimo y volver a ejecutar el test objetivo. Usar Vitest y React Testing Library para comportamiento de UI, tests enfocados de queries/helpers para flujo de caja y analitica, y tests SQL/politicas de Supabase cuando sea practico para esquema y RLS. La verificacion completa de build/typecheck/tests queda para Fase 4.

## T1: Base De App Y Estructura En Espanol

### Happy Path

- Test: Renderizar raiz de app sin autenticar.
- Expected failure before implementation: no existe login ni estructura de app.
- Expected pass condition: el login se renderiza con tema oscuro, logo de vaca de Campo Control y texto en espanol.

### Error Paths

- Test: Navegar a `/dashboard` sin autenticacion.
- Expected failure before implementation: no existe manejo de ruta protegida.
- Expected pass condition: el usuario es redirigido a login o ve un aviso de acceso en espanol.

### Edge Cases

- Test: Renderizar estructura en viewport angosto.
- Expected failure before implementation: el layout no existe o corta la navegacion principal.
- Expected pass condition: navegacion/logo principales quedan visibles o apilados sin corte horizontal.

## T2: Esquema Supabase, Roles Y Limites De Acceso

### Happy Path

- Test: Perfil duenio/admin puede leer/escribir tablas operativas principales.
- Expected failure before implementation: no existen esquema, perfiles seed o politicas.
- Expected pass condition: duenio/admin puede ejecutar operaciones permitidas.

### Error Paths

- Test: Usuario de campo intenta acceder a configuracion de finanzas/pagos.
- Expected failure before implementation: no existe limite RLS/politica.
- Expected pass condition: acceso denegado.

### Edge Cases

- Test: Solo lectura/contador intenta marcar un item de flujo de caja como liquidado.
- Expected failure before implementation: la mutacion no esta bloqueada.
- Expected pass condition: solo lectura/contador puede ver/exportar pero no mutar.

## T3: Estados Del Tablero De Flujo De Caja

### Happy Path

- Test: Helper del tablero agrupa `cash_flow_items` futuros sin liquidar de ingreso/egreso.
- Expected failure before implementation: falta helper de agrupacion o query del tablero.
- Expected pass condition: los items se agrupan como ingresos proximos y egresos proximos.

### Error Paths

- Test: Fecha esperada pasada sin `settled_date` aparece vencida.
- Expected failure before implementation: falta logica de vencidos.
- Expected pass condition: el item queda vencido hasta liquidarse.

### Edge Cases

- Test: Item con fecha esperada igual a hoy aparece como vence hoy.
- Expected failure before implementation: falta estado vence-hoy o se clasifica mal.
- Expected pass condition: el item no se agrupa como futuro ni vencido.

## T4: Perfiles De Hacienda, Pesos, Sanidad Y Grafico De Peso

### Happy Path

- Test: Perfil de hacienda renderiza detalles, pesos cronologicos, eventos sanitarios vinculados y datos de grafico desde `weight_records`.
- Expected failure before implementation: no existen perfil de hacienda ni queries.
- Expected pass condition: los registros se muestran ordenados y el grafico recibe datos de base.

### Error Paths

- Test: Solicitar perfil de animal inexistente.
- Expected failure before implementation: no hay manejo de estado faltante.
- Expected pass condition: se muestra estado de no encontrado o vacio en espanol.

### Edge Cases

- Test: Animal con uno o cero registros de peso abre area de grafico.
- Expected failure before implementation: el grafico renderiza salida enganosa o rota.
- Expected pass condition: se muestra estado vacio/escaso en espanol.

## T5: Ventas De Hacienda Y Programacion De Cobro Diferido

### Happy Path

- Test: Crear venta de hacienda con plazo de 60 dias.
- Expected failure before implementation: falta formulario de venta o creacion de flujo de caja.
- Expected pass condition: se crean fila `cattle_sales` y fila `cash_flow_items` de ingreso con fecha esperada de cobro.

### Error Paths

- Test: Enviar venta sin comprador, importe o fecha esperada.
- Expected failure before implementation: falta validacion.
- Expected pass condition: aparecen errores en espanol y no se guarda ningun registro.

### Edge Cases

- Test: Crear venta contado sin marcarla liquidada.
- Expected failure before implementation: la venta contado puede contarse como efectivo recibido inmediatamente.
- Expected pass condition: la venta aparece esperada/a cobrar hasta marcarse liquidada.

## T6: Transacciones Financieras Y Gastos Diferidos

### Happy Path

- Test: Crear transaccion de gasto a 30 dias.
- Expected failure before implementation: falta formulario financiero o creacion de egreso programado.
- Expected pass condition: se crean transaccion ARS y fila `cash_flow_items` de egreso vinculada.

### Error Paths

- Test: Enviar gasto sin importe o fecha esperada de pago/debito.
- Expected failure before implementation: falta validacion.
- Expected pass condition: aparecen errores en espanol y no se guarda registro invalido.

### Edge Cases

- Test: Agregar referencia USD opcional a gasto ARS.
- Expected failure before implementation: falta formato de moneda o soporte USD opcional.
- Expected pass condition: ARS sigue como visualizacion primaria y USD aparece solo como referencia.

## T7: Cultivos, Servicios Y Analitica De Cultivos

### Happy Path

- Test: Analitica de cultivos renderiza datos filtrados de costo/actividad/rinde desde registros vinculados.
- Expected failure before implementation: falta query o grafico de analitica.
- Expected pass condition: los datos del grafico responden a filtros de lote, ciclo, rango de fechas y metrica.

### Error Paths

- Test: Rol no autorizado intenta editar cultivos/servicios.
- Expected failure before implementation: falta control por rol o RLS.
- Expected pass condition: edicion denegada.

### Edge Cases

- Test: Analitica abre con datos de cultivo faltantes o escasos.
- Expected failure before implementation: el grafico se rompe o muestra datos falsos.
- Expected pass condition: aparece estado vacio/escaso en espanol.

## T8: Contratos, Servicios, Contrapartes Y Adjuntos

### Happy Path

- Test: Crear servicio vinculado a contraparte con cronograma de pago diferido.
- Expected failure before implementation: falta formulario de servicio o creacion de cronograma.
- Expected pass condition: se crean servicio y `cash_flow_items` de egreso.

### Error Paths

- Test: Rol no autorizado intenta crear contrato/servicio.
- Expected failure before implementation: falta enforcement de acceso.
- Expected pass condition: creacion/edicion denegada.

### Edge Cases

- Test: Guardar contrato sin adjunto.
- Expected failure before implementation: el formulario puede exigir adjunto incorrectamente.
- Expected pass condition: contrato se guarda con campos requeridos validos y sin adjunto.

## T9: Importaciones Con Vista Previa E Historial

### Happy Path

- Test: Subir plantilla valida de hacienda.
- Expected failure before implementation: no existe parser/vista previa.
- Expected pass condition: filas parseadas se previsualizan y luego se confirman creando registros e historial.

### Error Paths

- Test: Subir archivo con campos requeridos invalidos.
- Expected failure before implementation: falta validacion por fila.
- Expected pass condition: aparecen errores por fila en espanol y no se guardan registros invalidos.

### Edge Cases

- Test: Subir filas mixtas validas e invalidas.
- Expected failure before implementation: comportamiento de vista previa parcial no definido.
- Expected pass condition: filas validas se previsualizan, invalidas muestran errores y confirmar requiere accion explicita.

## T10: Empleados, Seguimiento De Pagos Y Exportacion

### Happy Path

- Test: Usuario de oficina exporta reporte de pagos/liquidacion por rango seleccionado.
- Expected failure before implementation: no existe exportacion de empleados/pagos.
- Expected pass condition: exportacion incluye empleados, pagos, adelantos y totales.

### Error Paths

- Test: Usuario de campo intenta acceder a configuracion de pagos/liquidacion.
- Expected failure before implementation: falta denegacion de acceso.
- Expected pass condition: acceso denegado.

### Edge Cases

- Test: Exportar rango sin pagos a empleados.
- Expected failure before implementation: falta manejo de exportacion vacia.
- Expected pass condition: se produce estado vacio en espanol o exportacion con totales cero.

## T11: Job De Recordatorios Y Seleccion De Email

### Happy Path

- Test: Corre job con `cash_flow_items` a vencer y vencidos sin liquidar.
- Expected failure before implementation: falta job/seleccion de recordatorios.
- Expected pass condition: se crean registros de recordatorio y se llama al adaptador de email para destinatarios asignados.

### Error Paths

- Test: Job ve items ya liquidados.
- Expected failure before implementation: items liquidados pueden seleccionarse.
- Expected pass condition: items liquidados se omiten.

### Edge Cases

- Test: Usuario asignado no tiene email de notificacion.
- Expected failure before implementation: el job puede fallar o descartar silenciosamente el item.
- Expected pass condition: recordatorio se registra como omitido/fallido sin detener otros recordatorios.

## T12: Reportes, Configuracion Y Checks De Localizacion

### Happy Path

- Test: Admin abre reportes/configuracion y actualiza ventana de recordatorio.
- Expected failure before implementation: no existen pantallas de reportes/configuracion.
- Expected pass condition: admin puede ver reportes y guardar configuracion de recordatorios.

### Error Paths

- Test: Usuario no autorizado intenta editar configuracion.
- Expected failure before implementation: falta guard de configuracion.
- Expected pass condition: edicion denegada.

### Edge Cases

- Test: Check de artefactos bilingues corre con una seccion faltante en espanol.
- Expected failure before implementation: no existe check de alineacion de artefactos.
- Expected pass condition: el check falla con mensaje util que nombra la seccion faltante.

## T13: Selector De Idioma Para Usuarios Que Hablan Ingles

### Happy Path

- Test: Usuario cambia de espanol a ingles en login y luego inicia sesion.
- Expected failure before implementation: no existe selector de idioma ni textos traducidos.
- Expected pass condition: login, navegacion, titulo de tablero y etiquetas de flujo de caja se muestran en ingles.

### Error Paths

- Test: Usuario abre una ruta protegida con idioma en ingles.
- Expected failure before implementation: el aviso de ruta protegida queda solo en espanol.
- Expected pass condition: el aviso de ruta protegida se muestra en ingles.

### Edge Cases

- Test: Usuario vuelve de ingles a espanol.
- Expected failure before implementation: el estado de idioma no puede volver o las etiquetas quedan en ingles.
- Expected pass condition: las etiquetas soportadas vuelven a espanol argentino.
