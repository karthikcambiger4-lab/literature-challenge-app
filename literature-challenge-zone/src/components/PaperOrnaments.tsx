export function PaperOrnaments() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      {/* Top-right delicate feather quill silhouette */}
      <svg
        className="absolute -top-6 -right-6 w-64 h-64 text-[#7C6A4E] opacity-[0.06]"
        viewBox="0 0 200 200"
        fill="none"
      >
        <path
          d="M168 24C128 38 92 74 68 122L54 152L46 174L68 164L96 148C136 120 162 78 168 24Z"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M46 174C82 130 124 84 166 26"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M108 86L134 78M92 108L122 102M78 128L104 125"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Bottom-left subtle open book pages */}
      <svg
        className="absolute -bottom-8 -left-8 w-72 h-72 text-[#7C6A4E] opacity-[0.06]"
        viewBox="0 0 220 220"
        fill="none"
      >
        <path
          d="M28 70C54 58 84 62 110 80C136 62 166 58 192 70V168C166 156 136 160 110 176C84 160 54 156 28 168V70Z"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M110 80V176"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M46 92C64 86 82 88 96 96M46 112C64 106 82 108 96 116M46 132C64 126 82 128 96 136"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M124 96C138 88 156 86 174 92M124 116C138 108 156 106 174 112M124 136C138 128 156 126 174 132"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Subtle corner double-rule framing for editorial paper feel */}
      <div className="hidden lg:block absolute inset-4 border border-[#D8CCB6]/45 rounded-2xl" />
    </div>
  );
}
