# Especificación del Módulo: Gestión de Eventos

## 📋 Información General
- **Nombre del Módulo**: Gestión de Eventos
- **Versión**: 1.0.0
- **Última Actualización**: Mayo 2026
- **Estado**: Especificación Completa

---

## 1. Objetivo y Contexto

### Objetivo
Gestionar la creación, edición, administración y cancelación de eventos académicos dentro de la plataforma. Este módulo es el core del sistema y proporciona la capacidad de que organizadores publiquen eventos de tipo académico (cursos, jornadas, congresos, charlas, etc.) con configuración de cupos, fechas y restricciones de inscripción.

### Contexto
- Los eventos son la entidad central del sistema
- Cada evento tiene un tipo específico (Curso, Jornada, Congreso, Charla, etc.)
- Los eventos pueden tener cupos mínimos y máximos
- Se establece una fecha límite para inscripciones
- Solo los organizadores que crean el evento pueden editarlo o cancelarlo
- Los eventos tienen estados: ACTIVO, FINALIZADO, CANCELADO

### Importancia
Sin este módulo, las otras funcionalidades del sistema (inscripciones, certificados, informes, etc.) no tendrían sentido de existir.

---

## 2. Responsabilidades del Módulo

- Gestionar CRUD (Create, Read, Update, Delete) de tipos de evento
- Gestionar CRUD de eventos académicos
- Validar reglas de fechas (inicio > creación, límite < inicio)
- Validar reglas de cupos (máximo >= mínimo)
- Gestionar estados de eventos (ACTIVO, FINALIZADO, CANCELADO)
- Notificar cambios de estado a participantes inscritos (integración futura)
- Permitir visualización de eventos según estado y filtros

---

## 3. Historias de Usuario

### HU-1: Crear Nuevo Evento Académico
**Como organizador, quiero crear un nuevo evento académico, para publicarlo en la plataforma.**

**Criterios de Aceptación:**
- El evento se crea con título, tipo, fechas de inicio/fin, cupos (mínimo/máximo) y fecha límite de inscripción
- Se asigna estado "ACTIVO" por defecto
- Se validan todas las reglas de fechas y cupos
- Se retorna el ID del evento creado
- Solo usuarios autenticados pueden crear eventos

**Ejemplos:**
- Crear evento "Curso Python Avanzado" de tipo "Curso" con cupo máximo 50 e inicio el 15/06/2026
- Crear evento "Congreso de Tecnología" de tipo "Congreso" sin cupo máximo definido

---

### HU-2: Editar Evento Existente
**Como organizador, quiero editar un evento existente, para modificar sus detalles o fechas.**

**Criterios de Aceptación:**
- Solo el organizador del evento puede editar sus datos
- No se permite modificar fechas si ya hay inscripciones confirmadas
- Se validan las nuevas fechas y cupos
- Se registra la auditoría del cambio
- Se retorna confirmación de actualización

**Ejemplos:**
- Modificar título de evento sin inscripciones confirmadas
- Intentar cambiar fecha de inicio con inscripciones confirmadas → Error
- Aumentar cupo máximo en evento activo

---

### HU-3: Cancelar Evento
**Como organizador, quiero cancelar un evento, para informar a los participantes.**

**Criterios de Aceptación:**
- El evento cambia a estado "CANCELADO"
- Se notifica a todos los participantes inscritos
- No se puede restaurar el evento (es definitivo)
- Se retorna confirmación de cancelación
- El evento no aparece en catálogo público

**Ejemplos:**
- Cancelar evento por falta de demanda
- Cancelar evento por cambio de circunstancias

---

## 4. Requisitos Funcionales y Reglas de Negocio

### Requisitos Funcionales (RF)

| ID | Descripción |
|----|-------------|
| RF1 | El sistema debe permitir el CRUD de eventos académicos (crear, leer, actualizar, eliminar). |
| RF2 | El sistema debe asociar un tipo de evento a cada evento creado. |
| RF3 | El sistema debe permitir configurar cupos mínimo y máximo por evento. |
| RF4 | El sistema debe establecer fecha límite de inscripción por evento. |
| RF5 | El sistema debe listar eventos con filtros por estado, tipo y fecha. |
| RF6 | El sistema debe permitir que solo el organizador edite/cancele su evento. |
| RF7 | El sistema debe validar que no haya cambios de fechas si existen inscripciones. |
| RF8 | El sistema debe mantener un registro de auditoría de cambios en eventos. |

### Reglas de Negocio (RN)

| ID | Descripción |
|----|-------------|
| RN1 | La fecha de inicio del evento debe ser posterior a la fecha de creación. |
| RN2 | La fecha límite de inscripción debe ser anterior a la fecha de inicio del evento. |
| RN3 | El cupo máximo no puede ser menor al cupo mínimo (si se definen ambos). |
| RN4 | Solo el organizador creador del evento puede editarlo o cancelarlo. |
| RN5 | Un evento se crea con estado "ACTIVO" por defecto. |
| RN6 | No se permite editar fechas de un evento que tiene inscripciones confirmadas. |
| RN7 | Al cancelar un evento, todos los inscritos deben ser notificados. |
| RN8 | Los eventos cancelados no aparecen en el catálogo público. |

---

## 5. Modelo de Datos

### Entidad: TipoEvento

Define las categorías de eventos que pueden crearse en el sistema.

| Atributo | Tipo de dato | Restricciones | PK/FK | Descripción |
|----------|--------------|---------------|-------|-------------|
| id_tipo_evento | INT | NOT NULL AUTO_INCREMENT | PK | Identificador único |
| nombre | VARCHAR(50) | NOT NULL UNIQUE | | Nombre de la categoría (ej: Curso, Congreso) |
| descripcion | TEXT | | | Descripción del tipo de evento |

**Relaciones:**
- 1:N TipoEvento → Evento

**Ejemplos de datos:**
- Curso
- Jornada
- Congreso
- Charla
- Workshop
- Seminario

---

### Entidad: Evento

Define los eventos académicos publicados en la plataforma.

| Atributo | Tipo de dato | Restricciones | PK/FK | Descripción |
|----------|--------------|---------------|-------|-------------|
| id_evento | INT | NOT NULL AUTO_INCREMENT | PK | Identificador único |
| id_tipo_evento | INT | NOT NULL | FK (TipoEvento.id_tipo_evento) | Referencia al tipo de evento |
| titulo | VARCHAR(255) | NOT NULL | | Título del evento |
| descripcion | TEXT | | | Descripción detallada del evento |
| fecha_inicio | DATETIME | NOT NULL | | Fecha y hora de inicio |
| fecha_fin | DATETIME | NOT NULL | | Fecha y hora de finalización |
| cupo_minimo | INT | | | Cantidad mínima de participantes (opcional) |
| cupo_maximo | INT | | | Cantidad máxima de participantes (opcional) |
| fecha_limite_inscripcion | DATETIME | NOT NULL | | Última fecha para inscribirse |
| estado | VARCHAR(20) | NOT NULL DEFAULT 'ACTIVO' | | ACTIVO, FINALIZADO, CANCELADO |

**Relaciones:**
- FK → TipoEvento (id_tipo_evento)
- 1:N Evento → Inscripción
- 1:N Evento → Encuesta
- 1:N Evento → Certificado
- 1:N Evento → Informe
- 1:N Evento → AgendaEvento
- 1:N Evento → Usuario_Evento_Rol (mediante tabla intermedia)

**Ejemplos de estado:**
- ACTIVO: Evento abierto a inscripciones
- FINALIZADO: Evento completado
- CANCELADO: Evento cancelado (no mostrar en catálogo)

**Restricciones en la BD:**
```sql
CONSTRAINT CHK_fecha_inicio CHECK (fecha_inicio > fecha_creacion)
CONSTRAINT CHK_fecha_limite CHECK (fecha_limite_inscripcion < fecha_inicio)
CONSTRAINT CHK_cupos CHECK (cupo_maximo >= cupo_minimo OR cupo_maximo IS NULL)
CREATE INDEX idx_evento_fecha_inicio ON Evento(fecha_inicio)
CREATE INDEX idx_evento_estado ON Evento(estado)
```

---

## 6. Interfaces REST (API Contract)

### Base Path
```
/api/v1
```

### Endpoints

#### 6.1 Tipos de Evento

##### POST /tipos-evento
**Crear tipo de evento**

**Request:**
```json
{
  "nombre": "Curso",
  "descripcion": "Evento educativo enfocado en enseñanza de un tema específico"
}
```

**Response (201 - Creado):**
```json
{
  "id_tipo_evento": 1,
  "nombre": "Curso",
  "descripcion": "Evento educativo..."
}
```

**Códigos HTTP:**
- `201` Creado exitosamente
- `400` Error de validación
- `409` Nombre de tipo duplicado

---

##### GET /tipos-evento
**Listar tipos de evento**

**Response (200 - OK):**
```json
[
  {
    "id_tipo_evento": 1,
    "nombre": "Curso"
  },
  {
    "id_tipo_evento": 2,
    "nombre": "Congreso"
  }
]
```

**Códigos HTTP:**
- `200` OK

---

#### 6.2 Eventos

##### POST /eventos
**Crear evento**

**Request:**
```json
{
  "id_tipo_evento": 1,
  "titulo": "Curso Python Avanzado",
  "descripcion": "Aprende técnicas avanzadas de Python",
  "fecha_inicio": "2026-06-15T09:00:00Z",
  "fecha_fin": "2026-06-15T17:00:00Z",
  "cupo_minimo": 10,
  "cupo_maximo": 50,
  "fecha_limite_inscripcion": "2026-06-10T23:59:59Z"
}
```

**Response (201 - Creado):**
```json
{
  "id_evento": 5,
  "estado": "ACTIVO",
  "fecha_creacion": "2026-05-01T10:30:00Z"
}
```

**Validaciones:**
- fecha_inicio > ahora
- fecha_limite_inscripcion < fecha_inicio
- cupo_maximo >= cupo_minimo (si ambos existen)

**Códigos HTTP:**
- `201` Creado exitosamente
- `400` Error de validación
- `401` No autenticado
- `403` No autorizado (no es organizador)

---

##### GET /eventos/{id_evento}
**Obtener evento específico**

**Response (200 - OK):**
```json
{
  "id_evento": 5,
  "id_tipo_evento": 1,
  "titulo": "Curso Python Avanzado",
  "descripcion": "Aprende técnicas avanzadas de Python",
  "fecha_inicio": "2026-06-15T09:00:00Z",
  "fecha_fin": "2026-06-15T17:00:00Z",
  "cupo_minimo": 10,
  "cupo_maximo": 50,
  "fecha_limite_inscripcion": "2026-06-10T23:59:59Z",
  "estado": "ACTIVO",
  "inscritos": 25,
  "cupo_disponible": 25
}
```

**Códigos HTTP:**
- `200` OK
- `404` Evento no encontrado

---

##### PUT /eventos/{id_evento}
**Editar evento**

**Request:**
```json
{
  "titulo": "Curso Python Avanzado - Edición 2026",
  "descripcion": "Aprende técnicas avanzadas de Python con ejemplos prácticos",
  "fecha_inicio": "2026-06-20T09:00:00Z",
  "cupo_maximo": 60
}
```

**Response (200 - OK):**
```json
{
  "mensaje": "Evento actualizado exitosamente"
}
```

**Validaciones:**
- Solo el organizador puede editar
- No permitir cambio de fechas si hay inscripciones confirmadas
- Validar nuevas fechas según RN

**Códigos HTTP:**
- `200` OK
- `400` Error de validación
- `403` No autorizado (no es el organizador)
- `404` Evento no encontrado
- `409` No se puede editar por restricción de negocio

---

##### DELETE /eventos/{id_evento}
**Cancelar evento**

**Response (204 - Sin contenido):**
```
(Sin cuerpo)
```

**Efectos secundarios:**
- Cambiar estado a "CANCELADO"
- Notificar a todos los inscritos
- Liberar recursos

**Códigos HTTP:**
- `204` Cancelado exitosamente
- `400` Error (ej: evento con inscripciones)
- `403` No autorizado
- `404` Evento no encontrado

---

##### GET /eventos
**Listar eventos (con filtros)**

**Query Parameters:**
- `estado` (opcional): ACTIVO, FINALIZADO, CANCELADO
- `tipo` (opcional): id_tipo_evento
- `fecha_desde` (opcional): Filtrar eventos después de esta fecha
- `fecha_hasta` (opcional): Filtrar eventos antes de esta fecha
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Registros por página (default: 20, máx: 100)

**Request Example:**
```
GET /eventos?estado=ACTIVO&tipo=1&page=1&limit=20
```

**Response (200 - OK):**
```json
{
  "total": 45,
  "page": 1,
  "limit": 20,
  "eventos": [
    {
      "id_evento": 5,
      "titulo": "Curso Python Avanzado",
      "tipo": "Curso",
      "fecha_inicio": "2026-06-15T09:00:00Z",
      "estado": "ACTIVO",
      "cupo_disponible": 25
    }
  ]
}
```

**Códigos HTTP:**
- `200` OK
- `400` Parámetros inválidos

---

## 7. Dependencias

**Dependencias Externas del Módulo:**
- **Ninguna** en términos de otros módulos que deba consumir directamente

**Módulos que Dependen de Este:**
- Inscripciones (validación de cupos y fechas)
- Roles y Acreditación (eventos en curso)
- Encuestas (eventos finalizados)
- Certificados (eventos y participantes)
- Informes y Agendas (generación de reportes)
- Catálogo Público (listado de eventos)

---

## 8. Plan de Tareas

### Módulo 2: Gestión de Eventos (Total: 11 días hábiles)

| ID | Tarea | Días | Dependencias | Descripción |
|----|-------|------|--------------|-------------|
| T2.1 | Diseño y documentación de entidades y endpoints | 3 | Ninguna | Finalizar diseño DB, documentar API según Contract.md |
| T2.2 | Desarrollo de CRUD de tipos de evento | 1 | T2.1 | Endpoints POST/GET para tipos |
| T2.3 | Desarrollo de CRUD de eventos | 3 | T2.1, T2.2 | Endpoints POST/GET/PUT/DELETE para eventos |
| T2.4 | Validación de reglas de negocio (fechas, cupos) | 1 | T2.3 | Implementar validaciones RN1-RN8 |
| T2.5 | Pruebas unitarias y de integración | 3 | T2.4 | Test de todos los endpoints y validaciones |

### Hitos
- **Fin de T2.1**: Diseño aprobado
- **Fin de T2.2**: Tipos de evento funcionales
- **Fin de T2.3**: CRUD completo de eventos
- **Fin de T2.4**: Todas las validaciones implementadas
- **Fin de T2.5**: Módulo listo para integración

---

## 9. Estrategia de Verificación

### Tipo de Pruebas
- **Unitarias**: Lógica de validación de fechas/cupos
- **Integración**: Conexión a BD, endpoints REST
- **Aceptación**: Usuario final (organizador)

### Alcance de Pruebas
- Creación, edición, cancelación de eventos
- Validación de email único (solo registro)
- Validación de cupos y fechas límite
- Estados de eventos
- Permisos por rol (organizador)

### Criterios de Aceptación
- ✅ Todos los endpoints responden con códigos HTTP correctos
- ✅ Funcionalidades cumplen con requisitos definidos
- ✅ No hay vulnerabilidades de seguridad
- ✅ Validaciones de reglas de negocio funcionan correctamente
- ✅ Base de datos mantiene integridad referencial

### Criterios de Rechazo
- ❌ Permite fecha límite de inscripción > fecha de inicio
- ❌ Permite cupo máximo < cupo mínimo
- ❌ Permite editar evento con inscripciones cuando RN lo prohíbe
- ❌ Usuario no organizador puede editar/cancelar evento ajeno
- ❌ Evento cancelado aparece en catálogo público
- ❌ No se actualiza count de inscritos al editar cupos

### Casos de Prueba

#### CP1: Crear evento con validación de fechas
- **Prerrequisitos**: Usuario autenticado como organizador
- **Pasos**:
  1. Intentar crear evento con fecha_inicio <= fecha_creacion
  2. Intentar crear evento con fecha_limite_inscripcion >= fecha_inicio
  3. Crear evento con fechas válidas
- **Resultado Esperado**: 
  - Pasos 1-2: Error 400 con mensaje descriptivo
  - Paso 3: Evento creado con estado ACTIVO

#### CP2: Crear evento con validación de cupos
- **Prerrequisitos**: Usuario autenticado
- **Pasos**:
  1. Crear evento con cupo_maximo < cupo_minimo
  2. Crear evento con cupo_maximo >= cupo_minimo
  3. Crear evento solo con cupo_maximo
- **Resultado Esperado**:
  - Paso 1: Error 400
  - Pasos 2-3: Éxito 201

#### CP3: Editar evento sin inscripciones
- **Prerrequisitos**: Evento existente sin inscripciones
- **Pasos**:
  1. Usuario organizador edita título
  2. Usuario organizador edita fecha_inicio
- **Resultado Esperado**: 
  - Ambos cambios permitidos, respuesta 200

#### CP4: Editar evento CON inscripciones confirmadas
- **Prerrequisitos**: Evento con ≥1 inscripción confirmada
- **Pasos**:
  1. Intentar editar fecha_inicio
  2. Editar solo título (sin fechas)
- **Resultado Esperado**:
  - Paso 1: Error 409 "EVENTO_CON_INSCRIPCIONES"
  - Paso 2: Éxito 200

#### CP5: Cancelar evento
- **Prerrequisitos**: Evento activo
- **Pasos**:
  1. Organizador cancela evento
  2. Verificar estado en BD
  3. Intentar listar evento en catálogo
- **Resultado Esperado**:
  - Paso 1: Respuesta 204
  - Paso 2: Estado = "CANCELADO"
  - Paso 3: No aparece en listado público

#### CP6: Intento de edición por no-organizador
- **Prerrequisitos**: Evento creado por usuario A
- **Pasos**:
  1. Usuario B intenta editar evento
- **Resultado Esperado**: 
  - Error 403 "NO_AUTORIZADO"

#### CP7: Listar eventos con filtros
- **Prerrequisitos**: Múltiples eventos en BD
- **Pasos**:
  1. Listar eventos ACTIVOS
  2. Listar eventos de tipo "Curso"
  3. Listar eventos con paginación
- **Resultado Esperado**:
  - Paso 1: Solo eventos con estado=ACTIVO
  - Paso 2: Solo eventos con id_tipo_evento=Curso
  - Paso 3: Respeta page y limit

---

## 10. Notas de Implementación

### Seguridad
- Validar autenticación en todos los endpoints de modificación
- Validar autorización (solo organizador puede editar/cancelar)
- Usar consultas parametrizadas para prevenir SQL injection
- Validar todos los parámetros de entrada

### Rendimiento
- Crear índices en `fecha_inicio`, `estado`, `id_tipo_evento`
- Implementar paginación para listado de eventos
- Cachear tipos de evento (cambian raramente)
- Usar transacciones para operaciones que modifican múltiples tablas

### Auditoría
- Registrar quién creó el evento
- Registrar cambios importantes (cancelación, edición de cupos)
- Registrar timestamp de cada operación

### Integración Futura
- Sistema de notificaciones para cambios de estado
- Hooks para sincronizar con catálogo público
- Integración con sistema de permisos por rol

---

## 11. Referencias y Documentos Relacionados

- **Project.md**: Especificación general del proyecto
- **Contract.md**: Contratos REST entre módulos
- **Módulo 3 - Inscripciones**: Depende de validaciones de eventos
- **Módulo 7 - Informes y Agendas**: Genera reportes basados en eventos

