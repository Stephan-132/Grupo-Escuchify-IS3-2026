# Especificación: Módulo Roles y Acreditación

## Índice

1. [Introducción](#1-introducción)
2. [Historias de Usuario](#2-historias-de-usuario)
3. [Requisitos Funcionales](#3-requisitos-funcionales)
4. [Reglas de Negocio](#4-reglas-de-negocio)
5. [Modelo de Datos](#5-modelo-de-datos)
6. [API Endpoints](#6-api-endpoints)
7. [Plan de Tareas](#7-plan-de-tareas)
8. [Estrategia de Verificación](#8-estrategia-de-verificación)

---

## 1. Introducción

**Módulo:** Roles y Acreditación

**Descripción:** Gestión de roles (organizador/participante/disertante) y acreditación de participantes.

**Entidades originales:** `Rol`, `Acreditación`

---

## 2. Historias de Usuario

### HU-4.1: Asignación de Roles a Participantes

**Como** organizador, **quiero** asignar roles a los participantes de un evento, **para** definir sus permisos.

**Criterios de Aceptación:**
- Se pueden asignar roles de organizador, participante o disertante
- Un usuario puede tener múltiples roles en diferentes eventos

---

### HU-4.2: Acreditación de Participantes

**Como** personal del evento, **quiero** acreditar a un participante en la entrada del evento, **para** validar su asistencia.

**Criterios de Aceptación:**
- La acreditación marca al participante como presente
- Se valida que el usuario esté inscrito y el evento esté en curso

---

### HU-4.3: Consulta de Lista de Acreditados

**Como** disertante, **quiero** ver la lista de participantes acreditados, **para** conocer mi audiencia.

**Criterios de Aceptación:**
- Solo los disertantes y organizadores del evento pueden acceder a la lista de acreditados

---

## 3. Requisitos Funcionales

| ID   | Descripción |
|------|-------------|
| RF-4.1 | El sistema debe permitir asignar roles (organizador/participante/disertante) a usuarios por evento |
| RF-4.2 | El sistema debe permitir la acreditación de participantes en el evento |
| RF-4.3 | El sistema debe listar participantes acreditados por evento |

---

## 4. Reglas de Negocio

| ID   | Descripción |
|------|-------------|
| RN-4.1 | Un usuario puede tener diferentes roles en diferentes eventos |
| RN-4.2 | Solo personal autorizado (organizadores) puede realizar acreditaciones |
| RN-4.3 | La acreditación solo es válida para usuarios con inscripción confirmada |

---

## 5. Modelo de Datos

### 5.1 Entidad: Rol

| Atributo   | Tipo        | Restricciones       | PK/FK |
|------------|-------------|---------------------|-------|
| id_rol     | INT         | NOT NULL, AUTO_INCREMENT | PK |
| nombre     | VARCHAR(50) | NOT NULL, UNIQUE    |       |

### 5.2 Entidad: Acreditación

| Atributo           | Tipo        | Restricciones                        | PK/FK |
|--------------------|-------------|--------------------------------------|-------|
| id_acreditacion    | INT         | NOT NULL, AUTO_INCREMENT             | PK    |
| id_inscripcion     | INT         | NOT NULL                             | FK → Inscripción.id_inscripcion |
| fecha_acreditacion | DATETIME    | NOT NULL, DEFAULT CURRENT_TIMESTAMP  |       |
| estado             | VARCHAR(20) | NOT NULL, DEFAULT 'PRESENTE'         |       |

### 5.3 Tabla Intermedia: Usuario_Evento_Rol

| Atributo                | Tipo   | Restricciones                    | PK/FK |
|-------------------------|--------|----------------------------------|-------|
| id_usuario_evento_rol   | INT    | NOT NULL, AUTO_INCREMENT         | PK    |
| id_usuario              | INT    | NOT NULL                         | FK → Usuario.id_usuario |
| id_evento               | INT    | NOT NULL                         | FK → Evento.id_evento |
| id_rol                  | INT    | NOT NULL                         | FK → Rol.id_rol |

**Restricción única:** UNIQUE (id_usuario, id_evento, id_rol)

### 5.4 Diagrama de Relaciones

```
Acreditación [N:1] → Inscripción
Usuario_Evento_Rol [N:1] → Usuario
Usuario_Evento_Rol [N:1] → Evento
Usuario_Evento_Rol [N:1] → Rol
```

---

## 6. API Endpoints

### 6.1 Roles

#### GET `/api/eventos/{idEvento}/roles`

Obtiene los roles disponibles.

**Autenticación:** Requerida

**Response 200:**
```json
{
  "roles": [
    { "id_rol": 1, "nombre": "ORGANIZADOR" },
    { "id_rol": 2, "nombre": "PARTICIPANTE" },
    { "id_rol": 3, "nombre": "DISERTANTE" }
  ]
}
```

#### POST `/api/eventos/{idEvento}/roles/asignar`

Asigna un rol a un usuario en un evento.

**Autenticación:** Requerida (Organizador del evento)

**Request Body:**
```json
{
  "id_usuario": 1,
  "id_rol": 3
}
```

**Response 201:**
```json
{
  "mensaje": "Rol asignado exitosamente",
  "id_usuario_evento_rol": 1
}
```

**Errores:**
- `400 USUARIO_NO_INSCRITO` - El usuario no está inscrito en el evento
- `403 SIN_PERMISO` - No tiene permisos para asignar roles

---

### 6.2 Acreditaciones

#### POST `/api/eventos/{idEvento}/acreditaciones`

Acredita a un participante en un evento.

**Autenticación:** Requerida (Organizador del evento)

**Request Body:**
```json
{
  "id_inscripcion": 1
}
```

**Response 201:**
```json
{
  "mensaje": "Participante acreditado exitosamente",
  "id_acreditacion": 1,
  "fecha_acreditacion": "2026-05-05T10:30:00Z"
}
```

**Errores:**
- `400 INSCRIPCION_NO_VALIDA` - La inscripción no existe o no está confirmada
- `400 EVENTO_NO_EN_CURSO` - El evento no está en curso
- `403 SIN_PERMISO` - No tiene permisos para acreditar

#### GET `/api/eventos/{idEvento}/acreditaciones`

Lista participantes acreditados de un evento.

**Autenticación:** Requerida (Organizador o Disertante del evento)

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Registros por página (default: 20)

**Response 200:**
```json
{
  "acreditados": [
    {
      "id_acreditacion": 1,
      "id_usuario": 1,
      "nombre": "Juan",
      "apellido": "Pérez",
      "fecha_acreditacion": "2026-05-05T10:30:00Z",
      "estado": "PRESENTE"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20
}
```

**Errores:**
- `403 SIN_PERMISO` - No tiene permisos para ver la lista

---

## 7. Plan de Tareas

**Total estimado:** 8 días hábiles

| # | Tarea | Duración |
|---|-------|----------|
| 1 | Diseño y documentación de entidades y endpoints | 2 días |
| 2 | Desarrollo de asignación de roles | 2 días |
| 3 | Desarrollo de acreditación de participantes | 2 días |
| 4 | Pruebas unitarias y de integración | 2 días |

---

## 8. Estrategia de Verificación

**Tipo de Prueba:** Unitarias (asignación de roles), Integración (BD), Aceptación (organizador)

**Alcance:** Asignación de roles, acreditación de participantes, listado de acreditados

**Criterio de Aceptación:** Roles se asignan correctamente; acreditación solo para inscritos.

**Criterio de Rechazo:** Permite asignar rol a usuario no inscrito; acreditación sin inscripción válida.

### Casos de Prueba

| # | Caso de Prueba | Resultado Esperado |
|---|----------------|-------------------|
| 1 | Asignar rol de disertante a usuario no inscrito | Error 400: `USUARIO_NO_INSCRITO` |
| 2 | Acreditar usuario no inscrito | Error 400: `INSCRIPCION_NO_VALIDA` |
| 3 | Listar acreditados | Lista solo con usuarios con acreditación confirmada |
