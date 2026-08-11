# Kirbill Tattoo Studio — Especificación Técnica

## Resumen

Landing page portfolio para una tatuadora profesional con panel de administración
privado. Single-page pública (Hero + Gallery + Contact) con chat en tiempo real.
Admin puede gestionar imágenes del hero, galería, conversaciones, turnos y pagos.

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Backend | ElysiaJS + Bun runtime |
| Base de datos | MongoDB + Mongoose ODM |
| Frontend | Vite + React 18 + TypeScript |
| Estilos | Tailwind CSS v4 |
| UI Components | beautiful-ui (admin/chat), reactbits (drift-wall gallery) |
| Almacenamiento de imágenes | Vercel Blob |
| Email | Resend |
| Monorepo | Turborepo |
| Package manager | bun |

---

## Estructura del Monorepo

```
kirbill-tattoo-studio/
├── apps/
│   ├── api/                    # Backend ElysiaJS
│   │   ├── src/
│   │   │   ├── index.ts        # Entry point, app setup
│   │   │   ├── db.ts           # MongoDB connection via Mongoose
│   │   │   ├── routes/
│   │   │   │   ├── auth.ts     # POST /api/auth/login
│   │   │   │   ├── hero-images.ts
│   │   │   │   ├── gallery.ts
│   │   │   │   ├── appointments.ts
│   │   │   │   ├── payments.ts
│   │   │   │   └── conversations.ts
│   │   │   ├── ws/
│   │   │   │   └── chat.ts     # WebSocket /ws/chat
│   │   │   ├── services/
│   │   │   │   ├── blob.ts     # Vercel Blob upload/delete wrapper
│   │   │   │   └── email.ts    # Resend email notifications
│   │   │   ├── models/
│   │   │   │   ├── user.ts
│   │   │   │   ├── hero-image.ts
│   │   │   │   ├── gallery-image.ts
│   │   │   │   ├── appointment.ts
│   │   │   │   ├── payment.ts
│   │   │   │   ├── conversation.ts
│   │   │   │   └── message.ts
│   │   │   └── middleware/
│   │   │       └── auth.ts     # Admin session guard
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── web/                    # Frontend React
│       ├── src/
│       │   ├── main.tsx
│       │   ├── App.tsx         # Router definition
│       │   ├── layouts/
│       │   │   ├── PublicLayout.tsx
│       │   │   └── AdminLayout.tsx
│       │   ├── pages/
│       │   │   ├── public/
│       │   │   │   └── HomePage.tsx
│       │   │   └── admin/
│       │   │       ├── LoginPage.tsx
│       │   │       ├── HomeAdminPage.tsx
│       │   │       ├── SchedulePage.tsx
│       │   │       ├── ChatPage.tsx
│       │   │       └── PaymentsPage.tsx
│       │   ├── components/
│       │   │   ├── SiteNavbar.tsx
│       │   │   ├── Footer.tsx
│       │   │   ├── GrainientHero.tsx
│       │   │   ├── HeroCarousel.tsx
│       │   │   ├── DriftGallery.tsx
│       │   │   ├── ContactSection.tsx
│       │   │   ├── ChatPanel.tsx
│       │   │   ├── AdminSidebar.tsx
│       │   │   ├── ImageUploader.tsx
│       │   │   └── PaymentTable.tsx
│       │   ├── hooks/
│       │   │   ├── useWebSocket.ts
│       │   │   └── useAuth.ts
│       │   ├── lib/
│       │   │   ├── api.ts
│       │   │   └── cn.ts
│       │   └── styles/
│       │       └── globals.css
│       ├── index.html
│       ├── package.json
│       ├── tsconfig.json
│       ├── tailwind.config.ts
│       └── vite.config.ts
├── packages/
│   └── shared/
│       ├── src/
│       │   └── types.ts
│       ├── package.json
│       └── tsconfig.json
├── package.json                # Root workspaces
├── turbo.json                  # Turborepo pipeline
├── .env.example
├── .gitignore
├── SPECS.md
├── ROADMAP.md
├── README.md
└── CODESTYLE.md
```

---

## Modelos de Base de Datos (MongoDB / Mongoose)

### User
```
{
  _id: ObjectId,
  username: string (unique, required),
  passwordHash: string (required, bcrypt)
}
```

### HeroImage
```
{
  _id: ObjectId,
  imageUrl: string (required),
  order: number (default: 0),
  isActive: boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### GalleryImage
```
{
  _id: ObjectId,
  imageUrl: string (required),
  title: string,
  category: string,
  order: number (default: 0),
  isActive: boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Appointment
```
{
  _id: ObjectId,
  clientEmail: string (required),
  date: Date (required),
  time: string (required, formato "HH:mm"),
  status: enum ["pending", "confirmed", "cancelled", "completed"],
  amount: number,
  description: string,
  conversationId: ObjectId (ref: Conversation),
  createdAt: Date,
  updatedAt: Date
}
```

### Payment
```
{
  _id: ObjectId,
  appointmentId: ObjectId (ref: Appointment),
  clientEmail: string (required),
  amount: number (required),
  status: enum ["pending", "paid", "cancelled", "refunded"],
  createdAt: Date,
  updatedAt: Date
}
```

### Conversation
```
{
  _id: ObjectId,
  clientEmail: string (required, indexed),
  clientName: string,
  status: enum ["active", "closed"],
  lastMessageAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Message
```
{
  _id: ObjectId,
  conversationId: ObjectId (ref: Conversation, indexed),
  sender: enum ["client", "admin"],
  text: string,
  imageUrl: string,
  timestamp: Date
}
```

---

## API Endpoints

### Auth

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | /api/auth/login | No | Login admin. Body: { username, password }. Retorna cookie de sesión. |
| POST | /api/auth/logout | Admin | Cierra sesión, borra cookie. |
| GET | /api/auth/me | Admin | Retorna datos del admin autenticado. |

### Hero Images

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | /api/hero-images | No | Lista imágenes activas ordenadas. |
| POST | /api/hero-images | Admin | Sube imagen a Vercel Blob, crea registro. |
| PUT | /api/hero-images/:id | Admin | Actualiza orden o estado. |
| DELETE | /api/hero-images/:id | Admin | Elimina de Vercel Blob y de DB. |

### Gallery Images

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | /api/gallery | No | Lista imágenes activas. Público, sin auth. |
| POST | /api/gallery | Admin | Sube imagen, crea registro. |
| PUT | /api/gallery/:id | Admin | Actualiza metadata. |
| DELETE | /api/gallery/:id | Admin | Elimina de Blob y DB. |

### Appointments

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | /api/appointments | Admin | Lista todos los turnos (con filtros por fecha/estado). |
| POST | /api/appointments | Admin | Crea turno. Dispara notificación (WS + email). |
| PUT | /api/appointments/:id | Admin | Actualiza estado, fecha, monto, etc. |
| DELETE | /api/appointments/:id | Admin | Elimina turno. |

### Payments

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | /api/payments | Admin | Lista pagos (con filtros por estado). |
| POST | /api/payments | Admin | Crea registro de pago. |
| PUT | /api/payments/:id | Admin | Actualiza estado o monto. |
| DELETE | /api/payments/:id | Admin | Elimina registro. |

### Conversations & Messages

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | /api/conversations | Admin | Lista conversaciones (ordenadas por última actividad). |
| GET | /api/conversations/:id | Admin | Detalle de conversación + mensajes (paginados). |
| PUT | /api/conversations/:id | Admin | Cambia status (active/closed). |

### WebSocket

| Ruta | Descripción |
|------|-------------|
| /ws/chat | Chat en tiempo real. Params: conversationId, token (admin) o clientEmail (público). |

**Protocolo de mensajes WebSocket:**

```json
// Cliente -> Servidor
{
  "type": "message",
  "payload": {
    "conversationId": "...",
    "text": "Hola, quiero un turno",
    "imageUrl": null
  }
}

// Servidor -> Cliente
{
  "type": "message",
  "payload": {
    "_id": "...",
    "conversationId": "...",
    "sender": "client",
    "text": "Hola, quiero un turno",
    "imageUrl": null,
    "timestamp": "2026-08-11T..."
  }
}

// Servidor -> Cliente (notificación de turno)
{
  "type": "appointment_created",
  "payload": {
    "date": "2026-08-20",
    "time": "15:00",
    "message": "Su turno fue agendado para el 20/08/2026 a las 15:00"
  }
}

// Cliente -> Servidor (iniciar conversación)
{
  "type": "init",
  "payload": {
    "email": "cliente@email.com",
    "name": "Nombre Cliente"
  }
}
```

---

## Páginas — Lado Público

### HomePage (`/`)

Single-page con 3 secciones ancladas (smooth scroll desde navbar):

1. **Hero** — Grainient animated background + carrusel de imágenes administrables.
2. **Gallery** — Drift wall mosaic con imágenes de trabajos.
3. **Contact** — Layout split: 1/4 izquierda con redes sociales + 3/4 derecha con
   trigger del chat panel.

### ChatPanel (popup overlay)

- Se abre al hacer clic en la sección de contacto.
- El usuario ingresa su email y nombre antes de iniciar el chat.
- Conexión WebSocket en tiempo real.
- Capacidad de adjuntar imagen o tomar foto desde la cámara.
- Recibe notificaciones de turno agendado en tiempo real.
- Overlay `z-[60]`, glassmorphism, animación slide-in desde la derecha.

---

## Páginas — Panel Admin (`/admin/*`)

Protegidas por autenticación (cookie de sesión). Layout común con sidebar.

### Login (`/admin/login`)

- Formulario simple: username + password.
- Redirige a `/admin/home` si ya tiene sesión.
- Redirige a `/admin/login` si no está autenticado.

### Admin Home (`/admin/home`)

- CRUD de imágenes del hero carousel.
- `ImageUploader`: sube imagen a Vercel Blob, devuelve URL, guarda registro.
- Drag & drop para reordenar imágenes.
- Toggle activar/desactivar imágenes.
- Preview del carrusel en tiempo real.

### Schedule (`/admin/schedule`)

- Tabla/calendario de turnos.
- Filtros por fecha, estado.
- CRUD completo de appointments.
- Modal para crear/editar turno (fecha, hora, cliente, monto, descripción).

### Chat (`/admin/chat`)

- Layout de 2 paneles:
  - **Izquierda (lista):** conversaciones activas, filtro por status.
  - **Derecha (chat):** mensajes en tiempo real con el cliente seleccionado.
- Desde el chat, botón "Agendar turno" que abre modal de appointment.
- Al confirmar el turno, se envía notificación WebSocket + email al cliente.

### Payments (`/admin/payments`)

- Tabla de pagos con filtros por estado.
- Columns: cliente, monto, estado, fecha, appointment vinculado.
- Estados editables: pending → paid, pending → cancelled, paid → refunded.
- Usar `FilterTable` de beautiful-ui para la tabla con chips de estado.

---

## Diseño Visual

Basado en DESIGN.md — Estudio Frambuesa:

- **Modo oscuro** (`color-scheme: dark`).
- **Paleta:** negro mate con matiz rojo rústico, rojo cardenal, fucsia/blush.
- **Tipografía:** Space Grotesk (Google Fonts).
- **Glassmorphism:** fondo semitransparente, `backdrop-filter: blur(20px)`.
- **Animaciones:** float-slow para imágenes, rise-in para entradas, glow en hovers.
- **Navbar:** pill flotante centrada con glass effect al hacer scroll.
- **Tokens CSS:** definidos en `globals.css` como variables OKLCH.

Componentes de marca:
- `.glass` — superficies de vidrio.
- `.glow-cardinal` — halo rojo cardenal en hovers.
- `.text-gradient` — degradado foreground → cardinal → blush.
- `.animate-float-slow` — flotación vertical.
- `.animate-rise` — fade + subida.

---

## Autenticación

- Simple: credenciales en variables de entorno.
- `.env`: `ADMIN_USERNAME`, `ADMIN_PASSWORD` (hasheada con bcrypt en seed inicial).
- Cookie httpOnly, secure en producción, `SameSite=Lax`.
- Middleware en Elysia que verifica la cookie de sesión.
- No hay registro público — solo un admin.

---

## Almacenamiento de Imágenes (Vercel Blob)

- El frontend sube la imagen directamente a Vercel Blob usando el cliente `@vercel/blob`.
- El backend recibe la URL resultante y la persiste en MongoDB.
- Al eliminar una imagen, se borra tanto de MongoDB como de Vercel Blob.
- Variables de entorno necesarias: `BLOB_READ_WRITE_TOKEN`.

---

## Notificaciones (Email)

- Provider: Resend.
- Templates:
  - **Turno agendado:** "Su turno fue agendado para el {fecha} a las {hora}".
  - **Turno modificado/cancelado:** notificación de cambio.
- Variables de entorno necesarias: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`.

---

## Variables de Entorno (.env)

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/kirbill-tattoo

# Admin Auth
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=bcrypt_hash_generado

# Session
SESSION_SECRET=random_secret_key

# Vercel Blob
BLOB_READ_WRITE_TOKEN=vercel_blob_token

# Resend Email
RESEND_API_KEY=resend_api_key
RESEND_FROM_EMAIL=hola@kirbilltattoo.com

# App
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

---

## Dependencias Clave

### Backend (apps/api)

```
elysia, @elysiajs/cookie, @elysiajs/cors, @elysiajs/jwt
mongoose, bcryptjs
@vercel/blob
resend
```

### Frontend (apps/web)

```
react, react-dom, react-router-dom
beautiful-ui, reactbits
@vercel/blob, resend (client-side trigger)
tailwindcss, @tailwindcss/vite
lucide-react
clsx, tailwind-merge
```

### Root

```
turbo
typescript
```
