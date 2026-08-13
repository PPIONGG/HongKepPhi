/**
 * ชั้นฝุ่นลอยในห้อง — เขียนเอง ไม่ใช่ของ React Bits
 *
 * background ของ React Bits ทั้ง 47 ตัวเป็น WebGL หรือ canvas
 * ตัวนี้เป็น CSS ล้วน ไม่มี JS ไม่มี dependency จึงเป็น server component
 * ตำแหน่งถูก hardcode ไว้ (ไม่ใช้ Math.random) เพื่อไม่ให้ hydration ไม่ตรงกัน
 */

const motes = [
  { left: "6%", size: 3, delay: 0, duration: 26, drift: "14px" },
  { left: "14%", size: 2, delay: 6, duration: 34, drift: "-10px" },
  { left: "23%", size: 4, delay: 12, duration: 30, drift: "18px" },
  { left: "31%", size: 2, delay: 3, duration: 38, drift: "-16px" },
  { left: "42%", size: 3, delay: 18, duration: 28, drift: "12px" },
  { left: "50%", size: 2, delay: 9, duration: 36, drift: "-20px" },
  { left: "58%", size: 4, delay: 22, duration: 32, drift: "16px" },
  { left: "67%", size: 2, delay: 14, duration: 40, drift: "-12px" },
  { left: "75%", size: 3, delay: 5, duration: 29, drift: "20px" },
  { left: "84%", size: 2, delay: 20, duration: 35, drift: "-14px" },
  { left: "91%", size: 3, delay: 11, duration: 31, drift: "10px" },
  { left: "97%", size: 2, delay: 26, duration: 37, drift: "-18px" },
];

export function DustMotes() {
  return (
    <div aria-hidden className="dust-layer">
      {motes.map((mote, index) => (
        <span
          key={index}
          className="dust-mote"
          style={
            {
              left: mote.left,
              width: `${mote.size}px`,
              height: `${mote.size}px`,
              animationDelay: `-${mote.delay}s`,
              animationDuration: `${mote.duration}s`,
              "--drift": mote.drift,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
