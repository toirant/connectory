import localFont from "next/font/local";
export const display = localFont({ variable: "--f-display", display: "swap", src: [{ path: "./fonts/is-400.woff2", weight: "400", style: "normal" }, { path: "./fonts/is-400i.woff2", weight: "400", style: "italic" }] });
export const serif = localFont({ variable: "--f-serif", display: "swap", src: [{ path: "./fonts/ss-400.woff2", weight: "400", style: "normal" }, { path: "./fonts/ss-600.woff2", weight: "600", style: "normal" }, { path: "./fonts/ss-400i.woff2", weight: "400", style: "italic" }] });
export const sans = localFont({ variable: "--f-sans", display: "swap", src: [{ path: "./fonts/ps-400.woff2", weight: "400" }, { path: "./fonts/ps-600.woff2", weight: "600" }] });
export const mono = localFont({ variable: "--f-mono", display: "swap", src: [{ path: "./fonts/pm-400.woff2", weight: "400" }, { path: "./fonts/pm-500.woff2", weight: "500" }] });
