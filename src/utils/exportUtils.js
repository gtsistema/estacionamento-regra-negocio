export function exportJSON(map) {
  const data = JSON.stringify(map, null, 2);
  download(data, `${slug(map.name)}.json`, 'application/json');
}

export function exportCSV(map) {
  const headers = ['ID', 'Pai', 'Título', 'Tipo', 'Status', 'Prioridade', 'Responsável', 'Prazo', 'Descrição'];
  const rows = map.nodes.map(n => [
    n.id, n.parentId || '', n.title, n.type, n.status || '', n.priority || '',
    n.responsible || '', n.deadline || '', (n.description || '').replace(/,/g, ';'),
  ]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  download(csv, `${slug(map.name)}.csv`, 'text/csv');
}

export async function exportPNG(elementId) {
  const { default: html2canvas } = await import('html2canvas');
  const el = document.getElementById(elementId);
  if (!el) return;
  const canvas = await html2canvas(el, { backgroundColor: '#0F172A', scale: 2 });
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mapa-mental.png';
    a.click();
    URL.revokeObjectURL(url);
  });
}

export async function exportPDF(map, elementId) {
  const { default: html2canvas } = await import('html2canvas');
  const { jsPDF } = await import('jspdf');

  const el = document.getElementById(elementId);
  if (!el) return;

  const canvas = await html2canvas(el, { backgroundColor: '#0F172A', scale: 1.5 });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  const W = pdf.internal.pageSize.getWidth();
  const H = pdf.internal.pageSize.getHeight();
  const ratio = canvas.width / canvas.height;
  const imgH = Math.min(H - 30, W / ratio);
  const imgW = imgH * ratio;

  // Header
  pdf.setFillColor(15, 23, 42);
  pdf.rect(0, 0, W, H, 'F');
  pdf.setTextColor(56, 189, 248);
  pdf.setFontSize(16);
  pdf.text(map.name, 14, 14);
  pdf.setTextColor(148, 163, 184);
  pdf.setFontSize(10);
  pdf.text(map.description || '', 14, 21);

  // Image
  pdf.addImage(imgData, 'PNG', (W - imgW) / 2, 28, imgW, imgH);

  // Footer stats
  const total = map.nodes.length;
  const done = map.nodes.filter(n => n.status === 'concluido').length;
  pdf.setTextColor(100, 116, 139);
  pdf.setFontSize(9);
  pdf.text(`Total: ${total} itens  |  Concluídos: ${done}  |  Progresso: ${total ? Math.round(done / total * 100) : 0}%  |  Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, H - 6);

  pdf.save(`${slug(map.name)}.pdf`);
}

function download(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function slug(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}
