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
Puedes cambiar el nombre en `void.config.ts`. No requiere base de datos ni
secretos de GitHub. La sesión actual todavía no tiene autenticación de Cloudflare;
el proyecto está preparado y verificado localmente, pero no publicado.

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

Los datos de GitHub son una instantánea del 30 de septiembre de 2026 y no se
actualizan automáticamente. Para reemplazarlos, actualiza
`public/github-data.json` y vuelve a desplegar.

## Verificación

```sh
npm test
npm run typecheck
npm run build
```

Documentación: https://void.cloud/guide/quickstart
