# Notas.IA🗒️

[![Licencia MIT](https://img.shields.io/badge/Licencia-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow.svg)](https://www.javascript.com/)
[![Mantenimiento](https://img.shields.io/badge/Mantenido%3F-s%C3%AD-green.svg)](https://github.com/ernestobarrera/Bookmarklet-Notas/graphs/commit-activity)

Notas.IA🗒️ es un editor de notas avanzado que se ejecuta directamente en el navegador, diseñado específicamente para trabajar con modelos de lenguaje (LLMs) y procesar texto de manera eficiente. Este bookmarklet transforma cualquier navegador en una potente herramienta de edición y análisis de texto, perfecta para iterar y refinar las respuestas de LLMs.

## ⚡ ¿Por qué este Editor?

### Integración con LLMs

- **Procesamiento Instantáneo**: Ideal para editar, refinar y analizar respuestas de ChatGPT, Claude y otros LLMs
- **Análisis de Legibilidad**: Evalúa la calidad y complejidad de las respuestas generadas
- **Edición Contextual**: Mantén el contexto mientras editas y refinas el texto generado
- **Formato Universal**: Convierte fácilmente entre texto plano, rich text y Markdown
- **Persistencia**: Guarda y recupera conversaciones importantes sin depender de la interfaz del LLM

### Ventajas para el Trabajo con LLMs

- Edita respuestas largas fuera del chat sin perder el formato
- Analiza la complejidad del texto generado en tiempo real
- Combina múltiples respuestas en un solo documento
- Prepara prompts elaborados con formato consistente
- Mantén un registro de las iteraciones más exitosas

## 🌟 Características Principales

### Funcionalidad Core

- Editor inteligente con análisis de legibilidad bilingüe (Español/Inglés)
- Estadísticas de texto en tiempo real
- Soporte para dictado por voz (Windows 10/11)
- Renderizado y conversión de Markdown
- Opciones de exportación en texto enriquecido y plano
- Detección automática de idioma
- Autoguardado en el navegador

### Análisis Inteligente

- Cálculo del índice de legibilidad Flesch
- Soporte multilingüe con detección automática
- Reconocimiento de terminología técnica
- Análisis de complejidad de oraciones
- Conteo en tiempo real de palabras y caracteres
- Cálculo de tiempo estimado de lectura

### Gestión de Documentos

- Guardado en HTML con formato preservado
- Copia como texto plano o enriquecido
- Conversión de Markdown a HTML
- Soporte para Deshacer/Rehacer
- Panel de estadísticas autocontraíble

## 🚀 Instalación

### Crear el Bookmarklet

1. Copia el contenido completo de `bookmarklet.js`
2. Crea un nuevo marcador en tu navegador:
   ```
   Clic derecho en la barra de marcadores → Añadir página/Nuevo marcador
   Nombre: Editor de Notas Inteligente (o el nombre que prefieras)
   URL: [Pega el código del bookmarklet]
   ```

### Compatibilidad con Navegadores

Probado y verificado en:

- Google Chrome (v100+)
- Mozilla Firefox (v90+)
- Microsoft Edge (v90+)
- Safari (v15+)

## 💡 Guía de Uso

### Métodos de Entrada de Texto

1. **Entrada Directa**

   - Escribe directamente en el editor
   - Pega texto: `Ctrl+V` (con formato) o `Ctrl+Shift+V` (texto plano)

2. **Dictado por Voz** (Windows 10/11)

   - Activar: `Windows + H`
   - Comandos de voz:
     - Puntuación: "punto", "coma", "nuevo párrafo"
     - Control: "borra eso", "detén el dictado"

3. **Formato de Texto**
   - Soporta sintaxis Markdown:
     ```markdown
     **negrita**, _cursiva_, # títulos

     - viñetas
       [enlaces](url)
     ```
   - Preserva el formato enriquecido al pegar

### Características Avanzadas

#### Análisis de Legibilidad

El editor implementa métricas sofisticadas de legibilidad:

- Detección automática de idioma (Español/Inglés)
- Cálculo del índice de legibilidad Flesch
- Reconocimiento de terminología técnica
- Análisis de complejidad de oraciones
- Análisis de frecuencia de palabras y caracteres

#### Panel de Estadísticas

Proporciona métricas en tiempo real:

- Conteo de palabras y caracteres
- Conteo de oraciones y longitud promedio
- Conteo de párrafos
- Tiempo estimado de lectura
- Análisis de composición del lenguaje
- Puntuaciones de legibilidad

### Atajos de Teclado

| Acción            | Windows/Linux      | macOS           |
| ----------------- | ------------------ | --------------- |
| Guardar           | `Ctrl + S`         | `⌘ + S`         |
| Deshacer          | `Ctrl + Z`         | `⌘ + Z`         |
| Rehacer           | `Ctrl + Y`         | `⌘ + Shift + Z` |
| Seleccionar Todo  | `Ctrl + A`         | `⌘ + A`         |
| Copiar            | `Ctrl + C`         | `⌘ + C`         |
| Pegar             | `Ctrl + V`         | `⌘ + V`         |
| Pegar sin Formato | `Ctrl + Shift + V` | `⌘ + Shift + V` |

## 🛠️ Implementación Técnica

### Componentes Principales

1. **Detector de Idioma**

   - Identificación basada en patrones
   - Reconocimiento de terminología técnica
   - Capacidades de análisis híbrido
   - Sistema de puntuación de confianza

2. **Analizador de Legibilidad**

   - Conteo de sílabas multilingüe
   - Adaptación del índice Flesch
   - Ajustes de fórmulas por idioma
   - Sistema de interpretación de puntuaciones

3. **Gestión de Documentos**
   - API Blob de HTML5 para guardado
   - Integración con ClipboardAPI
   - Preservación de selección
   - Gestión del historial de deshacer

### Optimizaciones de Rendimiento

- Funciones de actualización con debounce
- Manipulación eficiente del DOM
- Implementación de scroll suave
- Gestión eficiente de eventos

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Aquí te explicamos cómo puedes ayudar:

1. Haz fork del repositorio
2. Crea tu rama de características:
   ```bash
   git checkout -b caracteristica/NuevaFuncionalidad
   ```
3. Confirma tus cambios:
   ```bash
   git commit -m 'Añadir alguna NuevaFuncionalidad'
   ```
4. Empuja a la rama:
   ```bash
   git push origin caracteristica/NuevaFuncionalidad
   ```
5. Abre un Pull Request

### Pautas de Desarrollo

- Sigue los estándares de JavaScript ES6+
- Mantén la compatibilidad con navegadores
- Añade documentación apropiada
- Incluye pruebas unitarias para nuevas características

## 📄 Licencia

[Licencia MIT](LICENSE) - siéntete libre de usar este proyecto comercialmente

## 👤 Autor

**Ernesto Barrera**

- GitHub: [@ernestobarrera](https://github.com/ernestobarrera)
- Bluesky: [@ernestob.bsky.social](https://bsky.app/profile/ernestob.bsky.social)

---

_Última actualización: Diciembre 2024_
