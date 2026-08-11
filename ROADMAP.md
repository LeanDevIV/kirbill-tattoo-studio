# Kirbill Tattoo Studio — Roadmap de Desarrollo

Fases incrementales. Cada fase produce un checkpoint funcional y commiteable.
Orden diseñado para minimizar bloqueos entre fases.

---

## Fase 0 — Scaffolding del Monorepo

**Objetivo:** Estructura base con tooling funcionando.

- [ ] Inicializar monorepo con `package.json` root + `turbo.json` + `workspaces`
- [ ] Crear `apps/api/` con `package.json`, `tsconfig.json`, entry point mínimo ElysiaJS
- [ ] Crear `apps/web/` con Vite + React + TypeScript + Tailwind CSS v4
- [ ] Crear `packages/shared/` con tipos base
- [ ] Configurar `.gitignore`, `.env.example`
- [ ] Configurar ESLint + Prettier (o Biome) compartido
- [ ] Verificar que `bun run dev` levanta ambos servicios

**Checkpoint:** Monorepo compila, ambos servers corren en puertos distintos.

---

## Fase 1 — Backend Skeleton

**Objetivo:** Conexión a DB, modelos Mongoose, estructura de rutas, auth.

- [ ] Configurar conexión a MongoDB (`db.ts`)
- [ ] Crear modelos Mongoose: User, HeroImage, GalleryImage, Appointment, Payment, Conversation, Message
- [ ] Crear seed script para usuario admin (`ADMIN_USERNAME` + bcrypt hash de `ADMIN_PASSWORD`)
- [ ] Implementar `POST /api/auth/login` — cookie de sesión
- [ ] Implementar `POST /api/auth/logout` + `GET /api/auth/me`
- [ ] Middleware `auth.ts` — verifica cookie, protege rutas admin
- [ ] Configurar CORS para `FRONTEND_URL`
- [ ] Health check `GET /api/health`

**Checkpoint:** MongoDB conectado, login/logout funcional, seed crea admin.

---

## Fase 2 — Frontend Skeleton

**Objetivo:** Layouts, rutas, navbar, footer, diseño base.

- [ ] Configurar Tailwind con tokens de DESIGN.md en `globals.css`
- [ ] Cargar Space Grotesk desde Google Fonts
- [ ] Crear `PublicLayout` — Navbar + `<Outlet />` + Footer
- [ ] Crear `AdminLayout` — AdminSidebar + `<Outlet />`
- [ ] Componente `SiteNavbar`: pill flotante, glass on scroll, links smooth scroll
- [ ] Componente `Footer`: redes sociales (Instagram, Facebook, WhatsApp)
- [ ] Definir rutas en `App.tsx`: `/` (HomePage), `/admin/login`, `/admin/*` (protegidas)
- [ ] `useAuth` hook — verifica sesión, redirige si no autenticado
- [ ] Placeholder `HomePage` con 3 secciones vacías
- [ ] Placeholder `LoginPage`

**Checkpoint:** Navegación funcional, diseño oscuro aplicado, navbar/footer visibles.

---

## Fase 3 — Admin Login

**Objetivo:** Flujo de autenticación completo.

- [ ] `LoginPage` con formulario (username + password)
- [ ] `useAuth` hook — `login()`, `logout()`, `me()` contra `/api/auth/*`
- [ ] Manejo de errores de login (credenciales inválidas, red)
- [ ] Guard de rutas: redirige a `/admin/login` si no hay sesión
- [ ] Redirige a `/admin/home` si ya está autenticado
- [ ] Botón "Cerrar sesión" en admin sidebar

**Checkpoint:** Login completo, rutas protegidas funcionales.

---

## Fase 4 — Hero Section

**Objetivo:** Hero con Grainient background + carrusel de imágenes, admin CRUD.

**Frontend público:**
- [ ] `GrainientHero`: componente con `<Grainient>` animado como fondo
- [ ] `HeroCarousel`: carrusel de imágenes desde `/api/hero-images`
- [ ] Imágenes de placeholder mientras no haya reales
- [ ] Transiciones suaves entre slides

**API:**
- [ ] `GET /api/hero-images` (público, ordenado)
- [ ] `POST /api/hero-images` (admin, upload Vercel Blob)
- [ ] `PUT /api/hero-images/:id` (admin, orden/activo)
- [ ] `DELETE /api/hero-images/:id` (admin, borra Blob + DB)

**Admin:**
- [ ] `HomeAdminPage`: grid de imágenes con drag & drop
- [ ] `ImageUploader`: sube a Vercel Blob, muestra preview, guarda URL
- [ ] Toggle activar/desactivar
- [ ] Botón eliminar con confirmación

**Checkpoint:** Hero público muestra carrusel, admin puede gestionar imágenes.

---

## Fase 5 — Gallery Section

**Objetivo:** Drift wall mosaic con imágenes de trabajos, admin CRUD.

**Frontend público:**
- [ ] `DriftGallery`: componente con drift-wall de reactbits
- [ ] Imágenes desde `/api/gallery`
- [ ] Cada imagen con título y categoría al hover
- [ ] Placeholder images mientras no haya reales

**API:**
- [ ] `GET /api/gallery` (público)
- [ ] `POST /api/gallery` (admin, upload Vercel Blob)
- [ ] `PUT /api/gallery/:id` (admin)
- [ ] `DELETE /api/gallery/:id` (admin)

**Admin:**
- [ ] Sección en `/admin/home` o página aparte para gestionar galería
- [ ] `ImageUploader` + campos de título y categoría
- [ ] Grid de imágenes con acciones (editar, eliminar)

**Checkpoint:** Gallery pública con drift wall, admin gestiona imágenes.

---

## Fase 6 — Contact Section + Chat (Público)

**Objetivo:** Sección de contacto con layout split y chat en tiempo real por WebSocket.

**Frontend:**
- [ ] `ContactSection`: 1/4 izquierda (redes sociales) + 3/4 derecha (chat trigger)
- [ ] `ChatPanel`: popup overlay glass, WebSocket chat
  - [ ] Modal de ingreso de email + nombre antes de iniciar chat
  - [ ] Conexión WebSocket (`/ws/chat`) con `conversationId`
  - [ ] Burbujas de mensajes (cliente a la derecha, admin a la izquierda)
  - [ ] Input de texto + botón adjuntar imagen + botón cámara
  - [ ] Animación `rise-in` en cada mensaje enviado
  - [ ] Notificaciones de turno en tiempo real
- [ ] `useWebSocket` hook

**Backend:**
- [ ] WebSocket handler en `/ws/chat`
  - [ ] Mensaje `init`: crea/recupera conversación por email
  - [ ] Mensaje `message`: guarda en DB + broadcast a admin
  - [ ] Manejo de reconexión y estado de conexión
- [ ] `GET /api/conversations` (admin)
- [ ] `GET /api/conversations/:id` (admin)

**Checkpoint:** Chat público funcional, mensajes persisten en DB, WebSocket bidireccional.

---

## Fase 7 — Admin Chat

**Objetivo:** Panel de chat del lado admin.

**Frontend:**
- [ ] `ChatPage`: layout de 2 paneles
  - [ ] Izquierda: lista de conversaciones (ordenadas por última actividad)
  - [ ] Indicador de mensajes no leídos
  - [ ] Derecha: chat en tiempo real con WebSocket
  - [ ] Indicador "escribiendo..."
- [ ] Conexión WebSocket lado admin (token de sesión)
- [ ] Scroll automático al último mensaje

**Backend:**
- [ ] Autenticación WebSocket lado admin (verificar cookie/token)
- [ ] Broadcast de mensajes admin → cliente específico
- [ ] Marcar conversación como leída
- [ ] `PUT /api/conversations/:id` — cambiar status

**Checkpoint:** Admin puede ver y responder conversaciones en tiempo real.

---

## Fase 8 — Appointments (Turnos)

**Objetivo:** Agenda de turnos, crear turno desde chat.

**Frontend admin:**
- [ ] `SchedulePage`: tabla/calendario de turnos
  - [ ] Filtros por fecha, estado
  - [ ] Modal crear/editar turno (cliente, fecha, hora, monto, descripción)
  - [ ] Acciones: confirmar, cancelar, completar
- [ ] Desde `ChatPage`: botón "Agendar turno" que abre modal pre-llenado con datos del cliente

**API:**
- [ ] `GET /api/appointments` (admin, con query params de filtro)
- [ ] `POST /api/appointments` (admin)
- [ ] `PUT /api/appointments/:id` (admin)
- [ ] `DELETE /api/appointments/:id` (admin)

**Checkpoint:** Admin puede gestionar turnos completos, crear desde chat.

---

## Fase 9 — Notificaciones

**Objetivo:** Email + WebSocket al agendar/modificar/cancelar turno.

**API:**
- [ ] Servicio `email.ts` con Resend
- [ ] Templates HTML para notificaciones:
  - [ ] Turno agendado: "Su turno fue agendado para el X/X/XXXX a las XX:XX"
  - [ ] Turno modificado
  - [ ] Turno cancelado
- [ ] Disparo de email al crear/actualizar appointment

**WebSocket:**
- [ ] Mensaje tipo `appointment_created` al cliente conectado
- [ ] Mensaje tipo `appointment_updated` al cliente conectado
- [ ] Mensaje tipo `appointment_cancelled` al cliente conectado

**Checkpoint:** Cliente recibe notificación por email + en chat al instante.

---

## Fase 10 — Payments

**Objetivo:** Tabla de pagos con estados editables.

**Frontend admin:**
- [ ] `PaymentsPage`: tabla con `FilterTable` de beautiful-ui
  - [ ] Columnas: cliente, monto, estado (chip de color), fecha, appointment
  - [ ] Filtro por estado
  - [ ] Editar estado (dropdown/select en la fila)
  - [ ] Crear nuevo pago (modal)
- [ ] Estados con colores: pending (amarillo), paid (verde), cancelled (gris), refunded (rojo)

**API:**
- [ ] `GET /api/payments` (admin, filtros por estado)
- [ ] `POST /api/payments` (admin)
- [ ] `PUT /api/payments/:id` (admin)
- [ ] `DELETE /api/payments/:id` (admin)

**Checkpoint:** Admin gestiona pagos con tabla filtereable y editable.

---

## Fase 11 — Polish & Deploy

**Objetivo:** Refinamientos finales, responsive, deploy.

- [ ] Revisar responsive en todos los breakpoints (mobile, tablet, desktop)
- [ ] Animaciones finales: transiciones de página, hover states, loading states
- [ ] SEO básico: meta tags, Open Graph, `sitemap.xml`
- [ ] Favicon y metadatos de la app
- [ ] Configurar deploy en Vercel (frontend + backend)
- [ ] Conectar dominio personalizado
- [ ] Pruebas de flujo completo (chat → turno → notificación → pago)
- [ ] Variables de entorno en producción

**Checkpoint:** Proyecto deployado, funcional, responsive, listo para producción.
