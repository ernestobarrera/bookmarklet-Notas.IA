# Bookmarklet de Bloc de Notas con Funciones de Copiar y Dictado de Voz

Este repositorio contiene un bookmarklet que abre una nueva pestaña con un bloc de notas simple. Incluye botones para copiar el contenido como texto plano o texto enriquecido (HTML), permite guardar el contenido mediante `Ctrl + S` y soporta dictado de voz usando la tecla **Windows + H**.

## Características

- **Bloc de notas editable**: Un área donde puedes escribir o pegar texto.
- **Dictado de voz**: Usa **Windows + H** para activar el dictado de voz en Windows.
- **Copiar texto plano**: Botón que copia el contenido sin formato al portapapeles.
- **Copiar texto enriquecido**: Botón que copia el contenido con formato HTML al portapapeles.
- **Guardar contenido**: Presiona `Ctrl + S` para guardar el contenido como un archivo HTML.

## Instalación

1. **Crear el Bookmarklet**:

   - Copia todo el código del archivo `bookmarklet.js`.

   - Crea un nuevo marcador en tu navegador:

     - En **Chrome** y **Firefox**:

       1. Haz clic derecho en la barra de marcadores y selecciona "Añadir página" o "Agregar marcador".
       2. En el campo "Nombre", ingresa un nombre descriptivo, por ejemplo, "Bloc de Notas".
       3. En el campo "URL", pega el código del bookmarklet que copiaste.

   - **Nota**: Asegúrate de que el código del bookmarklet comience con `javascript:`.

2. **Permisos del Navegador**:

   - Algunos navegadores pueden requerir que permitas el acceso al portapapeles. Si es necesario, ajusta la configuración de seguridad de tu navegador para permitirlo.

## Uso

1. **Abrir el Bloc de Notas**:

   - Haz clic en el bookmarklet que creaste. Se abrirá una nueva pestaña con el bloc de notas.

2. **Escribir o Pegar Texto**:

   - Escribe directamente en el área de notas o pega texto usando `Ctrl + Shift + V` para pegar sin formato.

3. **Usar Dictado de Voz (Windows 10 y posteriores)**:

   - **Activar Dictado**:

     - Coloca el cursor en el área de notas.
     - Presiona **Windows + H** para abrir la barra de dictado de voz de Windows.

   - **Comenzar a Hablar**:

     - Una vez que aparezca la barra de dictado, comienza a hablar claramente.
     - El texto dictado aparecerá en el bloc de notas en tiempo real.

   - **Comandos Útiles**:

     - **Puntuación**: Di "coma", "punto", "signo de interrogación", "dos puntos", etc., para insertar puntuación.
     - **Nuevo Párrafo**: Di "nuevo párrafo" para comenzar en una nueva línea.
     - **Corrección**: Si cometes un error, puedes decir "borrar eso" para eliminar la última entrada.

   - **Desactivar Dictado**:

     - Presiona nuevamente **Windows + H** o haz clic en el icono del micrófono para detener el dictado.

   - **Consejos**:

     - Asegúrate de tener una conexión a internet, ya que el dictado de voz utiliza servicios en la nube.
     - Habla claramente y a un ritmo moderado para mejorar la precisión del reconocimiento.

4. **Copiar al Portapapeles**:

   - **Copiar Texto Plano**: Haz clic en el botón "Copiar texto plano" para copiar el contenido sin formato al portapapeles.
   - **Copiar Texto Enriquecido**: Haz clic en el botón "Copiar texto enriquecido" para copiar el contenido con formato HTML al portapapeles.

5. **Guardar Notas**:

   - Presiona `Ctrl + S` para guardar el contenido del bloc de notas como un archivo HTML.

6. **Borrar Contenido**:

   - Cierra la pestaña o presiona `F5` para borrar el contenido y empezar de nuevo.

## Personalización

Puedes personalizar el estilo y la funcionalidad modificando el código del bookmarklet:

- **Estilos CSS**: Modifica los estilos dentro de la etiqueta `<style>` para cambiar la apariencia del bloc de notas.
- **Funciones JavaScript**: Ajusta las funciones dentro de la etiqueta `<script>` para modificar el comportamiento.

## Compatibilidad

Este bookmarklet ha sido probado en navegadores modernos como:

- Google Chrome
- Mozilla Firefox
- Microsoft Edge

**Nota**:

- La función de dictado de voz con **Windows + H** está disponible en Windows 10 y versiones posteriores.
- Es posible que necesites habilitar el dictado de voz en la configuración de Windows antes de usarlo.

## Contribuciones

¡Las contribuciones son bienvenidas! Si deseas mejorar este proyecto:

- Haz un _fork_ del repositorio.
- Realiza tus modificaciones.
- Envía un _pull request_ con una descripción detallada de los cambios.

## Licencia

Este proyecto está licenciado bajo la [Licencia MIT](LICENSE).

## Autor

- [Tu Nombre](https://github.com/tu_usuario)
