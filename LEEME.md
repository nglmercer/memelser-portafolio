# Portafolio de memelser · Void + Cloudflare

El portafolio conserva el diseño original, las diez traducciones, los cinco temas,
la animación, el blog y el explorador de proyectos. Ahora usa Vite y Void SDK
(1.1.11) para compilar el cliente y una API en Cloudflare Workers.

## Desarrollo

Requiere Node.js 24.21.0 o posterior.

```sh
npm ci
npm run dev
```

Abre http://localhost:5173. No abras index.html directamente.

## Publicar en Cloudflare

```sh
npx void cloudflare login
npm run deploy
```

Selecciona tu cuenta cuando Void lo solicite. Void compila y publica el Worker
`memelser-portfolio` con sus archivos estáticos, e imprime la URL final.
Puedes cambiar el nombre en `void.config.ts`. La sesión actual todavía no
tiene autenticación de Cloudflare; el proyecto está preparado y verificado
localmente, pero no publicado.

Para CI, configura `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID` como secretos
del entorno y ejecuta `npm ci` seguido de `npm run deploy`.
Conserva `void.lock.json` en control de versiones si Void lo genera.

## Archivos

- `index.html`: página principal.
- `src/`: CSS, módulos del cliente, traducciones y Three.js.
- `public/`: imágenes, vista de proyectos y datos de GitHub.
- `routes/api/github.ts`: API Void utilizada por los gráficos (`/api/github`).
- `vite.config.ts`: integración de Vite con Void.
- `void.config.ts`: destino Cloudflare y nombre del Worker.
- `dist/client/` y `dist/ssr/`: archivos generados; no editar.

## Datos de GitHub

`/api/github` sirve la instantánea diaria desde KV y, si KV está vacío, el
respaldo incluido en `public/github-data.json`. Hay dos formas de actualizarlos.

**Sincronización manual** (sin secretos en producción):

```sh
GITHUB_TOKEN=ghp_... npm run github:sync
```

Reescribe `public/github-data.json` con los repositorios, estrellas y últimos
20 commits actuales. Los enlaces `demo` curados y el historial de
contribuciones se conservan. Sin token también funciona (60 peticiones/hora);
con token el límite sube a 5.000/hora. Después vuelve a desplegar.

**Sincronización automática** (requiere secretos de GitHub):

```sh
void secret put GITHUB_TOKEN
npm run deploy
```

El cron `crons/daily-github.ts` (06:00 UTC) refresca los mismos datos y los
guarda en KV por siete días. El historial diario de contribuciones no lo
expone la API REST, así que se traslada de la instantánea anterior en ambos
métodos.

## Verificación

```sh
npm test
npm run typecheck
npm run build
```

Documentación: https://void.cloud/guide/quickstart
