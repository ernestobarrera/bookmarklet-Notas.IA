javascript: (function () {
  /* Función para obtener el texto seleccionado */
  const getSelectedText = () => window.getSelection().toString();

  /* Función para crear el documento HTML */
  const createHTMLDocument = () => {
    const doc = document.implementation.createHTMLDocument("NOTAS");
    doc.documentElement.innerHTML = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>NOTAS</title>
          <style>
            body {
              font: 1.8rem/1.5 monospace;
              margin: 0;
              padding: 1rem;
              padding-bottom: 220px;
              background-color: #f0f0f0;
              height: 100vh;
              box-sizing: border-box;
            }
            #instructions {
              background-color: #e0e0e0;
              padding: 0.7rem;
              margin-bottom: 0.7rem;
              border-radius: 5px;
              font-size: 1rem;
              line-height: 1.3;
            }
            #notepad {
              background-color: white;
              min-height: 300px;
              padding: 1rem;
              border: 1px solid #ccc;
              border-radius: 5px;
              width: 95%;
              margin: 0 auto 1rem;
              font-size: 1.7rem;
              resize: vertical;
              overflow: auto;
              margin-bottom: 220px; /* Ajuste para permitir scroll completo */
            }
            #notepad a {
              color: #0066cc;
              text-decoration: underline;
              cursor: pointer;
            }
            #fixedPanel {
              position: fixed;
              bottom: 0;
              left: 0;
              right: 0;
              background-color: #f0f0f0;
              padding: 1rem;
              box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
            }
            #buttonContainer {
              display: flex;
              justify-content: center;
              gap: 1rem;
              flex-wrap: wrap;
              margin-bottom: 1rem;
            }
            .copyButton {
              padding: 0.5rem 1rem;
              font-size: 1rem;
              background-color: #4CAF50;
              color: white;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
              transition: all 0.3s ease;
            }
            #clearButton {
              background-color: #f44336;
            }
            .copyButton:hover {
              opacity: 0.9;
            }
            .copyButton:active {
              box-shadow: 0 1px 2px rgba(0,0,0,0.2);
              transform: translateY(2px);
            }
            #statsContainer {
              display: flex;
              justify-content: space-around;
              flex-wrap: wrap;
              background-color: #e0e0e0;
              padding: 0.7rem;
              border-radius: 5px;
              font-size: 1rem;
            }
            .statItem {
              text-align: center;
              margin: 0.5rem;
              flex: 1 1 auto;
            }
            .statValue {
              font-size: 1.2rem;
              font-weight: bold;
            }
            #styleInfo {
              margin-top: 0.5rem;
              font-size: 1rem;
              line-height: 1.3;
            }
          </style>
        </head>
        <body>
          <div id="instructions">
            <b>Instrucciones:</b><br>
            1. Escribe o pega (Ctrl+Shift+V sin formato)<br>
            2. Usa Windows + H para dictar con la voz<br>
              2.1 Para puntuación y símbolos, di: "coma", "punto", "signo de interrogación", etc.<br>
              2.2 Comandos útiles: "nuevo párrafo", "borra eso", "detén el dictado"<br>
            3. Ctrl+S para guardar<br>
            4. Cerrar o F5 borra todo<br>
            5. Atajos útiles: Ctrl+Z: Deshacer | Ctrl+Y o Ctrl+Shift+Z: Rehacer | Ctrl+X: Cortar | Ctrl+C: Copiar | Ctrl+V: Pegar | Ctrl+A: Seleccionar todo
          </div>
          <div id="notepad" contenteditable></div>
          <div id="fixedPanel">
            <div id="buttonContainer">
              <button id="copyPlainButton" class="copyButton">Copiar texto plano</button>
              <button id="copyRichButton" class="copyButton">Copiar texto enriquecido</button>
              <button id="convertMarkdownButton" class="copyButton">Convertir Markdown y Copiar</button>
              <button id="clearButton" class="copyButton">Limpiar texto</button>
              <button id="undoButton" class="copyButton">Deshacer</button>
            </div>
            <div id="statsContainer">
              <div class="statItem">
                <div>Palabras</div>
                <div id="wordCount" class="statValue">0</div>
              </div>
              <div class="statItem">
                <div>Caracteres</div>
                <div id="charCount" class="statValue">0</div>
              </div>
              <div class="statItem">
                <div>Tokens</div>
                <div id="tokenCount" class="statValue">0</div>
              </div>
              <div class="statItem">
                <div>Tiempo de lectura</div>
                <div id="readTime" class="statValue">0 min 0 seg</div>
              </div>
            </div>
            <div id="styleInfo"></div>
          </div>
        </body>
      </html>
    `;
    return doc;
  };

  /* Función para formatear la fecha */
  const formatDate = (date) => {
    const pad = (num) => String(num).padStart(2, '0');
    const d = new Date(date);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
  };

  /* Función para actualizar las estadísticas */
  const updateStats = function () {
    const notepad = this.document.getElementById('notepad');
    const text = notepad.innerText || notepad.textContent;

    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    const chars = text.length;
    const tokens = Math.ceil(chars / 4);
    const wordsPerMinute = 250;
    const minutes = Math.floor(words / wordsPerMinute);
    const seconds = Math.round((words % wordsPerMinute) / (wordsPerMinute / 60));

    this.document.getElementById('wordCount').textContent = words;
    this.document.getElementById('charCount').textContent = chars;
    this.document.getElementById('tokenCount').textContent = tokens;
    this.document.getElementById('readTime').textContent = `${minutes} min ${seconds} seg`;

    analyzeStyles.call(this);
  };

  /* Función para analizar estilos */
  const analyzeStyles = function () {
    const notepad = this.document.getElementById('notepad');
    const styleInfo = this.document.getElementById('styleInfo');
    const styles = new Set();

    if (notepad.innerText.trim() === '') {
      styleInfo.innerHTML = ''; /* No mostrar estilos si no hay texto */
      return;
    }

    const style = this.window.getComputedStyle(notepad);
    styles.add(`Fuente: ${style.fontFamily.split(',')[0].trim()}`);
    styles.add(`Tamaño: ${style.fontSize}`);
    styles.add(`Color: ${style.color}`);

    styleInfo.innerHTML = '<b>Estilos detectados:</b> ' + Array.from(styles).join(' | ');
  };

  /* Función para guardar la nota */
  const saveNote = function (e) {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      const fileName = `NOTAS_${formatDate(new Date())}.html`;
      const blob = new Blob([this.document.getElementById('notepad').innerHTML], { type: 'text/html' });
      const a = this.document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = fileName;
      a.style.display = 'none';
      this.document.body.appendChild(a);
      a.click();
      this.document.body.removeChild(a);
    }
  };

  /* Función para copiar texto plano */
  const copyPlainText = function () {
    const notepad = this.document.getElementById('notepad');
    const text = notepad.innerText || notepad.textContent;
    this.navigator.clipboard.writeText(text);
  };

  /* Función para copiar texto enriquecido */
  const copyRichText = function () {
    const notepad = this.document.getElementById('notepad');
    const range = this.document.createRange();
    range.selectNodeContents(notepad);
    const selection = this.window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    this.document.execCommand('copy');
    selection.removeAllRanges();
  };

  /* Función para limpiar el texto */
  const clearText = function () {
    const notepad = this.document.getElementById('notepad');
    notepad.innerHTML = '';
    updateStats.call(this);
    notepad.focus(); /* Posicionar el cursor en la caja después de limpiar */
  };

  /* Función para deshacer */
  const undo = function () {
    this.document.execCommand('undo');
    updateStats.call(this);
  };

  /* Función para convertir Markdown y copiar */
  const convertMarkdownAndCopy = function () {
    const notepad = this.document.getElementById('notepad');
    let markdown = notepad.innerText || notepad.textContent;

    const markdownRegex = /(\*\*|__|\*|_|~~|`|\[|\]|\(|\)|#|>|-|\d+\.|\!)/;
    if (!markdownRegex.test(markdown)) {
      return; /* Si no hay Markdown, simplemente salimos de la función sin hacer nada */
    }

    markdown = markdown.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    const markdownToHtml = {
      h1: [/^# (.*$)/gim, '<h1>$1</h1>'],
      h2: [/^## (.*$)/gim, '<h2>$1</h2>'],
      h3: [/^### (.*$)/gim, '<h3>$1</h3>'],
      h4: [/^#### (.*$)/gim, '<h4>$1</h4>'],
      h5: [/^##### (.*$)/gim, '<h5>$1</h5>'],
      h6: [/^###### (.*$)/gim, '<h6>$1</h6>'],
      bold: [/\*\*(.*?)\*\*/gim, '<strong>$1</strong>'],
      italic: [/\*(.*?)\*/gim, '<em>$1</em>'],
      strikethrough: [/~~(.*?)~~/gim, '<del>$1</del>'],
      blockquote: [/^\> (.*$)/gim, '<blockquote>$1</blockquote>'],
      unorderedList: [/^[\*\-] (.*$)/gim, '<ul><li>$1</li></ul>'],
      orderedList: [/^\d+\. (.*$)/gim, '<ol><li>$1</li></ol>'],
      code: [/`(.*?)`/gim, '<code>$1</code>'],
      link: [/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>'],
      image: [/!\[(.*?)\]\((.*?)\)/gim, '<img alt="$1" src="$2">'],
      horizontalRule: [/^(?:---|\*\*\*|-\s-\s-)$/gim, '<hr>'],
      lineBreak: [/\n\n/g, '<br><br>']
    };

    let html = markdown;
    for (const [, [regex, replacement]] of Object.entries(markdownToHtml)) {
      html = html.replace(regex, replacement);
    }

    html = html.replace(/<\/ul><ul>|<\/ol><ol>/gim, '').trim();

    notepad.innerHTML = html;
    copyRichText.call(this);
    updateStats.call(this);
  };

  /* Función principal */
  const main = () => {
    const selectedText = getSelectedText();
    const doc = createHTMLDocument();
    const newTab = window.open('about:blank', '_blank');
    newTab.document.write(doc.documentElement.outerHTML);
    newTab.document.close();

    newTab.onload = function () {
      const notepad = this.document.getElementById('notepad');
      if (selectedText) {
        notepad.innerText = selectedText;
      }

      notepad.focus();
      notepad.addEventListener('input', updateStats.bind(this));
      this.document.addEventListener('keydown', saveNote.bind(this));
      this.document.getElementById('copyPlainButton').addEventListener('click', copyPlainText.bind(this));
      this.document.getElementById('copyRichButton').addEventListener('click', copyRichText.bind(this));
      this.document.getElementById('convertMarkdownButton').addEventListener('click', convertMarkdownAndCopy.bind(this));
      this.document.getElementById('clearButton').addEventListener('click', clearText.bind(this));
      this.document.getElementById('undoButton').addEventListener('click', undo.bind(this));

      updateStats.call(this);
    };
  };

  main();
})();