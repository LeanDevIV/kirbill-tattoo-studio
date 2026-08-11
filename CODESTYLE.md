# CODESTYLE — Kirbill Tattoo Studio

Convenciones de código para mantener consistencia en el monorepo. Todo el código debe seguir estas reglas antes de ser commiteado.

---

## Principios Generales

1. **Todo en inglés.** Variables, funciones, comentarios, commits, documentación técnica. Solo el contenido visible al usuario final (UI text) va en español.
2. **Depurable.** El código debe ser fácil de inspeccionar. No usar minificación ni ofuscación en development. Los logs deben ser informativos pero no ruidosos.
3. **Comentarios mínimos y solo técnicos.** Si el código es autoexplicativo, no lleva comentario. Si hay una decisión no obvia (workaround, optimización, edge case), un comentario breve de una línea explicando el porqué.
4. **Siempre formateado.** Cada commit debe tener el código formateado. Usar el formateador configurado en el proyecto (Biome/Prettier).
5. **Production-ready desde el día 0.** Sin placeholders permanentes, sin TODOs sin ticket asociado, sin console.log (usar logger). Todo error debe ser manejado explícitamente.

---

## TypeScript

- **Strict mode** en todos los tsconfig.json. Nada de `any` sin justificación.
- **Tipos explícitos en returns de funciones.** No confiar en inferencia para funciones exportadas.
- **Interfaces sobre types** para objetos públicos (mejor extensibilidad).
- **Types sobre interfaces** para unions, intersections, y tipos utilitarios.
- **No usar enums.** Usar `as const` + type derivado.
- **No usar clases** a menos que Mongoose lo requiera. Preferir funciones y objetos planos.
- **Path aliases:** `@/` mapea a `src/` en cada app/package.

---

## Naming

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Archivos | kebab-case | hero-carousel.tsx, use-web-socket.ts |
| Componentes React | PascalCase | HeroCarousel, ChatPanel |
| Funciones | camelCase | getHeroImages, handleSubmit |
| Variables | camelCase | imageUrl, isLoading |
| Constantes | UPPER_SNAKE_CASE | MAX_IMAGES, DEFAULT_PAGE_SIZE |
| Tipos/Interfaces | PascalCase | HeroImage, AppointmentPayload |
| Colecciones MongoDB | camelCase plural | heroImages, galleryImages |
| Rutas API | kebab-case | /api/hero-images, /api/payments |

---

## Estructura de Archivos

### Backend (apps/api)

- `src/index.ts` — Solo crea la app y arranca el servidor
- `src/db.ts` — Conexión Mongoose
- `src/routes/` — Un archivo por recurso. Solo routing, no lógica.
- `src/models/` — Schemas de Mongoose. Un archivo por modelo.
- `src/services/` — Lógica de negocio. Un archivo por dominio.
- `src/middleware/` — Guards, validators, error handlers.
- `src/ws/` — Handlers de WebSocket.
- `src/lib/` — Utilidades puras (sin estado, sin DB).

Las rutas son **thin handlers**: validan input, llaman al service, devuelven respuesta. Nunca lógica de negocio en rutas. Los servicios contienen toda la lógica. Los modelos solo definen el schema; nada de métodos de instancia complejos.

### Frontend (apps/web)

- `src/main.tsx` — Entry point
- `src/App.tsx` — Router
- `src/layouts/` — Layout wrappers (PublicLayout, AdminLayout)
- `src/pages/` — Una carpeta por página. Page component + sus subcomponentes.
- `src/components/` — Componentes reutilizables cross-page.
- `src/hooks/` — Custom hooks reutilizables.
- `src/lib/` — Utilidades (api client, cn, constants).
- `src/styles/` — Solo globals.css. Estilos locales van con el componente.

Cada página exporta un solo componente default. Los componentes reutilizables cross-page viven en `components/`. Los componentes que solo usa una página viven en la carpeta de esa página. No usar CSS modules — todo con Tailwind + cn() utility. Máximo 3 niveles de anidamiento de componentes.

---

## React

- Componentes funcionales con `function` declaration (no arrow functions para componentes exportados).
- Props tipadas explícitamente con interface.
- **No usar funciones inline en JSX.** Declarar como constantes fuera del return.
- Un solo `export` por archivo de componente (el default). Excepciones: tipos/props exportados.
- **No usar React.memo ni useMemo prematuramente.** Solo cuando haya un problema de rendimiento medible.
- Hooks custom para lógica reutilizable. Nada de lógica de fetch en componentes.
- Estados derivados con `useMemo` o calculados en el render (no duplicar estado).
- `useEffect` solo para sincronización externa (WebSocket, eventos, timers). No para derivar estado.

---

## Backend (ElysiaJS)

- Las rutas usan el patrón `group` + `guard` para agrupar por prefijo y auth.
- Validación de entrada con Zod (si está disponible) o validación manual en el handler.
- Respuestas de error consistentes: `{ error: string, statusCode: number }`.
- Status codes semánticos: 200 (ok), 201 (created), 400 (bad request), 401 (unauthorized), 404 (not found), 500 (internal).
- Nunca exponer stack traces o mensajes de error internos al cliente en producción.
- Mongoose queries con `.lean()` para datos de solo lectura (mejor rendimiento).
- `.select()` explícito en queries para no mandar campos innecesarios (especialmente passwords).

---

## CSS / Tailwind

- Solo Tailwind classes en JSX. Nada de estilos inline (excepto valores dinámicos como `backgroundImage`).
- Usar la función `cn()` para combinar clases condicionales:
  ```tsx
  className={cn("base-class", isActive && "active-class", className)}
  ```
- Tokens de diseño (colores, radios, fonts) solo en globals.css como CSS custom properties.
- Clases utilitarias comunes (.glass, .glow-cardinal, .text-gradient) definidas en globals.css con @apply.
- Orden de clases: layout (display, position) -> spacing (margin, padding) -> sizing (width, height) -> visual (colors, borders) -> typography -> misc (transitions, animations).
- Sin breakpoints custom. Usar los defaults de Tailwind (sm, md, lg, xl, 2xl).

---

## Git

- **Conventional Commits** con formato: `prefix: description`
  - `feat:` — Nueva funcionalidad
  - `fix:` — Bug fix
  - `refactor:` — Refactor sin cambio funcional
  - `style:` — Formato, estilos (sin cambio lógico)
  - `docs:` — Solo cambios de documentación
  - `chore:` — Tooling, config, dependencias
- Descripciones en inglés, imperativo, minúscula.
- Un commit por checkpoint significativo (no commits por cada save).
- Nunca commitear secrets, .env, node_modules, o archivos de build.
- Las branches siguen el formato `feat/descripcion-corta` o `fix/descripcion-corta`.
