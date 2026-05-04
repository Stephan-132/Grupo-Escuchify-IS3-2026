# Contract.md - Software de organización y gestión de eventos académicos
**Versión**: 1.0.0

---

## 1. Propósito
Define el alcance, reglas de interacción, interfaces expuestas y dependencias entre los 8 módulos del proyecto. Todo acceso inter-módulo debe realizarse exclusivamente vía los endpoints REST definidos en este documento, sin acceso directo a bases de datos entre módulos.

---

## 2. Lista de Módulos
1. **Usuarios y Autenticación**: Gestión de registro, inicio de sesión y perfiles de usuarios.
2. **Gestión de Eventos**: Creación, edición y administración de eventos académicos.
3. **Inscripciones**: Registro de participantes a eventos (autónomo y por personal).
4. **Roles y Acreditación**: Gestión de roles (organizador/participante/disertante) y acreditación de participantes.
5. **Encuestas**: Gestión de comentarios y encuestas de satisfacción post-evento.
6. **Certificados**: Generación de certificados (asistencia, aprobación, participación en calidad de autor/expositor).
7. **Informes y Agendas**: Generación de informes y agendas del evento.
8. **Catálogo Público**: Visualización pública de eventos con filtros.

---

## 3. Contratos por Módulo
### Módulo 1: Usuarios y Autenticación
#### Responsabilidades
- Gestionar registro de usuarios con email único.
- Validar contraseñas y almacenar en formato hash.
- Gestionar inicio de sesión y generación de tokens de sesión.
- Gestionar edición de perfiles de usuario.

#### Interfaces Expuestas (REST)
| Método | Ruta | Descripción | Request JSON | Response JSON | Códigos HTTP |
|--------|------|-------------|--------------|---------------|--------------|
| POST | /api/v1/usuarios/registro | Registro de nuevo usuario | `{"email": "{{email}}", "password": "{{password}}", "nombre": "{{nombre}}", "apellido": "{{apellido}}"}` | `{"id_usuario": "{{id_usuario}}", "email": "{{email}}"}` | 201 (Creado), 400 (Error validación), 409 (Email duplicado) |
| POST | /api/v1/usuarios/login | Inicio de sesión | `{"email": "{{email}}", "password": "{{password}}"}` | `{"token": "{{jwt_token}}", "id_usuario": "{{id_usuario}}"}` | 200 (OK), 401 (Credenciales inválidas) |
| GET | /api/v1/usuarios/{id_usuario} | Obtener perfil de usuario | - | `{"id_usuario": "{{id_usuario}}", "email": "{{email}}", "nombre": "{{nombre}}", "apellido": "{{apellido}}", "fecha_registro": "{{fecha}}"}` | 200 (OK), 404 (No encontrado) |
| PUT | /api/v1/usuarios/{id_usuario} | Editar perfil de usuario | `{"nombre": "{{nombre}}", "apellido": "{{apellido}}", "password": "{{new_password}}"}` | `{"mensaje": "Perfil actualizado"}` | 200 (OK), 400 (Error validación), 404 (No encontrado) |

#### Dependencias
- Ninguna.

#### Requisitos Funcionales y Reglas de Negocio (Resumido)
- RF: Registro con email único, validación de contraseña (mín 8 caracteres, mayús/minús/números), login con email/password, edición de perfil.
- RN: Email único, contraseñas en hash, solo usuarios autenticados pueden inscribirse.

---

### Módulo 2: Gestión de Eventos
#### Responsabilidades
- Gestionar CRUD de tipos de evento.
- Gestionar CRUD de eventos académicos.
- Validar reglas de fechas, cupos y fechas límite de inscripción.
- Gestionar estados de eventos (ACTIVO, FINALIZADO, CANCELADO).

#### Interfaces Expuestas (REST)
| Método | Ruta | Descripción | Request JSON | Response JSON | Códigos HTTP |
|--------|------|-------------|--------------|---------------|--------------|
| POST | /api/v1/tipos-evento | Crear tipo de evento | `{"nombre": "{{nombre}}", "descripcion": "{{descripcion}}"}` | `{"id_tipo_evento": "{{id_tipo_evento}}", "nombre": "{{nombre}}"}` | 201 (Creado), 400 (Error validación), 409 (Nombre duplicado) |
| GET | /api/v1/tipos-evento | Listar tipos de evento | - | `[{"id_tipo_evento": "{{id}}", "nombre": "{{nombre}}"}]` | 200 (OK) |
| POST | /api/v1/eventos | Crear evento | `{"id_tipo_evento": "{{id_tipo}}", "titulo": "{{titulo}}", "descripcion": "{{desc}}", "fecha_inicio": "{{fecha_ini}}", "fecha_fin": "{{fecha_fin}}", "cupo_minimo": "{{min}}", "cupo_maximo": "{{max}}", "fecha_limite_inscripcion": "{{fecha_lim}}"}` | `{"id_evento": "{{id_evento}}", "estado": "ACTIVO"}` | 201 (Creado), 400 (Error validación) |
| GET | /api/v1/eventos/{id_evento} | Obtener evento | - | `{"id_evento": "{{id}}", "titulo": "{{titulo}}", "fecha_inicio": "{{fecha_ini}}", "estado": "{{estado}}"}` | 200 (OK), 404 (No encontrado) |
| PUT | /api/v1/eventos/{id_evento} | Editar evento | `{"titulo": "{{titulo}}", "fecha_inicio": "{{fecha_ini}}"}` | `{"mensaje": "Evento actualizado"}` | 200 (OK), 400 (Error validación), 404 (No encontrado) |
| DELETE | /api/v1/eventos/{id_evento} | Cancelar evento | - | `{"mensaje": "Evento cancelado", "estado": "CANCELADO"}` | 204 (Sin contenido), 400 (Evento con inscripciones), 404 (No encontrado) |
| GET | /api/v1/eventos | Listar eventos | - | `[{"id_evento": "{{id}}", "titulo": "{{titulo}}", "tipo": "{{tipo}}", "fecha_inicio": "{{fecha_ini}}"}]` | 200 (OK) |

#### Dependencias
- Ninguna.

#### Requisitos Funcionales y Reglas de Negocio (Resumido)
- RF: CRUD de eventos y tipos, configuración de cupos y fechas límite.
- RN: Fecha inicio > fecha creación, fecha límite < fecha inicio, cupo máximo >= cupo mínimo, solo organizador edita/cancela.

---

### Módulo 3: Inscripciones
#### Responsabilidades
- Gestionar inscripciones autónomas de usuarios autenticados.
- Gestionar inscripciones manuales por personal del evento.
- Validar cupo disponible y fecha límite antes de confirmar inscripción.
- Gestionar cancelación de inscripciones.

#### Interfaces Expuestas (REST)
| Método | Ruta | Descripción | Request JSON | Response JSON | Códigos HTTP |
|--------|------|-------------|--------------|---------------|--------------|
| POST | /api/v1/inscripciones | Crear inscripción (autónoma) | `{"id_usuario": "{{id_usuario}}", "id_evento": "{{id_evento}}"}` | `{"id_inscripcion": "{{id_inscripcion}}", "estado": "CONFIRMADA"}` | 201 (Creado), 400 (Error validación), 409 (Ya inscrito/Cupo lleno/Fecha límite) |
| POST | /api/v1/inscripciones/manual | Crear inscripción manual (personal) | `{"id_usuario": "{{id_usuario}}", "id_evento": "{{id_evento}}", "id_personal": "{{id_personal}}"}` | `{"id_inscripcion": "{{id_inscripcion}}", "estado": "CONFIRMADA"}` | 201 (Creado), 400 (Error validación), 403 (No autorizado), 409 (Cupo lleno) |
| GET | /api/v1/inscripciones/{id_inscripcion} | Obtener inscripción | - | `{"id_inscripcion": "{{id}}", "id_usuario": "{{id_user}}", "id_evento": "{{id_event}}", "estado": "{{estado}}"}` | 200 (OK), 404 (No encontrado) |
| DELETE | /api/v1/inscripciones/{id_inscripcion} | Cancelar inscripción | - | `{"mensaje": "Inscripción cancelada"}` | 204 (Sin contenido), 400 (Cancelación no permitida), 404 (No encontrado) |

#### Dependencias
- Usuarios y Autenticación (validación de usuario autenticado)
- Gestión de Eventos (validación de cupos, fechas, estado de evento)

#### Requisitos Funcionales y Reglas de Negocio (Resumido)
- RF: Inscripción autónoma/manual, cancelación, validación de cupos y fechas.
- RN: No inscripción si cupo lleno, no inscripción después de fecha límite, no cancelación menos de 24h antes, usuario no se inscribe 2 veces.

---

### Módulo 4: Roles y Acreditación
#### Responsabilidades
- Gestionar asignación de roles (organizador/participante/disertante) por usuario y evento.
- Gestionar acreditación de participantes en eventos.
- Listar participantes acreditados por evento.

#### Interfaces Expuestas (REST)
| Método | Ruta | Descripción | Request JSON | Response JSON | Códigos HTTP |
|--------|------|-------------|--------------|---------------|--------------|
| POST | /api/v1/roles | Crear rol | `{"nombre": "{{nombre}}"}` | `{"id_rol": "{{id_rol}}", "nombre": "{{nombre}}"}` | 201 (Creado), 400 (Error validación), 409 (Nombre duplicado) |
| POST | /api/v1/usuarios-eventos-roles | Asignar rol a usuario en evento | `{"id_usuario": "{{id_usuario}}", "id_evento": "{{id_evento}}", "id_rol": "{{id_rol}}"}` | `{"mensaje": "Rol asignado"}` | 201 (Creado), 400 (Error validación), 404 (Usuario/Evento/Rol no encontrado), 409 (Rol ya asignado) |
| POST | /api/v1/acreditaciones | Acreditar participante | `{"id_inscripcion": "{{id_inscripcion}}", "id_personal": "{{id_personal}}"}` | `{"id_acreditacion": "{{id_acred}}", "estado": "PRESENTE"}` | 201 (Creado), 400 (Error validación), 403 (No autorizado), 404 (Inscripción no encontrada) |
| GET | /api/v1/eventos/{id_evento}/acreditados | Listar acreditados de evento | - | `[{"id_usuario": "{{id_user}}", "nombre": "{{nombre}}", "rol": "{{rol}}"}]` | 200 (OK), 403 (No autorizado), 404 (Evento no encontrado) |

#### Dependencias
- Usuarios y Autenticación (validación de usuarios)
- Inscripciones (validación de inscripciones confirmadas)
- Gestión de Eventos (validación de eventos en curso)

#### Requisitos Funcionales y Reglas de Negocio (Resumido)
- RF: Asignación de roles, acreditación, listado de acreditados.
- RN: Usuario puede tener varios roles en varios eventos, solo personal autorizado acredita, acreditación solo para inscritos.

---

### Módulo 5: Encuestas
#### Responsabilidades
- Gestionar creación de encuestas para eventos finalizados.
- Gestionar preguntas de encuestas (opción múltiple/abiertas).
- Gestionar respuestas de participantes acreditados.
- Generar resultados de encuestas.

#### Interfaces Expuestas (REST)
| Método | Ruta | Descripción | Request JSON | Response JSON | Códigos HTTP |
|--------|------|-------------|--------------|---------------|--------------|
| POST | /api/v1/encuestas | Crear encuesta | `{"id_evento": "{{id_evento}}", "titulo": "{{titulo}}"}` | `{"id_encuesta": "{{id_encuesta}}"}` | 201 (Creado), 400 (Error validación), 404 (Evento no encontrado), 409 (Evento no finalizado) |
| POST | /api/v1/encuestas/{id_encuesta}/preguntas | Agregar pregunta a encuesta | `{"texto_pregunta": "{{texto}}", "tipo_pregunta": "{{tipo}}"}` | `{"id_pregunta": "{{id_pregunta}}"}` | 201 (Creado), 400 (Error validación), 404 (Encuesta no encontrada) |
| POST | /api/v1/encuestas/{id_encuesta}/respuestas | Responder encuesta | `{"id_usuario": "{{id_usuario}}", "respuestas": [{"id_pregunta": "{{id_preg}}", "respuesta": "{{resp}}"}]}` | `{"mensaje": "Respuesta registrada"}` | 201 (Creado), 400 (Error validación), 403 (No acreditado), 404 (Encuesta no encontrada), 409 (Ya respondida) |
| GET | /api/v1/encuestas/{id_encuesta}/resultados | Obtener resultados | - | `{"promedio_satisfaccion": "{{promedio}}", "comentarios": ["{{comentario}}"]}` | 200 (OK), 403 (No autorizado), 404 (Encuesta no encontrada) |

#### Dependencias
- Usuarios y Autenticación (validación de usuarios)
- Inscripciones (validación de participantes acreditados)
- Gestión de Eventos (validación de eventos finalizados)

#### Requisitos Funcionales y Reglas de Negocio (Resumido)
- RF: Creación de encuestas, preguntas, respuestas, resultados.
- RN: Encuestas solo para eventos finalizados, solo acreditados responden, un usuario responde una vez por evento.

---

### Módulo 6: Certificados
#### Responsabilidades
- Gestionar generación de certificados (asistencia, aprobación, participación).
- Exportar certificados a formato PDF.
- Gestionar tipos de certificado.

#### Interfaces Expuestas (REST)
| Método | Ruta | Descripción | Request JSON | Response JSON | Códigos HTTP |
|--------|------|-------------|--------------|---------------|--------------|
| POST | /api/v1/tipos-certificado | Crear tipo de certificado | `{"nombre": "{{nombre}}"}` | `{"id_tipo_certificado": "{{id_tipo}}", "nombre": "{{nombre}}"}` | 201 (Creado), 400 (Error validación), 409 (Nombre duplicado) |
| POST | /api/v1/certificados | Generar certificado | `{"id_inscripcion": "{{id_inscripcion}}", "id_tipo_certificado": "{{id_tipo}}", "calificacion": "{{calif}}"}` | `{"id_certificado": "{{id_cert}}"}` | 201 (Creado), 400 (Error validación), 404 (Inscripción no encontrada), 409 (Requisitos no cumplidos) |
| GET | /api/v1/certificados/{id_certificado}/pdf | Descargar certificado PDF | - | Archivo PDF binario | 200 (OK), 404 (Certificado no encontrado) |

#### Dependencias
- Usuarios y Autenticación (validación de usuarios)
- Inscripciones (validación de inscripciones)
- Roles y Acreditación (validación de acreditaciones y roles)
- Gestión de Eventos (validación de eventos)

#### Requisitos Funcionales y Reglas de Negocio (Resumido)
- RF: Generación de certificados por tipo, exportación a PDF.
- RN: Certificados de asistencia solo para acreditados, de aprobación requieren calificación mínima, de participación para disertantes.

---

### Módulo 7: Informes y Agendas
#### Responsabilidades
- Generar informes de inscripciones, encuestas por evento.
- Generar agendas de eventos con cronograma.
- Exportar informes a PDF/Excel.

#### Interfaces Expuestas (REST)
| Método | Ruta | Descripción | Request JSON | Response JSON | Códigos HTTP |
|--------|------|-------------|--------------|---------------|--------------|
| POST | /api/v1/informes | Generar informe | `{"id_evento": "{{id_evento}}", "tipo_informe": "{{tipo}}"}` | `{"id_informe": "{{id_informe}}"}` | 201 (Creado), 400 (Error validación), 404 (Evento no encontrado) |
| GET | /api/v1/informes/{id_informe}/exportar | Exportar informe | `{"formato": "{{formato}}"}` | Archivo PDF/Excel binario | 200 (OK), 404 (Informe no encontrado) |
| POST | /api/v1/agendas | Crear agenda de evento | `{"id_evento": "{{id_evento}}", "actividades": [{"hora_inicio": "{{ini}}", "hora_fin": "{{fin}}", "titulo": "{{titulo}}", "id_disertante": "{{id_user}}"}]}` | `{"id_agenda": "{{id_agenda}}"}` | 201 (Creado), 400 (Error validación), 404 (Evento no encontrado) |
| GET | /api/v1/eventos/{id_evento}/agenda | Obtener agenda de evento | - | `{"actividades": [{"hora_inicio": "{{ini}}", "titulo": "{{titulo}}", "disertante": "{{nombre}}"}]}` | 200 (OK), 404 (Evento no encontrado) |

#### Dependencias
- Gestión de Eventos (datos de eventos)
- Inscripciones (datos de inscripciones)
- Encuestas (resultados de encuestas)
- Certificados (datos de certificados)

#### Requisitos Funcionales y Reglas de Negocio (Resumido)
- RF: Generación de informes y agendas, exportación.
- RN: Informes de inscripciones solo para organizadores, agendas públicas para eventos activos/finalizados, informes de encuestas solo para eventos con encuestas cerradas.

---

### Módulo 8: Catálogo Público
#### Responsabilidades
- Mostrar listado público de eventos activos y finalizados.
- Permitir filtros por fecha (futuros/pasados) y tipo de evento.

#### Interfaces Expuestas (REST)
| Método | Ruta | Descripción | Request JSON | Response JSON | Códigos HTTP |
|--------|------|-------------|--------------|---------------|--------------|
| GET | /api/v1/catalogo/eventos | Listar eventos públicos | - | `[{"id_evento": "{{id}}", "titulo": "{{titulo}}", "tipo": "{{tipo}}", "fecha_inicio": "{{fecha_ini}}"}]` | 200 (OK) |
| GET | /api/v1/catalogo/eventos?filtro=futuros | Filtrar eventos futuros | - | `[{"id_evento": "{{id}}", "titulo": "{{titulo}}", "fecha_inicio": "{{fecha_ini}}"}]` | 200 (OK) |
| GET | /api/v1/catalogo/eventos?filtro=pasados | Filtrar eventos pasados | - | `[{"id_evento": "{{id}}", "titulo": "{{titulo}}", "fecha_inicio": "{{fecha_ini}}"}]` | 200 (OK) |
| GET | /api/v1/catalogo/eventos?tipo={id_tipo_evento} | Filtrar por tipo | - | `[{"id_evento": "{{id}}", "titulo": "{{titulo}}", "tipo": "{{tipo}}"}]` | 200 (OK) |

#### Dependencias
- Gestión de Eventos (consulta de eventos activos/finalizados)

#### Requisitos Funcionales y Reglas de Negocio (Resumido)
- RF: Listado público, filtros por fecha y tipo.
- RN: Solo eventos activos/finalizados, eventos cancelados no se muestran, filtro futuros >= fecha actual.

---

## 4. Estándares de Comunicación
- Todo intercambio de datos entre módulos utiliza el protocolo HTTP/REST.
- Todo contenido de request y response utiliza formato JSON, con codificación UTF-8.
- Todos los endpoints expuestos están bajo el prefijo `/api/v1/`.
- Validación de campos requeridos, tipos de datos y reglas de negocio se realiza en el módulo propietario de la interfaz.

---

## 5. Manejo Unificado de Errores
- Todos los errores devuelven un objeto JSON con la siguiente estructura:
  `{"error": "{{CODIGO_ERROR}}", "message": "{{DESCRIPCION}}"}`
- Códigos HTTP estándar utilizados:
  - 200: OK (operación exitosa)
  - 201: Creado (recurso creado exitosamente)
  - 204: Sin contenido (operación exitosa sin respuesta)
  - 400: Solicitud incorrecta (error de validación)
  - 401: No autorizado (credenciales inválidas)
  - 403: Prohibido (sin permisos para la acción)
  - 404: No encontrado (recurso no existe)
  - 409: Conflicto (regla de negocio no cumplida, duplicados)

---

## 6. Versionamiento
- **Versión actual**: 1.0.0 (aplica a todo el documento)
- **Reglas de actualización**:
  - **Mayor (X.y.z)**: Cambios que rompen compatibilidad (ej: eliminar endpoints, modificar estructura de request/response que invalida clientes existentes). Se incrementa el primer dígito (ej: 2.0.0).
  - **Menor (x.Y.z)**: Cambios no rompientes (ej: agregar nuevos endpoints, agregar campos opcionales a request/response). Se incrementa el segundo dígito (ej: 1.1.0).
- Todo cambio en los contratos debe documentarse en este archivo, actualizando la versión correspondiente.
- Los módulos clientes deben validar la versión del contrato antes de realizar peticiones a nuevos endpoints.
