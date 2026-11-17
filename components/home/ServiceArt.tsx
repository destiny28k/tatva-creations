import type { ServiceArt as Kind } from "@/lib/types";
import s from "./ServiceArt.module.css";

const cx = (...names: string[]) => names.map((n) => s[n]).join(" ");
const d = (seconds: number) => ({ animationDelay: `${seconds}s` });

/** Small animated line illustration for each service, drawn in a 200 x 140 box. */
export default function ServiceArt({ kind }: { kind: Kind }) {
  return (
    <svg className={s.art} viewBox="0 0 200 140" aria-hidden="true">
      {ART[kind]}
    </svg>
  );
}

const ART: Record<Kind, React.ReactNode> = {
  concept: (
    <>
      <circle className={s.glow} cx="100" cy="58" r="40" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
        <line key={a} className={s.ray} style={d(i * 0.12)} x1="100" y1="10" x2="100" y2="2" transform={`rotate(${a} 100 58)`} />
      ))}
      <circle className={s.paper} cx="100" cy="56" r="26" />
      <path className={cx("line", "draw")} pathLength={1} d="M90 60 q5 -14 10 0 q5 14 10 0" stroke="#EF7D22" />
      <path className={s.line} d="M89 84 h22 M91 92 h18 M95 100 h10" />
      <path className={cx("line", "draw")} pathLength={1} style={d(0.6)} d="M140 108 l18 -30 l6 4 l-18 30 z" />
    </>
  ),
  packaging: (
    <>
      <rect className={cx("yellow", "pop")} x="88" y="44" width="24" height="30" rx="3" />
      <polygon className={cx("paper", "flapL")} points="62,62 100,62 100,52 70,52" />
      <polygon className={cx("paper", "flapR")} points="100,62 138,62 130,52 100,52" />
      <rect className={s.paper} x="62" y="62" width="76" height="58" rx="2" />
      <rect className={s.orange} x="62" y="84" width="76" height="12" />
      <circle className={s.navy} cx="100" cy="108" r="4" />
    </>
  ),
  print: (
    <>
      <rect className={s.paper} x="52" y="26" width="96" height="98" rx="4" />
      <rect className={s.navy} x="52" y="26" width="96" height="16" rx="4" />
      {[64, 80, 96, 112, 128].map((x) => <circle key={x} className={s.paper} cx={x} cy="26" r="4" />)}
      {[0, 1, 2, 3].map((r) => [0, 1, 2, 3, 4, 5].map((c) => <rect key={`${r}${c}`} className={r === 2 && c === 3 ? s.orange : s.cell} x={62 + c * 13} y={82 + r * 10} width="8" height="5" />))}
      <g>
        <rect className={cx("paper", "page")} x="52" y="42" width="96" height="36" />
        <rect className={cx("yellow", "page", "page2")} x="52" y="42" width="96" height="36" />
      </g>
    </>
  ),
  paper: (
    <>
      <polygon className={cx("paper", "leafL")} points="40,112 100,112 100,96 46,104" />
      <polygon className={cx("paper", "leafR")} points="100,112 160,112 154,104 100,96" />
      <g className={s.rise}>
        <polygon className={s.orange} points="74,112 100,52 126,112" />
        <polygon className={s.yellow} points="88,112 100,82 112,112" />
        <circle className={s.magenta} cx="100" cy="46" r="7" />
      </g>
      <line className={s.line} x1="34" y1="114" x2="166" y2="114" />
    </>
  ),
  production: (
    <>
      <g className={s.sheet}>
        <rect className={s.paper} x="40" y="64" width="60" height="16" />
        <circle fill="#00AEEF" cx="52" cy="72" r="3.5" />
        <circle fill="#EC008C" cx="62" cy="72" r="3.5" />
        <circle className={s.yellow} cx="72" cy="72" r="3.5" />
        <circle className={s.navy} cx="82" cy="72" r="3.5" />
      </g>
      <g className={s.roll}><circle className={s.paper} cx="100" cy="44" r="20" /><line className={s.line} x1="100" y1="24" x2="100" y2="64" /></g>
      <g className={s.roll}><circle className={s.paper} cx="100" cy="100" r="20" /><line className={s.line} x1="80" y1="100" x2="120" y2="100" /></g>
      <rect className={s.thin} x="30" y="20" width="140" height="104" rx="6" stroke="#23356B" />
    </>
  ),
  execution: (
    <>
      <line className={s.road} x1="10" y1="118" x2="190" y2="118" />
      <g className={s.truck}>
        <rect className={s.paper} x="36" y="56" width="82" height="46" rx="3" />
        <path className={s.paper} d="M118 70 h26 l16 16 v16 h-42 z" />
        <rect className={s.olive} x="36" y="56" width="82" height="10" rx="3" />
        <path className={s.check} pathLength={1} d="M64 82 l9 9 l17 -18" />
      </g>
      <g className={s.wheel}><circle className={s.navy} cx="62" cy="106" r="10" /><rect fill="#fff" x="60" y="98" width="4" height="16" /></g>
      <g className={s.wheel}><circle className={s.navy} cx="138" cy="106" r="10" /><rect fill="#fff" x="136" y="98" width="4" height="16" /></g>
    </>
  ),
  erp: (
    <>
      {[
        [40, 30], [160, 30], [30, 100], [170, 100], [100, 124],
      ].map(([x, y], i) => (
        <g key={i}>
          <path id={`erp-${i}`} className={s.thin} d={`M${x} ${y} L100 70`} />
          <circle className={s.orange} r="3.5">
            <animateMotion dur={`${1.6 + i * 0.25}s`} repeatCount="indefinite" path={`M${x} ${y} L100 70`} />
          </circle>
          <rect className={s.paper} x={x - 16} y={y - 11} width="32" height="22" rx="4" />
          <rect className={[s.navy, s.dot].join(" ")} style={d(i * 0.3)} x={x - 8} y={y - 2} width="16" height="4" rx="2" />
        </g>
      ))}
      <rect className={s.navy} x="80" y="52" width="40" height="36" rx="6" />
      <path d="M90 64 h20 M90 72 h20 M90 80 h12" stroke="#F5C518" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  web: (
    <>
      <rect className={s.paper} x="30" y="20" width="140" height="100" rx="6" />
      <line className={s.line} x1="30" y1="36" x2="170" y2="36" />
      {[42, 52, 62].map((x) => <circle key={x} className={s.orange} cx={x} cy="28" r="3" />)}
      <rect className={cx("navy", "block")} x="42" y="46" width="116" height="26" rx="3" />
      <rect className={cx("yellow", "block")} style={d(0.3)} x="42" y="78" width="36" height="30" rx="3" />
      <rect className={cx("olive", "block")} style={d(0.5)} x="82" y="78" width="36" height="30" rx="3" />
      <rect className={cx("magenta", "block")} style={d(0.7)} x="122" y="78" width="36" height="30" rx="3" />
      <path className={cx("navy", "cursor")} d="M150 112 l0 -22 l16 15 l-8 1 l5 9 l-4 2 l-5 -9 z" stroke="#fff" strokeWidth="1.5" />
    </>
  ),
  marketing: (
    <>
      <line className={s.line} x1="34" y1="118" x2="170" y2="118" />
      {[
        [44, 40], [70, 58], [96, 52], [122, 76], [148, 92],
      ].map(([x, h], i) => (
        <rect key={x} className={[i === 4 ? s.orange : s.navy, s.bar].join(" ")} style={d(i * 0.15)} x={x} y={118 - h} width="18" height={h} rx="2" />
      ))}
      <path className={s.trend} pathLength={1} d="M40 84 L66 70 L92 74 L118 50 L150 26 l-12 0 m12 0 l0 12" />
    </>
  ),
  social: (
    <>
      <rect className={s.paper} x="68" y="14" width="64" height="114" rx="10" />
      <clipPath id="svc-phone"><rect x="72" y="26" width="56" height="92" rx="4" /></clipPath>
      <g clipPath="url(#svc-phone)">
        <g className={s.feed}>
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <rect className={[s.yellow, s.navy, s.orange, s.olive, s.magenta][i]} x="76" y={28 + i * 34} width="48" height="22" rx="3" />
              <rect className={s.cell} x="76" y={53 + i * 34} width="30" height="3" />
            </g>
          ))}
        </g>
      </g>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${142 + i * 10} ${96 - i * 6})`}>
          <path className={[s.magenta, s.heart].join(" ")} style={d(i * 0.8)} d="M0 3 c0 -4 6 -4 6 0 c0 -4 6 -4 6 0 c0 4 -6 8 -6 8 c0 0 -6 -4 -6 -8 z" />
        </g>
      ))}
    </>
  ),
};
