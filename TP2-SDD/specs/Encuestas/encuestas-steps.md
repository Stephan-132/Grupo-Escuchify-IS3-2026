# Steps - Módulo 5: Encuestas

## 1. Diseño y documentación de entidades y endpoints (2 días)

### 1.1 Diseñar esquema de base de datos para Encuesta, PreguntaEncuesta y RespuestaEncuesta

| Descripción | Crear las tablas en PostgreSQL para las tres entidades del módulo, definiendo columnas, tipos de datos, restricciones (NOT NULL, AUTO_INCREMENT, DEFAULT), claves primarias y foráneas según el modelo de datos especificado en encuestas.md. |
|-------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Archivos afectados | `src/db/migrations/create_encuestas.sql`, `src/db/migrations/create_pregunta_encuesta.sql`, `src/db/migrations/create_respuesta_encuesta.sql` |
| Criterio de completitud | Las tres tablas están creadas con todas las columnas, restricciones y relaciones definidas. Las migraciones se ejecutan sin errores en PostgreSQL. |

### 1.2 Definir índices y optimizaciones de base de datos

| Descripción | Crear índices en columnas de búsqueda frecuente (id_evento, id_encuesta, id_usuario, id_pregunta) para optimizar consultas de validación y agregación de resultados. |
|-------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Archivos afectados | `src/db/migrations/create_encuestas_indexes.sql` |
| Criterio de completitud | Índices creados y verificados con EXPLAIN en consultas de ejemplo. |

### 1.3 Documentar endpoints REST del módulo Encuestas

| Descripción | Documentar los 4 endpoints definidos en Contract.md (POST /api/v1/encuestas, POST /api/v1/encuestas/{id_encuesta}/preguntas, POST /api/v1/encuestas/{id_encuesta}/respuestas, GET /api/v1/encuestas/{id_encuesta}/resultados) con sus request/response JSON, códigos HTTP y reglas de validación. |
|-------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Archivos afectados | `docs/api/encuestas-api.md` |
| Criterio de completitud | Documentación completa y consistente con Contract.md, incluyendo ejemplos de request/response y todos los códigos HTTP. |

### 1.4 Configurar rutas y estructura de controladores del módulo

| Descripción | Crear la estructura de carpetas y archivos para los controllers, services y repositories del módulo Encuestas. Configurar las rutas en el router principal de Express.js bajo el prefijo /api/v1/encuestas. |
|-------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Archivos afectados | `src/modules/encuestas/EncuestaController.js`, `src/modules/encuestas/EncuestaService.js`, `src/modules/encuestas/EncuestaRepository.js`, `src/routes/encuestas.js` |
| Criterio de completitud | Estructura de archivos creada, rutas registradas en el router principal, endpoints accesibles (aunque sin implementación). |

---

## 2. Desarrollo de creación de encuestas y preguntas (2 días)

### 2.1 Implementar EncuestaRepository

| Descripción | Crear los métodos de acceso a datos para la entidad Encuesta: crearEncuesta(id_evento, titulo), obtenerEncuestaPorId(id_encuesta), existeEncuestaPorEvento(id_evento), y validarEventoFinalizado(id_evento) consultando al Módulo 2: Gestión de Eventos vía API REST. |
|-------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Archivos afectados | `src/modules/encuestas/EncuestaRepository.js` |
| Criterio de completitud | Métodos implementados con consultas parametrizadas, sin acceso directo a bases de datos de otros módulos (solo vía REST). |

### 2.2 Implementar EncuestaService para creación de encuestas

| Descripción | Implementar la lógica de negocio para crear encuestas. Validar que el evento exista y esté en estado "FINALIZADO" llamando a GET /api/v1/eventos/{id_evento}. Retornar error 409 si el evento no está finalizado, 404 si no existe. |
|-------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Archivos afectados | `src/modules/encuestas/EncuestaService.js` |
| Criterio de completitud | Servicio valida estado del evento correctamente, crea la encuesta con fecha_apertura por defecto y retorna id_encuesta. |

### 2.3 Implementar controller POST /api/v1/encuestas

| Descripción | Implementar el endpoint para crear encuestas. Recibir request JSON con id_evento y titulo, validar campos requeridos, invocar EncuestaService y retornar `{"id_encuesta": "..."}` con código 201. Implementar manejo unificado de errores según Contract.md. |
|-------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Archivos afectados | `src/modules/encuestas/EncuestaController.js` |
| Criterio de completitud | Endpoint funcional, validación de request, manejo de errores con formato `{"error": "...", "message": "..."}`, códigos HTTP correctos (201, 400, 404, 409). |

### 2.4 Implementar PreguntaEncuestaRepository

| Descripción | Crear los métodos de acceso a datos para PreguntaEncuesta: crearPregunta(id_encuesta, texto_pregunta, tipo_pregunta), obtenerPreguntasPorEncuesta(id_encuesta). Validar que tipo_pregunta sea "opcion_multiple" o "abierta". |
|-------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Archivos afectados | `src/modules/encuestas/PreguntaEncuestaRepository.js` |
| Criterio de completitud | Métodos implementados con validación de tipo_pregunta y consultas parametrizadas. |

### 2.5 Implementar servicio y controller POST /api/v1/encuestas/{id_encuesta}/preguntas

| Descripción | Implementar lógica de negocio y endpoint para agregar preguntas. Validar que la encuesta exista, validar tipo_pregunta, crear la pregunta y retornar `{"id_pregunta": "..."}` con código 201. |
|-------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Archivos afectados | `src/modules/encuestas/PreguntaEncuestaService.js`, `src/modules/encuestas/PreguntaEncuestaController.js` |
| Criterio de completitud | Endpoint funcional, validaciones completas (encuesta existente, tipo_pregunta válido), respuesta JSON correcta con 201/400/404. |

---

## 3. Desarrollo de respuestas a encuestas (2 días)

### 3.1 Implementar RespuestaEncuestaRepository

| Descripción | Crear los métodos de acceso a datos para RespuestaEncuesta: crearRespuestas(id_usuario, respuestas[]), usuarioYaRespondioEncuesta(id_usuario, id_encuesta), obtenerRespuestasPorEncuesta(id_encuesta). Usar transacciones para guardar múltiples respuestas atómicamente. |
|-------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Archivos afectados | `src/modules/encuestas/RespuestaEncuestaRepository.js` |
| Criterio de completitud | Métodos implementados con transacciones, consulta de verificación de respuesta única por usuario/encuesta funcional. |

### 3.2 Implementar servicio para responder encuestas

| Descripción | Implementar la lógica de negocio para POST /api/v1/encuestas/{id_encuesta}/respuestas. Validar: (1) usuario acreditado en el evento consultando GET /api/v1/eventos/{id_evento}/acreditados del Módulo 4, (2) usuario no respondió previamente (RN2), (3) todas las preguntas existen y pertenecen a la encuesta. Guardar todas las respuestas en una transacción. |
|-------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Archivos afectados | `src/modules/encuestas/RespuestaEncuestaService.js` |
| Criterio de completitud | Servicio valida acreditación (403 si no acreditado), respuesta única (409 si ya respondida), y guarda respuestas atómicamente. Mensaje de éxito: "Respuesta registrada". |

### 3.3 Implementar controller POST /api/v1/encuestas/{id_encuesta}/respuestas

| Descripción | Implementar endpoint para responder encuesta. Recibir request JSON con id_usuario y array de respuestas `[{id_pregunta, respuesta}]`, validar estructura del request, invocar servicio y retornar `{"mensaje": "Respuesta registrada"}` con código 201. |
|-------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Archivos afectados | `src/modules/encuestas/RespuestaEncuestaController.js` |
| Criterio de completitud | Endpoint funcional, validación de request completa, manejo de errores con códigos 201/400/403/404/409. |

### 3.4 Implementar servicio y controller GET /api/v1/encuestas/{id_encuesta}/resultados

| Descripción | Implementar lógica y endpoint para obtener resultados. Calcular promedio de satisfacción a partir de preguntas de opción múltiple, agrupar comentarios de preguntas abiertas. Validar que solo organizadores del evento puedan acceder (403 si no autorizado). |
|-------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Archivos afectados | `src/modules/encuestas/ResultadosEncuestaService.js`, `src/modules/encuestas/ResultadosEncuestaController.js` |
| Criterio de completitud | Endpoint retorna `{"promedio_satisfaccion": ..., "comentarios": [...]}` con código 200. Validación de permisos implementada (403/404). |

---

## 4. Pruebas unitarias y de integración (2 días)

### 4.1 Pruebas unitarias para EncuestaService

| Descripción | Crear tests unitarios para creación de encuestas: caso exitoso, evento no finalizado (409 "EVENTO_NO_FINALIZADO"), evento no encontrado (404). Mock de la llamada a GET /api/v1/eventos/{id_evento} del Módulo 2. |
|-------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Archivos afectados | `tests/unit/encuestas/EncuestaService.test.js` |
| Criterio de completitud | Todos los casos de prueba pasan, cobertura del servicio > 80%. |

### 4.2 Pruebas unitarias para PreguntaEncuestaService

| Descripción | Crear tests unitarios: agregar pregunta exitosa, tipo_pregunta inválido (400), encuesta no encontrada (404). |
|-------------|--------------------------------------------------------------------------------------------------------------|
| Archivos afectados | `tests/unit/encuestas/PreguntaEncuestaService.test.js` |
| Criterio de completitud | Todos los casos de prueba pasan, cobertura del servicio > 80%. |

### 4.3 Pruebas unitarias para RespuestaEncuestaService

| Descripción | Crear tests unitarios: respuesta exitosa, usuario no acreditado (403 "NO_ACREDITADO"), encuesta ya respondida (409 "ENCUESTA_YA_RESPONDIDA"). Mock de la llamada a GET /api/v1/eventos/{id_evento}/acreditados del Módulo 4. |
|-------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Archivos afectados | `tests/unit/encuestas/RespuestaEncuestaService.test.js` |
| Criterio de completitud | Todos los casos de prueba pasan, cobertura del servicio > 80%. |

### 4.4 Pruebas de integración para endpoints de Encuestas

| Descripción | Crear tests de integración para los 4 endpoints: crear encuesta, agregar preguntas, responder encuesta, obtener resultados. Usar base de datos de prueba, verificar flujo completo y códigos HTTP. |
|-------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Archivos afectados | `tests/integration/encuestas.test.js` |
| Criterio de completitud | Todos los endpoints responden correctamente, códigos HTTP verificados, base de datos en estado esperado después de cada test. |

### 4.5 Ejecutar suite completa de pruebas del módulo

| Descripción | Ejecutar todas las pruebas unitarias y de integración del módulo Encuestas. Verificar que no haya regresiones con otros módulos y generar reporte de cobertura. |
|-------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Archivos afectados | `tests/unit/encuestas/*.test.js`, `tests/integration/encuestas.test.js` |
| Criterio de completitud | 100% de pruebas passing, sin errores ni warnings, reporte de cobertura generado y revisado. |
