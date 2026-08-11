# Kirbill Tattoo Studio — Roadmap de Desarrollo

Fases incrementales. Cada fase produce un checkpoint funcional y commiteable.
Orden diseñado para minimizar bloqueos entre fases.

---

## Fase 0 — Scaffolding del Monorepo

**Objetivo:** Estructura base con tooling funcionando.

- [x] Inicializar monorepo con `package.json` root + `turbo.json` + `workspaces`
- [x] Crear `apps/api/` con `package.json`, `tsconfig.json`, entry point mínimo ElysiaJS
- [x] Crear `apps/web/` con Vite + React + TypeScript + Tailwind CSS v4
- [x] Crear `packages/shared/` con tipos base
- [x] Configurar `.gitignore`, `.env.example`
- [x] Configurar ESLint + Prettier (o Biome) compartido
- [x] Verificar que `bun run dev` levanta ambos servicios

**Checkpoint:** Monorepo compila, ambos servers corren en puertos distintos.

---

## Fase 1 — Backend Skeleton

**Objetivo:** Conexión a DB, modelos Mongoose, estructura de rutas, auth.

- [x] Configurar conexión a MongoDB (`db.ts`)
- [x] Crear modelos Mongoose: User, HeroImage, GalleryImage, Appointment, Payment, Conversation, Message
- [x] Crear seed script para usuario admin (`ADMIN_USERNAME` + bcrypt hash de `ADMIN_PASSWORD`)
- [x] Implementar `POST /api/auth/login` — cookie de sesión
- [x] Implementar `POST /api/auth/logout` + `GET /api/auth/me`
- [x] Middleware `auth.ts` — verifica cookie, protege rutas admin
- [x] Configurar CORS para `FRONTEND_URL`
- [x] Health check `GET /api/health`

**Checkpoint:** MongoDB conectado, login/logout funcional, seed crea admin.

---

## Fase 2 — Frontend Skeleton

**Objetivo:** Layouts, rutas, navbar, footer, diseño base.

- [x] Configurar Tailwind con tokens de DESIGN.md en `globals.css`
- [x] Cargar Space Grotesk desde Google Fonts
- [x] Crear `PublicLayout` — Navbar + `<Outlet />` + Footer
- [x] Crear `AdminLayout` — AdminSidebar + `<Outlet />`
- [x] Componente `SiteNavbar`: pill flotante, glass on scroll, links smooth scroll
- [x] Componente `Footer`: redes sociales (Instagram, Facebook, WhatsApp)
- [x] Definir rutas en `App.tsx`: `/` (HomePage), `/admin/login`, `/admin/*` (protegidas)
- [x] `useAuth` hook — verifica sesión, redirige si no autenticado
- [x] Placeholder `HomePage` con 3 secciones vacías
- [x] Placeholder `LoginPage`

**Checkpoint:** Navegación funcional, diseño oscuro aplicado, navbar/footer visibles.

---

## Fase 3 — Admin Login

**Objetivo:** Flujo de autenticación completo.

- [x] `LoginPage` con formulario (username + password)
- [x] `useAuth` hook — `login()`, `logout()`, `me()` contra `/api/auth/*`
- [x] Manejo de errores de login (credenciales inválidas, red)
- [x] Guard de rutas: redirige a `/admin/login` si no hay sesión
- [x] Redirige a `/admin/home` si ya está autenticado
- [x] Botón "Cerrar sesión" en admin sidebar

**Checkpoint:** Login completo, rutas protegidas funcionales.

---

## Fase 4 — Hero Section

**Objetivo:** Hero con Grainient background + carrusel de imágenes, admin CRUD.

**Frontend público:**
- [x] `GrainientHero`: componente con `<Grainient>` animado como fondo
- [x] `HeroCarousel`: carrusel de imágenes desde `/api/hero-images`
- [x] Imágenes de placeholder mientras no haya reales
- [x] Transiciones suaves entre slides

**API:**
- [x] `GET /api/hero-images` (público, ordenado)
- [x] `POST /api/hero-images` (admin, upload Vercel Blob)
- [x] `PUT /api/hero-images/:id` (admin, orden/activo)
- [x] `DELETE /api/hero-images/:id` (admin, borra Blob + DB)

**Admin:**
- [x] `HomeAdminPage`: grid de imágenes con drag & drop
- [x] `ImageUploader`: sube a Vercel Blob, muestra preview, guarda URL
- [x] Toggle activar/desactivar
- [x] Botón eliminar con confirmación

**Checkpoint:** Hero público muestra carrusel, admin puede gestionar imágenes.

---

## Fase 5 — Gallery Section

**Objetivo:** Drift wall mosaic con imágenes de trabajos, admin CRUD.

**Frontend público:**
- [x] `DriftGallery`: componente con drift-wall de reactbits
- [x] Imágenes desde `/api/gallery`
- [x] Cada imagen con título y categoría al hover
- [x] Placeholder images mientras no haya reales

**API:**
- [x] `GET /api/gallery` (público)
- [x] `POST /api/gallery` (admin, upload Vercel Blob)
- [x] `PUT /api/gallery/:id` (admin)
- [x] `DELETE /api/gallery/:id` (admin)

**Admin:**
- [x] Sección en `/admin/home` o página aparte para gestionar galería
- [x] `ImageUploader` + campos de título y categoría
- [x] Grid de imágenes con acciones (editar, eliminar)

**Checkpoint:** Gallery pública con drift wall, admin gestiona imágenes.

---

## Fase 6 — Contact Section + Chat (Público)

**Objetivo:** Sección de contacto con layout split y chat en tiempo real por WebSocket.

**Frontend:**
- [x] `ContactSection`: 1/4 izquierda (redes sociales) + 3/4 derecha (chat trigger)
- [x] `ChatPanel`: popup overlay glass, WebSocket chat
  - [x] Modal de ingreso de email + nombre antes de iniciar chat
  - [x] Conexión WebSocket (`/ws/chat`) con `conversationId`
  - [x] Burbujas de mensajes (cliente a la derecha, admin a la izquierda)
  - [x] Input de texto + botón adjuntar imagen + botón cámara
  - [x] Animación `rise-in` en cada mensaje enviado
  - [x] Notificaciones de turno en tiempo real
- [x] `useWebSocket` hook

**Backend:**
- [x] WebSocket handler en `/ws/chat`
  - [x] Mensaje `init`: crea/recupera conversación por email
  - [x] Mensaje `message`: guarda en DB + broadcast a admin
  - [x] Manejo de reconexión y estado de conexión
- [x] `GET /api/conversations` (admin)
- [x] `GET /api/conversations/:id` (admin)

**Checkpoint:** Chat público funcional, mensajes persisten en DB, WebSocket bidireccional.

---

## Fase 7 — Admin Chat

**Objetivo:** Panel de chat del lado admin.

**Frontend:**
- [x] `ChatPage`: layout de 2 paneles
  - [x] Izquierda: lista de conversaciones (ordenadas por última actividad)
  - [x] Indicador de mensajes no leídos
  - [x] Derecha: chat en tiempo real con WebSocket
  - [x] Indicador "escribiendo..."
- [x] Conexión WebSocket lado admin (token de sesión)
- [x] Scroll automático al último mensaje

**Backend:**
- [x] Autenticación WebSocket lado admin (verificar cookie/token)
- [x] Broadcast de mensajes admin → cliente específico
- [x] Marcar conversación como leída
- [x] `PUT /api/conversations/:id` — cambiar status

**Checkpoint:** Admin puede ver y responder conversaciones en tiempo real.

---

## Fase 8 — Appointments (Turnos)

**Objetivo:** Agenda de turnos, crear turno desde chat.

**Frontend admin:**
- [x] `SchedulePage`: tabla/calendario de turnos
  - [x] Filtros por fecha, estado
  - [x] Modal crear/editar turno (cliente, fecha, hora, monto, descripción)
  - [x] Acciones: confirmar, cancelar, completar
- [x] Desde `ChatPage`: botón "Agendar turno" que abre modal pre-llenado con datos del cliente

**API:**
- [x] `GET /api/appointments` (admin, con query params de filtro)
- [x] `POST /api/appointments` (admin)
- [x] `PUT /api/appointments/:id` (admin)
- [x] `DELETE /api/appointments/:id` (admin)

**Checkpoint:** Admin puede gestionar turnos completos, crear desde chat.

---

## Fase 9 — Notificaciones

**Objetivo:** Email + WebSocket al agendar/modificar/cancelar turno.

**API:**
- [x] Servicio `email.ts` con Resend
- [x] Templates HTML para notificaciones:
  - [x] Turno agendado: "Su turno fue agendado para el X/X/XXXX a las XX:XX"
  - [x] Turno modificado
  - [x] Turno cancelado
- [x] Disparo de email al crear/actualizar appointment

**WebSocket:**
- [x] Mensaje tipo `appointment_created` al cliente conectado
- [x] Mensaje tipo `appointment_updated` al cliente conectado
- [x] Mensaje tipo `appointment_cancelled` al cliente conectado

**Checkpoint:** Cliente recibe notificación por email + en chat al instante.

---

## Fase 10 — Payments

**Objetivo:** Tabla de pagos con estados editables.

**Frontend admin:**
- [x] `PaymentsPage`: tabla con `FilterTable` de beautiful-ui
  - [x] Columnas: cliente, monto, estado (chip de color), fecha, appointment
  - [x] Filtro por estado
  - [x] Editar estado (dropdown/select en la fila)
  - [x] Crear nuevo pago (modal)
- [x] Estados con colores: pending (amarillo), paid (verde), cancelled (gris), refunded (rojo)

**API:**
- [x] `GET /api/payments` (admin, filtros por estado)
- [x] `POST /api/payments` (admin)
- [x] `PUT /api/payments/:id` (admin)
- [x] `DELETE /api/payments/:id` (admin)

**Checkpoint:** Admin gestiona pagos con tabla filtereable y editable.

---

## Fase 11 — Polish & Deploy

**Objetivo:** Refinamientos finales, responsive, deploy.

- [x] Revisar responsive en todos los breakpoints (mobile, tablet, desktop)
- [x] Animaciones finales: transiciones de página, hover states, loading states
- [x] SEO básico: meta tags, Open Graph, `sitemap.xml`
- [x] Favicon y metadatos de la app
- [x] Configurar deploy en Vercel (frontend + backend)
- [x] Conectar dominio personalizado
- [x] Pruebas de flujo completo (chat → turno → notificación → pago)
- [x] Variables de entorno en producción

**Checkpoint:** Proyecto deployado, funcional, responsive, listo para producción.
