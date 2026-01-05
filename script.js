const analysisOne = {
  name: 'Min condition',
  rhoCp: 1200,
  k: 0.15,
  cooling: 35,
};

const analysisTwo = {
  name: 'Max condition',
  rhoCp: 2900,
  k: 0.45,
  cooling: 50,
};

function computeFactors(a1, a2) {
  // Assume coolingTime = a * rhoCp + b * k
  const denominator = a1.rhoCp * a2.k - a2.rhoCp * a1.k;
  const a = (a1.cooling * a2.k - a2.cooling * a1.k) / denominator;
  const b = (a1.rhoCp * a2.cooling - a2.rhoCp * a1.cooling) / denominator;
  return { a, b };
}

function generateSurface(factors) {
  const rhoRange = linspace(1200, 2900, 16);
  const kRange = linspace(0.15, 0.45, 16);
  const z = kRange.map((k) =>
    rhoRange.map((rho) => factors.a * rho + factors.b * k)
  );

  Plotly.newPlot(
    'surfacePlot',
    [
      {
        type: 'surface',
        x: rhoRange,
        y: kRange,
        z,
        colorscale: 'Blues',
        showscale: true,
        contours: {
          z: { show: true, usecolormap: true, project: { z: true } },
        },
      },
    ],
    {
      margin: { t: 20, l: 40, r: 20, b: 40 },
      scene: {
        xaxis: { title: 'rho.Cp' },
        yaxis: { title: 'k' },
        zaxis: { title: 'Cooling time (s)' },
        camera: { eye: { x: 1.8, y: 1.4, z: 1.1 } },
      },
    }
  );
}

function generateIsoCurve(factors, target) {
  const kRange = linspace(0.15, 0.45, 50);
  const rhoValues = kRange.map((k) => (target - factors.b * k) / factors.a);
  const filtered = kRange
    .map((k, idx) => ({ k, rho: rhoValues[idx] }))
    .filter((point) => point.rho >= 1000 && point.rho <= 3200);

  const trace = {
    x: filtered.map((p) => p.k),
    y: filtered.map((p) => p.rho),
    mode: 'lines+markers',
    line: { color: '#0b5cff', width: 3 },
    marker: { size: 6 },
    name: 'rho.Cp vs k',
  };

  Plotly.newPlot(
    'isoPlot',
    [trace],
    {
      margin: { t: 10, l: 50, r: 10, b: 50 },
      xaxis: { title: 'k (W/m.K)' },
      yaxis: { title: 'rho.Cp (J/kg.K)' },
      shapes: [
        {
          type: 'line',
          x0: analysisOne.k,
          x1: analysisOne.k,
          y0: 1000,
          y1: 3200,
          line: { dash: 'dot', color: '#94a3b8' },
        },
        {
          type: 'line',
          x0: analysisTwo.k,
          x1: analysisTwo.k,
          y0: 1000,
          y1: 3200,
          line: { dash: 'dot', color: '#94a3b8' },
        },
      ],
      annotations: [
        {
          x: analysisOne.k,
          y: (target - factors.b * analysisOne.k) / factors.a,
          xanchor: 'center',
          yanchor: 'bottom',
          showarrow: false,
          bgcolor: '#eef2ff',
          text: 'Min k',
          font: { color: '#4338ca' },
        },
        {
          x: analysisTwo.k,
          y: (target - factors.b * analysisTwo.k) / factors.a,
          xanchor: 'center',
          yanchor: 'top',
          showarrow: false,
          bgcolor: '#eef2ff',
          text: 'Max k',
          font: { color: '#4338ca' },
        },
      ],
    }
  );
}

function linspace(start, end, count) {
  const step = (end - start) / (count - 1);
  return Array.from({ length: count }, (_, i) => start + i * step);
}

function setFactorsText(factors) {
  const precision = 3;
  document.getElementById('factorA').textContent = factors.a.toFixed(precision);
  document.getElementById('factorB').textContent = factors.b.toFixed(precision);
}

function setPlaceHolderImage() {
  const svg = document.querySelector('#placeholderSvg').innerHTML.trim();
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const img = document.getElementById('previewImage');
  img.src = url;
  img.dataset.objectUrl = url;
  document.getElementById('previewName').textContent = 'No file selected';
}

function wireUpload() {
  const input = document.getElementById('cadUpload');
  const drop = document.querySelector('.upload-drop');

  drop.addEventListener('click', () => input.click());
  drop.addEventListener('dragover', (e) => {
    e.preventDefault();
    drop.classList.add('dragging');
  });
  drop.addEventListener('dragleave', () => drop.classList.remove('dragging'));
  drop.addEventListener('drop', (e) => {
    e.preventDefault();
    drop.classList.remove('dragging');
    if (e.dataTransfer.files?.length) {
      input.files = e.dataTransfer.files;
      previewFile(e.dataTransfer.files[0]);
    }
  });

  input.addEventListener('change', () => {
    const [file] = input.files;
    if (file) previewFile(file);
  });
}

function previewFile(file) {
  const preview = document.getElementById('previewImage');
  if (preview.dataset.objectUrl) {
    URL.revokeObjectURL(preview.dataset.objectUrl);
  }

  const isImage = file.type.startsWith('image/');
  const url = URL.createObjectURL(file);
  preview.src = isImage ? url : preview.dataset.placeholder;
  preview.dataset.objectUrl = url;
  document.getElementById('previewName').textContent = file.name;
}

function init() {
  const factors = computeFactors(analysisOne, analysisTwo);
  setFactorsText(factors);
  generateSurface(factors);
  generateIsoCurve(factors, Number(document.getElementById('targetTime').value));

  setPlaceHolderImage();
  const placeholderUrl = document.getElementById('previewImage').src;
  document.getElementById('previewImage').dataset.placeholder = placeholderUrl;
  wireUpload();

  document.getElementById('runButton').addEventListener('click', () => {
    const target = Number(document.getElementById('targetTime').value);
    generateIsoCurve(factors, target);
    document.getElementById('toolChip').textContent = `Tool: ${document.getElementById('toolMaterial').value}`;
  });
}

document.addEventListener('DOMContentLoaded', init);
