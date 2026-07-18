import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";

/* ===== 데이터 (개인정보 제외: 교사·학생 이름 없음) ===== */
const SCHOOLS = [{"n": "북서울중학교", "g": "도봉구", "s": "서울시", "y3": 15.0, "y26": 14.0, "c3": 5.0, "st": 113.0, "d": "전기", "sc": 75.0, "t": "상"}, {"n": "풍양중학교", "g": "남양주시", "s": "경기도", "y3": 18.0, "y26": 5.0, "c3": 13.0, "st": null, "d": "재료", "sc": 58.8, "t": "상"}, {"n": "월계중학교", "g": "노원구", "s": "서울시", "y3": 12.0, "y26": 8.0, "c3": 4.0, "st": 100.0, "d": "재료", "sc": 50.4, "t": "상"}, {"n": "장안중학교", "g": "중랑구", "s": "서울시", "y3": 13.0, "y26": 5.0, "c3": 6.0, "st": 141.0, "d": "하이텍", "sc": 44.6, "t": "상"}, {"n": "방학중학교", "g": "도봉구", "s": "서울시", "y3": 12.0, "y26": 5.0, "c3": 6.0, "st": null, "d": "설비", "sc": 42.6, "t": "상"}, {"n": "공릉중학교", "g": "노원구", "s": "서울시", "y3": 9.0, "y26": 6.0, "c3": 6.0, "st": null, "d": "메카", "sc": 39.6, "t": "상"}, {"n": "갈매중학교", "g": "구리시", "s": "경기도", "y3": 15.0, "y26": 1.0, "c3": 11.0, "st": null, "d": "하이텍", "sc": 39.6, "t": "상"}, {"n": "별가람중학교", "g": "남양주시", "s": "경기도", "y3": 11.0, "y26": 4.0, "c3": 9.0, "st": null, "d": "전기", "sc": 39.4, "t": "상"}, {"n": "오남중학교", "g": "남양주시", "s": "경기도", "y3": 11.0, "y26": 4.0, "c3": 5.0, "st": null, "d": "전기", "sc": 37.0, "t": "상"}, {"n": "원묵중학교", "g": "중랑구", "s": "서울시", "y3": 9.0, "y26": 4.0, "c3": 9.0, "st": null, "d": "설비", "sc": 35.4, "t": "상"}, {"n": "인창중학교", "g": "구리시", "s": "경기도", "y3": 11.0, "y26": 2.0, "c3": 11.0, "st": null, "d": "하이텍", "sc": 34.6, "t": "상"}, {"n": "심석중학교", "g": "남양주시", "s": "경기도", "y3": 14.0, "y26": 0.0, "c3": 9.0, "st": null, "d": "", "sc": 33.4, "t": "상"}, {"n": "상봉중학교", "g": "중랑구", "s": "서울시", "y3": 8.0, "y26": 4.0, "c3": 8.0, "st": null, "d": "전기", "sc": 32.8, "t": "상"}, {"n": "남양주다산중학교", "g": "남양주시", "s": "경기도", "y3": 12.0, "y26": 0.0, "c3": 13.0, "st": null, "d": "재료", "sc": 31.8, "t": "상"}, {"n": "중화중학교", "g": "중랑구", "s": "서울시", "y3": 11.0, "y26": 2.0, "c3": 6.0, "st": null, "d": "재료", "sc": 31.6, "t": "상"}, {"n": "한천중학교", "g": "노원구", "s": "서울시", "y3": 10.0, "y26": 2.0, "c3": 7.0, "st": null, "d": "전기", "sc": 30.2, "t": "상"}, {"n": "하계중학교", "g": "노원구", "s": "서울시", "y3": 9.0, "y26": 2.0, "c3": 8.0, "st": null, "d": "하이텍", "sc": 28.8, "t": "상"}, {"n": "석관중학교", "g": "성북구", "s": "서울시", "y3": 9.0, "y26": 2.0, "c3": 8.0, "st": null, "d": "인문", "sc": 28.8, "t": "상"}, {"n": "태릉중학교", "g": "중랑구", "s": "서울시", "y3": 10.0, "y26": 2.0, "c3": 4.0, "st": null, "d": "전자", "sc": 28.4, "t": "상"}, {"n": "용곡중학교", "g": "광진구", "s": "서울시", "y3": 9.0, "y26": 2.0, "c3": 7.0, "st": null, "d": "재료", "sc": 28.2, "t": "상"}, {"n": "남대문중학교", "g": "성북구", "s": "서울시", "y3": 9.0, "y26": 2.0, "c3": 7.0, "st": null, "d": "재료", "sc": 28.2, "t": "상"}, {"n": "동국대학교사범대학부속중학교", "g": "동대문구", "s": "서울시", "y3": 8.0, "y26": 4.0, "c3": null, "st": null, "d": "메카", "sc": 28.0, "t": "상"}, {"n": "휘경중학교", "g": "동대문구", "s": "서울시", "y3": 8.0, "y26": 3.0, "c3": 4.0, "st": null, "d": "드론", "sc": 27.4, "t": "상"}, {"n": "평내중학교", "g": "남양주시", "s": "경기도", "y3": 10.0, "y26": 1.0, "c3": 7.0, "st": null, "d": "재료", "sc": 27.2, "t": "상"}, {"n": "노일중학교", "g": "노원구", "s": "서울시", "y3": 6.0, "y26": 4.0, "c3": 5.0, "st": null, "d": "드론", "sc": 27.0, "t": "상"}, {"n": "광장중학교", "g": "광진구", "s": "서울시", "y3": 5.0, "y26": 4.0, "c3": 8.0, "st": null, "d": "메카", "sc": 26.8, "t": "상"}, {"n": "동구중학교", "g": "구리시", "s": "경기도", "y3": 6.0, "y26": 3.0, "c3": 9.0, "st": null, "d": "전기", "sc": 26.4, "t": "상"}, {"n": "도봉중학교", "g": "도봉구", "s": "서울시", "y3": 7.0, "y26": 3.0, "c3": 4.0, "st": null, "d": "설비", "sc": 25.4, "t": "상"}, {"n": "화광중학교", "g": "남양주시", "s": "경기도", "y3": 8.0, "y26": 2.0, "c3": 4.0, "st": null, "d": "", "sc": 24.4, "t": "상"}, {"n": "재현중학교", "g": "노원구", "s": "서울시", "y3": 5.0, "y26": 3.0, "c3": 8.0, "st": null, "d": "전기", "sc": 23.8, "t": "상"}, {"n": "청원중학교", "g": "노원구", "s": "서울시", "y3": 5.0, "y26": 3.0, "c3": 7.0, "st": null, "d": "하이텍", "sc": 23.2, "t": "상"}, {"n": "면목중학교", "g": "중랑구", "s": "서울시", "y3": 8.0, "y26": 1.0, "c3": 6.0, "st": null, "d": "하이텍", "sc": 22.6, "t": "상"}, {"n": "신도봉중학교", "g": "도봉구", "s": "서울시", "y3": 5.0, "y26": 3.0, "c3": 6.0, "st": null, "d": "전기", "sc": 22.6, "t": "상"}, {"n": "별내중학교", "g": "남양주시", "s": "경기도", "y3": 5.0, "y26": 3.0, "c3": 6.0, "st": null, "d": "설계", "sc": 22.6, "t": "상"}, {"n": "동원중학교", "g": "중랑구", "s": "서울시", "y3": 6.0, "y26": 2.0, "c3": 7.0, "st": null, "d": "메카", "sc": 22.2, "t": "상"}, {"n": "녹천중학교", "g": "노원구", "s": "서울시", "y3": 5.0, "y26": 3.0, "c3": 5.0, "st": null, "d": "자동화", "sc": 22.0, "t": "상"}, {"n": "백운중학교", "g": "도봉구", "s": "서울시", "y3": 5.0, "y26": 3.0, "c3": 5.0, "st": null, "d": "하이텍", "sc": 22.0, "t": "상"}, {"n": "퇴계원중학교", "g": "남양주시", "s": "경기도", "y3": 7.0, "y26": 1.0, "c3": 8.0, "st": null, "d": "인문", "sc": 21.8, "t": "상"}, {"n": "금곡중학교", "g": "남양주시", "s": "경기도", "y3": 7.0, "y26": 2.0, "c3": 3.0, "st": null, "d": "설계", "sc": 21.8, "t": "상"}, {"n": "중원중학교", "g": "노원구", "s": "서울시", "y3": 6.0, "y26": 2.0, "c3": 5.0, "st": null, "d": "설비", "sc": 21.0, "t": "상"}, {"n": "마석중학교", "g": "남양주시", "s": "경기도", "y3": 7.0, "y26": 0.0, "c3": 11.0, "st": null, "d": "", "sc": 20.6, "t": "상"}, {"n": "한별중학교", "g": "남양주시", "s": "경기도", "y3": 3.0, "y26": 3.0, "c3": 8.0, "st": null, "d": "", "sc": 19.8, "t": "상"}, {"n": "신현중학교", "g": "중랑구", "s": "서울시", "y3": 7.0, "y26": 1.0, "c3": 4.0, "st": null, "d": "메카", "sc": 19.4, "t": "상"}, {"n": "능곡중학교", "g": "고양시", "s": "경기도", "y3": 3.0, "y26": 3.0, "c3": 6.0, "st": null, "d": "", "sc": 18.6, "t": "상"}, {"n": "구리중학교", "g": "구리시", "s": "경기도", "y3": 5.0, "y26": 2.0, "c3": 3.0, "st": null, "d": "드론", "sc": 17.8, "t": "상"}, {"n": "노원중학교", "g": "노원구", "s": "서울시", "y3": 7.0, "y26": 0.0, "c3": 5.0, "st": null, "d": "드론", "sc": 17.0, "t": "상"}, {"n": "용마중학교", "g": "중랑구", "s": "서울시", "y3": 4.0, "y26": 2.0, "c3": 5.0, "st": null, "d": "전자", "sc": 17.0, "t": "상"}, {"n": "도농중학교", "g": "남양주시", "s": "경기도", "y3": 6.0, "y26": 0.0, "c3": 8.0, "st": null, "d": "재료", "sc": 16.8, "t": "중"}, {"n": "상계중", "g": "노원구", "s": "서울시", "y3": 5.0, "y26": 1.0, "c3": 6.0, "st": null, "d": "드론", "sc": 16.6, "t": "중"}, {"n": "고덕중학교", "g": "강동구", "s": "서울시", "y3": 2.0, "y26": 1.0, "c3": 16.0, "st": null, "d": "하이텍", "sc": 16.6, "t": "중"}, {"n": "판곡중학교", "g": "남양주시", "s": "경기도", "y3": 5.0, "y26": 0.0, "c3": 10.0, "st": null, "d": "", "sc": 16.0, "t": "중"}, {"n": "진건중학교", "g": "남양주시", "s": "경기도", "y3": 5.0, "y26": 1.0, "c3": 5.0, "st": null, "d": "", "sc": 16.0, "t": "중"}, {"n": "진접중학교", "g": "남양주시", "s": "경기도", "y3": 4.0, "y26": 1.0, "c3": 8.0, "st": null, "d": "", "sc": 15.8, "t": "중"}, {"n": "봉화중", "g": "중랑구", "s": "서울시", "y3": 5.0, "y26": 1.0, "c3": 4.0, "st": null, "d": "메카", "sc": 15.4, "t": "중"}, {"n": "옥빛중학교", "g": "양주시", "s": "경기도", "y3": 3.0, "y26": 0.0, "c3": 15.0, "st": null, "d": "", "sc": 15.0, "t": "중"}, {"n": "어람중학교", "g": "남양주시", "s": "경기도", "y3": 5.0, "y26": 0.0, "c3": 8.0, "st": null, "d": "전자", "sc": 14.8, "t": "중"}, {"n": "불암중학교", "g": "노원구", "s": "서울시", "y3": 2.0, "y26": 1.0, "c3": 11.0, "st": null, "d": "자동화", "sc": 13.6, "t": "중"}, {"n": "서라벌중학교", "g": "강북구", "s": "서울시", "y3": 4.0, "y26": 1.0, "c3": 4.0, "st": null, "d": "", "sc": 13.4, "t": "중"}, {"n": "솔샘중학교", "g": "강북구", "s": "서울시", "y3": 4.0, "y26": 1.0, "c3": 4.0, "st": null, "d": "", "sc": 13.4, "t": "중"}, {"n": "양오중학교", "g": "남양주시", "s": "경기도", "y3": 3.0, "y26": 1.0, "c3": 7.0, "st": null, "d": "", "sc": 13.2, "t": "중"}, {"n": "상명중학교", "g": "노원구", "s": "서울시", "y3": 2.0, "y26": 1.0, "c3": 9.0, "st": null, "d": "설비", "sc": 12.4, "t": "중"}, {"n": "중평중학교", "g": "노원구", "s": "서울시", "y3": 2.0, "y26": 1.0, "c3": 9.0, "st": null, "d": "전자", "sc": 12.4, "t": "중"}, {"n": "미금중학교", "g": "남양주시", "s": "경기도", "y3": 2.0, "y26": 2.0, "c3": 4.0, "st": null, "d": "", "sc": 12.4, "t": "중"}, {"n": "상계제일중학교", "g": "노원구", "s": "서울시", "y3": 4.0, "y26": 0.0, "c3": 7.0, "st": null, "d": "드론", "sc": 12.2, "t": "중"}, {"n": "창일중학교", "g": "도봉구", "s": "서울시", "y3": 4.0, "y26": 0.0, "c3": 7.0, "st": null, "d": "", "sc": 12.2, "t": "중"}, {"n": "청림중학교", "g": "화성시", "s": "경기도", "y3": 1.0, "y26": 1.0, "c3": 12.0, "st": null, "d": "", "sc": 12.2, "t": "중"}, {"n": "중계중학교", "g": "노원구", "s": "서울시", "y3": 3.0, "y26": 0.0, "c3": 10.0, "st": null, "d": "자동화", "sc": 12.0, "t": "중"}, {"n": "호평중학교", "g": "남양주시", "s": "경기도", "y3": 1.0, "y26": 1.0, "c3": 11.0, "st": null, "d": "", "sc": 11.6, "t": "중"}, {"n": "경희중학교", "g": "동대문구", "s": "서울시", "y3": 2.0, "y26": 1.0, "c3": 7.0, "st": null, "d": "드론", "sc": 11.2, "t": "중"}, {"n": "옥정중학교", "g": "양주시", "s": "경기도", "y3": 1.0, "y26": 1.0, "c3": 10.0, "st": null, "d": "", "sc": 11.0, "t": "중"}, {"n": "산내중학교", "g": "파주시", "s": "경기도", "y3": 1.0, "y26": 1.0, "c3": 10.0, "st": null, "d": "", "sc": 11.0, "t": "중"}, {"n": "광릉중학교", "g": "남양주시", "s": "경기도", "y3": 3.0, "y26": 1.0, "c3": 3.0, "st": null, "d": "", "sc": 10.8, "t": "중"}, {"n": "번동중학교", "g": "강북구", "s": "서울시", "y3": 2.0, "y26": 1.0, "c3": 6.0, "st": null, "d": "", "sc": 10.6, "t": "중"}, {"n": "신방학중학교", "g": "도봉구", "s": "서울시", "y3": 2.0, "y26": 1.0, "c3": 6.0, "st": null, "d": "", "sc": 10.6, "t": "중"}, {"n": "삼숭중학교", "g": "양주시", "s": "경기도", "y3": 2.0, "y26": 0.0, "c3": 11.0, "st": null, "d": "", "sc": 10.6, "t": "중"}, {"n": "다산새봄중학교", "g": "남양주시", "s": "경기도", "y3": 2.0, "y26": 0.0, "c3": 11.0, "st": null, "d": "재료", "sc": 10.6, "t": "중"}, {"n": "토평중학교", "g": "구리시", "s": "경기도", "y3": 2.0, "y26": 1.0, "c3": 6.0, "st": null, "d": "", "sc": 10.6, "t": "중"}, {"n": "자양중학교", "g": "광진구", "s": "서울시", "y3": 1.0, "y26": 1.0, "c3": 9.0, "st": null, "d": "", "sc": 10.4, "t": "중"}, {"n": "장내중학교", "g": "남양주시", "s": "경기도", "y3": 1.0, "y26": 1.0, "c3": 9.0, "st": null, "d": "", "sc": 10.4, "t": "중"}, {"n": "덕계중학교", "g": "양주시", "s": "경기도", "y3": 1.0, "y26": 1.0, "c3": 9.0, "st": null, "d": "", "sc": 10.4, "t": "중"}, {"n": "광동중학교", "g": "남양주시", "s": "경기도", "y3": 3.0, "y26": 0.0, "c3": 7.0, "st": null, "d": "", "sc": 10.2, "t": "중"}, {"n": "충의중학교", "g": "의정부시", "s": "경기도", "y3": 2.0, "y26": 0.0, "c3": 10.0, "st": null, "d": "", "sc": 10.0, "t": "중"}, {"n": "을지중학교", "g": "노원구", "s": "서울시", "y3": 1.0, "y26": 1.0, "c3": 8.0, "st": null, "d": "", "sc": 9.8, "t": "중"}, {"n": "와부중학교", "g": "남양주시", "s": "경기도", "y3": 1.0, "y26": 1.0, "c3": 8.0, "st": null, "d": "", "sc": 9.8, "t": "중"}, {"n": "양주백석중학교", "g": "양주시", "s": "경기도", "y3": 1.0, "y26": 1.0, "c3": 8.0, "st": null, "d": "", "sc": 9.8, "t": "중"}, {"n": "교문중학교", "g": "구리시", "s": "경기도", "y3": 3.0, "y26": 0.0, "c3": 6.0, "st": null, "d": "", "sc": 9.6, "t": "중"}, {"n": "효문중학교", "g": "도봉구", "s": "서울시", "y3": 2.0, "y26": 1.0, "c3": 4.0, "st": null, "d": "", "sc": 9.4, "t": "중"}, {"n": "송라중학교", "g": "남양주시", "s": "경기도", "y3": 2.0, "y26": 0.0, "c3": 9.0, "st": null, "d": "", "sc": 9.4, "t": "중"}, {"n": "강동중학교", "g": "강동구", "s": "서울시", "y3": 1.0, "y26": 1.0, "c3": 7.0, "st": null, "d": "", "sc": 9.2, "t": "중"}, {"n": "성남서중학교", "g": "성남시", "s": "경기도", "y3": 1.0, "y26": 1.0, "c3": 7.0, "st": null, "d": "", "sc": 9.2, "t": "중"}, {"n": "광양중학교", "g": "광진구", "s": "서울시", "y3": 3.0, "y26": 0.0, "c3": 5.0, "st": null, "d": "메카", "sc": 9.0, "t": "중"}, {"n": "예봉중학교", "g": "남양주시", "s": "경기도", "y3": 2.0, "y26": 0.0, "c3": 8.0, "st": null, "d": "", "sc": 8.8, "t": "중"}, {"n": "상경중학교", "g": "노원구", "s": "서울시", "y3": 1.0, "y26": 1.0, "c3": 6.0, "st": null, "d": "전자", "sc": 8.6, "t": "중"}, {"n": "온곡중학교", "g": "노원구", "s": "서울시", "y3": 1.0, "y26": 1.0, "c3": 6.0, "st": null, "d": "전자", "sc": 8.6, "t": "중"}, {"n": "개봉중학교", "g": "구로구", "s": "서울시", "y3": 1.0, "y26": 1.0, "c3": 6.0, "st": null, "d": "", "sc": 8.6, "t": "중"}, {"n": "덕현중학교", "g": "양주시", "s": "경기도", "y3": 1.0, "y26": 0.0, "c3": 11.0, "st": null, "d": "", "sc": 8.6, "t": "중"}, {"n": "장자중학교", "g": "구리시", "s": "경기도", "y3": 1.0, "y26": 1.0, "c3": 6.0, "st": null, "d": "", "sc": 8.6, "t": "중"}, {"n": "성사중학교", "g": "고양시", "s": "경기도", "y3": 1.0, "y26": 1.0, "c3": 6.0, "st": null, "d": "", "sc": 8.6, "t": "중"}, {"n": "수송중학교", "g": "강북구", "s": "서울시", "y3": 3.0, "y26": 0.0, "c3": 4.0, "st": null, "d": "하이텍", "sc": 8.4, "t": "하"}, {"n": "주곡중학교", "g": "남양주시", "s": "경기도", "y3": 2.0, "y26": 0.0, "c3": 7.0, "st": null, "d": "", "sc": 8.2, "t": "하"}, {"n": "수락중학교", "g": "노원구", "s": "서울시", "y3": 1.0, "y26": 1.0, "c3": 5.0, "st": null, "d": "전자", "sc": 8.0, "t": "하"}, {"n": "염광중학교", "g": "노원구", "s": "서울시", "y3": 1.0, "y26": 1.0, "c3": 5.0, "st": null, "d": "", "sc": 8.0, "t": "하"}, {"n": "송양중학교", "g": "의정부시", "s": "경기도", "y3": 1.0, "y26": 0.0, "c3": 10.0, "st": null, "d": "", "sc": 8.0, "t": "하"}, {"n": "솔뫼중학교", "g": "의정부시", "s": "경기도", "y3": 1.0, "y26": 1.0, "c3": 5.0, "st": null, "d": "", "sc": 8.0, "t": "하"}, {"n": "천마중학교", "g": "남양주시", "s": "경기도", "y3": 2.0, "y26": 0.0, "c3": 6.0, "st": null, "d": "", "sc": 7.6, "t": "하"}, {"n": "선덕중학교", "g": "도봉구", "s": "서울시", "y3": 1.0, "y26": 0.0, "c3": 9.0, "st": null, "d": "", "sc": 7.4, "t": "하"}, {"n": "장위중학교", "g": "성북구", "s": "서울시", "y3": 1.0, "y26": 0.0, "c3": 9.0, "st": null, "d": "드론", "sc": 7.4, "t": "하"}, {"n": "상원중학교", "g": "노원구", "s": "서울시", "y3": 2.0, "y26": 0.0, "c3": 5.0, "st": null, "d": "", "sc": 7.0, "t": "하"}, {"n": "동대문중학교", "g": "동대문구", "s": "서울시", "y3": 1.0, "y26": 0.0, "c3": 8.0, "st": null, "d": "", "sc": 6.8, "t": "하"}, {"n": "남문중학교", "g": "양주시", "s": "경기도", "y3": 1.0, "y26": 1.0, "c3": 3.0, "st": null, "d": "", "sc": 6.8, "t": "하"}, {"n": "성일중학교", "g": "동대문구", "s": "서울시", "y3": 2.0, "y26": 0.0, "c3": 4.0, "st": null, "d": "", "sc": 6.4, "t": "하"}, {"n": "신일중학교", "g": "강북구", "s": "서울시", "y3": 2.0, "y26": 0.0, "c3": 4.0, "st": null, "d": "", "sc": 6.4, "t": "하"}, {"n": "태랑중학교", "g": "노원구", "s": "서울시", "y3": 1.0, "y26": 0.0, "c3": 7.0, "st": null, "d": "", "sc": 6.2, "t": "하"}, {"n": "창동중학교", "g": "도봉구", "s": "서울시", "y3": 1.0, "y26": 0.0, "c3": 7.0, "st": null, "d": "", "sc": 6.2, "t": "하"}, {"n": "동화중학교", "g": "남양주시", "s": "경기도", "y3": 1.0, "y26": 0.0, "c3": 7.0, "st": null, "d": "설계", "sc": 6.2, "t": "하"}, {"n": "장평중학교", "g": "동대문구", "s": "서울시", "y3": 0.0, "y26": 0.0, "c3": 10.0, "st": null, "d": "", "sc": 6.0, "t": "하"}, {"n": "길음중학교", "g": "성북구", "s": "서울시", "y3": 0.0, "y26": 0.0, "c3": 10.0, "st": null, "d": "", "sc": 6.0, "t": "하"}, {"n": "가운중학교", "g": "남양주시", "s": "경기도", "y3": 2.0, "y26": 0.0, "c3": 3.0, "st": null, "d": "설계", "sc": 5.8, "t": "하"}, {"n": "수유중학교", "g": "강북구", "s": "서울시", "y3": 1.0, "y26": 0.0, "c3": 6.0, "st": null, "d": "", "sc": 5.6, "t": "하"}, {"n": "구의중학교", "g": "광진구", "s": "서울시", "y3": 1.0, "y26": 0.0, "c3": 6.0, "st": null, "d": "", "sc": 5.6, "t": "하"}, {"n": "다산한강중학교", "g": "남양주시", "s": "경기도", "y3": 0.0, "y26": 0.0, "c3": 9.0, "st": null, "d": "", "sc": 5.4, "t": "하"}, {"n": "수동중학교", "g": "남양주시", "s": "경기도", "y3": 2.0, "y26": 0.0, "c3": 2.0, "st": null, "d": "", "sc": 5.2, "t": "하"}, {"n": "인수중학교", "g": "강북구", "s": "서울시", "y3": 1.0, "y26": 0.0, "c3": 5.0, "st": null, "d": "", "sc": 5.0, "t": "하"}, {"n": "숭곡중학교", "g": "성북구", "s": "서울시", "y3": 0.0, "y26": 0.0, "c3": 8.0, "st": null, "d": "", "sc": 4.8, "t": "하"}, {"n": "동암중학교", "g": "의정부시", "s": "경기도", "y3": 0.0, "y26": 0.0, "c3": 8.0, "st": null, "d": "", "sc": 4.8, "t": "하"}, {"n": "화접중학교", "g": "남양주시", "s": "경기도", "y3": 0.0, "y26": 0.0, "c3": 8.0, "st": null, "d": "", "sc": 4.8, "t": "하"}, {"n": "노곡중학교", "g": "도봉구", "s": "서울시", "y3": 1.0, "y26": 0.0, "c3": 4.0, "st": null, "d": "전자", "sc": 4.4, "t": "하"}, {"n": "덕소중학교", "g": "남양주시", "s": "경기도", "y3": 0.0, "y26": 0.0, "c3": 7.0, "st": null, "d": "", "sc": 4.2, "t": "하"}, {"n": "창북중학교", "g": "도봉구", "s": "서울시", "y3": 0.0, "y26": 0.0, "c3": 6.0, "st": null, "d": "", "sc": 3.6, "t": "하"}, {"n": "광운중학교", "g": "노원구", "s": "서울시", "y3": 0.0, "y26": 0.0, "c3": 6.0, "st": null, "d": "", "sc": 3.6, "t": "하"}, {"n": "전동중학교", "g": "동대문구", "s": "서울시", "y3": 0.0, "y26": 0.0, "c3": 6.0, "st": null, "d": "", "sc": 3.6, "t": "하"}, {"n": "월곡중학교", "g": "성북구", "s": "서울시", "y3": 0.0, "y26": 0.0, "c3": 6.0, "st": null, "d": "", "sc": 3.6, "t": "하"}, {"n": "영북중학교", "g": "포천시", "s": "경기도", "y3": 1.0, "y26": 0.0, "c3": 2.0, "st": null, "d": "", "sc": 3.2, "t": "하"}, {"n": "중랑중학교", "g": "중랑구", "s": "서울시", "y3": 0.0, "y26": 0.0, "c3": 5.0, "st": null, "d": "하이텍", "sc": 3.0, "t": "하"}, {"n": "북악중학교", "g": "성북구", "s": "서울시", "y3": 0.0, "y26": 0.0, "c3": 5.0, "st": null, "d": "", "sc": 3.0, "t": "하"}, {"n": "경민중학교", "g": "의정부시", "s": "경기도", "y3": 0.0, "y26": 0.0, "c3": 5.0, "st": null, "d": "반도체", "sc": 3.0, "t": "하"}, {"n": "신창중학교", "g": "노원구", "s": "서울시", "y3": 0.0, "y26": 0.0, "c3": 4.0, "st": null, "d": "자동화", "sc": 2.4, "t": "하"}, {"n": "신상중학교", "g": "노원구", "s": "서울시", "y3": 0.0, "y26": 0.0, "c3": 4.0, "st": null, "d": "설비", "sc": 2.4, "t": "하"}, {"n": "화계중학교", "g": "강북구", "s": "서울시", "y3": 0.0, "y26": 0.0, "c3": 4.0, "st": null, "d": "", "sc": 2.4, "t": "하"}, {"n": "강북중학교", "g": "강북구", "s": "서울시", "y3": 0.0, "y26": 0.0, "c3": 4.0, "st": null, "d": "", "sc": 2.4, "t": "하"}, {"n": "하랑중학교", "g": "남양주시", "s": "경기도", "y3": 0.0, "y26": 0.0, "c3": 3.0, "st": null, "d": "", "sc": 1.8, "t": "하"}, {"n": "다온중학교", "g": "의정부시", "s": "경기도", "y3": 0.0, "y26": 0.0, "c3": 3.0, "st": null, "d": "반도체", "sc": 1.8, "t": "하"}];

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
const KEY = "outreach-state-v2";
const OLD_KEY = "outreach-state-v1";
const HELP_SEEN = "outreach-help-seen-v1"; // 사용법 안내를 봤는지(기기별)
const ROUND_LABELS = ["1차", "2차", "3차", "4차", "5차", "6차"];
const FIELDS = ["status", "rounds", "visitors", "interest", "reaction", "next", "memo"];

/* ===== 저장소 (팀 공유: shared=true) =====
   동시편집 안전화:
   - 학교 키 = "학교명|지역" (동명 학교 충돌 방지)
   - 레코드마다 필드별 수정시각(_t) 보관 → 병합 시 더 최신 값 채택(last-write-wins 완화)
   - 여러 명이 같은 학교의 다른 항목을 고쳐도 서로 덮어쓰지 않음                        */

// 두 레코드를 필드별 최신값 기준으로 병합.
function mergeRec(a, b) {
  const at = (a && a._t) || {}, bt = (b && b._t) || {};
  const out = {}, t = {};
  FIELDS.forEach((f) => {
    const hasA = a && f in a, hasB = b && f in b;
    if (hasB && (!hasA || (bt[f] || 0) >= (at[f] || 0))) { out[f] = b[f]; t[f] = bt[f] || at[f] || 0; }
    else if (hasA) { out[f] = a[f]; t[f] = at[f] || 0; }
  });
  out._t = t;
  return out;
}
// 전체 상태(모든 학교) 병합.
function mergeState(a, b) {
  const out = { ...a };
  Object.keys(b || {}).forEach((k) => { out[k] = mergeRec(a[k], b[k]); });
  return out;
}
// patch(필드→값)에 현재 시각 타임스탬프를 찍어 저장용 부분 레코드로.
function stamp(patch, ts) {
  const rec = { _t: {} };
  Object.keys(patch).forEach((f) => { rec[f] = patch[f]; rec._t[f] = ts; });
  return rec;
}
// v1(학교명만) → v2(학교명|지역) 마이그레이션. 동명은 첫 학교로 귀속.
function migrateV1(old) {
  const byName = {};
  SCHOOLS.forEach((s) => { (byName[s.n] = byName[s.n] || []).push(s); });
  const out = {};
  Object.entries(old || {}).forEach(([name, rec]) => {
    const cand = byName[name];
    const key = cand && cand.length ? `${cand[0].n}|${cand[0].g}` : name;
    out[key] = mergeRec(out[key], { ...rec, _t: rec._t || {} });
  });
  return out;
}

async function readShared(key) {
  try { const r = await window.storage.get(key, true); return r && r.value ? JSON.parse(r.value) : null; }
  catch (e) { return null; }
}

/* ===== 구글시트 연동(선택) =====
   연결주소(Apps Script 웹앱 /exec URL)가 있으면 저장/동기화를 그 시트로 보낸다.
   주소는 ?api=URL 파라미터 또는 localStorage 에 보관. 미설정 시 기존 로컬 저장. */
const API_LS = "outreach-sheet-api";
function apiUrl() {
  try {
    const p = new URLSearchParams(location.search).get("api");
    if (p) { localStorage.setItem(API_LS, p); return p; }
    return localStorage.getItem(API_LS) || "";
  } catch (e) { return ""; }
}
function setApiUrl(u) { try { u ? localStorage.setItem(API_LS, u) : localStorage.removeItem(API_LS); } catch (e) {} }
let _remoteOk = null; // null=미연결, true/false=최근 통신 결과
function remoteStatus() { return apiUrl() ? _remoteOk : null; }
async function remoteGet() {
  const u = apiUrl(); if (!u) return null;
  try {
    const r = await fetch(u, { method: "GET" });
    const j = await r.json();
    if (j && j.ok) { _remoteOk = true; return j.state || {}; }
  } catch (e) {}
  _remoteOk = false; return null;
}
// 저장은 GET(쿼리에 patches)으로 보낸다. 브라우저→Apps Script는 POST가 CORS로 막히는 경우가 많아,
// 읽기와 동일한 GET 경로를 쓰면 확실히 통과한다. URL 길이 제한 대비로 여러 개로 쪼개 보낸다.
function remotePost(patches) {
  const u = apiUrl(); if (!u) return;
  const entries = Object.entries(patches || {});
  if (!entries.length) return;
  const chunks = []; let cur = {}, len = 0;
  for (const [k, v] of entries) {
    const s = JSON.stringify({ [k]: v }).length;
    if (len + s > 5000 && Object.keys(cur).length) { chunks.push(cur); cur = {}; len = 0; }
    cur[k] = v; len += s;
  }
  if (Object.keys(cur).length) chunks.push(cur);
  chunks.forEach((c) => {
    const url = u + (u.indexOf("?") >= 0 ? "&" : "?") + "patches=" + encodeURIComponent(JSON.stringify(c)) + "&_=" + Date.now();
    fetch(url, { method: "GET" })
      .then((r) => r.json()).then((j) => { _remoteOk = !!(j && j.ok); })
      .catch(() => { _remoteOk = false; });
  });
}
// 공유 상태 읽기: 연결되어 있으면 시트에서, 아니면 로컬에서.
async function pullShared() {
  if (apiUrl()) {
    const st = await remoteGet();
    if (st) { const n = normalizeRounds(st); try { await window.storage.set(KEY, JSON.stringify(n), true); } catch (e) {} return n; }
  }
  const v2 = await readShared(KEY);
  return v2 ? normalizeRounds(v2) : null;
}
// 저장된 회차 값을 ISO 날짜로 정규화(옛 "M/D" 데이터 호환).
function normalizeRounds(state) {
  Object.values(state || {}).forEach((rec) => {
    if (rec && Array.isArray(rec.rounds)) rec.rounds = rec.rounds.map(normDate);
  });
  return state;
}
async function loadState() {
  const st = await pullShared();
  if (st) return st;
  const v1 = await readShared(OLD_KEY); // 기존 데이터 있으면 승격
  if (v1) {
    const migrated = normalizeRounds(migrateV1(v1));
    try { await window.storage.set(KEY, JSON.stringify(migrated), true); } catch (e) {}
    return migrated;
  }
  return {};
}
async function mergeSave(key, patch) {
  const stamped = stamp(patch, Date.now());
  const cur = (await readShared(KEY)) || {};
  cur[key] = mergeRec(cur[key], stamped);
  try { await window.storage.set(KEY, JSON.stringify(cur), true); } catch (e) {} // 로컬 캐시(오프라인 대비)
  remotePost({ [key]: stamped }); // 연결되어 있으면 시트로
  return cur;
}
// 여러 학교 기록을 한 번에 병합 저장(가져오기용). 최신 원본을 다시 읽어 덮어쓰기 최소화.
async function bulkMergeSave(patches) {
  const ts = Date.now();
  const stampedAll = {};
  const cur = (await readShared(KEY)) || {};
  Object.entries(patches).forEach(([key, patch]) => { const s = stamp(patch, ts); stampedAll[key] = s; cur[key] = mergeRec(cur[key], s); });
  try { await window.storage.set(KEY, JSON.stringify(cur), true); } catch (e) {}
  remotePost(stampedAll);
  return cur;
}

// 따옴표·쉼표·개행을 처리하는 최소 CSV 파서. 반환: 행 배열(각 행은 셀 문자열 배열).
function parseCSV(text) {
  const s = text.replace(/^﻿/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const rows = [];
  let row = [], cell = "", q = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (q) {
      if (ch === '"') { if (s[i + 1] === '"') { cell += '"'; i++; } else q = false; }
      else cell += ch;
    } else {
      if (ch === '"') q = true;
      else if (ch === ",") { row.push(cell); cell = ""; }
      else if (ch === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; }
      else cell += ch;
    }
  }
  if (cell !== "" || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((c) => c !== ""));
}

const emptyRec = () => ({ status: "미방문", rounds: ["", "", "", "", "", ""], visitors: ["", "", "", "", "", ""], interest: "", reaction: "", next: "", memo: "" });
const pad2 = (n) => String(n).padStart(2, "0");
const todayISO = () => { const d = new Date(); return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; };
const todayStr = () => todayISO(); // (하위호환용 별칭)
// 저장 키: 학교명+지역 (동명 학교 구분)
const keyOf = (s) => `${s.n}|${s.g}`;
// 회차 날짜 정규화: 옛 형식 "M/D" → "올해-MM-DD", ISO는 그대로, 그 외 빈 값.
const normDate = (v) => {
  const t = String(v == null ? "" : v).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return t;
  const md = t.match(/^(\d{1,2})\/(\d{1,2})$/);
  if (md) return `${new Date().getFullYear()}-${pad2(md[1])}-${pad2(md[2])}`;
  const ymd = t.match(/^(\d{4})[.\/](\d{1,2})[.\/](\d{1,2})$/);
  if (ymd) return `${ymd[1]}-${pad2(ymd[2])}-${pad2(ymd[3])}`;
  return t ? t : "";
};
// 화면 표시용 짧은 날짜: "2027-03-05" → "3/5"
const shortDate = (v) => { const m = String(v || "").match(/^\d{4}-(\d{2})-(\d{2})$/); return m ? `${+m[1]}/${+m[2]}` : (v || ""); };

export default function App() {
  const [state, setState] = useState({});
  const [ready, setReady] = useState(false);
  const [region, setRegion] = useState("전체");
  const [statusF, setStatusF] = useState("전체");
  const [tierF, setTierF] = useState("전체");
  const [unassignedOnly, setUnassignedOnly] = useState(false);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("priority");
  const [open, setOpen] = useState(null);
  const [msg, setMsg] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [showConn, setShowConn] = useState(false);
  const [online, setOnline] = useState(remoteStatus()); // null=로컬, true=시트 연결, false=연결 끊김
  const fileRef = useRef(null);

  const [synced, setSynced] = useState(null);

  const reload = useCallback(() => {
    setReady(false);
    loadState().then((s) => { setState(s); setReady(true); setSynced(Date.now()); setOnline(remoteStatus()); });
  }, []);
  useEffect(() => { reload(); }, [reload]);

  // 처음 여는 사람에게 사용법을 한 번 보여준다(닫으면 이 기기에서 다시 안 뜸).
  useEffect(() => {
    try { if (!localStorage.getItem(HELP_SEEN)) setShowHelp(true); } catch (e) {}
  }, []);
  const closeHelp = () => { setShowHelp(false); try { localStorage.setItem(HELP_SEEN, "1"); } catch (e) {} };

  // 팀원 변경 자동 반영: 15초마다 공유 저장소를 다시 읽어 필드별 최신값으로 병합.
  // 지금 펼쳐서 편집 중인 학교(open)는 입력 방해 방지를 위해 병합에서 제외.
  useEffect(() => {
    if (!ready) return;
    const id = setInterval(async () => {
      const remote = await pullShared();
      setOnline(remoteStatus());
      if (!remote) return;
      setState((prev) => {
        const merged = mergeState(prev, remote);
        if (open && remote[open]) merged[open] = prev[open] || merged[open]; // 편집 중 학교 보존
        return merged;
      });
      setSynced(Date.now());
    }, 15000);
    return () => clearInterval(id);
  }, [ready, open]);

  const rec = useCallback((key) => state[key] || emptyRec(), [state]);
  const update = useCallback((key, patch) => {
    const ts = Date.now();
    setState((prev) => {
      const base = prev[key] || emptyRec();
      const _t = { ...(base._t || {}) };
      Object.keys(patch).forEach((f) => { _t[f] = ts; });
      return { ...prev, [key]: { ...base, ...patch, _t } };
    });
    mergeSave(key, patch);
  }, []);

  const regions = useMemo(() => {
    const m = {};
    SCHOOLS.forEach((s) => { m[s.g] = (m[s.g] || 0) + 1; });
    return ["전체", ...Object.entries(m).sort((a, b) => b[1] - a[1]).map(([k]) => k)];
  }, []);

  const list = useMemo(() => {
    let arr = SCHOOLS.filter((s) => {
      if (region !== "전체" && s.g !== region) return false;
      if (tierF !== "전체" && s.t !== tierF) return false;
      if (unassignedOnly && s.d) return false;
      const st = rec(keyOf(s)).status;
      if (statusF !== "전체" && st !== statusF) return false;
      if (q && !s.n.includes(q)) return false;
      return true;
    });
    if (sort === "priority") arr = [...arr].sort((a, b) => b.sc - a.sc);
    else if (sort === "region") arr = [...arr].sort((a, b) => a.g.localeCompare(b.g, "ko") || b.sc - a.sc);
    else if (sort === "status") arr = [...arr].sort((a, b) => STATUS.indexOf(rec(keyOf(a)).status) - STATUS.indexOf(rec(keyOf(b)).status) || b.sc - a.sc);
    return arr;
  }, [region, statusF, tierF, unassignedOnly, q, sort, rec]);

  const stats = useMemo(() => {
    let done = 0, revisit = 0, interest = 0, brief = 0;
    SCHOOLS.forEach((s) => {
      const r = rec(keyOf(s));
      if (r.status === "방문완료") done++;
      if (r.status === "재방문필요") revisit++;
      if (r.status === "설명회예정") brief++;
      const iv = parseInt(r.interest, 10); if (!isNaN(iv)) interest += iv;
    });
    return { total: SCHOOLS.length, done, revisit, brief, interest, pct: Math.round((done / SCHOOLS.length) * 100) };
  }, [rec]);

  const exportCSV = () => {
    const head = ["순위", "학교명", "지역", "시도", "최근3년입학생수", "2026입학생수", "3학년학급수", "학생수", "대표학과", "우선순위점수", "등급", "방문상태", ...ROUND_LABELS, "관심학생수", "반응", "다음할일", "비고", ...ROUND_LABELS.map((l) => l + " 방문자")];
    const rows = [...SCHOOLS].sort((a, b) => b.sc - a.sc).map((s, i) => {
      const r = rec(keyOf(s));
      const visitors = Array.isArray(r.visitors) ? r.visitors : ["", "", "", "", "", ""];
      return [i + 1, s.n, s.g, s.s, s.y3 ?? "", s.y26 ?? "", s.c3 ?? "", s.st ?? "", s.d, s.sc, s.t, r.status, ...r.rounds, r.interest, r.reaction, r.next, r.memo, ...visitors]
        .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",");
    });
    const csv = "\uFEFF" + [head.join(","), ...rows].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "홍보진행_" + todayStr().replace("/", "-") + ".csv";
    a.click();
  };

  // CSV 가져오기: 시트/앱에서 내보낸 CSV를 읽어 방문기록만 병합(학교 목록·점수는 SCHOOLS 유지).
  const importCSV = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const rows = parseCSV(String(ev.target.result || ""));
        if (rows.length < 2) { setMsg("가져올 데이터가 없습니다."); return; }
        const head = rows[0].map((h) => h.trim());
        const col = (name) => head.indexOf(name);
        const iName = col("학교명"), iRegion = col("지역");
        if (iName < 0) { setMsg("CSV에 '학교명' 열이 없습니다. 내보내기 형식의 파일인지 확인하세요."); return; }
        // 학교명+지역으로 매칭. 지역 열이 없거나 비면 동명이 하나뿐인 학교로 매칭.
        const byKey = new Set(SCHOOLS.map(keyOf));
        const nameCount = {}; SCHOOLS.forEach((s) => { nameCount[s.n] = (nameCount[s.n] || 0) + 1; });
        const soleKey = {}; SCHOOLS.forEach((s) => { if (nameCount[s.n] === 1) soleKey[s.n] = keyOf(s); });
        const iStatus = col("방문상태"), iInterest = col("관심학생수"),
          iReact = col("반응"), iNext = col("다음할일"), iMemo = col("비고");
        const iRounds = ROUND_LABELS.map((lb) => col(lb));
        const iVisitors = ROUND_LABELS.map((lb) => col(lb + " 방문자"));
        const patches = {};
        let matched = 0, skipped = 0;
        for (let r = 1; r < rows.length; r++) {
          const cells = rows[r];
          const name = (cells[iName] || "").trim();
          if (!name) continue;
          const region = iRegion >= 0 ? (cells[iRegion] || "").trim() : "";
          let key = region ? `${name}|${region}` : null;
          if (!key || !byKey.has(key)) key = byKey.has(`${name}|${region}`) ? `${name}|${region}` : soleKey[name];
          if (!key || !byKey.has(key)) { skipped++; continue; }
          const get = (i) => (i >= 0 && cells[i] != null ? String(cells[i]).trim() : "");
          const rounds = iRounds.map((i) => normDate(get(i)));
          const visitors = iVisitors.map((i) => get(i));
          const status = get(iStatus);
          const patch = {
            rounds,
            visitors,
            interest: get(iInterest),
            reaction: get(iReact),
            next: get(iNext),
            memo: get(iMemo),
          };
          if (STATUS.includes(status)) patch.status = status;
          // 실제 내용이 있는 행만 반영(빈 행 스킵)
          const hasContent = (patch.status && patch.status !== "미방문")
            || rounds.some(Boolean) || visitors.some(Boolean) || patch.interest || patch.reaction || patch.next || patch.memo;
          if (!hasContent) continue;
          patches[key] = { ...(patches[key] || {}), ...patch };
          matched++;
        }
        if (matched === 0) { setMsg(`반영할 기록이 없습니다.${skipped ? ` (미매칭 ${skipped}행)` : ""}`); return; }
        setState((prev) => {
          const nxt = { ...prev };
          Object.entries(patches).forEach(([n, p]) => { nxt[n] = { ...(nxt[n] || emptyRec()), ...p }; });
          return nxt;
        });
        bulkMergeSave(patches);
        setMsg(`가져오기 완료 · ${matched}개 학교 반영${skipped ? ` · 미매칭 ${skipped}행 건너뜀` : ""}`);
      } catch (e) {
        setMsg("가져오기 실패: 파일을 읽을 수 없습니다.");
      }
    };
    reader.readAsText(file, "utf-8");
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

      {showHelp && <HelpOverlay onClose={closeHelp} />}
      {showConn && <ConnOverlay online={online} onClose={() => setShowConn(false)} onSaved={() => { setShowConn(false); reload(); }} />}

      {/* ===== 헤더 ===== */}
      <header style={{ background: C.ink, color: "#fff", padding: "18px 16px 14px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 2, color: C.amber, fontWeight: 700 }}>2027 신입생 모집 홍보</div>
              <h1 style={{ margin: "2px 0 0", fontSize: 21, fontWeight: 800, letterSpacing: -0.4 }}>홍보 배차판</h1>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
              {(() => {
                const t = synced ? new Date(synced).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }) : "";
                const label = online === true ? `구글시트 ${t}` : online === false ? "연결 끊김" : `이 기기 저장 ${t}`;
                const dot = online === true ? "#7FD6C8" : online === false ? C.coral : C.steelLt;
                return (
                  <button onClick={() => setShowConn(true)} title="구글시트 연결 설정"
                    style={{ fontSize: 10.5, color: C.steelLt, border: `1px solid ${C.ink2}`, padding: "3px 8px", borderRadius: 20, background: "transparent", display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 7, height: 7, borderRadius: 4, background: dot, display: "inline-block" }} />{label}
                  </button>
                );
              })()}
              <button onClick={() => setShowHelp(true)} title="사용법 보기" aria-label="사용법 보기"
                style={{ width: 26, height: 26, borderRadius: 13, border: `1px solid ${C.ink2}`, background: "transparent", color: "#fff", fontSize: 13, fontWeight: 800, lineHeight: 1 }}>?</button>
            </div>
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
            <button onClick={() => fileRef.current && fileRef.current.click()} style={{ border: `1px solid ${C.ink}`, background: "#fff", color: C.ink, borderRadius: 9, padding: "9px 12px", fontSize: 12.5, fontWeight: 700, whiteSpace: "nowrap" }}>가져오기</button>
            <button onClick={exportCSV} style={{ border: `1px solid ${C.ink}`, background: "#fff", color: C.ink, borderRadius: 9, padding: "9px 12px", fontSize: 12.5, fontWeight: 700, whiteSpace: "nowrap" }}>내보내기</button>
            <input ref={fileRef} type="file" accept=".csv,text/csv" style={{ display: "none" }}
              onChange={(e) => { const f = e.target.files && e.target.files[0]; importCSV(f); e.target.value = ""; }} />
          </div>
          {msg && (
            <div onClick={() => setMsg("")} style={{ marginTop: 8, fontSize: 12, color: C.ink, background: C.amberBg, border: `1px solid ${C.amber}`, borderRadius: 8, padding: "7px 10px", cursor: "pointer" }}>
              {msg} <span style={{ color: C.steel, marginLeft: 4 }}>(눌러서 닫기)</span>
            </div>
          )}

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
          <div className="scrollx" style={{ display: "flex", gap: 6, overflowX: "auto", marginTop: 6 }}>
            {["전체", "상", "중", "하"].map((t) => (
              <Chip key={t} active={tierF === t} onClick={() => setTierF(t)}
                label={t === "전체" ? "전체 등급" : `${t}등급`}
                dot={t !== "전체" ? TIER_COLOR[t].fg : null} />
            ))}
            <Chip active={unassignedOnly} onClick={() => setUnassignedOnly((v) => !v)} label="학과 미배정만" />
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
        {list.map((s) => {
          const k = keyOf(s);
          return (
            <SchoolCard key={k} s={s} r={rec(k)} open={open === k}
              onToggle={() => setOpen(open === k ? null : k)} onUpdate={(p) => update(k, p)} />
          );
        })}
      </main>
    </div>
  );
}

function HelpOverlay({ onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  const steps = [
    ["1", "학교를 고르세요", "목록은 진학 실적 기준 우선순위 순. 위쪽일수록 먼저 갈 학교예요."],
    ["2", "카드를 눌러 펼치세요", "방문 상태 · 회차 날짜 · 관심 학생 수 · 반응 · 다음 할 일 · 메모를 적습니다."],
    ["3", "회차는 '오늘'만 누르면 끝", "방문한 날 회차의 '오늘' 버튼을 누르면 날짜가 자동 입력돼요. (직접 날짜 선택도 가능)"],
    ["4", "찾기·좁히기", "맨 위에서 학교명 검색, 지역·상태·등급으로 필터. 카드의 지도 버튼으로 위치도 열려요."],
  ];
  return (
    <div onClick={onClose} role="dialog" aria-modal="true" aria-label="사용법"
      style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(20,36,59,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ background: "#fff", color: C.ink, borderRadius: 16, maxWidth: 420, width: "100%", maxHeight: "88vh", overflowY: "auto", boxShadow: "0 12px 40px rgba(0,0,0,0.3)" }}>
        <div style={{ background: C.ink, color: "#fff", padding: "16px 18px", borderRadius: "16px 16px 0 0" }}>
          <div style={{ fontSize: 11, letterSpacing: 2, color: C.amber, fontWeight: 700 }}>처음 오셨나요?</div>
          <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2 }}>홍보 배차판 3초 사용법</div>
        </div>
        <div style={{ padding: "14px 18px 4px" }}>
          {steps.map(([n, t, d]) => (
            <div key={n} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
              <div style={{ flexShrink: 0, width: 26, height: 26, borderRadius: 13, background: C.amberBg, color: "#9A5B00", fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO }}>{n}</div>
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 800 }}>{t}</div>
                <div style={{ fontSize: 12.5, color: C.steel, marginTop: 2, lineHeight: 1.5 }}>{d}</div>
              </div>
            </div>
          ))}
          <div style={{ fontSize: 12, color: C.steel, background: C.grayBg, borderRadius: 8, padding: "9px 11px", lineHeight: 1.5 }}>
            💾 적는 즉시 <b>자동 저장</b>돼요. 나중에 다시 보려면 오른쪽 위 <b>?</b> 를 누르세요.
          </div>
        </div>
        <div style={{ padding: "12px 18px 18px" }}>
          <button onClick={onClose} style={{ width: "100%", border: "none", background: C.ink, color: "#fff", fontSize: 15, fontWeight: 800, borderRadius: 10, padding: "12px 0" }}>시작하기</button>
        </div>
      </div>
    </div>
  );
}

function ConnOverlay({ online, onClose, onSaved }) {
  const [url, setUrl] = useState(apiUrl());
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  const save = () => { setApiUrl(url.trim()); onSaved(); };
  const disconnect = () => { setApiUrl(""); onSaved(); };
  return (
    <div onClick={onClose} role="dialog" aria-modal="true" aria-label="구글시트 연결"
      style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(20,36,59,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ background: "#fff", color: C.ink, borderRadius: 16, maxWidth: 440, width: "100%", maxHeight: "88vh", overflowY: "auto", boxShadow: "0 12px 40px rgba(0,0,0,0.3)" }}>
        <div style={{ background: C.ink, color: "#fff", padding: "16px 18px", borderRadius: "16px 16px 0 0" }}>
          <div style={{ fontSize: 11, letterSpacing: 2, color: C.amber, fontWeight: 700 }}>팀 실시간 공유</div>
          <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2 }}>구글시트 연결</div>
        </div>
        <div style={{ padding: "14px 18px 4px" }}>
          <div style={{ fontSize: 13, color: C.ink70, lineHeight: 1.6, marginBottom: 12 }}>
            공용 구글시트에 저장해 여러 명이 실시간으로 함께 씁니다. 관리자가 <b>한 번만</b> 시트에 스크립트를 붙여넣고 배포한 뒤,
            나온 <b>웹앱 주소(.../exec)</b>를 아래에 붙여넣으세요. (설정 방법은 저장소의 <b>docs/구글시트_연동.md</b> 참고)
          </div>
          <div style={{ fontSize: 11, color: C.steel, fontWeight: 700, marginBottom: 5 }}>연결 주소 (Apps Script /exec URL)</div>
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://script.google.com/macros/s/.../exec"
            style={{ width: "100%", border: `1px solid ${C.line}`, borderRadius: 8, padding: "9px 10px", fontSize: 12.5, background: "#fff", color: C.ink }} />
          <div style={{ marginTop: 10, fontSize: 12, color: online === true ? C.teal : online === false ? C.coral : C.steel, background: C.grayBg, borderRadius: 8, padding: "8px 11px", lineHeight: 1.5 }}>
            {online === true ? "● 현재 구글시트에 연결됨 — 기록이 팀과 공유됩니다."
              : online === false ? "● 주소가 있지만 연결이 안 돼요. 주소·배포 권한(모든 사용자)을 확인하세요."
              : "● 현재 이 기기에만 저장 중(공유 안 됨). 주소를 넣으면 팀 공유가 켜집니다."}
          </div>
          <div style={{ fontSize: 11.5, color: C.steel, marginTop: 8, lineHeight: 1.5 }}>
            💡 이 주소를 넣은 링크(<span style={{ fontFamily: MONO }}>?api=주소</span>)를 공유하면, 받는 분은 붙여넣기 없이 바로 연결돼요.
          </div>
        </div>
        <div style={{ padding: "12px 18px 18px", display: "flex", gap: 8 }}>
          {apiUrl() && <button onClick={disconnect} style={{ border: `1px solid ${C.line}`, background: "#fff", color: C.steel, fontSize: 13.5, fontWeight: 700, borderRadius: 10, padding: "11px 14px" }}>연결 해제</button>}
          <button onClick={save} style={{ flex: 1, border: "none", background: C.ink, color: "#fff", fontSize: 15, fontWeight: 800, borderRadius: 10, padding: "11px 0" }}>저장하고 연결</button>
        </div>
      </div>
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
  // 여러 회차에 적힌 방문자 이름을 모아 중복 제거(누가 다녀왔는지 한눈에).
  const people = Array.from(new Set((Array.isArray(r.visitors) ? r.visitors : [])
    .flatMap((v) => String(v || "").split(/[,·/]/).map((x) => x.trim()).filter(Boolean))));
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
            {s.d
              ? <span style={{ fontSize: 10.5, color: "#9A5B00", background: C.amberBg, borderRadius: 5, padding: "1px 6px", fontWeight: 700 }}>{s.d}</span>
              : <span style={{ fontSize: 10.5, color: C.steelLt, background: C.grayBg, borderRadius: 5, padding: "1px 6px", fontWeight: 700, border: `1px dashed ${C.line}` }}>학과 미배정</span>}
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
          {people.length > 0 && (
            <div style={{ fontSize: 11.5, color: C.steel, marginTop: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              👤 {people.join(", ")}
            </div>
          )}
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
          <Field label="방문 회차 (날짜 선택 · '오늘'로 빠르게 기록 · 비우면 삭제)">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 6 }}>
              {ROUND_LABELS.map((lb, i) => {
                const on = !!r.rounds[i];
                const visitors = Array.isArray(r.visitors) ? r.visitors : ["", "", "", "", "", ""];
                const setRound = (val) => { const rounds = [...r.rounds]; rounds[i] = val; onUpdate({ rounds }); };
                const clearRound = () => { const rounds = [...r.rounds]; rounds[i] = ""; const vs = [...visitors]; vs[i] = ""; onUpdate({ rounds, visitors: vs }); };
                const setVisitor = (val) => { const vs = [...visitors]; vs[i] = val; onUpdate({ visitors: vs }); };
                return (
                  <div key={i} style={{ border: `1px solid ${on ? C.amber : C.line}`, background: on ? C.amberBg : "#fff", borderRadius: 8, padding: "6px 7px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 10.5, color: on ? "#9A5B00" : C.steel, fontWeight: 700 }}>{lb}</span>
                      {on
                        ? <button onClick={clearRound} title="삭제" style={{ border: "none", background: "transparent", color: C.steel, fontSize: 13, lineHeight: 1, padding: 0 }}>✕</button>
                        : <button onClick={() => setRound(todayISO())} style={{ border: `1px solid ${C.line}`, background: "#fff", color: C.ink, borderRadius: 5, fontSize: 10, fontWeight: 700, padding: "1px 6px" }}>오늘</button>}
                    </div>
                    <input type="date" value={r.rounds[i] || ""} onChange={(e) => setRound(e.target.value)}
                      style={{ width: "100%", border: `1px solid ${C.line}`, borderRadius: 6, padding: "5px 6px", fontSize: 12.5, fontFamily: MONO, background: "#fff", color: on ? C.ink : C.steelLt }} />
                    {on && (
                      <input type="text" value={visitors[i] || ""} onChange={(e) => setVisitor(e.target.value)}
                        placeholder="방문자 (예: 홍길동, 김철수)"
                        style={{ width: "100%", marginTop: 4, border: `1px solid ${C.line}`, borderRadius: 6, padding: "5px 6px", fontSize: 12, background: "#fff", color: C.ink }} />
                    )}
                  </div>
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

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
            {(() => {
              // 지역을 붙여 검색 정확도를 높인다. 좌표(lat/lng)가 있으면 길찾기까지 제공.
              const query = encodeURIComponent(`${s.n} ${s.g}`);
              const hasGeo = s.lat != null && s.lng != null;
              const btn = { display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, color: C.ink, fontWeight: 700, textDecoration: "none", border: `1px solid ${C.line}`, borderRadius: 8, padding: "8px 11px", background: "#fff" };
              return (
                <>
                  <a href={`https://map.naver.com/p/search/${query}`} target="_blank" rel="noreferrer" style={btn}>📍 네이버지도</a>
                  <a href={`https://map.kakao.com/?q=${query}`} target="_blank" rel="noreferrer" style={btn}>🗺️ 카카오맵</a>
                  {hasGeo && (
                    <a href={`https://map.naver.com/p/directions/-/${s.lng},${s.lat},${encodeURIComponent(s.n)}/-/transit`} target="_blank" rel="noreferrer" style={{ ...btn, borderColor: C.amber, color: "#9A5B00", background: C.amberBg }}>🚗 길찾기</a>
                  )}
                </>
              );
            })()}
          </div>
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
