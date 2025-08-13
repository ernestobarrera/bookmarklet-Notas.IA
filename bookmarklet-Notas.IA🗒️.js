javascript:/*!
 * Smart Editor Pro v3.0 Last updated: 2025-01-11
 * Autor: Ernesto Barrera (con mejoras de IA)
 * Repositorio: https://github.com/ernestobarrera/Bookmarklet-Notas
 * License: MIT
 */
(function () {
  'use strict';

  /* Verificación de seguridad inicial */
  if (window.location.hostname.includes('google.com') ||
    window.location.hostname.includes('facebook.com') ||
    window.location.hostname.includes('twitter.com')) {
    if (!confirm('Este sitio tiene restricciones de seguridad estrictas. El bookmarklet podría no funcionar correctamente. ¿Deseas continuar?')) {
      return;
    }
  }

  try {
    /* Detector de Idioma */
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
          message = analysis.mainLanguage == 'es'
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

    /* Analizador de Legibilidad */
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
            language: 'es',
            syllables: 0,
            words: 0,
            sentences: 0,
            syllablesPerWord: "0",
            wordsPerSentence: "0",
            readabilityScore: "0",
            interpretation: "Sin texto para analizar",
            languageInfo: "",
            isHybrid: false
          };
        }
        const languageInfo = LanguageDetector.generateLanguageReport(text);
        const lang = languageInfo.detectedLanguage;
        const cleanText = text.replace(/\s+/g, ' ').trim();
        const words = cleanText.split(/\s+/).filter(w => w.length > 0);
        const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);

        if (words.length === 0 || sentences.length === 0) {
          return {
            language: lang,
            syllables: 0,
            words: 0,
            sentences: 0,
            syllablesPerWord: "0",
            wordsPerSentence: "0",
            readabilityScore: "0",
            interpretation: "Texto muy corto para analizar",
            languageInfo: languageInfo.languageInfo,
            isHybrid: languageInfo.isHybrid
          };
        }

        const syllables = words.reduce((acc, word) => acc + this.countSyllables(word, lang), 0);
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

    /* Conversor de Markdown Mejorado */
    const MarkdownConverter = {
      convert: function (markdown) {
        if (!markdown) return '';

        let html = markdown;

        /* Preservar bloques de código primero */
        const codeBlocks = [];
        html = html.replace(/```([\s\S]*?)```/g, function (match, code) {
          codeBlocks.push(`<pre><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`);
          return `%%CODEBLOCK${codeBlocks.length - 1}%%`;
        });

        /* Preservar código inline */
        const inlineCodes = [];
        html = html.replace(/`([^`\n]+)`/g, function (match, code) {
          inlineCodes.push(`<code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>`);
          return `%%INLINECODE${inlineCodes.length - 1}%%`;
        });

        /* Dividir por líneas para procesar línea por línea */
        let lines = html.split('\n');
        let processedLines = [];
        let inList = false;
        let listType = '';
        let listItems = [];

        for (let i = 0; i < lines.length; i++) {
          let line = lines[i];
          let processed = false;

          /* Títulos (deben estar al inicio de línea) */
          if (/^### /.test(line)) {
            if (inList) {
              processedLines.push(this.closeList(listItems, listType));
              inList = false;
              listItems = [];
            }
            processedLines.push(line.replace(/^### (.+)$/, '<h3>$1</h3>'));
            processed = true;
          } else if (/^## /.test(line)) {
            if (inList) {
              processedLines.push(this.closeList(listItems, listType));
              inList = false;
              listItems = [];
            }
            processedLines.push(line.replace(/^## (.+)$/, '<h2>$1</h2>'));
            processed = true;
          } else if (/^# /.test(line)) {
            if (inList) {
              processedLines.push(this.closeList(listItems, listType));
              inList = false;
              listItems = [];
            }
            processedLines.push(line.replace(/^# (.+)$/, '<h1>$1</h1>'));
            processed = true;
          }

          /* Línea horizontal */
          else if (/^---+$/.test(line.trim())) {
            if (inList) {
              processedLines.push(this.closeList(listItems, listType));
              inList = false;
              listItems = [];
            }
            processedLines.push('<hr>');
            processed = true;
          }

          /* Blockquote */
          else if (/^> /.test(line)) {
            if (inList) {
              processedLines.push(this.closeList(listItems, listType));
              inList = false;
              listItems = [];
            }
            processedLines.push(line.replace(/^> (.+)$/, '<blockquote>$1</blockquote>'));
            processed = true;
          }

          /* Listas no ordenadas */
          else if (/^[\*\-\+] /.test(line)) {
            let item = line.replace(/^[\*\-\+] (.+)$/, '$1');
            if (!inList || listType !== 'ul') {
              if (inList) {
                processedLines.push(this.closeList(listItems, listType));
              }
              inList = true;
              listType = 'ul';
              listItems = [];
            }
            listItems.push(item);
            processed = true;
          }

          /* Listas ordenadas */
          else if (/^\d+\. /.test(line)) {
            let item = line.replace(/^\d+\. (.+)$/, '$1');
            if (!inList || listType !== 'ol') {
              if (inList) {
                processedLines.push(this.closeList(listItems, listType));
              }
              inList = true;
              listType = 'ol';
              listItems = [];
            }
            listItems.push(item);
            processed = true;
          }

          /* Si no es elemento de lista y estábamos en lista, cerrarla */
          else if (inList && line.trim() !== '') {
            processedLines.push(this.closeList(listItems, listType));
            inList = false;
            listItems = [];
          }

          /* Líneas normales o vacías */
          if (!processed) {
            if (!inList) {
              processedLines.push(line);
            }
          }
        }

        /* Cerrar lista si quedó abierta */
        if (inList) {
          processedLines.push(this.closeList(listItems, listType));
        }

        /* Unir líneas procesadas */
        html = processedLines.join('\n');

        /* Aplicar formato inline (negrita, cursiva, etc.) */
        /* IMPORTANTE: Procesar de más específico a menos específico */

        /* Bold + Italic (tres asteriscos) */
        html = html.replace(/\*\*\*([^\*]+)\*\*\*/g, '<b><i>$1</i></b>');

        /* Bold (dos asteriscos o guiones bajos) */
        html = html.replace(/\*\*([^\*]+)\*\*/g, '<b>$1</b>');
        html = html.replace(/__([^_]+)__/g, '<b>$1</b>');

        /* Italic (un asterisco o guión bajo) - cuidado con no capturar listas */
        html = html.replace(/(?<!\*)\*([^\*\n]+)\*(?!\*)/g, '<i>$1</i>');
        html = html.replace(/(?<!_)_([^_\n]+)_(?!_)/g, '<i>$1</i>');

        /* Strikethrough */
        html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>');

        /* Enlaces e imágenes */
        html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" style="max-width:100%">');
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

        /* Restaurar bloques de código */
        html = html.replace(/%%CODEBLOCK(\d+)%%/g, function (match, index) {
          return codeBlocks[parseInt(index)];
        });

        /* Restaurar código inline */
        html = html.replace(/%%INLINECODE(\d+)%%/g, function (match, index) {
          return inlineCodes[parseInt(index)];
        });

        /* Convertir saltos de línea simples en <br> pero no después de elementos de bloque */
        html = html.replace(/\n(?!<\/?(h[1-6]|p|div|blockquote|pre|ul|ol|li|hr))/g, '<br>\n');

        /* Limpiar múltiples <br> consecutivos */
        html = html.replace(/(<br>\n){3,}/g, '<br>\n<br>\n');

        return html;
      },

      closeList: function (items, type) {
        if (items.length === 0) return '';
        let listHtml = `<${type}>`;
        items.forEach(item => {
          /* Aplicar formato inline a los items de lista */
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

        /* Detecta si el texto tiene sintaxis Markdown */
        const hasMarkdown =
          /^#{1,3} /m.test(text) ||
          /\*\*[^\*]+\*\*/g.test(text) ||
          /\*[^\*\n]+\*/g.test(text) ||
          /~~[^~]+~~/g.test(text) ||
          /\[.+?\]\(.+?\)/.test(text) ||
          /^> /m.test(text) ||
          /^[\*\-\+] /m.test(text) ||
          /^\d+\. /m.test(text) ||
          /```[\s\S]*?```/.test(text) ||
          /`[^`]+`/.test(text) ||
          /^---+$/m.test(text);

        if (hasMarkdown) {
          return this.convert(text);
        }
        return text;
      }
    };

    /* Funciones de utilidad */
    const createDebouncer = function (originalFunction, waitTime) {
      let timer;
      return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => originalFunction.apply(this, args), waitTime);
      };
    };

    const getSelectedContent = () => {
      try {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
          return '';
        }
        const range = selection.getRangeAt(0);
        const container = document.createElement('div');
        try {
          container.appendChild(range.cloneContents());
        } catch (e) {
          return selection.toString();
        }
        return container.innerHTML || selection.toString();
      } catch (error) {
        console.warn('Error obteniendo selección:', error);
        return '';
      }
    };

    /* Función segura para establecer HTML */
    const safeSetHTML = (element, html) => {
      try {
        if (window.trustedTypes && window.trustedTypes.createPolicy) {
          const policy = window.trustedTypes.createPolicy('bookmarklet-policy', {
            createHTML: (input) => input
          });
          element.innerHTML = policy.createHTML(html);
        } else {
          element.innerHTML = html;
        }
      } catch (e) {
        /* Fallback: crear elementos manualmente */
        element.textContent = '';
        const temp = document.createElement('template');
        temp.innerHTML = html;
        element.appendChild(temp.content.cloneNode(true));
      }
    };

    /* Crear documento HTML */
    const createHTMLDocument = () => {
      const doc = document.implementation.createHTMLDocument("Smart Editor Pro");

      /* CSS */
      const style = doc.createElement('style');
      style.textContent = `
                body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;font-size:1.3rem;margin:0;padding:50px 1rem 1rem;background-color:#f0f0f0;min-height:100vh;box-sizing:border-box}
                #header{position:fixed;top:0;left:0;right:0;display:flex;justify-content:space-between;align-items:center;padding:8px 15px;background-color:rgba(250,250,250,.95);backdrop-filter:blur(5px);border-bottom:1px solid #e0e0e0;z-index:1001}
                #branding-title{font-size:1rem;font-weight:600;color:#333}
                #branding-title sup{font-size:.7rem;color:#888}
                #header-hints{display:flex;align-items:center;gap:15px;font-size:.8rem;color:#555}
                #saveButton{padding:.3rem .7rem;font-size:.8rem;color:#fff;border:none;border-radius:5px;cursor:pointer;background-color:#007bff;transition:all .2s ease}
                #saveButton:hover{background-color:#0056b3}
                #toggleInstructions{padding:5px 10px;background:#6c757d;color:#fff;border:none;border-radius:5px;cursor:pointer;box-shadow:0 1px 2px rgba(0,0,0,.1);transition:background-color .2s ease}
                #toggleInstructions:hover{background-color:#5a6268}
                #instructions{background-color:#e0e0e0;padding:.7rem;margin-bottom:1.5rem;border-radius:5px;font-size:1rem;line-height:1.3;position:relative;z-index:100;transition:all .3s ease-out;max-height:2000px;overflow-y:auto;opacity:1}
                #instructions.hidden{max-height:0;opacity:0;margin:0;padding:0;overflow:hidden}
                #instructions ul{margin:0.5rem 0}
                #instructions li{margin:0.3rem 0}
                #notepad{background-color:#fff;min-height:300px;padding:.5rem;border:1px solid #ccc;border-radius:5px;width:95%;margin:1rem auto 120px;font-size:1.2rem;resize:vertical;overflow:auto;position:relative;z-index:1;scroll-behavior:auto;transition:margin-top .3s ease-out;line-height:1.6;text-align:justify;hyphens:auto;word-wrap:break-word}
                #notepad p{margin-top:0;margin-bottom:1rem}
                #notepad h1,#notepad h2,#notepad h3{margin-top:1rem;margin-bottom:0.5rem}
                #notepad a{color:#0066cc;text-decoration:underline;cursor:pointer}
                #notepad blockquote{border-left:3px solid #ccc;margin-left:0;padding-left:1rem;color:#666}
                #notepad code{background:#f4f4f4;padding:2px 4px;border-radius:3px;font-family:monospace}
                #notepad pre{background:#f4f4f4;padding:1rem;border-radius:5px;overflow-x:auto}
                #notepad ul,#notepad ol{margin-left:1.5rem}
                #fixedPanel{position:fixed;bottom:0;left:0;right:0;background-color:rgba(250,250,250,.97);box-shadow:0 -2px 10px rgba(0,0,0,.1);border-top:1px solid #e5e5e5;z-index:1000;padding:.3rem;transition:transform .3s ease,max-height .3s ease;max-height:30vh;overflow-y:auto;transform:translateY(0)}
                #fixedPanel.minimized{transform:translateY(calc(100% - 38px))}
                #fixedPanel.minimized .stats-row,#fixedPanel.minimized #interpretation,#fixedPanel.minimized #buttonContainer,#fixedPanel.minimized .footer,#fixedPanel.minimized #actionFeedback{display:none}
                #panel-hover-hint{display:none}
                #fixedPanel.minimized #panel-hover-hint{display:flex;justify-content:center;align-items:center;height:38px;font-size:.8rem;color:#666;user-select:none;gap:10px;animation:pulse-bg 2s infinite alternate}
                @keyframes pulse-bg{from{background-color:rgba(230,230,230,0)}to{background-color:rgba(220,220,220,.7)}}
                #fixedPanel:hover.minimized{transform:translateY(0)}
                #statsContainer{max-height:0;overflow:hidden;opacity:0;transition:all .3s ease;margin:0;padding:0}
                #fixedPanel:hover #statsContainer{max-height:500px;opacity:1;padding:8px;margin-bottom:8px;background-color:#f5f5f5;border-radius:4px}
                .stats-row{display:flex;justify-content:space-between;align-items:stretch;gap:8px;margin-bottom:8px}
                .statItem{flex:1;text-align:center;background-color:#fff;padding:8px 4px;border-radius:4px;box-shadow:0 1px 3px rgba(0,0,0,.1);display:flex;flex-direction:column;justify-content:space-between}
                .statItem>div:first-child{font-weight:700;color:#666;font-size:.8rem;margin-bottom:4px}
                .statValue{font-size:1rem;color:#2196F3;font-weight:500}
                #interpretation{width:100%;text-align:center;padding:8px;background-color:#fff;border-radius:4px;margin-top:8px;font-size:.9rem;box-shadow:0 1px 3px rgba(0,0,0,.1)}
                #interpretation b{color:#666}
                #actionFeedback{font-size:.8rem;text-align:center;color:#333;height:0;opacity:0;transition:all .3s ease;margin:0 auto;padding:0}
                #actionFeedback.visible{height:auto;opacity:1;padding:4px 0}
                #buttonContainer{display:flex;justify-content:center;gap:.5rem;padding:4px 0;margin-bottom:4px}
                .copyButton{padding:.4rem .8rem;font-size:.9rem;color:#fff;border:none;border-radius:5px;cursor:pointer;background-color:#4CAF50;box-shadow:0 2px 4px rgba(0,0,0,.2);transition:all .3s ease}
                #clearButton{background-color:#f44336}
                #undoButton{background-color:#2196F3}
                #convertMarkdownButton{background-color:#9C27B0}
                .copyButton:hover{opacity:.9}
                .footer{font-size:.75rem;text-align:center;color:#666;padding:4px 0;margin:0;display:flex;justify-content:center;align-items:center;gap:10px}
                .footer a{color:#0366d6;text-decoration:none;transition:color .2s ease}
                .footer a:hover{color:#0056b3;text-decoration:underline}
                #panel-info-hint{font-size:.7rem;color:#888;border:1px dotted #aaa;border-radius:50%;width:12px;height:12px;display:inline-flex;justify-content:center;align-items:center;cursor:help;font-style:italic}
                .notification{position:fixed;top:60px;left:50%;transform:translateX(-50%);padding:10px 20px;border-radius:5px;color:#fff;font-size:.9rem;z-index:10002;animation:fadeIn .3s ease}
                .notification.success{background-color:#4CAF50}
                .notification.error{background-color:#f44336}
                @keyframes fadeIn{from{opacity:0;transform:translateX(-50%) translateY(-10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
            `;
      doc.head.appendChild(style);

      /* HTML Body */
      const bodyHTML = `
                <div id="header">
                    <div id="branding-title">Smart Editor Pro <sup>v3.0</sup></div>
                    <div id="header-hints">
                        <span>💾 Ctrl+S</span>
                        <button id="saveButton">Guardar</button>
                        <button id="toggleInstructions">Instrucciones</button>
                    </div>
                </div>
                <div id="instructions" class="hidden">
                    <h3 style="margin-bottom:1rem">📝 Bienvenido a Smart Editor Pro v3.0</h3>
                    <p><b>🚀 Características principales:</b></p>
                    <ul>
                        <li>📊 <b>Análisis en tiempo real:</b> Estadísticas de texto, legibilidad y detección de idioma</li>
                        <li>🔄 <b>Conversión automática de Markdown:</b> Detecta y convierte automáticamente al pegar o cargar</li>
                        <li>🌐 <b>Detección inteligente de idioma:</b> Español/Inglés con análisis híbrido</li>
                        <li>📋 <b>Múltiples opciones de copia:</b> Texto plano, enriquecido o Markdown convertido</li>
                        <li>↩️ <b>Sistema de deshacer:</b> Historial de 50 cambios</li>
                        <li>💾 <b>Guardado rápido:</b> HTML con formato preservado</li>
                        <li>📏 <b>Índice de legibilidad:</b> Flesch-Szigriszt para español, Flesch para inglés</li>
                        <li>⏱️ <b>Tiempo de lectura estimado:</b> Basado en 250 palabras por minuto</li>
                    </ul>
                    
                    <p><b>⌨️ Atajos de teclado:</b></p>
                    <ul>
                        <li><b>Ctrl+S:</b> Guardar documento</li>
                        <li><b>Ctrl+Z:</b> Deshacer cambio</li>
                        <li><b>Ctrl+Y:</b> Rehacer cambio</li>
                        <li><b>Ctrl+B:</b> Negrita (en navegadores compatibles)</li>
                        <li><b>Ctrl+I:</b> Cursiva (en navegadores compatibles)</li>
                    </ul>
                    
                    <p><b>📝 Sintaxis Markdown soportada:</b></p>
                    <ul>
                        <li><b># Título 1</b> | <b>## Título 2</b> | <b>### Título 3</b></li>
                        <li><b>**negrita**</b> | <b>*cursiva*</b> | <b>***negrita y cursiva***</b></li>
                        <li><b>~~tachado~~</b> | <b>\`código inline\`</b></li>
                        <li><b>[enlace](url)</b> | <b>![imagen](url)</b></li>
                        <li><b>&gt; cita</b> | <b>* lista</b> | <b>1. lista numerada</b></li>
                        <li><b>---</b> línea horizontal</li>
                        <li>Bloques de código con triple backtick</li>
                    </ul>
                    
                    <p><b>💡 Tips de uso:</b></p>
                    <ul>
                        <li>🎯 Selecciona texto en cualquier página antes de ejecutar para cargarlo automáticamente</li>
                        <li>📱 El panel inferior se minimiza para maximizar espacio de escritura</li>
                        <li>🔍 Las estadísticas se actualizan automáticamente mientras escribes</li>
                        <li>🎨 El Markdown se renderiza automáticamente al pegar o cargar</li>
                        <li>⚡ Ejecuta desde páginas simples para mejor rendimiento</li>
                    </ul>
                </div>
                <div id="notepad" contenteditable></div>
                <div id="fixedPanel">
                    <div id="statsContainer">
                        <div class="stats-row">
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
                                <div>Tiempo de lectura</div>
                                <div id="readTime" class="statValue">0 min 0 seg</div>
                            </div>
                        </div>
                        <div id="interpretation">Resumen: Esperando texto...</div>
                    </div>
                    <div id="actionFeedback"></div>
                    <div id="buttonContainer">
                        <button id="copyPlainButton" class="copyButton">Copiar texto plano</button>
                        <button id="copyRichButton" class="copyButton">Copiar texto enriquecido</button>
                        <button id="convertMarkdownButton" class="copyButton">Markdown → HTML</button>
                        <button id="undoButton" class="copyButton">Deshacer</button>
                        <button id="clearButton" class="copyButton">Limpiar</button>
                    </div>
                    <div id="panel-hover-hint"><span>↑</span> Ver estadísticas y controles <span>↑</span></div>
                    <div class="footer">
                        <div>Creado por <a href="https://bsky.app/profile/ernestob.bsky.social" target="_blank" rel="noopener noreferrer">@ernestob</a> | Versión: <span id="version">3.0</span> | <a href="https://github.com/ernestobarrera/Bookmarklet-Notas" target="_blank" rel="noopener noreferrer">Ver en GitHub</a></div>
                        <span id="panel-info-hint" title="Este panel se oculta automáticamente al hacer scroll en el editor para maximizar el espacio.">i</span>
                    </div>
                </div>
            `;

      safeSetHTML(doc.body, bodyHTML);
      return doc;
    };

    /* Funciones auxiliares */
    const formatDate = (date) => {
      const pad = (num) => String(num).padStart(2, '0');
      const d = new Date(date);
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    };

    const countSentences = (text) => {
      return text.split(/[.!?¡¿]+/).filter(sentence => sentence.trim().length > 0).length;
    };

    const calculateAverageWordsPerSentence = (wordCount, sentenceCount) => {
      if (wordCount === 0 || sentenceCount === 0) return "0";
      return (wordCount / sentenceCount).toFixed(1);
    };

    const countParagraphs = text => {
      const paragraphs = text.split(/\n{2,}|(<\/p>|<br\s*\/?>\s*<br\s*\/?>)/g)
        .filter(p => p && p.trim().length > 1);
      return paragraphs.length || (text.trim() ? 1 : 0);
    };

    const interpretMetrics = (metrics) => {
      if (metrics.wordCount === 0) {
        return "Esperando texto...";
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

    const showNotification = function (message, type = 'success') {
      const notification = this.document.createElement('div');
      notification.textContent = message;
      notification.className = `notification ${type}`;
      this.document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    };

    const showActionFeedback = function (message, type = 'success') {
      const feedbackEl = this.document.getElementById('actionFeedback');
      if (feedbackEl) {
        feedbackEl.textContent = message;
        feedbackEl.style.color = type === 'error' ? '#f44336' : '#4CAF50';
        feedbackEl.classList.add('visible');
        setTimeout(() => {
          feedbackEl.classList.remove('visible');
        }, 4000);
      }
    };

    const updateStats = function () {
      try {
        const notepad = this.document.getElementById('notepad');
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

        this.document.getElementById('wordCount').textContent = wordCount;
        this.document.getElementById('charCount').textContent = charCount;
        this.document.getElementById('sentenceCount').textContent = sentenceCount;
        this.document.getElementById('avgWordsPerSentence').textContent = avgWordsPerSentence;
        this.document.getElementById('paragraphCount').textContent = paragraphCount;
        this.document.getElementById('readTime').textContent = `${minutes} min ${seconds} seg`;

        if (text.trim() === '') {
          this.document.getElementById('interpretation').innerHTML = "<b>Resumen:</b> Esperando texto...";
        } else {
          const metrics = interpretMetrics({
            wordCount,
            charCount,
            sentenceCount,
            avgWordsPerSentence,
            paragraphCount
          });
          this.document.getElementById('interpretation').innerHTML =
            `<b>Resumen:</b> ${metrics} Legibilidad: ${readabilityResults.interpretation} (Puntuación: ${readabilityResults.readabilityScore})`;
        }
      } catch (error) {
        console.error('Error actualizando estadísticas:', error);
      }
    };

    const triggerSave = function () {
      const defaultFileName = `NOTAS_${formatDate(new Date())}.html`;
      const fileName = this.prompt('Introduce el nombre del archivo:', defaultFileName);
      if (fileName === null) {
        showActionFeedback.call(this, 'Guardado cancelado', 'error');
        return;
      }
      const finalFileName = fileName || defaultFileName;
      const blob = new Blob([this.document.getElementById('notepad').innerHTML], { type: 'text/html' });
      const a = this.document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = finalFileName;
      a.style.display = 'none';
      this.document.body.appendChild(a);
      a.click();
      this.document.body.removeChild(a);
      showActionFeedback.call(this, `Archivo guardado como '${finalFileName}'`);
    };

    const saveNote = function (e) {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        triggerSave.call(this);
      }
    };

    const copyPlainText = function () {
      try {
        const notepad = this.document.getElementById('notepad');
        const text = notepad.innerText || notepad.textContent;
        this.navigator.clipboard.writeText(text).then(() =>
          showNotification.call(this, 'Texto plano copiado')
        ).catch(err => {
          console.error('Error copiando texto:', err);
          showNotification.call(this, 'Error al copiar texto', 'error');
        });
      } catch (error) {
        console.error('Error en copyPlainText:', error);
        showNotification.call(this, 'Error al copiar texto', 'error');
      }
    };

    const copyRichText = function () {
      try {
        const notepad = this.document.getElementById('notepad');
        const htmlContent = notepad.innerHTML;
        const textContent = notepad.innerText || notepad.textContent;

        const clipboardData = [
          new ClipboardItem({
            'text/html': new Blob([htmlContent], { type: 'text/html' }),
            'text/plain': new Blob([textContent], { type: 'text/plain' })
          })
        ];

        this.navigator.clipboard.write(clipboardData).then(() =>
          showNotification.call(this, 'Texto enriquecido copiado')
        ).catch(err => {
          console.error('Error copiando texto enriquecido:', err);
          /* Fallback a copiar solo texto plano */
          this.navigator.clipboard.writeText(textContent).then(() =>
            showNotification.call(this, 'Texto copiado (sin formato)')
          );
        });
      } catch (error) {
        console.error('Error en copyRichText:', error);
        showNotification.call(this, 'Error al copiar texto enriquecido', 'error');
      }
    };

    const convertMarkdownAndCopy = function () {
      try {
        const notepad = this.document.getElementById('notepad');
        /* Obtener el texto plano actual */
        let currentText = notepad.textContent || notepad.innerText || '';

        /* Convertir Markdown a HTML */
        let html = MarkdownConverter.convert(currentText);

        /* Actualizar el notepad con el HTML convertido */
        saveToHistory.call(this);
        safeSetHTML(notepad, html);
        updateStats.call(this);

        /* Copiar HTML convertido al portapapeles */
        const clipboardData = [
          new ClipboardItem({
            'text/html': new Blob([html], { type: 'text/html' }),
            'text/plain': new Blob([currentText], { type: 'text/plain' })
          })
        ];

        this.navigator.clipboard.write(clipboardData).then(() =>
          showNotification.call(this, 'Markdown convertido y copiado')
        ).catch(err => {
          console.error('Error:', err);
          showNotification.call(this, 'Markdown convertido en el editor');
        });
      } catch (error) {
        console.error('Error en convertMarkdownAndCopy:', error);
        showNotification.call(this, 'Error al convertir Markdown', 'error');
      }
    };

    let undoHistory = [];
    let redoHistory = [];

    const saveToHistory = function () {
      const notepad = this.document.getElementById('notepad');
      undoHistory.push(notepad.innerHTML);
      if (undoHistory.length > 50) undoHistory.shift();
      redoHistory = [];
    };

    const undo = function () {
      if (undoHistory.length > 0) {
        const notepad = this.document.getElementById('notepad');
        redoHistory.push(notepad.innerHTML);
        const previousState = undoHistory.pop();
        safeSetHTML(notepad, previousState);
        updateStats.call(this);
        showActionFeedback.call(this, 'Cambio deshecho');
      } else {
        showActionFeedback.call(this, 'No hay cambios para deshacer', 'error');
      }
    };

    const clearText = function () {
      /* Sin confirmación - filosofía minimalista */
      const notepad = this.document.getElementById('notepad');
      saveToHistory.call(this);
      notepad.innerHTML = '';
      updateStats.call(this);
      showActionFeedback.call(this, 'Texto limpiado (usa Deshacer para recuperar)');
    };

    /* Abrir nueva ventana */
    const newWindow = window.open('', '_blank', 'width=900,height=700,toolbar=no,menubar=no,location=no,status=no');

    if (!newWindow) {
      alert('No se pudo abrir la ventana del editor. Por favor, desactiva el bloqueador de ventanas emergentes para este sitio.');
      return;
    }

    /* Crear y configurar el documento */
    const doc = createHTMLDocument();
    newWindow.document.open();
    newWindow.document.write(doc.documentElement.outerHTML);
    newWindow.document.close();

    /* Configurar evento handlers */
    const notepad = newWindow.document.getElementById('notepad');
    const debouncedUpdate = createDebouncer(updateStats.bind(newWindow), 300);

    /* Event listeners */
    notepad.addEventListener('input', function () {
      saveToHistory.call(newWindow);
      debouncedUpdate();
    });

    /* Manejar pegado con conversión automática de Markdown */
    notepad.addEventListener('paste', function (e) {
      e.preventDefault();
      saveToHistory.call(newWindow);

      const text = (e.clipboardData || newWindow.clipboardData).getData('text');
      if (text) {
        const converted = MarkdownConverter.detectAndConvert(text);
        if (converted !== text) {
          /* Es Markdown, convertir a HTML */
          const selection = newWindow.getSelection();
          if (!selection.rangeCount) return;

          selection.deleteFromDocument();
          const range = selection.getRangeAt(0);

          /* Usar DocumentFragment para mantener el orden correcto */
          const fragment = newWindow.document.createDocumentFragment();
          const temp = newWindow.document.createElement('div');
          safeSetHTML.call(newWindow, temp, converted);

          /* Mover todos los nodos al fragment en orden correcto */
          while (temp.firstChild) {
            fragment.appendChild(temp.firstChild);
          }

          /* Insertar todo el fragment de una vez */
          range.insertNode(fragment);

          /* Colapsar el rango al final del contenido insertado */
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);

          showActionFeedback.call(newWindow, 'Markdown detectado y convertido');
        } else {
          /* Texto plano normal - preservar saltos de línea */
          const htmlText = text.replace(/\n/g, '<br>');
          newWindow.document.execCommand('insertHTML', false, htmlText);
        }
        setTimeout(debouncedUpdate, 100);
      }
    });

    newWindow.document.addEventListener('keydown', saveNote.bind(newWindow));

    newWindow.document.getElementById('saveButton').addEventListener('click', () => triggerSave.call(newWindow));
    newWindow.document.getElementById('copyPlainButton').addEventListener('click', () => copyPlainText.call(newWindow));
    newWindow.document.getElementById('copyRichButton').addEventListener('click', () => copyRichText.call(newWindow));
    newWindow.document.getElementById('convertMarkdownButton').addEventListener('click', () => convertMarkdownAndCopy.call(newWindow));
    newWindow.document.getElementById('undoButton').addEventListener('click', () => undo.call(newWindow));
    newWindow.document.getElementById('clearButton').addEventListener('click', () => clearText.call(newWindow));

    newWindow.document.getElementById('toggleInstructions').addEventListener('click', function () {
      const instructions = newWindow.document.getElementById('instructions');
      instructions.classList.toggle('hidden');
      this.textContent = instructions.classList.contains('hidden') ? 'Instrucciones' : 'Ocultar';
    });

    /* Panel minimizable */
    let panelMinimized = false;
    newWindow.document.getElementById('fixedPanel').addEventListener('click', function (e) {
      if (e.target.id === 'panel-hover-hint' ||
        (panelMinimized && !e.target.classList.contains('copyButton'))) {
        panelMinimized = !panelMinimized;
        this.classList.toggle('minimized', panelMinimized);
      }
    });

    /* Cargar contenido seleccionado si existe */
    const selectedContent = getSelectedContent();
    if (selectedContent) {
      /* Verificar si es HTML o texto plano */
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = selectedContent;

      /* Si el HTML parseado es igual al texto, probablemente es texto plano */
      const textContent = tempDiv.textContent || tempDiv.innerText || '';

      /* Si el contenido seleccionado no tiene tags HTML, tratarlo como texto plano */
      if (!/<[^>]+>/.test(selectedContent) || selectedContent === textContent) {
        /* Es texto plano, verificar si es Markdown */
        const converted = MarkdownConverter.detectAndConvert(textContent);
        safeSetHTML(notepad, converted);
        if (converted !== textContent) {
          showNotification.call(newWindow, 'Markdown detectado y convertido');
        } else {
          showNotification.call(newWindow, 'Contenido cargado');
        }
      } else {
        /* Es HTML, cargarlo directamente */
        safeSetHTML(notepad, selectedContent);
        showNotification.call(newWindow, 'Contenido HTML cargado');
      }

      updateStats.call(newWindow);
    }

    /* Actualización inicial */
    updateStats.call(newWindow);

    /* Focus en el notepad */
    notepad.focus();

  } catch (error) {
    console.error('Error crítico en Smart Editor Pro:', error);
    alert('Error al ejecutar Smart Editor Pro: ' + error.message + '\n\nIntenta ejecutarlo desde una pestaña vacía o un sitio menos restrictivo.');
  }
})();