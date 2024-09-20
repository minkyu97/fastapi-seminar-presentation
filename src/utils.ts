export function isPrintPdf() {
  const search = window.location.search;
  const params = new URLSearchParams(search);
  return params.has('print-pdf');
}
