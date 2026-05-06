# Project.md - Software de organización y gestión de eventos académicos

## Lista de Módulos del Proyecto
1. **Usuarios y Autenticación**: Gestión de registro, inicio de sesión y perfiles de usuarios. Entidad original: `Usuario`.
2. **Gestión de Eventos**: Creación, edición y administración de eventos académicos (cursos, jornadas, congresos, charlas). Entidades originales: `Evento`, `TipoEvento`.
3. **Inscripciones**: Registro de participantes a eventos (autónomo y por personal del evento). Entidad original: `Inscripción`.
4. **Roles y Acreditación**: Gestión de roles (organizador/participante/disertante) y acreditación de participantes. Entidades originales: `Rol`, `Acreditación`.
5. **Encuestas**: Gestión de comentarios y encuestas de satisfacción post-evento. Entidades originales: `Encuesta`, `PreguntaEncuesta`, `RespuestaEncuesta`.
6. **Certificados**: Generación de certificados (asistencia, aprobación, participación en calidad de autor/expositor). Entidades originales: `Certificado`, `TipoCertificado`.
7. **Informes y Agendas**: Generación de informes y agendas del evento. Entidades originales: `Informe`, `AgendaEvento`.
8. **Catálogo Público**: Visualización pública de eventos con filtros (futuros/pasados). No tiene entidades originales (consulta a `Evento` de Gestión de Eventos).
---

## 1. Objetivo y Contexto
Escenario del producto a desarrollar: Software de organización y gestión de eventos académicos. La idea es desarrollar una aplicación web para que grupos de personas puedan organizar eventos de tipo académico (cursos, jornadas, congresos, charlas, etc). Se requiere contar con una interfaz accesible desde la web para facilitar su uso desde cualquier dispositivo.

Características o funcionalidades principales determinadas por el negocio:
- Gestión de eventos
- Inscripción de participantes (autónoma y por el personal del evento)
- Gestión de roles (organizador/participante/disertante)
- Acreditación de participantes
- Posibilidad de comentarios o encuestas de satisfacción post-evento
- Generación de certificados (asistencia, aprobación, participación en calidad de autor / expositor)
- Generación de informes (incluyendo una agenda del evento si corresponde)

Algunos detalles:
- Los participantes pueden generar un usuario en la plataforma y hacer la inscripción a un evento.
- El listado de eventos es público, cada uno deberá tener su tipo y fecha de realización particular. Se podría establecer un filtro de eventos a futuro y para ver los que ya han pasado.
- Podría haber eventos que tengan un cupo mínimo y máximo. Igualmente con las fechas límite para inscripción.

---

## 2. Historias de Usuario y Criterios de Aceptación


---

## 3. Requisitos Funcionales y Reglas de Negocio


---

## 4. Restricciones técnicas generales del proyecto
### 4.1 Stack Tecnológico
- **Frontend**: React, diseño responsive para compatibilidad con cualquier dispositivo (móvil, tablet, escritorio), cumplimiento de norma WCAG 2.1 Nivel AA para accesibilidad web (según requerimiento de interfaz accesible del escenario).
- **Backend**: Node.js con Express.js, implementación de APIs REST bajo el estándar definido en Contract.md.
- **Base de Datos**: PostgreSQL, modelado según las entidades y relaciones definidas en la sección 5.

### 4.2 Prácticas Estándar por Tecnología
#### Frontend
- Uso de componentes funcionales y hooks de React.
- Gestión de estado de autenticación mediante Context API.
- Validación de formularios en cliente antes de realizar peticiones a APIs.
- Soporte para navegadores modernos: Chrome, Firefox, Edge y Safari (últimas 2 versiones).

#### Backend
- Validación de todos los parámetros de request (tipos de datos, campos requeridos, reglas de negocio).
- Manejo de errores unificado siguiendo el formato definido en Contract.md.
- Uso de consultas parametrizadas para prevenir inyección SQL.

#### Base de Datos
- Uso de transacciones para operaciones que modifiquen múltiples tablas (ej: inscripción de participante + actualización de cupo).
- Creación de índices en columnas de búsqueda frecuente: `Usuario.email`, `Evento.fecha_inicio`, `Inscripción.id_evento`.

### 4.3 Seguridad
- Almacenamiento de contraseñas con algoritmo bcrypt (costo mínimo 10).
- Todas las comunicaciones entre cliente y servidor vía HTTPS (TLS 1.2 o superior).
- Validación de permisos por rol en todos los endpoints protegidos.

### 4.4 Rendimiento
- Tiempo de respuesta de endpoints API (excepto generación de informes) < 500 milisegundos.
- Paginación en listados que superen los 20 registros (eventos, inscripciones).

---

## 5. Modelo de datos por módulo


---

## 6. Plan de Tareas
### Tiempo Total Estimado del Proyecto

---

## 7. Estrategia de Verificación


