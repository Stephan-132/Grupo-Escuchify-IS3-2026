# Steps de Implementación - Módulo Informes y Agendas

**Módulo:** Informes y Agendas  
**Total estimado:** 9 días hábiles  
**Versión:** 1.0.0  
**Última actualización:** Mayo 2026

---

## 1. Diseño y documentación de entidades y endpoints (2 días)

| # | Step | Descripción | Archivos afectados | Criterio de completitud |
|---|------|-------------|-------------------|------------------------|
| 1.1 | Diseñar entidad Informe | Definir atributos, tipos de dato, restricciones y PK/FK para la tabla Informe (id_informe, id_evento FK, tipo_informe, fecha_generacion, contenido) | backend/models/Informe.js, base_datos/migraciones/ | Tabla Informe documentada con todos los campos y restricciones |
| 1.2 | Diseñar entidad AgendaEvento | Definir atributos, tipos de dato, restricciones y PK/FK para la tabla AgendaEvento (id_agenda, id_evento FK, hora_inicio, hora_fin, titulo_actividad, id_disertante FK) | backend/models/AgendaEvento.js, base_datos/migraciones/ | Tabla AgendaEvento documentada con todos los campos |
| 1.3 | Definir relaciones entre entidades | Documentar relaciones N:1 entre Informe→Evento y AgendaEvento→Evento, y AgendaEvento→Usuario | backend/models/, docs/relaciones.md | Diagrama de relaciones completo y validado |
| 1.4 | Definir índices de base de datos | Crear índices: idx_informe_evento, idx_informe_fecha, idx_agenda_evento, idx_agenda_hora | base_datos/migraciones/indices.sql | Índices creados y documentados en migraciones |
| 1.5 | Documentar endpoint POST /informes | Definir request JSON (id_evento, tipo_informe), response JSON, códigos HTTP (201, 400, 403, 404, 409) | Contract.md, backend/routes/informes.js | Endpoint documentado con ejemplos JSON completos |
| 1.6 | Documentar endpoint GET /informes/{id}/exportar | Definir query parameter formato (pdf/excel), response binario, códigos HTTP (200, 400, 403, 404) | Contract.md, backend/routes/informes.js | Endpoint documentado con ejemplos completos |
| 1.7 | Documentar endpoint POST /agendas | Definir request JSON con actividades, response, códigos HTTP (201, 204, 400, 403, 404, 409) | Contract.md, backend/routes/agendas.js | Endpoint documentado con ejemplos JSON completos |
| 1.8 | Documentar endpoint GET /eventos/{id}/agenda | Definir response JSON con actividades y disertantes, códigos HTTP (200, 400, 404) | Contract.md, backend/routes/agendas.js | Endpoint documentado con ejemplos JSON completos |
| 1.9 | Definir matriz de dependencias | Documentar consumo de APIs de Gestión de Eventos, Inscripciones, Encuestas, Certificados, Usuarios | backend/docs/dependencias.md | Matriz de dependencias completa y validada |

---

## 2. Desarrollo de generación de informes (3 días)

| # | Step | Descripción | Archivos afectados | Criterio de completitud |
|---|------|-------------|-------------------|------------------------|
| 2.1 | Crear modelo Informe | Implementar clase/modelo de base de datos con validaciones de tipo_informe (INSCRIPCIONES/ENCUESTAS) | backend/models/Informe.js | Modelo funcional con validación de tipos |
| 2.2 | Implementar POST /informes básico | Crear endpoint para generar informe con validación de evento existente | backend/controllers/InformeController.js, backend/routes/informes.js | Endpoint crea informe y retorna 201 con id_informe |
| 2.3 | Implementar lógica informe INSCRIPCIONES | Obtener datos de módulo Inscripciones: total inscritos, acreditados, cancelados, lista detallada | backend/services/InformeService.js | Informe genera JSON con estructura correcta de inscripciones |
| 2.4 | Integrar con módulo Inscripciones | Consumir GET /inscripciones?id_evento={id} para obtener datos de participantes | backend/services/InscripcionService.js | Datos de inscripciones obtenidos correctamente |
| 2.5 | Implementar lógica informe ENCUESTAS | Obtener datos de módulo Encuestas: promedios, comentarios destacados, total respuestas | backend/services/InformeService.js | Informe genera JSON con estructura correcta de encuestas |
| 2.6 | Integrar con módulo Encuestas | Consumir GET /encuestas?id_evento={id} para obtener resultados de encuestas | backend/services/EncuestaService.js | Datos de encuestas obtenidos correctamente |
| 2.7 | Validar permisos de organizador | Implementar middleware que verifica que usuario sea organizador del evento | backend/middleware/verificarOrganizador.js | Retorna 403 "NO_AUTORIZADO" si no es organizador |
| 2.8 | Validar estado para informe ENCUESTAS | Verificar que evento esté FINALIZADO y encuesta cerrada antes de generar | backend/validators/InformeValidator.js | Retorna 409 "EVENTO_NO_FINALIZADO" si no cumple |
| 2.9 | Implementar exportación a PDF | Generar archivo PDF con encabezado, tabla de datos, pie de página | backend/services/ExportService.js, backend/controllers/InformeController.js | Archivo PDF válido generado y descargable |
| 2.10 | Implementar exportación a Excel | Generar archivo Excel con headers, datos formateados, columnas ajustadas | backend/services/ExportService.js, backend/controllers/InformeController.js | Archivo Excel válido generado y descargable |
| 2.11 | Implementar GET /informes/{id}/exportar | Crear endpoint que retorna archivo binario según formato solicitado | backend/controllers/InformeController.js, backend/routes/informes.js | Retorna archivo con Content-Type correcto |
| 2.12 | Implementar auditoría de informes | Registrar quién generó cada informe y cuándo | backend/models/Informe.js, backend/services/AuditoriaService.js | Registro de auditoría creado en cada generación |

---

## 3. Desarrollo de creación de agendas (2 días)

| # | Step | Descripción | Archivos afectados | Criterio de completitud |
|---|------|-------------|-------------------|------------------------|
| 3.1 | Crear modelo AgendaEvento | Implementar clase/modelo con validación de horarios (hora_fin > hora_inicio) | backend/models/AgendaEvento.js | Modelo funcional con validación de horarios |
| 3.2 | Implementar POST /agendas | Crear endpoint para crear agenda con múltiples actividades | backend/controllers/AgendaController.js, backend/routes/agendas.js | Endpoint crea agenda y retorna 201 |
| 3.3 | Implementar validación de solapamientos | Validar que no existan actividades con horarios solapados en el mismo evento | backend/validators/AgendaValidator.js | Retorna 400 "HORARIOS_SOLAPADOS" si hay conflicto |
| 3.4 | Implementar validación de disertantes | Verificar que disertantes estén inscritos en el evento antes de asignar | backend/services/AgendaService.js, backend/services/InscripcionService.js | Retorna 400 "DISERTANTE_NO_INSCRITO" si no cumple |
| 3.5 | Implementar validación de estado de evento | Verificar que evento no esté CANCELADO antes de crear agenda | backend/validators/AgendaValidator.js | Retorna 409 "EVENTO_CANCELADO" si está cancelado |
| 3.6 | Implementar GET /eventos/{id}/agenda | Crear endpoint para obtener agenda pública con datos de disertantes | backend/controllers/AgendaController.js, backend/routes/agendas.js | Retorna agenda con actividades y disertantes |
| 3.7 | Integrar con módulo Usuarios | Consumir GET /usuarios/{id_usuario} para obtener nombres de disertantes | backend/services/UsuarioService.js | Datos de disertantes obtenidos correctamente |
| 3.8 | Validar acceso público a agenda | Permitir acceso sin autenticación para eventos ACTIVO o FINALIZADO | backend/middleware/verificarEstadoEvento.js | Retorna agenda sin requerir token |
| 3.9 | Ordenar actividades por hora | Implementar ordenamiento de actividades por hora_inicio en respuesta | backend/services/AgendaService.js | Actividades retornadas en orden cronológico |
| 3.10 | Implementar actualización de agenda | Permitir actualizar agenda existente (overwrite) | backend/controllers/AgendaController.js | Retorna 204 si agenda actualizada |

---

## 4. Validación de reglas de negocio (1 día)

| # | Step | Descripción | Archivos afectados | Criterio de completitud |
|---|------|-------------|-------------------|------------------------|
| 4.1 | Validar RN1: informes solo para organizador | Implementar middleware que restringe acceso a informes solo al organizador | backend/middleware/verificarOrganizador.js | Retorna 403 si usuario no es organizador |
| 4.2 | Validar RN2: agendas públicas para ACTIVO/FINALIZADO | Implementar validación de estado de evento para acceso a agendas | backend/middleware/verificarEstadoEvento.js | Retorna agenda para ACTIVO/FINALIZADO, error 400 para CANCELADO |
| 4.3 | Validar RN3: informes de encuestas solo con encuestas cerradas | Verificar fecha_cierre de encuesta <= NOW() antes de generar informe | backend/validators/InformeValidator.js | Retorna 409 "ENCUESTA_NO_CERRADA" si encuesta abierta |
| 4.4 | Validar formato de exportación | Verificar que formato sea pdf o excel en GET /informes/{id}/exportar | backend/validators/ExportValidator.js | Retorna 400 "FORMATO_INVALIDO" si no es pdf/excel |
| 4.5 | Validar integridad de archivos generados | Verificar que PDF/Excel generados no estén corruptos o vacíos | backend/services/ExportService.js | Archivos validados antes de retornar |

---

## 5. Pruebas unitarias y de integración (1 día)

| # | Step | Descripción | Archivos afectados | Criterio de completitud |
|---|------|-------------|-------------------|------------------------|
| 5.1 | Prueba: Generar informe INSCRIPCIONES | Verificar generación exitosa con totales correctos | backend/tests/Informe.test.js | Test pasa con status 201 y datos correctos |
| 5.2 | Prueba: Generar informe ENCUESTAS | Verificar generación con promedios y comentarios | backend/tests/Informe.test.js | Test pasa con status 201 y datos correctos |
| 5.3 | Prueba: Permiso de organizador | Verificar error 403 para no-organizador generando informe | backend/tests/Informe.test.js | Test pasa con status 403 |
| 5.4 | Prueba: Evento no finalizado para encuestas | Verificar error 409 para informe ENCUESTAS en evento activo | backend/tests/Informe.test.js | Test pasa con status 409 |
| 5.5 | Prueba: Exportar a PDF | Verificar generación de archivo PDF válido | backend/tests/Export.test.js | Test pasa con Content-Type application/pdf |
| 5.6 | Prueba: Exportar a Excel | Verificar generación de archivo Excel válido | backend/tests/Export.test.js | Test pasa con Content-Type application/vnd.ms-excel |
| 5.7 | Prueba: Crear agenda sin solapamientos | Verificar creación exitosa de agenda con horarios válidos | backend/tests/Agenda.test.js | Test pasa con status 201 |
| 5.8 | Prueba: Crear agenda con solapamientos | Verificar error 400 al crear agenda con horarios solapados | backend/tests/Agenda.test.js | Test pasa con status 400 y mensaje "HORARIOS_SOLAPADOS" |
| 5.9 | Prueba: Obtener agenda pública | Verificar acceso sin autenticación a agenda de evento ACTIVO | backend/tests/Agenda.test.js | Test pasa con status 200 sin token |
| 5.10 | Prueba: Agenda de evento cancelado | Verificar error 400 al obtener agenda de evento CANCELADO | backend/tests/Agenda.test.js | Test pasa con status 400 |
| 5.11 | Prueba: Disertante no inscrito | Verificar error 400 al asignar disertante no inscrito | backend/tests/Agenda.test.js | Test pasa con status 400 |
| 5.12 | Prueba de integración completa | Verificar flujo completo: generar informe→exportar→crear agenda | backend/tests/InformeAgenda.integracion.test.js | Flujo completo exitoso con validaciones |

---

## Resumen de Tareas

| Sección | Total de Steps | Días Estimados | Dependencias |
|---------|---------------|----------------|--------------|
| 1. Diseño y documentación de entidades y endpoints | 9 | 2 | Ninguna |
| 2. Desarrollo de generación de informes | 12 | 3 | Sección 1 |
| 3. Desarrollo de creación de agendas | 10 | 2 | Sección 1 |
| 4. Validación de reglas de negocio | 5 | 1 | Sección 2, Sección 3 |
| 5. Pruebas unitarias y de integración | 12 | 1 | Sección 4 |
| **Total** | **48** | **9 días hábiles** | — |

---

## Hitos del Proyecto

| Hito | Descripción | Criterio de Verificación |
|------|-------------|-------------------------|
| H1 - Diseño aprobado | Finalizada la Sección 1 | Entidades Informe y AgendaEvento documentadas, 4 endpoints definidos en Contract.md |
| H2 - Informes funcionales | Finalizada la Sección 2 | POST /informes y GET /informes/{id}/exportar operativos con exportación PDF/Excel |
| H3 - Agendas funcionales | Finalizada la Sección 3 | POST /agendas y GET /eventos/{id}/agenda operativos con validaciones |
| H4 - Validaciones implementadas | Finalizada la Sección 4 | RN1-RN3 validadas y funcionando correctamente |
| H5 - Módulo listo para integración | Finalizada la Sección 5 | 100% de pruebas unitarias y de integración aprobadas |

---

## Matriz de Archivos

| Archivo | Secciones | Steps |
|---------|----------|-------|
| backend/models/Informe.js | 1, 2 | 1.1, 2.1 |
| backend/models/AgendaEvento.js | 1, 3 | 1.2, 3.1 |
| backend/controllers/InformeController.js | 2 | 2.2, 2.11 |
| backend/controllers/AgendaController.js | 3 | 3.2, 3.6, 3.10 |
| backend/routes/informes.js | 1, 2 | 1.5, 1.6, 2.2, 2.11 |
| backend/routes/agendas.js | 1, 3 | 1.7, 1.8, 3.2, 3.6 |
| backend/middleware/verificarOrganizador.js | 2, 4 | 2.7, 4.1 |
| backend/middleware/verificarEstadoEvento.js | 3, 4 | 3.8, 4.2 |
| backend/services/InformeService.js | 2 | 2.3, 2.5 |
| backend/services/AgendaService.js | 3 | 3.4, 3.9 |
| backend/services/ExportService.js | 2, 4 | 2.9, 2.10, 4.5 |
| backend/validators/InformeValidator.js | 2, 4 | 2.8, 4.3 |
| backend/validators/AgendaValidator.js | 3 | 3.3, 3.5 |
| backend/validators/ExportValidator.js | 4 | 4.4 |
| backend/services/InscripcionService.js | 2, 3 | 2.4, 3.4 |
| backend/services/EncuestaService.js | 2 | 2.6 |
| backend/services/UsuarioService.js | 3 | 3.7 |
| backend/services/AuditoriaService.js | 2 | 2.12 |
| backend/tests/Informe.test.js | 5 | 5.1-5.4 |
| backend/tests/Export.test.js | 5 | 5.5, 5.6 |
| backend/tests/Agenda.test.js | 5 | 5.7-5.11 |
| backend/tests/InformeAgenda.integracion.test.js | 5 | 5.12 |
| base_datos/migraciones/ | 1 | 1.1-1.4 |
| backend/docs/dependencias.md | 1 | 1.9 |
