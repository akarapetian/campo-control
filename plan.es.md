# Plan

## Stack Tecnologico

- Frontend: Vite, React, TypeScript.
- UI: tema oscuro, layouts desktop-first, textos operativos con espanol como predeterminado y soporte de selector a ingles, contraste accesible y pantallas compactas con alta densidad de datos y tolerancia basica para anchos reducidos.
- Graficos: componentes React responsive para series temporales y graficos por categoria, respaldados por helpers de consulta tipados en vez de datos de ejemplo hard-codeados.
- Backend: Supabase Auth, Postgres, Row Level Security, Storage y Edge Functions o jobs programados.
- Importaciones: parseo de CSV y Excel en el flujo de app/backend con vista previa de validacion antes de guardar.
- Testing: Vitest y React Testing Library para comportamiento frontend, tests de SQL/politicas de Supabase cuando sea practico, y tests de integracion para logica de importacion/recordatorios.
- Destino de despliegue: app web hosteada con un proyecto Supabase respaldando los datos de produccion.

## Arquitectura

- Aplicacion React de una pagina con rutas autenticadas para tablero, hacienda, cultivos, finanzas, empleados, contratos/servicios, importaciones, reportes y configuracion.
- Supabase Auth administra usuarios y sesiones.
- Postgres guarda registros operativos, lotes de importacion y recordatorios.
- Row Level Security aplica acceso por rol para duenio/admin, usuario de oficina, usuario de campo y solo lectura/contador.
- Supabase Storage guarda adjuntos como contratos, comprobantes y documentos de soporte.
- Jobs programados identifican items de flujo de caja proximos y vencidos, y envian recordatorios por email.
- Las vistas de flujo de caja del tablero usan un unico modelo de flujo de caja programado para obligaciones a pagar y cuentas a cobrar, incluyendo cobranzas de ventas de hacienda y gastos diferidos que pueden ser contado, diferidos 30/60 dias o con fecha personalizada.
- Las vistas de analitica consultan directamente tablas operativas normalizadas para los graficos v1:
  - Los graficos de peso de hacienda usan `weight_records` filtrado por `cattle_id` y ordenado por `date`.
  - Los graficos de cultivos usan `crop_cycles`, `crop_events`, `services` y `financial_transactions` filtrados por lote, ciclo, metrica y rango de fechas.
  - Los datasets vacios, escasos o restringidos por permisos devuelven estados vacios en espanol en lugar de datos falsos.
- Flujo de importacion:
  - El usuario selecciona el tipo de registro y sube CSV/Excel.
  - La app parsea el archivo y lo mapea a la plantilla esperada.
  - La vista previa de validacion muestra filas aceptadas y errores por fila en espanol.
  - El usuario confirma y guarda registros validos.
  - El historial de importaciones registra metadatos del archivo, conteos, errores y estado de confirmacion.
- Artefactos bilingues del proyecto:
  - Cada artefacto de planificacion en ingles tiene un artefacto equivalente `.es.md` en espanol.
  - Identificadores tecnicos, comandos, paths, nombres de tablas, IDs de tareas e IDs de tests permanecen iguales entre idiomas.

## Plan De UI

La UI debe planificarse como un espacio de trabajo operativo con permisos por rol, no como modulos separados sin conexion. La primera pantalla autenticada es el tablero, con navegacion a areas de trabajo enfocadas para hacienda, cultivos, finanzas, importaciones, reportes y configuracion.

Estructura de app:

- Estructura oscura persistente con logo de vaca de Campo Control, navegacion principal, menu de usuario y visibilidad de opciones segun rol.
- En escritorio usa navegacion lateral y layouts densos basados en tablas.
- En anchos reducidos usa layouts apilados cuando sea practico, pero la navegacion especifica para telefono y las pantallas de carga de campo quedan diferidas de v1.
- Textos operativos, estados vacios, validacion, filtros y acciones usan espanol por defecto; las etiquetas soportadas de estructura/tablero/login pueden cambiar a ingles con un selector de idioma sin cambiar el comportamiento de negocio basado en ARS.
- La preferencia de idioma debe representarse como estado de la app en v1 y luego puede moverse al perfil del usuario.

Tablero:

- Fila superior de resumen separa efectivo cobrado/pagado de efectivo esperado por cobrar/pagar.
- Area de flujo de caja agrupa `cash_flow_items` en ingresos proximos, egresos proximos, vencen hoy, ingresos vencidos y egresos vencidos.
- Area de alertas operativas muestra seguimientos sanitarios de hacienda, importaciones recientes y lotes de importacion fallidos.
- Acciones rapidas llevan a flujos comunes como agregar peso, agregar evento sanitario, registrar gasto, registrar venta de hacienda, importar planilla y exportar reporte.

UI de hacienda:

- Lista de hacienda con busqueda por caravana/identificador, filtros de estado y acceso rapido a perfiles.
- Perfil de animal con pestanas o secciones para resumen, historial de peso, eventos sanitarios y ventas.
- Formularios de peso y sanidad optimizados para carga clara en escritorio/tablet; la carga en telefono con una mano queda diferida.
- La carga de venta registra el evento de venta y luego crea o vincula `cash_flow_items` programados para cobro contado o diferido.

UI de finanzas y flujo de caja:

- Inicio de finanzas muestra transacciones, items programados de flujo de caja y estados vencidos/a vencer como vistas separadas sobre los mismos registros.
- La carga de gasto o compra registra la transaccion y luego crea o vincula una fila `cash_flow_items` de egreso para contado, 30 dias, 60 dias o plazo personalizado.
- Los estados de cobranza de ventas de hacienda y gastos diferidos usan etiquetas, filtros por fecha y acciones de marcar liquidado consistentes.
- Los reportes distinguen ingresos/gastos registrados del efectivo realmente cobrado/pagado.

UI de cultivos:

- El area de cultivos empieza desde campos/lotes y luego entra a ciclos de cultivo.
- El detalle de ciclo muestra eventos de campo, servicios/costos y eventos de produccion/rinde desde `crop_events`.
- La pantalla de analitica de cultivos ofrece filtros por lote, ciclo, rango de fechas y tipo de metrica, con estados vacios en espanol cuando faltan datos o son escasos.

UI de importaciones:

- El flujo de importacion es un wizard: elegir tipo de registro, subir archivo, previsualizar filas parseadas, revisar errores por fila en espanol y confirmar filas validas.
- El historial de importaciones muestra archivo origen, tipo de registro, conteo de filas, conteo de errores, estado y usuario creador.

UI de reportes y configuracion:

- Los reportes se enfocan en resumen financiero, exportacion de pagos/liquidacion, sanidad de hacienda, peso de hacienda, obligaciones contractuales y costos de cultivos.
- Configuracion cubre usuarios, roles, ventanas de recordatorio y plantillas de importacion.
- Las pantallas de reportes de pagos/liquidacion no deben usar lenguaje de cumplimiento legal laboral.
- Configuracion deberia exponer luego la preferencia de idioma del usuario; v1 puede mantener el selector en el login y estructura de app.

## Modelo De Datos

Entidades iniciales del dominio:

- `profiles`: perfil de usuario, nombre visible, rol, email de notificaciones, estado activo.
- `cattle`: caravana/identificador, nombre o etiqueta, estado, sexo, raza, fecha de nacimiento, fecha de adquisicion, origen, notas.
- `cattle_sales`: referencia opcional a un animal para ventas individuales, descripcion de lote o cantidad de animales para ventas grupales, comprador/contraparte, fecha de venta, monto bruto ARS, monto USD opcional, notas.
- `weight_records`: referencia a hacienda, fecha, peso, unidad, notas, usuario que registro.
- `health_records`: referencia a hacienda, fecha, tipo, sintomas, tratamiento, medicacion, veterinario, fecha de seguimiento, notas.
- `crop_fields`: nombre de campo/lote, notas de ubicacion, superficie, estado activo.
- `crop_cycles`: referencia a lote, cultivo, campana/temporada, fecha de inicio, fecha de fin, estado, notas.
- `crop_events`: referencia a ciclo de cultivo, referencia a lote, fecha, tipo de evento, cantidad, unidad, categoria de costo opcional, marca de produccion/rinde, notas, usuario que registro.
- `counterparties`: proveedores, clientes, contratistas, prestadores de servicios, datos de contacto.
- `contracts`: referencia a contraparte, tipo, fechas de inicio/fin, resumen, estado, referencias a adjuntos.
- `services`: registros de servicios agricolas/ganaderos/del negocio, referencias opcionales a lote/ciclo/animal, referencia a contraparte, fecha, descripcion, costo, contrato vinculado, notas.
- `financial_transactions`: tipo ingreso/egreso, categoria, contraparte, referencias opcionales a lote/ciclo/servicio, monto ARS, monto USD opcional, fecha de transaccion, descripcion, referencias a adjuntos.
- `cash_flow_items`: direccion ingreso/egreso, contraparte, referencia opcional a venta de hacienda/contrato/servicio/transaccion/pago de empleado origen, monto, moneda, fecha de emision, fecha esperada de caja, plazo de pago, medio de pago, estado, usuario asignado, fecha de liquidacion.
- `employees`: identidad/contacto, rol/puesto, fecha de inicio, estado activo, notas.
- `work_entries`: referencia a empleado, fecha, descripcion del trabajo, horas/dias/cantidad, notas.
- `employee_payments`: referencia a empleado, fecha, monto, tipo, periodo inicio/fin, notas.
- `import_batches`: metadatos del archivo subido, tipo de registro, estado, creado por, cantidad de filas, cantidad de errores.
- `import_errors`: referencia al lote, numero de fila, campo, mensaje.
- `reminders`: referencia a item de flujo de caja, fecha de recordatorio, canal, estado, destinatario.

El esquema debe empezar lo suficientemente normalizado para soportar importaciones, filtros, recordatorios, reportes y acceso por rol sin sobredisenar reglas legales de contabilidad o liquidacion.

Simplificaciones intencionales para v1:

- Usar `cash_flow_items` para programar ingresos y egresos en lugar de tablas separadas de cuentas a cobrar y cuentas a pagar. Direccion, referencia de origen, fecha esperada de caja y estado alcanzan para recordatorios del tablero y reportes de flujo de caja.
- Mantener el plazo de cobro de ventas de hacienda en `cash_flow_items`, no duplicado en `cattle_sales`; `cattle_sales` registra el evento operativo de venta.
- Usar `crop_events` para actividad de campo y eventos de produccion/rinde en lugar de una tabla separada de salidas de cultivo. Las filas de cosecha o produccion se distinguen por tipo de evento y marca de produccion/rinde.
- Evitar en v1 estructuras contables como cuentas, asientos, reglas impositivas o partida doble.

El soporte de graficos debe salir de los mismos registros normalizados usados por las pantallas operativas. La app no debe mantener un almacen separado solo para graficos en v1; si luego el rendimiento lo requiere, se pueden agregar vistas agregadas de reportes sin cambiar el modelo de captura.

## Dependencias

- Proyecto Supabase y variables de entorno para ambientes local y hosteado.
- Proveedor de email para recordatorios en produccion.
- Libreria de parseo CSV/Excel seleccionada durante la implementacion.
- Utilidades de formato de fecha/moneda para espanol argentino y valores ARS.
- Libreria de graficos responsive seleccionada durante la implementacion.
- Asset de icono/logo para la marca de vaca de Campo Control.
- Revision de dominio contable/laboral antes de cualquier trabajo futuro de calculo legal de liquidacion.

## Riesgos

- Riesgo laboral/legal: las reglas de liquidacion de sueldos en Argentina estan fuera de alcance para v1; la UI y la documentacion no deben insinuar cumplimiento legal.
- Riesgo de importacion: las planillas existentes pueden tener nombres de columnas inconsistentes, duplicados, identificadores faltantes o monedas mezcladas.
- Riesgo de recordatorios: el envio de email depende de configuracion del proveedor, entregabilidad y datos correctos de destinatarios.
- Riesgo de flujo de caja: cheques diferidos por venta de hacienda y otras cobranzas demoradas pueden hacer que ingresos registrados parezcan efectivo disponible si no se separan claramente cobranzas esperadas y efectivo cobrado.
- Riesgo de sorpresa por gastos: compras diferidas, facturas de servicios, pagos con tarjeta, cheques y debitos automaticos pueden generar debitos futuros faciles de olvidar si no se separan claramente gastos comprometidos y efectivo pagado.
- Riesgo de control de acceso: los datos financieros y de pagos requieren pruebas estrictas de roles y Row Level Security.
- Riesgo de localizacion: los docs en ingles para desarrollo y los docs en espanol para operadores pueden desalinearse si no se mantienen juntos.
- Riesgo de traduccion: el espanol sigue siendo el idioma predeterminado del producto, pero la copia en ingles del selector puede desalinearse o quedar incompleta si los textos de UI no se centralizan.
- Riesgo de alcance: los usuarios de campo pueden necesitar carga rapida en telefono, pero v1 prioriza intencionalmente flujos de oficina en escritorio y difiere UX movil especializada.
- Riesgo de modelo de datos: `cash_flow_items` y `crop_events` pueden volverse tablas comodin demasiado vagas si las plantillas v1 no acotan tipos permitidos, fechas requeridas, estados y referencias de origen.
- Riesgo de analitica: los graficos solo seran utiles si las importaciones y formularios capturan fechas, vinculos a lote/ciclo, unidades y categorias de forma consistente.
- Riesgo de seguridad: adjuntos, exportaciones de pagos/liquidacion y registros financieros requieren controles cuidadosos de almacenamiento y permisos.
- Riesgo de testing: los jobs programados y las politicas de Supabase pueden ser mas dificiles de probar que flujos normales de UI.

## Hitos

- M1: Docs de Fase 1
  - Crear artefactos de especificacion y plan en ingles y espanol.
  - Confirmar alcance MVP, nombre de app, tema, roles, recordatorios, importaciones y limites de pagos/liquidacion.
- M2: Planificacion de tareas y tests de Fase 2
  - Crear `tasks.md`, `test-plan.md` y sus versiones en espanol.
  - Dividir el MVP en tareas verticales aptas para TDD.
- M3: Base de la app
  - Scaffold Vite + React + TypeScript.
  - Configurar tema oscuro, base de textos en espanol, routing/estructura desktop-first de app y ubicacion del logo de vaca de Campo Control.
  - Configurar cliente Supabase y flujo de autenticacion.
- M4: Esquema principal y control de acceso
  - Agregar esquema Supabase, roles, datos seed y Row Level Security.
  - Agregar tests de limites de acceso.
- M5: Tablero y recordatorios de pago
  - Construir items programados de flujo de caja para obligaciones de pago, gastos diferidos, cuentas a cobrar por ventas de hacienda, estados por vencer/vencido en tablero, separacion de flujo de caja y job de recordatorio por email.
- M6: Seguimiento de hacienda
  - Construir perfiles de hacienda, historial de peso, graficos de peso en el tiempo y registros sanitarios.
- M7: Modulos operativos
  - Construir finanzas, empleados/seguimiento de pagos, contratos/servicios, registros agricolas y graficos de analitica de cultivos.
- M8: Importaciones y reportes
  - Construir importaciones CSV/Excel con vista previa de validacion.
  - Construir exportaciones de pagos/liquidacion y operaciones.
- M9: Verificacion final
  - Ejecutar tests/build completos.
  - Revisar criterios de aceptacion.
  - Actualizar verificacion final en artefactos en ingles y espanol.

## Estrategia De Verificacion

- Tratar los criterios de aceptacion de `spec.md` como fuente de verdad para verificar el release.
- Mantener `spec.es.md`, `plan.es.md`, `tasks.es.md` y `test-plan.es.md` estructuralmente alineados con los artefactos en ingles.
- Usar TDD desde la Fase 3:
  - Escribir primero tests que fallen.
  - Confirmar la falla esperada.
  - Implementar el comportamiento minimo.
  - Confirmar que los tests pasan.
  - Refactorizar solo despues de tener tests en verde.
- Validar flujos importantes con tests automatizados:
  - Login/estructura de app y tema oscuro.
  - Texto de UI en espanol por defecto y comportamiento del selector de ingles para pantallas soportadas de estructura/tablero/login.
  - Denegacion de acceso por rol.
  - Vista previa de importacion, errores de validacion y guardado.
  - Estado de recordatorios en tablero y seleccion del job de email.
  - Estado de gastos diferidos en el tablero para casos contado, 30 dias, 60 dias, personalizado, pagado, a pagar y vencido.
  - Estado de cuentas a cobrar por ventas de hacienda en el tablero para casos contado, 30 dias, 60 dias, personalizado, cobrado y vencido.
  - Lineas de tiempo de peso/sanidad en perfil de hacienda y graficos de peso legibles en escritorio/tablet.
  - Graficos de analitica de cultivos para costos, actividad y metricas de produccion/rinde.
  - Exportacion de pagos/liquidacion.
- Ejecutar build/typecheck/tests completos antes de aprobar Fase 4.
