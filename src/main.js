import Reveal from "reveal.js";
import RevealHighlight from "reveal.js/plugin/highlight/highlight.esm.js";
import RevealMarkdown from "reveal.js/plugin/markdown/markdown.esm.js";

Reveal.initialize({
  plugins: [RevealMarkdown, RevealHighlight],
  slideNumber: true,
  showNotes: true,
  pdfSeparateFragments: false,
  previewLinks: true,
})
