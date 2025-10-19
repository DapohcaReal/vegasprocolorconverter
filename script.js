function createInputFields(type) {
  const container = document.getElementById("inputFields");
  container.innerHTML = "";

  if (type === "rgb") {
    container.innerHTML = `
      <label>R (0–255):</label><input type="number" id="r" min="0" max="255" />
      <label>G (0–255):</label><input type="number" id="g" min="0" max="255" />
      <label>B (0–255):</label><input type="number" id="b" min="0" max="255" />
    `;
  } else if (type === "hex") {
    container.innerHTML = `
      <label>HEX (#RRGGBB):</label><input type="text" id="hex" placeholder="#FFFFFF" />
    `;
  } else if (type === "hsl") {
    container.innerHTML = `
      <label>H (0–360):</label><input type="number" id="h" min="0" max="360" />
      <label>S (0–100):</label><input type="number" id="s" min="0" max="100" />
      <label>L (0–100):</label><input type="number" id="l" min="0" max="100" />
    `;
  }
}

document.getElementById("inputType").addEventListener("change", (e) => {
  createInputFields(e.target.value);
});

createInputFields("rgb");

function convertColor() {
  const type = document.getElementById("inputType").value;
  let r, g, b;
  const alpha = parseInt(document.getElementById("alpha").value) || 255;

  if (type === "rgb") {
    r = parseInt(document.getElementById("r").value);
    g = parseInt(document.getElementById("g").value);
    b = parseInt(document.getElementById("b").value);
  } else if (type === "hex") {
    let hex = document.getElementById("hex").value.replace("#", "");
    if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else if (type === "hsl") {
    const h = parseFloat(document.getElementById("h").value);
    const s = parseFloat(document.getElementById("s").value) / 100;
    const l = parseFloat(document.getElementById("l").value) / 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r1, g1, b1;

    if (h < 60) [r1, g1, b1] = [c, x, 0];
    else if (h < 120) [r1, g1, b1] = [x, c, 0];
    else if (h < 180) [r1, g1, b1] = [0, c, x];
    else if (h < 240) [r1, g1, b1] = [0, x, c];
    else if (h < 300) [r1, g1, b1] = [x, 0, c];
    else [r1, g1, b1] = [c, 0, x];

    r = Math.round((r1 + m) * 255);
    g = Math.round((g1 + m) * 255);
    b = Math.round((b1 + m) * 255);
  }

  const vegas = [
    r / 255,
    g / 255,
    b / 255,
    alpha / 255
  ];

  document.getElementById("vegasResult").textContent = vegas.join(", ");
}

function copyResult() {
  const text = document.getElementById("vegasResult").textContent;
  navigator.clipboard.writeText(text);
}
