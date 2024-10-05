javascript: (function () {
  var doc = document.implementation.createHTMLDocument("NOTAS");
  doc.documentElement.innerHTML = `<html><head>
    <meta charset="utf-8">
    <title>NOTAS</title>
    <style>
        body {
            font: 1.8rem/1.5 monospace;
            margin: 0;
            padding: 1rem;
            background-color: #f0f0f0;
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
        .copyButton:hover {
            background-color: #45a049;
        }
        .copyButton:active {
            background-color: #3d8b40;
            box-shadow: 0 1px 2px rgba(0,0,0,0.2);
            transform: translateY(2px);
        }
        #statsContainer {
            display: flex;
            justify-content: space-around;
            background-color: #e0e0e0;
            padding: 0.7rem;
            border-radius: 5px;
            font-size: 1rem;
            margin-bottom: 1rem;
        }
        .statItem {
            text-align: center;
        }
        .statValue {
            font-size: 1.2rem;
            font-weight: bold;
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
        5. Atajos útiles:<br>
          • Ctrl+Z: Deshacer<br>
          • Ctrl+Y o Ctrl+Shift+Z: Rehacer<br>
          • Ctrl+X: Cortar<br>
          • Ctrl+C: Copiar<br>
          • Ctrl+V: Pegar<br>
          • Ctrl+A: Seleccionar todo
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
    </div>
    <div id="notepad" contenteditable></div>
    <div id="buttonContainer">
        <button id="copyPlainButton" class="copyButton">Copiar texto plano</button>
        <button id="copyRichButton" class="copyButton">Copiar texto enriquecido</button>
        <button id="convertMarkdownButton" class="copyButton">Convertir Markdown y Copiar</button>
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

  function convertMarkdownAndCopy() {
    var notepad = this.document.getElementById('notepad');
    var markdown = notepad.innerText || notepad.textContent;

    /* Verificar si el contenido es Markdown */
    var markdownRegex = /(\*\*|__|\*|_|~~|`|\[|\]|\(|\)|#|>|-|\d+\.|\!)/;
    if (!markdownRegex.test(markdown)) {
      alert("No se detectó contenido Markdown. No se realizaron cambios.");
      return;
    }

    /* Convertir Markdown a HTML */
    var html = markdown
      /* Encabezados */
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
      .replace(/^##### (.*$)/gim, '<h5>$1</h5>')
      .replace(/^###### (.*$)/gim, '<h6>$1</h6>')
      /* Negrita */
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      /* Cursiva */
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      /* Tachado */
      .replace(/~~(.*?)~~/gim, '<del>$1</del>')
      /* Citas */
      .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
      /* Listas no ordenadas */
      .replace(/^\* (.*$)/gim, '<ul><li>$1</li></ul>')
      .replace(/^- (.*$)/gim, '<ul><li>$1</li></ul>')
      /* Listas ordenadas */
      .replace(/^\d+\. (.*$)/gim, '<ol><li>$1</li></ol>')
      /* Código en línea */
      .replace(/`(.*?)`/gim, '<code>$1</code>')
      /* Enlaces */
      .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
      /* Imágenes */
      .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img alt="$1" src="$2">')
      /* Líneas horizontales */
      .replace(/^(?:---|\*\*\*|-\s-\s-)$/gim, '<hr>')
      /* Saltos de línea */
      .replace(/\n$/gim, '<br />');

    /* Limpiar etiquetas de lista anidadas incorrectamente */
    html = html.replace(/<\/ul><ul>/gim, '')
      .replace(/<\/ol><ol>/gim, '');

    /* Actualizar el contenido del notepad con el HTML convertido */
    notepad.innerHTML = html;

    /* Copiar el contenido HTML al portapapeles */
    var range = this.document.createRange();
    range.selectNodeContents(notepad);
    var selection = this.window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    this.document.execCommand('copy');
    selection.removeAllRanges();

    /* Actualizar estadísticas */
    updateStats();
  }

  function updateStats() {
    var notepad = this.document.getElementById('notepad');
    var text = notepad.innerText || notepad.textContent;

    /* Contar palabras */
    var words = text.trim().split(/\s+/).length;
    this.document.getElementById('wordCount').textContent = words;

    /* Contar caracteres */
    var chars = text.length;
    this.document.getElementById('charCount').textContent = chars;

    /* Contar tokens (estimación aproximada) */
    var tokens = Math.ceil(chars / 4); /* Estimación aproximada */
    this.document.getElementById('tokenCount').textContent = tokens;
  }

  var newTab = window.open('about:blank', '_blank');
  newTab.document.write(doc.documentElement.outerHTML);
  newTab.document.close();
  newTab.onload = function () {
    var notepad = newTab.document.getElementById('notepad');
    notepad.focus();
    notepad.addEventListener('input', updateStats.bind(newTab));
    newTab.document.addEventListener('keydown', saveNote);
    newTab.document.getElementById('copyPlainButton').addEventListener('click', copyPlainText.bind(newTab));
    newTab.document.getElementById('copyRichButton').addEventListener('click', copyRichText.bind(newTab));
    newTab.document.getElementById('convertMarkdownButton').addEventListener('click', convertMarkdownAndCopy.bind(newTab));
    updateStats.call(newTab); /* Inicializar estadísticas */
  };
})();