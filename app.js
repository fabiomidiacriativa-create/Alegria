/* ===== CONFIG ===== */
// Nomes que podem entrar (sem acento/maiúscula não importa). EDITE AQUI.
const ADMINS = ["Fábio", "Admin 2", "Admin 3", "Admin 4", "Admin 5"];

const DIAS = [
  { k: "terca", nome: "Terça", dow: 2, cor: "var(--blue)" },
  { k: "sexta", nome: "Sexta", dow: 5, cor: "var(--or)" },
  { k: "domingo", nome: "Domingo", dow: 0, cor: "var(--lime)" },
];
const COLS = [
  { k: "ideia", nome: "Ideias", cor: "var(--blue)" },
  { k: "fazendo", nome: "Em andamento", cor: "var(--or)" },
  { k: "espera", nome: "Aguardando", cor: "var(--yel)" },
  { k: "pronto", nome: "Concluído", cor: "var(--grn)" },
];
const BOARDS = [
  { k: "mkt", nome: "Marketing", ph: "Ex.: Boné oficial do grupo", sub: "Bonés, camisetas, adesivos, brindes" },
  { k: "novos", nome: "Novos pedais", ph: "Ex.: Rota da Serra", sub: "Possíveis pedais e reconhecimentos" },
  { k: "tarefas", nome: "Tarefas", ph: "Ex.: Renovar seguro do grupo", sub: "Ideias que não podemos perder" },
];
const CATS = ["Restaurante", "Cafeteria", "Padaria", "Lanchonete", "Micro-ônibus", "Van", "Outros"];
const CAT_EMOJI = { Restaurante: "🍽️", Cafeteria: "☕", Padaria: "🥖", Lanchonete: "🍔", "Micro-ônibus": "🚌", Van: "🚐", Outros: "📇" };
const KEY = "alegria_v1", USER_KEY = "alegria_user";

/* ===== UTIL ===== */
const $ = (s, r = document) => r.querySelector(s);
const uid = () => Math.random().toString(36).slice(2, 9);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").trim().toLowerCase();
const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const pad = (n) => String(n).padStart(2, "0");
const iso = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const fdate = (s) => parse(s).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", "");
const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const mlabel = (ym) => { const [y, m] = ym.split("-"); return `${MESES[+m - 1]}/${y.slice(2)}`; };
const daysSince = (s) => Math.floor((Date.now() - parse(s).getTime()) / 864e5);
const digits = (s) => (s || "").replace(/\D/g, "");
const sumBy = (arr, f) => arr.reduce((a, x) => a + f(x), 0);

const IC = {
  home: '<path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
  wallet: '<path d="M3 7a2 2 0 0 1 2-2h14v4"/><path d="M3 7v11a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/><path d="M21 9H5a2 2 0 0 1-2-2"/><circle cx="17" cy="14" r="1.2"/>',
  bike: '<circle cx="5.5" cy="17" r="3.5"/><circle cx="18.5" cy="17" r="3.5"/><path d="M5.5 17l4-8h6l3 8M9.5 9L12 17M14 6h3"/>',
  board: '<rect x="3" y="4" width="5" height="16" rx="1.5"/><rect x="9.5" y="4" width="5" height="10" rx="1.5"/><rect x="16" y="4" width="5" height="13" rx="1.5"/>',
  more: '<circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/>',
  grip: '<circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/>',
};
const icon = (n, fill = false) => `<svg viewBox="0 0 24 24" fill="${fill ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${IC[n]}</svg>`;

/* ===== STATE ===== */
function seed() {
  const t = iso();
  const p = (nome, km, nivel, obs = "") => ({ id: uid(), nome, km, nivel, obs, ultimo: "" });
  return {
    caixa: [
      { id: uid(), tipo: "in", valor: 300, desc: "Mensalidades", origem: "Membros", data: t },
    ],
    pedais: {
      terca: [p("Pedal Exemplo A", 40, "Médio"), p("Pedal Exemplo B", 55, "Forte"), p("Pedal Exemplo C", 30, "Leve")],
      sexta: [p("Pedal Exemplo D", 45, "Médio"), p("Pedal Exemplo E", 35, "Leve")],
      domingo: [p("Pedal Exemplo F", 70, "Forte"), p("Pedal Exemplo G", 50, "Médio"), p("Pedal Exemplo H", 60, "Médio")],
    },
    viagens: [],
    contatos: [],
    boards: {
      mkt: [{ id: uid(), titulo: "Boné oficial do grupo", desc: "Cotar 3 fornecedores", contato: "", status: "ideia", criado: t, mov: t }],
      novos: [],
      tarefas: [],
    },
  };
}
let S = load();
function load() { try { return JSON.parse(localStorage.getItem(KEY)) || seed(); } catch { return seed(); } }
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { toast("Não foi possível salvar"); } }
let user = localStorage.getItem(USER_KEY);

/* ===== TOAST / SHEET ===== */
let tt;
function toast(m) { const t = $("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 2200); }
function openSheet(html) { $("#sheet").innerHTML = html; $("#sheetWrap").classList.add("open"); $("#sheetWrap").setAttribute("aria-hidden", "false"); }
function closeSheet() { $("#sheetWrap").classList.remove("open"); $("#sheetWrap").setAttribute("aria-hidden", "true"); }
$("#sheetWrap").addEventListener("click", (e) => { if (e.target.id === "sheetWrap") closeSheet(); });

/* generic form: fields [{k,label,type,options,ph,required}] */
function form({ title, fields, values = {}, onSave, onDelete, saveLabel = "Salvar" }) {
  const f = (x) => {
    const v = values[x.k] ?? x.def ?? "";
    let inp;
    if (x.type === "textarea") inp = `<textarea name="${x.k}" placeholder="${esc(x.ph || "")}">${esc(v)}</textarea>`;
    else if (x.type === "select") inp = `<select name="${x.k}">${x.options.map((o) => `<option ${o === v ? "selected" : ""}>${esc(o)}</option>`).join("")}</select>`;
    else if (x.type === "checks") inp = `<div class="checks">${x.options.map((o) => `<label><input type="checkbox" name="${x.k}" value="${o.k}" ${o.on ? "checked" : ""}>${esc(o.nome)}</label>`).join("")}</div>`;
    else if (x.type === "tipo") inp = `<div class="seg2" data-tipo><button type="button" class="in ${v !== "out" ? "on" : ""}" data-v="in">＋ Entrada</button><button type="button" class="out ${v === "out" ? "on" : ""}" data-v="out">－ Saída</button></div><input type="hidden" name="${x.k}" value="${v || "in"}">`;
    else inp = `<input name="${x.k}" type="${x.type || "text"}" ${x.type === "number" ? 'step="0.01" inputmode="decimal"' : ""} ${x.type === "tel" ? 'inputmode="tel"' : ""} value="${esc(v)}" placeholder="${esc(x.ph || "")}" ${x.required ? "required" : ""}>`;
    return `<div class="field"><label>${esc(x.label)}</label>${inp}</div>`;
  };
  openSheet(`<h2>${esc(title)}</h2><form id="gf">${fields.map(f).join("")}
    <div class="row" style="margin-top:6px">${onDelete ? '<button type="button" class="btn danger" id="gdel">Excluir</button>' : ""}<button class="btn primary big" style="flex:1" type="submit">${saveLabel}</button></div></form>`);
  const fm = $("#gf");
  fm.querySelectorAll("[data-tipo] button").forEach((b) => b.addEventListener("click", () => {
    fm.querySelectorAll("[data-tipo] button").forEach((x) => x.classList.toggle("on", x === b));
    fm.elements.tipo.value = b.dataset.v;
  }));
  fm.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = {};
    fields.forEach((x) => {
      if (x.type === "checks") d[x.k] = [...fm.querySelectorAll(`[name=${x.k}]:checked`)].map((i) => i.value);
      else d[x.k] = fm.elements[x.k].value.trim();
    });
    if (onSave(d) !== false) closeSheet();
  });
  if (onDelete) $("#gdel").addEventListener("click", () => { if (confirm("Excluir este item?")) { onDelete(); closeSheet(); } });
}

/* ===== ROUTER ===== */
const TABS = [
  { k: "home", n: "Início", i: "home" },
  { k: "caixa", n: "Caixa", i: "wallet" },
  { k: "pedais", n: "Pedais", i: "bike" },
  { k: "quadros", n: "Quadros", i: "board" },
  { k: "mais", n: "Mais", i: "more" },
];
const TITLES = { home: "Início", caixa: "Caixa", pedais: "Pedais da semana", quadros: "Quadros", mais: "Mais", viagens: "Ciclo viagens", contatos: "Agenda de contatos" };
let route = "home";
const ui = { dia: null, mes: "all", board: "mkt", cat: "Todos", q: "" };

function go(r) {
  route = r; location.hash = r; closeSheet();
  const t = TABS.find((x) => x.k === r) ? r : "mais";
  $("#tabbar").innerHTML = TABS.map((x) => `<button class="tab ${x.k === t ? "on" : ""}" data-go="${x.k}">${icon(x.i)}${x.n}</button>`).join("");
  $("#viewTitle").textContent = TITLES[r] || "Alegria";
  $("#viewSub").textContent = r === "home" ? `Olá, ${user}!` : "";
  render();
  window.scrollTo({ top: 0 });
}
function render() {
  const v = $("#view"); v.style.animation = "none"; void v.offsetWidth; v.style.animation = "";
  ({ home: vHome, caixa: vCaixa, pedais: vPedais, quadros: vQuadros, mais: vMais, viagens: vViagens, contatos: vContatos }[route] || vHome)(v);
}

/* ===== HOME ===== */
const saldo = () => sumBy(S.caixa, (x) => (x.tipo === "in" ? x.valor : -x.valor));
function proximoDia() {
  const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
  for (let i = 0; i < 8; i++) {
    const d = new Date(hoje); d.setDate(d.getDate() + i);
    const dia = DIAS.find((x) => x.dow === d.getDay());
    if (dia) return { dia, date: d, offset: i };
  }
}
function ultimosMeses(n = 6) {
  const out = []; const d = new Date(); d.setDate(1);
  for (let i = n - 1; i >= 0; i--) { const x = new Date(d.getFullYear(), d.getMonth() - i, 1); out.push(`${x.getFullYear()}-${pad(x.getMonth() + 1)}`); }
  return out;
}
function pendentes() {
  const out = [];
  BOARDS.forEach((b) => S.boards[b.k].forEach((c) => { if (c.status !== "pronto") out.push({ ...c, board: b }); }));
  return out;
}
function vHome(v) {
  const nx = proximoDia();
  const lista = S.pedais[nx.dia.k].slice(0, 3);
  const quando = nx.offset === 0 ? "Hoje" : nx.offset === 1 ? "Amanhã" : nx.date.toLocaleDateString("pt-BR", { weekday: "long" });
  const meses = ultimosMeses();
  const dados = meses.map((m) => ({ m, i: sumBy(S.caixa.filter((x) => x.data.startsWith(m) && x.tipo === "in"), (x) => x.valor), o: sumBy(S.caixa.filter((x) => x.data.startsWith(m) && x.tipo === "out"), (x) => x.valor) }));
  const max = Math.max(1, ...dados.flatMap((d) => [d.i, d.o]));
  const pend = pendentes();
  const paradas = pend.filter((c) => daysSince(c.mov) >= 14);
  const sem = new Date(); sem.setDate(sem.getDate() - 7); const semIso = iso(sem);
  const wk = S.caixa.filter((x) => x.data >= semIso);
  const wkIn = sumBy(wk.filter((x) => x.tipo === "in"), (x) => x.valor), wkOut = sumBy(wk.filter((x) => x.tipo === "out"), (x) => x.valor);
  const msg = `Bom dia, galera! 🚴\n<b>${quando} tem pedal de ${nx.dia.nome}.</b> Sugestões que estão há mais tempo sem rodar:\n` +
    (lista.length ? lista.map((p, i) => `${i + 1}. ${esc(p.nome)} (${p.ultimo ? "há " + daysSince(p.ultimo) + " dias" : "nunca feito"})`).join("\n") : "Nenhum pedal cadastrado ainda.") +
    (paradas.length ? `\n\n⚠️ ${paradas.length} item(ns) parado(s) há mais de 14 dias: ${esc(paradas[0].titulo)}${paradas.length > 1 ? "…" : ""}` : "");
  v.innerHTML = `
  <div class="card hero"><small>Saldo do caixa</small><div class="big" id="saldoBig">R$ 0,00</div>
    <div class="row"><span class="pill">▲ ${brl(wkIn)} na semana</span><span class="pill">▼ ${brl(wkOut)} na semana</span></div></div>
  <div class="grid2" style="margin-bottom:14px">
    <button class="stat" data-go="quadros"><b>${pend.length}</b><span>Itens em aberto</span></button>
    <button class="stat" data-go="pedais"><b>${nx.dia.nome}</b><span>Próximo pedal · ${quando}</span></button>
  </div>
  <div class="card"><h3>Sugestão para ${quando.toLowerCase()} · ${nx.dia.nome}<button class="btn sm" data-go="pedais">Ver lista</button></h3>
    ${lista.length ? lista.map((p, i) => `<div class="item" style="background:var(--card2)"><div class="rank top">${i + 1}</div><div class="grow"><div class="t">${esc(p.nome)}</div><div class="s">${p.km} km · ${esc(p.nivel)} · ${p.ultimo ? "feito há " + daysSince(p.ultimo) + " dias" : "nunca feito"}</div></div></div>`).join("") : '<div class="empty">Cadastre pedais na aba Pedais</div>'}</div>
  <div class="card"><h3>Caixa · últimos 6 meses <span class="row"><span class="pill lime">entrada</span><span class="pill red">saída</span></span></h3>
    <div class="chart">${dados.map((d) => `<div class="col"><div class="bars"><div class="bar i" data-h="${(d.i / max) * 100}"></div><div class="bar o" data-h="${(d.o / max) * 100}"></div></div><small>${MESES[+d.m.slice(5) - 1]}</small></div>`).join("")}</div></div>
  <div class="card"><div class="bot-h">🤖 Prévia do aviso do WhatsApp (em breve)</div><div class="bot">${msg}</div></div>
  <div class="sec">Atenção</div>
  ${paradas.length ? paradas.slice(0, 4).map((c) => `<div class="item"><span class="ico" style="background:#ffc93322">⏳</span><div class="grow"><div class="t">${esc(c.titulo)}</div><div class="s">${esc(c.board.nome)} · parado há ${daysSince(c.mov)} dias</div></div></div>`).join("") : '<div class="card empty" style="padding:20px">Tudo em dia! 🎉</div>'}`;
  countUp($("#saldoBig"), saldo());
  requestAnimationFrame(() => setTimeout(() => v.querySelectorAll(".bar").forEach((b) => (b.style.height = Math.max(2, +b.dataset.h * 0.9) + "%")), 30));
}
function countUp(el, to) {
  const t0 = performance.now(), dur = 900;
  const step = (t) => { const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3); el.textContent = brl(to * e); if (p < 1 && el.isConnected) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}

/* ===== CAIXA ===== */
function vCaixa(v) {
  const meses = [...new Set(S.caixa.map((x) => x.data.slice(0, 7)))].sort().reverse();
  if (ui.mes !== "all" && !meses.includes(ui.mes)) ui.mes = "all";
  const rows = S.caixa.filter((x) => ui.mes === "all" || x.data.startsWith(ui.mes)).sort((a, b) => b.data.localeCompare(a.data) || 0);
  const ent = sumBy(rows.filter((x) => x.tipo === "in"), (x) => x.valor), sai = sumBy(rows.filter((x) => x.tipo === "out"), (x) => x.valor);
  v.innerHTML = `
  <div class="card hero"><small>Saldo atual</small><div class="big" id="saldoBig">R$ 0,00</div>
    <div class="row"><span class="pill">▲ Entradas ${brl(ent)}</span><span class="pill">▼ Saídas ${brl(sai)}</span></div></div>
  <div class="row" style="margin-bottom:14px"><button class="btn lime full big" data-mov="in">＋ Entrada</button><button class="btn danger full big" data-mov="out">－ Retirada</button></div>
  <div class="sec" style="margin-top:6px">Extrato</div>
  <div class="chips"><button class="chip ${ui.mes === "all" ? "on" : ""}" data-mes="all">Tudo</button>${meses.map((m) => `<button class="chip ${ui.mes === m ? "on" : ""}" data-mes="${m}">${mlabel(m)}</button>`).join("")}</div>
  ${rows.length ? rows.map((x) => `<div class="item" data-edit-mov="${x.id}"><span class="ico ${x.tipo}">${x.tipo === "in" ? "↗" : "↘"}</span>
    <div class="grow"><div class="t">${esc(x.desc)}</div><div class="s">${fdate(x.data)} · ${x.tipo === "in" ? "Origem" : "Motivo"}: ${esc(x.origem || "—")}</div></div>
    <div class="amount ${x.tipo}">${x.tipo === "in" ? "+" : "-"}${brl(x.valor)}</div></div>`).join("") : '<div class="empty"><div>🧾</div>Nenhum lançamento</div>'}`;
  countUp($("#saldoBig"), saldo());
}
function movForm(tipo, m) {
  form({
    title: m ? "Editar lançamento" : "Novo lançamento",
    values: m || { tipo, data: iso() },
    fields: [
      { k: "tipo", label: "Tipo", type: "tipo" },
      { k: "valor", label: "Valor (R$)", type: "number", required: true, ph: "0,00" },
      { k: "desc", label: "Descrição", required: true, ph: "Ex.: Mensalidade, Lanche do pedal" },
      { k: "origem", label: "De onde veio / causa da retirada", ph: "Ex.: João, Rifa, Compra de camisas" },
      { k: "data", label: "Data", type: "date", required: true },
    ],
    onSave: (d) => {
      d.valor = Math.abs(parseFloat(String(d.valor).replace(",", ".")));
      if (!d.valor) return false;
      if (m) Object.assign(m, d); else S.caixa.push({ id: uid(), ...d });
      save(); render(); toast("Caixa atualizado ✅");
    },
    onDelete: m && (() => { S.caixa = S.caixa.filter((x) => x !== m); save(); render(); }),
  });
}

/* ===== PEDAIS ===== */
function vPedais(v) {
  if (!ui.dia) ui.dia = proximoDia().dia.k;
  const dia = DIAS.find((d) => d.k === ui.dia), lista = S.pedais[dia.k];
  v.innerHTML = `
  <div class="seg">${DIAS.map((d) => `<button class="${d.k === ui.dia ? "on" : ""}" data-dia="${d.k}">${d.nome}</button>`).join("")}</div>
  <p class="mut" style="margin:0 4px 14px;font-size:13px">Arraste pelo ⠿ para reordenar. Os <b style="color:var(--lime)">3 primeiros</b> são as sugestões. Ao concluir, o pedal vai para o fim da fila.</p>
  <div id="plist">${lista.length ? lista.map((p, i) => pedalItem(p, i)).join("") : `<div class="empty"><div>🚵</div>Nenhum pedal na ${dia.nome}</div>`}</div>
  <button class="fab" data-add-pedal aria-label="Adicionar pedal">${icon("plus")}</button>`;
  enableDrag($("#plist"), ".item", (ids) => { S.pedais[dia.k] = ids.map((id) => lista.find((p) => p.id === id)); save(); render(); });
}
const pedalItem = (p, i) => `<div class="item" data-id="${p.id}"><div class="handle">${icon("grip")}</div><div class="rank ${i < 3 ? "top" : ""}">${i + 1}</div>
  <div class="grow" data-edit-pedal="${p.id}"><div class="t">${esc(p.nome)}</div><div class="s">${p.km || "?"} km · ${esc(p.nivel)} · ${p.ultimo ? "feito há " + daysSince(p.ultimo) + "d" : "nunca feito"}</div>${p.obs ? `<div class="s">📝 ${esc(p.obs)}</div>` : ""}</div>
  <button class="btn lime sm" data-done="${p.id}">Fizemos ✓</button></div>`;
function pedalForm(p) {
  form({
    title: p ? "Editar pedal" : "Novo pedal",
    values: p || {},
    fields: [
      { k: "nome", label: "Nome do pedal", required: true },
      { k: "km", label: "Distância (km)", type: "number" },
      { k: "nivel", label: "Nível", type: "select", options: ["Leve", "Médio", "Forte"], def: "Médio" },
      { k: "obs", label: "Observações", type: "textarea", ph: "Saída, ponto de parada, cuidados…" },
      ...(p ? [] : [{ k: "dias", label: "Em quais dias pode ser feito?", type: "checks", options: DIAS.map((d) => ({ k: d.k, nome: d.nome, on: d.k === ui.dia })) }]),
    ],
    onSave: (d) => {
      if (p) { Object.assign(p, { nome: d.nome, km: +d.km || 0, nivel: d.nivel, obs: d.obs }); }
      else { if (!d.dias.length) { toast("Escolha ao menos um dia"); return false; } d.dias.forEach((k) => S.pedais[k].push({ id: uid(), nome: d.nome, km: +d.km || 0, nivel: d.nivel, obs: d.obs, ultimo: "" })); }
      save(); render(); toast("Pedal salvo ✅");
    },
    onDelete: p && (() => { S.pedais[ui.dia] = S.pedais[ui.dia].filter((x) => x !== p); save(); render(); }),
  });
}

/* drag & drop (touch + mouse) */
function enableDrag(container, sel, onDrop) {
  if (!container) return;
  let el = null, ph = null, startY = 0, offY = 0;
  container.addEventListener("pointerdown", (e) => {
    const h = e.target.closest(".handle"); if (!h) return;
    el = h.closest(sel); const r = el.getBoundingClientRect();
    offY = e.clientY - r.top;
    ph = document.createElement("div"); ph.style.height = r.height + "px"; ph.style.marginBottom = "10px";
    el.after(ph);
    el.classList.add("drag"); el.style.position = "fixed"; el.style.width = r.width + "px"; el.style.left = r.left + "px"; el.style.top = r.top + "px";
    h.setPointerCapture(e.pointerId); h._cap = true;
    h.onpointermove = (ev) => {
      el.style.top = ev.clientY - offY + "px";
      if (ev.clientY < 90) window.scrollBy(0, -10); else if (ev.clientY > innerHeight - 110) window.scrollBy(0, 10);
      const items = [...container.querySelectorAll(sel + ":not(.drag)")];
      for (const it of items) {
        const b = it.getBoundingClientRect();
        if (ev.clientY > b.top && ev.clientY < b.bottom) { if (ev.clientY < b.top + b.height / 2) it.before(ph); else it.after(ph); break; }
      }
    };
    h.onpointerup = h.onpointercancel = () => {
      h.onpointermove = h.onpointerup = h.onpointercancel = null;
      ph.replaceWith(el); el.classList.remove("drag"); el.removeAttribute("style");
      onDrop([...container.querySelectorAll(sel)].map((n) => n.dataset.id));
      el = ph = null;
    };
  });
}

/* ===== QUADROS (kanban) ===== */
function vQuadros(v) {
  const b = BOARDS.find((x) => x.k === ui.board), cards = S.boards[b.k];
  v.innerHTML = `
  <div class="seg">${BOARDS.map((x) => `<button class="${x.k === ui.board ? "on" : ""}" data-board="${x.k}">${x.nome}</button>`).join("")}</div>
  <p class="mut" style="margin:0 4px 14px;font-size:13px">${b.sub}. Toque no card para editar e use ‹ › para avançar.</p>
  <div class="board">${COLS.map((c, ci) => { const cs = cards.filter((x) => x.status === c.k); return `<div class="colm"><h4><i style="background:${c.cor}"></i>${c.nome}<span>${cs.length}</span></h4>
    ${cs.map((x) => { const age = daysSince(x.mov); return `<div class="kc" style="--c:${c.cor}"><div data-edit-card="${x.id}"><div class="t">${esc(x.titulo)}</div>${x.desc ? `<div class="d">${esc(x.desc)}</div>` : ""}${x.contato ? `<div class="d">📞 ${esc(x.contato)}</div>` : ""}</div>
      <div class="ft">${ci > 0 ? `<button class="btn sm" data-mv="${x.id}" data-d="-1">‹</button>` : ""}${ci < 3 ? `<button class="btn sm primary" data-mv="${x.id}" data-d="1">›</button>` : ""}<span class="age ${age >= 14 && x.status !== "pronto" ? "old" : ""}">${age === 0 ? "hoje" : age + "d"}</span></div></div>`; }).join("") || '<div class="mut" style="text-align:center;padding:20px 0;font-size:13px">vazio</div>'}</div>`; }).join("")}</div>
  <button class="fab" data-add-card aria-label="Adicionar">${icon("plus")}</button>`;
}
function cardForm(c) {
  const b = BOARDS.find((x) => x.k === ui.board);
  form({
    title: c ? "Editar card" : "Nova ideia · " + b.nome,
    values: c || { status: "ideia" },
    fields: [
      { k: "titulo", label: "Título", required: true, ph: b.ph },
      { k: "desc", label: "Detalhes", type: "textarea" },
      { k: "contato", label: "Contato / fornecedor (opcional)", ph: "Nome e telefone" },
      { k: "status", label: "Status", type: "select", options: COLS.map((x) => x.k), def: "ideia" },
    ],
    onSave: (d) => {
      if (c) { if (c.status !== d.status) c.mov = iso(); Object.assign(c, d); }
      else S.boards[b.k].push({ id: uid(), ...d, criado: iso(), mov: iso() });
      save(); render(); toast("Salvo ✅");
    },
    onDelete: c && (() => { S.boards[b.k] = S.boards[b.k].filter((x) => x !== c); save(); render(); }),
  });
  // trocar valores técnicos por rótulos amigáveis
  const sel = $("#gf").elements.status;
  [...sel.options].forEach((o) => { const val = o.value; o.textContent = COLS.find((x) => x.k === val).nome; o.value = val; });
}

/* ===== MAIS ===== */
function vMais(v) {
  v.innerHTML = `<div class="menu">
    <button data-go="viagens"><span class="mi" style="background:#3d8bff26">🚐</span><div><b>Ciclo viagens</b><br><small>Van, almoço e café</small></div></button>
    <button data-go="contatos"><span class="mi" style="background:#b6f23c26">📇</span><div><b>Contatos</b><br><small>Restaurantes, vans…</small></div></button>
    <button data-export><span class="mi" style="background:#ff6b1a26">💾</span><div><b>Backup</b><br><small>Baixar dados</small></div></button>
    <button data-import><span class="mi" style="background:#ff4d8d26">📥</span><div><b>Restaurar</b><br><small>Importar backup</small></div></button>
  </div>
  <div class="card" style="margin-top:18px"><h3>💡 Ideias para as próximas versões</h3>
   <div class="s mut" style="line-height:1.7;font-size:14px">• Enquete de pedal no domingo (votação)<br>• Controle de presença e ranking de quilometragem<br>• Calendário de eventos e aniversariantes<br>• Aviso automático no WhatsApp<br>• Dados compartilhados entre os 5 admins (banco online)</div></div>
  <div class="card"><h3>Conta</h3><div class="row sb"><span>Logado como <b>${esc(user)}</b></span><button class="btn danger sm" data-logout>Sair</button></div>
  <p class="mut" style="font-size:12px;margin-top:10px">Nesta versão os dados ficam salvos só neste aparelho. Use o Backup para levar para outro celular.</p></div>
  <input type="file" id="impFile" accept="application/json" class="hidden">`;
}

/* ===== VIAGENS ===== */
function vViagens(v) {
  const sp = (em, tit, nome, resp, tel) => `<div class="sp"><span class="em">${em}</span><div class="grow"><div class="mut" style="font-size:12px;font-weight:700">${tit}</div><b>${esc(nome || "Não definido")}</b>${resp ? `<div class="mut" style="font-size:13px">Resp.: ${esc(resp)}</div>` : ""}</div>${tel ? actions(tel, nome) : ""}</div>`;
  v.innerHTML = `<button class="btn primary big full" data-add-trip style="margin-bottom:14px">＋ Nova viagem</button>
  ${S.viagens.length ? S.viagens.map((t) => `<div class="trip"><div class="trip-h"><div><h3>${esc(t.destino)}</h3><div style="opacity:.85;font-size:13px;margin-top:4px">${t.km ? t.km + " km · " : ""}${t.data ? fdate(t.data) : "sem data"}</div></div><button class="btn sm" data-edit-trip="${t.id}" style="background:#ffffff30;color:#fff">Editar</button></div>
  <div class="trip-b">${sp("🚐", "Van / Micro-ônibus", t.vanNome, t.vanResp, t.vanTel)}${sp("🍽️", "Almoço", t.almNome, t.almResp, t.almTel)}${sp("☕", "Café", t.cafNome, t.cafResp, t.cafTel)}${t.obs ? `<div class="sp"><span class="em">📝</span><div class="grow">${esc(t.obs)}</div></div>` : ""}</div></div>`).join("") : '<div class="empty"><div>🗺️</div>Cadastre a primeira ciclo viagem</div>'}`;
}
function tripForm(t) {
  const F = (k, label, type = "text", ph = "") => ({ k, label, type, ph });
  form({
    title: t ? "Editar viagem" : "Nova ciclo viagem", values: t || {},
    fields: [F("destino", "Destino / nome do pedal", "text", "Ex.: Serra do Mar"), F("data", "Data prevista", "date"), F("km", "Distância (km)", "number"),
      F("vanNome", "🚐 Van / Micro-ônibus (empresa)"), F("vanResp", "Responsável"), F("vanTel", "Telefone", "tel"),
      F("almNome", "🍽️ Local de almoço"), F("almResp", "Responsável"), F("almTel", "Telefone", "tel"),
      F("cafNome", "☕ Local de café"), F("cafResp", "Responsável"), F("cafTel", "Telefone", "tel"),
      F("obs", "Observações", "textarea")].map((f, i) => (i === 0 ? { ...f, required: true } : f)),
    onSave: (d) => { if (t) Object.assign(t, d); else S.viagens.push({ id: uid(), ...d }); save(); render(); toast("Viagem salva ✅"); },
    onDelete: t && (() => { S.viagens = S.viagens.filter((x) => x !== t); save(); render(); }),
  });
}

/* ===== CONTATOS ===== */
const actions = (tel, nome) => { const d = digits(tel), w = d.length <= 11 ? "55" + d : d; return `<div class="actions"><a class="round ph" href="tel:${d}" aria-label="Ligar para ${esc(nome)}">${icon("phone")}</a><a class="round wa" target="_blank" rel="noopener" href="https://wa.me/${w}" aria-label="WhatsApp">${icon("chat")}</a></div>`; };
function vContatos(v) {
  const q = norm(ui.q);
  const rows = S.contatos.filter((c) => (ui.cat === "Todos" || c.cat === ui.cat) && (!q || norm(c.nome + " " + (c.resp || "")).includes(q))).sort((a, b) => a.nome.localeCompare(b.nome));
  v.innerHTML = `<input id="qBox" type="search" placeholder="🔎 Buscar contato" value="${esc(ui.q)}" style="margin-bottom:12px">
  <div class="chips">${["Todos", ...CATS].map((c) => `<button class="chip ${ui.cat === c ? "on" : ""}" data-cat="${c}">${c}</button>`).join("")}</div>
  ${rows.length ? rows.map((c) => `<div class="item"><span class="ico" style="background:var(--card2)">${CAT_EMOJI[c.cat] || "📇"}</span><div class="grow" data-edit-ct="${c.id}"><div class="t">${esc(c.nome)}</div><div class="s">${esc(c.cat)}${c.resp ? " · " + esc(c.resp) : ""}</div><div class="s">${esc(c.tel || "")}</div></div>${c.tel ? actions(c.tel, c.nome) : ""}</div>`).join("") : '<div class="empty"><div>📇</div>Nenhum contato</div>'}
  <button class="fab" data-add-ct aria-label="Novo contato">${icon("plus")}</button>`;
  const qb = $("#qBox"); qb.addEventListener("input", () => { ui.q = qb.value; const p = qb.selectionStart; vContatos($("#view")); const n = $("#qBox"); n.focus(); n.setSelectionRange(p, p); });
}
function contatoForm(c) {
  form({
    title: c ? "Editar contato" : "Novo contato", values: c || { cat: ui.cat !== "Todos" ? ui.cat : "Restaurante" },
    fields: [{ k: "nome", label: "Nome do local / empresa", required: true }, { k: "cat", label: "Categoria", type: "select", options: CATS }, { k: "resp", label: "Responsável" }, { k: "tel", label: "Telefone / WhatsApp", type: "tel", ph: "(11) 91234-5678" }, { k: "obs", label: "Observações", type: "textarea", ph: "Capacidade, preços, horários…" }],
    onSave: (d) => { if (c) Object.assign(c, d); else S.contatos.push({ id: uid(), ...d }); save(); render(); toast("Contato salvo ✅"); },
    onDelete: c && (() => { S.contatos = S.contatos.filter((x) => x !== c); save(); render(); }),
  });
}

/* ===== EVENTS ===== */
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-go],[data-mov],[data-edit-mov],[data-mes],[data-dia],[data-add-pedal],[data-edit-pedal],[data-done],[data-board],[data-add-card],[data-edit-card],[data-mv],[data-add-trip],[data-edit-trip],[data-cat],[data-add-ct],[data-edit-ct],[data-export],[data-import],[data-logout]");
  if (!t) return;
  const D = t.dataset;
  if (D.go) return go(D.go);
  if (D.mov) return movForm(D.mov);
  if (D.editMov) return movForm(null, S.caixa.find((x) => x.id === D.editMov));
  if (D.mes) { ui.mes = D.mes; return render(); }
  if (D.dia) { ui.dia = D.dia; return render(); }
  if ("addPedal" in D) return pedalForm();
  if (D.editPedal) return pedalForm(S.pedais[ui.dia].find((x) => x.id === D.editPedal));
  if (D.done) {
    const l = S.pedais[ui.dia], i = l.findIndex((x) => x.id === D.done), [p] = l.splice(i, 1);
    p.ultimo = iso(); l.push(p); save(); render(); return toast(`"${p.nome}" foi para o fim da fila 🔄`);
  }
  if (D.board) { ui.board = D.board; return render(); }
  if ("addCard" in D) return cardForm();
  if (D.editCard) return cardForm(S.boards[ui.board].find((x) => x.id === D.editCard));
  if (D.mv) { const c = S.boards[ui.board].find((x) => x.id === D.mv), i = COLS.findIndex((x) => x.k === c.status) + +D.d; c.status = COLS[i].k; c.mov = iso(); save(); return render(); }
  if ("addTrip" in D) return tripForm();
  if (D.editTrip) return tripForm(S.viagens.find((x) => x.id === D.editTrip));
  if (D.cat) { ui.cat = D.cat; return render(); }
  if ("addCt" in D) return contatoForm();
  if (D.editCt) return contatoForm(S.contatos.find((x) => x.id === D.editCt));
  if ("export" in D) {
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(S, null, 1)], { type: "application/json" }));
    a.download = `alegria-backup-${iso()}.json`; a.click(); return toast("Backup baixado 💾");
  }
  if ("import" in D) return $("#impFile").click();
  if ("logout" in D) { localStorage.removeItem(USER_KEY); location.hash = ""; location.reload(); }
});
document.addEventListener("change", (e) => {
  if (e.target.id !== "impFile") return;
  const f = e.target.files[0]; if (!f) return;
  f.text().then((t) => { const d = JSON.parse(t); if (!d.caixa || !d.pedais) throw 0; if (confirm("Substituir os dados atuais pelo backup?")) { S = d; save(); go("home"); toast("Backup restaurado ✅"); } }).catch(() => toast("Arquivo inválido"));
});

/* ===== LOGIN ===== */
function enter() {
  $("#login").classList.add("hidden"); $("#app").classList.remove("hidden");
  $("#avatarBtn").textContent = user[0].toUpperCase();
  $("#avatarBtn").onclick = () => go("mais");
  go(location.hash.slice(1) in TITLES ? location.hash.slice(1) : "home");
}
$("#loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const typed = norm($("#loginName").value), hit = ADMINS.find((a) => norm(a) === typed);
  if (!hit) { const c = $(".login-card"); $("#loginErr").textContent = "Nome não autorizado."; c.classList.remove("shake"); void c.offsetWidth; c.classList.add("shake"); return; }
  user = hit; localStorage.setItem(USER_KEY, hit); enter();
});
if (user && ADMINS.includes(user)) enter(); else $("#login").classList.remove("hidden");
