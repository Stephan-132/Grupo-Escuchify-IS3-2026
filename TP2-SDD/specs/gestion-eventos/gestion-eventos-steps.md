# Steps de Implementación - Módulo Gestión de Eventos

**Módulo:** Gestión de Eventos  
**Total estimado:** 11 días hábiles  
**Versión:** 1.0.0  
**Última actualización:** Mayo 2026

---

## 1. Diseño y documentación de entidades y endpoints (3 días)

| # | Step | Descripción | Archivos afectados | Criterio de completitud |
|---|------|-------------|-------------------|------------------------|
| 1.1 | Diseñar entidad TipoEvento | Definir atributos, tipos de dato, restricciones y PK/FK para la tabla TipoEvento (id_tipo_evento, nombre UNIQUE, descripcion) | backend/models/TipoEvento.js, base_datos/migraciones/ | Tabla TipoEvento documentada con todos los campos y restricciones |
| 1.2 | Diseñar entidad Evento | Definir atributos, tipos de dato, restricciones y PK/FK para la tabla Evento con campos de cupos, fechas y estado | backend/models/Evento.js, base_datos/migraciones/ | Tabla Evento documentada con todos los campos requeridos |
| 1.3 | Definir relaciones entre entidades | Documentar relaciones 1:N entre TipoEvento→Evento y relaciones con Inscripción, Encuesta, Certificado, Informe, AgendaEvento | backend/models/, docs/relaciones.md | Diagrama de relaciones completo y validado |
| 1.4 | Definir índices de base de datos | Crear índices para consultas frecuentes: idx_evento_fecha_inicio, idx_evento_estado, idx_evento_tipo | base_datos/migraciones/indices.sql | Índices creados y documentados en migraciones |
| 1.5 | Documentar endpoint POST /tipos-evento | Definir request JSON, response JSON, códigos HTTP (201, 400, 409) y validaciones de campos | Contract.md, backend/routes/tipos-evento.js | Endpoint documentado con ejemplos JSON completos |
| 1.6 | Documentar endpoint GET /tipos-evento | Definir response JSON con lista de tipos, códigos HTTP (200) y formato de respuesta | Contract.md, backend/routes/tipos-evento.js | Endpoint documentado con ejemplos JSON completos |
| 1.7 | Documentar endpoint POST /eventos | Definir request con todos los campos (id_tipo_evento, titulo, fechas, cupos), response, códigos HTTP (201, 400, 401, 403) | Contract.md, backend/routes/eventos.js | Endpoint documentado con ejemplos JSON completos |
| 1.8 | Documentar endpoint GET /eventos/{id} | Definir response con datos completos del evento incluyendo inscritos y cupo_disponible, códigos HTTP (200, 404) | Contract.md, backend/routes/eventos.js | Endpoint documentado con ejemplos JSON completos |
| 1.9 | Documentar endpoint PUT /eventos/{id} | Definir request parcial, response, códigos HTTP (200, 400, 403, 404, 409) y validaciones de edición | Contract.md, backend/routes/eventos.js | Endpoint documentado con ejemplos JSON completos |
| 1.10 | Documentar endpoint DELETE /eventos/{id} | Definir response, códigos HTTP (204, 400, 403, 404), efectos secundarios (cambio estado, notificación) | Contract.md, backend/routes/eventos.js | Endpoint documentado con ejemplos JSON completos |
| 1.11 | Documentar endpoint GET /eventos | Definir query parameters (estado, tipo, fecha_desde, fecha_hasta, page, limit), paginación y response | Contract.md, backend/routes/eventos.js | Endpoint documentado con ejemplos JSON completos |

---

## 2. Desarrollo de CRUD de tipos de evento (1 día)

| # | Step | Descripción | Archivos afectados | Criterio de completitud |
|---|------|-------------|-------------------|------------------------|
| 2.1 | Crear modelo TipoEvento | Implementar clase/modelo de base de datos con validaciones de nombre UNIQUE y descripcion opcional | backend/models/TipoEvento.js | Modelo funcional con validación de nombre único |
| 2.2 | Implementar POST /tipos-evento | Crear endpoint para crear tipo de evento con validación de campos requeridos y nombre único | backend/controllers/TipoEventoController.js, backend/routes/tipos-evento.js | Endpoint crea tipo y retorna 201 con id_tipo_evento |
| 2.3 | Implementar GET /tipos-evento | Crear endpoint para listar todos los tipos de evento ordenados por nombre | backend/controllers/TipoEventoController.js, backend/routes/tipos-evento.js | Endpoint retorna lista de tipos con status 200 |
| 2.4 | Agregar validación de nombre duplicado | Validar que no existan tipos con el mismo nombre antes de crear | backend/middleware/validarTipoEvento.js | Retorna 409 con mensaje "NOMBRE_DUPLICADO" |
| 2.5 | Agregar validación de campos requeridos | Validar que el campo nombre esté presente y no esté vacío | backend/middleware/validarTipoEvento.js | Retorna 400 con mensaje "CAMPO_REQUERIDO" |

---

## 3. Desarrollo de CRUD de eventos (3 días)

| # | Step | Descripción | Archivos afectados | Criterio de completitud |
|---|------|-------------|-------------------|------------------------|
| 3.1 | Crear modelo Evento | Implementar clase/modelo de base de datos con validaciones de fechas, cupos y estado por defecto ACTIVO | backend/models/Evento.js | Modelo funcional con todas las validaciones de campo |
| 3.2 | Implementar POST /eventos | Crear endpoint para crear evento con validación de tipo existente, fechas y cupos | backend/controllers/EventoController.js, backend/routes/eventos.js | Endpoint crea evento con estado ACTIVO y retorna 201 |
| 3.3 | Implementar GET /eventos/{id} | Crear endpoint para obtener evento específico con cálculo de inscritos y cupo_disponible | backend/controllers/EventoController.js, backend/routes/eventos.js | Retorna evento completo con 200 o 404 si no existe |
| 3.4 | Implementar PUT /eventos/{id} | Crear endpoint para editar evento existente con validación de permisos y restricciones | backend/controllers/EventoController.js, backend/routes/eventos.js | Actualiza campos permitidos y retorna 200 |
| 3.5 | Implementar DELETE /eventos/{id} | Crear endpoint para cancelar evento con validación de permisos y notificación a inscritos | backend/controllers/EventoController.js, backend/routes/eventos.js | Cambia estado a CANCELADO y retorna 204 |
| 3.6 | Implementar GET /eventos | Crear endpoint para listar eventos con filtros (estado, tipo, fechas) y paginación | backend/controllers/EventoController.js, backend/routes/eventos.js | Retorna lista paginada con filtros aplicados y 200 |
| 3.7 | Implementar validación de tipo existente | Verificar que id_tipo_evento exista en la base de datos antes de crear evento | backend/services/TipoEventoService.js | Retorna 400 "TIPO_EVENTO_NO_ENCONTRADO" si no existe |
| 3.8 | Implementar cálculo de cupo disponible | Calcular cupo_disponible = cupo_maximo - inscritos_confirmados al obtener evento | backend/services/EventoService.js | Campo cupo_disponible correcto en respuesta |
| 3.9 | Implementar notificación al cancelar | Enviar notificación por email a todos los inscritos cuando evento se cancela | backend/services/NotificacionService.js, backend/controllers/EventoController.js | Insritos reciben notificación de cancelación |

---

## 4. Validación de reglas de negocio (1 día)

| # | Step | Descripción | Archivos afectados | Criterio de completitud |
|---|------|-------------|-------------------|------------------------|
| 4.1 | Validar RN1: fecha_inicio > fecha_creación | Implementar validación de fecha de inicio posterior a fecha actual en creación | backend/validators/EventoValidator.js | Retorna 400 "FECHA_INICIO_INVALIDA" si fecha en pasado |
| 4.2 | Validar RN2: fecha_limite < fecha_inicio | Implementar validación de fecha límite de inscripción anterior a fecha de inicio | backend/validators/EventoValidator.js | Retorna 400 "FECHA_LIMITE_INVALIDA" si fecha inválida |
| 4.3 | Validar RN3: cupo_maximo >= cupo_minimo | Implementar validación de cupo máximo mayor o igual a cupo mínimo | backend/validators/EventoValidator.js | Retorna 400 "CUPO_INVALIDO" si cupos inválidos |
| 4.4 | Validar RN4: solo organizador edita/cancela | Implementar middleware de autorización que verifica que usuario sea organizador del evento | backend/middleware/verificarOrganizador.js | Retorna 403 "NO_AUTORIZADO" si no es organizador |
| 4.5 | Validar RN6: no editar fechas con inscripciones | Implementar restricción que impide editar fecha_inicio/fecha_fin si existen inscripciones confirmadas | backend/validators/EventoValidator.js, backend/services/InscripcionService.js | Retorna 409 "EVENTO_CON_INSCRIPCIONES" si hay inscritos |
| 4.6 | Validar RN7: notificar al cancelar | Implementar lógica de notificación automática a todos los participantes inscritos al cancelar | backend/services/NotificacionService.js | Insritos reciben email de notificación |
| 4.7 | Validar RN8: cancelados no en catálogo | Implementar filtro en consulta GET /eventos que excluye eventos con estado CANCELADO | backend/services/EventoService.js | Eventos cancelados excluidos de listados públicos |

---

## 5. Pruebas unitarias y de integración (3 días)

| # | Step | Descripción | Archivos afectados | Criterio de completitud |
|---|------|-------------|-------------------|------------------------|
| 5.1 | Prueba: Crear tipo de evento válido | Verificar creación exitosa con nombre y descripción válidos | backend/tests/TipoEvento.test.js | Test pasa con status 201 y respuesta correcta |
| 5.2 | Prueba: Tipo duplicado | Verificar error 409 al crear tipo con nombre existente | backend/tests/TipoEvento.test.js | Test pasa con status 409 y mensaje "NOMBRE_DUPLICADO" |
| 5.3 | Prueba: Crear evento con todos los campos | Verificar creación exitosa con datos completos | backend/tests/Evento.test.js | Test pasa con status 201 y estado ACTIVO |
| 5.4 | Prueba: Crear evento sin cupos | Verificar creación exitosa sin cupo_minimo/cupo_maximo | backend/tests/Evento.test.js | Test pasa con status 201 y campos NULL |
| 5.5 | Prueba: Fecha límite inválida | Verificar error 400 al crear evento con fecha_limite >= fecha_inicio | backend/tests/Evento.test.js | Test pasa con status 400 y mensaje "FECHA_LIMITE_INVALIDA" |
| 5.6 | Prueba: Cupos inválidos | Verificar error 400 al crear evento con cupo_maximo < cupo_minimo | backend/tests/Evento.test.js | Test pasa con status 400 y mensaje "CUPO_INVALIDO" |
| 5.7 | Prueba: Tipo inexistente | Verificar error 400 al crear evento con id_tipo_evento inexistente | backend/tests/Evento.test.js | Test pasa con status 400 y mensaje "TIPO_EVENTO_NO_ENCONTRADO" |
| 5.8 | Prueba: Editar sin inscripciones | Verificar edición exitosa de evento sin inscripciones confirmadas | backend/tests/Evento.test.js | Test pasa con status 200 y campos actualizados |
| 5.9 | Prueba: Editar fechas con inscripciones | Verificar error 409 al editar fechas de evento con inscripciones | backend/tests/Evento.test.js | Test pasa con status 409 y mensaje "EVENTO_CON_INSCRIPCIONES" |
| 5.10 | Prueba: Cancelar evento | Verificar que evento cambia a estado CANCELADO y se notifica a inscritos | backend/tests/Evento.test.js | Test pasa con status 204 y estado CANCELADO |
| 5.11 | Prueba: Permisos de edición | Verificar error 403 al intentar editar evento como no-organizador | backend/tests/Evento.test.js | Test pasa con status 403 y mensaje "NO_AUTORIZADO" |
| 5.12 | Prueba: Listar con filtro estado | Verificar que GET /eventos?estado=ACTIVO retorna solo eventos activos | backend/tests/Evento.test.js | Test retorna solo eventos con estado ACTIVO |
| 5.13 | Prueba: Listar con filtro tipo | Verificar que GET /eventos?tipo=1 retorna solo eventos del tipo especificado | backend/tests/Evento.test.js | Test retorna solo eventos con id_tipo_evento=1 |
| 5.14 | Prueba: Paginación | Verificar que GET /eventos?page=1&limit=2 retorna 2 elementos y total correcto | backend/tests/Evento.test.js | Test respeta parámetros page y limit |
| 5.15 | Prueba: Cupo disponible correcto | Verificar cálculo cupo_disponible = cupo_maximo - inscritos | backend/tests/Evento.test.js | Cálculo correcto en respuesta GET |
| 5.16 | Prueba: Evento no encontrado | Verificar error 404 al obtener evento con ID inexistente | backend/tests/Evento.test.js | Test pasa con status 404 y mensaje "EVENTO_NO_ENCONTRADO" |
| 5.17 | Prueba: Crear sin autenticación | Verificar error 401 al intentar crear evento sin token | backend/tests/Evento.test.js | Test pasa con status 401 y mensaje "NO_AUTENTICADO" |
| 5.18 | Prueba de integración completa | Verificar flujo completo: crear→editar→cancelar con validaciones | backend/tests/Evento.integracion.test.js | Flujo completo exitoso con validaciones |

---

## Resumen de Tareas

| Sección | Total de Steps | Días Estimados | Dependencias |
|---------|---------------|----------------|--------------|
| 1. Diseño y documentación de entidades y endpoints | 11 | 3 | Ninguna |
| 2. Desarrollo de CRUD de tipos de evento | 5 | 1 | Sección 1 |
| 3. Desarrollo de CRUD de eventos | 9 | 3 | Sección 1, Sección 2 |
| 4. Validación de reglas de negocio | 7 | 1 | Sección 3 |
| 5. Pruebas unitarias y de integración | 18 | 3 | Sección 4 |
| **Total** | **50** | **11 días hábiles** | — |

---

## Hitos del Proyecto

| Hito | Descripción | Criterio de Verificación |
|------|-------------|-------------------------|
| H1 - Diseño aprobado | Finalizada la Sección 1 | Todas las entidades documentadas, endpoints definidos en Contract.md |
| H2 - Tipos de evento funcionales | Finalizada la Sección 2 | POST y GET /tipos-evento operativos con validaciones |
| H3 - CRUD completo de eventos | Finalizada la Sección 3 | POST, GET, PUT, DELETE /eventos operativos |
| H4 - Validaciones implementadas | Finalizada la Sección 4 | RN1-RN8 validadas y funcionando correctamente |
| H5 - Módulo listo para integración | Finalizada la Sección 5 | 100% de pruebas unitarias y de integración aprobadas |

---

## Matriz de Archivos

| Archivo | Secciones | Steps |
|---------|----------|-------|
| backend/models/TipoEvento.js | 1, 2 | 1.1, 2.1 |
| backend/models/Evento.js | 1, 3 | 1.2, 1.3, 3.1 |
| backend/controllers/TipoEventoController.js | 2 | 2.2, 2.3 |
| backend/controllers/EventoController.js | 3 | 3.2, 3.3, 3.4, 3.5, 3.6 |
| backend/routes/tipos-evento.js | 1, 2 | 1.5, 1.6, 2.2, 2.3 |
| backend/routes/eventos.js | 1, 3 | 1.7-1.11, 3.2-3.6 |
| backend/middleware/verificarOrganizador.js | 4 | 4.4 |
| backend/middleware/validarTipoEvento.js | 2 | 2.4, 2.5 |
| backend/validators/EventoValidator.js | 4 | 4.1, 4.2, 4.3, 4.5 |
| backend/services/EventoService.js | 3, 4 | 3.8, 4.7 |
| backend/services/TipoEventoService.js | 3 | 3.7 |
| backend/services/NotificacionService.js | 3, 4 | 3.9, 4.6 |
| backend/services/InscripcionService.js | 4 | 4.5 |
| base_datos/migraciones/ | 1 | 1.1, 1.2, 1.4 |
| backend/tests/TipoEvento.test.js | 5 | 5.1, 5.2 |
| backend/tests/Evento.test.js | 5 | 5.3-5.17 |
| backend/tests/Evento.integracion.test.js | 5 | 5.18 |
| Contract.md | 1 | 1.5-1.11 |
