'use strict';
const $ = id => document.getElementById(id);
const fmt0 = new Intl.NumberFormat('vi-VN', {maximumFractionDigits: 0});
const fmt2 = new Intl.NumberFormat('vi-VN', {maximumFractionDigits: 2});
const fmt4 = new Intl.NumberFormat('vi-VN', {maximumFractionDigits: 4});
const fmtRate = new Intl.NumberFormat('vi-VN', {useGrouping: false, maximumFractionDigits: 6});
const memoryStorage = new Map();
function stored(name) {
  try { return localStorage.getItem(name) ?? memoryStorage.get(name) ?? null; }
  catch (_) { return memoryStorage.get(name) ?? null; }
}
function remember(name, value) {
  memoryStorage.set(name, String(value));
  try { localStorage.setItem(name, String(value)); } catch (_) {}
}

// A/B always means the amount of B for ONE unit of A.
// Only explicit fiat pairs have an fx property. USDT is never fetched or
// inferred from the provider's USD rate, except the disclosed RUB convention.
const PAGES = {
  cad: {
    route: 'CAD → EUR → USDT → CAD', capital: 'CAD', highlight: 0,
    rates: [
      {label: 'EUR / CAD', unit: 'CAD', placeholder: 'Ví dụ 1,5500', receive: 'EUR', op: 'divide', fx: ['EUR', 'CAD']},
      {label: 'USDT / EUR', tag: 'P2P', unit: 'EUR', placeholder: 'Ví dụ 0,8900', receive: 'USDT', op: 'divide'},
      {label: 'USDT / CAD', tag: 'P2P', unit: 'CAD', placeholder: 'Ví dụ 1,3900', receive: 'CAD', op: 'multiply'}
    ]
  },
  try: {
    route: 'TRY → EUR → USDT → TRY', capital: 'TRY', highlight: 3,
    rates: [
      {label: 'EUR / TRY', unit: 'TRY', placeholder: 'Ví dụ 48,50', receive: 'EUR', op: 'divide', fx: ['EUR', 'TRY']},
      {label: 'USDT / EUR', tag: 'P2P', unit: 'EUR', placeholder: 'Ví dụ 0,8550', receive: 'USDT', op: 'divide'},
      {label: 'USDT / TRY', tag: 'P2P', unit: 'TRY', placeholder: 'Ví dụ 41,50', receive: 'TRY', op: 'multiply'}
    ]
  },
  vnd: {
    route: 'VND → USDT → EUR → VND', capital: 'VND', highlight: 1,
    rates: [
      {label: 'USDT / VND', tag: 'P2P', unit: 'VND', placeholder: 'Ví dụ 26.300', receive: 'USDT', op: 'divide', vndThousands: true},
      {label: 'USDT / EUR', tag: 'P2P', unit: 'EUR', placeholder: 'Ví dụ 0,8600', receive: 'EUR', op: 'multiply'},
      {label: 'EUR / VND', unit: 'VND', placeholder: 'Ví dụ 30.700', receive: 'VND', op: 'multiply', vndThousands: true, fx: ['EUR', 'VND']}
    ]
  },
  jpy: {
    route: 'VND → JPY → USDT → VND', capital: 'VND', highlight: 2,
    rates: [
      {label: 'JPY / VND', unit: 'VND', placeholder: 'Ví dụ 165,50', receive: 'JPY', op: 'divide', fx: ['JPY', 'VND']},
      {label: 'USDT / JPY', tag: 'P2P', unit: 'JPY', placeholder: 'Ví dụ 155,00', receive: 'USDT', op: 'divide'},
      {label: 'USDT / VND', tag: 'P2P', unit: 'VND', placeholder: 'Ví dụ 26.300', receive: 'VND', op: 'multiply', vndThousands: true}
    ]
  },
  rub: {
    route: 'VND → RUB → USDT → VND', capital: 'VND', highlight: 3,
    rates: [
      {label: 'RUB / VND', unit: 'VND', placeholder: 'Ví dụ 310,50', receive: 'RUB', op: 'divide', fx: ['RUB', 'VND']},
      {label: 'USD / RUB', unit: 'RUB', placeholder: 'Ví dụ 83,50', receive: 'USDT', op: 'divide', fx: ['USD', 'RUB']},
      {label: 'USDT / VND', tag: 'P2P', unit: 'VND', placeholder: 'Ví dụ 26.300', receive: 'VND', op: 'multiply', vndThousands: true}
    ]
  }
};

function migrateVndTab() {
  const legacy = {capital: 'tiendien_capitalVnd', rate1: 'tiendien_usdtVnd', rate2: 'tiendien_usdtEur', rate3: 'tiendien_eurVnd'};
  for (const id of ['capital', 'rate1', 'rate2', 'rate3']) {
    const target = `tiendien_vnd_${id}`;
    const value = stored(`tiendien_eur_${id}`) ?? stored(legacy[id]);
    if (stored(target) === null && value !== null) remember(target, value);
  }
}
migrateVndTab();
// CAD now has a different starting currency and different quote positions.
// Keep its new inputs separate so VND capital / unrelated old quotes cannot
// acquire a new currency label. Only the unchanged USDT/CAD quote migrates.
const oldUsdtCad = stored('tiendien_cad_rate2');
if (stored('tiendien_cad_eur_usdt_rate3') === null && oldUsdtCad !== null) {
  remember('tiendien_cad_eur_usdt_rate3', oldUsdtCad);
}
let page = stored('tiendien_page');
if (page === 'eur' || !PAGES[page]) page = 'vnd';

function capitalNum(value) {
  const number = Number(String(value ?? '').replace(/\D/g, ''));
  return Number.isFinite(number) ? number : 0;
}
function rateNum(value, thousands = false) {
  let text = String(value ?? '').trim().replace(/\s/g, '');
  if (!text) return 0;
  if (text.includes(',')) text = text.replace(/\./g, '').replace(',', '.');
  else if (thousands && /^\d{1,3}(?:\.\d{3})+$/.test(text)) text = text.replace(/\./g, '');
  const number = Number(text);
  return Number.isFinite(number) ? number : 0;
}
function formatCapital() {
  const digits = $('capital').value.replace(/\D/g, '');
  $('capital').value = digits ? fmt0.format(capitalNum(digits)) : '';
}
function money(value, unit) { return `${value >= 0 ? '+' : '−'}${(unit === 'CAD' ? fmt2 : fmt0).format(Math.abs(value))} ${unit}`; }
function pct(value) { return `${value >= 0 ? '+' : ''}${fmt2.format(value)}%`; }
function tone(element, value) {
  element.classList.remove('good', 'bad', 'neutral');
  element.classList.add(value > 0.01 ? 'good' : value < -0.01 ? 'bad' : 'neutral');
}
function formatReceived(value, unit) {
  if (!(value > 0 && Number.isFinite(value))) return `Nhận: — ${unit}`;
  return `Nhận: ${(unit === 'VND' || unit === 'TRY' ? fmt2 : fmt4).format(value)} ${unit}`;
}
function key(name) { return `tiendien_${page === 'cad' ? 'cad_eur_usdt' : page}_${name}`; }
function save() {
  remember(key('capital'), $('capital').value);
  PAGES[page].rates.forEach((rate, index) => {
    // Keep the last manually entered fiat quote separate from the live cache.
    if (!fxEnabled || !rate.fx) remember(key(`rate${index + 1}`), $(`rate${index + 1}`).value);
  });
}

const FX_URL = 'https://open.er-api.com/v6/latest/USD';
const FX_CACHE_KEY = 'tiendien_fx_usd_v16';
const FX_AUTO_KEY = 'tiendien_fx_auto_v16';
const FX_ATTEMPT_KEY = 'tiendien_fx_attempt_v16';
const FX_CODES = ['USD', 'EUR', 'CAD', 'TRY', 'JPY', 'VND', 'RUB'];
let fxEnabled = stored(FX_AUTO_KEY) !== '0';
let fxError = '';
let fxBusy = false;
let fxRequest = null;
let fxLastAttempt = Number(stored(FX_ATTEMPT_KEY)) || 0;

function validateFx(payload) {
  if (!payload || payload.result !== 'success' || payload.base_code !== 'USD' || !payload.rates) throw new Error('Invalid FX data');
  for (const code of FX_CODES) {
    const rate = payload.rates[code];
    if (typeof rate !== 'number' || !Number.isFinite(rate) || rate <= 0) throw new Error('Invalid FX rate');
  }
  if (Math.abs(payload.rates.USD - 1) > 0.000001) throw new Error('Invalid FX base');
  const last = payload.time_last_update_unix;
  const next = payload.time_next_update_unix;
  if (!Number.isFinite(last) || !Number.isFinite(next) || last <= 0 || next <= last || last * 1000 > Date.now() + 300000) throw new Error('Invalid FX timestamp');
  return payload;
}
function readFxCache() {
  try {
    const cached = JSON.parse(stored(FX_CACHE_KEY) || 'null');
    if (!cached || !Number.isFinite(cached.fetchedAt) || cached.fetchedAt <= 0 || cached.fetchedAt > Date.now() + 300000) return null;
    validateFx(cached.payload);
    return cached;
  } catch (_) { return null; }
}
let fxSnapshot = readFxCache();
function fxIsDue() {
  return !fxSnapshot || Date.now() >= fxSnapshot.payload.time_next_update_unix * 1000 + 60000;
}
function crossRate(base, quote) {
  if (!fxSnapshot) return 0;
  return fxSnapshot.payload.rates[quote] / fxSnapshot.payload.rates[base];
}
function applyFxToPage() {
  if (!fxEnabled || !fxSnapshot) return;
  PAGES[page].rates.forEach((rate, index) => {
    if (!rate.fx) return;
    const value = crossRate(...rate.fx);
    const input = $(`rate${index + 1}`);
    input.value = fmtRate.format(value);
    input.dataset.fxSource = 'api';
  });
}
function renderFxStatus() {
  $('fxAuto').setAttribute('aria-checked', String(fxEnabled));
  $('fxAuto').classList.toggle('enabled', fxEnabled);
  $('fxAutoText').textContent = `Tự động: ${fxEnabled ? 'Bật' : 'Tắt'}`;
  $('fxRefresh').disabled = fxBusy || !fxEnabled;
  $('fxRefresh').textContent = fxBusy ? 'Đang tải…' : 'Cập nhật';
  $('fxStatus').classList.toggle('fx-warning', Boolean(fxError) || (fxEnabled && fxIsDue() && Boolean(fxSnapshot)));
  if (!fxEnabled) {
    $('fxStatus').textContent = 'Nhập tỷ giá thủ công. Các giá có USDT luôn nhập tay.';
  } else if (fxSnapshot) {
    const date = new Intl.DateTimeFormat('vi-VN', {dateStyle: 'short', timeStyle: 'short', timeZone: 'Asia/Ho_Chi_Minh'}).format(new Date(fxSnapshot.payload.time_last_update_unix * 1000));
    const prefix = fxError ? `${fxError} · đang dùng giá lưu lúc ` : fxIsDue() ? 'Giá cũ từ ' : 'Tỷ giá lúc ';
    $('fxStatus').textContent = `${prefix}${date} (giờ VN). USDT nhập tay.`;
  } else if (fxError) {
    $('fxStatus').textContent = `${fxError}. Chưa có giá tự động; tắt Tự động để nhập tay.`;
  } else {
    $('fxStatus').textContent = fxBusy ? 'Đang lấy tỷ giá pháp định… USDT nhập tay.' : 'Chưa có tỷ giá tự động. USDT nhập tay.';
  }
  PAGES[page].rates.forEach((rate, index) => {
    const input = $(`rate${index + 1}`);
    const automatic = Boolean(rate.fx && fxEnabled);
    input.readOnly = automatic;
    input.setAttribute('aria-readonly', String(automatic));
    const tag = rate.fx ? (automatic ? (fxSnapshot ? 'TỰ ĐỘNG' : input.value ? 'ĐÃ LƯU' : 'CHỜ GIÁ') : 'NHẬP TAY') : rate.tag;
    $(`rate${index + 1}Label`).innerHTML = `${rate.label}${tag ? ` <small>${tag}</small>` : ''}`;
    input.closest('.field').classList.toggle('auto-rate', automatic);
  });
  $('resultNote').textContent = fxEnabled ? 'Ước tính theo tỷ giá tham khảo · chưa trừ phí' : 'Ước tính · chưa trừ phí giao dịch';
}

async function refreshFx({force = false} = {}) {
  if (!fxEnabled) return;
  if (fxRequest) return fxRequest;
  if (!force && !fxIsDue()) { renderFxStatus(); return; }
  const elapsed = Date.now() - fxLastAttempt;
  // One scheduled attempt every five minutes when offline/unavailable; manual
  // refresh is limited to once a minute. A fresh daily snapshot needs no poll.
  if (elapsed >= 0 && elapsed < (force ? 60000 : 300000)) { renderFxStatus(); return; }
  fxLastAttempt = Date.now();
  remember(FX_ATTEMPT_KEY, fxLastAttempt);
  fxBusy = true;
  renderFxStatus();
  fxRequest = (async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(FX_URL, {cache: 'no-store', credentials: 'omit', signal: controller.signal});
      if (!response.ok) throw new Error(response.status === 429 ? 'RATE_LIMIT' : 'FETCH_FAILED');
      const payload = validateFx(await response.json());
      if (fxSnapshot && payload.time_last_update_unix < fxSnapshot.payload.time_last_update_unix) throw new Error('Older FX response');
      fxSnapshot = {payload, fetchedAt: Date.now()};
      remember(FX_CACHE_KEY, JSON.stringify(fxSnapshot));
      fxError = '';
      // The user may have switched tabs or disabled auto while fetch awaited.
      if (fxEnabled) { applyFxToPage(); calculate(); }
    } catch (error) {
      fxError = error.message === 'RATE_LIMIT' ? 'Nguồn đang giới hạn truy cập' : 'Không tải được tỷ giá';
    } finally {
      clearTimeout(timeout);
      fxBusy = false;
      fxRequest = null;
      renderFxStatus();
    }
  })();
  return fxRequest;
}

function restorePage() {
  $('capital').value = stored(key('capital')) ?? (page === 'cad' ? '10.000' : page === 'try' ? '100.000' : '100.000.000');
  ['rate1', 'rate2', 'rate3'].forEach(id => {
    $(id).value = stored(key(id)) ?? '';
    delete $(id).dataset.fxSource;
  });
  formatCapital();
}
function renderPage() {
  const config = PAGES[page];
  $('routeText').textContent = config.route;
  $('capitalUnit').textContent = config.capital;
  config.rates.forEach((rate, index) => {
    const input = $(`rate${index + 1}`);
    $(`rate${index + 1}Unit`).textContent = rate.unit;
    input.placeholder = rate.placeholder;
    input.setAttribute('aria-label', `${rate.label}: số ${rate.unit} cho một ${rate.label.split(' / ')[0]}`);
    input.closest('.field').classList.toggle('rate-highlight', index + 1 === config.highlight);
  });
  document.querySelectorAll('.tab').forEach(button => {
    const active = button.dataset.page === page;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  $('rubNote').classList.toggle('hidden', page !== 'rub');
  remember('tiendien_page', page);
  restorePage();
  applyFxToPage();
  renderFxStatus();
  calculate();
}
function calculate() {
  const config = PAGES[page];
  const capital = capitalNum($('capital').value);
  let amount = capital;
  config.rates.forEach((rate, index) => {
    const quote = rateNum($(`rate${index + 1}`).value, Boolean(rate.vndThousands));
    amount = amount > 0 && quote > 0 ? (rate.op === 'divide' ? amount / quote : amount * quote) : 0;
    if (!Number.isFinite(amount)) amount = 0;
    $(`received${index + 1}`).textContent = formatReceived(amount, rate.receive);
  });
  if (!(capital > 0 && amount > 0)) {
    $('profit').textContent = '—'; $('roi').textContent = '—';
    $('profit').className = ''; $('roi').className = '';
  } else {
    const profit = amount - capital;
    const roi = profit / capital * 100;
    if (Number.isFinite(profit) && Number.isFinite(roi)) {
      $('profit').textContent = money(profit, config.capital);
      $('roi').textContent = pct(roi);
      tone($('profit'), profit); tone($('roi'), profit);
    } else {
      $('profit').textContent = '—'; $('roi').textContent = '—';
      $('profit').className = ''; $('roi').className = '';
    }
  }
  save();
}

$('capital').addEventListener('input', () => { formatCapital(); calculate(); });
['rate1', 'rate2', 'rate3'].forEach(id => $(id).addEventListener('input', calculate));
document.querySelectorAll('.tab').forEach(button => button.addEventListener('click', () => {
  save(); page = button.dataset.page; renderPage(); refreshFx();
}));
$('fxAuto').addEventListener('click', () => {
  save();
  fxEnabled = !fxEnabled;
  remember(FX_AUTO_KEY, fxEnabled ? '1' : '0');
  if (fxEnabled) applyFxToPage();
  else {
    PAGES[page].rates.forEach((rate, index) => {
      if (!rate.fx) return;
      const manual = stored(key(`rate${index + 1}`));
      if (manual !== null) $(`rate${index + 1}`).value = manual;
      delete $(`rate${index + 1}`).dataset.fxSource;
    });
  }
  renderFxStatus(); calculate();
  if (fxEnabled) refreshFx();
});
$('fxRefresh').addEventListener('click', () => refreshFx({force: true}));
window.addEventListener('online', () => refreshFx());
document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshFx(); });
setInterval(() => { if (!document.hidden) refreshFx(); }, 60000);

let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault(); deferredPrompt = event; $('installBtn').classList.remove('hidden');
});
$('installBtn').addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt(); await deferredPrompt.userChoice;
  deferredPrompt = null; $('installBtn').classList.add('hidden');
});

// Retire this app's old cache without touching other apps on the same origin.
(async () => {
  try {
    if ('serviceWorker' in navigator) {
      const scope = new URL('./', location.href).href;
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) if (registration.scope === scope) await registration.unregister();
    }
    if ('caches' in window) {
      for (const name of await caches.keys()) if (/^(tien-cua-dien|tiendien)[-_]/.test(name)) await caches.delete(name);
    }
  } catch (_) {}
})();
renderPage();
refreshFx();
