import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type Field = { label: string; value: string };
type City = { name: string; marathi: string; tag?: "CITY" | "RAILWAY"; fields: Field[] };

const CITIES: City[] = [
  { name: "MUMBAI", marathi: "मुंबई शहर", tag: "CITY", fields: [
    { label: "Commissioner", value: "Deven Bharti, IPS" },
    { label: "Population", value: "13.6 Million" },
    { label: "Jurisdiction", value: "Mumbai City & Suburban" },
    { label: "Police Stations", value: "94" },
  ]},
  { name: "PUNE", marathi: "पुणे शहर", tag: "CITY", fields: [
    { label: "Commissioner", value: "Amitesh Kumar, IPS" },
    { label: "Population", value: "4.5 Million" },
    { label: "Jurisdiction", value: "Pune City Commissionerate" },
    { label: "Police Stations", value: "52" },
  ]},
  { name: "THANE", marathi: "ठाणे शहर", tag: "CITY", fields: [
    { label: "Commissioner", value: "Vikram Patil, IPS" },
    { label: "Population", value: "2.5 Million" },
    { label: "Jurisdiction", value: "Thane City Commissionerate" },
    { label: "Police Stations", value: "35" },
  ]},
  { name: "NAGPUR", marathi: "नागपूर शहर", tag: "CITY", fields: [
    { label: "Title", value: "State's Second Capital" },
    { label: "Commissioner", value: "Suresh Sharma, IPS" },
    { label: "Population", value: "2.4 Million" },
    { label: "Police Stations", value: "30" },
  ]},
  { name: "NASHIK", marathi: "नाशिक शहर", tag: "CITY", fields: [
    { label: "Description", value: "Wine Capital of India" },
    { label: "Population", value: "1.5M" },
    { label: "Notes", value: "Major wine & tourist region" },
  ]},
  { name: "NAVI MUMBAI", marathi: "नवी मुंबई", tag: "CITY", fields: [
    { label: "Description", value: "Planned City" },
    { label: "Population", value: "1.1M" },
    { label: "Feature", value: "Harbour Zone" },
  ]},
  { name: "SAMBHAJINAGAR", marathi: "छत्रपती संभाजीनगर", tag: "CITY", fields: [
    { label: "Description", value: "Marathwada HQ" },
    { label: "Population", value: "1.2M" },
    { label: "Notes", value: "Marathwada admin centre" },
  ]},
  { name: "SOLAPUR", marathi: "सोलापूर शहर", tag: "CITY", fields: [
    { label: "Description", value: "Textile City" },
    { label: "Location", value: "Southern Maharashtra" },
    { label: "Feature", value: "Industrial gateway" },
  ]},
  { name: "AMRAVATI", marathi: "अमरावती शहर", tag: "CITY", fields: [
    { label: "Region", value: "Vidarbha — Melghat" },
    { label: "Population", value: "1.5M" },
    { label: "Notes", value: "Gateway to Melghat reserve" },
  ]},
  { name: "PIMPRI-CHINCHWAD", marathi: "पिंपरी चिंचवड", tag: "CITY", fields: [
    { label: "Description", value: "Industrial Capital" },
    { label: "Region", value: "Pune Metro" },
    { label: "Population", value: "1.1M" },
  ]},
  { name: "MIRA-BHAYANDER", marathi: "मिरा-भायंदर, वसई-विरार", tag: "CITY", fields: [
    { label: "Belt", value: "Fastest growing · MMR" },
    { label: "Population", value: "1.2M" },
    { label: "Notes", value: "HQ Mira-Bhayander & Vasai-Virar" },
  ]},
  { name: "RAILWAY POLICE", marathi: "मुंबई रेल्वे पोलीस", tag: "RAILWAY", fields: [
    { label: "Network", value: "Largest in Asia" },
    { label: "Daily Commuters", value: "7.5 Million" },
    { label: "Notes", value: "Suburban rail safety" },
  ]},
];

// ---------- Helpers ----------
function drawBrassRod(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  // Body
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, "#8a6a2d");
  g.addColorStop(0.25, "#e8c878");
  g.addColorStop(0.5, "#fff0b8");
  g.addColorStop(0.75, "#c89a40");
  g.addColorStop(1, "#6b4d1c");
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
  // Top/bottom edge lines
  ctx.strokeStyle = "rgba(60,40,10,0.5)"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x, y + 0.5); ctx.lineTo(x + w, y + 0.5); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x, y + h - 0.5); ctx.lineTo(x + w, y + h - 0.5); ctx.stroke();
  // Finials (orbs at ends)
  const r = h * 0.95;
  for (const cx of [x - r * 0.3, x + w + r * 0.3]) {
    const rg = ctx.createRadialGradient(cx - r * 0.3, y + h / 2 - r * 0.3, r * 0.1, cx, y + h / 2, r);
    rg.addColorStop(0, "#fff3c4");
    rg.addColorStop(0.5, "#d4a13a");
    rg.addColorStop(1, "#5a3f12");
    ctx.fillStyle = rg;
    ctx.beginPath(); ctx.arc(cx, y + h / 2, r, 0, Math.PI * 2); ctx.fill();
    // small inner ring
    ctx.strokeStyle = "rgba(40,25,5,0.6)"; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(cx, y + h / 2, r * 0.55, 0, Math.PI * 2); ctx.stroke();
  }
  // Decorative bands near each end
  ctx.fillStyle = "rgba(70,45,10,0.55)";
  ctx.fillRect(x + 4, y, 3, h);
  ctx.fillRect(x + w - 7, y, 3, h);
}

function drawTassel(ctx: CanvasRenderingContext2D, cx: number, topY: number, len: number) {
  // Cord
  ctx.strokeStyle = "#5a1717"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cx, topY); ctx.lineTo(cx, topY + len * 0.25); ctx.stroke();
  // Beads
  const beadColors = ["#e8c878", "#8a1a1a", "#e8c878"];
  let by = topY + len * 0.06;
  for (const col of beadColors) {
    const rg = ctx.createRadialGradient(cx - 2, by - 2, 1, cx, by, 6);
    rg.addColorStop(0, "#fff0c4"); rg.addColorStop(1, col);
    ctx.fillStyle = rg;
    ctx.beginPath(); ctx.arc(cx, by, 6, 0, Math.PI * 2); ctx.fill();
    by += 14;
  }
  // Head knot
  const knotY = topY + len * 0.28;
  ctx.fillStyle = "#6b1d1d";
  ctx.beginPath(); ctx.ellipse(cx, knotY, 14, 18, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.4)"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.ellipse(cx, knotY, 14, 18, 0, 0, Math.PI * 2); ctx.stroke();
  // Threads
  const threadTop = knotY + 14;
  const threadBot = topY + len;
  const count = 22;
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const offset = (t - 0.5) * 24;
    const shade = 0.4 + 0.5 * Math.sin(i * 1.3);
    ctx.strokeStyle = `rgba(${110 + shade * 30}, ${20 + shade * 10}, ${20 + shade * 10}, 0.95)`;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(cx + offset * 0.2, threadTop);
    ctx.quadraticCurveTo(cx + offset * 0.6, (threadTop + threadBot) / 2, cx + offset, threadBot);
    ctx.stroke();
  }
}

function drawFringe(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const count = Math.floor(w / 4);
  for (let i = 0; i < count; i++) {
    const fx = x + (i + 0.5) * (w / count);
    const shade = 0.5 + 0.5 * Math.sin(i * 0.9);
    ctx.strokeStyle = `rgba(${100 + shade * 40}, ${20 + shade * 12}, ${20 + shade * 12}, 0.95)`;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(fx, y);
    ctx.lineTo(fx + (Math.sin(i * 2.3) * 1.5), y + h);
    ctx.stroke();
  }
}

function drawCornerFlourish(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rot: number) {
  ctx.save();
  ctx.translate(x, y); ctx.rotate(rot);
  ctx.strokeStyle = "rgba(180, 140, 60, 0.85)";
  ctx.fillStyle = "rgba(200, 160, 75, 0.75)";
  ctx.lineWidth = 1.4;
  // Vine
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(size * 0.3, size * 0.1, size * 0.55, size * 0.35, size * 0.85, size * 0.85);
  ctx.stroke();
  // Leaves
  for (let i = 0; i < 4; i++) {
    const t = 0.2 + i * 0.2;
    const lx = size * t * 0.9;
    const ly = size * t * t * 0.9;
    ctx.beginPath();
    ctx.ellipse(lx, ly, size * 0.09, size * 0.04, Math.PI / 4 + i * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
  // Small curl
  ctx.beginPath();
  ctx.arc(size * 0.15, size * 0.05, size * 0.07, Math.PI, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawBadge(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  // Star outline (8-point burst)
  ctx.save();
  ctx.translate(cx, cy);
  const points = 8;
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const ang = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const rad = i % 2 === 0 ? r : r * 0.62;
    const px = Math.cos(ang) * rad;
    const py = Math.sin(ang) * rad;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  const sg = ctx.createRadialGradient(0, -r * 0.3, r * 0.1, 0, 0, r);
  sg.addColorStop(0, "#f8d770");
  sg.addColorStop(0.6, "#c8932a");
  sg.addColorStop(1, "#6b4814");
  ctx.fillStyle = sg; ctx.fill();
  ctx.strokeStyle = "rgba(40,20,5,0.8)"; ctx.lineWidth = 1.5; ctx.stroke();

  // Inner maroon shield/circle
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.62, 0, Math.PI * 2);
  const mg = ctx.createRadialGradient(-r * 0.15, -r * 0.2, r * 0.05, 0, 0, r * 0.62);
  mg.addColorStop(0, "#9c3030");
  mg.addColorStop(1, "#4a0e0e");
  ctx.fillStyle = mg; ctx.fill();
  ctx.strokeStyle = "#d4af37"; ctx.lineWidth = 2; ctx.stroke();

  // MAHARASHTRA top arc text
  ctx.fillStyle = "#f0d77a";
  ctx.font = `bold ${Math.round(r * 0.16)}px serif`;
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText("MAHARASHTRA", 0, -r * 0.38);

  // Central gold star
  const sr = r * 0.34;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const ang = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const rad = i % 2 === 0 ? sr : sr * 0.42;
    const px = Math.cos(ang) * rad;
    const py = Math.sin(ang) * rad;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  const gg = ctx.createLinearGradient(0, -sr, 0, sr);
  gg.addColorStop(0, "#fff2b0"); gg.addColorStop(1, "#b88828");
  ctx.fillStyle = gg; ctx.fill();
  ctx.strokeStyle = "#5a3a0c"; ctx.lineWidth = 1; ctx.stroke();

  // Marathi bottom text
  ctx.fillStyle = "#f0d77a";
  ctx.font = `bold ${Math.round(r * 0.14)}px serif`;
  ctx.fillText("महाराष्ट्र पोलीस", 0, r * 0.42);
  ctx.restore();
}

// ---------- Parchment texture ----------
function drawParchment(city: City): HTMLCanvasElement {
  const W = 512, H = 720;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d")!;

  // Layout zones
  const rodH = 36;
  const topRodY = 28;
  const botRodY = H - 90;
  const fringeY = botRodY + rodH;
  const fringeH = H - fringeY - 6;
  const parchTop = topRodY + rodH - 4;
  const parchBot = botRodY + 4;

  // ===== Parchment body =====
  const g = ctx.createLinearGradient(0, parchTop, 0, parchBot);
  g.addColorStop(0, "#FBEFCF");
  g.addColorStop(0.5, "#F5E8C8");
  g.addColorStop(1, "#E7D7B0");
  ctx.fillStyle = g;
  ctx.fillRect(28, parchTop, W - 56, parchBot - parchTop);

  // Grain noise
  const img = ctx.getImageData(28, parchTop, W - 56, parchBot - parchTop);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 14;
    img.data[i] += n; img.data[i + 1] += n - 2; img.data[i + 2] += n - 5;
  }
  ctx.putImageData(img, 28, parchTop);

  // Aging marks (soft brown blotches near edges)
  for (let i = 0; i < 18; i++) {
    const ax = 40 + Math.random() * (W - 80);
    const ay = parchTop + 20 + Math.random() * (parchBot - parchTop - 40);
    const ar = 8 + Math.random() * 22;
    const rg = ctx.createRadialGradient(ax, ay, 0, ax, ay, ar);
    rg.addColorStop(0, "rgba(140, 95, 40, 0.10)");
    rg.addColorStop(1, "rgba(140, 95, 40, 0)");
    ctx.fillStyle = rg;
    ctx.beginPath(); ctx.arc(ax, ay, ar, 0, Math.PI * 2); ctx.fill();
  }

  // Edge darkening
  const eg = ctx.createLinearGradient(0, parchTop, 0, parchBot);
  eg.addColorStop(0, "rgba(120,85,35,0.18)");
  eg.addColorStop(0.15, "rgba(0,0,0,0)");
  eg.addColorStop(0.85, "rgba(0,0,0,0)");
  eg.addColorStop(1, "rgba(120,85,35,0.18)");
  ctx.fillStyle = eg;
  ctx.fillRect(28, parchTop, W - 56, parchBot - parchTop);

  // ===== Double border =====
  ctx.strokeStyle = "#D4AF37"; ctx.lineWidth = 4;
  ctx.strokeRect(46, parchTop + 18, W - 92, parchBot - parchTop - 36);
  ctx.strokeStyle = "#8B6A3E"; ctx.lineWidth = 1.5;
  ctx.strokeRect(56, parchTop + 28, W - 112, parchBot - parchTop - 56);

  // ===== Corner flourishes =====
  const cornerInset = 60;
  drawCornerFlourish(ctx, cornerInset, parchTop + 32, 60, 0);
  drawCornerFlourish(ctx, W - cornerInset, parchTop + 32, 60, Math.PI / 2);
  drawCornerFlourish(ctx, cornerInset, parchBot - 32, 60, -Math.PI / 2);
  drawCornerFlourish(ctx, W - cornerInset, parchBot - 32, 60, Math.PI);

  // ===== Typography =====
  const tag = city.tag;
  // Name (Trajan-style serif)
  ctx.fillStyle = "#2a1605";
  const nameFont = city.name.length > 14 ? 38 : city.name.length > 10 ? 48 : 58;
  ctx.font = `900 ${nameFont}px "Trajan Pro", "Cinzel", Georgia, serif`;
  ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
  ctx.fillText(city.name, W / 2, parchTop + 130);

  // Marathi
  ctx.fillStyle = "#1C1006";
  ctx.font = "bold 30px serif";
  ctx.fillText(city.marathi, W / 2, parchTop + 172);

  // Divider line with diamond
  ctx.strokeStyle = "#8B6A3E"; ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 90, parchTop + 198);
  ctx.lineTo(W / 2 - 10, parchTop + 198);
  ctx.moveTo(W / 2 + 10, parchTop + 198);
  ctx.lineTo(W / 2 + 90, parchTop + 198);
  ctx.stroke();
  ctx.fillStyle = "#8B6A3E"; ctx.font = "12px serif";
  ctx.fillText("◆", W / 2, parchTop + 203);

  // Fields
  let yy = parchTop + 240;
  ctx.textAlign = "left";
  const leftX = 78;
  for (const f of city.fields) {
    ctx.fillStyle = "#3a2410";
    ctx.font = "700 15px Georgia, serif";
    ctx.fillText(f.label.toUpperCase() + ":", leftX, yy);
    yy += 24;
    ctx.fillStyle = "#1C1006";
    ctx.font = "600 19px Georgia, serif";
    const words = f.value.split(" "); let line = "";
    for (const w of words) {
      const test = line ? line + " " + w : w;
      if (ctx.measureText(test).width > W - 112) {
        ctx.fillText(line, 56, yy); line = w; yy += 24;
      } else line = test;
    }
    ctx.fillText(line, 56, yy);
    yy += 32;
  }
  return c;
}

// ---------- Cloth (Verlet) ----------
class Cloth {
  cols: number; rows: number; w: number; h: number;
  positions: Float32Array; prev: Float32Array; pinned: Uint8Array;
  initial: Float32Array;
  iterations: number;
  constraints: { a: number; b: number; rest: number }[] = [];
  origin: THREE.Vector3;
  mesh: THREE.Mesh;
  geo: THREE.BufferGeometry;
  posAttr: THREE.BufferAttribute;

  constructor(origin: THREE.Vector3, w: number, h: number, cols: number, rows: number, texture: THREE.Texture, iterations = 3) {
    this.origin = origin; this.w = w; this.h = h; this.cols = cols; this.rows = rows;
    this.iterations = iterations;
    const N = cols * rows;
    this.positions = new Float32Array(N * 3);
    this.prev = new Float32Array(N * 3);
    this.pinned = new Uint8Array(N);
    const uvs = new Float32Array(N * 2);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = y * cols + x;
        const px = origin.x + (x / (cols - 1) - 0.5) * w;
        const py = origin.y + (0.5 - y / (rows - 1)) * h;
        const pz = origin.z;
        this.positions[i * 3] = px; this.positions[i * 3 + 1] = py; this.positions[i * 3 + 2] = pz;
        this.prev[i * 3] = px; this.prev[i * 3 + 1] = py; this.prev[i * 3 + 2] = pz;
        uvs[i * 2] = x / (cols - 1); uvs[i * 2 + 1] = 1 - y / (rows - 1);
      }
    }
    for (let x = 0; x < cols; x++) this.pinned[x] = 1; // hang from top row
    this.initial = new Float32Array(this.positions);
    const addC = (a: number, b: number) => {
      const dx = this.positions[a * 3] - this.positions[b * 3];
      const dy = this.positions[a * 3 + 1] - this.positions[b * 3 + 1];
      this.constraints.push({ a, b, rest: Math.hypot(dx, dy) });
    };
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      const i = y * cols + x;
      if (x < cols - 1) addC(i, i + 1);
      if (y < rows - 1) addC(i, i + cols);
      if (x < cols - 1 && y < rows - 1) { addC(i, i + cols + 1); addC(i + 1, i + cols); }
    }
    const indices: number[] = [];
    for (let y = 0; y < rows - 1; y++) for (let x = 0; x < cols - 1; x++) {
      const i = y * cols + x;
      indices.push(i, i + cols, i + 1, i + 1, i + cols, i + cols + 1);
    }
    this.geo = new THREE.BufferGeometry();
    this.posAttr = new THREE.BufferAttribute(this.positions, 3);
    this.posAttr.setUsage(THREE.DynamicDrawUsage);
    this.geo.setAttribute("position", this.posAttr);
    this.geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    this.geo.setIndex(indices);
    this.geo.computeVertexNormals();
    const mat = new THREE.MeshStandardMaterial({
      map: texture, side: THREE.DoubleSide, roughness: 0.6, metalness: 0.0, emissive: 0x000000, emissiveIntensity: 0, color: 0xffffff,
    });
    this.mesh = new THREE.Mesh(this.geo, mat);
  }

  step(dt: number, gravity: number, wind: THREE.Vector3) {
    const damp = 0.94;
    const N = this.cols * this.rows;
    for (let i = 0; i < N; i++) {
      if (this.pinned[i]) continue;
      const ix = i * 3;
      const vx = (this.positions[ix] - this.prev[ix]) * damp;
      const vy = (this.positions[ix + 1] - this.prev[ix + 1]) * damp;
      const vz = (this.positions[ix + 2] - this.prev[ix + 2]) * damp;
      this.prev[ix] = this.positions[ix];
      this.prev[ix + 1] = this.positions[ix + 1];
      this.prev[ix + 2] = this.positions[ix + 2];
      this.positions[ix] += vx + wind.x * dt;
      this.positions[ix + 1] += vy + gravity * dt * dt * 60;
      this.positions[ix + 2] += vz + wind.z * dt;
    }
    for (let iter = 0; iter < this.iterations; iter++) {
      for (const c of this.constraints) {
        const a3 = c.a * 3, b3 = c.b * 3;
        const dx = this.positions[b3] - this.positions[a3];
        const dy = this.positions[b3 + 1] - this.positions[a3 + 1];
        const dz = this.positions[b3 + 2] - this.positions[a3 + 2];
        const d = Math.hypot(dx, dy, dz) || 1e-5;
        const diff = (d - c.rest) / d * 0.5;
        const tx = dx * diff, ty = dy * diff, tz = dz * diff;
        const aP = this.pinned[c.a], bP = this.pinned[c.b];
        if (!aP && !bP) {
          this.positions[a3] += tx; this.positions[a3 + 1] += ty; this.positions[a3 + 2] += tz;
          this.positions[b3] -= tx; this.positions[b3 + 1] -= ty; this.positions[b3 + 2] -= tz;
        } else if (!aP) {
          this.positions[a3] += tx * 2; this.positions[a3 + 1] += ty * 2; this.positions[a3 + 2] += tz * 2;
        } else if (!bP) {
          this.positions[b3] -= tx * 2; this.positions[b3 + 1] -= ty * 2; this.positions[b3 + 2] -= tz * 2;
        }
      }
    }
    this.posAttr.needsUpdate = true;
    this.geo.computeVertexNormals();
    this.geo.computeBoundingSphere();
  }

  findNearest(p: THREE.Vector3): number {
    let best = -1, bestD = Infinity;
    const N = this.cols * this.rows;
    for (let i = 0; i < N; i++) {
      const ix = i * 3;
      const dx = this.positions[ix] - p.x;
      const dy = this.positions[ix + 1] - p.y;
      const dz = this.positions[ix + 2] - p.z;
      const d = dx * dx + dy * dy + dz * dz;
      if (d < bestD) { bestD = d; best = i; }
    }
    return best;
  }

  reset() {
    this.positions.set(this.initial);
    this.prev.set(this.initial);
    this.posAttr.needsUpdate = true;
  }

  dispose() {
    this.geo.dispose();
    const mat = this.mesh.material as THREE.MeshStandardMaterial;
    mat.map?.dispose();
    mat.dispose();
  }
}

// ---------- Component ----------
type PerfTier = "high" | "medium" | "low";

function detectPerfTier(): PerfTier {
  if (typeof navigator === "undefined") return "high";
  const nav = navigator as Navigator & { deviceMemory?: number };
  const mem = nav.deviceMemory ?? 8;
  const cores = nav.hardwareConcurrency ?? 8;
  const coarse = typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)").matches;
  const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (reduced || mem <= 2 || cores <= 2) return "low";
  if (mem <= 4 || cores <= 4 || coarse) return "medium";
  return "high";
}

export default function CommissioneratesCloth() {
  const containerRef = useRef<HTMLDivElement>(null);
  const resetAllRef = useRef<() => void>(() => {});
  const [tier, setTier] = useState<PerfTier>("high");

  useEffect(() => {
    const container = containerRef.current!;
    const perfTier = detectPerfTier();
    setTier(perfTier);

    // Mesh density + solver iterations per tier (large card look preserved across tiers)
    const meshCols = perfTier === "high" ? 14 : perfTier === "medium" ? 11 : 8;
    const meshRows = perfTier === "high" ? 18 : perfTier === "medium" ? 14 : 10;
    const iterations = perfTier === "high" ? 3 : perfTier === "medium" ? 2 : 2;
    const maxDPR = perfTier === "high" ? 2 : perfTier === "medium" ? 1.5 : 1;
    const antialias = perfTier !== "low";

    const renderer = new THREE.WebGLRenderer({ antialias, alpha: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDPR));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    const dom = renderer.domElement;
    dom.style.touchAction = "none";
    dom.style.display = "block";
    dom.style.width = "100%";
    dom.style.height = "100%";
    dom.style.cursor = "grab";

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d0d0d);
    scene.fog = new THREE.Fog(0x0d0d0d, 22, 60);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);

    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const key = new THREE.DirectionalLight(0xfff6dc, 1.4);
    key.position.set(5, 8, 6); scene.add(key);
    const rim = new THREE.DirectionalLight(0xffe7a8, 0.6);
    rim.position.set(-5, 2, -3); scene.add(rim);
    const front = new THREE.DirectionalLight(0xffffff, 0.7);
    front.position.set(0, 0, 10); scene.add(front);

    // ---- Responsive grid: keep 12 cards uniform, no clipping ----
    // cols by container width; pick card size from cols so all fit cleanly.
    const cw = container.clientWidth;
    const cols = cw >= 1100 ? 4 : cw >= 720 ? 3 : cw >= 380 ? 3 : 2;
    const rows = Math.ceil(CITIES.length / cols);
    // Constant aspect 4:5 banners. Size scales with column count so cells stay readable.
    const cardW = cols === 4 ? 3.6 : cols === 3 ? 4.2 : 4.8;
    const cardH = cardW * 1.25;
    const gapX = cardW * 0.28;
    const gapY = cardH * 0.32;
    const totalW = cols * cardW + (cols - 1) * gapX;
    const totalH = rows * cardH + (rows - 1) * gapY;

    // Size the canvas to the grid aspect ratio so all 12 cards always fit on screen.
    const margin = Math.max(cardW, cardH) * 0.35;
    const gridAspect = (totalW + margin * 2) / (totalH + margin * 2);
    const containerW = container.clientWidth;
    // Fit all 12 banners within the viewport — cap height so nothing is offscreen.
    const desiredH = Math.min(window.innerHeight * 0.9, containerW / gridAspect, 1400);
    container.style.height = `${desiredH}px`;

    const cloths: Cloth[] = [];
    CITIES.forEach((city, idx) => {
      const cx = idx % cols, cy = Math.floor(idx / cols);
      const x = -totalW / 2 + cx * (cardW + gapX) + cardW / 2;
      const y = totalH / 2 - cy * (cardH + gapY) - cardH / 2;
      const tex = new THREE.CanvasTexture(drawParchment(city));
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = perfTier === "low" ? 2 : 8;
      const cloth = new Cloth(new THREE.Vector3(x, y, 0), cardW, cardH, meshCols, meshRows, tex, iterations);
      cloths.push(cloth);
      scene.add(cloth.mesh);
    });

    function fit() {
      const w = container.clientWidth, h = container.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      const vFov = camera.fov * Math.PI / 180;
      // Margin scaled so banners never clip at any breakpoint
      const distH = (totalH / 2 + margin) / Math.tan(vFov / 2);
      const distW = (totalW / 2 + margin) / (Math.tan(vFov / 2) * camera.aspect);
      camera.position.set(0, 0, Math.max(distH, distW));
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    }
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(container);

    // ---- Reset ----
    resetAllRef.current = () => { for (const c of cloths) c.reset(); };

    // ---- Pointer / Touch ----
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const zPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    let drag: { cloth: Cloth; idx: number; plane: THREE.Plane } | null = null;

    const setNDC = (e: PointerEvent) => {
      const r = dom.getBoundingClientRect();
      ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    };

    // Pick a banner reliably: precise raycast first, fall back to nearest banner
    // along the ray's z=0 intersection so any tap inside the canvas grabs something.
    const pickCloth = (): { cloth: Cloth; point: THREE.Vector3 } | null => {
      const hits = raycaster.intersectObjects(cloths.map(c => c.mesh), false);
      if (hits.length) {
        const cloth = cloths.find(c => c.mesh === hits[0].object)!;
        return { cloth, point: hits[0].point };
      }
      const p = new THREE.Vector3();
      if (!raycaster.ray.intersectPlane(zPlane, p)) return null;
      // Find closest banner center within a tolerance proportional to card size.
      let best: Cloth | null = null, bestD = Infinity;
      for (const c of cloths) {
        const dx = c.origin.x - p.x;
        const dy = c.origin.y - p.y;
        const d = dx * dx + dy * dy;
        if (d < bestD) { bestD = d; best = c; }
      }
      if (!best) return null;
      const tol = Math.max(cardW, cardH) * 0.9;
      if (bestD > tol * tol) return null;
      return { cloth: best, point: p };
    };

    const onDown = (e: PointerEvent) => {
      setNDC(e);
      raycaster.setFromCamera(ndc, camera);
      const picked = pickCloth();
      if (!picked) return;
      const idx = picked.cloth.findNearest(picked.point);
      if (idx < 0) return;
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -picked.cloth.origin.z);
      drag = { cloth: picked.cloth, idx, plane };
      try { dom.setPointerCapture(e.pointerId); } catch { /* ignore */ }
      dom.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!drag) return;
      setNDC(e);
      raycaster.setFromCamera(ndc, camera);
      const hit = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(drag.plane, hit)) {
        const ix = drag.idx * 3;
        drag.cloth.positions[ix] = hit.x;
        drag.cloth.positions[ix + 1] = hit.y;
        drag.cloth.positions[ix + 2] = hit.z;
        drag.cloth.prev[ix] = hit.x;
        drag.cloth.prev[ix + 1] = hit.y;
        drag.cloth.prev[ix + 2] = hit.z;
      }
    };
    const onUp = (e: PointerEvent) => {
      drag = null;
      dom.style.cursor = "grab";
      try { dom.releasePointerCapture(e.pointerId); } catch { /* ignore */ }
    };
    dom.addEventListener("pointerdown", onDown);
    dom.addEventListener("pointermove", onMove);
    dom.addEventListener("pointerup", onUp);
    dom.addEventListener("pointercancel", onUp);

    // ---- Animation ----
    let raf = 0;
    let last = performance.now();
    const wind = new THREE.Vector3();
    const targetDt = perfTier === "low" ? 1 / 30 : 1 / 60;
    let acc = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      acc += dt;
      // Cap simulation rate on low-tier devices to keep fps smooth
      if (acc >= targetDt) {
        wind.x = Math.sin(now * 0.00015) * 0.02;
        wind.z = Math.cos(now * 0.0002) * 0.015;
        for (const c of cloths) c.step(Math.min(acc, 0.05), -0.012, wind);
        acc = 0;
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      dom.removeEventListener("pointerdown", onDown);
      dom.removeEventListener("pointermove", onMove);
      dom.removeEventListener("pointerup", onUp);
      dom.removeEventListener("pointercancel", onUp);
      for (const c of cloths) c.dispose();
      renderer.dispose();
      if (dom.parentNode) dom.parentNode.removeChild(dom);
    };
  }, []);

  return (
    <section className="relative py-20 px-4" style={{ background: "#0d0d0d" }}>
      <div className="max-w-7xl mx-auto text-center mb-10">
        <div className="font-devanagari text-[var(--gold)] text-sm tracking-[0.4em] mb-3">
          ★ आयुक्तालय ★
        </div>
        <h2 className="font-display text-3xl md:text-5xl gold-shimmer tracking-wide">
          The Commissionerates
        </h2>
        <p className="mt-4 text-white/55 max-w-2xl mx-auto text-sm md:text-base">
          Twelve cloth banners hung in the wind. Drag any scroll to feel the fabric move.
        </p>
      </div>
      <div className="relative mx-auto" style={{ maxWidth: "1600px" }}>
        <div
          ref={containerRef}
          className="relative w-full rounded-lg overflow-hidden"
          style={{ minHeight: "60vh" }}
        />
        <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
          <span className="text-[10px] uppercase tracking-[0.25em] text-white/45 px-2 py-1 rounded bg-black/40 backdrop-blur-sm border border-white/10">
            {tier} perf
          </span>
          <button
            type="button"
            onClick={() => resetAllRef.current()}
            className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)] px-3 py-1.5 rounded border border-[var(--gold)]/40 bg-black/40 backdrop-blur-sm hover:bg-[var(--gold)]/10 transition-colors"
          >
            Reset Cloth
          </button>
        </div>
      </div>
      <div className="text-center text-xs text-white/40 mt-3 tracking-wider">
        🖱️ / 👆 drag any banner — tap reset to restore the hang
      </div>
    </section>
  );
}

