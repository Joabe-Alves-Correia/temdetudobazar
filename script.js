// ============================================================
//  TEM DE TUDO BAZAR — script.js
// ============================================================

/* ---------- LOADER ---------- */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hide');
  }, 1900);
});

/* ---------- NAVBAR: scroll + active link ---------- */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  // Encolhe navbar
  nav.classList.toggle('scroll', window.scrollY > 60);

  // Botão scroll-top
  document.getElementById('stb').classList.toggle('show', window.scrollY > 400);

  // Active link por seção
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  document.querySelectorAll('.nl a').forEach(a => {
    a.classList.toggle('on', a.getAttribute('href') === '#' + current);
  });

  // Scroll reveal
  revealElements();

  // Contador de stats (dispara uma vez)
  triggerCounters();
});

/* ---------- MENU MOBILE ---------- */
function toggleMenu() {
  document.getElementById('ham').classList.toggle('on');
  document.getElementById('mm').classList.toggle('on');
}

/* ---------- SCROLL REVEAL ---------- */
function revealElements() {
  document.querySelectorAll('.reveal:not(.vis)').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) el.classList.add('vis');
  });
}
revealElements(); // roda na carga

/* ---------- PARALLAX suave no hero ---------- */
const o1 = document.querySelector('.o1');
const o2 = document.querySelector('.o2');
window.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth  - 0.5) * 30;
  const y = (e.clientY / window.innerHeight - 0.5) * 30;
  if (o1) o1.style.transform = `translate(${x}px, ${y}px)`;
  if (o2) o2.style.transform = `translate(${-x}px, ${-y}px)`;
});

/* ---------- STATUS DA LOJA (horário real) ---------- */
function checkLojaStatus() {
  const agora  = new Date();
  const dia    = agora.getDay();   // 0=dom, 1=seg … 6=sáb
  const hora   = agora.getHours();
  const min    = agora.getMinutes();
  const hAtual = hora + min / 60;

  const aberta = dia >= 1 && dia <= 6 && hAtual >= 8 && hAtual < 18;
  const el     = document.getElementById('lojaStatus');
  if (!el) return;
  el.textContent  = aberta ? '🟢 Aberta agora' : '🔴 Fechada';
  el.className    = 'ls ' + (aberta ? 'ab' : 'fc');
}
checkLojaStatus();

/* ---------- MARCAR DIA DE HOJE NA TABELA ---------- */
function marcarHoje() {
  const dias = ['domingo','segunda','terca','quarta','quinta','sexta','sabado'];
  const hoje = dias[new Date().getDay()];
  const linha = document.getElementById('dia-' + hoje);
  if (linha) linha.classList.add('hj');
}
marcarHoje();

/* ---------- FILTRO DE PRODUTOS ---------- */
function filtrar(cat, btn) {
  // Atualiza botão ativo
  document.querySelectorAll('.fbtn').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');

  // Mostra/oculta cards
  const cards = document.querySelectorAll('.pc');
  let visiveis = 0;
  cards.forEach(c => {
    const match = cat === 'todos' || c.dataset.cat === cat;
    c.classList.toggle('hide', !match);
    if (match) visiveis++;
  });

  // Mensagem sem resultado
  const sem = document.getElementById('semRes');
  if (sem) sem.style.display = visiveis === 0 ? 'block' : 'none';

  toast(`🔍 ${visiveis} produto(s) encontrado(s)`, 'info');
}

/* ---------- FILTRAR E ROLAR (clique nas tags/categorias) ---------- */
function filtrarIr(cat) {
  // Rola até a seção de produtos
  document.getElementById('destaques').scrollIntoView({ behavior: 'smooth' });

  // Aguarda o scroll antes de filtrar
  setTimeout(() => {
    const btn = [...document.querySelectorAll('.fbtn')]
      .find(b => b.textContent.toLowerCase().includes(cat) ||
                 b.onclick?.toString().includes(cat));
    // Aciona o botão correto
    document.querySelectorAll('.fbtn').forEach(b => {
      if (b.getAttribute('onclick') && b.getAttribute('onclick').includes(`'${cat}'`)) {
        b.click();
      }
    });
  }, 700);
}

/* ---------- FAVORITAR PRODUTO (wishlist) ---------- */
function curtir(btn) {
  btn.classList.toggle('on');
  const liked = btn.classList.contains('on');
  btn.innerHTML = liked ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
  toast(liked ? '❤️ Adicionado aos favoritos!' : '🤍 Removido dos favoritos', liked ? 'g' : 'info');
}

/* ---------- TOAST NOTIFICATIONS ---------- */
function toast(msg, tipo = 'info') {
  const container = document.getElementById('toasts');
  const el = document.createElement('div');
  el.className = `toast ${tipo}`;
  el.textContent = msg;
  container.appendChild(el);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => el.classList.add('show'));
  });

  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 400);
  }, 3000);
}

/* ---------- CONTADORES ANIMADOS (stats) ---------- */
let contadoresRodados = false;
function triggerCounters() {
  if (contadoresRodados) return;
  const sbar = document.querySelector('.sbar');
  if (!sbar) return;
  const rect = sbar.getBoundingClientRect();
  if (rect.top > window.innerHeight) return;

  contadoresRodados = true;
  document.querySelectorAll('.counter').forEach(el => {
    const target = +el.dataset.target;
    const duracao = 1800;
    const passo   = 16;
    const incremento = target / (duracao / passo);
    let atual = 0;

    const timer = setInterval(() => {
      atual += incremento;
      if (atual >= target) {
        atual = target;
        clearInterval(timer);
      }
      // Formata número
      el.textContent = target >= 1000
        ? (atual / 1000).toFixed(1).replace('.', ',') + 'K'
        : Math.floor(atual);
    }, passo);
  });
}

/* ---------- COUNTDOWN PROMO ---------- */
function iniciarCountdown() {
  // Define data alvo (30 dias a partir de hoje)
  const alvo = new Date();
  alvo.setDate(alvo.getDate() + 30);
  alvo.setHours(23, 59, 59, 0);

  function atualizar() {
    const agora = new Date();
    const diff  = alvo - agora;

    if (diff <= 0) {
      ['cdD','cdH','cdM','cdS'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '00';
      });
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000)  / 60000);
    const s = Math.floor((diff % 60000)    / 1000);

    const fmt = n => String(n).padStart(2, '0');
    const setEl = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = fmt(val);
    };

    setEl('cdD', d);
    setEl('cdH', h);
    setEl('cdM', m);
    setEl('cdS', s);
  }

  atualizar();
  setInterval(atualizar, 1000);
}
iniciarCountdown();

/* ---------- SCROLL TO TOP ---------- */
document.getElementById('stb').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---------- FORMULÁRIO DE CONTATO ---------- */
function validarForm(e) {
  e.preventDefault();
  let ok = true;

  // Nome
  const nome = document.getElementById('fNome');
  const nomeErr = document.getElementById('errNome');
  if (!nome || nome.value.trim().length < 3) {
    nome?.classList.add('err');
    if (nomeErr) { nomeErr.classList.add('show'); nomeErr.textContent = 'Digite seu nome completo.'; }
    ok = false;
  } else {
    nome?.classList.remove('err');
    nomeErr?.classList.remove('show');
  }

  // WhatsApp
  const wpp = document.getElementById('fWpp');
  const wppErr = document.getElementById('errWpp');
  const wppVal = wpp?.value.replace(/\D/g,'') || '';
  if (wppVal.length < 10) {
    wpp?.classList.add('err');
    if (wppErr) { wppErr.classList.add('show'); wppErr.textContent = 'Digite um número válido.'; }
    ok = false;
  } else {
    wpp?.classList.remove('err');
    wppErr?.classList.remove('show');
  }

  // Mensagem
  const msg = document.getElementById('fMsg');
  const msgErr = document.getElementById('errMsg');
  if (!msg || msg.value.trim().length < 10) {
    msg?.classList.add('err');
    if (msgErr) { msgErr.classList.add('show'); msgErr.textContent = 'Escreva uma mensagem com ao menos 10 caracteres.'; }
    ok = false;
  } else {
    msg?.classList.remove('err');
    msgErr?.classList.remove('show');
  }

  if (!ok) return;

  // Simula envio
  const btn = document.getElementById('btnEnviar');
  const sp  = document.getElementById('spinner');
  if (btn) btn.disabled = true;
  if (sp)  sp.classList.add('show');

  setTimeout(() => {
    if (sp)  sp.classList.remove('show');
    if (btn) btn.disabled = false;

    // Monta link WhatsApp
    const assunto = document.getElementById('fAssunto')?.value || 'Contato';
    const texto   = encodeURIComponent(
      `Olá! Meu nome é ${nome.value.trim()}.\nAssunto: ${assunto}\n${msg.value.trim()}`
    );
    window.open(`https://wa.me/5581999577961?text=${texto}`, '_blank');

    // Limpa form
    document.getElementById('formContato').reset();
    document.getElementById('charCount').textContent = '0/300';
    toast('✅ Mensagem enviada! Redirecionando para o WhatsApp...', 'g');
  }, 1400);
}

/* ---------- CONTADOR DE CARACTERES ---------- */
function contarChars() {
  const msg = document.getElementById('fMsg');
  const cc  = document.getElementById('charCount');
  if (!msg || !cc) return;
  msg.addEventListener('input', () => {
    cc.textContent = `${msg.value.length}/300`;
    if (msg.value.length > 300) msg.value = msg.value.substring(0, 300);
  });
}
contarChars();

/* ---------- MÁSCARA DE TELEFONE ---------- */
function mascaraTel() {
  const el = document.getElementById('fWpp');
  if (!el) return;
  el.addEventListener('input', () => {
    let v = el.value.replace(/\D/g, '').substring(0, 11);
    if (v.length > 6) {
      v = `(${v.substring(0,2)}) ${v.substring(2,7)}-${v.substring(7)}`;
    } else if (v.length > 2) {
      v = `(${v.substring(0,2)}) ${v.substring(2)}`;
    }
    el.value = v;
  });
}
mascaraTel();

/* ---------- COOKIE BANNER ---------- */
function initCookie() {
  if (localStorage.getItem('cookie_ok')) return;
  setTimeout(() => {
    document.getElementById('ck')?.classList.add('show');
  }, 2500);
}
function aceitarCookie() {
  localStorage.setItem('cookie_ok', '1');
  document.getElementById('ck')?.classList.remove('show');
  toast('🍪 Preferências salvas!', 'g');
}
initCookie();

/* ---------- POSTS DO INSTAGRAM (efeito de clique) ---------- */
document.querySelectorAll('.ic').forEach(post => {
  post.addEventListener('click', () => {
    window.open('https://www.instagram.com/temdetudobazar_ofc/', '_blank');
  });
});