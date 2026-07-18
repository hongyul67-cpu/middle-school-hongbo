/**
 * 홍보 배차판 ↔ 구글시트 실시간 연동 (Google Apps Script 웹앱)
 *
 * 설치(관리자, 1회):
 *   1) 새 구글 스프레드시트 만들기
 *   2) 확장 프로그램 > Apps Script → 이 코드 전체를 붙여넣고 저장
 *   3) 배포 > 새 배포 > 유형 "웹 앱"
 *        - 실행 계정: 나
 *        - 액세스 권한: "모든 사용자"
 *      → 배포 → 웹 앱 URL(.../exec) 복사
 *   4) 앱(홍보 배차판) 우측 상단 "연결"에 그 URL을 붙여넣기
 *      (또는 링크 뒤에 ?api=URL 을 붙여 공유하면 자동 연결)
 *
 * 저장 위치: 이 스프레드시트의 "기록" 시트(사람이 읽을 수 있는 행). 맨 끝 _t 열은 병합용(숨김).
 * 개인정보(대상 학교의 교사·학생)는 다루지 않는다. 방문자는 우리 담당자명(내부 운영용).
 */

var SHEET_NAME = '기록';
var FIELDS = ['status', 'rounds', 'visitors', 'interest', 'reaction', 'next', 'memo'];
var ROUND_N = 6;
var HEAD = ['학교명', '지역', '방문상태',
  '1차', '2차', '3차', '4차', '5차', '6차',
  '관심학생수', '반응', '다음할일', '비고',
  '1차방문자', '2차방문자', '3차방문자', '4차방문자', '5차방문자', '6차방문자', '_t'];

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, HEAD.length).setValues([HEAD]);
    sh.setFrozenRows(1);
    sh.hideColumns(HEAD.length); // _t(병합 타임스탬프) 숨김
  }
  return sh;
}

function pad_(a) { a = a || []; var o = []; for (var i = 0; i < ROUND_N; i++) o.push(a[i] != null ? String(a[i]) : ''); return o; }

function rowToRec_(row) {
  var rec = {
    status: String(row[2] || ''),
    rounds: row.slice(3, 9).map(function (v) { return v != null ? String(v) : ''; }),
    interest: String(row[9] || ''),
    reaction: String(row[10] || ''),
    next: String(row[11] || ''),
    memo: String(row[12] || ''),
    visitors: row.slice(13, 19).map(function (v) { return v != null ? String(v) : ''; })
  };
  try { rec._t = JSON.parse(row[19] || '{}'); } catch (e) { rec._t = {}; }
  return rec;
}

function recToRow_(name, region, rec) {
  var r = rec || {};
  return [name, region, r.status || '']
    .concat(pad_(r.rounds), [r.interest || '', r.reaction || '', r.next || '', r.memo || ''], pad_(r.visitors), [JSON.stringify(r._t || {})]);
}

// 필드별 최신값 병합(앱과 동일 규칙)
function mergeRec_(a, b) {
  var at = (a && a._t) || {}, bt = (b && b._t) || {}, out = {}, t = {};
  for (var i = 0; i < FIELDS.length; i++) {
    var f = FIELDS[i], ha = a && (f in a), hb = b && (f in b);
    if (hb && (!ha || (bt[f] || 0) >= (at[f] || 0))) { out[f] = b[f]; t[f] = bt[f] || at[f] || 0; }
    else if (ha) { out[f] = a[f]; t[f] = at[f] || 0; }
  }
  out._t = t;
  return out;
}

function readAll_(sh) {
  var last = sh.getLastRow(), state = {}, index = {};
  if (last < 2) return { state: state, index: index };
  var vals = sh.getRange(2, 1, last - 1, HEAD.length).getValues();
  for (var i = 0; i < vals.length; i++) {
    var name = String(vals[i][0] || '').trim();
    if (!name) continue;
    var region = String(vals[i][1] || '').trim();
    var key = name + '|' + region;
    state[key] = rowToRec_(vals[i]);
    index[key] = i + 2; // 실제 행 번호
  }
  return { state: state, index: index };
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

// 변경분(patches) 병합 저장 공통 로직
function applyPatches_(sh, patches) {
  var all = readAll_(sh);
  var keys = Object.keys(patches || {});
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var merged = mergeRec_(all.state[key], patches[key]);
    var parts = key.split('|');
    var row = recToRow_(parts[0], parts[1] || '', merged);
    if (all.index[key]) sh.getRange(all.index[key], 1, 1, HEAD.length).setValues([row]);
    else { sh.appendRow(row); all.index[key] = sh.getLastRow(); }
    all.state[key] = merged;
  }
  return keys.length;
}

// GET:
//  - 파라미터 없음 → 전체 상태 반환(읽기)
//  - patches=... → 변경분 병합 저장(브라우저 CORS 회피용 쓰기 경로)
function doGet(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sh = sheet_();
    if (e && e.parameter && e.parameter.patches) {
      var n = applyPatches_(sh, JSON.parse(e.parameter.patches));
      return json_({ ok: true, count: n });
    }
    return json_({ ok: true, state: readAll_(sh).state });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally { lock.releaseLock(); }
}

// POST(대안 경로). body: { patches: { "학교명|지역": {필드..., _t:{...}} } }
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var n = applyPatches_(sheet_(), body.patches || {});
    return json_({ ok: true, count: n });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally { lock.releaseLock(); }
}

// 열 → 필드 매핑(사람이 시트를 직접 고쳤을 때)
function colToField_(col) {
  if (col === 3) return 'status';
  if (col >= 4 && col <= 9) return 'rounds';
  if (col === 10) return 'interest';
  if (col === 11) return 'reaction';
  if (col === 12) return 'next';
  if (col === 13) return 'memo';
  if (col >= 14 && col <= 19) return 'visitors';
  return null;
}

// 시트를 사람이 직접 편집하면 해당 필드의 _t(시각)를 갱신 → 앱이 그 변경을 받아 보이게 함.
function onEdit(e) {
  try {
    var sh = e.range.getSheet();
    if (sh.getName() !== SHEET_NAME) return;
    var row = e.range.getRow(), col = e.range.getColumn();
    if (row < 2) return;
    var field = colToField_(col);
    if (!field) return; // 학교명/지역 등은 대상 아님
    var tcell = sh.getRange(row, HEAD.length); // _t 열
    var t = {};
    try { t = JSON.parse(tcell.getValue() || '{}'); } catch (_) { t = {}; }
    t[field] = Date.now();
    tcell.setValue(JSON.stringify(t));
  } catch (err) { /* 무시 */ }
}
