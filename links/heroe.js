/* heroe.js — mi día en 3D, hecho solo con código (Three.js).
   Me despierto → me siento en mi PC → saco clips → los subo → registro cobros y pagos. 24 s en bucle. */
const fmt = n => Math.round(n).toLocaleString("en-US");
const LIMA = "#c6f432", CORAL = "#ff5a4e", ORO = "#ffd166", AZUL = "#1877f2", TT = "#fe2c55";
const MONO = "JetBrains Mono, monospace", SANS = "Inter, sans-serif", TIT = "Space Grotesk, sans-serif";
const cl = v => Math.max(0, Math.min(1, v));
const seg = (t, a, b) => cl((t - a) / (b - a));
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const suave = t => t * t * (3 - 2 * t);
const salto = t => { const k = 1.70158; return 1 + (k + 1) * Math.pow(t - 1, 3) + k * Math.pow(t - 1, 2); };
const lerp = (a, b, k) => a + (b - a) * k;

const T = 24;
const ESCENAS = [
  { a: 0,   b: 4,   h: "07:00", txt: "Me despierto" },
  { a: 4,   b: 8.4, h: "07:12", txt: "Me siento en mi PC" },
  { a: 8.4, b: 13,  h: "08:30", txt: "Saco clips del vivo" },
  { a: 13,  b: 17,  h: "11:00", txt: "Los subo a mis redes" },
  { a: 17,  b: 24,  h: "23:00", txt: "Registro los cobros y los pagos" },
];
const caja = document.getElementById("escena");
const negro = caja.querySelector(".negro"), negroTxt = negro.querySelector("b");
const subEl = document.getElementById("subtitulo"), horaEl = document.getElementById("hora"), saldoEl = document.getElementById("saldo");
const barras = [...document.querySelectorAll(".capitulos i")];

/* ---------- el libro de cuentas del día ---------- */
let dia = 214, saldo = 1284600, saldoVisto = saldo, cuentas = [], neto = 0;
function nuevoDia() {
  const v = b => Math.round(b * (.85 + Math.random() * .3) / 5) * 5;
  cuentas = [
    { n: "Facebook · THZ CLIPS",        m:  v(3480) },
    { n: "Facebook · THZ Gaming CLIPS", m:  v(1920) },
    { n: "TikTok · Creator Rewards",    m:  v(860)  },
    { n: "Contenido de marca",          m:  v(2500) },
    { n: "Luz",                         m: -v(140)  },
    { n: "Internet",                    m: -v(65)   },
    { n: "Mantenimiento de la PC",      m: -v(120)  },
  ];
  neto = cuentas.reduce((s, x) => s + x.m, 0);
}
nuevoDia();

/* ============================================================
   LO QUE SE VE EN EL MONITOR (canvas 2D que se pega a la pantalla 3D)
   ============================================================ */
const VW = 640, VH = 400, SS = 1.6;
const pantalla = document.createElement("canvas"); pantalla.width = VW * SS; pantalla.height = VH * SS;
const c = pantalla.getContext("2d");
function rr(x, y, w, h, r) { c.beginPath(); if (c.roundRect) c.roundRect(x, y, Math.max(0, w), h, r); else c.rect(x, y, Math.max(0, w), h); }
function txt(s, x, y, tam, color, peso = 500, fam = SANS, alin = "left") {
  c.font = `${peso} ${tam}px ${fam}`; c.fillStyle = color; c.textAlign = alin; c.fillText(s, x, y); c.textAlign = "left";
}
const CHAT = [["mari_xo", "JAJAJA 😂"], ["elkevo", "clip eso!!"], ["dani.rd", "noooo 💀"], ["luchi", "CLIP CLIP CLIP"], ["joseph", "qué pasó?"], ["nay", "🔥🔥🔥"], ["bryan_g", "esto va viral"], ["yeimy", "jajaja la cara"], ["tito", "repítelo"], ["ana.p", "😭😭"]];
const COLORES = ["#7cc7ff", "#ffd166", "#c6f432", "#ff8fb1", "#b69cff", "#7af0c4"];
const modulo = (a, n) => ((a % n) + n) % n;
function marco() {
  c.fillStyle = "#050608"; c.fillRect(0, 0, VW, VH);
  rr(10, 10, VW - 20, VH - 20, 12); c.fillStyle = "#0e1116"; c.fill();
}
function editor(t) {
  const k = t - 8;
  c.save(); rr(30, 28, 370, 206, 10); c.clip();
  const g = c.createLinearGradient(30, 28, 400, 234); g.addColorStop(0, "#22304a"); g.addColorStop(1, "#3a2340"); c.fillStyle = g; c.fillRect(30, 28, 370, 206);
  for (let i = 0; i < 5; i++) { c.fillStyle = `hsla(${(i * 70 + t * 20) % 360} 60% 60% / .22)`; c.beginPath(); c.arc(80 + i * 70 + Math.sin(t * 1.3 + i) * 20, 120 + Math.cos(t + i * 2) * 30, 40 + i * 4, 0, Math.PI * 2); c.fill(); }
  for (const x of [170, 262]) { c.fillStyle = "rgba(0,0,0,.35)"; c.beginPath(); c.arc(x, 128 + Math.sin(t * 6 + x) * 2, 22, 0, Math.PI * 2); c.fill(); rr(x - 32, 152, 64, 90, 26); c.fill(); }
  c.restore();
  rr(42, 40, 70, 20, 5); c.fillStyle = CORAL; c.fill(); txt("● EN VIVO", 77, 54, 10, "#fff", 700, MONO, "center");
  txt(`👁 ${fmt(18000 + Math.max(0, k) * 950)}`, 388, 54, 11, "#fff", 600, MONO, "right");
  rr(412, 28, 198, 206, 10); c.fillStyle = "#12161d"; c.fill();
  txt("Chat", 424, 48, 12, "#eef0f3", 700); c.fillStyle = "#1d2026"; c.fillRect(412, 58, 198, 1);
  c.save(); rr(412, 60, 198, 172, 10); c.clip();
  const off = modulo(k * 22, 22), base = Math.floor(k);
  for (let i = 0; i < 9; i++) {
    const j = modulo(base + i, CHAT.length), [u, mtx] = CHAT[j], y = 222 - i * 22 + off;
    txt(u, 424, y, 11, COLORES[j % COLORES.length], 700); txt(mtx, 424 + c.measureText(u).width + 6, y, 11, "#d5d9e0", 500);
  }
  c.restore();
  rr(30, 246, 580, 68, 10); c.fillStyle = "#12161d"; c.fill();
  c.save(); rr(30, 246, 580, 68, 10); c.clip();
  const des = t * 70;
  for (let x = 30 - (des % 52); x < 620; x += 52) { const id = Math.floor((x + des) / 52); c.fillStyle = `hsl(${modulo(id * 47, 360)} 25% 24%)`; rr(x + 2, 280, 48, 26, 4); c.fill(); }
  c.fillStyle = "rgba(238,240,243,.3)"; for (let x = 32; x < 610; x += 5) { const v = Math.abs(Math.sin((x + des) * .05) * .6 + Math.sin((x + des) * .13) * .4) * 18 + 2; c.fillRect(x, 274 - v, 3, v); }
  c.restore();
  const CORTES = [8.7, 9.6, 10.5, 11.4];
  CORTES.forEach(tc => {
    if (t > tc && t < tc + .35) { c.strokeStyle = CORAL; c.lineWidth = 2; rr(280, 252, 80, 56, 6); c.stroke(); c.fillStyle = "rgba(255,90,78,.15)"; c.fill(); txt("✂", 280, 250, 16, CORAL, 700, SANS, "center"); txt("✂", 360, 250, 16, CORAL, 700, SANS, "center"); }
  });
  c.fillStyle = LIMA; c.fillRect(319, 250, 2, 60); c.beginPath(); c.moveTo(313, 246); c.lineTo(327, 246); c.lineTo(320, 254); c.fill();
  txt("CLIPS LISTOS", 32, 338, 10, "#8a909b", 600, MONO);
  CORTES.forEach((tc, i) => {
    const e = ease(seg(t, tc + .1, tc + .8)); if (e <= 0) return;
    const x = lerp(290, 128 + i * 120, e), y = lerp(266, 346, e), w = lerp(60, 110, e);
    rr(x, y, w, 34, 7); c.fillStyle = `hsl(${i * 70 + 10} 35% 22%)`; c.fill(); c.strokeStyle = e < 1 ? CORAL : "rgba(198,244,50,.5)"; c.lineWidth = 1.5; c.stroke();
    if (e > .9) { c.fillStyle = "#fff"; c.beginPath(); c.moveTo(x + 12, y + 11); c.lineTo(x + 22, y + 17); c.lineTo(x + 12, y + 23); c.fill(); txt(`clip_0${i + 1}`, x + 30, y + 15, 10, "#eef0f3", 700, MONO); txt("0:45", x + 30, y + 27, 9, "#8a909b", 500, MONO); }
  });
}
const REDES = [{ n: "THZ CLIPS", r: "Facebook · Reels", col: AZUL, l: "f" }, { n: "THZ Gaming CLIPS", r: "Facebook · Reels", col: AZUL, l: "f" }, { n: "TikTok", r: "Bandeja de borradores", col: TT, l: "♪" }];
function publicar(t) {
  rr(60, 34, 400, 300, 14); c.fillStyle = "#12161d"; c.fill(); c.strokeStyle = "#1d2026"; c.lineWidth = 1; c.stroke();
  txt("Publicando 4 clips", 82, 68, 17, "#eef0f3", 700, TIT);
  txt("con su título, texto y hashtags", 82, 88, 11, "#8a909b", 500);
  REDES.forEach((rd, i) => {
    const y = 116 + i * 70, p = ease(seg(t, 12.9 + i * .55, 14.4 + i * .55));
    c.fillStyle = rd.col; c.beginPath(); c.arc(100, y + 20, 18, 0, Math.PI * 2); c.fill();
    txt(rd.l, 100, y + 27, 20, "#fff", 700, SANS, "center");
    txt(rd.n, 130, y + 16, 14, "#eef0f3", 700); txt(rd.r, 130, y + 33, 11, "#8a909b", 500);
    rr(130, y + 44, 300, 6, 3); c.fillStyle = "#23262d"; c.fill();
    if (p > .02) { rr(130, y + 44, 300 * p, 6, 3); c.fillStyle = p >= 1 ? LIMA : rd.col; c.fill(); }
    txt(p >= 1 ? "✓ Listo" : `${Math.round(p * 100)} %`, 430, y + 18, 12, p >= 1 ? LIMA : "#8a909b", 700, MONO, "right");
  });
  const AVISOS = [[14.7, "🔔 +18.4K vistas", "THZ CLIPS"], [15.2, "💬 +960 comentarios", "THZ Gaming CLIPS"], [15.7, "👤 +2.1K seguidores", "hoy"]];
  AVISOS.forEach(([ta, a, b], i) => {
    const e = salto(seg(t, ta, ta + .45)); if (e <= 0) return;
    const x = lerp(VW + 10, 472, e), y = 40 + i * 62;
    rr(x, y, 150, 50, 10); c.fillStyle = "#1a1f28"; c.fill(); c.strokeStyle = "rgba(198,244,50,.35)"; c.stroke();
    txt(a, x + 12, y + 22, 12, "#eef0f3", 700); txt(b, x + 12, y + 39, 10, "#8a909b", 500);
  });
}
function libro(t) {
  rr(36, 28, 568, 344, 14); c.fillStyle = "#0b0d11"; c.fill(); c.strokeStyle = "#1d2026"; c.lineWidth = 1; c.stroke();
  txt("Cobros y pagos", 60, 64, 20, "#eef0f3", 700, TIT);
  txt(`DÍA ${dia}`, 580, 62, 11, LIMA, 700, MONO, "right");
  c.fillStyle = "#1d2026"; c.fillRect(60, 80, 520, 1);
  cuentas.forEach((x, i) => {
    const e = ease(seg(t, 16.7 + i * .38, 17.1 + i * .38)); if (e <= 0) return;
    const y = 108 + i * 30, pos = x.m > 0;
    c.globalAlpha = e;
    c.fillStyle = pos ? "rgba(198,244,50,.12)" : "rgba(255,90,78,.12)"; c.beginPath(); c.arc(70 + (1 - e) * 20, y - 4, 9, 0, Math.PI * 2); c.fill();
    txt(pos ? "↓" : "↑", 70 + (1 - e) * 20, y, 12, pos ? LIMA : CORAL, 700, SANS, "center");
    txt(x.n, 88 + (1 - e) * 20, y, 13, "#d5d9e0", 500);
    txt(pos ? "COBRO" : "PAGO", 410, y, 9, "#5b616b", 700, MONO);
    txt(`${pos ? "+" : "−"}$${fmt(Math.abs(x.m))}`, 580, y, 14, pos ? LIMA : CORAL, 700, MONO, "right");
    c.globalAlpha = 1;
  });
  const en = ease(seg(t, 19.6, 20)); if (en <= 0) return;
  c.globalAlpha = en;
  c.fillStyle = "#1d2026"; c.fillRect(60, 322, 520, 1);
  txt("Neto del día", 60, 350, 14, "#8a909b", 600);
  txt(`+$${fmt(neto)}`, 330, 350, 16, LIMA, 700, MONO, "right");
  txt("Saldo", 400, 350, 14, "#8a909b", 600);
  txt(`$${fmt(saldoVisto)}`, 580, 350, 16, ORO, 700, MONO, "right");
  c.globalAlpha = 1;
}
/* qué muestra el monitor en cada segundo del día */
function dibujarPantalla(t) {
  c.setTransform(SS, 0, 0, SS, 0, 0);
  if (t < 6.2) { c.fillStyle = "#010102"; c.fillRect(0, 0, VW, VH); return; }
  marco();
  const aPub = seg(t, 12.8, 13.2), aLib = seg(t, 18.2, 18.7);
  if (aPub < 1) { c.globalAlpha = 1 - aPub; editor(t - .4); }
  if (aPub > 0 && aLib < 1) { c.globalAlpha = aPub * (1 - aLib); publicar(t - .6); }
  if (aLib > 0) { c.globalAlpha = aLib; marco(); libro(t - 2.7); }
  c.globalAlpha = 1;
  const enc = seg(t, 6.2, 6.8); if (enc < 1) { c.fillStyle = `rgba(1,1,2,${1 - enc})`; c.fillRect(0, 0, VW, VH); }
}
/* segundo monitor (vertical): el chat del vivo */
const vert = document.createElement("canvas"); vert.width = 220; vert.height = 390; const vc = vert.getContext("2d");
function dibujarVertical(t) {
  vc.fillStyle = t < 6.2 ? "#010102" : "#0c0f14"; vc.fillRect(0, 0, 220, 390); if (t < 6.2) return;
  const k = t * 1.3, base = Math.floor(k), off = (k % 1) * 28;
  for (let i = 0; i < 14; i++) {
    const j = modulo(base + i, CHAT.length), y = 372 - i * 28 + off;
    vc.font = `700 14px ${SANS}`; vc.fillStyle = COLORES[j % COLORES.length]; vc.fillText(CHAT[j][0], 14, y);
    const w = vc.measureText(CHAT[j][0]).width; vc.font = `500 14px ${SANS}`; vc.fillStyle = "#d5d9e0"; vc.fillText(CHAT[j][1], 20 + w, y);
  }
  const g = vc.createLinearGradient(0, 0, 0, 120); g.addColorStop(0, "#0c0f14"); g.addColorStop(1, "rgba(12,15,20,0)"); vc.fillStyle = g; vc.fillRect(0, 0, 220, 120);
  vc.fillStyle = CORAL; vc.beginPath(); vc.roundRect ? vc.roundRect(14, 14, 92, 26, 6) : vc.rect(14, 14, 92, 26); vc.fill();
  vc.font = `700 13px ${MONO}`; vc.fillStyle = "#fff"; vc.fillText("● EN VIVO", 22, 32);
  vc.fillStyle = "#eef0f3"; vc.fillText(`👁 ${fmt(18000 + Math.max(0, t - 8) * 950)}`, 116, 32);
}

/* ============================================================
   HUD: subtítulos, capítulos, hora y saldo
   ============================================================ */
let capVisto = -1;
function hora(t) {
  const e = ESCENAS.find(s => t >= s.a && t < s.b) || ESCENAS[4];
  const [h, m] = e.h.split(":").map(Number), tot = h * 60 + m + Math.floor((t - e.a) * 8);
  return `${String(Math.floor(tot / 60) % 24).padStart(2, "0")}:${String(tot % 60).padStart(2, "0")}`;
}
function hud(t) {
  const ci = ESCENAS.findIndex(s => t >= s.a && t < s.b);
  if (ci !== capVisto && ci >= 0) { capVisto = ci; subEl.style.opacity = 0; setTimeout(() => { subEl.innerHTML = `<b>${ESCENAS[ci].h}</b>${ESCENAS[ci].txt}`; subEl.style.opacity = 1; }, 150); }
  barras.forEach((b, i) => { const s = ESCENAS[i]; b.style.width = (seg(t, s.a, s.b) * 100) + "%"; });
  horaEl.textContent = hora(t);
  saldoEl.textContent = fmt(saldoVisto);
  const n = Math.max(1 - seg(t, 0, .6), seg(t, 23.3, 24));
  negro.style.opacity = n;
  negroTxt.textContent = `DÍA ${dia + 1}`;
  negroTxt.style.opacity = t > 23.3 ? seg(t, 23.4, 23.8) : 0;
}

/* ============================================================
   RELOJ: atado al reloj real, así nunca se queda pegado aunque el equipo sea lento
   ============================================================ */
const fijo = new URLSearchParams(location.search).get("t");   // ?t=12 congela el video en ese segundo
const congelado = fijo !== null;
let reloj = fijo !== null ? +fijo : 0, antes = performance.now(), visible = true, dtF = 0;
new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { threshold: 0 }).observe(caja);
let pintar = () => {}, listo = false, modo = null;
function cuadro(ahora) {
  requestAnimationFrame(cuadro);
  const dt = Math.min(1, Math.max(0, (ahora - antes) / 1000)); antes = ahora;
  if (!visible || document.hidden || !listo) return;
  dtF = dt;
  const previo = reloj % T;
  if (!congelado) reloj += dt;
  const t = reloj % T;
  if (t < previo) { dia++; saldo += neto; nuevoDia(); }           // empieza otro día
  saldoVisto = t > 22.4 ? saldo + neto * ease(seg(t, 22.4, 23.2)) : saldo;
  hud(t);
  pintar(t);
}

/* si el navegador no tiene WebGL: se muestra solo la pantalla */
function modo2D() {
  if (modo === "2d") return;
  modo = "2d";
  caja.querySelectorAll("canvas").forEach(x => x.remove());
  caja.prepend(pantalla);
  pintar = t => dibujarPantalla(Math.max(t, 6.8));
  listo = true;
}

/* ============================================================
   EL MUNDO 3D
   ============================================================ */
async function iniciar3D() {
  const [THREE, { RoundedBoxGeometry }, { RoomEnvironment }, { EffectComposer }, { RenderPass }, { UnrealBloomPass }, { OutputPass }, { GTAOPass }, { ShaderPass }, { RectAreaLightUniformsLib }] = await Promise.all([
    import("three"),
    import("three/addons/geometries/RoundedBoxGeometry.js"),
    import("three/addons/environments/RoomEnvironment.js"),
    import("three/addons/postprocessing/EffectComposer.js"),
    import("three/addons/postprocessing/RenderPass.js"),
    import("three/addons/postprocessing/UnrealBloomPass.js"),
    import("three/addons/postprocessing/OutputPass.js"),
    import("three/addons/postprocessing/GTAOPass.js"),
    import("three/addons/postprocessing/ShaderPass.js"),
    import("three/addons/lights/RectAreaLightUniformsLib.js"),
  ]);
  RectAreaLightUniformsLib.init();
  await Promise.race([document.fonts ? document.fonts.ready : null, new Promise(r => setTimeout(r, 1500))]);

  const movil = matchMedia("(max-width: 900px)").matches;
  let pr = Math.min(devicePixelRatio || 1, movil ? 1.25 : 2);
  const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(pr);
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1;
  renderer.domElement.addEventListener("webglcontextlost", e => { e.preventDefault(); console.warn("Se perdió el contexto WebGL; se muestra en 2D"); modo2D(); });

  const escena = new THREE.Scene();
  escena.background = new THREE.Color("#06070a");
  const pm = new THREE.PMREMGenerator(renderer);
  escena.environment = pm.fromScene(new RoomEnvironment(renderer), .04).texture;
  const cam = new THREE.PerspectiveCamera(40, 1.6, .05, 40);

  const rt = new THREE.WebGLRenderTarget(2, 2, { type: THREE.HalfFloatType, samples: movil ? 0 : 4 });
  const composer = new EffectComposer(renderer, rt);
  composer.setPixelRatio(pr);
  composer.addPass(new RenderPass(escena, cam));
  // sombras de contacto (oclusión ambiental), solo en compu
  const gtao = new GTAOPass(escena, cam, 256, 256);
  gtao.updateGtaoMaterial({ radius: .32, distanceExponent: 1.4, thickness: 1.2, scale: 1.1, samples: 16 });
  gtao.blendIntensity = .9; gtao.enabled = !movil;
  gtao.overrideVisibility = function () {   // lo transparente y los sprites no hacen sombra
    const c = this._visibilityCache;
    this.scene.traverse(o => { c.set(o, o.visible); if (o.isPoints || o.isLine || o.isSprite || (o.material && o.material.transparent)) o.visible = false; });
  };
  gtao.output = GTAOPass.OUTPUT.Diffuse;   // la mezcla propia de GTAO a veces deja la imagen en negro: se mezcla aparte
  composer.addPass(gtao);
  const sombraAO = new ShaderPass({
    uniforms: { tDiffuse: { value: null }, tAO: { value: null }, k: { value: .9 } },
    vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",
    fragmentShader: "uniform sampler2D tDiffuse, tAO; uniform float k; varying vec2 vUv; void main(){ vec4 c = texture2D(tDiffuse, vUv); float a = clamp(texture2D(tAO, vUv).r, 0., 1.); gl_FragColor = vec4(c.rgb * mix(1., a, k), 1.); }",
  });
  sombraAO.uniforms.tAO.value = gtao.pdRenderTarget.texture;   // ShaderPass clona los uniforms y deja en null las texturas de render
  sombraAO.enabled = gtao.enabled;
  composer.addPass(sombraAO);
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), .6, .5, 1.5);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  // acabado de cine: viñeta, grano fino y un leve tono cálido en las luces
  const cine = new ShaderPass({
    uniforms: { tDiffuse: { value: null }, uT: { value: 0 } },
    vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",
    fragmentShader: `uniform sampler2D tDiffuse; uniform float uT; varying vec2 vUv;
      float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      void main(){
        vec4 c = texture2D(tDiffuse, vUv);
        vec2 d = vUv - .5; float v = smoothstep(.85, .2, length(d * vec2(1.15, 1.)));
        c.rgb *= mix(.72, 1., v);
        float l = dot(c.rgb, vec3(.299, .587, .114));
        c.rgb = mix(c.rgb, c.rgb * vec3(1.03, 1., .95), smoothstep(.4, 1., l));
        c.rgb += (h(vUv * 913. + uT) - .5) * .022;
        gl_FragColor = c;
      }`,
  });
  composer.addPass(cine);
  function medir() {
    const w = Math.max(2, caja.clientWidth), h = Math.max(2, caja.clientHeight);
    renderer.setSize(w, h, false); composer.setSize(w, h);
    cam.aspect = w / h; cam.updateProjectionMatrix();
  }
  new ResizeObserver(medir).observe(caja); medir();

  /* utilidades */
  const M = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: o.r ?? .75, metalness: o.m ?? 0, envMapIntensity: o.env ?? .4, ...(o.x || {}) });
  const RB = (w, h, d, r = .02, s = 3) => new RoundedBoxGeometry(w, h, d, s, Math.min(r, w / 2 - 1e-3, h / 2 - 1e-3, d / 2 - 1e-3));
  function pon(geo, mat, x = 0, y = 0, z = 0, padre = escena, sombra = true) { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = sombra; m.receiveShadow = true; padre.add(m); return m; }
  const grupo = (x = 0, y = 0, z = 0, padre = escena) => { const g = new THREE.Group(); g.position.set(x, y, z); padre.add(g); return g; };
  const brilla = (color, i = 3) => new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(i) });
  const textura = cv => { const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
  const lienzo = (w, h, f) => { const cv = document.createElement("canvas"); cv.width = w; cv.height = h; f(cv.getContext("2d"), w, h); return cv; };
  const sprite = (cv, w, h) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: textura(cv), transparent: true, depthWrite: false })); s.scale.set(w, h, 1); escena.add(s); return s; };
  // ruido suave que se repite sin costuras (para relieves de tela, yeso, pelo)
  function ruido(gx, gy = gx) {
    const v = Array.from({ length: gx * gy }, Math.random), at = (i, j) => v[((j % gy + gy) % gy) * gx + ((i % gx + gx) % gx)];
    return (u, w) => { const x = u * gx, y = w * gy, i = Math.floor(x), j = Math.floor(y), fx = x - i, fy = y - j, sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
      return lerp(lerp(at(i, j), at(i + 1, j), sx), lerp(at(i, j + 1), at(i + 1, j + 1), sx), sy); };
  }
  // mapa de relieve (normal map) a partir de una altura h(u,v) en [0,1]
  function relieveDe(alt, N, fuerza, rx = 1, ry = rx) {
    const cv = document.createElement("canvas"); cv.width = cv.height = N; const g = cv.getContext("2d"), img = g.createImageData(N, N);
    const k = i => (i + N) % N;
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const dx = (alt[y * N + k(x + 1)] - alt[y * N + k(x - 1)]) * fuerza, dy = (alt[k(y + 1) * N + x] - alt[k(y - 1) * N + x]) * fuerza;
      const l = Math.hypot(dx, dy, 1), o = (y * N + x) * 4;
      img.data[o] = (-dx / l * .5 + .5) * 255; img.data[o + 1] = (dy / l * .5 + .5) * 255; img.data[o + 2] = (1 / l * .5 + .5) * 255; img.data[o + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    const t = new THREE.CanvasTexture(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry); t.anisotropy = 8; return t;
  }
  function relieve(N, f, fuerza, rx, ry) { const a = new Float32Array(N * N); for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) a[y * N + x] = f(x / N, y / N); return relieveDe(a, N, fuerza, rx, ry); }
  function relieveLienzo(cv, fuerza, rx, ry) {   // usa el brillo de un dibujo como altura
    const N = cv.width, d = cv.getContext("2d").getImageData(0, 0, N, N).data, a = new Float32Array(N * N);
    for (let i = 0; i < N * N; i++) a[i] = (d[i * 4] * .3 + d[i * 4 + 1] * .59 + d[i * 4 + 2] * .11) / 255;
    return relieveDe(a, N, fuerza, rx, ry);
  }
  const rF = ruido(48), rG = ruido(12), rH = ruido(96, 6), rP = ruido(24), rP2 = ruido(90);
  const nPolar = relieve(128, (u, v) => rF(u, v) * .7 + rG(u, v) * .3, 3, 6, 6);                       // felpa del buzo
  const nDenim = relieve(128, (u, v) => .5 + .35 * Math.sin((u * 2 + v) * Math.PI * 2 * 16) + .3 * rF(u, v), 2.2, 3, 4);
  const nPelo = relieve(128, (u, v) => rH(u, v), 5, 2, 2);
  const nYeso = relieve(256, (u, v) => rP(u, v) * .6 + rP2(u, v) * .4, 1.6, 5, 3);
  const nLino = relieve(128, (u, v) => .5 + .2 * Math.sin(u * Math.PI * 2 * 32) + .2 * Math.sin(v * Math.PI * 2 * 32) + .3 * rF(u, v), 1.6, 3, 6);
  const nAcolchado = relieve(256, (u, v) => {
    const p = ((u + v) * 3) % 1, q = ((u - v + 2) * 3) % 1;
    return Math.pow(Math.sin(Math.PI * p) * Math.sin(Math.PI * q), .45) * .9 + rF(u, v) * .1;
  }, 5, 2.2, 2.2);
  // telas: aterciopeladas en los bordes (sheen), como la ropa de verdad
  const Tela = (color, o = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: o.r ?? .92, metalness: 0, envMapIntensity: o.env ?? .35,
    sheen: o.sheen ?? 1, sheenRoughness: o.sr ?? .55, sheenColor: new THREE.Color(o.sc ?? color).lerp(new THREE.Color("#ffffff"), .35),
    normalMap: o.n ?? nPolar, normalScale: new THREE.Vector2(o.ns ?? .6, o.ns ?? .6), ...(o.x || {}) });

  /* ---------- luces ---------- */
  const hemi = new THREE.HemisphereLight("#a9b8ff", "#2a1d14", .5); escena.add(hemi);
  const sol = new THREE.DirectionalLight("#fff", 3); sol.castShadow = true;
  sol.shadow.mapSize.set(movil ? 1024 : 2048, movil ? 1024 : 2048);
  Object.assign(sol.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5, near: .5, far: 25 });
  sol.shadow.bias = -.0004; sol.shadow.normalBias = .02;
  sol.target.position.set(.2, 0, .3); escena.add(sol, sol.target);
  const relleno = new THREE.DirectionalLight("#c4ccff", .3); relleno.position.set(2, 3, 6); escena.add(relleno);
  // la pantalla alumbra como un panel (luz de área del mismo tamaño que el monitor)
  const lMon = new THREE.RectAreaLight("#a9c2ff", 0, 1.1, .68); lMon.position.set(1.75, 1.27, -1.99); lMon.lookAt(1.75, 1.2, 0); escena.add(lMon);
  const lMonV = new THREE.RectAreaLight("#c7b8ff", 0, .36, .64); lMonV.position.set(2.6, 1.24, -1.93); lMonV.lookAt(2.6 - Math.sin(.5) * 3, 1.2, -1.93 + Math.cos(.5) * 3); escena.add(lMonV);
  const lLed = new THREE.PointLight(LIMA, 0, 4, 2); lLed.position.set(1.7, 1.9, -2.05); escena.add(lLed);
  const lPc = new THREE.PointLight(CORAL, 0, 2.2, 2); lPc.position.set(.85, 1.05, -1.7); escena.add(lPc);
  const lLamp = new THREE.PointLight("#ffb46b", 0, 4.5, 2); lLamp.position.set(-1.3, .86, -2.05); escena.add(lLamp);

  /* ---------- el cuarto ---------- */
  const maderaCv = lienzo(1024, 1024, (g, W) => {
    const ancho = 128;
    for (let x = 0; x < W; x += ancho) {
      let y = -Math.random() * 400;
      while (y < W) {
        const largo = 300 + Math.random() * 420;
        g.fillStyle = `hsl(${22 + Math.random() * 8} ${30 + Math.random() * 12}% ${15 + Math.random() * 7}%)`; g.fillRect(x, y, ancho, largo);
        for (let k = 0; k < 22; k++) { g.strokeStyle = `rgba(0,0,0,${Math.random() * .14})`; g.lineWidth = 1 + Math.random() * 2; const gx = x + Math.random() * ancho; g.beginPath(); g.moveTo(gx, y); g.bezierCurveTo(gx + (Math.random() - .5) * 14, y + largo * .3, gx + (Math.random() - .5) * 14, y + largo * .7, gx + (Math.random() - .5) * 6, y + largo); g.stroke(); }
        g.fillStyle = "rgba(0,0,0,.55)"; g.fillRect(x, y, ancho, 3);
        y += largo;
      }
      g.fillStyle = "rgba(0,0,0,.65)"; g.fillRect(x, 0, 3, W);
    }
  });
  const madera = textura(maderaCv);
  madera.wrapS = madera.wrapT = THREE.RepeatWrapping; madera.repeat.set(6, 4.7);
  // relieve de las tablas (juntas hundidas y veta) y brillo que varía como barniz gastado
  const maderaN = relieveLienzo(maderaCv, 6, 6, 4.7);
  const rB = ruido(16), maderaR = textura(lienzo(256, 256, (g) => { const im = g.createImageData(256, 256); for (let i = 0; i < 65536; i++) { const v = 120 + rB((i % 256) / 256, Math.floor(i / 256) / 256) * 110; im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; } g.putImageData(im, 0, 0); }));
  maderaR.colorSpace = THREE.NoColorSpace; maderaR.wrapS = maderaR.wrapT = THREE.RepeatWrapping; maderaR.repeat.set(2, 2);
  const piso = pon(new THREE.PlaneGeometry(9, 7), M("#fff", { r: .62, env: .6, x: { map: madera, normalMap: maderaN, normalScale: new THREE.Vector2(.8, .8), roughnessMap: maderaR } }), .2, 0, .9, escena, false); piso.rotation.x = -Math.PI / 2;
  const pared = M("#1c1f27", { r: .95, env: .25, x: { normalMap: nYeso, normalScale: new THREE.Vector2(.35, .35) } });
  const ZP = -2.3, VX0 = -1.25, VX1 = .05, VY0 = 1.0, VY1 = 2.1, PX0 = -3.6, PX1 = 3.4, ALTO = 2.9;
  const trozo = (x0, x1, y0, y1) => pon(new THREE.BoxGeometry(x1 - x0, y1 - y0, .12), pared, (x0 + x1) / 2, (y0 + y1) / 2, ZP - .06);
  trozo(PX0, VX0, 0, ALTO); trozo(VX1, PX1, 0, ALTO); trozo(VX0, VX1, 0, VY0); trozo(VX0, VX1, VY1, ALTO);
  pon(new THREE.BoxGeometry(.12, ALTO, 5.4), pared, PX0 - .06, ALTO / 2, .4);
  pon(new THREE.BoxGeometry(.12, ALTO, 5.4), pared, PX1 + .06, ALTO / 2, .4);
  pon(new THREE.BoxGeometry(7.3, .12, 5.6), pared, -.1, ALTO + .06, .4);
  pon(new THREE.BoxGeometry(7, .07, .02), M("#111318", { r: .6 }), -.1, .035, ZP + .01, escena, false);
  // ventana
  const marcoV = M("#2b2f38", { r: .35, m: .6 }), VXc = (VX0 + VX1) / 2;
  pon(RB(VX1 - VX0 + .16, .045, .22, .01), marcoV, VXc, VY0 - .02, ZP + .05);
  pon(new THREE.BoxGeometry(VX1 - VX0 + .08, .05, .1), marcoV, VXc, VY1, ZP);
  for (const x of [VX0, VX1]) pon(new THREE.BoxGeometry(.05, VY1 - VY0, .1), marcoV, x, (VY0 + VY1) / 2, ZP);
  pon(new THREE.BoxGeometry(.025, VY1 - VY0, .05), marcoV, VXc, (VY0 + VY1) / 2, ZP - .02);
  pon(new THREE.BoxGeometry(VX1 - VX0, .025, .05), marcoV, VXc, (VY0 + VY1) / 2 + .1, ZP - .02);
  // cortinas recogidas a los lados, con pliegues de verdad
  const barra = pon(new THREE.CylinderGeometry(.012, .012, 1.95, 12), M("#b9b2a6", { r: .3, m: .85 }), VXc + .03, 2.22, ZP + .09); barra.rotation.z = Math.PI / 2;
  const cortinaM = Tela("#4a3f5c", { n: nLino, ns: .5, r: .95, x: { side: THREE.DoubleSide } });
  function cortina(xc, ancho, pl) {
    const geo = new THREE.PlaneGeometry(ancho, 1.3, 48, 24), pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), abajo = (.65 - y) / 1.3;
      pos.setZ(i, Math.sin((x / ancho + .5) * Math.PI * pl) * (.028 + abajo * .012) + Math.sin(x * 61 + y * 3) * .003);
      pos.setX(i, x * (1 - abajo * .18));   // se cierran un poco hacia abajo, como recogidas
    }
    geo.computeVertexNormals();
    const c = pon(geo, cortinaM, xc, 2.22 - .65, ZP + .075); c.castShadow = true; return c;
  }
  cortina(VX0 - .13, .32, 7); cortina(VX1 + .06, .2, 5);
  // cielo con ciudad (cambia con la hora)
  const cieloCv = document.createElement("canvas"); cieloCv.width = 256; cieloCv.height = 256; const kc = cieloCv.getContext("2d");
  const edificios = Array.from({ length: 16 }, (_, i) => ({ x: i * 17 - 8 + Math.random() * 6, w: 14 + Math.random() * 14, h: 40 + Math.random() * 90, v: Array.from({ length: 40 }, () => Math.random()) }));
  const estrellas = Array.from({ length: 40 }, () => [Math.random() * 256, Math.random() * 150, Math.random()]);
  function dibujarCielo(l, prog) {
    const mez = (a, b, k) => a.map((v, i) => Math.round(lerp(v, b[i], k)));
    const N = [[6, 9, 26], [20, 24, 58]], A = [[96, 120, 200], [255, 158, 96]], D = [[70, 150, 255], [196, 228, 255]];
    const [top, bot] = l < .5 ? [mez(N[0], A[0], l / .5), mez(N[1], A[1], l / .5)] : [mez(A[0], D[0], (l - .5) / .5), mez(A[1], D[1], (l - .5) / .5)];
    const g = kc.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, `rgb(${top})`); g.addColorStop(1, `rgb(${bot})`);
    kc.fillStyle = g; kc.fillRect(0, 0, 256, 256);
    if (l < .35) for (const [x, y, b] of estrellas) { kc.fillStyle = `rgba(255,255,255,${(1 - l / .35) * (.4 + b * .6)})`; kc.fillRect(x, y, 1.5, 1.5); }
    const ang = prog * Math.PI, sx = 128 - Math.cos(ang) * 95, sy = 200 - Math.sin(ang) * 150;
    if (l > .15) { const a = cl((l - .15) / .3); const rg = kc.createRadialGradient(sx, sy, 4, sx, sy, 60); rg.addColorStop(0, `rgba(255,236,190,${a})`); rg.addColorStop(.25, `rgba(255,200,120,${.5 * a})`); rg.addColorStop(1, "rgba(255,200,120,0)"); kc.fillStyle = rg; kc.fillRect(0, 0, 256, 256); kc.fillStyle = `rgba(255,246,220,${a})`; kc.beginPath(); kc.arc(sx, sy, 13, 0, 7); kc.fill(); }
    if (l < .3) { const a = 1 - l / .3; kc.fillStyle = `rgba(230,236,255,${a})`; kc.beginPath(); kc.arc(196, 52, 11, 0, 7); kc.fill(); kc.fillStyle = `rgb(${top})`; kc.beginPath(); kc.arc(202, 48, 10, 0, 7); kc.fill(); }
    const ed = mez([9, 11, 18], [58, 70, 94], l);
    for (const b of edificios) {
      kc.fillStyle = `rgb(${ed})`; kc.fillRect(b.x, 256 - b.h, b.w, b.h);
      if (l < .65) { let n = 0; for (let y = 256 - b.h + 6; y < 250; y += 9) for (let x = b.x + 3; x < b.x + b.w - 3; x += 6) { if (b.v[n++ % 40] > .55) { kc.fillStyle = `rgba(255,205,120,${(1 - l / .65) * .9})`; kc.fillRect(x, y, 2.5, 4); } } }
    }
  }
  const cieloTex = textura(cieloCv);
  const cieloMat = new THREE.MeshBasicMaterial({ map: cieloTex, fog: false });
  pon(new THREE.PlaneGeometry(3.4, 2.6), cieloMat, VXc, 1.55, ZP - .75, escena, false).castShadow = false;
  let cieloVisto = [-1, -1];

  // posters
  const poster = (x, dibujo) => {
    pon(RB(.6, .8, .03, .008), M("#0b0c0f", { r: .4 }), x, 1.72, ZP + .02);
    pon(new THREE.PlaneGeometry(.54, .74), M("#fff", { r: .6, x: { map: textura(lienzo(256, 352, dibujo)) } }), x, 1.72, ZP + .037, escena, false);
  };
  poster(-3.0, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#ff5a4e"); gr.addColorStop(1, "#2a0f45"); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = "rgba(255,209,102,.95)"; g.beginPath(); g.arc(128, 150, 70, 0, 7); g.fill();
    for (let i = 0; i < 7; i++) { g.fillStyle = "rgba(10,11,13,.85)"; g.fillRect(0, 186 + i * 13, w, 4 + i); }
    g.fillStyle = "#fff"; g.font = `700 36px ${TIT}`; g.textAlign = "center"; g.fillText("CLIP IT", 128, 322);
  });
  poster(-2.15, (g, w, h) => {
    g.fillStyle = "#0d0f12"; g.fillRect(0, 0, w, h); g.strokeStyle = LIMA; g.lineWidth = 6;
    for (let i = 0; i < 9; i++) { g.globalAlpha = 1 - i * .1; g.beginPath(); g.arc(128, 160, 18 + i * 14, 0, 7); g.stroke(); }
    g.globalAlpha = 1; g.fillStyle = LIMA; g.font = `700 50px ${TIT}`; g.textAlign = "center"; g.fillText("THZ", 128, 320);
  });

  /* ---------- la cama ---------- */
  const BX = -2.5;
  pon(RB(1.52, .3, 2.1, .04), M("#3a2e28", { r: .55, env: .5 }), BX, .19, -1.22);
  pon(RB(1.62, .95, .12, .05), M("#3a3346", { r: .95 }), BX, .72, -2.21);
  for (let i = -2; i <= 2; i++) pon(new THREE.BoxGeometry(.012, .78, .02), M("#2e2938", { r: .95 }), BX + i * .3, .74, -2.145, escena, false);
  pon(RB(1.42, .2, 1.96, .07, 4), M("#e9e6ef", { r: .9 }), BX, .44, -1.2);
  // almohada mullida: una esfera llevada hacia un cubo, con las esquinas pellizcadas
  {
    const geo = new THREE.SphereGeometry(1, 48, 24), pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i), sx = Math.sign(x) * Math.pow(Math.abs(x), .45), sz = Math.sign(z) * Math.pow(Math.abs(z), .45);
      const borde = Math.max(Math.abs(sx), Math.abs(sz));
      pos.setXYZ(i, sx * .31, y * .075 * (1 - .55 * Math.pow(borde, 6)) + Math.sin(sx * 9) * Math.sin(sz * 7) * .006, sz * .18);
    }
    geo.computeVertexNormals();
    const alm = pon(geo, Tela("#f1eff4", { n: nLino, ns: .35, sc: "#ffffff" }), BX - .02, .6, -1.97); alm.rotation.set(-.12, .06, 0);
  }
  // la cobija: una tela que cae sobre el colchón y sobre mí (acolchada)
  const manta = grupo(BX, .62, -.85);
  {
    const g = (x, s) => Math.exp(-(x / s) * (x / s)), ss = (a, b, x) => { const k = cl((x - a) / (b - a)); return k * k * (3 - 2 * k); };
    const alto = (x, z) => {   // altura de la cobija encima del colchón (coordenadas de la cobija)
      const pecho = .25 * Math.exp(-Math.pow(Math.abs(x) / .37, 4));
      const piernas = Math.max(g(x - .085, .13), g(x + .085, .13)) * Math.max(lerp(.2, .15, ss(-.3, .2, z)), .2 * g(z - .4, .1)) * (1 - ss(.48, .6, z));
      const w = ss(-.25, -.42, z);
      return -.06 + lerp(piernas, pecho, w) + Math.sin(x * 23 + z * 6) * .008 + Math.sin(z * 17 - x * 5) * .006;
    };
    const HX = .71, HZ = .63, r = .05, cuarto = Math.PI * r / 2;
    const caer = (u, lim) => {   // pasado el borde del colchón la tela se dobla y cuelga
      const o = Math.abs(u) - lim; if (o <= 0) return [u, 0];
      if (o < cuarto) { const a = o / r; return [Math.sign(u) * (lim + r * Math.sin(a)), -r * (1 - Math.cos(a))]; }
      return [Math.sign(u) * (lim + r + (o - cuarto) * .12), -r - (o - cuarto)];
    };
    const tela = (z0, z1, sube, mat, nz) => {
      const geo = new THREE.PlaneGeometry(1.72, z1 - z0, 96, nz), pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i), w = (z0 + z1) / 2 - pos.getY(i);
        const [x, dx] = caer(u, HX), [z, dz] = caer(w, HZ);
        const xs = Math.sign(u) * Math.min(Math.abs(u), HX), zs = Math.min(w, HZ);
        pos.setXYZ(i, x, alto(xs, zs) + sube + dx + dz, z);
      }
      geo.computeVertexNormals();
      return pon(geo, mat, 0, 0, 0, manta);
    };
    tela(-.675, .8, 0, Tela("#2f3a6b", { n: nAcolchado, ns: .9, sc: "#7d8bd6", x: { side: THREE.DoubleSide } }), 80);
    tela(-.69, -.54, .014, Tela("#e9e7ee", { n: nLino, ns: .3, sc: "#ffffff", x: { side: THREE.DoubleSide } }), 10);   // el borde de la sábana doblado
  }
  // mesa de noche, despertador y lámpara
  pon(RB(.5, .52, .44, .025), M("#2a2d35", { r: .6 }), -1.45, .26, -2.02);
  pon(new THREE.BoxGeometry(.42, .012, .01), M("#15171c"), -1.45, .3, -1.795, escena, false);
  const reloj3d = grupo(-1.58, .57, -1.93); reloj3d.rotation.y = .4;
  pon(RB(.2, .1, .08, .025), M("#0c0d10", { r: .35 }), 0, 0, 0, reloj3d);
  const alarmaCv = document.createElement("canvas"); alarmaCv.width = 128; alarmaCv.height = 52; const ac = alarmaCv.getContext("2d");
  const alarmaTex = textura(alarmaCv); let alarmaVista = "";
  const dibujarAlarma = (s, on) => { ac.fillStyle = "#000"; ac.fillRect(0, 0, 128, 52); ac.font = `700 38px ${MONO}`; ac.textAlign = "center"; ac.fillStyle = on ? CORAL : "#ff8a7a"; ac.fillText(s, 64, 40); alarmaTex.needsUpdate = true; };
  pon(new THREE.PlaneGeometry(.17, .07), new THREE.MeshBasicMaterial({ map: alarmaTex, color: new THREE.Color(2.2, 2.2, 2.2) }), 0, 0, .041, reloj3d, false);
  pon(new THREE.CylinderGeometry(.06, .07, .02, 24), M("#c8c2b8", { r: .3, m: .8 }), -1.3, .53, -2.12);
  pon(new THREE.CylinderGeometry(.008, .008, .26, 8), M("#c8c2b8", { r: .3, m: .8 }), -1.3, .66, -2.12);
  const pantallaLamp = M("#efe6d6", { r: .9, x: { side: THREE.DoubleSide, emissive: new THREE.Color("#ffb46b"), emissiveIntensity: 0 } });
  pon(new THREE.CylinderGeometry(.075, .11, .15, 28, 1, true), pantallaLamp, -1.3, .84, -2.12, escena, false);

  /* ---------- planta junto a la ventana ---------- */
  pon(new THREE.CylinderGeometry(.15, .12, .34, 28), M("#d9d4cc", { r: .35 }), .3, .17, -2.0);
  pon(new THREE.CylinderGeometry(.14, .14, .01, 24), M("#2a1e16"), .3, .335, -2.0, escena, false);
  const hojaM = M("#3f8f52", { r: .55, env: .3 }), hojaGeo = new THREE.SphereGeometry(.07, 14, 10);
  for (let i = 0; i < 11; i++) {
    const piv = grupo(.3, .34, -2.0); piv.rotation.set(0, i * 2.4, 0);
    const brazo = grupo(0, 0, 0, piv); brazo.rotation.x = .35 + (i % 3) * .25;
    const h = pon(hojaGeo, hojaM, 0, .2 + (i % 4) * .05, 0, brazo); h.scale.set(1, 2.8, .25);
  }

  /* ---------- paneles hexagonales, placa dorada y letrero de neón ---------- */
  const hexGeo = new THREE.CylinderGeometry(.155, .155, .03, 6);
  [[2.72, 1.42, "#20232b"], [3.0, 1.42, "#2b2f38"], [2.86, 1.66, CORAL], [3.14, 1.66, "#20232b"], [2.72, 1.9, "#2b2f38"], [3.0, 1.9, "#20232b"], [2.86, 2.14, "#2b2f38"]]
    .forEach(([x, y, col]) => { const h = pon(hexGeo, M(col, { r: .97 }), x, y, ZP + .02); h.rotation.x = Math.PI / 2; h.rotation.y = Math.PI / 6; });
  pon(RB(.4, .5, .03, .01), M("#0b0c0f", { r: .4 }), .36, 1.72, ZP + .02);
  const placaTex = textura(lienzo(256, 320, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, "#f7d77a"); gr.addColorStop(.5, "#c9922f"); gr.addColorStop(1, "#f2c95c"); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = "rgba(60,36,6,.75)"; g.textAlign = "center"; g.font = `700 92px ${TIT}`; g.fillText("1M", 128, 168); g.font = `700 22px ${MONO}`; g.fillText("THZ CLIPS", 128, 230); g.font = `500 15px ${MONO}`; g.fillText("SEGUIDORES", 128, 258);
  }));
  pon(new THREE.PlaneGeometry(.32, .42), M("#fff", { r: .28, m: .85, env: 1.3, x: { map: placaTex } }), .36, 1.72, ZP + .037, escena, false);
  const neonTex = textura(lienzo(1024, 256, (g, w, h) => {
    g.font = `700 150px ${TIT}`; g.textAlign = "center"; g.textBaseline = "middle"; g.lineJoin = "round";
    g.shadowColor = LIMA; g.shadowBlur = 30; g.strokeStyle = LIMA; g.lineWidth = 14; g.strokeText("THZ CLIPS", w / 2, h / 2);
    g.shadowBlur = 0; g.strokeStyle = "#f4ffd0"; g.lineWidth = 5; g.strokeText("THZ CLIPS", w / 2, h / 2);
  }));
  const neonMat = new THREE.MeshBasicMaterial({ map: neonTex, transparent: true, depthWrite: false, color: new THREE.Color(.25, .25, .25) });
  pon(new THREE.PlaneGeometry(1.15, .29), neonMat, 1.75, 2.3, ZP + .03, escena, false);
  // tiras LED: en la pared y bajo el escritorio
  const ledMat = new THREE.MeshBasicMaterial({ color: "#000" });
  pon(new THREE.BoxGeometry(2.3, .012, .012), ledMat, 1.72, 2.06, ZP + .02, escena, false);
  pon(new THREE.BoxGeometry(2.3, .012, .012), ledMat, 1.72, .71, -1.47, escena, false);

  /* ---------- el escritorio ---------- */
  pon(RB(2.4, .05, .8, .015), M("#121418", { r: .42, m: .1, env: .7 }), 1.7, .745, -1.85);
  for (const x of [.6, 2.8]) pon(RB(.05, .72, .7, .01), M("#0e0f12", { r: .4, m: .6 }), x, .36, -1.9);
  pon(RB(1.25, .006, .45, .003), M("#0a0b0d", { r: .9 }), 1.78, .773, -1.66, escena, false);
  // monitor principal
  const texPantalla = textura(pantalla);
  const mon = grupo(1.75, 1.27, -2.02); mon.rotation.x = -.04;
  pon(RB(1.17, .735, .035, .012), M("#08090b", { r: .35, m: .3 }), 0, 0, 0, mon);
  pon(RB(.5, .32, .06, .03), M("#101216", { r: .5, m: .2 }), 0, -.02, -.04, mon);
  pon(new THREE.PlaneGeometry(1.12, .7), new THREE.MeshBasicMaterial({ map: texPantalla, color: new THREE.Color(1.25, 1.25, 1.25) }), 0, 0, .0185, mon, false);
  pon(RB(.06, .42, .04, .01), M("#1b1d22", { r: .3, m: .8 }), 1.75, .98, -2.1);
  pon(RB(.34, .016, .24, .006), M("#1b1d22", { r: .3, m: .8 }), 1.75, .778, -2.05);
  // monitor vertical
  const texVert = textura(vert);
  const mv = grupo(2.6, 1.24, -1.95); mv.rotation.y = -.5;
  pon(RB(.4, .68, .035, .012), M("#08090b", { r: .35, m: .3 }), 0, 0, 0, mv);
  pon(new THREE.PlaneGeometry(.37, .65), new THREE.MeshBasicMaterial({ map: texVert, color: new THREE.Color(1.2, 1.2, 1.2) }), 0, 0, .0185, mv, false);
  pon(RB(.05, .4, .035, .01), M("#1b1d22", { r: .3, m: .8 }), 2.64, .96, -2.02);
  pon(RB(.26, .016, .2, .006), M("#1b1d22", { r: .3, m: .8 }), 2.64, .778, -2.0);
  // teclado mecánico con RGB, ratón y taza
  pon(RB(.44, .025, .14, .006), M("#15171c", { r: .5, m: .3 }), 1.72, .787, -1.56);
  const teclas = new THREE.InstancedMesh(new THREE.BoxGeometry(.024, .012, .022), M("#1e2129", { r: .55 }), 70);
  { const m4 = new THREE.Matrix4(); let n = 0; for (let f = 0; f < 5; f++) for (let k = 0; k < 14; k++) { m4.setPosition(1.72 - .195 + k * .03, .806, -1.56 - .05 + f * .026); teclas.setMatrixAt(n++, m4); } }
  teclas.castShadow = true; escena.add(teclas);
  const tecladoLuz = new THREE.MeshBasicMaterial({ color: "#000" });
  pon(new THREE.PlaneGeometry(.46, .16), tecladoLuz, 1.72, .7765, -1.56, escena, false).rotation.x = -Math.PI / 2;
  pon(RB(.065, .035, .11, .016), M("#15171c", { r: .4, m: .2 }), 2.03, .79, -1.55);
  const ratonLuz = pon(new THREE.BoxGeometry(.012, .002, .03), new THREE.MeshBasicMaterial({ color: "#000" }), 2.03, .808, -1.57, escena, false);
  pon(new THREE.CylinderGeometry(.045, .04, .11, 28), M("#f1efea", { r: .25 }), 1.22, .83, -1.62);
  pon(new THREE.CylinderGeometry(.04, .04, .004, 24), M("#2b1a10", { r: .2 }), 1.22, .883, -1.62, escena, false);
  const asa = pon(new THREE.TorusGeometry(.03, .008, 8, 18, Math.PI), M("#f1efea", { r: .25 }), 1.265, .83, -1.62); asa.rotation.z = -Math.PI / 2;
  const vaporCv = lienzo(64, 64, (g) => { const r = g.createRadialGradient(32, 32, 2, 32, 32, 30); r.addColorStop(0, "rgba(255,255,255,.5)"); r.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = r; g.fillRect(0, 0, 64, 64); });
  const vapor = [0, 1, 2].map(() => sprite(vaporCv, .06, .06));
  // audífonos
  function audifonos() {
    const g = new THREE.Group(), neg = M("#0d0e11", { r: .35, m: .3 });
    pon(new THREE.TorusGeometry(.138, .013, 8, 36, Math.PI), neg, 0, 0, 0, g, false);
    for (const s of [-1, 1]) {
      pon(new THREE.CylinderGeometry(.052, .052, .045, 24), neg, s * .138, -.02, 0, g, false).rotation.z = Math.PI / 2;
      pon(new THREE.TorusGeometry(.04, .006, 6, 24), brilla(LIMA, 2.2), s * .162, -.02, 0, g, false).rotation.y = Math.PI / 2;
    }
    return g;
  }
  const audMesa = audifonos(); audMesa.position.set(1.02, .8, -1.66); audMesa.rotation.set(-Math.PI / 2, 0, .5); escena.add(audMesa);

  /* ---------- la torre del PC: vidrio templado, ventiladores RGB, gráfica ---------- */
  const pc = grupo(.85, .77, -1.92);
  const metal = M("#0c0d10", { r: .35, m: .7, env: .6 });
  pon(RB(.3, .03, .46, .01), metal, 0, .015, 0, pc);
  pon(RB(.3, .03, .46, .01), metal, 0, .525, 0, pc);
  for (const x of [-.14, .14]) pon(RB(.02, .54, .46, .008), metal, x, .27, 0, pc);
  pon(new THREE.BoxGeometry(.28, .5, .01), M("#101217", { r: .6 }), 0, .27, -.22, pc);
  pon(new THREE.BoxGeometry(.28, .5, .006), new THREE.MeshStandardMaterial({ color: "#9aa8c8", transparent: true, opacity: .07, roughness: .04, metalness: .2, envMapIntensity: .9 }), 0, .27, .226, pc, false);
  const ventiladores = [.12, .27, .42].map((y, i) => {
    const g = grupo(.07, y, -.2, pc);
    const aro = new THREE.Mesh(new THREE.TorusGeometry(.058, .009, 8, 48), new THREE.MeshBasicMaterial({ color: "#000" })); g.add(aro);
    pon(new THREE.TorusGeometry(.064, .009, 6, 32), M("#0b0c0f", { r: .5, m: .4 }), 0, 0, -.004, g, false);
    const aspas = grupo(0, 0, 0, g), aspaM = M("#262a33", { r: .35, x: { transparent: true, opacity: .9 } });
    for (let k = 0; k < 7; k++) { const p = grupo(0, 0, 0, aspas); p.rotation.z = k * Math.PI * 2 / 7; pon(new THREE.BoxGeometry(.048, .022, .003), aspaM, .03, 0, 0, p, false).rotation.x = .5; }
    pon(new THREE.CylinderGeometry(.017, .017, .012, 20), M("#111"), 0, 0, .002, g, false).rotation.x = Math.PI / 2;
    return { aro, aspas, i };
  });
  pon(RB(.22, .05, .13, .008), M("#1a1c22", { r: .35, m: .6 }), -.02, .19, -.14, pc);
  const gpuLuz = new THREE.MeshBasicMaterial({ color: "#000" });
  pon(new THREE.BoxGeometry(.2, .006, .006), gpuLuz, -.02, .217, -.074, pc, false);
  pon(new THREE.CylinderGeometry(.04, .04, .025, 28), M("#15171c", { r: .3, m: .6 }), -.06, .38, -.2, pc).rotation.x = Math.PI / 2;
  const bombaLuz = new THREE.MeshBasicMaterial({ color: "#000" });
  pon(new THREE.TorusGeometry(.03, .004, 6, 28), bombaLuz, -.06, .38, -.186, pc, false);

  /* ---------- la silla gamer ---------- */
  const silla = grupo(1.75, 0, -1.05);
  const negS = M("#17191f", { r: .6 }), corS = M(CORAL, { r: .65 });
  for (let k = 0; k < 5; k++) { const p = grupo(0, .07, 0, silla); p.rotation.y = k * Math.PI * 2 / 5; pon(RB(.05, .035, .3, .012), M("#0d0e11", { r: .35, m: .6 }), 0, 0, .15, p); pon(new THREE.SphereGeometry(.028, 12, 8), M("#08090b"), 0, -.04, .29, p); }
  pon(new THREE.CylinderGeometry(.026, .026, .28, 16), M("#2a2d33", { r: .25, m: .9 }), 0, .24, 0, silla);
  pon(RB(.52, .09, .5, .04), negS, 0, .42, 0, silla);
  for (const s of [-1, 1]) pon(RB(.07, .1, .48, .03), corS, s * .2, .425, 0, silla);
  const resp = grupo(0, .47, .23, silla); resp.rotation.x = .12;
  pon(RB(.5, .8, .09, .04), negS, 0, .4, 0, resp);
  for (const s of [-1, 1]) pon(RB(.07, .72, .1, .03), corS, s * .2, .38, -.005, resp);
  pon(RB(.26, .12, .07, .035), M("#2a2d35", { r: .7 }), 0, .66, -.06, resp);
  for (const s of [-1, 1]) { pon(RB(.04, .2, .04, .01), negS, s * .29, .52, .02, silla); pon(RB(.08, .03, .26, .012), M("#0f1014", { r: .5 }), s * .29, .63, 0, silla); }
  pon(new THREE.CylinderGeometry(1.05, 1.05, .012, 64), M("#1d2027", { r: 1, env: .1 }), 1.6, .006, -.9, escena, false);

  /* ---------- yo ---------- */
  const R = {};
  {
    const piel = new THREE.MeshPhysicalMaterial({ color: "#c98d68", roughness: .52, envMapIntensity: .35, sheen: .5, sheenColor: new THREE.Color("#ff9d80"), sheenRoughness: .35 });
    const sud = Tela(CORAL, { n: nPolar, ns: .7, sc: "#ffb1a8" }), sud2 = Tela("#c9443b", { n: nLino, ns: .8, sc: "#ff8f84" });
    const pan = Tela("#2b3550", { n: nDenim, ns: .75, r: .85, sheen: .6, sc: "#6f86b8" }), pan2 = Tela("#222a40", { n: nDenim, ns: .6, r: .85, sheen: .5 });
    const zap = M("#eef0f4", { r: .5 }), zapG = M("#c9ccd4", { r: .6 }), suela = M("#1a1c21", { r: .75 });
    const pelo = Tela("#17151a", { n: nPelo, ns: 1.1, r: .55, sheen: 1, sr: .3, sc: "#4a4252", env: .5 });
    const blanco = new THREE.MeshPhysicalMaterial({ color: "#ebe6df", roughness: .2, clearcoat: 1, clearcoatRoughness: .05 });
    const iris = new THREE.MeshPhysicalMaterial({ color: "#4a2c1a", roughness: .3, clearcoat: 1, clearcoatRoughness: .02 });
    const negro = new THREE.MeshStandardMaterial({ color: "#050506", roughness: .1 }), labio = M("#a35a4f", { r: .5 });
    const cil = (rt, rb, h, seg = 20) => new THREE.CylinderGeometry(rt, rb, h, seg);
    R.raiz = grupo(); R.raiz.rotation.order = "YXZ";
    // cadera del jean
    pon(new THREE.CapsuleGeometry(.12, .12, 8, 18), pan, 0, -.01, 0, R.raiz).rotation.z = Math.PI / 2;
    R.torso = grupo(0, 0, 0, R.raiz);
    // tronco con forma (cintura, pecho, hombros) hecho de un perfil que gira
    const perfil = [[.0, -.06], [.142, -.055], [.152, .02], [.148, .12], [.156, .24], [.172, .34], [.168, .41], [.138, .47], [.085, .515], [.0, .53]].map(([r, y]) => new THREE.Vector2(r, y));
    pon(new THREE.LatheGeometry(perfil, 40), sud, 0, 0, 0, R.torso).scale.set(1.12, 1, .74);
    pon(new THREE.TorusGeometry(.148, .02, 10, 40), sud2, 0, -.035, 0, R.torso).scale.set(1.13, .7, .75);   // pretina acanalada
    pon(RB(.21, .09, .03, .014, 3), sud, 0, .1, .104, R.torso).rotation.x = -.04;                           // bolsillo canguro
    for (const s of [-1, 1]) pon(cil(.003, .003, .1, 6), sud2, s * .1, .1, .121, R.torso, false).rotation.z = s * .1;
    // capucha caída en la espalda y cuello
    pon(new THREE.TorusGeometry(.082, .036, 12, 28), sud2, 0, .49, -.045, R.torso).rotation.x = Math.PI / 2 - .4;
    const cap = pon(new THREE.SphereGeometry(.12, 24, 16), sud, 0, .43, -.12, R.torso); cap.scale.set(1.05, .62, .55); cap.rotation.x = .45;
    for (const s of [-1, 1]) {   // cordones con puntas
      const c = pon(cil(.0035, .0035, .13, 6), M("#f2f2f2", { r: .7 }), s * .032, .405, .113, R.torso, false); c.rotation.z = s * .05;
      pon(cil(.005, .005, .018, 8), M("#c9ccd4", { r: .3, m: .8 }), s * .035, .335, .115, R.torso, false);
    }
    pon(cil(.048, .054, .09, 18), piel, 0, .5, .005, R.torso);
    // cabeza
    R.cabeza = grupo(0, .54, 0, R.torso);
    pon(new THREE.SphereGeometry(.118, 40, 30), piel, 0, .13, .005, R.cabeza).scale.set(.93, 1.05, 1);
    pon(new THREE.SphereGeometry(.1, 32, 20), piel, 0, .07, .022, R.cabeza).scale.set(.82, .74, .98);          // mandíbula y mentón
    for (const s of [-1, 1]) pon(new THREE.SphereGeometry(.03, 16, 12), piel, s * .055, .1, .088, R.cabeza, false).scale.set(1, .8, .6);   // pómulos
    pon(new THREE.SphereGeometry(.017, 16, 12), piel, 0, .108, .126, R.cabeza).scale.set(.85, .9, 1);          // nariz
    pon(new THREE.CapsuleGeometry(.0075, .028, 4, 10), piel, 0, .132, .119, R.cabeza).rotation.x = .3;          // tabique
    for (const s of [-1, 1]) pon(new THREE.SphereGeometry(.0075, 10, 8), piel, s * .011, .1, .121, R.cabeza, false);   // aletas
    const boca = pon(new THREE.TorusGeometry(.03, .0042, 8, 20, Math.PI * .34), labio, 0, .098, .113, R.cabeza, false); boca.rotation.z = -Math.PI / 2 - Math.PI * .17;
    R.ojos = [-1, 1].map(s => {
      const o = grupo(s * .041, .142, .101, R.cabeza);
      pon(new THREE.SphereGeometry(.0155, 20, 14), blanco, 0, 0, 0, o, false);
      pon(new THREE.SphereGeometry(.0088, 16, 12), iris, 0, 0, .0105, o, false).scale.z = .45;
      pon(new THREE.SphereGeometry(.0042, 12, 8), negro, 0, 0, .0138, o, false).scale.z = .4;
      const par = pon(new THREE.SphereGeometry(.0172, 20, 10, 0, Math.PI * 2, 0, Math.PI * .42), piel, 0, 0, 0, o, false); par.rotation.x = .5;   // párpado
      return o;
    });
    for (const s of [-1, 1]) { const c = pon(RB(.04, .008, .012, .003), pelo, s * .043, .169, .113, R.cabeza, false); c.rotation.set(-.25, s * .2, s * -.12); }   // cejas
    for (const s of [-1, 1]) {   // orejas
      const o = pon(new THREE.SphereGeometry(.027, 16, 12), piel, s * .109, .12, -.005, R.cabeza); o.scale.set(.45, 1, .8);
      pon(new THREE.TorusGeometry(.016, .004, 6, 16), piel, s * .118, .121, -.003, R.cabeza, false).rotation.y = Math.PI / 2;
    }
    // pelo: una capa con mechones (relieve de puntas) y un flequillo
    {
      const geo = new THREE.SphereGeometry(.127, 64, 32, 0, Math.PI * 2, 0, Math.PI * .6), pos = geo.attributes.position, v = new THREE.Vector3(), n = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i); n.copy(v).normalize(); const th = Math.atan2(n.x, n.z), ph = Math.acos(n.y);
        const mech = Math.max(0, Math.sin(th * 9 + ph * 5) * Math.sin(ph * 13 - th * 3)) * .013 + Math.sin(th * 23 + ph * 31) * .0025;
        v.addScaledVector(n, mech + .003); pos.setXYZ(i, v.x, v.y, v.z);
      }
      geo.computeVertexNormals();
      pon(geo, pelo, 0, .146, -.014, R.cabeza).rotation.x = -.45;
      const mechon = new THREE.SphereGeometry(.03, 14, 10);
      for (let i = 0; i < 9; i++) {
        const a = (i - 4) * .26, m = pon(mechon, pelo, Math.sin(a) * .09, .225 - Math.abs(i - 4) * .006, Math.cos(a) * .07, R.cabeza, false);
        m.scale.set(.75, .38, 1.5); m.rotation.set(-.55 + (i % 2) * .12, a, (i - 4) * .05);
      }
    }
    // brazos: hombro, brazo, codo, antebrazo, puño y mano con dedos
    const dedo = new THREE.CapsuleGeometry(.0085, .03, 4, 10), pulgar = new THREE.CapsuleGeometry(.0095, .024, 4, 10);
    const brazo = s => {
      const h = grupo(s * .2, .44, 0, R.torso);
      pon(new THREE.SphereGeometry(.064, 18, 14), sud, 0, 0, 0, h);
      pon(cil(.06, .051, .28), sud, 0, -.14, 0, h);
      const co = grupo(0, -.29, 0, h);
      pon(new THREE.SphereGeometry(.052, 16, 12), sud, 0, 0, 0, co);
      pon(cil(.051, .043, .2), sud, 0, -.1, 0, co);
      pon(cil(.041, .044, .045), sud2, 0, -.215, 0, co);                 // puño acanalado
      pon(cil(.024, .026, .04, 14), piel, 0, -.24, 0, co).scale.z = .7;   // muñeca
      const mano = grupo(0, -.25, 0, co);
      pon(RB(.07, .078, .03, .013, 3), piel, 0, -.042, 0, mano);
      [[-1.5, .032], [-.5, .037], [.5, .035], [1.5, .027]].forEach(([k, l]) => {
        const d = pon(dedo, piel, k * .0175 * s, -.09 - l * .3, -.006, mano, false); d.scale.y = l / .037; d.rotation.x = .45;
      });
      const p = pon(pulgar, piel, -s * .04, -.035, -.01, mano, false); p.rotation.set(.3, 0, -s * .7);
      return [h, co];
    };
    [R.hL, R.cL] = brazo(1); [R.hR, R.cR] = brazo(-1);
    // piernas: jean con rodilla y dobladillo; tenis con suela, puntera y cordones
    const pierna = s => {
      const ca = grupo(s * .085, -.03, 0, R.raiz);
      pon(cil(.079, .063, .44), pan, 0, -.22, 0, ca);
      const ro = grupo(0, -.44, 0, ca);
      pon(new THREE.SphereGeometry(.062, 16, 12), pan, 0, 0, 0, ro);
      pon(cil(.06, .052, .4), pan, 0, -.2, 0, ro);
      pon(cil(.055, .056, .03), pan2, 0, -.395, 0, ro);
      const to = grupo(0, -.43, 0, ro); (s > 0 ? R.tobillos = [to] : R.tobillos.push(to));
      pon(RB(.094, .072, .22, .034, 4), zap, 0, -.018, .035, to);                 // capellada
      pon(new THREE.SphereGeometry(.05, 18, 12), zap, 0, -.035, .135, to).scale.set(.94, .62, 1);   // puntera
      pon(RB(.106, .032, .272, .013, 3), zap, 0, -.06, .052, to);                 // mediasuela
      pon(RB(.108, .01, .274, .004, 2), suela, 0, -.079, .052, to);               // suela
      pon(RB(.05, .035, .07, .015), zapG, 0, .018, .01, to);                      // lengüeta
      for (let k = 0; k < 4; k++) pon(new THREE.BoxGeometry(.05, .005, .007), M("#ffffff", { r: .8 }), 0, .02 - k * .006, .055 + k * .022, to, false).rotation.x = -.25;
      for (const lado of [-1, 1]) { const f = pon(new THREE.BoxGeometry(.003, .016, .11), M(CORAL, { r: .5 }), lado * .0485, -.025, .06, to, false); f.rotation.x = .25; }
      return [ca, ro];
    };
    [R.pL, R.rL] = pierna(1); [R.pR, R.rR] = pierna(-1);
    R.aud = audifonos(); R.aud.position.set(0, .145, -.005); R.cabeza.add(R.aud);
  }
  const P0 = { x: 0, y: 0, z: 0, yaw: 0, pitch: 0, lean: 0, cab: 0, cabY: 0, shL: 0, shR: 0, ab: .08, elL: -.15, elR: -.15, hipL: 0, hipR: 0, knL: 0, knR: 0, pie: 0, ojos: 1 };
  const pose = o => ({ ...P0, ...o });
  const mez = (a, b, k) => { const r = {}; for (const key in P0) r[key] = lerp(a[key], b[key], k); return r; };
  const DORMIDO = pose({ x: BX, y: .66, z: -1.35, pitch: -Math.PI / 2 + .12, cab: .1, cabY: .35, shL: .05, shR: .05, ab: .12, elL: -.2, elR: -.2, pie: 1.25, ojos: 0 });
  const SENTADO = pose({ x: BX, y: .64, z: -1.3, lean: .08, pie: 1.1, hipL: -1.5, hipR: -1.5, knL: .05, knR: .05, shL: -.35, shR: -.35, elL: -.5, elR: -.5, cabY: .3 });
  const ESTIRA = pose({ ...SENTADO, shL: -2.9, shR: -2.9, ab: .35, elL: -.25, elR: -.25, lean: -.12, cab: -.35, cabY: 0, ojos: .1 });
  const BORDE = pose({ x: -1.85, y: .55, z: -1.1, yaw: Math.PI / 2, lean: .12, hipL: -1.45, hipR: -1.45, knL: 1.4, knR: 1.4, shL: -.3, shR: -.3, elL: -.6, elR: -.6, cabY: -.2 });
  const PARADO = pose({ x: -1.45, y: .97, z: -1.05, yaw: Math.PI / 2, lean: .04 });
  const camino = new THREE.CatmullRomCurve3([[-1.45, -1.05], [-.9, -.55], [0, -.35], [.8, -.5], [1.38, -1.05]].map(([x, z]) => new THREE.Vector3(x, 0, z)));
  const largo = camino.getLength();
  const SX = 1.75, SZ = -1.05;   // centro de la silla
  const sentadoSilla = cy => pose({ x: SX + Math.sin(cy) * .04, y: .565, z: SZ + Math.cos(cy) * .04, yaw: cy + Math.PI, lean: .08, hipL: -1.45, hipR: -1.45, knL: 1.35, knR: 1.35, shL: -.35, shR: -.35, elL: -.9, elR: -.9 });
  const TECLEA = pose({ ...sentadoSilla(0), lean: .12, cab: -.12, shL: -.91, shR: -.91, elL: -.79, elR: -.79, ab: -.05 });
  const giroSilla = t => t < 7.0 ? Math.PI / 2 : lerp(Math.PI / 2, 0, ease(seg(t, 7.0, 7.7)));
  const vp = new THREE.Vector3(), vt = new THREE.Vector3();
  function caminar(t) {
    const k = seg(t, 4.4, 6.3), u = lerp(k, suave(k), .55);
    camino.getPointAt(u, vp); camino.getTangentAt(u, vt);
    const f = u * largo / 1.15 * Math.PI * 2, s = Math.sin(f), co = Math.cos(f);
    return pose({ x: vp.x, y: .965 - .022 * Math.abs(co), z: vp.z, yaw: Math.atan2(vt.x, vt.z), lean: .08,
      hipL: -s * .45, hipR: s * .45, knL: .12 + .6 * Math.max(0, co), knR: .12 + .6 * Math.max(0, -co), shL: s * .42, shR: -s * .42, elL: -.3, elR: -.3 });
  }
  function posePersona(t) {
    if (t < 2.4) return DORMIDO;
    if (t < 3.0) return mez(DORMIDO, SENTADO, ease(seg(t, 2.4, 3.0)));
    if (t < 3.5) return mez(SENTADO, ESTIRA, Math.sin(seg(t, 3.0, 3.5) * Math.PI));
    if (t < 4.0) return mez(SENTADO, BORDE, ease(seg(t, 3.5, 4.0)));
    if (t < 4.4) return mez(BORDE, PARADO, ease(seg(t, 4.0, 4.4)));
    if (t < 6.3) { const p = caminar(t); return t < 4.65 ? mez(PARADO, p, seg(t, 4.4, 4.65)) : p; }
    const fin = caminar(6.3);
    if (t < 6.6) { const k = ease(seg(t, 6.3, 6.6)), s = Math.sin(k * Math.PI * 2) * .18; return { ...mez(fin, pose({ ...fin, yaw: Math.PI * 1.5 }), k), hipL: -s, hipR: s, knL: .1 + Math.abs(s), knR: .1, y: .965 }; }
    const parado = pose({ ...fin, yaw: Math.PI * 1.5, y: .965, hipL: 0, hipR: 0, knL: 0, knR: 0, shL: 0, shR: 0 });
    if (t < 7.0) return mez(parado, sentadoSilla(Math.PI / 2), ease(seg(t, 6.6, 7.0)));
    if (t < 7.5) return sentadoSilla(giroSilla(t));
    return mez(sentadoSilla(giroSilla(t)), TECLEA, ease(seg(t, 7.5, 8.0)));
  }
  function aplicar(p, t) {
    R.raiz.position.set(p.x, p.y, p.z);
    R.raiz.rotation.set(p.pitch, p.yaw, 0);
    R.torso.rotation.x = p.lean;
    R.cabeza.rotation.set(p.cab, p.cabY, 0);
    let elL = p.elL, elR = p.elR;
    if (t > 7.9) { elL += Math.sin(t * 26) * .04; elR += Math.sin(t * 21 + 1) * .035; }
    R.hL.rotation.set(p.shL, 0, p.ab); R.hR.rotation.set(p.shR, 0, -p.ab);
    R.cL.rotation.x = elL; R.cR.rotation.x = elR;
    R.pL.rotation.x = p.hipL; R.pR.rotation.x = p.hipR;
    R.rL.rotation.x = p.knL; R.rR.rotation.x = p.knR;
    R.tobillos.forEach(o => o.rotation.x = p.pie);
    const parpadeo = p.ojos > .5 && (t * 1000) % 3100 < 110 ? .1 : p.ojos;
    R.ojos.forEach(o => o.scale.y = Math.max(.08, parpadeo));
  }

  /* zzz y ondas del despertador */
  const zCv = lienzo(64, 64, g => { g.fillStyle = "#c9d0ff"; g.font = `700 52px ${TIT}`; g.textAlign = "center"; g.fillText("z", 32, 48); });
  const zetas = [0, 1, 2].map(() => sprite(zCv, .1, .1));
  const ondaCv = lienzo(128, 128, g => { g.strokeStyle = CORAL; g.lineWidth = 6; g.beginPath(); g.arc(64, 64, 56, 0, 7); g.stroke(); });
  const ondas = [0, 1].map(() => { const s = sprite(ondaCv, .1, .1); s.material.color = new THREE.Color(2, 2, 2); return s; });

  /* ---------- la cámara (planos del video) ---------- */
  const PANT = [[1.8, 1.32, -1.31], [1.75, 1.27, -2.0], 54];
  const CAM = [
    [0.0,  [-1.35, 1.85, .75], [-2.45, .68, -1.5], 40],
    [2.2,  [-1.5, 1.72, .45], [-2.5, .7, -1.55], 38],
    [3.7,  [-.8, 1.55, 1.2], [-2.0, .82, -1.2], 40],
    [4.7,  [-.1, 1.55, 2.5], [-.7, .95, -.9], 44],
    [5.8,  [.9, 1.6, 2.5], [.6, .95, -1.0], 44],
    [6.6,  [.15, 1.38, .55], [.95, 1.15, -1.9], 40],
    [7.5,  [1.98, 1.5, .15], [1.74, 1.18, -1.9], 44],
    [8.4,  ...PANT], [17.0, ...PANT],
    [17.9, [.35, 1.7, 2.7], [.1, 1.15, -1.6], 46],
    [18.4, [.55, 1.66, 2.5], [.3, 1.15, -1.6], 46],
    [19.3, ...PANT], [22.9, ...PANT],
    [24.0, PANT[0], PANT[1], 64],
  ];
  const mira = new THREE.Vector3();
  function camara(t) {
    let i = 0; while (i < CAM.length - 2 && t >= CAM[i + 1][0]) i++;
    const [a, pa, la, fa] = CAM[i], [b, pb, lb, fb] = CAM[i + 1], k = ease(seg(t, a, b));
    cam.position.set(lerp(pa[0], pb[0], k) + Math.sin(t * .7) * .008, lerp(pa[1], pb[1], k) + Math.sin(t * .9 + 1) * .006, lerp(pa[2], pb[2], k));
    mira.set(lerp(la[0], lb[0], k), lerp(la[1], lb[1], k), lerp(la[2], lb[2], k));
    cam.lookAt(mira);
    const fov = lerp(fa, fb, k); if (Math.abs(cam.fov - fov) > .01) { cam.fov = fov; cam.updateProjectionMatrix(); }
  }

  /* ---------- la hora del día ---------- */
  function luzDia(t) {
    if (t < .4) return .02;
    if (t < 2.2) return lerp(.02, .5, seg(t, .4, 2.2));
    if (t < 6) return lerp(.5, 1, ease(seg(t, 2.2, 6)));
    if (t < 17) return 1;
    if (t < 17.9) return lerp(1, .45, ease(seg(t, 17, 17.9)));
    if (t < 18.6) return lerp(.45, 0, ease(seg(t, 17.9, 18.6)));
    return 0;
  }
  const progresoSol = t => t < 6 ? lerp(0, .3, seg(t, 0, 6)) : t < 17 ? lerp(.3, .45, seg(t, 6, 17)) : lerp(.45, 1, ease(seg(t, 17, 18.6)));
  const cLuna = new THREE.Color("#7d93ff"), cAlba = new THREE.Color("#ffa25c"), cDia = new THREE.Color("#fff0dc"), tmp = new THREE.Color();

  let n = 0;
  const pintar3D = t => {
    n++;
    const l = luzDia(t), prog = progresoSol(t), ang = prog * Math.PI;
    // sol (o luna) entrando por la ventana
    if (l > .02) sol.position.set(sol.target.position.x - Math.cos(ang) * 4, Math.max(1.2, Math.sin(ang) * 5), -6);
    else sol.position.set(1.6, 4, -6);
    if (l < .5) sol.color.copy(cLuna).lerp(cAlba, suave(l / .5)); else sol.color.copy(cAlba).lerp(cDia, (l - .5) / .5);
    sol.intensity = l < .5 ? lerp(.45, 2.6, suave(l / .5)) : lerp(2.6, 3.4, (l - .5) / .5);
    hemi.intensity = .16 + .5 * l; relleno.intensity = .1 + .25 * l;
    if (Math.abs(l - cieloVisto[0]) > .004 || Math.abs(prog - cieloVisto[1]) > .004) { dibujarCielo(l, prog); cieloTex.needsUpdate = true; cieloVisto = [l, prog]; }
    cieloMat.color.setScalar(lerp(.8, 1.7, l));
    // lámpara de noche
    const lamp = t > 17.6 ? seg(t, 17.6, 18.2) : 0;
    lLamp.intensity = lamp * 1.6; pantallaLamp.emissiveIntensity = lamp * 1.4;
    // el PC se prende
    const on = seg(t, 6.0, 6.4), hue = (t * .045) % 1;
    tmp.setHSL(hue, .9, .55);
    ledMat.color.copy(tmp).multiplyScalar(2.4 * on); tecladoLuz.color.copy(tmp).multiplyScalar(2.2 * on);
    lLed.color.copy(tmp); lLed.intensity = on * (.35 + (1 - l) * 1.1);
    tmp.setHSL((hue + .5) % 1, .9, .55); gpuLuz.color.copy(tmp).multiplyScalar(3 * on); lPc.color.copy(tmp); lPc.intensity = on * (.5 + (1 - l) * .6);
    bombaLuz.color.set(LIMA).multiplyScalar(2.6 * on); ratonLuz.material.color.set(LIMA).multiplyScalar(2.4 * on);
    neonMat.color.setScalar(lerp(.25, 1.9, on));
    for (const v of ventiladores) { tmp.setHSL((hue + v.i * .12) % 1, .95, .55); v.aro.material.color.copy(tmp).multiplyScalar(5 * on); v.aspas.rotation.z -= dtF * 28 * on; }
    lMon.intensity = seg(t, 6.2, 6.7) * (4 + (1 - l) * 6); lMonV.intensity = seg(t, 6.2, 6.7) * (2.5 + (1 - l) * 4);
    // monitores (más seguido cuando la cámara está cerca de la pantalla)
    const cerca = (t > 7.6 && t < 17.2) || t > 18.6;
    if (t > 6.1 && (cerca || n % 3 === 0)) { dibujarPantalla(t); texPantalla.needsUpdate = true; }
    else if (t <= 6.1 && n % 10 === 0) { dibujarPantalla(t); texPantalla.needsUpdate = true; }
    if (n % 3 === 0) { dibujarVertical(t); texVert.needsUpdate = true; }
    // despertador
    const suena = t > 1.8 && t < 2.9, s = t < 1.8 ? "06:59" : "07:00", parp = suena && Math.floor(t * 6) % 2 === 0;
    if (s + parp !== alarmaVista) { dibujarAlarma(parp ? "" : s, suena); alarmaVista = s + parp; }
    reloj3d.position.x = -1.58 + (suena ? Math.sin(t * 90) * .006 : 0); reloj3d.rotation.z = suena ? Math.sin(t * 70) * .05 : 0;
    ondas.forEach((o, i) => { const k = ((t - 1.8) * 2 + i * .5) % 1; o.visible = suena; o.position.set(-1.58, .6, -1.9); o.scale.setScalar(.08 + k * .3); o.material.opacity = 1 - k; });
    // zzz
    zetas.forEach((z, i) => { const o = (t * .8 + i / 3) % 1, f = 1 - seg(t, 1.4, 1.9); z.visible = f > 0; z.position.set(-2.32 + o * .22 + i * .03, .86 + o * .38, -1.98 + o * .1); z.scale.setScalar(.07 + i * .025); z.material.opacity = (1 - o) * f; });
    // la cobija se corre al levantarse
    const kb = ease(seg(t, 2.4, 3.1));
    const sy = lerp(1, 1.5, kb); manta.position.set(BX, .62 + .07 * (sy - 1), lerp(-.85, -.42, kb)); manta.scale.set(1, sy, lerp(1, .56, kb));
    // yo, la silla y los audífonos
    aplicar(posePersona(t), t);
    silla.rotation.y = giroSilla(t) + (t > 7.9 ? Math.sin(t * .8) * .03 : 0);
    const kA = ease(seg(t, 7.6, 7.9)); audMesa.visible = kA < .5; R.aud.visible = kA > 0; R.aud.scale.setScalar(Math.max(.001, kA));
    // vapor del café
    vapor.forEach((v, i) => { const o = (t * .45 + i / 3) % 1; v.visible = t > 6.5 && t < 17.5; v.position.set(1.22 + Math.sin(o * 6 + i) * .015, .9 + o * .2, -1.62); v.scale.setScalar(.04 + o * .07); v.material.opacity = Math.sin(o * Math.PI) * .5; });
    camara(t);
    const t0 = performance.now();
    cine.uniforms.uT.value = (t * 7.3) % 50;
    if (conBloom) composer.render(); else renderer.render(escena, cam);
    vigilar(performance.now() - t0, dtF);
  };
  // si el equipo va lento, baja la calidad sola (nunca se queda pegado)
  let conBloom = true, nivel = movil ? 1 : 2, muestras = [];
  function vigilar(costo, dt) {
    muestras.push(Math.max(costo, dt * 1000));
    if (muestras.length < 45) return;
    const prom = muestras.sort((a, b) => a - b)[Math.floor(muestras.length / 2)]; muestras = [];
    if (prom < 38 || nivel <= -1) return;
    nivel--;
    if (nivel === 1) { pr = 1; gtao.enabled = sombraAO.enabled = false; }
    else if (nivel === 0) { conBloom = false; pr = Math.min(pr, .85); }
    else { pr = .6; renderer.shadowMap.enabled = false; escena.traverse(o => { if (o.material) o.material.needsUpdate = true; }); }
    renderer.setPixelRatio(pr); composer.setPixelRatio(pr); medir();
    console.info("Calidad del 3D bajada a", nivel);
  }
  if (modo === "2d") return;
  // compila todo antes de mostrar (así no se traba la primera vez que aparece algo)
  escena.traverse(o => { o.visible = true; });
  renderer.compile(escena, cam);
  modo = "3d";
  pintar = pintar3D;
  caja.prepend(renderer.domElement);
  listo = true;
}

hud(reloj % T);
negro.style.opacity = 1; negroTxt.textContent = "CARGANDO…"; negroTxt.style.opacity = .5;
requestAnimationFrame(cuadro);
setTimeout(() => { if (!listo) { console.warn("El 3D tardó demasiado; se muestra en 2D"); modo2D(); } }, 12000);
iniciar3D().catch(e => { console.warn("3D no disponible:", e); modo2D(); });
