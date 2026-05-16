# Especificacion

## Problema

Las operaciones agropecuarias que gestionan hacienda, cultivos, empleados, servicios, contratos y pagos suelen depender de planillas separadas, registros en papel y memoria. Esto dificulta ver vencimientos, importar datos historicos de forma prolija, seguir el peso y la sanidad de cada animal a lo largo del tiempo, y preparar reportes de pagos/liquidacion para la oficina y el contador.

Campo Control sera una aplicacion web oscura, en espanol argentino, para que operadores agropecuarios centralicen registros operativos, importaciones, recordatorios y seguimiento diario.

## Objetivos

- Proveer una aplicacion web responsive y online para uso de oficina y uso movil en el campo.
- Soportar pantallas operativas solo en espanol argentino.
- Usar ARS como moneda principal, con campos opcionales de referencia en USD cuando los registros del negocio lo requieran.
- Importar registros principales desde plantillas CSV/Excel con validacion antes de guardar datos.
- Registrar finanzas, empleados, pagos relacionados con liquidacion, contratos, servicios, operaciones agricolas, perfiles de hacienda, pesos y eventos sanitarios.
- Mostrar graficos responsive de tendencias operativas como peso de animales a lo largo del tiempo, costos de cultivos, actividad agricola y metricas de produccion/rinde cuando haya datos disponibles.
- Mostrar recordatorios de pagos por vencer y vencidos dentro de la app, y enviar recordatorios por email a usuarios asignados.
- Incluir una interfaz operativa oscura y un logo divertido de vaca en la pantalla de inicio de sesion y en la navegacion.
- Producir artefactos de planificacion bilingues durante todo el proyecto, con ingles como fuente para desarrollo y espanol como equivalente para stakeholders.

## No Objetivos

- No calcular aportes, deducciones legales ni cumplimiento de liquidacion de sueldos en Argentina en v1.
- No proveer presentaciones impositivas, certificacion contable ni garantias de cumplimiento legal.
- No soportar carga offline-first de datos de campo en v1.
- No construir integraciones bancarias, con proveedores, organismos publicos ni WhatsApp en v1.
- No soportar pantallas operativas en ingles en v1.
- No reemplazar sistemas veterinarios, contables o agronomicos especializados cuando sean legal o profesionalmente necesarios.

## Usuarios Y Casos De Uso

- Duenio/admin:
  - Ver un tablero general de pagos, estado de hacienda, importaciones recientes y alertas operativas.
  - Administrar usuarios, roles, importaciones, configuracion y reportes.
  - Revisar finanzas, contratos, servicios, registros agricolas, empleados y registros de hacienda.
- Usuario de oficina:
  - Importar planillas de finanzas, empleados, contratos, servicios, hacienda, pesos y sanidad.
  - Registrar pagos, vencimientos, pagos a empleados, adelantos y reportes exportables para liquidacion/pagos.
  - Marcar obligaciones como pagadas y mantener registros de contrapartes.
- Usuario de campo:
  - Buscar animales por caravana/identificador.
  - Cargar pesos y eventos sanitarios desde un telefono mientras esta online.
  - Registrar actividad agricola o de servicios vinculada a lotes y ciclos de cultivo.
- Solo lectura/contador:
  - Ver reportes y exportar datos financieros y de pagos sin editar registros operativos.

## Diseno

Campo Control sera una aplicacion web con Vite + React respaldada por Supabase Auth, Postgres, Storage y jobs programados. La interfaz sera oscura, densa y operativa, no orientada a marketing. Debe priorizar tablas buscables, etiquetas de estado claras, carga movil rapida y alertas en el tablero.

Modulos principales:

- Tablero:
  - Obligaciones de pago proximas.
  - Obligaciones de pago vencidas.
  - Importaciones recientes.
  - Alertas sanitarias de hacienda.
  - Accesos rapidos para flujos de carga frecuentes.
- Hacienda:
  - Perfil del animal con caravana/identificador, estado, origen, datos de nacimiento/adquisicion, notas y contexto de propiedad.
  - Historial de peso a lo largo del tiempo.
  - Historial sanitario con tratamientos, sintomas, fechas y notas.
- Cultivos:
  - Campos/lotes.
  - Ciclos de cultivo.
  - Servicios, costos, contratos, actividad de campo, metricas de produccion/rinde y notas vinculados a cultivos.
- Analitica:
  - Graficos de peso de animales a lo largo del tiempo desde registros de peso.
  - Graficos de costos de cultivos por lote, ciclo, categoria y rango de fechas.
  - Graficos de actividad agricola desde eventos de campo y registros de servicios.
  - Graficos de produccion/rinde cuando se registren metricas de cosecha o salida.
  - Layouts de graficos responsive que sigan siendo legibles en escritorio y movil.
- Finanzas:
  - Ingresos, egresos, categorias, contrapartes, obligaciones de pago, estado de pago, vencimientos y adjuntos.
  - Visualizacion primero en ARS, con campos opcionales de referencia en USD.
- Empleados y seguimiento de pagos/liquidacion:
  - Registros de empleados, partes de trabajo, adelantos, pagos y reportes exportables de pagos/liquidacion.
  - Sin calculos legales de liquidacion en v1.
- Contratos y servicios:
  - Contrapartes, registros de servicios, terminos de contratos, cronogramas de pago, vencimientos y adjuntos.
- Importaciones:
  - Plantillas CSV/Excel para cada tipo principal de registro.
  - Vista previa de validacion antes de guardar.
  - Mensajes de error en espanol para filas invalidas.
  - Historial de lotes de importacion.
- Recordatorios:
  - Recordatorios en el tablero para obligaciones de pago por vencer y vencidas.
  - Recordatorios por email antes y en la fecha de vencimiento.
- Marca:
  - Nombre de la app: Campo Control.
  - Logo divertido de vaca visible en el login y en la estructura autenticada de la app.

Roles:

- Duenio/admin: acceso completo.
- Usuario de oficina: finanzas, empleados, contratos, servicios, importaciones y reportes.
- Usuario de campo: hacienda, sanidad, pesos y cargas de cultivos/servicios.
- Solo lectura/contador: solo reportes y exportaciones.

## Criterios De Aceptacion

- Dado que un usuario abre la app, cuando aparece la pantalla de inicio de sesion, entonces usa el tema oscuro y muestra el logo de vaca de Campo Control.
- Dado que un usuario autenticado esta dentro de la app, cuando la navegacion esta visible, entonces el logo de vaca aparece en la estructura de la app.
- Dado que un operador usa la app, cuando ve etiquetas, formularios, mensajes de validacion y navegacion, entonces el texto operativo esta en espanol argentino.
- Dado que se muestran valores monetarios, cuando no se especifica otra moneda, entonces ARS es la moneda predeterminada.
- Dado que se sube una plantilla de importacion, cuando los campos requeridos son validos, entonces la app muestra una vista previa de los registros antes de guardarlos.
- Dado que una importacion contiene filas invalidas, cuando se ejecuta la validacion, entonces la app muestra errores por fila en espanol y no guarda registros invalidos.
- Dado que un animal tiene registros de peso, cuando un usuario abre el perfil del animal, entonces el perfil muestra el historial de peso en orden cronologico.
- Dado que un animal tiene multiples registros de peso, cuando un usuario ve el perfil del animal en escritorio o movil, entonces la app muestra un grafico responsive de peso en el tiempo obtenido desde los registros de peso de la base de datos.
- Dado que un animal tiene registros sanitarios, cuando un usuario abre el perfil del animal, entonces el perfil muestra eventos sanitarios vinculados a ese animal.
- Dado que existen datos de costos, servicios, actividad de campo o produccion de un ciclo de cultivo, cuando un usuario abre analitica de cultivos, entonces la app muestra graficos responsive filtrados por lote, ciclo de cultivo, rango de fechas y tipo de metrica.
- Dado que los datos de un grafico faltan o son escasos, cuando un usuario abre un area de graficos, entonces la app muestra un mensaje de estado vacio en espanol en lugar de un grafico roto o enganoso.
- Dado que una obligacion de pago tiene una fecha de vencimiento futura, cuando esta dentro de la ventana configurada de recordatorio, entonces aparece como proxima en el tablero.
- Dado que una obligacion de pago esta vencida e impaga, cuando un usuario abre el tablero, entonces aparece como vencida hasta que se marque como pagada.
- Dado que los recordatorios por email estan habilitados, cuando corre el job de recordatorios, entonces los usuarios asignados reciben recordatorios de obligaciones por vencer y vencidas.
- Dado que un usuario de campo inicio sesion, cuando intenta acceder a configuracion de finanzas o pagos/liquidacion, entonces se deniega el acceso.
- Dado que un usuario solo lectura/contador inicio sesion, cuando intenta crear, editar, importar o marcar un pago como pagado, entonces se deniega el acceso.
- Dado que un usuario de oficina exporta datos de pagos/liquidacion, cuando selecciona un rango de fechas, entonces la exportacion incluye empleados, pagos, adelantos y totales del periodo.
- Dado que las funciones de seguimiento de pagos/liquidacion son visibles, cuando aparece texto explicativo o de reporte, entonces no afirma calcular aportes, deducciones ni cumplimiento legal de liquidacion de sueldos en Argentina.
- Dado que se crean artefactos de planificacion, cuando se completan la Fase 1 y las fases posteriores, entonces cada artefacto en ingles tiene un artefacto `.es.md` en espanol con la misma estructura y decisiones.

## Preguntas Abiertas

- Que proveedor de email se usara para enviar recordatorios en produccion?
- Que ventana predeterminada de recordatorio se usara: 7 dias antes del vencimiento, 3 dias antes, el mismo dia, o una combinacion?
- Que campos tienen las planillas actuales del negocio para finanzas, empleados, hacienda, contratos, servicios, cultivos, pesos y sanidad?
- Los adjuntos deben ser obligatorios para contratos y comprobantes de pago en v1, o solo opcionales?
- Que reportes son mas importantes para la primera version: resumen financiero, exportacion de pagos/liquidacion, sanidad de hacienda, pesos de hacienda, obligaciones contractuales o costos de cultivos?
