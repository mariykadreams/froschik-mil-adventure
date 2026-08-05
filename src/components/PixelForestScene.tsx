const VIEW_W = 160;
const VIEW_H = 90;

// Hand-authored jagged ridge so peaks read as "pixel steps" rather than smooth curves.
const FAR_MOUNTAINS: [number, number][] = [
  [0, 58], [10, 58], [10, 52], [16, 52], [16, 45], [22, 45], [22, 37],
  [28, 37], [28, 45], [34, 45], [34, 52], [40, 52], [40, 58], [52, 58],
  [52, 50], [58, 50], [58, 41], [64, 41], [64, 34], [70, 34], [70, 43],
  [76, 43], [76, 50], [82, 50], [82, 58], [94, 58], [94, 48], [100, 48],
  [100, 39], [106, 39], [106, 30], [112, 30], [112, 40], [118, 40],
  [118, 50], [124, 50], [124, 58], [136, 58], [136, 52], [142, 52],
  [142, 44], [148, 44], [148, 37], [154, 37], [154, 48], [160, 48],
];

const SNOW_CAPS: [number, number][] = [
  [22, 37], [24, 41], [20, 41],
  [106, 30], [109, 35], [103, 35],
];

const CLOUDS = [
  { x: 8, y: 10, blocks: [[0, 2, 18, 4], [3, 0, 12, 3], [6, 5, 8, 3]] },
  { x: 62, y: 6, blocks: [[0, 2, 16, 4], [4, 0, 9, 3], [2, 5, 10, 3]] },
  { x: 118, y: 13, blocks: [[0, 2, 20, 4], [5, 0, 10, 3], [3, 5, 12, 3]] },
] as const;

const PINE_STEP = 8;
const pineRidge: [number, number][] = [[0, 74]];
for (let x = 0; x < VIEW_W; x += PINE_STEP) {
  pineRidge.push([x, 74], [x + PINE_STEP * 0.5, 62], [x + PINE_STEP, 74]);
}
pineRidge.push([VIEW_W, 90], [0, 90]);

export default function PixelForestScene() {
  return (
    <svg
      className="pixelated pixel-scene"
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMax slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x={0} y={0} width={VIEW_W} height={VIEW_H} fill="var(--scene-mid)" />

      {CLOUDS.map((cloud, i) => (
        <g key={i} fill="var(--scene-lightest)">
          {cloud.blocks.map(([bx, by, bw, bh], j) => (
            <rect key={j} x={cloud.x + bx} y={cloud.y + by} width={bw} height={bh} />
          ))}
        </g>
      ))}

      <polygon points={FAR_MOUNTAINS.map((p) => p.join(",")).join(" ")} fill="var(--scene-light)" />
      <polygon points={SNOW_CAPS.slice(0, 3).map((p) => p.join(",")).join(" ")} fill="var(--scene-lightest)" />
      <polygon points={SNOW_CAPS.slice(3, 6).map((p) => p.join(",")).join(" ")} fill="var(--scene-lightest)" />

      <polygon points={pineRidge.map((p) => p.join(",")).join(" ")} fill="var(--scene-dark)" />

      {/* foreground silhouette band */}
      <rect x={0} y={80} width={VIEW_W} height={10} fill="var(--scene-darkest)" />

      {/* winding ribbon path dots */}
      <g fill="var(--scene-lightest)">
        {[
          [14, 84], [22, 82], [30, 84], [40, 85], [50, 83], [60, 84],
          [72, 85], [84, 83], [96, 84], [108, 85], [120, 83], [132, 84],
          [144, 85], [154, 83],
        ].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width={2} height={2} />
        ))}
      </g>

      {/* tiny hooded traveler silhouette, bottom-left, echoing the reference art */}
      <g fill="var(--scene-darkest)">
        <rect x={24} y={72} width={6} height={2} />
        <rect x={25} y={70} width={4} height={2} />
        <rect x={26} y={68} width={3} height={2} />
        <rect x={22} y={74} width={10} height={6} />
        <rect x={31} y={68} width={1} height={12} />
        <rect x={30} y={66} width={3} height={2} />
      </g>
    </svg>
  );
}
