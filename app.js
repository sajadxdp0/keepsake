const input = document.querySelector('#name');
const previewName = document.querySelector('#preview-name');
const count = document.querySelector('#count');
const downloadButton = document.querySelector('#download');
const MAX_NAME_LENGTH = 42;

function updatePreview() {
  const name = input.value.trim() || 'Your Name';
  previewName.textContent = name;
  count.textContent = `${input.value.length} / ${MAX_NAME_LENGTH}`;
}

function escapeXml(value) {
  return value.replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'
  })[char]);
}

function makeSvg(name) {
  const safeName = escapeXml(name);
  const fontSize = Math.max(28, Math.min(76, 1360 / Math.max(Array.from(name).length * 0.55, 1)));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="1500" viewBox="0 0 1600 1000">
  <rect width="1600" height="1000" fill="#fbfaf6"/>
  <rect x="40" y="40" width="1520" height="920" fill="none" stroke="#e1ddd3" stroke-width="2"/>
  <circle cx="1510" cy="92" r="90" fill="none" stroke="#e2ded3" stroke-width="2"/><circle cx="1510" cy="92" r="70" fill="none" stroke="#f4a31d" stroke-opacity=".08" stroke-width="22"/>
  <g font-family="Arial, sans-serif" fill="#191d18"><rect x="96" y="86" width="42" height="42" fill="#078d58"/><text x="117" y="114" fill="#fff" font-size="19" font-weight="700" text-anchor="middle">cf</text><text x="154" y="114" font-size="23" font-weight="700">cashfree <tspan fill="#078d58">×</tspan> sarvam</text><text x="1490" y="96" text-anchor="end" font-family="monospace" font-size="15" letter-spacing="3" fill="#77796f">BUILDATHON</text><text x="1490" y="120" text-anchor="end" font-family="monospace" font-size="15" letter-spacing="3" fill="#77796f">2026</text></g>
  <circle cx="800" cy="270" r="31" fill="none" stroke="#d6a94d" stroke-width="2"/><text x="800" y="280" text-anchor="middle" font-family="Georgia,serif" font-size="29" fill="#a97505">✳</text>
  <text x="800" y="365" text-anchor="middle" font-family="monospace" font-size="16" letter-spacing="5" fill="#078d58">A MOMENT WORTH KEEPING</text>
  <text x="800" y="495" text-anchor="middle" font-family="Georgia,serif" font-size="${fontSize}" font-weight="600" fill="#191d18">${safeName}</text>
  <path d="M660 540h95m90 0h95" stroke="#d2c9b6" stroke-width="2"/><text x="800" y="546" text-anchor="middle" font-family="Georgia,serif" font-size="18" fill="#c28a1f">✦</text>
  <text x="800" y="595" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" fill="#5f615a">For showing up, building boldly,</text><text x="800" y="628" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" fill="#5f615a">and making something real.</text>
  <text x="800" y="706" text-anchor="middle" font-family="monospace" font-size="15" letter-spacing="4" fill="#65665f">CASHFREE <tspan fill="#078d58">×</tspan> SARVAM AI BUILDATHON</text>
  <text x="96" y="900" font-family="monospace" font-size="14" letter-spacing="2" fill="#797a72">BENGALURU · 21 NOV 2026</text><rect x="1230" y="864" width="274" height="48" fill="#fbf5e5" stroke="#e5d9b7"/><text x="1367" y="894" text-anchor="middle" font-family="monospace" font-size="13" letter-spacing="1.5" fill="#89681e">UNOFFICIAL KEEPSAKE</text>
  </svg>`;
}

async function downloadKeepsake() {
  const name = input.value.trim() || 'Your Name';
  const svg = new Blob([makeSvg(name)], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svg);
  const image = new Image();
  image.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 2400;
    canvas.height = 1500;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    canvas.toBlob(blob => {
      if (!blob) return;
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'buildathon-keepsake.png';
      link.click();
      URL.revokeObjectURL(downloadUrl);
    }, 'image/png');
  };
  image.onerror = () => URL.revokeObjectURL(url);
  image.src = url;
}

input.addEventListener('input', updatePreview);
downloadButton.addEventListener('click', downloadKeepsake);
updatePreview();
