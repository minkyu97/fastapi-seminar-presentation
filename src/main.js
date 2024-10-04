import Reveal from "reveal.js";
import RevealHighlight from "reveal.js/plugin/highlight/highlight.esm.js";
import RevealMarkdown from "reveal.js/plugin/markdown/markdown.esm.js";
import RevealMath from "reveal.js/plugin/math/math.esm.js";
import RevealNotes from "reveal.js/plugin/notes/notes.esm.js";

Reveal.initialize({
  plugins: [RevealMarkdown, RevealHighlight, RevealNotes, RevealMath.MathJax3],
  slideNumber: true,
  showNotes: true,
  pdfSeparateFragments: false,
})
