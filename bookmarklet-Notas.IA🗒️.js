javascript:/*!
 * Smart Editor Pro v3.1 (CSP Bypass Edition)
 * Autor: Ernesto Barrera
 * Updated: 2025-01-11
 */
(function () {
  'use strict';

  /* 1. Capturar contenido de la página actual antes de salir */
  function getSelectedContent() {
    try {
      var selection = window.getSelection();
      if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
        return '';
      }
      var container = document.createElement('div');
      for (var i = 0; i < selection.rangeCount; i++) {
        container.appendChild(selection.getRangeAt(i).cloneContents());
      }
      return container.innerHTML;
    } catch (e) {
      console.warn('Error capturando selección:', e);
      return '';
    }
  }

  const initialContent = getSelectedContent();

  /* 2. Definir todo el código de la aplicación que correrá dentro del Blob */
  const appCode = function () {

    /* === LÓGICA CORE (Copiada y adaptada) === */

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
        const spanishPercentage = total > 0 ? (spanishScore / total) * 100 : 50;
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
          message = analysis.mainLanguage == 'es' ?
            `Texto principalmente en español (${analysis.spanishPercentage}%) con terminología técnica.` :
            `Texto principalmente en inglés con algunos términos en español.`;
        }
        return {
          languageInfo: message,
          detectedLanguage: analysis.mainLanguage,
          isHybrid: analysis.isHybrid
        };
      }
    };

    const ReadabilityAnalyzer = {
      countSyllables: function (word, lang) {
        word = word.toLowerCase();
        if (lang === 'es') {
          word = word.replace(/[áéíóú]/g, 'a').replace(/[üï]/g, 'i').replace(/[^a-z]/g, '');
          const diphthongs = /(ai|au|ei|eu|io|ou|oi|ui|iu|ie|ue|ua)/g;
          const triphthongs = /(uai|iai|uei|ioi)/g;
          const vowelGroups = word.match(/[aeiou]+/g) || [];
          let count = vowelGroups.length;
          const diphthongCount = (word.match(diphthongs) || []).length;
          const triphthongCount = (word.match(triphthongs) || []).length;
          count = count - diphthongCount - (triphthongCount * 2);
          return Math.max(count, 1);
        } else {
          word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
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
        if (!text || text.trim() === '') {
          return {
            language: 'es', syllables: 0, words: 0, sentences: 0, syllablesPerWord: "0", wordsPerSentence: "0", readabilityScore: "0", interpretation: "Sin texto para analizar", languageInfo: "", isHybrid: false
          };
        }
        const languageInfo = LanguageDetector.generateLanguageReport(text);
        const lang = languageInfo.detectedLanguage;
        const cleanText = text.replace(/\s+/g, ' ').trim();
        const words = cleanText.split(/\s+/).filter(w => w.length > 0);

        /* Uso de lógica de oraciones igual a triggerSave */
        let sentences = 0;
        if (typeof Intl !== 'undefined' && Intl.Segmenter) {
          try {
            const segmenter = new Intl.Segmenter(undefined, { granularity: 'sentence' });
            sentences = Array.from(segmenter.segment(text)).filter(s => /[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]/.test(s.segment)).length;
          } catch (e) { sentences = 0; }
        }
        if (sentences === 0) {
          sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
        }

        if (words.length === 0 || sentences === 0) {
          return {
            language: lang, syllables: 0, words: 0, sentences: 0, syllablesPerWord: "0", wordsPerSentence: "0", readabilityScore: "0", interpretation: "Texto muy corto", languageInfo: languageInfo.languageInfo, isHybrid: languageInfo.isHybrid
          };
        }

        const syllables = words.reduce((acc, word) => acc + this.countSyllables(word, lang), 0);
        const score = lang === 'es' ?
          this.calculateSpanishIndex(syllables, words.length, sentences) :
          this.calculateEnglishIndex(syllables, words.length, sentences);

        return {
          language: lang,
          syllables,
          words: words.length,
          sentences: sentences,
          syllablesPerWord: (syllables / words.length).toFixed(2),
          wordsPerSentence: (words.length / sentences).toFixed(2),
          readabilityScore: score.toFixed(2),
          interpretation: this.interpretScore(score, lang),
          languageInfo: languageInfo.languageInfo,
          isHybrid: languageInfo.isHybrid
        };
      }
    };

    const MarkdownConverter = {
      convert: function (markdown) {
        if (!markdown) return '';
        let html = markdown;
        const codeBlocks = [];
        html = html.replace(/```([\s\S]*?)```/g, function (match, code) {
          codeBlocks.push(`<pre><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`);
          return `%%CODEBLOCK${codeBlocks.length - 1}%%`;
        });
        const inlineCodes = [];
        html = html.replace(/`([^`\n]+)`/g, function (match, code) {
          inlineCodes.push(`<code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>`);
          return `%%INLINECODE${inlineCodes.length - 1}%%`;
        });

        let lines = html.split('\n');
        let processedLines = [];
        let inList = false;
        let listType = '';
        let listItems = [];

        for (let i = 0; i < lines.length; i++) {
          let line = lines[i];
          let processed = false;
          if (/^### /.test(line)) { if (inList) { processedLines.push(this.closeList(listItems, listType)); inList = false; listItems = []; } processedLines.push(line.replace(/^### (.+)$/, '<h3>$1</h3>')); processed = true; }
          else if (/^## /.test(line)) { if (inList) { processedLines.push(this.closeList(listItems, listType)); inList = false; listItems = []; } processedLines.push(line.replace(/^## (.+)$/, '<h2>$1</h2>')); processed = true; }
          else if (/^# /.test(line)) { if (inList) { processedLines.push(this.closeList(listItems, listType)); inList = false; listItems = []; } processedLines.push(line.replace(/^# (.+)$/, '<h1>$1</h1>')); processed = true; }
          else if (/^---+$/.test(line.trim())) { if (inList) { processedLines.push(this.closeList(listItems, listType)); inList = false; listItems = []; } processedLines.push('<hr>'); processed = true; }
          else if (/^> /.test(line)) { if (inList) { processedLines.push(this.closeList(listItems, listType)); inList = false; listItems = []; } processedLines.push(line.replace(/^> (.+)$/, '<blockquote>$1</blockquote>')); processed = true; }
          else if (/^[\*\-\+] /.test(line)) { let item = line.replace(/^[\*\-\+] (.+)$/, '$1'); if (!inList || listType !== 'ul') { if (inList) processedLines.push(this.closeList(listItems, listType)); inList = true; listType = 'ul'; listItems = []; } listItems.push(item); processed = true; }
          else if (/^\d+\. /.test(line)) { let item = line.replace(/^\d+\. (.+)$/, '$1'); if (!inList || listType !== 'ol') { if (inList) processedLines.push(this.closeList(listItems, listType)); inList = true; listType = 'ol'; listItems = []; } listItems.push(item); processed = true; }
          else if (inList && line.trim() !== '') { processedLines.push(this.closeList(listItems, listType)); inList = false; listItems = []; }

          if (!processed) { if (!inList) processedLines.push(line); }
        }
        if (inList) processedLines.push(this.closeList(listItems, listType));
        html = processedLines.join('\n');

        html = html.replace(/\*\*\*([^\*]+)\*\*\*/g, '<b><i>$1</i></b>');
        html = html.replace(/\*\*([^\*]+)\*\*/g, '<b>$1</b>');
        html = html.replace(/__([^_]+)__/g, '<b>$1</b>');
        html = html.replace(/(?<!\*)\*([^\*\n]+)\*(?!\*)/g, '<i>$1</i>');
        html = html.replace(/(?<!_)_([^_\n]+)_(?!_)/g, '<i>$1</i>');
        html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>');
        html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" style="max-width:100%">');
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

        html = html.replace(/%%CODEBLOCK(\d+)%%/g, (match, index) => codeBlocks[parseInt(index)]);
        html = html.replace(/%%INLINECODE(\d+)%%/g, (match, index) => inlineCodes[parseInt(index)]);
        html = html.replace(/\n(?!<\/?(h[1-6]|p|div|blockquote|pre|ul|ol|li|hr))/g, '<br>\n');
        html = html.replace(/(<br>\n){3,}/g, '<br>\n<br>\n');
        return html;
      },
      closeList: function (items, type) {
        if (items.length === 0) return '';
        let listHtml = `<${type}>`;
        items.forEach(item => {
          item = item.replace(/\*\*\*([^\*]+)\*\*\*/g, '<b><i>$1</i></b>');
          item = item.replace(/\*\*([^\*]+)\*\*/g, '<b>$1</b>');
          item = item.replace(/(?<!\*)\*([^\*]+)\*(?!\*)/g, '<i>$1</i>');
          item = item.replace(/~~([^~]+)~~/g, '<del>$1</del>');
          item = item.replace(/`([^`]+)`/g, '<code>$1</code>');
          listHtml += `<li>${item}</li>`;
        });
        listHtml += `</${type}>`;
        return listHtml;
      },
      detectAndConvert: function (text) {
        if (!text) return '';
        const hasMarkdown = /^#{1,3} /m.test(text) || /\*\*[^\*]+\*\*/g.test(text) || /\*[^\*\n]+\*/g.test(text) || /~~[^~]+~~/g.test(text) || /\[.+?\]\(.+?\)/.test(text) || /^> /m.test(text) || /^[\*\-\+] /m.test(text) || /^\d+\. /m.test(text) || /```[\s\S]*?```/.test(text) || /`[^`]+`/.test(text) || /^---+$/m.test(text);
        if (hasMarkdown) return this.convert(text);
        return text;
      }
    };

    const createDebouncer = function (originalFunction, waitTime) {
      let timer;
      return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => originalFunction.apply(this, args), waitTime);
      };
    };

    const safeSetHTML = (element, html) => {
      try {
        if (window.trustedTypes && window.trustedTypes.createPolicy) {
          const policy = window.trustedTypes.createPolicy('bookmarklet-policy-' + Math.random(), {
            createHTML: (input) => input
          });
          element.innerHTML = policy.createHTML(html);
        } else {
          element.innerHTML = html;
        }
      } catch (e) {
        try { element.innerHTML = html; } catch (err) { console.error('HTML set failed', err); }
      }
    };

    /* Helpers */
    const formatDate = (date) => {
      const pad = (num) => String(num).padStart(2, '0');
      const d = new Date(date);
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    };

    const countSentences = (text) => {
      if (typeof Intl !== 'undefined' && Intl.Segmenter) {
        try {
          const segmenter = new Intl.Segmenter(undefined, { granularity: 'sentence' });
          return Array.from(segmenter.segment(text)).filter(s => /[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]/.test(s.segment)).length;
        } catch (e) { }
      }
      return text.split(/[.!?¡¿]+/).filter(sentence => sentence.trim().length > 1).length;
    };

    const calculateAverageWordsPerSentence = (wordCount, sentenceCount) => {
      if (wordCount === 0 || sentenceCount === 0) return "0";
      return (wordCount / sentenceCount).toFixed(1);
    };

    const countParagraphs = text => {
      const paragraphs = text.split(/\n{2,}|(<\/p>|<br\s*\/?>\s*<br\s*\/?>)/g).filter(p => p && p.trim().length > 1);
      return paragraphs.length || (text.trim() ? 1 : 0);
    };

    const interpretMetrics = (metrics) => {
      if (metrics.wordCount === 0) return "Esperando texto...";
      let interpretation = "";
      if (metrics.wordCount < 100) interpretation += "Texto corto. ";
      else if (metrics.wordCount < 500) interpretation += "Texto de longitud media. ";
      else interpretation += "Texto largo. ";
      if (metrics.avgWordsPerSentence < 10) interpretation += "Oraciones muy cortas, fácil de leer. ";
      else if (metrics.avgWordsPerSentence < 20) interpretation += "Oraciones de longitud moderada. ";
      else interpretation += "Oraciones largas. ";
      return interpretation;
    };

    const showNotification = function (message, type = 'success') {
      const notification = document.createElement('div');
      notification.textContent = message;
      notification.className = `notification ${type}`;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    };

    const showActionFeedback = function (message, type = 'success') {
      const feedbackEl = document.getElementById('actionFeedback');
      if (feedbackEl) {
        feedbackEl.textContent = message;
        feedbackEl.style.color = type === 'error' ? '#f44336' : '#4CAF50';
        feedbackEl.classList.add('visible');
        setTimeout(() => feedbackEl.classList.remove('visible'), 4000);
      }
    };

    const updateStats = function () {
      try {
        const notepad = document.getElementById('notepad');
        const text = notepad.innerText || notepad.textContent || '';
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        const wordCount = words.length;
        const charCount = text.replace(/\s+/g, '').length;
        const sentenceCount = countSentences(text);
        const avgWordsPerSentence = calculateAverageWordsPerSentence(wordCount, sentenceCount);
        const paragraphCount = countParagraphs(text);
        const wordsPerMinute = 250;
        const readTimeSeconds = Math.round((wordCount / wordsPerMinute) * 60);
        const minutes = Math.floor(readTimeSeconds / 60);
        const seconds = readTimeSeconds % 60;
        let readabilityResults = ReadabilityAnalyzer.analyzeText(text);

        document.getElementById('wordCount').textContent = wordCount;
        document.getElementById('charCount').textContent = charCount;
        document.getElementById('sentenceCount').textContent = sentenceCount;
        document.getElementById('avgWordsPerSentence').textContent = avgWordsPerSentence;
        document.getElementById('paragraphCount').textContent = paragraphCount;
        document.getElementById('readTime').textContent = `${minutes} min ${seconds} seg`;

        if (text.trim() === '') {
          document.getElementById('interpretation').innerHTML = "<b>Resumen:</b> Esperando texto...";
        } else {
          const metrics = interpretMetrics({ wordCount, charCount, sentenceCount, avgWordsPerSentence, paragraphCount });
          document.getElementById('interpretation').innerHTML = `<b>Resumen:</b> ${metrics} Legibilidad: ${readabilityResults.interpretation} (Puntuación: ${readabilityResults.readabilityScore})`;
        }
      } catch (error) { console.error('Error stats:', error); }
    };

    const triggerSave = function () {
      const defaultFileName = `NOTAS_${formatDate(new Date())}.html`;
      const fileName = prompt('Introduce el nombre del archivo:', defaultFileName);
      if (fileName === null) { showActionFeedback('Guardado cancelado', 'error'); return; }
      const finalFileName = fileName || defaultFileName;
      const blob = new Blob([document.getElementById('notepad').innerHTML], { type: 'text/html' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = finalFileName;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showActionFeedback(`Archivo guardado como '${finalFileName}'`);
    };

    const triggerSaveMarkdown = function () {
      const defaultFileName = `NOTA_${formatDate(new Date())}.md`;
      const fileName = prompt('Guardar como Markdown:', defaultFileName);
      if (fileName === null) return;
      const noteContent = document.getElementById('notepad').innerText || '';
      const blob = new Blob([noteContent], { type: 'text/markdown' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = fileName || defaultFileName;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showActionFeedback('Guardado como Markdown');
    };

    /* Botones y Eventos */
    const copyPlainText = function () {
      const text = document.getElementById('notepad').innerText;
      navigator.clipboard.writeText(text).then(() => showNotification('Texto plano copiado'))
        .catch(() => showNotification('Error al copiar', 'error'));
    };

    const copyRichText = function () {
      const notepad = document.getElementById('notepad');
      const htmlContent = notepad.innerHTML;
      const textContent = notepad.innerText;
      const clipboardData = [new ClipboardItem({ 'text/html': new Blob([htmlContent], { type: 'text/html' }), 'text/plain': new Blob([textContent], { type: 'text/plain' }) })];
      navigator.clipboard.write(clipboardData).then(() => showNotification('Texto enriquecido copiado')).catch(() => showNotification('Error al copiar', 'error'));
    };

    const convertMarkdownAndCopy = function () {
      const notepad = document.getElementById('notepad');
      const currentText = notepad.innerText;
      const html = MarkdownConverter.convert(currentText);
      saveToHistory();
      safeSetHTML(notepad, html);
      updateStats();
      const clipboardData = [new ClipboardItem({ 'text/html': new Blob([html], { type: 'text/html' }), 'text/plain': new Blob([currentText], { type: 'text/plain' }) })];
      navigator.clipboard.write(clipboardData).then(() => showNotification('Convertido y Copiado')).catch(() => showNotification('Convertido'));
    };

    let undoHistory = [];
    let redoHistory = [];
    const saveToHistory = function () {
      const notepad = document.getElementById('notepad');
      undoHistory.push(notepad.innerHTML);
      if (undoHistory.length > 50) undoHistory.shift();
      redoHistory = [];
    };
    const undo = function () {
      if (undoHistory.length > 0) {
        redoHistory.push(document.getElementById('notepad').innerHTML);
        safeSetHTML(document.getElementById('notepad'), undoHistory.pop());
        updateStats();
        showActionFeedback('Cambio deshecho');
      }
    };
    const clearText = function () {
      saveToHistory();
      safeSetHTML(document.getElementById('notepad'), '');
      updateStats();
      showActionFeedback('Limpiado');
    };

    /* INICIALIZACIÓN */
    const notepad = document.getElementById('notepad');
    if (window.INITIAL_CONTENT) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = window.INITIAL_CONTENT;
      const textContent = tempDiv.innerText || '';

      /* Detección inicial de Markdown vs HTML */
      if (!/<[^>]+>/.test(window.INITIAL_CONTENT) || window.INITIAL_CONTENT === textContent) {
        const converted = MarkdownConverter.detectAndConvert(textContent);
        safeSetHTML(notepad, converted);
        if (converted !== textContent) showNotification('Markdown convertido');
      } else {
        safeSetHTML(notepad, window.INITIAL_CONTENT);
        showNotification('HTML cargado');
      }
    }

    /* Listeners básicos */
    const debouncedUpdate = createDebouncer(updateStats, 300);
    notepad.addEventListener('input', () => { saveToHistory(); debouncedUpdate(); });
    notepad.addEventListener('paste', (e) => {
      saveToHistory();
      /* Lógica de pegado simple por ahora */
      setTimeout(() => {
        /* Check si lo pegado parece markdown */
        const text = notepad.innerText;
        const converted = MarkdownConverter.detectAndConvert(text);
        debouncedUpdate();
      }, 100);
    });

    document.addEventListener('keydown', (e) => { if (e.ctrlKey && e.key === 's') { e.preventDefault(); triggerSave(); } });
    document.getElementById('saveButton').addEventListener('click', triggerSave);
    document.getElementById('saveMarkdownButton').addEventListener('click', triggerSaveMarkdown);
    document.getElementById('copyPlainButton').addEventListener('click', copyPlainText);
    document.getElementById('copyRichButton').addEventListener('click', copyRichText);
    document.getElementById('convertMarkdownButton').addEventListener('click', convertMarkdownAndCopy);
    document.getElementById('undoButton').addEventListener('click', undo);
    document.getElementById('clearButton').addEventListener('click', clearText);
    document.getElementById('toggleInstructions').addEventListener('click', function () {
      document.getElementById('instructions').classList.toggle('hidden');
    });

    /* Theme */
    const toggleThemeBtn = document.getElementById('toggleTheme');
    toggleThemeBtn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    });
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    updateStats();
    notepad.focus();
  };

  /* 3. Definir estilos CSS */
  const styles = `
    :root { --bg-color:#f0f0f0; --text-color:#333; --header-bg:rgba(250,250,250,.95); --header-border:#e0e0e0; --notepad-bg:#fff; --notepad-text:#000; --panel-bg:rgba(250,250,250,.97); --panel-text:#333; --stat-bg:#fff; --stat-text:#666; --stat-value:#2196F3; }
    [data-theme="dark"] { --bg-color:#1a1a1a; --text-color:#e0e0e0; --header-bg:rgba(30,30,30,.95); --header-border:#444; --notepad-bg:#2d2d2d; --notepad-text:#e0e0e0; --panel-bg:rgba(30,30,30,.97); --panel-text:#e0e0e0; --stat-bg:#383838; --stat-text:#aaa; --stat-value:#64b5f6; }
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;font-size:1.3rem;margin:0;padding:50px 1rem 1rem;background-color:var(--bg-color);color:var(--text-color);min-height:100vh;box-sizing:border-box;transition:background-color .3s,color .3s}
    #header{position:fixed;top:0;left:0;right:0;display:flex;justify-content:space-between;align-items:center;padding:8px 15px;background-color:var(--header-bg);backdrop-filter:blur(5px);border-bottom:1px solid var(--header-border);z-index:1001;transition:background-color .3s,border-color .3s}
    #branding-title{font-size:1rem;font-weight:600;color:var(--panel-text)}
    #header-hints{display:flex;align-items:center;gap:15px;font-size:.8rem;color:var(--stat-text)}
    button{cursor:pointer}
    #saveButton{padding:.3rem .7rem;font-size:.8rem;color:#fff;border:none;border-radius:5px;background-color:#007bff;transition:all .2s ease}
    #saveButton:hover{background-color:#0056b3}
    #toggleTheme{padding:.3rem .7rem;font-size:.8rem;background:transparent;border:1px solid var(--stat-text);color:var(--stat-text);border-radius:5px;transition:all .2s ease}
    #toggleInstructions{padding:5px 10px;background:#6c757d;color:#fff;border:none;border-radius:5px;box-shadow:0 1px 2px rgba(0,0,0,.1)}
    #instructions{background-color:var(--header-border);color:var(--text-color);padding:.7rem;margin-bottom:1.5rem;border-radius:5px;font-size:1rem;position:relative;z-index:100;max-height:2000px;overflow-y:auto;opacity:1;transition:all .3s ease-out}
    #instructions.hidden{max-height:0;opacity:0;margin:0;padding:0;overflow:hidden}
    #notepad{background-color:var(--notepad-bg);color:var(--notepad-text);min-height:300px;padding:.5rem;border:1px solid #ccc;border-radius:5px;width:95%;margin:1rem auto 120px;font-size:1.2rem;resize:vertical;overflow:auto;line-height:1.6;text-align:justify;hyphens:auto;word-wrap:break-word}
    #notepad blockquote{border-left:3px solid #ccc;margin-left:0;padding-left:1rem;color:#666}
    #notepad code{background:#f4f4f4;padding:2px 4px;border-radius:3px;font-family:monospace;color:#333}
    #fixedPanel{position:fixed;bottom:0;left:0;right:0;background-color:var(--panel-bg);color:var(--panel-text);box-shadow:0 -2px 10px rgba(0,0,0,.1);border-top:1px solid var(--header-border);z-index:1000;padding:.3rem;transition:transform .3s ease,max-height .3s ease,background-color .3s;max-height:30vh;overflow-y:auto}
    #fixedPanel.minimized{transform:translateY(calc(100% - 38px))}
    #statsContainer{max-height:0;overflow:hidden;opacity:0;transition:all .3s ease}
    #fixedPanel:hover #statsContainer{max-height:500px;opacity:1;padding:8px;margin-bottom:8px;background-color:var(--bg-color);border-radius:4px}
    .stats-row{display:flex;justify-content:space-between;align-items:stretch;gap:8px;margin-bottom:8px}
    .statItem{flex:1;text-align:center;background-color:var(--stat-bg);color:var(--stat-text);padding:8px 4px;border-radius:4px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 1px 3px rgba(0,0,0,.1)}
    .statValue{font-size:1rem;color:var(--stat-value);font-weight:500}
    #interpretation{width:100%;text-align:center;padding:8px;background-color:var(--stat-bg);color:var(--stat-text);border-radius:4px;margin-top:8px;font-size:.9rem;box-shadow:0 1px 3px rgba(0,0,0,.1)}
    #buttonContainer{display:flex;justify-content:center;gap:.5rem;padding:4px 0}
    .copyButton{padding:.4rem .8rem;font-size:.9rem;color:#fff;border:none;border-radius:5px;background-color:#4CAF50;box-shadow:0 2px 4px rgba(0,0,0,.2)}
    #copyPlainButton{background-color:#4CAF50} #copyRichButton{background-color:#2196F3} #undoButton{background-color:#607D8B} #clearButton{background-color:#F44336} #convertMarkdownButton{background-color:#9C27B0} #saveMarkdownButton{background-color:#ff9800}
    .notification{position:fixed;top:60px;left:50%;transform:translateX(-50%);padding:10px 20px;border-radius:5px;color:#fff;font-size:.9rem;z-index:10002;background-color:#333;animation:fadeIn .3s ease}
    #actionFeedback{font-size:.8rem;text-align:center;color:var(--text-color);height:0;opacity:0;transition:all .3s}
    #actionFeedback.visible{height:auto;opacity:1;padding:4px 0}
  `;

  /* 4. Construir el HTML final */
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Notas.IA Editor</title>
        <style>${styles}</style>
    </head>
    <body>
        <div id="header">
            <div id="branding-title">Smart Editor Pro <sup>v3.1</sup></div>
            <div id="header-hints">
                <span>💾 Ctrl+S</span>
                <button id="toggleTheme" title="Cambiar tema">🌗</button>
                <button id="saveButton">Guardar HTML</button>
                <button id="toggleInstructions">Instrucciones</button>
            </div>
        </div>
        <div id="instructions" class="hidden">
            <h3>📝 Guía Rápida de Uso</h3>
            <p>Bienvenido a Smart Editor Pro. Has capturado el contenido seleccionado de la web.</p>
            <ul>
                <li>✍️ <b>Edita:</b> Modifica el texto libremente. El análisis se actualiza solo.</li>
                <li>📊 <b>Analiza:</b> Revisa la legibilidad y estadísticas en el panel inferior.</li>
                <li>💾 <b>Exporta:</b> Guarda tu trabajo como archivo HTML o Markdown.</li>
                <li>🌓 <b>Tema:</b> Alterna entre modo claro y oscuro según tu preferencia.</li>
            </ul>
            <p style="font-size:0.9em; margin-top:10px"><i>Truco: Pulsa <b>Ctrl+S</b> para guardar rápidamente tu nota.</i></p>
        </div>
        <div id="notepad" contenteditable="true" spellcheck="true"></div>
        <div id="fixedPanel">
            <div id="statsContainer">
                <div class="stats-row">
                    <div class="statItem"><div>Palabras</div><div id="wordCount" class="statValue">0</div></div>
                    <div class="statItem"><div>Caracteres</div><div id="charCount" class="statValue">0</div></div>
                    <div class="statItem"><div>Frases</div><div id="sentenceCount" class="statValue">0</div></div>
                    <div class="statItem"><div>Pal/Frase</div><div id="avgWordsPerSentence" class="statValue">0</div></div>
                    <div class="statItem"><div>Párrafos</div><div id="paragraphCount" class="statValue">0</div></div>
                    <div class="statItem"><div>Tiempo</div><div id="readTime" class="statValue">0 min</div></div>
                </div>
                <div id="interpretation"></div>
            </div>
            <div id="actionFeedback"></div>
            <div id="buttonContainer">
                <button id="copyPlainButton" class="copyButton">Copiar Texto</button>
                <button id="copyRichButton" class="copyButton" style="background-color:#2196F3">Copiar Rico</button>
                <button id="convertMarkdownButton" class="copyButton" style="background-color:#9C27B0">MD → HTML</button>
                <button id="saveMarkdownButton" class="copyButton" style="background-color:#ff9800">Guardar .md</button>
                <button id="undoButton" class="copyButton" style="background-color:#607D8B">Deshacer</button>
                <button id="clearButton" class="copyButton" style="background-color:#F44336">Limpiar</button>
            </div>
            <div style="font-size:0.7rem;text-align:center;color:var(--stat-text);margin-top:5px">
                Panel minimizable al hacer click fuera de los botones
            </div>
        </div>
        <script>
            window.INITIAL_CONTENT = ${JSON.stringify(initialContent)};
            (${appCode.toString()})();
        <\/script>
    </body>
    </html>
  `;

  /* 5. Crear Blob y abrir ventana */
  try {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank', 'width=950,height=800,toolbar=no,menubar=no,location=no,status=no');
    if (!win) {
      alert('Por favor, permite las ventanas emergentes (pop-ups) para usar el editor.');
    }
  } catch (e) {
    console.error("Error iniciando Smart Editor:", e);
    alert("Error iniciando el editor: " + e.message);
  }

})();