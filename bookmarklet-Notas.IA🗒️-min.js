/*!
* Notes Editor Bookmarklet v1.0.0
* Last updated: 2024-12-04
* Autor: Ernesto Barrera 
* Repositorio: https://github.com/ernestobarrera/Bookmarklet-Notas
* License: MIT 
* Fuente legibilidad 
*/
!function(){const n={spanishPatterns:{articles:/\b(el|la|los|las|un|una|unos|unas)\b/gi,conjunctions:/\b(y|e|o|u|pero|sino|porque|que|si)\b/gi,prepositions:/\b(de|del|a|al|en|por|para|con|sin|sobre)\b/gi,pronouns:/\b(yo|tú|él|ella|nosotros|vosotros|ellos|ellas|me|te|se|nos|os)\b/gi,accents:/[áéíóúñ¿¡]/g,commonWords:/\b(está|son|ser|estar|tiene|hace|muy|más|también|todo|cuando|hay)\b/gi},englishPatterns:{articles:/\b(the|a|an)\b/gi,conjunctions:/\b(and|or|but|because|if|so)\b/gi,prepositions:/\b(in|on|at|to|for|with|by|from|of)\b/gi,pronouns:/\b(i|you|he|she|it|we|they|me|him|her|us|them)\b/gi,auxiliaries:/\b(is|are|was|were|have|has|had|do|does|did)\b/gi,commonWords:/\b(this|that|these|those|there|here|what|when|where|who|which)\b/gi},calculateLanguageScore:function(n,e){let t=0;for(const o in e){t+=(n.match(e[o])||[]).length}return t},detectTechnicalTerms:function(n){return(n.match(/\b(software|hardware|web|online|internet|email|smartphone|computer|app|website|cloud|server|database|api|framework|frontend|backend|browser|cookie|cache|debug|interface|network|plugin|script|update)\b/gi)||[]).length},analyzeLanguageDistribution:function(n){const e=this.calculateLanguageScore(n,this.spanishPatterns),t=this.calculateLanguageScore(n,this.englishPatterns),o=this.detectTechnicalTerms(n),i=t-.75*o,a=e/(e+i)*100;return{mainLanguage:e>i?"es":"en",spanishPercentage:a.toFixed(1),technicalTerms:o,isHybrid:a>15&&a<85}},generateLanguageReport:function(n){const e=this.analyzeLanguageDistribution(n);let t="";return e.isHybrid?(t=`Texto mixto (${e.spanishPercentage}% español) con ${e.technicalTerms} términos técnicos. `,t+="Aplicando análisis de legibilidad para el idioma predominante."):t="es"===e.mainLanguage?`Texto principalmente en español (${e.spanishPercentage}%) con terminología técnica.`:"Texto principalmente en inglés con algunos términos en español.",{languageInfo:t,detectedLanguage:e.mainLanguage,isHybrid:e.isHybrid}}},e={countSyllables:function(n,e){if(n=n.toLowerCase(),"es"===e){const e=/(ai|au|ei|eu|io|ou|oi|ui|iu|ie|ue|ua)/g,t=/(uai|iai|uei|ioi)/g;let o=((n=n.replace(/[áéíóú]/g,"a").replace(/[üï]/g,"i").replace(/[^a-z]/g,"")).match(/[aeiou]+/g)||[]).length;return o=o-(n.match(e)||[]).length-2*(n.match(t)||[]).length,o||1}return((n=n.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/,"").replace(/^y/,"")).match(/[aeiouy]{1,2}/g)||[]).length||1},calculateSpanishIndex:function(n,e,t){return 206.835-n/e*62.3-e/t},calculateEnglishIndex:function(n,e,t){return 206.835-e/t*1.015-n/e*84.6},interpretScore:function(n,e){return"es"===e?n<=40?"Muy difícil (Nivel universitario o científico)":n<=55?"Algo difícil (Bachillerato, divulgación científica)":n<=65?"Normal (ESO, prensa general)":n<=80?"Bastante fácil (Educación primaria, prensa deportiva)":"Muy fácil (Educación primaria, comics)":n>=90?"Very easy (5th grade)":n>=80?"Easy (6th grade)":n>=70?"Fairly easy (7th grade)":n>=60?"Standard (8th-9th grade)":n>=50?"Fairly difficult (10th-12th grade)":n>=30?"Difficult (College)":"Very difficult (College graduate)"},analyzeText:function(e){const t=n.generateLanguageReport(e),o=t.detectedLanguage,i=e.replace(/\s+/g," ").trim(),a=i.split(/\s+/).filter((n=>n.length>0)),r=i.split(/[.!?]+/).filter((n=>n.trim().length>0)),s=a.reduce(((n,e)=>n+this.countSyllables(e,o)),0),d="es"===o?this.calculateSpanishIndex(s,a.length,r.length):this.calculateEnglishIndex(s,a.length,r.length);return{language:o,syllables:s,words:a.length,sentences:r.length,syllablesPerWord:(s/a.length).toFixed(2),wordsPerSentence:(a.length/r.length).toFixed(2),readabilityScore:d.toFixed(2),interpretation:this.interpretScore(d,o),languageInfo:t.languageInfo,isHybrid:t.isHybrid}}},t=function(n,e){const t=n.innerHTML;e(),t!==n.innerHTML&&this.document.execCommand("insertHTML",!1,n.innerHTML)},o=function(){const n=this.document.getElementById("notepad"),t=n.innerText||n.textContent,o=t.trim().split(/\s+/).filter((n=>n.length>0)).length,i=t.replace(/\s+/g,"").length,a=(n=>n.split(/[.!?¡¿]+/).filter((n=>n.trim().length>0)).length)(t),r=((n,e)=>0===n||0===e?"0":(n/e).toFixed(1))(o,a),s=(n=>n.split(/(?:\r?\n){2,}|<\/p>|<br\s*\/?>\s*<br\s*\/?>/g).filter((n=>n.trim().length>0)).length)(t),d=t.toLowerCase().replace(/[^\w\s']/g,"").split(/\s+/).filter((n=>n.length>1)).length,l=Math.round(o/250*60),c=Math.floor(l/60),u=l%60;let m;m=e&&"function"==typeof e.analyzeText?e.analyzeText(t):{language:"es",readabilityScore:0,interpretation:""},this.document.getElementById("wordCount").textContent=o,this.document.getElementById("charCount").textContent=i,this.document.getElementById("sentenceCount").textContent=a,this.document.getElementById("avgWordsPerSentence").textContent=r,this.document.getElementById("paragraphCount").textContent=s,this.document.getElementById("tokenCount").textContent=d,this.document.getElementById("readTime").textContent=`${c} min ${u} seg`,""===t.trim()?this.document.getElementById("interpretation").innerHTML="<b>Resumen:</b> Analizando texto...":this.document.getElementById("interpretation").innerHTML=`<b>Resumen:</b> ${(n=>{if(0===n.wordCount)return"Analizando texto...";let e="";return n.wordCount<100?e+="Texto corto. ":n.wordCount<500?e+="Texto de longitud media. ":e+="Texto largo. ",n.avgWordsPerSentence<10?e+="Oraciones muy cortas, fácil de leer. ":n.avgWordsPerSentence<20?e+="Oraciones de longitud moderada, buena legibilidad. ":e+="Oraciones largas, puede ser más difícil de leer. ",n.paragraphCount<3?e+="Pocos párrafos, considera dividir el texto para mejor lectura.":e+="Buena división en párrafos, facilita la lectura.",e})({wordCount:o,charCount:i,sentenceCount:a,avgWordsPerSentence:r,paragraphCount:s,tokenCount:d})} Legibilidad: ${m.interpretation} (Puntuación: ${m.readabilityScore})`},i=function(){const n=this.document.getElementById("notepad"),e=this.document.getElementById("styleInfo"),t=this.window.getSelection(),o=new Set;if(""===n.innerText.trim())return void(e.innerHTML="");const i=n=>{const e=this.window.getComputedStyle(n);o.add(`Fuente: ${e.fontFamily.split(",")[0].trim()}`),o.add(`Tamaño: ${e.fontSize}`),o.add(`Color: ${e.color}`),"normal"!==e.fontWeight&&o.add(`Peso: ${e.fontWeight}`),"normal"!==e.fontStyle&&o.add(`Estilo: ${e.fontStyle}`),"none"!==e.textDecoration&&o.add(`Decoración: ${e.textDecoration}`)};if(t&&!t.isCollapsed){const n=t.getRangeAt(0).commonAncestorContainer;n.nodeType===Node.TEXT_NODE?i(n.parentNode):i(n),e.innerHTML="<b>Estilos detectados en la selección:</b> "+Array.from(o).join(" | ")}else i(n),e.innerHTML="<b>Estilos detectados:</b> "+Array.from(o).join(" | ")},a=function(n){if(n.ctrlKey&&"s"===n.key){n.preventDefault();const e=`NOTAS_${(n=>{const e=n=>String(n).padStart(2,"0"),t=new Date(n);return`${t.getFullYear()}-${e(t.getMonth()+1)}-${e(t.getDate())}-${e(t.getHours())}-${e(t.getMinutes())}-${e(t.getSeconds())}`})(new Date)}.html`,t=new Blob([this.document.getElementById("notepad").innerHTML],{type:"text/html"}),o=this.document.createElement("a");o.href=URL.createObjectURL(t),o.download=e,o.style.display="none",this.document.body.appendChild(o),o.click(),this.document.body.removeChild(o)}},r=function(){const n=this.document.getElementById("notepad");t.call(this,n,(()=>{const e=n.innerText||n.textContent;this.navigator.clipboard.writeText(e)}))},s=function(){const n=this.document.getElementById("notepad");t.call(this,n,(()=>{const e=this.document.createRange();e.selectNodeContents(n);const t=this.window.getSelection();t.removeAllRanges(),t.addRange(e),this.document.execCommand("copy"),t.removeAllRanges()}))},d=function(){const n=this.document.getElementById("notepad");t.call(this,n,(()=>{n.innerHTML=""})),o.call(this),n.focus()},l=function(){this.document.execCommand("undo"),o.call(this),this.document.getElementById("notepad").focus()},c=function(){const n=this.document.getElementById("notepad");n.innerHTML;let e=n.innerText||n.textContent;if(!/(\*\*|__|\*|_|~~|`|\[|\]|\(|\)|#|>|-|\d+\.|\!)/.test(e))return void n.focus();e=e.replace(/\r\n/g,"\n").replace(/\r/g,"\n");const i={h1:[/^# (.*$)/gim,"<h1>$1</h1>"],h2:[/^## (.*$)/gim,"<h2>$1</h2>"],h3:[/^### (.*$)/gim,"<h3>$1</h3>"],h4:[/^#### (.*$)/gim,"<h4>$1</h4>"],h5:[/^##### (.*$)/gim,"<h5>$1</h5>"],h6:[/^###### (.*$)/gim,"<h6>$1</h6>"],bold:[/\*\*(.*?)\*\*/gim,"<strong>$1</strong>"],italic:[/\*(.*?)\*/gim,"<em>$1</em>"],strikethrough:[/~~(.*?)~~/gim,"<del>$1</del>"],blockquote:[/^\> (.*$)/gim,"<blockquote>$1</blockquote>"],unorderedList:[/^[\*\-] (.*$)/gim,"<ul><li>$1</li></ul>"],orderedList:[/^\d+\. (.*$)/gim,"<ol><li>$1</li></ol>"],code:[/`(.*?)`/gim,"<code>$1</code>"],link:[/\[(.*?)\]\((.*?)\)/gim,'<a href="$2">$1</a>'],image:[/!\[(.*?)\]\((.*?)\)/gim,'<img alt="$1" src="$2">'],horizontalRule:[/^(?:---|\*\*\*|-\s-\s-)$/gim,"<hr>"],lineBreak:[/\n\n/g,"<br><br>"]};let a=e;for(const[,[n,e]]of Object.entries(i))a=a.replace(n,e);a=a.replace(/<\/ul><ul>|<\/ol><ol>/gim,"").trim(),t.call(this,n,(()=>{n.innerHTML=a})),s.call(this),o.call(this),n.focus()};(()=>{const n=(()=>{const n=window.getSelection();if(n.rangeCount>0){const e=n.getRangeAt(0).cloneContents(),t=document.createElement("div");return t.appendChild(e),t.innerHTML}return""})(),e=(()=>{const n=document.implementation.createHTMLDocument("NOTAS");return n.documentElement.innerHTML='\n      <html>\n        <head>\n          <meta charset="utf-8">\n          <title>NOTAS</title>\n<style>\n          \n            body {\n              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;\n              font-size: 1.3rem;\n              margin: 0;\n              padding: 1rem;\n              background-color: #f0f0f0;\n              min-height: 100vh;\n              padding-bottom: 300px;\n              box-sizing: border-box;\n            }\n       \n\n#instructions.hidden {\n  max-height: 0;\n  opacity: 0;\n  margin: 0;\n  padding: 0;\n  overflow: hidden;\n}\n            #notepad {\n              background-color: white;\n              min-height: 200px;\n              padding: 0.5rem;\n              border: 1px solid #ccc;\n              border-radius: 5px;\n              width: 95%;\n              margin: 0 auto 0.5rem;\n              font-size: 1.2rem;\n              resize: vertical;\n              overflow: auto;\n               margin-top: 1rem;\n  margin-bottom: 40px !important;\n  position: relative;\n  z-index: 1;\n   scroll-behavior: auto;\n  transition: margin-top 0.3s ease-out;\n            }\n            #notepad a {\n              color: #0066cc;\n              text-decoration: underline;\n              cursor: pointer;\n            }\n        \n#fixedPanel {\n  position: fixed;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background-color: rgba(250, 250, 250, 0.97);\n  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);\n  border-top: 1px solid #e5e5e5;\n  z-index: 1000;\n  padding: 0.3rem;\n}\n\n#statsContainer {\n  max-height: 0;\n  overflow: hidden;\n  opacity: 0;\n  transition: all 0.3s ease;\n  margin: 0;\n  padding: 0;\n}\n\n#fixedPanel:hover #statsContainer {\n  max-height: 500px;\n  opacity: 1;\n  padding: 8px;\n  margin-bottom: 8px;\n  background-color: #f5f5f5;\n  border-radius: 4px;\n}\n\n.stats-row {\n  display: flex;\n  justify-content: space-between;\n  align-items: stretch;\n  gap: 8px;\n  margin-bottom: 8px;\n}\n\n.statItem {\n  flex: 1;\n  text-align: center;\n  background-color: white;\n  padding: 8px 4px;\n  border-radius: 4px;\n  box-shadow: 0 1px 3px rgba(0,0,0,0.1);\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n}\n\n.statItem > div:first-child {\n  font-weight: bold;\n  color: #666;\n  font-size: 0.8rem;\n  margin-bottom: 4px;\n}\n\n.statValue {\n  font-size: 1rem;\n  color: #2196F3;\n  font-weight: 500;\n}\n\n#interpretation {\n  width: 100%;\n  text-align: center;\n  padding: 8px;\n  background-color: white;\n  border-radius: 4px;\n  margin-top: 8px;\n  font-size: 0.9rem;\n  box-shadow: 0 1px 3px rgba(0,0,0,0.1);\n}\n\n#interpretation b {\n  color: #666;\n}\n#buttonContainer {\n  display: flex;\n  justify-content: center;\n  gap: 0.5rem;\n  padding: 4px 0;\n  margin-bottom: 4px;\n}\n\n.copyButton {\n  padding: 0.4rem 0.8rem;\n  font-size: 0.9rem;\n  color: white;\n  border: none;\n  border-radius: 5px;\n  cursor: pointer;\n  background-color: #4CAF50;\n  box-shadow: 0 2px 4px rgba(0,0,0,0.2);\n  transition: all 0.3s ease;\n}\n\n#clearButton {\n  background-color: #f44336;\n}\n\n#undoButton {\n  background-color: #2196F3;\n}\n\n.copyButton:hover {\n  opacity: 0.9;\n}\n\n#notepad {\n  margin-bottom: 110px !important;\n  min-height: 300px;\n}\n\n.footer {\n  font-size: 0.75rem;\n  text-align: center;\n  color: #666;\n  padding: 4px 0;\n  margin: 0;\n}\n\n.footer a {\n  color: #0366d6;\n  text-decoration: none;\n  transition: color 0.2s ease;\n}\n\n.footer a:hover {\n  color: #0056b3;\n  text-decoration: underline;\n}\n\n/* Nuevo contenedor para las estadísticas en línea */\n.stats-row {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 8px;\n}     \n#instructions {\n  background-color: #e0e0e0;\n  padding: 0.7rem;\n  margin-bottom: 1.5rem;\n  border-radius: 5px;\n  font-size: 1rem;\n  line-height: 1.3;\n  position: relative;\n  z-index: 100;\n  transition: all 0.3s ease-out;\n  max-height: 2000px;\n  overflow-y: auto;\n  opacity: 1;\n}\n\n#instructions.hidden {\n  max-height: 0;\n  opacity: 0;\n  margin: 0;\n  padding: 0;\n  overflow: hidden;\n}\n\n\n\n#instructions.hidden {\n  max-height: 0;\n  opacity: 0;\n  margin: 0;\n  padding: 0;\n}\n\n#toggleInstructions {\n  position: fixed;\n  top: 10px;\n  right: 10px;\n  padding: 5px 10px;\n  background: #4CAF50;\n  color: white;\n  border: none;\n  border-radius: 5px;\n  cursor: pointer;\n  z-index: 1000;\n  box-shadow: 0 2px 4px rgba(0,0,0,0.2);\n    transition: background-color 0.2s ease;\n\n}\n\n#fixedPanel {\n  position: fixed;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background-color: rgba(240, 240, 240, 0.95);\n  padding: 0.7rem;\n  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);\n  transition: transform 0.3s ease, max-height 0.3s ease;\n  max-height: 30vh;\n  overflow-y: auto;\n  transform: translateY(0);\n}\n\n#fixedPanel.minimized {\n  transform: translateY(calc(100% - 40px));\n}\n\n#fixedPanel:hover.minimized {\n  transform: translateY(0);\n}\n\n#notepad {\n  background-color: white;\n  min-height: 200px;\n  padding: 0.5rem;\n  border: 1px solid #ccc;\n  border-radius: 5px;\n  width: 95%;\n  margin: 0 auto 0.5rem;\n  font-size: 1.2rem;\n  resize: vertical;\n  overflow: auto;\n  margin-bottom: 60px;\n   min-height: 300px;\n  line-height: 1.6;\n  text-align: justify;\n  hyphens: auto;\n  word-wrap: break-word;    \n</style>\n                </head>\n                <body>\n                <button id="toggleInstructions">Mostrar/Ocultar Instrucciones</button>\n\n                 <div id="instructions" class="hidden">\n  <h3 style="margin-bottom: 1rem;">📝 Bienvenido al Editor de Notas Inteligente</h3>\n  \n  <div style="margin-bottom: 1rem;">\n    <b>🎯 Características principales:</b><br>\n    • Editor inteligente con análisis de legibilidad en español e inglés<br>\n    • Estadísticas en tiempo real (palabras, tiempo de lectura, etc.)<br>\n    • Soporte para Markdown y texto enriquecido<br>\n    • Panel de estadísticas minimizable (se oculta al hacer scroll)<br>\n    • Guardado automático en el navegador\n  </div>\n\n  <div style="margin-bottom: 1rem;">\n    <b>✍️ Formas de introducir texto:</b><br>\n    • Escribir directamente en el editor<br>\n    • Pegar texto: Ctrl+V (conserva formato) o Ctrl+Shift+V (solo texto)<br>\n    • Dictado por voz: Windows + H (solo Windows 10/11)<br>\n    &nbsp;&nbsp;- Comandos de voz: "punto", "coma", "nuevo párrafo"<br>\n    &nbsp;&nbsp;- Control: "borra eso", "detén el dictado"\n  </div>\n\n  <div style="margin-bottom: 1rem;">\n    <b>🔄 Opciones de conversión:</b><br>\n    • "Copiar texto plano": Extrae solo el texto sin formato<br>\n    • "Copiar texto enriquecido": Mantiene el formato para pegar en Word/Email<br>\n    • "Convertir Markdown": Transforma la sintaxis Markdown en texto formateado<br>\n    &nbsp;&nbsp;- Soporta: **negrita**, *cursiva*, # títulos, listas, enlaces, etc.\n  </div>\n\n  <div style="margin-bottom: 1rem;">\n    <b>📊 Panel de estadísticas:</b><br>\n    • Palabras y caracteres totales<br>\n    • Tiempo estimado de lectura<br>\n    • Análisis de legibilidad (español/inglés)<br>\n    • Detección de idioma automática<br>\n    • Se minimiza al hacer scroll (hover para mostrar)\n  </div>\n\n  <div style="margin-bottom: 1rem;">\n    <b>⌨️ Atajos de teclado:</b><br>\n    • Ctrl + S: Guardar como HTML<br>\n    • Ctrl + Z: Deshacer<br>\n    • Ctrl + Y (o Ctrl+Shift+Z): Rehacer<br>\n    • Ctrl + X/C/V: Cortar/Copiar/Pegar<br>\n    • Ctrl + A: Seleccionar todo\n  </div>\n\n  <div>\n    <b>💡 Consejos:</b><br>\n    • Usa el botón "Mostrar/Ocultar" para maximizar el espacio de escritura<br>\n    • El panel inferior se minimiza automáticamente al hacer scroll<br>\n    • Guarda frecuentemente tu trabajo con Ctrl+S<br>\n    • Revisa el análisis de legibilidad para mejorar tu texto\n  </div>\n</div>\n                  <div id="notepad" contenteditable></div>\n                 <div id="fixedPanel">\n  <div id="statsContainer">\n    <div class="stats-row">\n      <div class="statItem">\n        <div>Palabras</div>\n        <div id="wordCount" class="statValue">0</div>\n      </div>\n      <div class="statItem">\n        <div>Caracteres</div>\n        <div id="charCount" class="statValue">0</div>\n      </div>\n      <div class="statItem">\n        <div>Frases</div>\n        <div id="sentenceCount" class="statValue">0</div>\n      </div>\n      <div class="statItem">\n        <div>Palabras/Frase</div>\n        <div id="avgWordsPerSentence" class="statValue">0</div>\n      </div>\n      <div class="statItem">\n        <div>Párrafos</div>\n        <div id="paragraphCount" class="statValue">0</div>\n      </div>\n      <div class="statItem">\n        <div>Tokens</div>\n        <div id="tokenCount" class="statValue">0</div>\n      </div>\n      <div class="statItem">\n        <div>Tiempo de lectura</div>\n        <div id="readTime" class="statValue">0 min 0 seg</div>\n      </div>\n    </div>\n    <div id="interpretation">Resumen: Analizando texto...</div>\n  </div>\n  <div id="buttonContainer">\n    <button id="copyPlainButton" class="copyButton">Copiar texto plano</button>\n    <button id="copyRichButton" class="copyButton">Copiar texto enriquecido</button>\n    <button id="convertMarkdownButton" class="copyButton">Convertir Markdown y Copiar</button>\n    <button id="undoButton" class="copyButton">Deshacer</button>\n    <button id="clearButton" class="copyButton">Limpiar texto</button>\n  </div>\n  <div class="footer">\n    Creado por <a href="https://bsky.app/profile/ernestob.bsky.social" target="_blank" rel="noopener noreferrer">@ernestob</a> | Version: <span id="version">1.0.0</span> | <a href="https://github.com/ernestobarrera/Bookmarklet-Notas" target="_blank" rel="noopener noreferrer">Ver en GitHub</a>\n  </div>\n</div>\n                </body>\n              </html>\n            ',n})(),t=window.open("about:blank","_blank");t.document.write(e.documentElement.outerHTML),t.document.close(),t.onload=function(){const e=this.document.getElementById("notepad");n&&(e.innerHTML=n),e.focus();const t=function(n,e){let t;return function(...o){clearTimeout(t),t=setTimeout((()=>n.apply(this,o)),e)}}((function(){o.call(this),i.call(this)}),300).bind(this);e.addEventListener("input",t),e.addEventListener("mouseup",t),this.document.addEventListener("keydown",function(n){a.call(this,n)}.bind(this)),e.addEventListener("keydown",function(n){n.ctrlKey&&"z"===n.key&&o.call(this)}.bind(this)),this.document.getElementById("copyPlainButton").addEventListener("click",r.bind(this)),this.document.getElementById("copyRichButton").addEventListener("click",s.bind(this)),this.document.getElementById("convertMarkdownButton").addEventListener("click",c.bind(this)),this.document.getElementById("clearButton").addEventListener("click",d.bind(this)),this.document.getElementById("undoButton").addEventListener("click",l.bind(this));const u=this.document.getElementById("toggleInstructions"),m=this.document.getElementById("instructions");u.addEventListener("click",(function(){const n=m.classList.contains("hidden");if(m.classList.toggle("hidden"),n){e.scrollTop>0&&(e.style.scrollBehavior="smooth",window.scrollTo({top:0,behavior:"smooth"}),e.scrollTo({top:0,behavior:"smooth"}),setTimeout((function(){e.style.scrollBehavior="auto"}),500))}}));let g=0;e.addEventListener("scroll",function(){const n=this.document.getElementById("fixedPanel"),t=e.scrollTop;t>g&&t>100?n.classList.add("minimized"):n.classList.remove("minimized"),g=t}.bind(this)),e.addEventListener("paste",function(n){n.preventDefault();let e=n.clipboardData.getData("text/html");if(e){const n=document.createElement("div");n.innerHTML=e;const t=n.getElementsByTagName("script"),o=n.getElementsByTagName("style");Array.from(t).forEach((n=>n.remove())),Array.from(o).forEach((n=>n.remove()));const i=["font-weight","font-style","text-decoration","color","background-color"];!function n(e){if(3===e.nodeType)return;const t=e.attributes;if(t&&(Array.from(t).forEach((n=>{"style"!==n.name&&e.removeAttribute(n.name)})),e.style)){const n=e.style;Array.from(n).forEach((e=>{i.includes(e)||n.removeProperty(e)}))}Array.from(e.children).forEach(n)}(n),this.document.execCommand("insertHTML",!1,n.innerHTML)}else e=n.clipboardData.getData("text/rtf")||n.clipboardData.getData("application/rtf"),e?this.document.execCommand("insertHTML",!1,e):(e=n.clipboardData.getData("text/plain").replace(/[\r\n]{3,}/g,"\n\n").replace(/\s{2,}/g," "),this.document.execCommand("insertText",!1,e));o.call(this)}.bind(this)),o.call(this)}})()}();