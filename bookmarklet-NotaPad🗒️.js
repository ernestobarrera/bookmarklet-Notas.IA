javascript: (function () {
  /* Obtener texto seleccionado de la página actual */
  var selectedText = window.getSelection().toString();

  var doc = document.implementation.createHTMLDocument("NOTAS");
  doc.documentElement.innerHTML = `<html><head>
    <meta charset="utf-8">
    <title>NOTAS</title>
    <style>
        body {
            font: 1.8rem/1.5 monospace;
            margin: 0;
            padding: 1rem;
            padding-bottom: 220px; /* Ajustado para el panel fijo */
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
</head><body>
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
</body></html>`;

  function formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear(),
      hour = '' + d.getHours(),
      minute = '' + d.getMinutes(),
      second = '' + d.getSeconds();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    if (hour.length < 2) hour = '0' + hour;
    if (minute.length < 2) minute = '0' + minute;
    if (second.length < 2) second = '0' + second;
    return [year, month, day, hour, minute, second].join('-');
  }

  function updateStats() {
    var notepad = this.document.getElementById('notepad');
    var text = notepad.innerText || notepad.textContent;

    /* Contar palabras */
    var words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    this.document.getElementById('wordCount').textContent = words;

    /* Contar caracteres */
    var chars = text.length;
    this.document.getElementById('charCount').textContent = chars;

    /* Contar tokens (estimación aproximada) */
    var tokens = Math.ceil(chars / 4);
    this.document.getElementById('tokenCount').textContent = tokens;

    /* Calcular tiempo de lectura */
    var wordsPerMinute = 250;
    var minutes = Math.floor(words / wordsPerMinute);
    var seconds = Math.round((words % wordsPerMinute) / (wordsPerMinute / 60));
    this.document.getElementById('readTime').textContent = `${minutes} min ${seconds} seg`;

    /* Analizar estilos solo del área de texto */
    analyzeStyles.call(this);
  }

  function analyzeStyles() {
    var notepad = this.document.getElementById('notepad');
    var styleInfo = this.document.getElementById('styleInfo');
    var fonts = new Set();
    var sizes = new Set();
    var colors = new Set();

    function getComputedStylesForNode(node) {
      var style = this.window.getComputedStyle(node);
      fonts.add(style.fontFamily.split(',')[0].trim());
      sizes.add(style.fontSize);
      colors.add(style.color);
    }

    /* Solo analizar el notepad y sus elementos hijos */
    getComputedStylesForNode.call(this, notepad);
    var textNodes = notepad.getElementsByTagName('*');
    for (var i = 0; i < textNodes.length; i++) {
      getComputedStylesForNode.call(this, textNodes[i]);
    }

    /* Mostrar estilos en una línea */
    var styleText = '<b>Estilos detectados:</b> ';
    var styles = [];
    if (fonts.size) styles.push('Fuentes: ' + Array.from(fonts).join(', '));
    if (sizes.size) styles.push('Tamaños: ' + Array.from(sizes).join(', '));
    if (colors.size) styles.push('Colores: ' + Array.from(colors).join(', '));
    styleInfo.innerHTML = styleText + styles.join(' | ');
  }

  function saveNote(e) {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      var now = new Date();
      var fileName = 'NOTAS_' + formatDate(now) + '.html';
      var blob = new Blob(
        [e.target.ownerDocument.getElementById('notepad').innerHTML],
        { type: 'text/html' }
      );
      var a = e.target.ownerDocument.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = fileName;
      a.style.display = 'none';
      e.target.ownerDocument.body.appendChild(a);
      a.click();
      e.target.ownerDocument.body.removeChild(a);
    }
  }

  function copyPlainText() {
    var notepad = this.document.getElementById('notepad');
    var text = notepad.innerText || notepad.textContent;
    this.navigator.clipboard.writeText(text);
  }

  function copyRichText() {
    var notepad = this.document.getElementById('notepad');
    var range = this.document.createRange();
    range.selectNodeContents(notepad);
    var selection = this.window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    this.document.execCommand('copy');
    selection.removeAllRanges();
  }

  function clearText() {
    var notepad = this.document.getElementById('notepad');
    notepad.innerHTML = '';
    updateStats.call(this);
  }

  function convertMarkdownAndCopy() {
    var notepad = this.document.getElementById('notepad');
    var markdown = notepad.innerText || notepad.textContent;

    var markdownRegex = /(\*\*|__|\*|_|~~|`|\[|\]|\(|\)|#|>|-|\d+\.|\!)/;
    if (!markdownRegex.test(markdown)) {
      alert("No se detectó contenido Markdown. No se realizaron cambios.");
      return;
    }

    /* Normalizar los saltos de línea antes de la conversión */
    markdown = markdown.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    var html = markdown
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
      .replace(/^##### (.*$)/gim, '<h5>$1</h5>')
      .replace(/^###### (.*$)/gim, '<h6>$1</h6>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/~~(.*?)~~/gim, '<del>$1</del>')
      .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/^\* (.*$)/gim, '<ul><li>$1</li></ul>')
      .replace(/^- (.*$)/gim, '<ul><li>$1</li></ul>')
      .replace(/^\d+\. (.*$)/gim, '<ol><li>$1</li></ol>')
      .replace(/`(.*?)`/gim, '<code>$1</code>')
      .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank">$1</a>')
      .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img alt="$1" src="$2">')
      .replace(/^(?:---|\*\*\*|-\s-\s-)$/gim, '<hr>')
      .replace(/\n\n/g, '<br><br>');

    html = html
      .replace(/<\/ul><ul>/gim, '')
      .replace(/<\/ol><ol>/gim, '')
      .trim();

    notepad.innerHTML = html;

    var range = this.document.createRange();
    range.selectNodeContents(notepad);
    var selection = this.window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    this.document.execCommand('copy');
    selection.removeAllRanges();

    updateStats.call(this);
  }

  var newTab = window.open('about:blank', '_blank');
  newTab.document.write(doc.documentElement.outerHTML);
  newTab.document.close();
  newTab.onload = function () {
    var notepad = newTab.document.getElementById('notepad');

    /* Insertar texto seleccionado si existe */
    if (selectedText) {
      notepad.innerText = selectedText;
    }

    notepad.focus();
    notepad.addEventListener('input', updateStats.bind(newTab));
    newTab.document.addEventListener('keydown', saveNote);
    newTab.document.getElementById('copyPlainButton').addEventListener('click', copyPlainText.bind(newTab));
    newTab.document.getElementById('copyRichButton').addEventListener('click', copyRichText.bind(newTab));
    newTab.document.getElementById('convertMarkdownButton').addEventListener('click', convertMarkdownAndCopy.bind(newTab));
    newTab.document.getElementById('clearButton').addEventListener('click', clearText.bind(newTab));
    updateStats.call(newTab);
  };
})();