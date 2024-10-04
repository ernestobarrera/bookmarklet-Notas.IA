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
    </style>
</head><body>
    <div id="instructions">
        <b>Instrucciones:</b><br>
        1. Escribe o pega (Ctrl+Shift+V sin formato)<br>
        2. Usa Windows + H para dictar con la voz<br>
          2.1 Para puntuación y símbolos, di: "coma", "punto", "signo de interrogación", etc.<br>
          2.2 Comandos útiles: "nuevo párrafo", "borra eso", "detén el dictado"<br>
        3. Ctrl+S para guardar<br>
        4. Cerrar o F5 borra todo
    </div>
    <div id="notepad" contenteditable></div>
    <div id="buttonContainer">
        <button id="copyPlainButton" class="copyButton">Copiar texto plano</button>
        <button id="copyRichButton" class="copyButton">Copiar texto enriquecido</button>
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

  var newTab = window.open('about:blank', '_blank');
  newTab.document.write(doc.documentElement.outerHTML);
  newTab.document.close();
  newTab.onload = function () {
    newTab.document.getElementById('notepad').focus();
    newTab.document.addEventListener('keydown', saveNote);
    newTab.document.getElementById('copyPlainButton').addEventListener('click', copyPlainText.bind(newTab));
    newTab.document.getElementById('copyRichButton').addEventListener('click', copyRichText.bind(newTab));
  };
})();