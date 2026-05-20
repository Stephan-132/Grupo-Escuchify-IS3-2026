### **[SEI] Análisis y Gestión de Riesgos**

El presente análisis de riesgo ha sido confeccionado para el **sistema Escuchify IS3 2026**. En particular, se ha optado por la evaluación de los **módulos funcionales del sistema de gestión de eventos académicos** (Usuarios/Autenticación, Gestión de Eventos, Inscripciones, Roles/Acreditación, Encuestas, Certificados, Informes/Agendas, Catálogo Público). El mismo ha sido confeccionado siguiendo los lineamientos de la metodología Software Risk Management (SRM) del Software Engineering Institute (SEI), es en base a esta selección que se ha estructurado el contenido del presente documento.

Se analizaron un total de **8 riesgos** correspondientes a los 8 módulos del sistema. De ellos, se seleccionaron los **2 de mayor magnitud de exposición** para desarrollar planes de gestión (acción y contingencia), y **4 riesgos adicionales de seguridad** para los cuales se definieron historias de usuario de gestión de riesgo.

---

**Inventario de activos a proteger**

*   Base de datos del sistema (PostgreSQL): datos de usuarios, eventos, inscripciones, certificados.
*   API REST (Node.js/Express): endpoints de los 8 módulos.
*   Frontend (React): aplicación cliente.
*   Credenciales y tokens JWT de usuarios.
*   Archivos generados: certificados PDF, informes PDF/Excel.
*   Código fuente del sistema.

---

**Objetivos**

*   Garantizar la confidencialidad, integridad y disponibilidad de los datos del sistema.
*   Asegurar que el control de acceso basado en roles funcione correctamente.
*   Prevenir la generación fraudulenta de certificados y la exposición de datos sensibles.
*   Mantener la consistencia de datos en operaciones concurrentes (inscripciones, eventos).
*   Cumplir con los requisitos de seguridad definidos en Project.md (bcrypt, HTTPS/TLS 1.2+, consultas parametrizadas).

---

**Equipo de trabajo**

*   **Analista de riesgos**: Kyasu
*   **Arquitecto de software**: Taikaros
*   **Líder técnico**: Taikaros
*   **Desarrolladores**: Equipo Escuchify IS3 2026

---

**Taxonomía de los riesgos**

| Identificador | Elemento | Riesgo | Vinculación del riesgo |
| ----- | ----- | ----- | ----- |
| R1 | Usuarios y Autenticación | Fuga de credenciales por ataque de fuerza bruta o falta de rate-limiting en el endpoint de login | Producto |
| R2 | Gestión de Eventos | Inconsistencia de datos por modificación concurrente de eventos sin control de concurrencia | Producto |
| R3 | Inscripciones | Condición de carrera en inscripciones simultáneas que excedan el cupo máximo del evento | Producto |
| R4 | Roles y Acreditación | Asignación no autorizada de roles por validación insuficiente del JWT en endpoints de asignación | Producto |
| R5 | Encuestas | Pérdida de respuestas de encuestas por fallo en la conexión a la base de datos sin transaccionalidad | Producto |
| R6 | Certificados | Generación fraudulenta de certificados sin verificar la acreditación real del usuario | Producto |
| R7 | Informes y Agendas | Timeout en generación de informes por consultas SQL no optimizadas para grandes volúmenes de datos | Producto |
| R8 | Catálogo Público | Exposición de datos sensibles (IDs internos, cupos, fechas no publicables) en endpoints públicos del catálogo | Producto |

---

**Declaración de los riesgos**

| R1 - Fuga de credenciales por ataque de fuerza bruta |
| :---- | :---- |
| Condición | No se implementa rate-limiting ni bloqueo por intentos fallidos en el endpoint de login |
| Consecuencia | Ataque de fuerza bruta exitoso, credenciales de usuario comprometidas |
| Efecto | Acceso no autorizado al sistema, pérdida de datos de usuarios, suplantación de identidad |

| R2 - Inconsistencia de datos por modificación concurrente |
| :---- | :---- |
| Condición | Múltiples usuarios (organizadores) modifican el mismo evento simultáneamente sin control de concurrencia (locks o versionado) |
| Consecuencia | Datos sobrescritos o inconsistentes en la base de datos (cupos, fechas, estado) |
| Efecto | Eventos con información incorrecta, cancelaciones indebidas, pérdida de confianza |

| R3 - Condición de carrera en inscripciones |
| :---- | :---- |
| Condición | Múltiples usuarios intentan inscribirse al mismo tiempo en un evento con cupo limitado sin bloqueo transaccional |
| Consecuencia | Se excede el cupo máximo del evento por falta de control de concurrencia en la validación de cupo disponible |
| Efecto | Evento con más asistentes de los permitidos, conflictos logísticos, sobreventa |

| R4 - Asignación no autorizada de roles |
| :---- | :---- |
| Condición | Validación insuficiente del JWT en los endpoints de asignación de roles (POST /api/eventos/{idEvento}/roles/asignar) |
| Consecuencia | Usuario sin permisos de organizador asigna roles administrativos a sí mismo o a otros |
| Efecto | Compromiso total del control de acceso basado en roles, usurpación de funciones críticas |

| R5 - Pérdida de respuestas de encuestas |
| :---- | :---- |
| Condición | Fallo en la conexión a la base de datos durante el envío de respuestas sin usar transacciones atómicas |
| Consecuencia | Respuestas de encuestas parcialmente almacenadas o perdidas |
| Efecto | Resultados de encuestas incompletos, decisiones basadas en datos erróneos, feedback inválido |

| R6 - Generación fraudulenta de certificados |
| :---- | :---- |
| Condición | No se verifica la acreditación real del usuario ni su inscripción activa antes de generar el certificado |
| Consecuencia | Usuarios obtienen certificados de asistencia/aprobación sin cumplir los requisitos |
| Efecto | Pérdida de validez académica de los certificados emitidos, daño reputacional |

| R7 - Timeout en generación de informes |
| :---- | :---- |
| Condición | Consultas SQL que integran datos de múltiples módulos (Inscripciones, Encuestas, Certificados) sin índices ni optimización |
| Consecuencia | Timeout del servidor, informes no generados, bloqueo de recursos |
| Efecto | Retrasos en la entrega de informes, usuarios frustrados, experiencia de usuario degradada |

| R8 - Exposición de datos sensibles |
| :---- | :---- |
| Condición | Endpoints públicos del catálogo devuelven campos internos del modelo Evento sin filtrar (id_evento interno, cupos, fechas límite) |
| Consecuencia | Datos sensibles expuestos en respuestas públicas accesibles sin autenticación |
| Efecto | Fuga de información estratégica, ventaja competitiva desleal, violación de privacidad |

---

**Estimación de la probabilidad**

| Rango de probabilidad | Promedio para el cálculo | Expresión de lenguaje natural | Valor numérico |
| :---: | :---: | :---: | :---: |
| de 1% a 10% | 5% | Baja | 1 |
| de 11 % a 25% | 18% | Poco probable | 2 |
| de 26% a 55% | 40% | Media | 3 |
| de 56% a 80% | 68% | Altamente probable | 4 |
| de 81% a 99% | 90% | Casi seguro | 5 |

---

**Estimación de probabilidad para cada riesgo**

| Identificador | Elemento | Expresión | Probabilidad |
| ----- | ----- | :---: | :---: |
| R1 | Fuga de credenciales por ataque de fuerza bruta | Media | 40% |
| R2 | Inconsistencia de datos por modificación concurrente | Media | 40% |
| R3 | Condición de carrera en inscripciones | Altamente probable | 68% |
| R4 | Asignación no autorizada de roles | Media | 40% |
| R5 | Pérdida de respuestas de encuestas | Poco probable | 18% |
| R6 | Generación fraudulenta de certificados | Poco probable | 18% |
| R7 | Timeout en generación de informes | Media | 40% |
| R8 | Exposición de datos sensibles | Media | 40% |

---

**Estimación del impacto**

| Criterio | Período en el que el proyecto se verá afectado | Valor numérico |
| :---: | :---: | :---: |
| Insignificante | Horas | 1 |
| Marginal | 1-2 días | 2 |
| Medio | 3-7 días | 3 |
| Crítico | 1-2 semanas | 4 |
| Catastrófico | Más de 2 semanas | 5 |

---

**Estimación del impacto para cada riesgo**

| Identificador | Riesgo | Impacto |
| ----- | ----- | :---: |
| R1 | Fuga de credenciales por ataque de fuerza bruta | Crítico (4) |
| R2 | Inconsistencia de datos por modificación concurrente | Medio (3) |
| R3 | Condición de carrera en inscripciones | Medio (3) |
| R4 | Asignación no autorizada de roles | Catastrófico (5) |
| R5 | Pérdida de respuestas de encuestas | Marginal (2) |
| R6 | Generación fraudulenta de certificados | Catastrófico (5) |
| R7 | Timeout en generación de informes | Marginal (2) |
| R8 | Exposición de datos sensibles | Medio (3) |

---

**Magnitud de exposición al riesgo**

Aprox. 1 = bajo riesgo.

Aprox. 2 = riesgo medio.

Aprox. 3 = alto riesgo

| Identificador | Riesgo | Impacto | Probabilidad | Exposición |
| ----- | ----- | ----- | ----- | ----- |
| R1 | Fuga de credenciales por ataque de fuerza bruta | Crítico (4) | 40% (3) | 12 |
| R2 | Inconsistencia de datos por modificación concurrente | Medio (3) | 40% (3) | 9 |
| R3 | Condición de carrera en inscripciones | Medio (3) | 68% (4) | 12 |
| R4 | Asignación no autorizada de roles | Catastrófico (5) | 40% (3) | 15 |
| R5 | Pérdida de respuestas de encuestas | Marginal (2) | 18% (2) | 4 |
| R6 | Generación fraudulenta de certificados | Catastrófico (5) | 18% (2) | 10 |
| R7 | Timeout en generación de informes | Marginal (2) | 40% (3) | 6 |
| R8 | Exposición de datos sensibles | Medio (3) | 40% (3) | 9 |

Los riesgos **R4** (Exposición: 15) y **R1** (Exposición: 12) presentan la mayor magnitud de exposición. Para ellos se desarrollan los planes de gestión a continuación.

---

**Planes de gestión de los riesgos**

La gestión de los riesgos se reconoce como un proceso continuo, por lo que el presente documento podría ser adaptado a medida que se avanza con su ejecución.

Se presentan los planes de acción (preventivos) y de contingencias (reactivos) para los riesgos cuya exposición fuera superior a los umbrales definidos en el análisis precedente.

---

### 1. R4 - Asignación no autorizada de roles

#### 1.1 Descripción de aspectos principales

| Importancia del riesgo | Alta - Exposición 15 (riesgo medio-alto) |
| :---- | :---- |
| **Información requerida para su seguimiento** | Logs de asignación de roles, auditoría de JWT emitidos, reportes semanales de roles asignados |
| **Responsable** | Líder técnico (Taikaros) |
| **Recursos necesarios** | Middleware de validación JWT, tests de autorización, herramientas de auditoría de logs |

#### 1.2 Plan de acción

1.  Implementar middleware de validación de JWT en el endpoint `POST /api/eventos/{idEvento}/roles/asignar` que verifique que el token pertenece a un organizador del evento específico antes de permitir la asignación.
2.  Agregar validación de pertenencia al evento: verificar que el usuario autenticado figure en `Usuario_Evento_Rol` con rol `ORGANIZADOR` para el `idEvento` solicitado.
3.  Incorporar auditoría de todas las asignaciones de roles: registrar en una tabla de logs `(id_usuario_actor, id_usuario_asignado, id_evento, id_rol, timestamp)` para trazabilidad.
4.  Escribir tests de integración que verifiquen que un usuario sin rol de organizador recibe error `403 SIN_PERMISO` al intentar asignar roles.

#### 1.3 Plan de contingencias

1.  Disparador: Se detecta una asignación de rol no autorizada en los logs de auditoría:
    1.  Bloquear inmediatamente el endpoint `POST /api/eventos/{idEvento}/roles/asignar` a nivel de API Gateway mientras se investiga.
    2.  Revisar los logs de auditoría para identificar el alcance: qué roles fueron asignados, por quién, y a qué eventos.
    3.  Revertir las asignaciones no autorizadas en base de datos mediante script de reparación.
    4.  Notificar a los organizadores de los eventos afectados sobre los cambios realizados.
    5.  Forzar el cierre de sesión de todos los usuarios involucrados y requerir cambio de contraseña.

---

### 2. R1 - Fuga de credenciales por ataque de fuerza bruta

#### 2.1 Descripción de aspectos principales

| Importancia del riesgo | Alta - Exposición 12 (riesgo medio) |
| :---- | :---- |
| **Información requerida para su seguimiento** | Intentos de login fallidos por IP/usuario, alertas de rate-limiting, reportes diarios de actividad sospechosa |
| **Responsable** | Arquitecto de software (Taikaros) |
| **Recursos necesarios** | Middleware de rate-limiting (express-rate-limit), sistema de bloqueo temporal de cuentas, logging de intentos fallidos |

#### 2.2 Plan de acción

1.  Implementar rate-limiting en el endpoint `POST /api/v1/auth/login` usando `express-rate-limit`: máximo 5 intentos fallidos por minuto por IP y 10 intentos fallidos por hora por usuario.
2.  Agregar bloqueo temporal de cuenta tras 5 intentos fallidos consecutivos: la cuenta se bloquea por 15 minutos y se notifica al usuario por email.
3.  Almacenar contraseñas con bcrypt (costo >= 10) y validar que la contraseña tenga mínimo 8 caracteres con mayúsculas, minúsculas y números según especificación del módulo de Usuarios y Autenticación.
4.  Escribir tests de seguridad que validen el rate-limiting y el bloqueo temporal de cuentas.

#### 2.3 Plan de contingencias

1.  Disparador: Se detecta un ataque de fuerza bruta exitoso (credenciales comprometidas) en los logs de seguridad:
    1.  Bloquear la(s) cuenta(s) comprometida(s) inmediatamente.
    2.  Revocar todos los tokens JWT activos asociados a esas cuentas.
    3.  Notificar a los usuarios afectados vía email con instrucciones para restablecer su contraseña.
    4.  Revisar los logs de acceso para determinar qué datos pudieron haber sido consultados o modificados.
    5.  Aumentar temporalmente la sensibilidad del rate-limiting (3 intentos por minuto) en todo el sistema.

---

### 3. Análisis de Historias de Usuario Existentes con Implicancia en Riesgos de Seguridad

A continuación se analizan las historias de usuario definidas en los specs de `TP2-SDD/specs/*`, identificando al menos una por cada módulo que tenga relación directa con riesgos de seguridad. Cada HU se vincula con el riesgo correspondiente del análisis SEI.

---

#### 3.1 Usuarios y Autenticación — HU2: Inicio de Sesión

**Historia de usuario** (extraída de `TP2-SDD/specs/usuario-autenticacion/usuarios-autenticacion.md`):

> **Como** usuario,
> **Quiero** iniciar sesión en la plataforma,
> **Para** acceder a mis inscripciones y datos personales.

**Criterio de aceptación relevante:** "El login con email y contraseña correctos genera un token de sesión y redirige al dashboard del usuario."

**Vinculación con riesgo R1 (Fuga de credenciales por ataque de fuerza bruta):**
Esta HU define el punto de entrada crítico del sistema. Si no se implementa rate-limiting, bloqueo por intentos fallidos y almacenamiento seguro de contraseñas con bcrypt (costo >= 10 según las restricciones técnicas del spec), el endpoint de login queda expuesto a ataques de fuerza bruta que comprometen las credenciales de los usuarios.

---

#### 3.2 Gestión de Eventos — HU-2: Editar Evento Existente

**Historia de usuario** (extraída de `TP2-SDD/specs/gestion-eventos/gestion-eventos.md`):

> **Como** organizador,
> **Quiero** editar un evento existente,
> **Para** modificar sus detalles o fechas.

**Criterio de aceptación relevante:** "Solo el organizador del evento puede editar sus datos. No se permite modificar fechas si ya hay inscripciones confirmadas. Se registra la auditoría del cambio."

**Vinculación con riesgo R2 (Inconsistencia de datos por modificación concurrente):**
Esta HU requiere control de acceso basado en el organizador creador. Si no se implementa una validación robusta del JWT y del rol del usuario (organizador vs. no organizador), cualquier usuario autenticado podría modificar o cancelar eventos ajenos, comprometiendo la integridad de los datos.

---

#### 3.3 Inscripciones — HU1: Inscripción Autónoma

**Historia de usuario** (extraída de `TP2-SDD/specs/inscripciones/inscripciones.md`):

> **Como** usuario autenticado,
> **Quiero** inscribirme de forma autónoma a un evento,
> **Para** participar en él.

**Criterio de aceptación relevante:** "La inscripción se registra si hay cupo disponible y no ha pasado la fecha límite; se genera confirmación automática."

**Vinculación con riesgo R3 (Condición de carrera en inscripciones):**
Esta HU valida cupo disponible, pero sin control de concurrencia transaccional (SELECT ... FOR UPDATE) dos o más usuarios podrían inscribirse simultáneamente superando el cupo máximo del evento. La seguridad aquí se manifiesta como integridad de datos: evitar la sobreventa de cupos.

---

#### 3.4 Roles y Acreditación — HU-4.1: Asignación de Roles

**Historia de usuario** (extraída de `TP2-SDD/specs/Modulacion_de_Especificaciones/roles-acreditacion.md`):

> **Como** organizador,
> **Quiero** asignar roles a los participantes de un evento,
> **Para** definir sus permisos.

**Criterio de aceptación relevante:** "Se pueden asignar roles de organizador, participante o disertante. Un usuario puede tener múltiples roles en diferentes eventos."

**Vinculación con riesgo R4 (Asignación no autorizada de roles):**
Esta HU define el mecanismo de control de acceso del sistema. Si el endpoint `POST /api/eventos/{idEvento}/roles/asignar` no valida correctamente que el usuario autenticado sea efectivamente un organizador del evento, cualquier participante podría autoconcederse el rol de organizador y obtener privilegios administrativos sobre el evento.

---

#### 3.5 Encuestas — HU2: Responder Encuesta

**Historia de usuario** (extraída de `TP2-SDD/specs/Encuestas/encuestas.md`):

> **Como** participante,
> **Quiero** responder la encuesta de un evento al que asistí,
> **Para** dar mi opinión.

**Criterio de aceptación relevante:** "Solo participantes acreditados pueden responder la encuesta. Se permite una sola respuesta por usuario por evento."

**Vinculación con riesgo R5 (Pérdida de respuestas de encuestas):**
Esta HU requiere integridad transaccional: si falla la conexión a la BD durante el envío de respuestas y no se usan transacciones atómicas, las respuestas se perderán parcialmente. Además, la restricción de "una respuesta por usuario" exige un correcto control de concurrencia para evitar respuestas duplicadas.

---

#### 3.6 Certificados — HU1: Generar Certificados de Asistencia

**Historia de usuario** (extraída de `TP2-SDD/specs/certificados/certificados.md`):

> **Como** organizador,
> **Quiero** generar certificados de asistencia para participantes acreditados,
> **Para** validar su participación.

**Criterio de aceptación relevante:** "El certificado se genera en formato PDF; incluye nombre del participante, evento, fecha y tipo de certificado. El certificado de asistencia solo se genera para participantes con acreditación confirmada (RN1)."

**Vinculación con riesgo R6 (Generación fraudulenta de certificados):**
Esta HU exige verificar la acreditación confirmada del usuario antes de generar el certificado. Si la validación de acreditación es omitida o está mal implementada, cualquier usuario podría obtener certificados de asistencia sin haber asistido al evento, comprometiendo la validez académica de todos los certificados emitidos por el sistema.

---

#### 3.7 Informes y Agendas — HU-1: Generar Informe de Inscripciones

**Historia de usuario** (extraída de `TP2-SDD/specs/informes-agendas/informes-agendas.md`):

> **Como** organizador,
> **Quiero** generar un informe de inscripciones de un evento,
> **Para** conocer la demanda.

**Criterio de aceptación relevante:** "Solo el organizador del evento puede generar este informe. Se registra la fecha y hora de generación del informe."

**Vinculación con riesgo R7 (Timeout en generación de informes):**
Esta HU implica consultas que integran datos de múltiples módulos (Inscripciones, Eventos). Para eventos con alta concurrencia (>1000 inscripciones), las consultas no optimizadas pueden provocar timeouts del servidor. La seguridad aquí se manifiesta como disponibilidad: un atacante podría saturar el sistema solicitando informes pesados para denegar el servicio a otros usuarios.

---

#### 3.8 Catálogo Público — HU1: Listado de Eventos Públicos

**Historia de usuario** (extraída de `TP2-SDD/specs/catalogo-publico/catalogo-publico.md`):

> **Como** usuario no autenticado,
> **Quiero** ver el listado de eventos públicos,
> **Para** encontrar eventos de interés.

**Criterio de aceptación relevante:** "El listado muestra todos los eventos activos con título, tipo, fecha y descripción breve."

**Vinculación con riesgo R8 (Exposición de datos sensibles):**
Esta HU define un endpoint público accesible sin autenticación. Si la respuesta no está correctamente filtrada mediante un DTO y expone campos internos del modelo Evento (IDs internos, cupos disponibles, fechas límite), se produce una fuga de información sensible. La seguridad debe garantizar que solo los campos explícitamente declarados (título, tipo, fecha, descripción) sean devueltos.

---

**Resumen de riesgos gestionados**

| Riesgo | Módulo | Exposición | Plan de Acción | Plan de Contingencia | HU del spec analizada |
| :---- | :---- | :---: | :---: | :---: | :---- |
| R4 | Roles y Acreditación | 15 | ✅ | ✅ | HU-4.1 Asignación de Roles |
| R1 | Usuarios y Autenticación | 12 | ✅ | ✅ | HU2 Inicio de Sesión |
| R3 | Inscripciones | 12 | — | — | HU1 Inscripción Autónoma |
| R6 | Certificados | 10 | — | — | HU1 Certificados de Asistencia |
| R8 | Catálogo Público | 9 | — | — | HU1 Listado de Eventos Públicos |
| R2 | Gestión de Eventos | 9 | — | — | HU-2 Editar Evento |
| R7 | Informes y Agendas | 6 | — | — | HU-1 Generar Informe |
| R5 | Encuestas | 4 | — | — | HU2 Responder Encuesta |

---

*Documento generado siguiendo la metodología SEI - Software Risk Management (SRM).*
