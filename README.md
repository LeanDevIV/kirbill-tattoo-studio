# Kirbill Tattoo Studio

Portfolio landing page para una tatuadora profesional. Single-page con panel de
administración, chat en tiempo real, gestión de turnos y pagos.

## Stack

- **Backend:** ElysiaJS + Bun
- **Database:** MongoDB + Mongoose
- **Frontend:** Vite + React + TypeScript + Tailwind CSS v4
- **UI:** beautiful-ui + reactbits
- **Storage:** Vercel Blob
- **Email:** Resend
- **Realtime:** WebSocket (Bun native)

## Vista previa del proyecto terminado

Landing page oscura con estética "raspberry noir": fondo negro mate teñido de
rojo, superficies de vidrio (glassmorphism), tipografía Space Grotesk, y
animaciones orgánicas suaves.

### Página pública (`/`)

**Hero:** Fondo animado Grainient con degradados en tonos borgoña y negro. Sobre
él, un carrusel de imágenes de trabajos de tatuaje con transiciones suaves. Las
imágenes flotan con una animación sutil y al hacer hover escalan ligeramente.

**Gallery:** Muro de mosaico dinámico (drift-wall) que muestra los trabajos
organizados por categorías. Cada imagen revela su título al hacer hover, con un
overlay degradado desde el fondo.

**Contact:** Sección dividida. A la izquierda, los enlaces a redes sociales
(Instagram, Facebook, WhatsApp) con íconos que brillan en fucsia al hover. A la
derecha, un botón que abre un panel de chat. El panel se desliza desde la
derecha con glassmorphism, donde el cliente ingresa su email, escribe mensajes
en tiempo real, y puede adjuntar imágenes o tomar fotos. Cuando el admin agenda
un turno, el cliente recibe una notificación instantánea en el chat y por email.

### Panel de administración (`/admin`)

**Login:** Formulario simple de acceso. Una sola cuenta admin configurada por
variables de entorno.

**Home:** Gestión de imágenes del carrusel del hero. Subida de imágenes con
preview instantáneo (Vercel Blob), drag & drop para reordenar, toggle para
activar/desactivar.

**Schedule:** Agenda de turnos con tabla filtrable por fecha y estado. Modal para
crear y editar turnos con fecha, hora, cliente, monto y descripción.

**Chat:** Panel dividido. Lista de conversaciones a la izquierda, chat en tiempo
real a la derecha. Desde el chat se puede agendar un turno directamente para ese
cliente con un botón dedicado.

**Payments:** Tabla de pagos con chips de estado (pendiente, pagado, cancelado,
reembolsado). Filtrable y editable en línea.

### Componentes visuales destacados

- **Navbar pill flotante:** centrado, transparente al inicio, se vuelve glass al
  hacer scroll con un halo rojo cardenal.
- **Glassmorphism:** tarjetas semitransparentes con blur y saturación en navbar,
  chat panel, y modales.
- **Texto con degradado:** palabras clave en títulos con gradiente foreground →
  cardenal → blush.
- **Animaciones:** flotación lenta en imágenes del hero, entrada rise-in en
  mensajes de chat, glow en hover de botones.

## Requisitos

- **Bun** >= 1.1
- **MongoDB** >= 7.0 (local o Atlas)
- **Node.js** >= 20 (para compatibilidad con algunas herramientas)

## Configuración inicial

```bash
# Clonar
git clone https://github.com/LeanDevIV/kirbill-tattoo-studio.git
cd kirbill-tattoo-studio

# Instalar dependencias
bun install

# Copiar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# Crear admin user
cd apps/api
bun run seed

# Desarrollo (desde root)
bun run dev
```

El backend corre en `http://localhost:3001` y el frontend en `http://localhost:5173`.

## Scripts

| Comando | Descripción |
|---------|-------------|
| `bun run dev` | Levanta api + web en desarrollo (Turborepo) |
| `bun run build` | Build de producción |
| `bun run lint` | Lint en todos los packages |
| `bun run format` | Formatea código |

## Estructura

```
kirbill-tattoo-studio/
├── apps/
│   ├── api/         # Backend ElysiaJS
│   └── web/         # Frontend React
├── packages/
│   └── shared/      # Tipos compartidos
├── SPECS.md         # Especificación técnica completa
├── ROADMAP.md       # Fases de desarrollo
└── CODESTYLE.md     # Convenciones de código
```

## Licencia

Privado. Todos los derechos reservados.
