# Especificaciones del Módulo 5: Encuestas

## Descripción

Gestión de comentarios y encuestas de satisfacción post-evento. Este módulo permite a los organizadores crear encuestas para eventos finalizados y a los participantes acreditados responderlas para proporcionar feedback.

## Entidades

### Entidad: Encuesta

| Atributo | Tipo de dato | Restricciones | PK/FK |
|----------|--------------|---------------|-------|
| id_encuesta | INT | NOT NULL AUTO_INCREMENT | PK |
| id_evento | INT | NOT NULL | FK (Evento.id_evento) |
| titulo | VARCHAR(255) | NOT NULL | |
| fecha_apertura | DATETIME | NOT NULL DEFAULT CURRENT_TIMESTAMP | |
| fecha_cierre | DATETIME | | |

### Entidad: PreguntaEncuesta

| Atributo | Tipo de dato | Restricciones | PK/FK |
|----------|--------------|---------------|-------|
| id_pregunta | INT | NOT NULL AUTO_INCREMENT | PK |
| id_encuesta | INT | NOT NULL | FK (Encuesta.id_encuesta) |
| texto_pregunta | TEXT | NOT NULL | |
| tipo_pregunta | VARCHAR(20) | NOT NULL | |

### Entidad: RespuestaEncuesta

| Atributo | Tipo de dato | Restricciones | PK/FK |
|----------|--------------|---------------|-------|
| id_respuesta | INT | NOT NULL AUTO_INCREMENT | PK |
| id_pregunta | INT | NOT NULL | FK (PreguntaEncuesta.id_pregunta) |
| id_usuario | INT | NOT NULL | FK (Usuario.id_usuario) |
| respuesta | TEXT | NOT NULL | |
| fecha_respuesta | DATETIME | NOT NULL DEFAULT CURRENT_TIMESTAMP | |

## Relaciones

- 1:N Encuesta -> PreguntaEncuesta (Referencia: PreguntaEncuesta.id_encuesta FK)
- 1:N PreguntaEncuesta -> RespuestaEncuesta (Referencia: RespuestaEncuesta.id_pregunta FK)
- 1:N Encuesta -> Evento (Referencia: Evento.id_evento FK)
- N:1 RespuestaEncuesta -> Usuario (Referencia: Usuario.id_usuario PK)

## Historias de Usuario

### HU1: Crear encuesta de satisfacción

**Como** organizador, **quiero** crear una encuesta de satisfacción para un evento finalizado, **para** recibir feedback.

**Criterio de aceptación:**
- La encuesta se asocia al evento
- Se pueden agregar preguntas de opción múltiple o abiertas

### HU2: Responder encuesta

**Como** participante, **quiero** responder la encuesta de un evento al que asistí, **para** dar mi opinión.

**Criterio de aceptación:**
- Solo participantes acreditados pueden responder la encuesta
- Se permite una sola respuesta por usuario por evento

### HU3: Ver resultados de encuesta

**Como** organizador, **quiero** ver los resultados de la encuesta, **para** evaluar la satisfacción del evento.

**Criterio de aceptación:**
- Los resultados se muestran de forma agregada
- Se exportan a formato CSV si se solicita

## Requisitos Funcionales

- **RF1:** El sistema debe permitir crear encuestas asociadas a eventos finalizados.
- **RF2:** El sistema debe permitir agregar preguntas de opción múltiple y abiertas a las encuestas.
- **RF3:** El sistema debe permitir a participantes acreditados responder encuestas.

## Reglas de Negocio

- **RN1:** Solo participantes acreditados pueden responder encuestas del evento.
- **RN2:** Un participante solo puede responder una vez por evento.
- **RN3:** Las encuestas solo se habilitan después de la finalización del evento.

## Plan de Tareas

**Total: 8 días hábiles**

1. Diseño y documentación de entidades y endpoints: 2 días
2. Desarrollo de creación de encuestas y preguntas: 2 días
3. Desarrollo de respuestas a encuestas: 2 días
4. Pruebas unitarias y de integración: 2 días

## Estrategia de Verificación

- **Tipo de Prueba:** Unitarias (creación de encuestas), Integración (BD), Aceptación (organizador/participante)
- **Alcance:** Creación de encuestas, respuestas, visualización de resultados
- **Criterio de Aceptación:** Encuestas solo para eventos finalizados; respuestas solo para acreditados.
- **Criterio de Rechazo:** Permite responder encuesta sin acreditación; permite múltiples respuestas por usuario.

### Casos de Prueba de Ejemplo

1. Crear encuesta para evento no finalizado → Espera error 400 con mensaje "EVENTO_NO_FINALIZADO"
2. Responder encuesta sin acreditación → Espera error 400 con mensaje "NO_ACREDITADO"
3. Responder encuesta dos veces → Espera error 400 con mensaje "ENCUESTA_YA_RESPONDIDA"
