// 生成 DeepSeek Harness 桌面快捷方式图标（韩立 Q 版，青花瓷底）
// 用法：node make_icon.mjs
import fs from 'node:fs'
import { pathToFileURL } from 'node:url'
const sharp = (await import(pathToFileURL('D:/deepseek/node_modules/@deepseek-ai/dsh/node_modules/sharp/dist/index.cjs').href)).default

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2f6fb2"/>
      <stop offset="100%" stop-color="#1b4d8a"/>
    </linearGradient>
    <linearGradient id="swordGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#3fae6a"/>
      <stop offset="100%" stop-color="#2e8b57"/>
    </linearGradient>
  </defs>
  <!-- 青花瓷底 + 云纹 -->
  <rect x="0" y="0" width="220" height="220" rx="40" fill="url(#bg)"/>
  <ellipse cx="180" cy="40" rx="34" ry="10" fill="#ffffff" opacity="0.10"/>
  <ellipse cx="34" cy="184" rx="40" ry="11" fill="#ffffff" opacity="0.10"/>
  <path d="M30 60 q8 -10 16 0 q8 10 16 0" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.14"/>
  <path d="M160 170 q8 -10 16 0 q8 10 16 0" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.14"/>
  <!-- 御剑飞行的韩立 -->
  <g transform="translate(44 30)">
    <ellipse cx="64" cy="128" rx="58" ry="8" fill="#7ddb9b" opacity="0.25"/>
    <g transform="rotate(-5 66 122)">
      <rect x="-30" y="118" width="16" height="8" rx="3" fill="#7a4a1f"/>
      <path d="M-14 113 q4 6 -4 11 z" fill="#a45d2a"/>
      <rect x="-14" y="116" width="120" height="9" rx="4" fill="url(#swordGrad)"/>
      <path d="M106 118 L128 113 L128 128 Z" fill="#2e8b57"/>
      <path d="M-12 117.5 L104 112" stroke="#c9f2d8" stroke-width="2" opacity="0.9" stroke-linecap="round"/>
    </g>
    <rect x="48" y="107" width="10" height="13" rx="4" fill="#3a2e22"/>
    <rect x="68" y="107" width="10" height="13" rx="4" fill="#3a2e22"/>
    <path d="M43 83 L79 83 L91 114 L77 120 L60 116 L41 120 Z" fill="#6B7A6D"/>
    <rect x="41" y="82" width="40" height="5" rx="2" fill="#3a4a3f"/>
    <path d="M39 77 q-24 6 -18 32 q11 -9 24 -7 Z" fill="#5d6b60"/>
    <path d="M80 79 q20 2 27 15 q-9 6 -23 1 Z" fill="#5d6b60"/>
    <circle cx="103" cy="96" r="5" fill="#f2d8b8"/>
    <circle cx="64" cy="65" r="27" fill="#f2d8b8"/>
    <path d="M37 65 a27 27 0 0 1 54 0 q-5 -14 -15 -18 q-13 -6 -26 0 q-10 4 -13 18 z" fill="#2b2b2b"/>
    <circle cx="68" cy="37" r="8" fill="#2b2b2b"/>
    <rect x="73" y="31" width="23" height="3.5" rx="1.5" fill="#8a5a2b"/>
    <path d="M42 55 q11 -11 22 -5 q10 -5 22 5 q-13 -8 -21 -2 q-9 -4 -23 2 z" fill="#2b2b2b"/>
    <path d="M50 59 q6 -4 12 -2" stroke="#2b2b2b" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M72 55 q6 -4 12 -2" stroke="#2b2b2b" stroke-width="2" fill="none" stroke-linecap="round"/>
    <ellipse cx="55" cy="67" rx="4.5" ry="5.5" fill="#2b2b2b"/>
    <circle cx="56.5" cy="65" r="1.6" fill="#fff"/>
    <ellipse cx="73" cy="67" rx="4.5" ry="5.5" fill="#2b2b2b"/>
    <circle cx="74.5" cy="65" r="1.6" fill="#fff"/>
    <path d="M64 71 q1 3 0 5" stroke="#d9b28e" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <path d="M60 77 q4 3 8 0" stroke="#8a5a3a" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <circle cx="89" cy="80" r="5" fill="#d4a017"/>
    <path d="M87 77.5 q2 3 4 0" stroke="#8a6a10" stroke-width="1.2" fill="none"/>
  </g>
</svg>`

const png = await sharp(Buffer.from(svg)).resize(256, 256).png().toBuffer()
await fs.promises.writeFile('D:/deepskhaness/dsh-app-icon.png', png)
// ICO 容器（256 PNG 内嵌）
const icoHeader = Buffer.alloc(6)
icoHeader.writeUInt16LE(0, 0) // reserved
icoHeader.writeUInt16LE(1, 2) // type: icon
icoHeader.writeUInt16LE(1, 4) // count
const dirEntry = Buffer.alloc(16)
dirEntry[0] = 0 // 256 -> 0
dirEntry[1] = 0
dirEntry[2] = 0 // color count
dirEntry[3] = 0 // reserved
dirEntry.writeUInt16LE(1, 4) // planes
dirEntry.writeUInt16LE(32, 6) // bpp
dirEntry.writeUInt32LE(png.length, 8) // size
dirEntry.writeUInt32LE(22, 12) // offset
const ico = Buffer.concat([icoHeader, dirEntry, png])
await fs.promises.writeFile('D:/deepskhaness/dsh-app.ico', ico)
console.log('icon written:', ico.length, 'bytes; png', png.length)
