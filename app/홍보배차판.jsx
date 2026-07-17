import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";

/* ===== 데이터 (개인정보 제외: 교사·학생 이름 없음) ===== */
const SCHOOLS = [{"n": "북서울중학교", "g": "도봉구", "s": "서울시", "y3": 15.0, "y26": 14.0, "c3": 5.0, "st": 113.0, "d": "전기", "sc": 75.0, "t": "상"}, {"n": "풍양중학교", "g": "남양주시", "s": "경기도", "y3": 18.0, "y26": 5.0, "c3": 13.0, "st": null, "d": "재료", "sc": 58.8, "t": "상"}, {"n": "월계중학교", "g": "노원구", "s": "서울시", "y3": 12.0, "y26": 8.0, "c3": 4.0, "st": 100.0, "d": "재료", "sc": 50.4, "t": "상"}, {"n": "장안중학교", "g": "중랑구", "s": "서울시", "y3": 13.0, "y26": 5.0, "c3": 6.0, "st": 141.0, "d": "하이텍", "sc": 44.6, "t": "상"}, {"n": "방학중학교", "g": "도봉구", "s": "서울시", "y3": 12.0, "y26": 5.0, "c3": 6.0, "st": null, "d": "설비", "sc": 42.6, "t": "상"}, {"n": "공릉중학교", "g": "노원구", "s": "서울시", "y3": 9.0, "y26": 6.0, "c3": 6.0, "st": null, "d": "메카", "sc": 39.6, "t": "상"}, {"n": "갈매중학교", "g": "구리시", "s": "경기도", "y3": 15.0, "y26": 1.0, "c3": 11.0, "st": null, "d": "하이텍", "sc": 39.6, "t": "상"}, {"n": "별가람중학교", "g": "남양주시", "s": "경기도", "y3": 11.0, "y26": 4.0, "c3": 9.0, "st": null, "d": "전기", "sc": 39.4, "t": "상"}, {"n": "오남중학교", "g": "남양주시", "s": "경기도", "y3": 11.0, "y26": 4.0, "c3": 5.0, "st": null, "d": "전기", "sc": 37.0, "t": "상"}, {"n": "원묵중학교", "g": "중랑구", "s": "서울시", "y3": 9.0, "y26": 4.0, "c3": 9.0, "st": null, "d": "설비", "sc": 35.4, "t": "상"}, {"n": "인창중학교", "g": "구리시", "s": "경기도", "y3": 11.0, "y26": 2.0, "c3": 11.0, "st": null, "d": "하이텍", "sc": 34.6, "t": "상"}, {"n": "심석중학교", "g": "남양주시", "s": "경기도", "y3": 14.0, "y26": 0.0, "c3": 9.0, "st": null, "d": "", "sc": 33.4, "t": "상"}, {"n": "상봉중학교", "g": "중랑구", "s": "서울시", "y3": 8.0, "y26": 4.0, "c3": 8.0, "st": null, "d": "전기", "sc": 32.8, "t": "상"}, {"n": "남양주다산중학교", "g": "남양주시", "s": "경기도", "y3": 12.0, "y26": 0.0, "c3": 13.0, "st": null, "d": "재료", "sc": 31.8, "t": "상"}, {"n": "중화중학교", "g": "중랑구", "s": "서울시", "y3": 11.0, "y26": 2.0, "c3": 6.0, "st": null, "d": "재료", "sc": 31.6, "t": "상"}, {"n": "한천중학교", "g": "노원구", "s": "서울시", "y3": 10.0, "y26": 2.0, "c3": 7.0, "st": null, "d": "전기", "sc": 30.2, "t": "상"}, {"n": "하계중학교", "g": "노원구", "s": "서울시", "y3": 9.0, "y26": 2.0, "c3": 8.0, "st": null, "d": "하이텍", "sc": 28.8, "t": "상"}, {"n": "석관중학교", "g": "성북구", "s": "서울시", "y3": 9.0, "y26": 2.0, "c3": 8.0, "st": null, "d": "인문", "sc": 28.8, "t": "상"}, {"n": "태릉중학교", "g": "중랑구", "s": "서울시", "y3": 10.0, "y26": 2.0, "c3": 4.0, "st": null, "d": "전자", "sc": 28.4, "t": "상"}, {"n": "용곡중학교", "g": "광진구", "s": "서울시", "y3": 9.0, "y26": 2.0, "c3": 7.0, "st": null, "d": "재료", "sc": 28.2, "t": "상"}, {"n": "남대문중학교", "g": "성북구", "s": "서울시", "y3": 9.0, "y26": 2.0, "c3": 7.0, "st": null, "d": "재료", "sc": 28.2, "t": "상"}, {"n": "동국대학교사범대학부속중학교", "g": "동대문구", "s": "서울시", "y3": 8.0, "y26": 4.0, "c3": null, "st": null, "d": "메카", "sc": 28.0, "t": "상"}, {"n": "휘경중학교", "g": "동대문구", "s": "서울시", "y3": 8.0, "y26": 3.0, "c3": 4.0, "st": null, "d": "드론", "sc": 27.4, "t": "상"}, {"n": "평내중학교", "g": "남양주시", "s": "경기도", "y3": 10.0, "y26": 1.0, "c3": 7.0, "st": null, "d": "재료", "sc": 27.2, "t": "상"}, {"n": "노일중학교", "g": "노원구", "s": "서울시", "y3": 6.0, "y26": 4.0, "c3": 5.0, "st": null, "d": "드론", "sc": 27.0, "t": "상"}, {"n": "광장중학교", "g": "광진구", "s": "서울시", "y3": 5.0, "y26": 4.0, "c3": 8.0, "st": null, "d": "메카", "sc": 26.8, "t": "상"}, {"n": "동구중학교", "g": "구리시", "s": "경기도", "y3": 6.0, "y26": 3.0, "c3": 9.0, "st": null, "d": "전기", "sc": 26.4, "t": "상"}, {"n": "도봉중학교", "g": "도봉구", "s": "서울시", "y3": 7.0, "y26": 3.0, "c3": 4.0, "st": null, "d": "설비", "sc": 25.4, "t": "상"}, {"n": "화광중학교", "g": "남양주시", "s": "경기도", "y3": 8.0, "y26": 2.0, "c3": 4.0, "st": null, "d": "", "sc": 24.4, "t": "상"}, {"n": "재현중학교", "g": "노원구", "s": "서울시", "y3": 5.0, "y26": 3.0, "c3": 8.0, "st": null, "d": "전기", "sc": 23.8, "t": "상"}, {"n": "청원중학교", "g": "노원구", "s": "서울시", "y3": 5.0, "y26": 3.0, "c3": 7.0, "st": null, "d": "하이텍", "sc": 23.2, "t": "상"}, {"n": "면목중학교", "g": "중랑구", "s": "서울시", "y3": 8.0, "y26": 1.0, "c3": 6.0, "st": null, "d": "하이텍", "sc": 22.6, "t": "상"}, {"n": "신도봉중학교", "g": "도봉구", "s": "서울시", "y3": 5.0, "y26": 3.0, "c3": 6.0, "st": null, "d": "전기", "sc": 22.6, "t": "상"}, {"n": "별내중학교", "g": "남양주시", "s": "경기도", "y3": 5.0, "y26": 3.0, "c3": 6.0, "st": null, "d": "설계", "sc": 22.6, "t": "상"}, {"n": "동원중학교", "g": "중랑구", "s": "서울시", "y3": 6.0, "y26": 2.0, "c3": 7.0, "st": null, "d": "메카", "sc": 22.2, "t": "상"}, {"n": "녹천중학교", "g": "노원구", "s": "서울시", "y3": 5.0, "y26": 3.0, "c3": 5.0, "st": null, "d": "자동화", "sc": 22.0, "t": "상"}, {"n": "백운중학교", "g": "도봉구", "s": "서울시", "y3": 5.0, "y26": 3.0, "c3": 5.0, "st": null, "d": "하이텍", "sc": 22.0, "t": "상"}, {"n": "퇴계원중학교", "g": "남양주시", "s": "경기도", "y3": 7.0, "y26": 1.0, "c3": 8.0, "st": null, "d": "인문", "sc": 21.8, "t": "상"}, {"n": "금곡중학교", "g": "남양주시", "s": "경기도", "y3": 7.0, "y26": 2.0, "c3": 3.0, "st": null, "d": "설계", "sc": 21.8, "t": "상"}, {"n": "동구중학교", "g": "구리시", "s": "경기도", "y3": 5.0, "y26": 2.0, "c3": 9.0, "st": null, "d": "", "sc": 21.4, "t": "상"}, {"n": "중원중학교", "g": "노원구", "s": "서울시", "y3": 6.0, "y26": 2.0, "c3": 5.0, "st": null, "d": "설비", "sc": 21.0, "t": "상"}, {"n": "마석중학교", "g": "남양주시", "s": "경기도", "y3": 7.0, "y26": 0.0, "c3": 11.0, "st": null, "d": "", "sc": 20.6, "t": "상"}, {"n": "한별중학교", "g": "남양주시", "s": "경기도", "y3": 3.0, "y26": 3.0, "c3": 8.0, "st": null, "d": "", "sc": 19.8, "t": "상"}, {"n": "신현중학교", "g": "중랑구", "s": "서울시", "y3": 7.0, "y26": 1.0, "c3": 4.0, "st": null, "d": "메카", "sc": 19.4, "t": "상"}, {"n": "능곡중학교", "g": "고양시", "s": "경기도", "y3": 3.0, "y26": 3.0, "c3": 6.0, "st": null, "d": "", "sc": 18.6, "t": "상"}, {"n": "구리중학교", "g": "구리시", "s": "경기도", "y3": 5.0, "y26": 2.0, "c3": 3.0, "st": null, "d": "드론", "sc": 17.8, "t": "상"}, {"n": "노원중학교", "g": "노원구", "s": "서울시", "y3": 7.0, "y26": 0.0, "c3": 5.0, "st": null, "d": "드론", "sc": 17.0, "t": "상"}, {"n": "용마중학교", "g": "중랑구", "s": "서울시", "y3": 4.0, "y26": 2.0, "c3": 5.0, "st": null, "d": "전자", "sc": 17.0, "t": "상"}, {"n": "도농중학교", "g": "남양주시", "s": "경기도", "y3": 6.0, "y26": 0.0, "c3": 8.0, "st": null, "d": "재료", "sc": 16.8, "t": "중"}, {"n": "상계중", "g": "노원구", "s": "서울시", "y3": 5.0, "y26": 1.0, "c3": 6.0, "st": null, "d": "드론", "sc": 16.6, "t": "중"}, {"n": "고덕중학교", "g": "강동구", "s": "서울시", "y3": 2.0, "y26": 1.0, "c3": 16.0, "st": null, "d": "하이텍", "sc": 16.6, "t": "중"}, {"n": "판곡중학교", "g": "남양주시", "s": "경기도", "y3": 5.0, "y26": 0.0, "c3": 10.0, "st": null, "d": "", "sc": 16.0, "t": "중"}, {"n": "진건중학교", "g": "남양주시", "s": "경기도", "y3": 5.0, "y26": 1.0, "c3": 5.0, "st": null, "d": "", "sc": 16.0, "t": "중"}, {"n": "진접중학교", "g": "남양주시", "s": "경기도", "y3": 4.0, "y26": 1.0, "c3": 8.0, "st": null, "d": "", "sc": 15.8, "t": "중"}, {"n": "봉화중", "g": "중랑구", "s": "서울시", "y3": 5.0, "y26": 1.0, "c3": 4.0, "st": null, "d": "메카", "sc": 15.4, "t": "중"}, {"n": "옥빛중학교", "g": "양주시", "s": "경기도", "y3": 3.0, "y26": 0.0, "c3": 15.0, "st": null, "d": "", "sc": 15.0, "t": "중"}, {"n": "어람중학교", "g": "남양주시", "s": "경기도", "y3": 5.0, "y26": 0.0, "c3": 8.0, "st": null, "d": "전자", "sc": 14.8, "t": "중"}, {"n": "불암중학교", "g": "노원구", "s": "서울시", "y3": 2.0, "y26": 1.0, "c3": 11.0, "st": null, "d": "자동화", "sc": 13.6, "t": "중"}, {"n": "서라벌중학교", "g": "강북구", "s": "서울시", "y3": 4.0, "y26": 1.0, "c3": 4.0, "st": null, "d": "", "sc": 13.4, "t": "중"}, {"n": "솔샘중학교", "g": "강북구", "s": "서울시", "y3": 4.0, "y26": 1.0, "c3": 4.0, "st": null, "d": "", "sc": 13.4, "t": "중"}, {"n": "양오중학교", "g": "남양주시", "s": "경기도", "y3": 3.0, "y26": 1.0, "c3": 7.0, "st": null, "d": "", "sc": 13.2, "t": "중"}, {"n": "상명중학교", "g": "노원구", "s": "서울시", "y3": 2.0, "y26": 1.0, "c3": 9.0, "st": null, "d": "설비", "sc": 12.4, "t": "중"}, {"n": "중평중학교", "g": "노원구", "s": "서울시", "y3": 2.0, "y26": 1.0, "c3": 9.0, "st": null, "d": "전자", "sc": 12.4, "t": "중"}, {"n": "미금중학교", "g": "남양주시", "s": "경기도", "y3": 2.0, "y26": 2.0, "c3": 4.0, "st": null, "d": "", "sc": 12.4, "t": "중"}, {"n": "상계제일중학교", "g": "노원구", "s": "서울시", "y3": 4.0, "y26": 0.0, "c3": 7.0, "st": null, "d": "드론", "sc": 12.2, "t": "중"}, {"n": "창일중학교", "g": "도봉구", "s": "서울시", "y3": 4.0, "y26": 0.0, "c3": 7.0, "st": null, "d": "", "sc": 12.2, "t": "중"}, {"n": "청림중학교", "g": "화성시", "s": "경기도", "y3": 1.0, "y26": 1.0, "c3": 12.0, "st": null, "d": "", "sc": 12.2, "t": "중"}, {"n": "중계중학교", "g": "노원구", "s": "서울시", "y3": 3.0, "y26": 0.0, "c3": 10.0, "st": null, "d": "자동화", "sc": 12.0, "t": "중"}, {"n": "호평중학교", "g": "남양주시", "s": "경기도", "y3": 1.0, "y26": 1.0, "c3": 11.0, "st": null, "d": "", "sc": 11.6, "t": "중"}, {"n": "경희중학교", "g": "동대문구", "s": "서울시", "y3": 2.0, "y26": 1.0, "c3": 7.0, "st": null, "d": "드론", "sc": 11.2, "t": "중"}, {"n": "옥정중학교", "g": "양주시", "s": "경기도", "y3": 1.0, "y26": 1.0, "c3": 10.0, "st": null, "d": "", "sc": 11.0, "t": "중"}, {"n": "산내중학교", "g": "파주시", "s": "경기도", "y3": 1.0, "y26": 1.0, "c3": 10.0, "st": null, "d": "", "sc": 11.0, "t": "중"}, {"n": "광릉중학교", "g": "남양주시", "s": "경기도", "y3": 3.0, "y26": 1.0, "c3": 3.0, "st": null, "d": "", "sc": 10.8, "t": "중"}, {"n": "번동중학교", "g": "강북구", "s": "서울시", "y3": 2.0, "y26": 1.0, "c3": 6.0, "st": null, "d": "", "sc": 10.6, "t": "중"}, {"n": "신방학중학교", "g": "도봉구", "s": "서울시", "y3": 2.0, "y26": 1.0, "c3": 6.0, "st": null, "d": "", "sc": 10.6, "t": "중"}, {"n": "삼숭중학교", "g": "양주시", "s": "경기도", "y3": 2.0, "y26": 0.0, "c3": 11.0, "st": null, "d": "", "sc": 10.6, "t": "중"}, {"n": "다산새봄중학교", "g": "남양주시", "s": "경기도", "y3": 2.0, "y26": 0.0, "c3": 11.0, "st": null, "d": "재료", "sc": 10.6, "t": "중"}, {"n": "토평중학교", "g": "구리시", "s": "경기도", "y3": 2.0, "y26": 1.0, "c3": 6.0, "st": null, "d": "", "sc": 10.6, "t": "중"}, {"n": "자양중학교", "g": "광진구", "s": "서울시", "y3": 1.0, "y26": 1.0, "c3": 9.0, "st": null, "d": "", "sc": 10.4, "t": "중"}, {"n": "장내중학교", "g": "남양주시", "s": "경기도", "y3": 1.0, "y26": 1.0, "c3": 9.0, "st": null, "d": "", "sc": 10.4, "t": "중"}, {"n": "덕계중학교", "g": "양주시", "s": "경기도", "y3": 1.0, "y26": 1.0, "c3": 9.0, "st": null, "d": "", "sc": 10.4, "t": "중"}, {"n": "광동중학교", "g": "남양주시", "s": "경기도", "y3": 3.0, "y26": 0.0, "c3": 7.0, "st": null, "d": "", "sc": 10.2, "t": "중"}, {"n": "충의중학교", "g": "의정부시", "s": "경기도", "y3": 2.0, "y26": 0.0, "c3": 10.0, "st": null, "d": "", "sc": 10.0, "t": "중"}, {"n": "을지중학교", "g": "노원구", "s": "서울시", "y3": 1.0, "y26": 1.0, "c3": 8.0, "st": null, "d": "", "sc": 9.8, "t": "중"}, {"n": "와부중학교", "g": "남양주시", "s": "경기도", "y3": 1.0, "y26": 1.0, "c3": 8.0, "st": null, "d": "", "sc": 9.8, "t": "중"}, {"n": "양주백석중학교", "g": "양주시", "s": "경기도", "y3": 1.0, "y26": 1.0, "c3": 8.0, "st": null, "d": "", "sc": 9.8, "t": "중"}, {"n": "교문중학교", "g": "구리시", "s": "경기도", "y3": 3.0, "y26": 0.0, "c3": 6.0, "st": null, "d": "", "sc": 9.6, "t": "중"}, {"n": "효문중학교", "g": "도봉구", "s": "서울시", "y3": 2.0, "y26": 1.0, "c3": 4.0, "st": null, "d": "", "sc": 9.4, "t": "중"}, {"n": "송라중학교", "g": "남양주시", "s": "경기도", "y3": 2.0, "y26": 0.0, "c3": 9.0, "st": null, "d": "", "sc": 9.4, "t": "중"}, {"n": "강동중학교", "g": "강동구", "s": "서울시", "y3": 1.0, "y26": 1.0, "c3": 7.0, "st": null, "d": "", "sc": 9.2, "t": "중"}, {"n": "성남서중학교", "g": "성남시", "s": "경기도", "y3": 1.0, "y26": 1.0, "c3": 7.0, "st": null, "d": "", "sc": 9.2, "t": "중"}, {"n": "광양중학교", "g": "광진구", "s": "서울시", "y3": 3.0, "y26": 0.0, "c3": 5.0, "st": null, "d": "메카", "sc": 9.0, "t": "중"}, {"n": "예봉중학교", "g": "남양주시", "s": "경기도", "y3": 2.0, "y26": 0.0, "c3": 8.0, "st": null, "d": "", "sc": 8.8, "t": "중"}, {"n": "상경중학교", "g": "노원구", "s": "서울시", "y3": 1.0, "y26": 1.0, "c3": 6.0, "st": null, "d": "전자", "sc": 8.6, "t": "중"}, {"n": "온곡중학교", "g": "노원구", "s": "서울시", "y3": 1.0, "y26": 1.0, "c3": 6.0, "st": null, "d": "전자", "sc": 8.6, "t": "중"}, {"n": "개봉중학교", "g": "구로구", "s": "서울시", "y3": 1.0, "y26": 1.0, "c3": 6.0, "st": null, "d": "", "sc": 8.6, "t": "중"}, {"n": "덕현중학교", "g": "양주시", "s": "경기도", "y3": 1.0, "y26": 0.0, "c3": 11.0, "st": null, "d": "", "sc": 8.6, "t": "중"}, {"n": "장자중학교", "g": "구리시", "s": "경기도", "y3": 1.0, "y26": 1.0, "c3": 6.0, "st": null, "d": "", "sc": 8.6, "t": "중"}, {"n": "성사중학교", "g": "고양시", "s": "경기도", "y3": 1.0, "y26": 1.0, "c3": 6.0, "st": null, "d": "", "sc": 8.6, "t": "중"}, {"n": "수송중학교", "g": "강북구", "s": "서울시", "y3": 3.0, "y26": 0.0, "c3": 4.0, "st": null, "d": "하이텍", "sc": 8.4, "t": "하"}, {"n": "주곡중학교", "g": "남양주시", "s": "경기도", "y3": 2.0, "y26": 0.0, "c3": 7.0, "st": null, "d": "", "sc": 8.2, "t": "하"}, {"n": "수락중학교", "g": "노원구", "s": "서울시", "y3": 1.0, "y26": 1.0, "c3": 5.0, "st": null, "d": "전자", "sc": 8.0, "t": "하"}, {"n": "염광중학교", "g": "노원구", "s": "서울시", "y3": 1.0, "y26": 1.0, "c3": 5.0, "st": null, "d": "", "sc": 8.0, "t": "하"}, {"n": "송양중학교", "g": "의정부시", "s": "경기도", "y3": 1.0, "y26": 0.0, "c3": 10.0, "st": null, "d": "", "sc": 8.0, "t": "하"}, {"n": "솔뫼중학교", "g": "의정부시", "s": "경기도", "y3": 1.0, "y26": 1.0, "c3": 5.0, "st": null, "d": "", "sc": 8.0, "t": "하"}, {"n": "천마중학교", "g": "남양주시", "s": "경기도", "y3": 2.0, "y26": 0.0, "c3": 6.0, "st": null, "d": "", "sc": 7.6, "t": "하"}, {"n": "선덕중학교", "g": "도봉구", "s": "서울시", "y3": 1.0, "y26": 0.0, "c3": 9.0, "st": null, "d": "", "sc": 7.4, "t": "하"}, {"n": "장위중학교", "g": "성북구", "s": "서울시", "y3": 1.0, "y26": 0.0, "c3": 9.0, "st": null, "d": "드론", "sc": 7.4, "t": "하"}, {"n": "상원중학교", "g": "노원구", "s": "서울시", "y3": 2.0, "y26": 0.0, "c3": 5.0, "st": null, "d": "", "sc": 7.0, "t": "하"}, {"n": "동대문중학교", "g": "동대문구", "s": "서울시", "y3": 1.0, "y26": 0.0, "c3": 8.0, "st": null, "d": "", "sc": 6.8, "t": "하"}, {"n": "남문중학교", "g": "양주시", "s": "경기도", "y3": 1.0, "y26": 1.0, "c3": 3.0, "st": null, "d": "", "sc": 6.8, "t": "하"}, {"n": "성일중학교", "g": "동대문구", "s": "서울시", "y3": 2.0, "y26": 0.0, "c3": 4.0, "st": null, "d": "", "sc": 6.4, "t": "하"}, {"n": "신일중학교", "g": "강북구", "s": "서울시", "y3": 2.0, "y26": 0.0, "c3": 4.0, "st": null, "d": "", "sc": 6.4, "t": "하"}, {"n": "태랑중학교", "g": "노원구", "s": "서울시", "y3": 1.0, "y26": 0.0, "c3": 7.0, "st": null, "d": "", "sc": 6.2, "t": "하"}, {"n": "창동중학교", "g": "도봉구", "s": "서울시", "y3": 1.0, "y26": 0.0, "c3": 7.0, "st": null, "d": "", "sc": 6.2, "t": "하"}, {"n": "동화중학교", "g": "남양주시", "s": "경기도", "y3": 1.0, "y26": 0.0, "c3": 7.0, "st": null, "d": "설계", "sc": 6.2, "t": "하"}, {"n": "장평중학교", "g": "동대문구", "s": "서울시", "y3": 0.0, "y26": 0.0, "c3": 10.0, "st": null, "d": "", "sc": 6.0, "t": "하"}, {"n": "길음중학교", "g": "성북구", "s": "서울시", "y3": 0.0, "y26": 0.0, "c3": 10.0, "st": null, "d": "", "sc": 6.0, "t": "하"}, {"n": "가운중학교", "g": "남양주시", "s": "경기도", "y3": 2.0, "y26": 0.0, "c3": 3.0, "st": null, "d": "설계", "sc": 5.8, "t": "하"}, {"n": "수유중학교", "g": "강북구", "s": "서울시", "y3": 1.0, "y26": 0.0, "c3": 6.0, "st": null, "d": "", "sc": 5.6, "t": "하"}, {"n": "구의중학교", "g": "광진구", "s": "서울시", "y3": 1.0, "y26": 0.0, "c3": 6.0, "st": null, "d": "", "sc": 5.6, "t": "하"}, {"n": "다산한강중학교", "g": "남양주시", "s": "경기도", "y3": 0.0, "y26": 0.0, "c3": 9.0, "st": null, "d": "", "sc": 5.4, "t": "하"}, {"n": "수동중학교", "g": "남양주시", "s": "경기도", "y3": 2.0, "y26": 0.0, "c3": 2.0, "st": null, "d": "", "sc": 5.2, "t": "하"}, {"n": "인수중학교", "g": "강북구", "s": "서울시", "y3": 1.0, "y26": 0.0, "c3": 5.0, "st": null, "d": "", "sc": 5.0, "t": "하"}, {"n": "숭곡중학교", "g": "성북구", "s": "서울시", "y3": 0.0, "y26": 0.0, "c3": 8.0, "st": null, "d": "", "sc": 4.8, "t": "하"}, {"n": "동암중학교", "g": "의정부시", "s": "경기도", "y3": 0.0, "y26": 0.0, "c3": 8.0, "st": null, "d": "", "sc": 4.8, "t": "하"}, {"n": "화접중학교", "g": "남양주시", "s": "경기도", "y3": 0.0, "y26": 0.0, "c3": 8.0, "st": null, "d": "", "sc": 4.8, "t": "하"}, {"n": "노곡중학교", "g": "도봉구", "s": "서울시", "y3": 1.0, "y26": 0.0, "c3": 4.0, "st": null, "d": "전자", "sc": 4.4, "t": "하"}, {"n": "태랑중학교", "g": "노원구", "s": "서울시", "y3": null, "y26": null, "c3": 7.0, "st": null, "d": "", "sc": 4.2, "t": "하"}, {"n": "덕소중학교", "g": "남양주시", "s": "경기도", "y3": 0.0, "y26": 0.0, "c3": 7.0, "st": null, "d": "", "sc": 4.2, "t": "하"}, {"n": "창북중학교", "g": "도봉구", "s": "서울시", "y3": 0.0, "y26": 0.0, "c3": 6.0, "st": null, "d": "", "sc": 3.6, "t": "하"}, {"n": "광운중학교", "g": "노원구", "s": "서울시", "y3": 0.0, "y26": 0.0, "c3": 6.0, "st": null, "d": "", "sc": 3.6, "t": "하"}, {"n": "전동중학교", "g": "동대문구", "s": "서울시", "y3": 0.0, "y26": 0.0, "c3": 6.0, "st": null, "d": "", "sc": 3.6, "t": "하"}, {"n": "월곡중학교", "g": "성북구", "s": "서울시", "y3": 0.0, "y26": 0.0, "c3": 6.0, "st": null, "d": "", "sc": 3.6, "t": "하"}, {"n": "영북중학교", "g": "포천시", "s": "경기도", "y3": 1.0, "y26": 0.0, "c3": 2.0, "st": null, "d": "", "sc": 3.2, "t": "하"}, {"n": "중랑중학교", "g": "중랑구", "s": "서울시", "y3": 0.0, "y26": 0.0, "c3": 5.0, "st": null, "d": "하이텍", "sc": 3.0, "t": "하"}, {"n": "북악중학교", "g": "성북구", "s": "서울시", "y3": 0.0, "y26": 0.0, "c3": 5.0, "st": null, "d": "", "sc": 3.0, "t": "하"}, {"n": "경민중학교", "g": "의정부시", "s": "경기도", "y3": 0.0, "y26": 0.0, "c3": 5.0, "st": null, "d": "반도체", "sc": 3.0, "t": "하"}, {"n": "신창중학교", "g": "노원구", "s": "서울시", "y3": 0.0, "y26": 0.0, "c3": 4.0, "st": null, "d": "자동화", "sc": 2.4, "t": "하"}, {"n": "신상중학교", "g": "노원구", "s": "서울시", "y3": 0.0, "y26": 0.0, "c3": 4.0, "st": null, "d": "설비", "sc": 2.4, "t": "하"}, {"n": "화계중학교", "g": "강북구", "s": "서울시", "y3": 0.0, "y26": 0.0, "c3": 4.0, "st": null, "d": "", "sc": 2.4, "t": "하"}, {"n": "강북중학교", "g": "강북구", "s": "서울시", "y3": 0.0, "y26": 0.0, "c3": 4.0, "st": null, "d": "", "sc": 2.4, "t": "하"}, {"n": "하랑중학교", "g": "남양주시", "s": "경기도", "y3": 0.0, "y26": 0.0, "c3": 3.0, "st": null, "d": "", "sc": 1.8, "t": "하"}, {"n": "다온중학교", "g": "의정부시", "s": "경기도", "y3": 0.0, "y26": 0.0, "c3": 3.0, "st": null, "d": "반도체", "sc": 1.8, "t": "하"}];

/* ===== 디자인 토큰 ===== */
const C = {
  ink: "#14243B", ink2: "#22364F", paper: "#EEF1F4", card: "#FFFFFF",
  steel: "#5B7089", steelLt: "#8CA0B4", line: "#D7DEE6",
  amber: "#E0912B", amberBg: "#FBEFD8",
  teal: "#1F8A7A", tealBg: "#DCEFEC",
  coral: "#CC5A44", coralBg: "#F7E1DC",
  navyBg: "#DCE4EE", grayBg: "#E7ECF1", ink70: "#3C516B",
};
const MONO = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace";
const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif";

const STATUS = ["미방문", "방문완료", "재방문필요", "설명회예정", "관심없음"];
const STATUS_COLOR = {
  "미방문": { fg: C.steel, bg: C.grayBg },
  "방문완료": { fg: C.teal, bg: C.tealBg },
  "재방문필요": { fg: C.coral, bg: C.coralBg },
  "설명회예정": { fg: C.ink, bg: C.navyBg },
  "관심없음": { fg: C.steelLt, bg: C.grayBg },
};
const REACT_OPTS = ["좋음", "보통", "미온", "부재중"];
const TIER_COLOR = { "상": { fg: "#9A5B00", bg: C.amberBg }, "중": { fg: C.ink70, bg: C.navyBg }, "하": { fg: C.steelLt, bg: C.grayBg } };
const KEY = "outreach-state-v1";
const ROUND_LABELS = ["1차", "2차", "3차", "4차", "5차", "6차"];

/* ===== 저장소 (팀 공유: shared=true) ===== */
async function loadState() {
  try {
    const r = await window.storage.get(KEY, true);
    return r && r.value ? JSON.parse(r.value) : {};
  } catch (e) { return {}; }
}
async function mergeSave(name, patch) {
  let cur = {};
  try { const r = await window.storage.get(KEY, true); if (r && r.value) cur = JSON.parse(r.value); } catch (e) {}
  cur[name] = { ...(cur[name] || {}), ...patch };
  try { await window.storage.set(KEY, JSON.stringify(cur), true); } catch (e) {}
  return cur;
}

const emptyRec = () => ({ status: "미방문", rounds: ["", "", "", "", "", ""], interest: "", reaction: "", next: "", memo: "" });
const todayStr = () => { const d = new Date(); return `${d.getMonth() + 1}/${d.getDate()}`; };

export default function App() {
  const [state, setState] = useState({});
  const [ready, setReady] = useState(false);
  const [region, setRegion] = useState("전체");
  const [statusF, setStatusF] = useState("전체");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("priority");
  const [open, setOpen] = useState(null);

  useEffect(() => { loadState().then((s) => { setState(s); setReady(true); }); }, []);

  const rec = useCallback((name) => state[name] || emptyRec(), [state]);
  const update = useCallback((name, patch) => {
    setState((prev) => ({ ...prev, [name]: { ...(prev[name] || emptyRec()), ...patch } }));
    mergeSave(name, patch);
  }, []);

  const regions = useMemo(() => {
    const m = {};
    SCHOOLS.forEach((s) => { m[s.g] = (m[s.g] || 0) + 1; });
    return ["전체", ...Object.entries(m).sort((a, b) => b[1] - a[1]).map(([k]) => k)];
  }, []);

  const list = useMemo(() => {
    let arr = SCHOOLS.filter((s) => {
      if (region !== "전체" && s.g !== region) return false;
      const st = rec(s.n).status;
      if (statusF !== "전체" && st !== statusF) return false;
      if (q && !s.n.includes(q)) return false;
      return true;
    });
    if (sort === "priority") arr = [...arr].sort((a, b) => b.sc - a.sc);
    else if (sort === "region") arr = [...arr].sort((a, b) => a.g.localeCompare(b.g, "ko") || b.sc - a.sc);
    else if (sort === "status") arr = [...arr].sort((a, b) => STATUS.indexOf(rec(a.n).status) - STATUS.indexOf(rec(b.n).status) || b.sc - a.sc);
    return arr;
  }, [region, statusF, q, sort, rec]);

  const stats = useMemo(() => {
    let done = 0, revisit = 0, interest = 0, brief = 0;
    SCHOOLS.forEach((s) => {
      const r = rec(s.n);
      if (r.status === "방문완료") done++;
      if (r.status === "재방문필요") revisit++;
      if (r.status === "설명회예정") brief++;
      const iv = parseInt(r.interest, 10); if (!isNaN(iv)) interest += iv;
    });
    return { total: SCHOOLS.length, done, revisit, brief, interest, pct: Math.round((done / SCHOOLS.length) * 100) };
  }, [rec]);

  const exportCSV = () => {
    const head = ["순위", "학교명", "지역", "시도", "최근3년입학생수", "2026입학생수", "3학년학급수", "학생수", "대표학과", "우선순위점수", "등급", "방문상태", ...ROUND_LABELS, "관심학생수", "반응", "다음할일", "비고"];
    const rows = [...SCHOOLS].sort((a, b) => b.sc - a.sc).map((s, i) => {
      const r = rec(s.n);
      return [i + 1, s.n, s.g, s.s, s.y3 ?? "", s.y26 ?? "", s.c3 ?? "", s.st ?? "", s.d, s.sc, s.t, r.status, ...r.rounds, r.interest, r.reaction, r.next, r.memo]
        .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",");
    });
    const csv = "\uFEFF" + [head.join(","), ...rows].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "홍보진행_" + todayStr().replace("/", "-") + ".csv";
    a.click();
  };

  if (!ready) return <div style={{ fontFamily: SANS, padding: 40, color: C.steel, background: C.paper, minHeight: "100vh" }}>불러오는 중…</div>;

  return (
    <div style={{ fontFamily: SANS, background: C.paper, minHeight: "100vh", color: C.ink }}>
      <style>{`
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        button { cursor: pointer; font-family: inherit; }
        .chip:focus-visible, button:focus-visible, input:focus-visible, select:focus-visible { outline: 2px solid ${C.amber}; outline-offset: 1px; }
        input, select { font-family: inherit; }
        .row-enter { animation: fade .18s ease; }
        @keyframes fade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .row-enter { animation: none; } }
        .scrollx::-webkit-scrollbar { height: 0; }
      `}</style>

      {/* ===== 헤더 ===== */}
      <header style={{ background: C.ink, color: "#fff", padding: "18px 16px 14px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 2, color: C.amber, fontWeight: 700 }}>2027 신입생 모집 홍보</div>
              <h1 style={{ margin: "2px 0 0", fontSize: 21, fontWeight: 800, letterSpacing: -0.4 }}>홍보 배차판</h1>
            </div>
            <span style={{ fontSize: 10.5, color: C.steelLt, border: `1px solid ${C.ink2}`, padding: "3px 7px", borderRadius: 20, whiteSpace: "nowrap" }}>● 팀 공유 중</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginTop: 14 }}>
            {[["대상", stats.total, "#fff"], ["방문완료", stats.done, C.teal === C.teal ? "#7FD6C8" : "#fff"], ["설명회", stats.brief, "#B9C8DA"], ["관심학생", stats.interest, C.amber]].map(([label, val, col]) => (
              <div key={label} style={{ background: C.ink2, borderRadius: 10, padding: "9px 8px" }}>
                <div style={{ fontFamily: MONO, fontSize: 22, fontWeight: 700, color: col, lineHeight: 1 }}>{val}</div>
                <div style={{ fontSize: 10.5, color: C.steelLt, marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10, height: 6, background: C.ink2, borderRadius: 4, overflow: "hidden" }}>
            <div style={{ width: `${stats.pct}%`, height: "100%", background: C.amber, transition: "width .3s" }} />
          </div>
          <div style={{ fontSize: 10.5, color: C.steelLt, marginTop: 5 }}>진행률 {stats.pct}% · 재방문필요 {stats.revisit}교</div>
        </div>
      </header>

      {/* ===== 필터 ===== */}
      <div style={{ position: "sticky", top: 0, zIndex: 5, background: C.paper, borderBottom: `1px solid ${C.line}`, paddingBottom: 8 }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "10px 16px 0" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="학교명 검색"
              style={{ flex: 1, border: `1px solid ${C.line}`, borderRadius: 9, padding: "9px 11px", fontSize: 14, background: "#fff", color: C.ink }} />
            <button onClick={exportCSV} style={{ border: `1px solid ${C.ink}`, background: "#fff", color: C.ink, borderRadius: 9, padding: "9px 12px", fontSize: 12.5, fontWeight: 700 }}>CSV 내보내기</button>
          </div>

          <div className="scrollx" style={{ display: "flex", gap: 6, overflowX: "auto", marginTop: 9, paddingBottom: 2 }}>
            {regions.map((r) => (
              <Chip key={r} active={region === r} onClick={() => setRegion(r)} label={r} />
            ))}
          </div>
          <div className="scrollx" style={{ display: "flex", gap: 6, overflowX: "auto", marginTop: 6 }}>
            {["전체", ...STATUS].map((s) => (
              <Chip key={s} active={statusF === s} onClick={() => setStatusF(s)} label={s}
                dot={s !== "전체" ? STATUS_COLOR[s].fg : null} />
            ))}
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 8, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: C.steel }}>정렬</span>
            {[["priority", "우선순위"], ["region", "지역"], ["status", "상태"]].map(([k, l]) => (
              <button key={k} onClick={() => setSort(k)} style={{
                border: "none", background: "transparent", fontSize: 12.5, fontWeight: sort === k ? 800 : 500,
                color: sort === k ? C.ink : C.steel, borderBottom: sort === k ? `2px solid ${C.amber}` : "2px solid transparent", padding: "2px 2px 4px",
              }}>{l}</button>
            ))}
            <span style={{ marginLeft: "auto", fontSize: 11.5, color: C.steel, fontFamily: MONO }}>{list.length}교</span>
          </div>
        </div>
      </div>

      {/* ===== 목록 ===== */}
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "10px 12px 60px" }}>
        {list.length === 0 && (
          <div style={{ textAlign: "center", color: C.steel, padding: "50px 20px", fontSize: 14 }}>
            조건에 맞는 학교가 없습니다. 필터를 바꿔 보세요.
          </div>
        )}
        {list.map((s) => (
          <SchoolCard key={s.n} s={s} r={rec(s.n)} open={open === s.n}
            onToggle={() => setOpen(open === s.n ? null : s.n)} onUpdate={(p) => update(s.n, p)} />
        ))}
      </main>
    </div>
  );
}

function Chip({ active, onClick, label, dot }) {
  return (
    <button className="chip" onClick={onClick} style={{
      whiteSpace: "nowrap", border: `1px solid ${active ? C.ink : C.line}`, background: active ? C.ink : "#fff",
      color: active ? "#fff" : C.ink70, borderRadius: 20, padding: "6px 11px", fontSize: 12.5, fontWeight: active ? 700 : 500,
      display: "flex", alignItems: "center", gap: 5, flexShrink: 0,
    }}>
      {dot && <span style={{ width: 7, height: 7, borderRadius: 4, background: dot, display: "inline-block" }} />}
      {label}
    </button>
  );
}

function SchoolCard({ s, r, open, onToggle, onUpdate }) {
  const tier = TIER_COLOR[s.t];
  const sc = STATUS_COLOR[r.status];
  const visited = r.rounds.filter(Boolean).length;
  return (
    <div className="row-enter" style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, marginBottom: 8, overflow: "hidden" }}>
      <div onClick={onToggle} style={{ padding: "12px 13px", display: "flex", gap: 11, alignItems: "flex-start", cursor: "pointer" }}>
        <div style={{ textAlign: "center", minWidth: 40 }}>
          <div style={{ fontFamily: MONO, fontSize: 19, fontWeight: 700, color: C.ink, lineHeight: 1 }}>{Math.round(s.sc)}</div>
          <span style={{ fontSize: 10, fontWeight: 800, color: tier.fg, background: tier.bg, borderRadius: 5, padding: "1px 5px", marginTop: 4, display: "inline-block" }}>{s.t}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 15.5, fontWeight: 800, letterSpacing: -0.3 }}>{s.n}</span>
            {s.d && <span style={{ fontSize: 10.5, color: C.amber === C.amber ? "#9A5B00" : C.ink, background: C.amberBg, borderRadius: 5, padding: "1px 6px", fontWeight: 700 }}>{s.d}</span>}
          </div>
          <div style={{ fontSize: 12, color: C.steel, marginTop: 3 }}>
            {s.g} · <span style={{ fontFamily: MONO }}>3년 {s.y3 ?? "-"}명</span> · <span style={{ fontFamily: MONO }}>학급 {s.c3 ?? "-"}</span>
          </div>
          <div style={{ display: "flex", gap: 3, marginTop: 8 }}>
            {ROUND_LABELS.map((lb, i) => (
              <div key={i} title={lb} style={{
                flex: 1, height: 5, borderRadius: 3,
                background: r.rounds[i] ? C.amber : C.line,
              }} />
            ))}
          </div>
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: sc.fg, background: sc.bg, borderRadius: 6, padding: "4px 8px", whiteSpace: "nowrap" }}>{r.status}</span>
      </div>

      {open && (
        <div style={{ borderTop: `1px solid ${C.line}`, padding: "13px", background: "#FAFBFC" }}>
          {/* 상태 */}
          <Field label="방문 상태">
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {STATUS.map((st) => (
                <button key={st} onClick={() => onUpdate({ status: st })} style={{
                  border: `1px solid ${r.status === st ? STATUS_COLOR[st].fg : C.line}`,
                  background: r.status === st ? STATUS_COLOR[st].bg : "#fff",
                  color: r.status === st ? STATUS_COLOR[st].fg : C.steel,
                  borderRadius: 7, padding: "6px 10px", fontSize: 12.5, fontWeight: r.status === st ? 700 : 500,
                }}>{st}</button>
              ))}
            </div>
          </Field>

          {/* 라운드 */}
          <Field label="방문 회차 (누르면 오늘 날짜 기록 / 다시 누르면 삭제)">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 5 }}>
              {ROUND_LABELS.map((lb, i) => {
                const on = !!r.rounds[i];
                return (
                  <button key={i} onClick={() => {
                    const rounds = [...r.rounds]; rounds[i] = on ? "" : todayStr(); onUpdate({ rounds });
                  }} style={{
                    border: `1px solid ${on ? C.amber : C.line}`, background: on ? C.amberBg : "#fff",
                    borderRadius: 8, padding: "7px 2px", textAlign: "center",
                  }}>
                    <div style={{ fontSize: 10.5, color: on ? "#9A5B00" : C.steel, fontWeight: 700 }}>{lb}</div>
                    <div style={{ fontFamily: MONO, fontSize: 11.5, color: on ? C.ink : C.steelLt, marginTop: 2 }}>{on ? r.rounds[i] : "–"}</div>
                  </button>
                );
              })}
            </div>
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="관심 학생 수">
              <input inputMode="numeric" value={r.interest} onChange={(e) => onUpdate({ interest: e.target.value.replace(/[^0-9]/g, "") })}
                placeholder="0" style={inp} />
            </Field>
            <Field label="반응">
              <div style={{ display: "flex", gap: 4 }}>
                {REACT_OPTS.map((o) => (
                  <button key={o} onClick={() => onUpdate({ reaction: r.reaction === o ? "" : o })} style={{
                    flex: 1, border: `1px solid ${r.reaction === o ? C.ink : C.line}`, background: r.reaction === o ? C.ink : "#fff",
                    color: r.reaction === o ? "#fff" : C.steel, borderRadius: 7, padding: "7px 2px", fontSize: 11.5, fontWeight: 600,
                  }}>{o}</button>
                ))}
              </div>
            </Field>
          </div>

          <Field label="다음 할 일">
            <input value={r.next} onChange={(e) => onUpdate({ next: e.target.value })} placeholder="예: 설명회 일정 조율, 자료 재발송" style={inp} />
          </Field>
          <Field label="메모">
            <textarea value={r.memo} onChange={(e) => onUpdate({ memo: e.target.value })} rows={2}
              placeholder="담당자 반응, 특이사항 등" style={{ ...inp, resize: "vertical", lineHeight: 1.4 }} />
          </Field>

          <a href={`https://map.naver.com/p/search/${encodeURIComponent(s.n)}`} target="_blank" rel="noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 4, fontSize: 12.5, color: C.ink, fontWeight: 700, textDecoration: "none", border: `1px solid ${C.line}`, borderRadius: 8, padding: "8px 12px", background: "#fff" }}>
            📍 네이버 지도에서 열기
          </a>
        </div>
      )}
    </div>
  );
}

const inp = { width: "100%", border: `1px solid ${C.line}`, borderRadius: 8, padding: "9px 10px", fontSize: 13.5, background: "#fff", color: C.ink };
function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 11 }}>
      <div style={{ fontSize: 11, color: C.steel, fontWeight: 700, marginBottom: 5 }}>{label}</div>
      {children}
    </div>
  );
}
