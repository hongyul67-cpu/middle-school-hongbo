#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
학교 좌표 자동 채우기(베스트에포트) — OpenStreetMap Nominatim(키 불필요) 사용.

주의:
  - 외부 네트워크가 열린 환경에서만 동작한다(이 프로젝트의 웹 세션 프록시는 차단될 수 있음).
  - 한국 중학교 좌표 정확도는 100%가 아니다. 결과의 'match' 열로 검수할 것.
  - 예의상 초당 1건으로 제한한다(Nominatim 정책).

동작:
  data/학교_주소좌표_입력용.csv 를 읽어 비어 있는 위도/경도를 채워 같은 파일에 저장.
  이미 채워진 행은 건너뛴다.

사용:
  python3 scripts/geocode.py            # 전체 시도
  python3 scripts/geocode.py --limit 10 # 앞 10개만(테스트)

이후 반영:
  python3 scripts/rebuild_data.py --write
"""
import csv, sys, time, json, urllib.parse, urllib.request
from pathlib import Path

GEO_CSV = Path(__file__).resolve().parent.parent / "data" / "학교_주소좌표_입력용.csv"
UA = "middle-school-hongbo/1.0 (school outreach tool; contact: admin)"


def geocode(name, region, sido):
    q = f"{name} {region} {sido}"
    url = "https://nominatim.openstreetmap.org/search?" + urllib.parse.urlencode(
        {"format": "jsonv2", "limit": 1, "countrycodes": "kr", "q": q}
    )
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=20) as r:
        data = json.load(r)
    if not data:
        return None
    top = data[0]
    return {
        "lat": round(float(top["lat"]), 6),
        "lng": round(float(top["lon"]), 6),
        "addr": top.get("display_name", ""),
        # 결과 이름에 학교명이 들어가면 신뢰도 높음
        "match": name in top.get("display_name", ""),
    }


def main():
    limit = None
    if "--limit" in sys.argv:
        limit = int(sys.argv[sys.argv.index("--limit") + 1])

    with open(GEO_CSV, encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))
        fields = list(rows[0].keys()) if rows else []
    if "match" not in fields:
        fields.append("match")

    def col(*cands):
        for c in cands:
            for k in fields:
                if k and c in k:
                    return k
        return None

    kN, kG, kS = col("학교명"), col("지역"), col("시도")
    kLat, kLng, kAddr = col("위도", "lat"), col("경도", "lng"), col("주소")

    done = 0
    for i, r in enumerate(rows):
        if limit and done >= limit:
            break
        if (r.get(kLat) or "").strip() and (r.get(kLng) or "").strip():
            continue  # 이미 채워짐
        name = (r.get(kN) or "").strip()
        if not name:
            continue
        try:
            g = geocode(name, (r.get(kG) or "").strip(), (r.get(kS) or "").strip())
        except Exception as e:
            print(f"  ! {name}: {e}")
            g = None
        if g:
            r[kLat], r[kLng] = g["lat"], g["lng"]
            if kAddr and not (r.get(kAddr) or "").strip():
                r[kAddr] = g["addr"]
            r["match"] = "O" if g["match"] else "확인필요"
            print(f"  {name}: {g['lat']},{g['lng']}  {'O' if g['match'] else '검수'}")
        else:
            r["match"] = "실패"
            print(f"  {name}: 결과 없음")
        done += 1
        time.sleep(1.1)  # Nominatim 예의상 제한

    with open(GEO_CSV, "w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        w.writerows(rows)
    print(f"\n완료: {done}건 처리 → {GEO_CSV}")
    print("검수 후: python3 scripts/rebuild_data.py --write")


if __name__ == "__main__":
    main()
