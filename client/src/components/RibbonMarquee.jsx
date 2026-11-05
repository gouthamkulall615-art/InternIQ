import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ------------------------------------------------------------------ *
 * RibbonMarquee: text printed on a satin ribbon that waves and twists
 * through 3D space and scrolls like a marquee. Hovering does nothing.
 * Touch (or press and hold) a spot and a small spiral curls up right
 * under your finger, with a satin shine, then relaxes when you let go.
 *
 * Needs: npm i three   (r152 or newer)
 * Own implementation, no paid registry or licence key required.
 * ------------------------------------------------------------------ */

const WIDTH = 1.35;          // ribbon width in world units
const MIN_LENGTH = 12;       // ribbon is never shorter than this
const CAMERA_Z = 9.5;
const FOV = 35;

const VERT = /* glsl */ `
  uniform float uTime, uSpiral, uFocus, uLength, uWidth;
  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vPos;

  // spiral weight: a small patch under the finger, nothing elsewhere
  float wgt(float u) {
    float d = (u - uFocus) / 0.07;
    return exp(-d * d) * uSpiral;
  }
  float phase(float u) {
    return (u - uFocus) * 24.0 + uTime * 2.0;
  }

  vec3 path(float u) {
    float x = (u - 0.5) * uLength;
    float y = sin(u * 5.0 + uTime * 0.8) * 0.45 + sin(u * 11.0 - uTime * 0.5) * 0.12;
    float z = cos(u * 4.0 + uTime * 0.6) * 0.6;
    float w = wgt(u);
    float a = phase(u);
    y += sin(a) * 0.5 * w;    // small helix around the x axis
    z += cos(a) * 0.5 * w;
    return vec3(x, y, z);
  }

  void main() {
    float u = uv.x;
    float e = 0.002;
    vec3 P = path(u);
    vec3 T = normalize(path(u + e) - path(u - e));

    // frame along the path: B0 is "up", N0 faces the camera
    vec3 B0 = normalize(cross(vec3(0.0, 0.0, 1.0), T));
    vec3 N0 = cross(T, B0);

    // twist of the ribbon around its own axis
    float w = wgt(u);
    float theta = u * 2.2
                + sin(u * 3.5 + uTime * 0.6) * 1.4
                + w * phase(u) * 0.22;

    vec3 W = B0 * cos(theta) + N0 * sin(theta);
    vec3 pos = P + W * (uv.y - 0.5) * uWidth;

    vec4 world = modelMatrix * vec4(pos, 1.0);
    vPos = world.xyz;
    vN = mat3(modelMatrix) * cross(T, W);
    vUv = uv;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const FRAG = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uScroll, uRepeat, uShine, uTime;
  uniform vec3 uColor, uInk;
  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vPos;

  void main() {
    bool front = gl_FrontFacing;
    vec3 N = normalize(vN);
    if (!front) N = -N;

    vec3 V  = normalize(cameraPosition - vPos);
    vec3 L1 = normalize(vec3(-0.5, 0.9, 0.7));
    vec3 L2 = normalize(vec3(0.8, -0.2, 0.5));

    float diff = 0.42 + 0.58 * max(dot(N, L1), 0.0) + 0.18 * max(dot(N, L2), 0.0);

    // satin: tight highlight plus a broad soft sheen and a fresnel edge glow
    vec3  H     = normalize(L1 + V);
    float nh    = max(dot(N, H), 0.0);
    float spec  = pow(nh, 48.0);
    float broad = pow(nh, 8.0) * 0.25;
    float fres  = pow(1.0 - max(dot(N, V), 0.0), 3.0);

    // a bright band that travels along the ribbon
    float p    = fract(uTime * 0.05);
    float d    = (vUv.x - (p * 1.4 - 0.2)) * 9.0;
    float band = exp(-d * d);

    // printed text, front face only
    float ink = front ? texture2D(uMap, vec2(vUv.x * uRepeat + uScroll, vUv.y)).a : 0.0;

    vec3 satin = uColor * diff;
    vec3 col = mix(satin, uInk * (0.55 + 0.45 * diff), ink);

    float shine = (spec * 0.9 + broad + band * 0.35) * uShine * (1.0 - ink * 0.65);
    col += vec3(0.75, 0.8, 1.0) * shine + uColor * fres * 0.25;

    // slightly darker selvedge along both edges
    float edge = smoothstep(0.0, 0.04, vUv.y) * smoothstep(1.0, 0.96, vUv.y);
    col *= 0.8 + 0.2 * edge;
    if (!front) col *= 0.82;

    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

// Draw the phrase once on a canvas sized to the phrase, so tiling is seamless.
function makeTextTexture(text, fontFamily) {
  const H = 320;
  const size = H * 0.4;
  const font = `800 ${size}px ${fontFamily}`;
  const probe = document.createElement("canvas").getContext("2d");
  probe.font = font;
  if ("letterSpacing" in probe) probe.letterSpacing = `${size * 0.06}px`;
  const textW = probe.measureText(text).width;
  const W = Math.min(4096, Math.ceil(textW + size * 1.2));

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  ctx.font = font;
  if ("letterSpacing" in ctx) ctx.letterSpacing = `${size * 0.06}px`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillStyle = "#fff";
  ctx.fillText(text, size * 0.6, H / 2 + size * 0.04);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  return { tex, aspect: W / H };
}

export default function RibbonMarquee({
  items = [
    "Fix your resume before they see it",
    "Beat the ATS",
    "Get shortlisted",
  ],
  speed = 0.9,                 // world units per second the text travels
  color = "#4F46E5",           // ribbon colour (InternIQ indigo)
  ink = "#F4F5FB",             // printed text colour
  background = "transparent",
  height = "clamp(280px, 38vw, 460px)",
  fontFamily = "'Bricolage Grotesque', 'Inter', system-ui, sans-serif",
  className = "",
}) {
  const wrap = useRef(null);
  const label = items.join(". ");

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;

    let disposed = false;
    let raf = 0;
    let visible = true;
    let repeatLen = WIDTH * 4; // world units per text tile, updated when texture is ready
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const canvas = renderer.domElement;
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;";
    el.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
    camera.position.set(0, 0, CAMERA_Z);

    const blank = new THREE.DataTexture(new Uint8Array([0, 0, 0, 0]), 1, 1);
    blank.needsUpdate = true;

    const uniforms = {
      uTime: { value: reduce ? 2.0 : 0 },
      uSpiral: { value: 0 },
      uFocus: { value: 0.5 },
      uLength: { value: MIN_LENGTH },
      uWidth: { value: WIDTH },
      uMap: { value: blank },
      uScroll: { value: 0 },
      uRepeat: { value: 3 },
      uShine: { value: 0.55 },
      uColor: { value: new THREE.Color(color) },
      uInk: { value: new THREE.Color(ink) },
    };

    const geometry = new THREE.PlaneGeometry(1, 1, 200, 8);
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERT,
      fragmentShader: FRAG,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false; // the vertex shader moves the geometry
    scene.add(mesh);

    let visibleW = 10;
    const fit = () => {
      const w = el.clientWidth || 1;
      const h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const visibleH = 2 * CAMERA_Z * Math.tan((FOV * Math.PI) / 360);
      visibleW = visibleH * camera.aspect;
      uniforms.uLength.value = Math.max(MIN_LENGTH, visibleW * 1.25);
      uniforms.uRepeat.value = uniforms.uLength.value / repeatLen;
      if (reduce) renderer.render(scene, camera);
    };

    // Text texture: wait for the web font so the canvas uses it
    (async () => {
      try {
        await document.fonts.load(`800 120px ${fontFamily}`);
      } catch {
        /* fall back to the system font */
      }
      if (disposed) return;
      const phrase = items.map((t) => t.toUpperCase()).join("   \u00B7   ") + "   \u00B7   ";
      const { tex, aspect } = makeTextTexture(phrase, fontFamily);
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      uniforms.uMap.value = tex;
      repeatLen = WIDTH * aspect;
      fit();
    })();

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);

    // Pointer: ONLY a touch / press makes a small spiral under the finger.
    // Hovering with a mouse does nothing.
    let spiralTarget = 0;
    let focusTarget = 0.5;
    let pressed = false;
    let spiral = 0;
    let focus = 0.5;
    const toFocus = (e) => {
      const r = el.getBoundingClientRect();
      const frac = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      focusTarget = 0.5 + (frac - 0.5) * (visibleW / uniforms.uLength.value);
    };
    const onDown = (e) => {
      pressed = true;
      toFocus(e);
      if (spiral < 0.05) focus = focusTarget; // start right under the finger
      spiral = Math.max(spiral, 0.35);        // a quick tap still shows a little curl
      spiralTarget = 1;
      el.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e) => {
      if (pressed) toFocus(e);                // follow the finger only while pressed
    };
    const release = () => {
      pressed = false;
      spiralTarget = 0;
    };

    if (!reduce) {
      el.addEventListener("pointerdown", onDown);
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerup", release);
      el.addEventListener("pointercancel", release);
      el.addEventListener("lostpointercapture", release);
    }

    // Loop
    const clock = new THREE.Clock();
    const tick = () => {
      if (!visible) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      uniforms.uTime.value += dt;
      // curls up quickly, relaxes slowly
      const rate = spiralTarget > spiral ? 8 : 2.5;
      spiral += (spiralTarget - spiral) * (1 - Math.exp(-dt * rate));
      focus += (focusTarget - focus) * (1 - Math.exp(-dt * 8));
      uniforms.uSpiral.value = spiral;
      uniforms.uFocus.value = focus;
      uniforms.uShine.value = 0.55 + 0.7 * spiral;
      uniforms.uScroll.value += (dt * speed) / repeatLen;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };

    let io;
    if (!reduce) {
      io = new IntersectionObserver(([entry]) => {
        const nowVisible = entry.isIntersecting;
        if (nowVisible && !visible) {
          visible = true;
          clock.getDelta(); // drop the time spent off-screen
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(tick);
        } else if (!nowVisible && visible) {
          visible = false;
          cancelAnimationFrame(raf);
        }
      }, { threshold: 0.05 });
      io.observe(el);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io?.disconnect();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", release);
      el.removeEventListener("pointercancel", release);
      el.removeEventListener("lostpointercapture", release);
      geometry.dispose();
      material.dispose();
      uniforms.uMap.value?.dispose?.();
      blank.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.join("|"), speed, color, ink, fontFamily]);

  return (
    <div
      ref={wrap}
      role="img"
      aria-label={label}
      className={`relative w-full overflow-hidden ${className}`}
      style={{ height, background, touchAction: "pan-y", cursor: "pointer" }}
    />
  );
}