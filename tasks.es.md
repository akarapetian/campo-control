# Tareas

## T1: Base De App Y Estructura En Espanol

Status: [x]

### Resultado

Una app Vite + React + TypeScript con layout oscuro desktop-first, pantalla de inicio de sesion, estructura autenticada, ubicacion del logo de vaca de Campo Control, base de textos operativos en espanol y rutas principales.

### Alcance

- Crear scaffold de React y herramientas de test.
- Agregar login con tema oscuro y logo de vaca.
- Agregar estructura autenticada con navegacion de escritorio, menu de usuario y logo de vaca.
- Agregar rutas para tablero, hacienda, cultivos, finanzas, empleados, contratos/servicios, importaciones, reportes y configuracion.
- Agregar apilado basico en anchos reducidos cuando sea practico sin construir flujos moviles especializados.

### Dependencias

- Ninguna.

### Notas De Implementacion

- Usar textos en espanol para la copia operativa desde el inicio.
- Mantener layout desktop-first y denso en datos.
- Diferir navegacion movil y pantallas de carga de campo especificas.

### Criterios De Aceptacion Cubiertos

- Login oscuro con logo de vaca de Campo Control.
- Logo de vaca en la estructura autenticada.
- Texto operativo en espanol argentino.
- Desktop-first con tolerancia responsive basica.

### Casos De Test

- Happy path: usuario no autenticado ve login oscuro con logo de vaca.
- Error path: usuario no autenticado no puede acceder a rutas autenticadas.
- Edge case: viewport angosto apila el layout principal sin cortar la navegacion central.

### TDD Checklist

- [x] Write failing test
- [x] Verify test fails
- [x] Write minimal code to pass
- [x] Verify test passes
- [x] Refactor if needed
- [x] Verify tests still pass

## T2: Esquema Supabase, Roles Y Limites De Acceso

Status: [x]

### Resultado

Existen esquema principal de Supabase, roles de perfiles, datos seed y reglas de acceso por rol para duenio/admin, usuario de oficina, usuario de campo y solo lectura/contador.

### Alcance

- Agregar tablas iniciales de `plan.md`: profiles, cattle, weight_records, health_records, cattle_sales, crop_fields, crop_cycles, crop_events, counterparties, contracts, services, financial_transactions, cash_flow_items, employees, work_entries, employee_payments, import_batches, import_errors y reminders.
- Agregar valores de rol y usuarios/perfiles seed para escenarios de test.
- Agregar politicas RLS para finanzas/pagos, carga de campo, reportes y configuracion solo admin.

### Dependencias

- T1.

### Notas De Implementacion

- Mantener el esquema liviano: usar `cash_flow_items` para programar ingresos y egresos.
- No agregar libros contables, asientos, tablas impositivas ni calculos legales de liquidacion.

### Criterios De Aceptacion Cubiertos

- Usuario de campo sin acceso a configuracion de finanzas/pagos.
- Solo lectura/contador no puede crear, editar, importar ni marcar pagos como pagados.
- Las funciones de pagos/liquidacion evitan afirmaciones de cumplimiento legal.

### Casos De Test

- Happy path: duenio/admin puede acceder a todas las tablas protegidas y configuracion.
- Error path: usuario de campo no puede leer ni escribir configuracion de finanzas/pagos.
- Edge case: solo lectura/contador puede ver/exportar reportes pero no mutar registros operativos.

### TDD Checklist

- [x] Write failing test
- [x] Verify test fails
- [x] Write minimal code to pass
- [x] Verify test passes
- [x] Refactor if needed
- [x] Verify tests still pass

## T3: Estados Del Tablero De Flujo De Caja

Status: [x]

### Resultado

El tablero muestra efectivo cobrado/pagado separado del efectivo esperado por cobrar/pagar, con `cash_flow_items` proximos, vencen hoy y vencidos.

### Alcance

- Construir consultas/helpers del tablero para `cash_flow_items`.
- Agrupar items en ingresos proximos, egresos proximos, vencen hoy, ingresos vencidos y egresos vencidos.
- Mostrar totales de efectivo pagado/cobrado separados del efectivo esperado.
- Agregar etiquetas y estados vacios en espanol.

### Dependencias

- T1, T2.

### Notas De Implementacion

- Usar `settled_date` como fuente de verdad para efectivo cobrado/pagado.
- El efectivo esperado usa `expected_cash_date` y `status`.

### Criterios De Aceptacion Cubiertos

- Obligaciones futuras aparecen como proximas.
- Obligaciones vencidas e impagas aparecen como vencidas.
- Gastos diferidos aparecen como egresos proximos y no se cuentan como pagados.
- Gastos diferidos a pagar o vencidos siguen visibles hasta marcarse pagados.

### Casos De Test

- Happy path: tablero agrupa correctamente ingresos y egresos futuros.
- Error path: item vencido sin liquidar aparece como vencido hasta liquidarse.
- Edge case: item que vence hoy aparece en vencen-hoy, no en futuro ni vencido.

### TDD Checklist

- [x] Write failing test
- [x] Verify test fails
- [x] Write minimal code to pass
- [x] Verify test passes
- [x] Refactor if needed
- [x] Verify tests still pass

## T4: Perfiles De Hacienda, Pesos, Sanidad Y Grafico De Peso

Status: [x]

### Resultado

Los usuarios pueden listar hacienda, abrir un perfil, ver historial cronologico de peso y sanidad, agregar registros y ver un grafico de peso legible en escritorio/tablet.

### Alcance

- Construir lista de hacienda con busqueda por caravana/identificador y filtros de estado.
- Construir resumen de perfil de animal.
- Agregar creacion y vista cronologica de pesos.
- Agregar creacion y vista de eventos sanitarios vinculados al animal.
- Agregar grafico de peso con estado vacio en espanol.

### Dependencias

- T1, T2.

### Notas De Implementacion

- Los datos del grafico deben salir de `weight_records`, no de datos de ejemplo.
- Mantener formularios claros para escritorio/tablet; la carga optimizada para telefono queda diferida.

### Criterios De Aceptacion Cubiertos

- Perfil muestra historial de peso cronologico.
- Perfil muestra grafico de peso desde base de datos en escritorio/tablet.
- Perfil muestra eventos sanitarios vinculados al animal.
- Datos escasos o faltantes muestran estado vacio en espanol.

### Casos De Test

- Happy path: perfil renderiza datos del animal, pesos ordenados, eventos sanitarios y grafico.
- Error path: perfil de animal inexistente muestra estado en espanol de no encontrado o vacio.
- Edge case: animal con uno o cero pesos muestra estado vacio/escaso en vez de grafico enganoso.

### TDD Checklist

- [x] Write failing test
- [x] Verify test fails
- [x] Write minimal code to pass
- [x] Verify test passes
- [x] Refactor if needed
- [x] Verify tests still pass

## T5: Ventas De Hacienda Y Programacion De Cobro Diferido

Status: [x]

### Resultado

Los usuarios pueden registrar ventas de hacienda y crear `cash_flow_items` de ingreso vinculados para cobro contado, 30 dias, 60 dias o fecha personalizada.

### Alcance

- Construir carga de venta para animal individual o lote.
- Vincular venta con comprador/contraparte e importe.
- Crear `cash_flow_items` de ingreso con plazo y fecha esperada de cobro.
- Marcar cobranza liquidada y reflejarla en el tablero.

### Dependencias

- T2, T3, T4.

### Notas De Implementacion

- `cattle_sales` registra el evento operativo de venta.
- `cash_flow_items` registra el cobro esperado y liquidado.

### Criterios De Aceptacion Cubiertos

- Venta contado puede contarse como cobrada una vez marcada recibida.
- Venta diferida aparece como cuenta a cobrar proxima antes de la fecha esperada.
- Cuenta a cobrar vencida aparece vencida hasta marcarse cobrada.

### Casos De Test

- Happy path: venta de hacienda a 60 dias crea item de ingreso proximo.
- Error path: venta sin comprador, importe o fecha esperada no se guarda.
- Edge case: venta contado solo cuenta como efectivo recibido despues de marcarse liquidada.

### TDD Checklist

- [x] Write failing test
- [x] Verify test fails
- [x] Write minimal code to pass
- [x] Verify test passes
- [x] Refactor if needed
- [x] Verify tests still pass

## T6: Transacciones Financieras Y Gastos Diferidos

Status: [x]

### Resultado

Los usuarios pueden registrar ingresos/egresos y programar gastos diferidos con plazos contado, 30 dias, 60 dias y fecha personalizada.

### Alcance

- Construir lista y formulario de transacciones financieras.
- Mostrar ARS por defecto con referencia USD opcional.
- Crear `cash_flow_items` de egreso vinculados para gastos diferidos.
- Marcar items de egreso como pagados/liquidados.

### Dependencias

- T2, T3.

### Notas De Implementacion

- Separar fecha de transaccion de fecha esperada de caja.
- Reportes y tablero no deben tratar gastos diferidos sin liquidar como efectivo pagado.

### Criterios De Aceptacion Cubiertos

- ARS es moneda predeterminada.
- Gasto diferido aparece como egreso proximo antes de la fecha de pago/debito.
- Gasto diferido aparece a pagar o vencido hasta marcarse pagado.

### Casos De Test

- Happy path: gasto a 30 dias crea item de egreso proximo con ARS por defecto.
- Error path: gasto sin importe o fecha esperada falla validacion.
- Edge case: monto USD de referencia puede existir sin reemplazar visualizacion ARS.

### TDD Checklist

- [x] Write failing test
- [x] Verify test fails
- [x] Write minimal code to pass
- [x] Verify test passes
- [x] Refactor if needed
- [x] Verify tests still pass

## T7: Cultivos, Servicios Y Analitica De Cultivos

Status: [x]

### Resultado

Los usuarios pueden administrar lotes, ciclos, eventos de campo, servicios/costos y analitica de cultivos legible en escritorio/tablet.

### Alcance

- Construir pantallas de campos/lotes y ciclos de cultivo.
- Agregar eventos de cultivo para actividad y produccion/rinde.
- Vincular servicios y transacciones financieras al lote/ciclo cuando aplique.
- Construir filtros de analitica por lote, ciclo, rango de fechas y tipo de metrica.
- Mostrar estados vacios en espanol para datos faltantes o escasos.

### Dependencias

- T2, T6.

### Notas De Implementacion

- Usar `crop_events` para actividad y produccion/rinde en vez de tabla separada.
- Usar solo datos operativos; no datos falsos de grafico.

### Criterios De Aceptacion Cubiertos

- Analitica muestra graficos filtrados por lote, ciclo, rango de fechas y metrica.
- Datos faltantes o escasos muestran estado vacio en espanol.

### Casos De Test

- Happy path: analitica de cultivos renderiza grafico de costos/actividad/rinde desde registros vinculados.
- Error path: usuario sin permiso no puede editar cultivos/servicios.
- Edge case: datos escasos muestran estado vacio en espanol.

### TDD Checklist

- [x] Write failing test
- [x] Verify test fails
- [x] Write minimal code to pass
- [x] Verify test passes
- [x] Refactor if needed
- [x] Verify tests still pass

## T8: Contratos, Servicios, Contrapartes Y Adjuntos

Status: [x]

### Resultado

Los usuarios pueden administrar contrapartes, contratos, servicios, cronogramas de pago y adjuntos opcionales.

### Alcance

- Construir lista/detalle de contrapartes.
- Construir contratos y servicios vinculados a contrapartes.
- Agregar referencias opcionales a adjuntos con Supabase Storage.
- Crear `cash_flow_items` programados desde cronogramas de contratos o servicios.

### Dependencias

- T2, T3, T6.

### Notas De Implementacion

- Los adjuntos son opcionales en v1 salvo que la pregunta abierta se resuelva diferente.
- Los cronogramas de contratos/servicios deben reutilizar `cash_flow_items`.

### Criterios De Aceptacion Cubiertos

- Obligaciones de pago de contratos/servicios pueden aparecer proximas o vencidas.
- El acceso por rol deniega ediciones no autorizadas.

### Casos De Test

- Happy path: servicio con pago diferido crea item de egreso vinculado.
- Error path: rol no autorizado no puede crear ni editar contrato/servicio.
- Edge case: contrato puede guardarse sin adjunto cuando los adjuntos son opcionales.

### TDD Checklist

- [x] Write failing test
- [x] Verify test fails
- [x] Write minimal code to pass
- [x] Verify test passes
- [x] Refactor if needed
- [x] Verify tests still pass

## T9: Importaciones Con Vista Previa E Historial

Status: [x]

### Resultado

Los usuarios pueden importar plantillas CSV/Excel, previsualizar filas validas, ver errores por fila en espanol, confirmar registros validos y revisar historial de importaciones.

### Alcance

- Construir wizard de importacion: elegir tipo, subir archivo, previsualizar filas, revisar errores y confirmar.
- Implementar validacion de campos requeridos y tipos basicos.
- Registrar metadatos de lote y errores por fila.
- Soportar los principales tipos de registro definidos por plantillas v1.

### Dependencias

- T2 y la tabla destino de cada plantilla.

### Notas De Implementacion

- No guardar filas invalidas.
- Las plantillas deben mantenerse acotadas para evitar importaciones comodin.

### Criterios De Aceptacion Cubiertos

- Importacion valida muestra vista previa antes de guardar.
- Importacion invalida muestra errores por fila en espanol y no guarda filas invalidas.

### Casos De Test

- Happy path: importacion valida de hacienda previsualiza y confirma registros.
- Error path: filas invalidas muestran errores por fila en espanol y no se guardan.
- Edge case: archivo mixto valido/invalido confirma solo luego de accion explicita del usuario sobre filas validas.

### TDD Checklist

- [x] Write failing test
- [x] Verify test fails
- [x] Write minimal code to pass
- [x] Verify test passes
- [x] Refactor if needed
- [x] Verify tests still pass

## T10: Empleados, Seguimiento De Pagos Y Exportacion

Status: [x]

### Resultado

Los usuarios pueden administrar empleados, partes de trabajo, adelantos, pagos y exportar datos de pagos/liquidacion por rango de fechas sin sugerir cumplimiento legal laboral.

### Alcance

- Construir lista/detalle de empleados.
- Agregar partes de trabajo, adelantos y pagos.
- Agregar exportacion por rango de fechas con empleados, pagos, adelantos y totales.
- Agregar texto explicativo en espanol que evite afirmaciones de impuestos, deducciones o cumplimiento legal.

### Dependencias

- T2, T6.

### Notas De Implementacion

- No calcular aportes, deducciones ni cumplimiento legal de liquidacion en Argentina.
- Los pagos a empleados pueden crear `cash_flow_items` de egreso cuando se necesite programar fecha de pago.

### Criterios De Aceptacion Cubiertos

- Exportacion incluye empleados, pagos, adelantos y totales del periodo.
- Texto de pagos/liquidacion no afirma cumplimiento legal.
- Solo lectura/contador puede ver/exportar pero no editar.

### Casos De Test

- Happy path: usuario de oficina exporta reporte de pagos/liquidacion por rango.
- Error path: usuario de campo no puede acceder a configuracion de pagos/liquidacion.
- Edge case: exportacion sin filas devuelve estado vacio en espanol con totales cero.

### TDD Checklist

- [x] Write failing test
- [x] Verify test fails
- [x] Write minimal code to pass
- [x] Verify test passes
- [x] Refactor if needed
- [x] Verify tests still pass

## T11: Job De Recordatorios Y Seleccion De Email

Status: [x]

### Resultado

La logica programada de recordatorios selecciona `cash_flow_items` a vencer y vencidos, y envia o registra recordatorios por email para usuarios asignados.

### Alcance

- Agregar configuracion de ventana de recordatorio.
- Agregar job programado o Edge Function para seleccion de recordatorios.
- Crear registros de recordatorio.
- Integrar proveedor de email elegido o una abstraccion de proveedor.
- Cubrir casos a vencer, vencidos, ya liquidados y sin destinatario.

### Dependencias

- T2, T3.

### Notas De Implementacion

- El proveedor de email sigue como pregunta abierta de Fase 1; se puede implementar con un adaptador hasta seleccionarlo.
- Items liquidados no deben generar nuevos recordatorios a vencer/vencidos.

### Criterios De Aceptacion Cubiertos

- Los recordatorios por email se envian a usuarios asignados para obligaciones a vencer y vencidas cuando estan habilitados.

### Casos De Test

- Happy path: items a vencer y vencidos sin liquidar generan recordatorios para usuarios asignados.
- Error path: items liquidados no generan recordatorios.
- Edge case: destinatario faltante se registra como omitido/fallido sin detener todo el job.

### TDD Checklist

- [x] Write failing test
- [x] Verify test fails
- [x] Write minimal code to pass
- [x] Verify test passes
- [x] Refactor if needed
- [x] Verify tests still pass

## T12: Reportes, Configuracion Y Checks De Localizacion

Status: [x]

### Resultado

Los usuarios pueden acceder a reportes prioritarios y configuracion, y la app tiene checks de release para textos operativos en espanol, ARS por defecto, legibilidad desktop-first y alineacion de artefactos bilingues.

### Alcance

- Construir indice de reportes para resumen financiero, exportacion de pagos/liquidacion, sanidad de hacienda, peso de hacienda, obligaciones contractuales y costos de cultivos.
- Construir configuracion de usuarios, roles, ventanas de recordatorio y plantillas de importacion.
- Agregar checks de localizacion para copia operativa en espanol.
- Agregar verificacion de que artefactos `.es.md` mantengan la estructura de los artefactos en ingles.

### Dependencias

- T1 a T11.

### Notas De Implementacion

- Tratar criterios de aceptacion de `spec.md` como fuente de verificacion del release.
- Mantener lenguaje de reportes operativo y sin afirmaciones de cumplimiento legal.

### Criterios De Aceptacion Cubiertos

- Texto operativo en espanol argentino.
- Moneda predeterminada ARS.
- Artefactos de planificacion con estructura `.es.md` equivalente.
- Reportes exponen salidas operativas prioritarias.

### Casos De Test

- Happy path: admin configura usuarios/roles/ventanas de recordatorio y ve reportes.
- Error path: usuario no autorizado no puede editar configuracion.
- Edge case: check de estructura falla si falta una seccion equivalente en un archivo de planificacion en espanol.

### TDD Checklist

- [x] Write failing test
- [x] Verify test fails
- [x] Write minimal code to pass
- [x] Verify test passes
- [x] Refactor if needed
- [x] Verify tests still pass

## T13: Selector De Idioma Para Usuarios Que Hablan Ingles

Status: [x]

### Resultado

Los usuarios pueden cambiar textos soportados de login, estructura de app, navegacion y tablero entre espanol e ingles mientras el espanol sigue siendo el idioma predeterminado del producto.

### Alcance

- Agregar textos centralizados para etiquetas soportadas de estructura/login/tablero.
- Agregar selector de idioma visible en login y estructura autenticada.
- Mantener espanol como idioma predeterminado.
- Preservar ARS como moneda principal y supuestos de negocio con espanol como base.

### Dependencias

- T1, T3, T12.

### Notas De Implementacion

- Guardar preferencia de idioma en estado React para v1.
- No traducir todos los datos de dominio ni plantillas de planillas en esta tarea.

### Criterios De Aceptacion Cubiertos

- Usuario que habla ingles puede cambiar etiquetas soportadas a ingles.
- Usuario puede volver etiquetas soportadas a espanol argentino.
- Espanol sigue siendo predeterminado.

### Casos De Test

- Happy path: cambiar de espanol a ingles actualiza login, navegacion y etiquetas de tablero.
- Error path: aviso de ruta protegida sigue el idioma seleccionado.
- Edge case: volver a espanol restaura etiquetas en espanol.

### TDD Checklist

- [x] Write failing test
- [x] Verify test fails
- [x] Write minimal code to pass
- [x] Verify test passes
- [x] Refactor if needed
- [x] Verify tests still pass
