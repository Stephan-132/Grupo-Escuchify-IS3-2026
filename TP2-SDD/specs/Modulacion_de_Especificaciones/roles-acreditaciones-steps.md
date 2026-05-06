# Steps: Módulo Roles y Acreditación

**Fuente:** Contract.md + specs/Modulacion_de_Especificaciones/roles-acreditacion.md

**Total estimado:** 8 días hábiles

---

## 1. Diseño y documentación de entidades y endpoints

| Step | Descripción | Archivos afectados | Criterio de completitud |
|------|-------------|--------------------|--------------------------|
| 1.1 | Configurar estructura del módulo y conexión a base de datos PostgreSQL | `src/modules/roles-acreditacion/`, `.env` | El módulo se inicia sin errores y la conexión a BD es exitosa |
| 1.2 | Diseñar e implementar modelo de datos: tabla Rol (id_rol, nombre), tabla Acreditación (id_acreditacion, id_inscripcion, fecha_acreditacion, estado), tabla intermedia Usuario_Evento_Rol con UNIQUE(id_usuario, id_evento, id_rol) | `src/modules/roles-acreditacion/models/Rol.js`, `src/modules/roles-acreditacion/models/Acreditacion.js`, `src/modules/roles-acreditacion/models/UsuarioEventoRol.js`, `database/migrations/` | Las 3 tablas se crean con restricciones, FK e índices correctamente |
| 1.3 | Implementar endpoints REST: POST /api/v1/roles, POST /api/v1/usuarios-eventos-roles, POST /api/v1/acreditaciones, GET /api/v1/eventos/{id_evento}/acreditados | `src/modules/roles-acreditacion/routes/index.js`, `src/modules/roles-acreditacion/controllers/rolesController.js`, `src/modules/roles-acreditacion/controllers/acreditacionesController.js` | Los 4 endpoints responden con los códigos HTTP y JSON del Contract.md |
| 1.4 | Configurar middleware verificarToken (JWT) y verificarOrganizador (permisos por evento) | `src/modules/roles-acreditacion/middlewares/verificarToken.js`, `src/modules/roles-acreditacion/middlewares/verificarOrganizador.js` | Endpoints protegidos rechazan sin token y sin permisos de organizador |

---

## 2. Desarrollo de asignación de roles

| Step | Descripción | Archivos afectados | Criterio de completitud |
|------|-------------|--------------------|--------------------------|
| 2.1 | Implementar POST /api/v1/roles: validar nombre, verificar unicidad, insertar rol, retornar 201 con id_rol y nombre. Manejar 400 y 409 | `src/modules/roles-acreditacion/controllers/rolesController.js` | Crea rol (201), rechaza duplicado (409), rechaza campo vacío (400) |
| 2.2 | Implementar POST /api/v1/usuarios-eventos-roles: validar id_usuario, id_evento, id_rol. Validar usuario (Módulo 1), evento (Módulo 2), inscripción confirmada (Módulo 3). Insertar en Usuario_Evento_Rol | `src/modules/roles-acreditacion/controllers/rolesController.js`, `src/modules/roles-acreditacion/services/usuarioEventoRolService.js` | Asigna rol (201), rechaza no inscrito (400), duplicado (409), recurso inexistente (404) |
| 2.3 | Implementar servicio de validación de inscripción confirmada via GET /api/v1/inscripciones del Módulo 3 | `src/modules/roles-acreditacion/services/inscripcionesService.js` | Retorna inscripción confirmada o falla si no existe o no está confirmada |

---

## 3. Desarrollo de acreditación de participantes

| Step | Descripción | Archivos afectados | Criterio de completitud |
|------|-------------|--------------------|--------------------------|
| 3.1 | Implementar POST /api/v1/acreditaciones: validar id_inscripcion, id_personal. Verificar inscripción (Módulo 3), evento en curso (Módulo 2), permisos de organizador, ausencia de acreditación previa. Insertar con estado PRESENTE | `src/modules/roles-acreditacion/controllers/acreditacionesController.js`, `src/modules/roles-acreditacion/services/acreditacionService.js` | Acredita (201), rechaza sin inscripción (400), sin permisos (403), inscripción inexistente (404) |
| 3.2 | Implementar GET /api/v1/eventos/{id_evento}/acreditados: validar id_evento, verificar permisos (organizador/disertante), JOIN Acreditación + Usuario + Inscripción + Usuario_Evento_Rol, paginación default 20 | `src/modules/roles-acreditacion/controllers/acreditacionesController.js`, `src/modules/roles-acreditacion/services/acreditacionService.js` | Lista acreditados (200), rechaza sin permisos (403), evento inexistente (404), respeta paginación |

---

## 4. Pruebas unitarias y de integración

| Step | Descripción | Archivos afectados | Criterio de completitud |
|------|-------------|--------------------|--------------------------|
| 4.1 | Pruebas unitarias de roles: crear rol (201), duplicado (409), sin nombre (400), asignar rol (201), no inscrito (400), duplicado (409), recurso inexistente (404) | `tests/roles-acreditacion/roles.test.js` | Todas las pruebas unitarias de roles pasan |
| 4.2 | Pruebas unitarias de acreditaciones: acreditar (201), sin inscripción (400), sin permisos (403), inexistente (404), listar (200), sin permisos (403), evento inexistente (404) | `tests/roles-acreditacion/acreditaciones.test.js` | Todas las pruebas unitarias de acreditaciones pasan |
| 4.3 | Pruebas de integración: BD de prueba, flujo completo (crear rol → asignar → acreditar → listar), integridad referencial con módulos externos, rollback de transacciones, paginación con +20 registros | `tests/roles-acreditacion/integration.test.js` | Todas las pruebas de integración pasan, flujo end-to-end funciona, transacciones se revierten |
