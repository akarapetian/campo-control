# Plan

## Stack Tecnologico

- Frontend: Vite, React, TypeScript.
- UI: tema oscuro, layouts responsive, textos operativos en espanol, contraste accesible y pantallas compactas con alta densidad de datos.
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
- Jobs programados identifican obligaciones de pago proximas y vencidas, y envian recordatorios por email.
- Las vistas de analitica consultan directamente tablas operativas normalizadas para los graficos v1:
  - Los graficos de peso de hacienda usan `weight_records` filtrado por `cattle_id` y ordenado por `date`.
  - Los graficos de cultivos usan `crop_cycles`, `crop_events`, `services`, `financial_transactions` y `crop_outputs` filtrados por lote, ciclo, metrica y rango de fechas.
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

## Modelo De Datos

Entidades iniciales del dominio:

- `profiles`: perfil de usuario, nombre visible, rol, email de notificaciones, estado activo.
- `cattle`: caravana/identificador, nombre o etiqueta, estado, sexo, raza, fecha de nacimiento, fecha de adquisicion, origen, notas.
- `weight_records`: referencia a hacienda, fecha, peso, unidad, notas, usuario que registro.
- `health_records`: referencia a hacienda, fecha, tipo, sintomas, tratamiento, medicacion, veterinario, fecha de seguimiento, notas.
- `crop_fields`: nombre de campo/lote, notas de ubicacion, superficie, estado activo.
- `crop_cycles`: referencia a lote, cultivo, campana/temporada, fecha de inicio, fecha de fin, estado, notas.
- `crop_events`: referencia a ciclo de cultivo, referencia a lote, fecha, tipo de evento, cantidad, unidad, notas, usuario que registro.
- `crop_outputs`: referencia a ciclo de cultivo, referencia a lote, fecha de cosecha/salida, cantidad, unidad, notas de calidad, notas de destino.
- `counterparties`: proveedores, clientes, contratistas, prestadores de servicios, datos de contacto.
- `contracts`: referencia a contraparte, tipo, fechas de inicio/fin, resumen, estado, referencias a adjuntos.
- `services`: registros de servicios agricolas/ganaderos/del negocio, referencias opcionales a lote/ciclo/animal, referencia a contraparte, fecha, descripcion, costo, contrato vinculado, notas.
- `financial_transactions`: tipo ingreso/egreso, categoria, contraparte, referencias opcionales a lote/ciclo/servicio, monto ARS, monto USD opcional, fecha, descripcion, referencias a adjuntos.
- `payment_obligations`: contraparte, contrato/servicio/transaccion origen, monto, moneda, fecha de vencimiento, estado, usuario asignado, fecha de pago.
- `employees`: identidad/contacto, rol/puesto, fecha de inicio, estado activo, notas.
- `work_entries`: referencia a empleado, fecha, descripcion del trabajo, horas/dias/cantidad, notas.
- `employee_payments`: referencia a empleado, fecha, monto, tipo, periodo inicio/fin, notas.
- `import_batches`: metadatos del archivo subido, tipo de registro, estado, creado por, cantidad de filas, cantidad de errores.
- `import_errors`: referencia al lote, numero de fila, campo, mensaje.
- `reminders`: referencia a obligacion de pago, fecha de recordatorio, canal, estado, destinatario.

El esquema debe empezar lo suficientemente normalizado para soportar importaciones, filtros, recordatorios, reportes y acceso por rol sin sobredisenar reglas legales de contabilidad o liquidacion.

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
- Riesgo de control de acceso: los datos financieros y de pagos requieren pruebas estrictas de roles y Row Level Security.
- Riesgo de localizacion: los docs en ingles para desarrollo y los docs en espanol para operadores pueden desalinearse si no se mantienen juntos.
- Riesgo de uso movil: los usuarios de campo necesitan carga rapida en telefono aunque la sincronizacion offline se difiera.
- Riesgo de modelo de datos: los registros de hacienda, cultivos, servicios y finanzas pueden volverse demasiado genericos si las plantillas v1 no se acotan intencionalmente.
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
  - Configurar tema oscuro, base de textos en espanol, routing, estructura de app y ubicacion del logo de vaca de Campo Control.
  - Configurar cliente Supabase y flujo de autenticacion.
- M4: Esquema principal y control de acceso
  - Agregar esquema Supabase, roles, datos seed y Row Level Security.
  - Agregar tests de limites de acceso.
- M5: Tablero y recordatorios de pago
  - Construir obligaciones de pago, estados por vencer/vencido en tablero y job de recordatorio por email.
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
  - Textos de UI en espanol para pantallas operativas.
  - Denegacion de acceso por rol.
  - Vista previa de importacion, errores de validacion y guardado.
  - Estado de recordatorios en tablero y seleccion del job de email.
  - Lineas de tiempo de peso/sanidad en perfil de hacienda y graficos responsive de peso.
  - Graficos de analitica de cultivos para costos, actividad y metricas de produccion/rinde.
  - Exportacion de pagos/liquidacion.
- Ejecutar build/typecheck/tests completos antes de aprobar Fase 4.
