#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
단독 실행 HTML 빌드 — app/홍보배차판.jsx 를 React와 함께 하나의 HTML로 번들.

결과: dist/홍보배차판_단독실행.html
  - 인터넷 없이 브라우저에서 더블클릭만 하면 열리는 단일 파일
  - 팀 공유(window.storage) 대신 브라우저 localStorage 에 저장(단독 실행용)

필요: node/npm (react·react-dom·esbuild 를 임시 폴더에 설치)
사용: python3 scripts/build_standalone.py
"""
import subprocess, tempfile, shutil, os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
APP = ROOT / "app" / "홍보배차판.jsx"
OUT = ROOT / "dist" / "홍보배차판_단독실행.html"

ENTRY = '''import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app.jsx";
// 단독 실행: 팀 공유 window.storage 를 브라우저 localStorage 로 대체.
if (!window.storage) {
  window.storage = {
    get: async (key) => ({ value: localStorage.getItem(key) }),
    set: async (key, value) => { localStorage.setItem(key, value); return { ok: true }; },
  };
}
createRoot(document.getElementById("root")).render(React.createElement(App));
'''

SHELL_HEAD = '''<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>홍보 배차판</title>
<style>
  :root { color-scheme: light; }
  html, body { margin: 0; background: #EEF1F4; }
  #root:empty::after {
    content: "앱 불러오는 중…";
    display: block; padding: 48px 20px; text-align: center;
    color: #5B7089; font: 500 15px/1.4 -apple-system, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
  }
  .standalone-note {
    position: fixed; right: 10px; bottom: 10px; z-index: 50;
    background: rgba(20,36,59,0.92); color: #EEF1F4;
    font: 600 11px/1.3 -apple-system, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
    padding: 6px 10px; border-radius: 8px; max-width: 220px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.18);
  }
  .standalone-note b { color: #E0912B; }
</style>
</head>
<body>
<div id="root"></div>
<div class="standalone-note">💾 <b>단독 실행판</b> · 저장은 이 브라우저에만(팀 동기화 아님)</div>
<script>
'''
SHELL_TAIL = "\n</script>\n</body>\n</html>\n"


def main():
    tmp = Path(tempfile.mkdtemp(prefix="hongbo-build-"))
    try:
        shutil.copy(APP, tmp / "app.jsx")
        (tmp / "entry.jsx").write_text(ENTRY, encoding="utf-8")
        (tmp / "package.json").write_text('{"name":"b","private":true,"version":"1.0.0"}', encoding="utf-8")
        print("의존성 설치 중(react·react-dom·esbuild)…")
        subprocess.run(["npm", "install", "react@18", "react-dom@18", "esbuild",
                        "--no-audit", "--no-fund", "--loglevel=error"], cwd=tmp, check=True)
        esbuild = tmp / "node_modules" / ".bin" / "esbuild"
        print("번들 생성 중…")
        subprocess.run([str(esbuild), "entry.jsx", "--bundle", "--loader:.jsx=jsx", "--minify",
                        "--define:process.env.NODE_ENV=\"production\"", "--format=iife",
                        "--outfile=app.bundle.js"], cwd=tmp, check=True)
        bundle = (tmp / "app.bundle.js").read_text(encoding="utf-8").replace("</script>", "<\\/script>")
        OUT.parent.mkdir(parents=True, exist_ok=True)
        OUT.write_text(SHELL_HEAD + bundle + SHELL_TAIL, encoding="utf-8")
        print(f"\n✔ 완료: {OUT}  ({OUT.stat().st_size // 1024} KB)")
        print("  브라우저에서 이 파일을 열면 인터넷 없이 앱이 실행됩니다.")
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    main()
