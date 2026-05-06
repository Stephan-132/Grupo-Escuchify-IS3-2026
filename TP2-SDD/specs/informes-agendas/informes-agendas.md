# Especificación del Módulo: Informes y Agendas

## 📋 Información General
- **Nombre del Módulo**: Informes y Agendas
- **Versión**: 1.0.0
- **Última Actualización**: Mayo 2026
- **Estado**: Especificación Completa

---

## 1. Objetivo y Contexto

### Objetivo
Generar y administrar informes de eventos (inscripciones, encuestas) y agendas con cronograma de actividades. Este módulo proporciona la capacidad de que organizadores analicen la demanda y resultados de sus eventos, así como que participantes visualicen el cronograma de actividades de forma clara y organizada.

### Contexto
- Los informes son documentos que resumen la información de un evento
- Hay dos tipos de informes: inscripciones y resultados de encuestas
- Las agendas muestran el cronograma de actividades de un evento
- Los informes pueden exportarse a formato PDF o Excel
- Las agendas son públicas para eventos ACTIVO y FINALIZADO
- Los informes de inscripciones solo son accesibles para organizadores
- Se requiere integración con múltiples módulos (Gestión de Eventos, Inscripciones, Encuestas, Certificados)

### Importancia
Este módulo es crítico para:
- **Organizadores**: Entender la demanda y feedback de sus eventos
- **Participantes**: Conocer el cronograma de actividades
- **Análisis**: Evaluar el éxito y la satisfacción de los eventos académicos

---

## 2. Responsabilidades del Módulo

- Generar informes de inscripciones por evento (totales, acreditados, cancelados)
- Generar informes de resultados de encuestas (promedios, comentarios destacados)
- Crear y gestionar agendas de eventos con cronograma de actividades
- Exportar informes a formato PDF y Excel
- Validar permisos de organizador para acceso a informes
- Validar restricciones de estado de evento (finalizado, cancelado, etc.)
- Mostrar agendas públicamente para eventos activos y finalizados
- Integrar datos de múltiples módulos

---

## 3. Historias de Usuario

### HU-1: Generar Informe de Inscripciones
**Como organizador, quiero generar un informe de inscripciones de un evento, para conocer la demanda.**

**Criterios de Aceptación:**
- El informe incluye total de inscritos, acreditados, cancelados
- El informe incluye lista detallada de participantes con sus estados
- El informe se genera solo para eventos existentes
- Solo el organizador del evento puede generar este informe
- Se registra la fecha y hora de generación del informe
- El informe se puede exportar a PDF o Excel

**Ejemplos:**
- Generar informe para "Curso Python Avanzado" con 25 inscritos, 20 acreditados, 2 cancelados
- Intentar generar informe para evento ajeno → Error 403 (No autorizado)
- Exportar informe a Excel → Archivo descargable

---

### HU-2: Ver Agenda de Evento
**Como participante, quiero ver la agenda de un evento, para conocer el cronograma de actividades.**

**Criterios de Aceptación:**
- La agenda se muestra públicamente para eventos activos y finalizados
- La agenda incluye horarios, títulos de charlas y disertantes
- Las actividades están ordenadas por hora de inicio
- Se valida que no haya solapamientos de horarios
- Los disertantes están identificados con nombre y rol
- La agenda NO se muestra para eventos cancelados

**Ejemplos:**
- Ver agenda de "Congreso 2026" con 3 charlas (09:00-10:30, 10:45-12:15, 13:00-14:30)
- Intentar ver agenda de evento cancelado → Error 400
- Agenda muestra disertantes correctamente identificados

---

### HU-3: Generar Informe de Resultados de Encuestas
**Como organizador, quiero generar un informe de resultados de encuestas, para evaluar la satisfacción del evento.**

**Criterios de Aceptación:**
- El informe se genera solo para eventos finalizados
- El informe incluye promedios de satisfacción por pregunta
- El informe incluye comentarios destacados de participantes
- El informe solo se genera si la encuesta está cerrada
- Solo el organizador del evento puede generar este informe
- Se registra la fecha y hora de generación del informe

**Ejemplos:**
- Generar informe para evento finalizado con encuesta cerrada
- Intentar generar para evento no finalizado → Error 409 (Evento no finalizado)
- Informe muestra promedios de satisfacción (4.2/5, 4.5/5, etc.)

---

## 4. Requisitos Funcionales y Reglas de Negocio

### Requisitos Funcionales (RF)

| ID | Descripción |
|----|-------------|
| RF1 | El sistema debe generar informes de inscripciones por evento con totales y lista detallada. |
| RF2 | El sistema debe generar agendas de eventos con cronograma de actividades, horarios y disertantes. |
| RF3 | El sistema debe generar informes de resultados de encuestas con promedios y comentarios destacados. |

### Reglas de Negocio (RN)

| ID | Descripción |
|----|-------------|
| RN1 | Los informes de inscripciones solo son accesibles para el organizador del evento. |
| RN2 | Las agendas se muestran públicamente para eventos con estado ACTIVO o FINALIZADO. |
| RN3 | Los informes de encuestas solo se generan para eventos con encuestas cerradas y estado FINALIZADO. |

---

## 5. Modelo de Datos

### Entidad: Informe

Define los informes generados para eventos.

| Atributo | Tipo de dato | Restricciones | PK/FK | Descripción |
|----------|--------------|---------------|-------|-------------|
| id_informe | INT | NOT NULL AUTO_INCREMENT | PK | Identificador único |
| id_evento | INT | NOT NULL | FK (Evento.id_evento) | Referencia al evento |
| tipo_informe | VARCHAR(50) | NOT NULL | | Tipo: INSCRIPCIONES, ENCUESTAS |
| fecha_generacion | DATETIME | NOT NULL DEFAULT CURRENT_TIMESTAMP | | Fecha y hora de generación |
| contenido | TEXT | NOT NULL | | Datos JSON con contenido del informe |

**Relaciones:**
- N:1 Informe → Evento (referencia: Evento.id_evento PK)

**Restricciones en la BD:**
```sql
CONSTRAINT CHK_tipo_informe CHECK (tipo_informe IN (''INSCRIPCIONES'', ''ENCUESTAS''))
CREATE INDEX idx_informe_evento ON Informe(id_evento)
CREATE INDEX idx_informe_fecha ON Informe(fecha_generacion)
```

**Estructura de contenido JSON para INSCRIPCIONES:**
```json
{
  "total_inscritos": 25,
  "total_acreditados": 20,
  "total_cancelados": 2,
  "total_pendientes": 3,
  "participantes": [
    {
      "id_usuario": 1,
      "nombre": "Juan Pérez",
      "email": "juan@example.com",
      "estado": "CONFIRMADA",
      "acreditado": true,
      "fecha_inscripcion": "2026-06-01"
    }
  ]
}
```

**Estructura de contenido JSON para ENCUESTAS:**
```json
{
  "total_respuestas": 18,
  "promedio_general": 4.3,
  "preguntas": [
    {
      "id_pregunta": 1,
      "texto": "¿Cómo fue la calidad del contenido?",
      "promedio": 4.5,
      "respuestas_count": 18
    }
  ],
  "comentarios_destacados": [
    "Excelente contenido y excelente disertante",
    "Muy bien organizado",
    "Recomendaría este evento"
  ]
}
```

---

### Entidad: AgendaEvento

Define las actividades y cronograma de un evento.

| Atributo | Tipo de dato | Restricciones | PK/FK | Descripción |
|----------|--------------|---------------|-------|-------------|
| id_agenda | INT | NOT NULL AUTO_INCREMENT | PK | Identificador único |
| id_evento | INT | NOT NULL | FK (Evento.id_evento) | Referencia al evento |
| hora_inicio | TIME | NOT NULL | | Hora de inicio de la actividad |
| hora_fin | TIME | NOT NULL | | Hora de finalización de la actividad |
| titulo_actividad | VARCHAR(255) | NOT NULL | | Título de la charla/actividad |
| id_disertante | INT | | FK (Usuario.id_usuario) | Usuario que dicta la actividad (opcional) |

**Relaciones:**
- N:1 AgendaEvento → Evento (referencia: Evento.id_evento PK)
- N:1 AgendaEvento → Usuario (referencia: Usuario.id_usuario PK, para disertante)

**Restricciones en la BD:**
```sql
CONSTRAINT CHK_horario CHECK (hora_fin > hora_inicio)
CREATE INDEX idx_agenda_evento ON AgendaEvento(id_evento)
CREATE INDEX idx_agenda_hora ON AgendaEvento(hora_inicio)
```

**Validaciones:**
- Las horas de inicio/fin no pueden solaparse con otras actividades del mismo evento
- El disertante (si está asignado) debe estar inscrito en el evento
- Solo puede haber una actividad por cada franja horaria

---

## 6. Interfaces REST (API Contract)

### Base Path
```
/api/v1
```

### Endpoints

#### 6.1 Generar Informe

##### POST /informes
**Generar informe de evento**

**Request:**
```json
{
  "id_evento": 5,
  "tipo_informe": "INSCRIPCIONES"
}
```

**Response (201 - Creado):**
```json
{
  "id_informe": 1,
  "id_evento": 5,
  "tipo_informe": "INSCRIPCIONES",
  "fecha_generacion": "2026-05-15T14:30:00Z",
  "url_descarga": "/api/v1/informes/1/exportar"
}
```

**Validaciones:**
- Evento debe existir
- Usuario debe ser organizador del evento
- Para ENCUESTAS: evento debe estar finalizado y encuesta cerrada
- tipo_informe debe ser INSCRIPCIONES o ENCUESTAS

**Códigos HTTP:**
- `201` Informe generado exitosamente
- `400` Error de validación o evento no finalizado
- `403` No autorizado (no es organizador)
- `404` Evento no encontrado
- `409` Encuesta no cerrada (para tipo ENCUESTAS)

---

#### 6.2 Exportar Informe

##### GET /informes/{id_informe}/exportar
**Exportar informe a PDF o Excel**

**Query Parameters:**
- `formato` (requerido): pdf | excel

**Request Example:**
```
GET /informes/1/exportar?formato=pdf
```

**Response (200 - OK):**
```
Content-Type: application/pdf (o application/vnd.ms-excel)
Content-Disposition: attachment; filename="informe_1.pdf"

[Archivo binario]
```

**Estructura del archivo PDF/Excel:**
- Encabezado con información del evento (título, fecha, organizador)
- Fecha de generación del informe
- Tabla con datos según tipo de informe
- Pie de página con número de página y total

**Validaciones:**
- Informe debe existir
- Usuario debe ser organizador del evento al que pertenece el informe
- Formato debe ser pdf o excel

**Códigos HTTP:**
- `200` OK - Archivo generado
- `400` Parámetro formato inválido
- `403` No autorizado
- `404` Informe no encontrado

---

#### 6.3 Crear/Actualizar Agenda

##### POST /agendas
**Crear agenda de evento**

**Request:**
```json
{
  "id_evento": 5,
  "actividades": [
    {
      "hora_inicio": "09:00",
      "hora_fin": "10:30",
      "titulo_actividad": "Charla de Apertura",
      "id_disertante": 1
    },
    {
      "hora_inicio": "10:45",
      "hora_fin": "12:15",
      "titulo_actividad": "Workshop Práctico",
      "id_disertante": 2
    }
  ]
}
```

**Response (201 - Creado):**
```json
{
  "id_evento": 5,
  "actividades_creadas": 2,
  "mensaje": "Agenda creada exitosamente"
}
```

**Validaciones:**
- Evento debe existir y no estar cancelado
- Usuario debe ser organizador del evento
- Horarios no deben solaparse
- hora_fin > hora_inicio
- Disertantes deben estar inscritos en el evento
- No puede haber más de una agenda por evento (se actualiza si existe)

**Códigos HTTP:**
- `201` Agenda creada exitosamente
- `204` Agenda actualizada exitosamente
- `400` Error de validación (solapamientos, formato, etc.)
- `403` No autorizado
- `404` Evento no encontrado
- `409` Evento cancelado

---

#### 6.4 Obtener Agenda Pública

##### GET /eventos/{id_evento}/agenda
**Obtener agenda de evento**

**Response (200 - OK):**
```json
{
  "id_evento": 5,
  "titulo_evento": "Congreso Tecnología 2026",
  "fecha_evento": "2026-06-15",
  "actividades": [
    {
      "hora_inicio": "09:00",
      "hora_fin": "10:30",
      "titulo_actividad": "Charla de Apertura",
      "disertante": {
        "nombre": "Dr. Juan Pérez",
        "titulo": "Especialista en IA"
      }
    },
    {
      "hora_inicio": "10:45",
      "hora_fin": "12:15",
      "titulo_actividad": "Workshop Práctico",
      "disertante": {
        "nombre": "Ing. María García",
        "titulo": "Ingeniera de Software"
      }
    }
  ]
}
```

**Validaciones:**
- Evento debe existir
- Evento debe estar en estado ACTIVO o FINALIZADO (no CANCELADO)
- No requiere autenticación
- No requiere que sea organizador

**Códigos HTTP:**
- `200` OK
- `400` Evento cancelado
- `404` Evento no encontrado o no tiene agenda

---

## 7. Dependencias

### Módulos que Este Depende De

| Módulo | Interfaz Consumida | Datos Utilizados |
|--------|-------------------|------------------|
| **Gestión de Eventos** | GET /eventos/{id_evento} | Información del evento (título, fecha, estado) |
| **Inscripciones** | GET /inscripciones?id_evento={id} | Lista de inscritos, estados, cancelaciones |
| **Encuestas** | GET /encuestas?id_evento={id} | Resultados de encuestas, promedios, comentarios |
| **Certificados** | GET /certificados?id_evento={id} | Datos de certificados generados |
| **Usuarios y Autenticación** | GET /usuarios/{id_usuario} | Información de disertantes, organizadores |

### Flujo de Datos

```
1. Informe de Inscripciones:
   Gestión Eventos → Validar evento
   Inscripciones → Obtener lista de inscritos
   Usuarios → Obtener datos de participantes
   → Generar informe

2. Informe de Encuestas:
   Gestión Eventos → Validar evento finalizado
   Encuestas → Obtener resultados, promedios
   → Generar informe

3. Agenda:
   Gestión Eventos → Validar evento
   Usuarios → Obtener datos de disertantes
   → Generar/actualizar agenda
```

---

## 8. Plan de Tareas

### Módulo 7: Informes y Agendas (Total: 9 días hábiles)

| ID | Tarea | Días | Dependencias | Descripción |
|----|-------|------|--------------|-------------|
| T7.1 | Diseño y documentación de entidades y endpoints | 2 | Ninguna | Finalizar diseño BD, documentar API REST |
| T7.2 | Desarrollo de generación de informes | 3 | T7.1 | Endpoints POST /informes, integración con Inscripciones y Encuestas |
| T7.3 | Desarrollo de creación de agendas | 2 | T7.1, T7.2 | Endpoints POST/GET /agendas, validación de solapamientos |
| T7.4 | Pruebas unitarias y de integración | 2 | T7.3 | Test de todos los endpoints y validaciones |

### Desglose Detallado

#### T7.1: Diseño y Documentación (2 días)
- **Día 1**: 
  - Diseño de entidades Informe y AgendaEvento
  - Diseño de índices BD
  - Validación de restricciones
- **Día 2**:
  - Documentación de endpoints
  - Esquemas JSON
  - Matriz de dependencias

#### T7.2: Generación de Informes (3 días)
- **Día 1**: 
  - Endpoint POST /informes básico
  - Lógica de generación de informe INSCRIPCIONES
  - Integración con módulo Inscripciones
- **Día 2**:
  - Lógica de generación de informe ENCUESTAS
  - Integración con módulo Encuestas
  - Validaciones de permisos y estado
- **Día 3**:
  - Exportación a PDF
  - Exportación a Excel
  - Endpoint GET /informes/{id_informe}/exportar

#### T7.3: Agendas (2 días)
- **Día 1**:
  - Endpoint POST /agendas
  - Validación de solapamientos
  - Validación de disertantes
- **Día 2**:
  - Endpoint GET /eventos/{id_evento}/agenda
  - Integración con módulo Usuarios
  - Formateo de respuesta pública

#### T7.4: Pruebas (2 días)
- **Día 1**: Pruebas unitarias de lógica de validación
- **Día 2**: Pruebas de integración, casos de uso completos

### Hitos Clave
- **Fin T7.1**: Diseño y documentación aprobados
- **Fin T7.2**: Informes y exportación funcionales
- **Fin T7.3**: Agendas públicas funcionales
- **Fin T7.4**: Módulo listo para integración

---

## 9. Estrategia de Verificación

### Tipo de Pruebas
- **Unitarias**: Lógica de generación de informes, cálculo de promedios, validación de solapamientos
- **Integración**: Consumo de datos de otros módulos, exportación de archivos
- **Aceptación**: Organizador generando informes, participante viendo agenda

### Alcance de Pruebas
- Generación de informes de inscripciones
- Generación de informes de encuestas
- Exportación a PDF y Excel
- Creación y actualización de agendas
- Visualización pública de agendas
- Validaciones de permisos y restricciones
- Validación de solapamientos de horarios

### Criterios de Aceptación
- ✅ Informes incluyen todos los datos especificados
- ✅ Informe de inscripciones contiene total de inscritos, acreditados, cancelados
- ✅ Informe de encuestas contiene promedios y comentarios destacados
- ✅ Agendas se muestran correctamente en formato público
- ✅ Permisos se validan correctamente (solo organizador accede a informes)
- ✅ Archivos PDF y Excel generados son válidos
- ✅ No hay solapamientos en agendas
- ✅ Eventos cancelados no muestran agenda

### Criterios de Rechazo
- ❌ Informe de inscripciones incompleto (falta acreditados o cancelados)
- ❌ Usuario no-organizador puede generar/descargar informe
- ❌ Informe de encuestas para evento no finalizado
- ❌ Agenda muestra para evento cancelado
- ❌ Actividades solapadas en agenda
- ❌ Disertante no inscrito en evento aparece en agenda
- ❌ Archivo PDF/Excel corrupto o vacío
- ❌ Horarios no validados correctamente (hora_fin <= hora_inicio)

### Casos de Prueba Detallados

#### CP1: Generar Informe de Inscripciones
- **Prerrequisitos**: Evento existente con 25 inscritos, 20 acreditados, 2 cancelados
- **Pasos**:
  1. Organizador solicita generar informe INSCRIPCIONES
  2. Sistema obtiene datos de Inscripciones
  3. Sistema crea registro en tabla Informe
  4. Sistema retorna id_informe y URL de descarga
- **Resultado Esperado**: 
  - Respuesta 201
  - Informe contiene totales correctos
  - id_informe válido en respuesta

#### CP2: Intentar generar informe siendo no-organizador
- **Prerrequisitos**: Evento creado por usuario A, usuario B intenta acceder
- **Pasos**:
  1. Usuario B solicita generar informe para evento
- **Resultado Esperado**: 
  - Error 403 "NO_AUTORIZADO"

#### CP3: Generar informe de encuestas para evento no finalizado
- **Prerrequisitos**: Evento en estado ACTIVO con encuesta abierta
- **Pasos**:
  1. Organizador intenta generar informe ENCUESTAS
- **Resultado Esperado**: 
  - Error 409 "EVENTO_NO_FINALIZADO"

#### CP4: Exportar informe a PDF
- **Prerrequisitos**: Informe existente de tipo INSCRIPCIONES
- **Pasos**:
  1. Organizador solicita exportar a PDF
  2. Sistema genera archivo PDF
  3. Sistema retorna archivo binario
- **Resultado Esperado**: 
  - Respuesta 200
  - Content-Type: application/pdf
  - Archivo válido descargable

#### CP5: Exportar informe a Excel
- **Prerrequisitos**: Informe existente
- **Pasos**:
  1. Organizador solicita exportar a Excel
- **Resultado Esperado**: 
  - Respuesta 200
  - Content-Type: application/vnd.ms-excel
  - Archivo válido con datos formateados

#### CP6: Crear agenda sin solapamientos
- **Prerrequisitos**: Evento existente con 2 disertantes inscritos
- **Pasos**:
  1. Organizador crea agenda con 2 actividades (09:00-10:30, 10:45-12:15)
  2. Sistema valida horarios
  3. Sistema crea registro en AgendaEvento
- **Resultado Esperado**: 
  - Respuesta 201
  - Actividades creadas correctamente
  - Horarios no solapados

#### CP7: Intentar crear agenda con solapamientos
- **Prerrequisitos**: Evento existente
- **Pasos**:
  1. Organizador intenta crear agenda con actividades (09:00-10:30, 10:00-11:00)
- **Resultado Esperado**: 
  - Error 400 "HORARIOS_SOLAPADOS"

#### CP8: Obtener agenda pública
- **Prerrequisitos**: Evento ACTIVO con agenda creada
- **Pasos**:
  1. Usuario no autenticado solicita GET /eventos/5/agenda
  2. Sistema retorna agenda pública
- **Resultado Esperado**: 
  - Respuesta 200
  - Agenda contiene todas las actividades
  - Disertantes identificados correctamente
  - No requiere autenticación

#### CP9: Intentar obtener agenda de evento cancelado
- **Prerrequisitos**: Evento con estado CANCELADO y agenda creada
- **Pasos**:
  1. Usuario solicita obtener agenda
- **Resultado Esperado**: 
  - Error 400 "EVENTO_CANCELADO"

#### CP10: Validar disertante no inscrito en agenda
- **Prerrequisitos**: Usuario no inscrito en evento
- **Pasos**:
  1. Organizador intenta asignar usuario no inscrito como disertante
- **Resultado Esperado**: 
  - Error 400 "DISERTANTE_NO_INSCRITO"

---

## 10. Notas de Implementación

### Seguridad
- Validar autenticación en todos los endpoints de modificación
- Validar que usuario sea organizador del evento (para informes y agendas)
- Usar consultas parametrizadas para prevenir SQL injection
- Validar todos los parámetros de entrada (tipos, formatos, rangos)
- No exponer información personal de participantes a no-organizadores

### Rendimiento
- Crear índices en `id_evento`, `fecha_generacion`, `hora_inicio`
- Implementar caché para agendas (cambian raramente durante evento)
- Generar informes de forma asincrónica si tienen muchos datos
- Paginar lista de participantes en informes grandes (>1000 registros)
- Optimizar consultas que integren datos de múltiples módulos

### Auditoría
- Registrar quién generó cada informe (id_usuario, timestamp)
- Registrar descargas de informes (quién descargó, cuándo, formato)
- Registrar modificaciones de agendas (quién, cuándo, qué cambió)

### Exportación
- **PDF**: Usar librería pdfkit o similares
  - Estructura: encabezado + tabla de datos + pie de página
  - Incluir logo/branding de la institución si aplica
  - Margen estándar 2cm
  - Fuente legible (Arial 10pt o similar)

- **Excel**: Usar librería xlsx o csv
  - Columnas con headers descriptivos
  - Formato de datos según tipo de informe
  - Congelación de encabezados
  - Ancho automático de columnas

### Integración Futura
- Sistema de notificaciones: Avisar a participantes cuando agenda disponible
- Sincronización de calendario: Permitir descargar agenda en formato .ics
- Reportes gráficos: Dashboard visual de resultados de encuestas
- Análisis predictivo: Sugerir mejoras basadas en encuestas anteriores

---

## 11. Casos de Uso Completos

### Caso de Uso 1: Organizador genera informe de inscripciones y lo descarga

```
1. Organizador autenticado accede a detalles de evento
2. Sistema muestra botón "Generar Informe"
3. Organizador hace clic en botón
4. Sistema:
   - Obtiene lista de inscritos de módulo Inscripciones
   - Calcula totales (inscritos, acreditados, cancelados)
   - Genera registro en tabla Informe
   - Retorna id_informe
5. Sistema muestra enlace de descarga
6. Organizador hace clic en "Descargar como PDF"
7. Sistema:
   - Obtiene datos del informe
   - Genera archivo PDF
   - Retorna archivo binario
8. Navegador descarga archivo "informe_1.pdf"
```

### Caso de Uso 2: Participante visualiza agenda del evento

```
1. Participante accede a página de evento (sin autenticación)
2. Sistema obtiene evento de módulo Gestión de Eventos
3. Sistema valida que evento esté ACTIVO o FINALIZADO
4. Sistema obtiene agenda de tabla AgendaEvento
5. Sistema obtiene datos de disertantes de módulo Usuarios
6. Sistema formatea agenda pública:
   - Horarios de inicio y fin
   - Títulos de actividades
   - Nombres y títulos de disertantes
7. Sistema retorna agenda formateada
8. Participante visualiza cronograma completo
```

### Caso de Uso 3: Organizador crea agenda de evento

```
1. Organizador autenticado accede a detalles de evento
2. Sistema muestra formulario "Crear Agenda"
3. Organizador ingresa:
   - Actividad 1: "Charla Inaugural" (09:00-10:30) - Disertante: Dr. A
   - Actividad 2: "Workshop" (10:45-12:15) - Disertante: Ing. B
4. Sistema valida:
   - Evento existe y no está cancelado
   - Usuario es organizador
   - Horarios no solapan
   - Disertantes están inscritos
5. Sistema crea registros en AgendaEvento
6. Sistema retorna confirmación
7. Agenda es inmediatamente visible a públicos
```

---

## 12. Referencias y Documentos Relacionados

- **Project.md**: Especificación general del proyecto
- **Contract.md**: Contratos REST entre módulos
- **Módulo 2 - Gestión de Eventos**: Proporciona datos e informes de eventos
- **Módulo 3 - Inscripciones**: Proporciona lista de participantes
- **Módulo 5 - Encuestas**: Proporciona resultados de encuestas
- **Módulo 6 - Certificados**: Puede incluirse en informes

---

## 13. Matriz de Responsabilidades

### Quién Puede Hacer Qué

| Acción | Usuario Autenticado | Organizador | No Autenticado |
|--------|-------------------|-------------|-----------------|
| Generar Informe Inscripciones | ❌ | ✅ | ❌ |
| Generar Informe Encuestas | ❌ | ✅ | ❌ |
| Descargar Informe | ❌ | ✅ | ❌ |
| Crear Agenda | ❌ | ✅ | ❌ |
| Ver Agenda Pública | ✅ | ✅ | ✅ |
| Listar Informes del Evento | ❌ | ✅ | ❌ |

---

## 14. Validaciones Clave

### Validaciones de Estado

```
Para generar informe INSCRIPCIONES:
  Evento.estado ∈ {ACTIVO, FINALIZADO}

Para generar informe ENCUESTAS:
  Evento.estado = FINALIZADO
  AND Encuesta.fecha_cierre <= NOW()

Para crear/actualizar agenda:
  Evento.estado ∈ {ACTIVO}

Para ver agenda pública:
  Evento.estado ∈ {ACTIVO, FINALIZADO}
```

### Validaciones de Solapamiento

```
Para cada actividad en agenda:
  NO EXISTE otra actividad con:
    (hora_inicio_nueva >= hora_inicio_existente 
     AND hora_inicio_nueva < hora_fin_existente)
    OR
    (hora_fin_nueva > hora_inicio_existente 
     AND hora_fin_nueva <= hora_fin_existente)
```

### Validaciones de Permisos

```
Para POST /informes:
  Usuario.id = Evento.id_organizador

Para POST /agendas:
  Usuario.id = Evento.id_organizador

Para GET /informes/{id}/exportar:
  Usuario.id = Evento.id_organizador

Para GET /eventos/{id}/agenda:
  No requiere autenticación
```
