# Registro de Cambios

Todos los cambios notables en Notas.IA🗒️ serán documentados en este archivo.

## [3.1.0] - 2025-12-28

### Añadido

- 🌗 Modo oscuro/claro con detección automática de preferencias del sistema
- 💾 Exportación a Markdown (.md) además de HTML
- 🛡️ Mejor compatibilidad con CSP (Content Security Policy) usando Blob URLs
- 📊 Conteo de oraciones mejorado usando `Intl.Segmenter` cuando está disponible
- 🎨 Variables CSS para temas dinámicos
- 🔗 Footer con enlaces a GitHub y Bluesky

### Cambiado

- Arquitectura refactorizada para mejor bypass de CSP
- Interfaz de usuario simplificada y más compacta
- Instrucciones más concisas

### Corregido

- Compatibilidad con sitios que tienen políticas CSP estrictas
- Manejo seguro de HTML con Trusted Types

## [1.0.0] - 2024-12-15

### Añadido

- Lanzamiento inicial del bookmarklet
- Editor de texto inteligente con prototipo de incorporación de fórmulas análisis de legibilidad. Referencia: Blog de Olga Carreras https://olgacarreras.blogspot.com/2016/10/medicion-de-la-readability-o.html
- Detección automática de idioma (español/inglés)
- Panel de estadísticas en tiempo real
- Soporte para Markdown
- Funcionalidad de copiar texto plano y enriquecido
- Integración con el portapapeles del sistema
- Botones de acción rápida
- Panel de estadísticas minimizable
- Soporte para dictado de voz en Windows
- Análisis de legibilidad bilingüe
- Autoguardado en navegador
- Detección de terminología técnica

### Cambiado

- Nombre actualizado de NotePad a Notas.IA🗒️
- Mejora en la interfaz de usuario
- Optimización del rendimiento

### Corregido

- Problemas con caracteres especiales en español
- Comportamiento del scroll en documentos largos
- Problemas de formato al pegar contenido

## [Próximas Características]

- Mejora en el análisis de textos médicos
- Integración directa con LLMs populares
- Exportación a más formatos
- Soporte para más idiomas
- Mejoras en el análisis de legibilidad
