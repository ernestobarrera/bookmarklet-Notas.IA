javascript: /*!
* Notes Editor Bookmarklet v1.0.0
* Last updated: 2024-12-04
* Autor: Ernesto Barrera 
* Repositorio: https://github.com/ernestobarrera/Bookmarklet-Notas
* License: MIT 
* Fuente legibilidad 
*/(function () {
  const LanguageDetector = {
    spanishPatterns: {
      articles: /\b(el|la|los|las|un|una|unos|unas)\b/gi,
      conjunctions: /\b(y|e|o|u|pero|sino|porque|que|si)\b/gi,
      prepositions: /\b(de|del|a|al|en|por|para|con|sin|sobre)\b/gi,
      pronouns: /\b(yo|tú|él|ella|nosotros|vosotros|ellos|ellas|me|te|se|nos|os)\b/gi,
      accents: /[áéíóúñ¿¡]/g,
      commonWords: /\b(está|son|ser|estar|tiene|hace|muy|más|también|todo|cuando|hay)\b/gi
    },

    englishPatterns: {
      articles: /\b(the|a|an)\b/gi,
      conjunctions: /\b(and|or|but|because|if|so)\b/gi,
      prepositions: /\b(in|on|at|to|for|with|by|from|of)\b/gi,
      pronouns: /\b(i|you|he|she|it|we|they|me|him|her|us|them)\b/gi,
      auxiliaries: /\b(is|are|was|were|have|has|had|do|does|did)\b/gi,
      commonWords: /\b(this|that|these|those|there|here|what|when|where|who|which)\b/gi
    },

    calculateLanguageScore: function (text, patterns) {
      let score = 0;
      for (const category in patterns) {
        const matches = text.match(patterns[category]) || [];
        score += matches.length;
      }
      return score;
    },

    detectTechnicalTerms: function (text) {
      const technicalPatterns = /\b(software|hardware|web|online|internet|email|smartphone|computer|app|website|cloud|server|database|api|framework|frontend|backend|browser|cookie|cache|debug|interface|network|plugin|script|update)\b/gi;
      const matches = text.match(technicalPatterns) || [];
      return matches.length;
    },

    analyzeLanguageDistribution: function (text) {
      const spanishScore = this.calculateLanguageScore(text, this.spanishPatterns);
      const englishScore = this.calculateLanguageScore(text, this.englishPatterns);
      const technicalTerms = this.detectTechnicalTerms(text);

      const adjustedEnglishScore = englishScore - (technicalTerms * 0.75);

      const total = spanishScore + adjustedEnglishScore;
      const spanishPercentage = (spanishScore / total) * 100;

      return {
        mainLanguage: spanishScore > adjustedEnglishScore ? 'es' : 'en',
        spanishPercentage: spanishPercentage.toFixed(1),
        technicalTerms: technicalTerms,
        isHybrid: spanishPercentage > 15 && spanishPercentage < 85
      };
    },

    generateLanguageReport: function (text) {
      const analysis = this.analyzeLanguageDistribution(text);

      let message = '';
      if (analysis.isHybrid) {
        message = `Texto mixto (${analysis.spanishPercentage}% español) con ${analysis.technicalTerms} términos técnicos. `;
        message += 'Aplicando análisis de legibilidad para el idioma predominante.';
      } else {
        message = analysis.mainLanguage === 'es'
          ? `Texto principalmente en español (${analysis.spanishPercentage}%) con terminología técnica.`
          : `Texto principalmente en inglés con algunos términos en español.`;
      }

      return {
        languageInfo: message,
        detectedLanguage: analysis.mainLanguage,
        isHybrid: analysis.isHybrid
      };
    }
  };
  /* Analizador de legibilidad */
  const ReadabilityAnalyzer = {
    countSyllables: function (word, lang) {
      word = word.toLowerCase();

      if (lang === 'es') {
        word = word.replace(/[áéíóú]/g, 'a')
          .replace(/[üï]/g, 'i')
          .replace(/[^a-z]/g, '');

        const diphthongs = /(ai|au|ei|eu|io|ou|oi|ui|iu|ie|ue|ua)/g;
        const triphthongs = /(uai|iai|uei|ioi)/g;

        const vowelGroups = word.match(/[aeiou]+/g) || [];
        let count = vowelGroups.length;

        const diphthongCount = (word.match(diphthongs) || []).length;
        const triphthongCount = (word.match(triphthongs) || []).length;

        count = count - diphthongCount - (triphthongCount * 2);

        return count || 1;
      } else {
        word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
          .replace(/^y/, '');

        return (word.match(/[aeiouy]{1,2}/g) || []).length || 1;
      }
    },

    calculateSpanishIndex: function (syllables, words, sentences) {
      return 206.835 - (62.3 * (syllables / words)) - (words / sentences);
    },

    calculateEnglishIndex: function (syllables, words, sentences) {
      return 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words));
    },

    interpretScore: function (score, lang) {
      if (lang === 'es') {
        if (score <= 40) return "Muy difícil (Nivel universitario o científico)";
        if (score <= 55) return "Algo difícil (Bachillerato, divulgación científica)";
        if (score <= 65) return "Normal (ESO, prensa general)";
        if (score <= 80) return "Bastante fácil (Educación primaria, prensa deportiva)";
        return "Muy fácil (Educación primaria, comics)";
      } else {
        if (score >= 90) return "Very easy (5th grade)";
        if (score >= 80) return "Easy (6th grade)";
        if (score >= 70) return "Fairly easy (7th grade)";
        if (score >= 60) return "Standard (8th-9th grade)";
        if (score >= 50) return "Fairly difficult (10th-12th grade)";
        if (score >= 30) return "Difficult (College)";
        return "Very difficult (College graduate)";
      }
    },

    analyzeText: function (text) {
      const languageInfo = LanguageDetector.generateLanguageReport(text);
      const lang = languageInfo.detectedLanguage;
      const cleanText = text.replace(/\s+/g, ' ').trim();
      const words = cleanText.split(/\s+/).filter(w => w.length > 0);
      const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);

      const syllables = words.reduce((acc, word) =>
        acc + this.countSyllables(word, lang), 0);

      const score = lang === 'es'
        ? this.calculateSpanishIndex(syllables, words.length, sentences.length)
        : this.calculateEnglishIndex(syllables, words.length, sentences.length);

      return {
        language: lang,
        syllables,
        words: words.length,
        sentences: sentences.length,
        syllablesPerWord: (syllables / words.length).toFixed(2),
        wordsPerSentence: (words.length / sentences.length).toFixed(2),
        readabilityScore: score.toFixed(2),
        interpretation: this.interpretScore(score, lang),
        languageInfo: languageInfo.languageInfo,
        isHybrid: languageInfo.isHybrid
      };
    }
  };
  /* Función para controlar la frecuencia de actualizaciones */
  const createDebouncer = function (originalFunction, waitTime) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => originalFunction.apply(this, args), waitTime);
    };
  };
  /* Función para obtener el contenido seleccionado */
  const getSelectedContent = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const clonedSelection = range.cloneContents();
      const div = document.createElement('div');
      div.appendChild(clonedSelection);
      return div.innerHTML;
    }
    return '';
  };

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
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              font-size: 1.3rem;
              margin: 0;
              padding: 1rem;
              background-color: #f0f0f0;
              min-height: 100vh;
              padding-bottom: 300px;
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
              min-height: 200px;
              padding: 0.5rem;
              border: 1px solid #ccc;
              border-radius: 5px;
              width: 95%;
              margin: 0 auto 0.5rem;
              font-size: 1.2rem;
              resize: vertical;
              overflow: auto;
              margin-bottom: 120px;
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
              padding: 0.7rem;
              box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
              max-height: 30vh;
              overflow-y: auto;
            }
        #statsContainer {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          background-color: #e0e0e0;
          padding: 0.7rem;
          border-radius: 5px;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }
        .statItem {
          text-align: center;
          margin: 0.3rem;
          flex: 1 1 calc(14% - 0.6rem);
          min-width: 80px;
           font-size: 0.8rem; 
        }
        .statValue {
          font-size: 1 rem;
          font-weight: bold;
        }
          #interpretation {
          font-size: 1rem;
          font-weight: normal;
          text-align: center;
          margin-top: 0.3rem;
        }

                    #styleInfo {
                      margin-top: 0.5rem;
                      font-size: 1rem;
                      line-height: 1.3;
                    }
                      #buttonContainer {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }
        .copyButton {
          padding: 0.4rem 0.8rem;
          font-size: 0.9rem;
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
        .footer {
            font-size: 0.8rem;
            text-align: center;
            padding: 0.3rem;
            color: #666;
            border-top: 1px solid #ddd;
              margin-bottom: 0;
        }

.footer a {
    color: #0366d6;
    text-decoration: none;
    transition: color 0.2s ease;
}

.footer a:hover {
    color: #0056b3;
    text-decoration: underline;
}       


#instructions {
  transition: max-height 0.3s ease-out, opacity 0.3s ease-out, margin 0.3s ease-out;
  max-height: 500px;
  opacity: 1;
  overflow: hidden;
}

#instructions.hidden {
  max-height: 0;
  opacity: 0;
  margin: 0;
  padding: 0;
}

#toggleInstructions {
  position: fixed;
  top: 10px;
  right: 10px;
  padding: 5px 10px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  z-index: 1000;
}

#fixedPanel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(240, 240, 240, 0.95);
  padding: 0.7rem;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, max-height 0.3s ease;
  max-height: 30vh;
  overflow-y: auto;
  transform: translateY(0);
}

#fixedPanel.minimized {
  transform: translateY(calc(100% - 40px));
}

#fixedPanel:hover.minimized {
  transform: translateY(0);
}

#notepad {
  background-color: white;
  min-height: 200px;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 95%;
  margin: 0 auto 0.5rem;
  font-size: 1.2rem;
  resize: vertical;
  overflow: auto;
  margin-bottom: 150px;
  line-height: 1.6;
  text-align: justify;
  hyphens: auto;
  word-wrap: break-word;    
</style>
                </head>
                <body>
                <button id="toggleInstructions">Mostrar/Ocultar Instrucciones</button>

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
                      <button id="undoButton" class="copyButton">Deshacer</button>
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
            <div>Frases</div>
            <div id="sentenceCount" class="statValue">0</div>
          </div>
          <div class="statItem">
            <div>Palabras/Frase</div>
            <div id="avgWordsPerSentence" class="statValue">0</div>
          </div>
          <div class="statItem">
            <div>Párrafos</div>
            <div id="paragraphCount" class="statValue">0</div>
          </div>
          <div class="statItem">
            <div>Tokens</div>
            <div id="tokenCount" class="statValue">0</div>
          </div>
          <div class="statItem">
            <div>Tiempo de lectura</div>
            <div id="readTime" class="statValue">0 min 0 seg</div>
          </div>
      
        <div id="interpretation">Resumen: Analizando texto...</div>

                    <div id="styleInfo"></div>
                  </div>


    <div id="footer" class="footer">
  <span>Creado por <a href="https://bsky.app/profile/ernestob.bsky.social" target="_blank" rel="noopener noreferrer">@ernestob</a> | Version: <span id="version">1.0.0</span> | <a href="https://github.com/ernestobarrera/Bookmarklet-Notas" target="_blank" rel="noopener noreferrer">Ver en GitHub</a></span>
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
  /* Nuevo para ampliar estadísticas */
  const countSentences = (text) => {
    /* Mejoramos la detección de final de frase incluyendo los signos en español */
    return text.split(/[.!?¡¿]+/)
      .filter(sentence => sentence.trim().length > 0)
      .length;
  };

  const calculateAverageWordsPerSentence = (wordCount, sentenceCount) => {
    if (wordCount === 0 || sentenceCount === 0) return "0";
    return (wordCount / sentenceCount).toFixed(1);
  };

  const countParagraphs = text => {
    return text.split(/(?:\r?\n){2,}|<\/p>|<br\s*\/?>\s*<br\s*\/?>/g)
      .filter(p => p.trim().length > 0).length;
  };

  const interpretMetrics = (metrics) => {
    if (metrics.wordCount === 0) {
      return "Analizando texto...";
    }

    let interpretation = "";

    if (metrics.wordCount < 100) {
      interpretation += "Texto corto. ";
    } else if (metrics.wordCount < 500) {
      interpretation += "Texto de longitud media. ";
    } else {
      interpretation += "Texto largo. ";
    }

    if (metrics.avgWordsPerSentence < 10) {
      interpretation += "Oraciones muy cortas, fácil de leer. ";
    } else if (metrics.avgWordsPerSentence < 20) {
      interpretation += "Oraciones de longitud moderada, buena legibilidad. ";
    } else {
      interpretation += "Oraciones largas, puede ser más difícil de leer. ";
    }

    if (metrics.paragraphCount < 3) {
      interpretation += "Pocos párrafos, considera dividir el texto para mejor lectura.";
    } else {
      interpretation += "Buena división en párrafos, facilita la lectura.";
    }

    return interpretation;
  };

  /* Función para preservar el historial de deshacer */
  const preserveUndoHistory = function (notepad, action) {
    const originalContent = notepad.innerHTML;
    action();
    if (originalContent !== notepad.innerHTML) {
      this.document.execCommand('insertHTML', false, notepad.innerHTML);
    }
  };
  /* Función para actualizar las estadísticas */
  const updateStats = function () {
    const notepad = this.document.getElementById('notepad');
    const text = notepad.innerText || notepad.textContent;

    /*    Estadísticas básicas existentes */
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    const charCount = text.replace(/\s+/g, '').length;
    const sentenceCount = countSentences(text);
    const avgWordsPerSentence = calculateAverageWordsPerSentence(wordCount, sentenceCount);
    const paragraphCount = countParagraphs(text);
    const tokenCount = text
      .toLowerCase()
      .replace(/[^\w\s']/g, '')
      .split(/\s+/)
      .filter(word => word.length > 1).length;

    /*     Tiempo de lectura */
    const wordsPerMinute = 250;
    const readTimeSeconds = Math.round((wordCount / wordsPerMinute) * 60);
    const minutes = Math.floor(readTimeSeconds / 60);
    const seconds = readTimeSeconds % 60;

    /* Análisis de legibilidad */
    let readabilityResults;
    if (ReadabilityAnalyzer && typeof ReadabilityAnalyzer.analyzeText === 'function') {
      readabilityResults = ReadabilityAnalyzer.analyzeText(text);
    } else {
      readabilityResults = {
        language: 'es',
        readabilityScore: 0,
        interpretation: ''
      };
    }
    /*  Actualizar todos los elementos */
    this.document.getElementById('wordCount').textContent = wordCount;
    this.document.getElementById('charCount').textContent = charCount;
    this.document.getElementById('sentenceCount').textContent = sentenceCount;
    this.document.getElementById('avgWordsPerSentence').textContent = avgWordsPerSentence;
    this.document.getElementById('paragraphCount').textContent = paragraphCount;
    this.document.getElementById('tokenCount').textContent = tokenCount;
    this.document.getElementById('readTime').textContent = `${minutes} min ${seconds} seg`;



    /* Actualizar interpretación */
    if (text.trim() === '') {
      this.document.getElementById('interpretation').innerHTML = "<b>Resumen:</b> Analizando texto...";
    } else {
      this.document.getElementById('interpretation').innerHTML =
        `<b>Resumen:</b> ${interpretMetrics({
          wordCount,
          charCount,
          sentenceCount,
          avgWordsPerSentence,
          paragraphCount,
          tokenCount
        })} Legibilidad: ${readabilityResults.interpretation} (Puntuación: ${readabilityResults.readabilityScore})`;
    }
  };
  /* Función para analizar estilos */
  const analyzeStyles = function () {
/*   1. Obtener elementos y configuración inicial
 */  const notepad = this.document.getElementById('notepad');
    const styleInfo = this.document.getElementById('styleInfo');
    const selection = this.window.getSelection();
    const styles = new Set();

    /*    2. Si no hay texto, limpiar y salir */
    if (notepad.innerText.trim() === '') {
      styleInfo.innerHTML = '';
      return;
    }
    /* 3. Función para analizar los estilos de un nodo */
    const analyzeNode = (node) => {
      const style = this.window.getComputedStyle(node);
      styles.add(`Fuente: ${style.fontFamily.split(',')[0].trim()}`);
      styles.add(`Tamaño: ${style.fontSize}`);
      styles.add(`Color: ${style.color}`);
      if (style.fontWeight !== 'normal') styles.add(`Peso: ${style.fontWeight}`);
      if (style.fontStyle !== 'normal') styles.add(`Estilo: ${style.fontStyle}`);
      if (style.textDecoration !== 'none') styles.add(`Decoración: ${style.textDecoration}`);
    };

    /* 4. Analizar según si hay selección o no */
    if (selection && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const container = range.commonAncestorContainer;
      if (container.nodeType === Node.TEXT_NODE) {
        analyzeNode(container.parentNode);
      } else {
        analyzeNode(container);
      }
      styleInfo.innerHTML = '<b>Estilos detectados en la selección:</b> ' + Array.from(styles).join(' | ');
    } else {
      analyzeNode(notepad);
      styleInfo.innerHTML = '<b>Estilos detectados:</b> ' + Array.from(styles).join(' | ');
    }
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
  /* Función para preservar selección */
  const preserveSelection = (notepad, action) => {
    const selection = window.getSelection();
    const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

    action();

    if (range) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
    notepad.focus();
  };

  /* Función para copiar texto plano */
  const copyPlainText = function () {
    const notepad = this.document.getElementById('notepad');
    preserveUndoHistory.call(this, notepad, () => {
      const text = notepad.innerText || notepad.textContent;
      this.navigator.clipboard.writeText(text);
    });
  };

  /* Función para copiar texto enriquecido */
  const copyRichText = function () {
    const notepad = this.document.getElementById('notepad');
    preserveUndoHistory.call(this, notepad, () => {
      const range = this.document.createRange();
      range.selectNodeContents(notepad);
      const selection = this.window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      this.document.execCommand('copy');
      selection.removeAllRanges();
    });
  };

  /* Función para limpiar el texto */
  const clearText = function () {
    const notepad = this.document.getElementById('notepad');
    preserveUndoHistory.call(this, notepad, () => {
      notepad.innerHTML = '';
    });
    updateStats.call(this);
    notepad.focus();
  };

  /* Función para deshacer */
  const undo = function () {
    this.document.execCommand('undo');
    updateStats.call(this);
    this.document.getElementById('notepad').focus();
  };

  /* Función para convertir Markdown y copiar */
  const convertMarkdownAndCopy = function () {
    const notepad = this.document.getElementById('notepad');
    const originalContent = notepad.innerHTML;
    let markdown = notepad.innerText || notepad.textContent;

    const markdownRegex = /(\*\*|__|\*|_|~~|`|\[|\]|\(|\)|#|>|-|\d+\.|\!)/;
    if (!markdownRegex.test(markdown)) {
      notepad.focus();
      return;
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

    preserveUndoHistory.call(this, notepad, () => {
      notepad.innerHTML = html;
    });

    copyRichText.call(this);
    updateStats.call(this);
    notepad.focus();
  };

  /* Función principal */
  const main = () => {
    /* Detector de idioma */



    const selectedContent = getSelectedContent();
    const doc = createHTMLDocument();
    const newTab = window.open('about:blank', '_blank');
    newTab.document.write(doc.documentElement.outerHTML);
    newTab.document.close();

    newTab.onload = function () {
      const notepad = this.document.getElementById('notepad');
      if (selectedContent) {
        notepad.innerHTML = selectedContent;
      }

      notepad.focus();
      const debouncedUpdate = createDebouncer(function () {
        updateStats.call(this);
        analyzeStyles.call(this);
      }, 300).bind(this);

      notepad.addEventListener('input', debouncedUpdate);
      notepad.addEventListener('mouseup', debouncedUpdate);
      this.document.addEventListener('keydown', function (e) {
        saveNote.call(this, e);
      }.bind(this));

      notepad.addEventListener('keydown', function (e) {
        if (e.ctrlKey && e.key === 'z') {
          updateStats.call(this);
        }
      }.bind(this));
      this.document.getElementById('copyPlainButton').addEventListener('click', copyPlainText.bind(this));
      this.document.getElementById('copyRichButton').addEventListener('click', copyRichText.bind(this));
      this.document.getElementById('convertMarkdownButton').addEventListener('click', convertMarkdownAndCopy.bind(this));
      this.document.getElementById('clearButton').addEventListener('click', clearText.bind(this));
      this.document.getElementById('undoButton').addEventListener('click', undo.bind(this));
      const toggleInstructionsBtn = this.document.getElementById('toggleInstructions');
      const instructions = this.document.getElementById('instructions');
      toggleInstructionsBtn.addEventListener('click', function () {
        instructions.classList.toggle('hidden');
      });
      let lastScrollTop = 0;
      notepad.addEventListener('scroll', function () {
        const fixedPanel = this.document.getElementById('fixedPanel');
        const currentScroll = notepad.scrollTop;

        if (currentScroll > lastScrollTop && currentScroll > 100) {
          fixedPanel.classList.add('minimized');
        } else {
          fixedPanel.classList.remove('minimized');
        }

        lastScrollTop = currentScroll;
      }.bind(this));
      notepad.addEventListener('paste', function (e) {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        const processedText = text
          .replace(/[\r\n]{3,}/g, '\n\n')
          .replace(/\s{2,}/g, ' ');
        this.document.execCommand('insertText', false, processedText);
      }.bind(this));
      updateStats.call(this);
    };
  };

  main();
})();