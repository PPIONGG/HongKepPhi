# นำ React Bits มาใช้กับ ห้องเก็บผี

วันที่: 2026-08-14

## เป้าหมาย

ทดลองว่า [React Bits](https://reactbits.dev) ช่วยให้เว็บดูดีขึ้นไหม โดย
**ไม่ทำลายภาษาทางภาพเดิม** ของเว็บ (ห้องเก็บของโทนอุ่น ฟิล์มเกรน แสงถ่าน)

## ข้อจำกัดที่ค้นพบก่อนออกแบบ

ทั้งสามข้อนี้กำหนดว่าใช้อะไรได้บ้าง:

1. **ภาษาไทยกับ text animation** — `SplitText`, `DecryptedText`, `ScrollReveal`
   ตัดข้อความทีละตัวอักษรแล้วห่อ `<span>` แยก ภาษาไทยมีสระบน-ล่างและวรรณยุกต์
   ที่ต้องประกอบกับพยัญชนะ พอแยก span แล้วรูปสระจะหลุดจากตัวพยัญชนะ
   โหมดตัดทีละคำก็ไม่ช่วยเพราะไทยไม่เว้นวรรคระหว่างคำ
   → ใช้ได้เฉพาะข้อความ Latin/ตัวเลข

   ข้อยกเว้น: `ShinyText` ใช้ `background-clip: text` บน span เดียว
   ไม่แตะโครงสร้างตัวอักษร → ใช้กับไทยได้

2. **ไม่เอา WebGL** — ไม่รับ `ogl` / `three` เพื่อไม่ให้กิน GPU และแบตมือถือ
3. **ไม่เอา gsap** — น้ำหนักไม่คุ้มกับ effect ที่ได้ ตัด `AnimatedContent`
   และ `ScrollReveal` ออก

## แนวทางที่เลือก

เพิ่ม dependency ตัวเดียวคือ `motion` แล้ว vendor คอมโพเนนต์ที่ใช้ได้จริงเข้ามา

แนวทางที่พิจารณาแล้วไม่เลือก:

- **เขียน effect เองล้วน ไม่เพิ่ม dep** — bundle ไม่โต แต่ไม่ได้ประเมิน
  ตัวไลบรารีจริงตามที่ต้องการ
- **`motion` + `gsap`** — ปลดล็อก `ScrollReveal` แต่ +70 KB gz เพื่อ effect
  เดียวที่ใช้กับไทยไม่ได้อยู่ดี

## สถาปัตยกรรม

React Bits เป็นแบบ copy-in (เหมือน shadcn/ui) โค้ดเข้ามาอยู่ในเรพ แก้ได้เต็มที่

```
src/components/reactbits/   ← โค้ด vendored จาก React Bits (variant TS + Tailwind)
  DecryptedText.tsx
  ShinyText.tsx
  SpotlightCard.tsx
src/components/DustMotes.tsx ← เขียนเอง ไม่มี dep
```

แยกโฟลเดอร์ `reactbits/` เพื่อให้เห็นชัดว่าไฟล์ไหน vendored ไฟล์ไหนเขียนเอง
เวลาอัปเดตจาก upstream จะรู้ว่าต้อง merge ตรงไหน

ทุกตัวเป็น client component (`"use client"`) และถูก import เป็น leaf เข้าไปใน
server component เดิม — `FeaturedStory` และหน้า `/stories/[slug]` ยังเป็น
server component เหมือนเดิม

## จุดที่แก้

### Hero — `FeaturedStory`

| ตรงไหน | ใช้อะไร | เหตุผล |
|---|---|---|
| ป้าย `HK-011` | `DecryptedText` (`animateOn="view"`) | charset จำกัดที่ `A-Z0-9-` ปลอดภัยกับไทย และเข้าธีมรหัสแฟ้ม |
| `ห้องเก็บผี` (Charmonman) | `ShinyText` | span เดียว ไทยไม่แตก จูน paper→ember เหมือนแสงกวาดผ่าน |

ปุ่ม CTA ไม่แตะ — มี ember glow อยู่แล้ว

### ชั้นวาง — `StoryCard`

`SpotlightCard` เป็นไฟล์ copy-in อยู่แล้ว จึงแก้ได้ตรงๆ:

- เพิ่ม prop `as` (ค่าเริ่มต้น `div`) ให้ render เป็น `<article>` ได้ —
  รักษา semantic เดิมและไม่เพิ่มชั้น DOM
- `spotlightColor` = `rgba(210, 101, 42, 0.14)` (ember จาง)
- เปิดเฉพาะ `pointer: fine` — มือถือไม่ต้องจ่ายค่า mousemove handler

### หน้าอ่านเรื่อง — `/stories/[slug]`

- บล็อกบันทึก: `whileInView` ของ `motion` เผยทั้งบล็อก ไม่แตะระดับตัวอักษร
- `HK-0xx` และความยาวคลิป (`43:02`): `DecryptedText` ตอน hover

### Background — `DustMotes` (เขียนเอง)

background ของ React Bits ทั้ง 47 ตัวเป็น WebGL หรือ canvas ไม่มี CSS ล้วน
ตัวเดียวที่ไม่มี dependency คือ `ShapeGrid` แต่เป็นตะแกรงสี่เหลี่ยมเลื่อนได้
ซึ่งตีกับธีมห้องเก็บของ

จึงเขียนเอง: ชั้นฝุ่นลอยช้าๆ สี `--dust` เป็น CSS ล้วน วางระหว่าง grain เดิม
(`body::before`) กับเนื้อหา ได้ไอเดียจาก `Particles` แต่ไม่มี dep ไม่มี canvas

## Accessibility

`SpotlightCard` **ไม่มี guard สำหรับ `prefers-reduced-motion`** มาให้ (React Bits
ระบุเองในเอกสาร) ต้องเพิ่มให้ ส่วน `motion` จัดการให้เองอยู่แล้ว

ทุก animation ใหม่ต้องต่อเข้ากับบล็อก `@media (prefers-reduced-motion: reduce)`
ที่มีอยู่แล้วใน `globals.css` และ `DustMotes` ต้องเป็น `aria-hidden`
กับ `pointer-events: none`

## เกณฑ์ว่าสำเร็จ

- `npm run build` ผ่าน ไม่มี type error
- ทุกหน้าเดิมยัง 200, slug มั่วยัง 404
- เปิด reduced motion แล้ว animation ใหม่หยุดหมด
- ธีมเดิมยังอ่านออกว่าเป็นห้องเก็บของ ไม่ใช่เว็บ effect

## ต้นทุน

+~34 KB gz (`motion`, tree-shake ได้) · ไฟล์ vendored 3 ไฟล์ + เขียนเอง 1
