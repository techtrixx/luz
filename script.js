/* Luz na Palavra
   Projeto sem backend: os recursos locais funcionam no navegador.
   Dependências externas: qrcodejs (QR Pix) e bible-api.com (leitura bíblica).
*/
const CONFIG = {
  pixKey: "22998086364",
  pixKeyType: "phone", // phone, cpf, email ou random
  pixMerchantName: "LUZ NA PALAVRA",
  pixCity: "CONGONHAS",
  pixTxid: "***"
};

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

$("#year").textContent = new Date().getFullYear();

/* Menu */
$("#menuToggle").addEventListener("click", () => $("#mainNav").classList.toggle("active"));
$$("nav a").forEach(a => a.addEventListener("click", () => $("#mainNav").classList.remove("active")));

/* Modal */
const backdrop = $("#modalBackdrop");
const modalContent = $("#modalContent");
function openModal(html) {
  modalContent.innerHTML = html;
  backdrop.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeModal() {
  backdrop.classList.remove("open");
  document.body.style.overflow = "";
}
$("#modalClose").addEventListener("click", closeModal);
backdrop.addEventListener("click", e => { if(e.target === backdrop) closeModal(); });
document.addEventListener("keydown", e => { if(e.key === "Escape") closeModal(); });

/* 1 — Gerador de nomes */
const maleNames = [
  ["Adão","Gênesis","homem criado por Deus"],["Noé","Gênesis","homem associado à obediência e perseverança"],["Abraão","Gênesis","patriarca ligado à fé e à promessa"],["Isaque","Gênesis","filho da promessa"],["Jacó","Gênesis","patriarca das doze tribos de Israel"],["José","Gênesis","figura associada à sabedoria, fidelidade e superação"],["Moisés","Êxodo","líder do povo no Êxodo"],["Josué","Josué","líder que conduziu Israel após Moisés"],["Samuel","1 Samuel","profeta e juiz de Israel"],["Davi","1 Samuel","rei conhecido na narrativa bíblica por sua trajetória de fé"],["Salomão","1 Reis","rei associado à sabedoria"],["Elias","1 Reis","profeta que aparece em momentos decisivos"],["Isaías","Isaías","profeta cujo livro anuncia esperança e restauração"],["Jeremias","Jeremias","profeta ligado à perseverança"],["Daniel","Daniel","personagem associado à fidelidade em meio a desafios"],["Ezequiel","Ezequiel","profeta associado a visões e esperança"],["Neemias","Neemias","líder ligado à reconstrução de Jerusalém"],["Ester","Ester","rainha que protegeu seu povo"],["Jonas","Jonas","profeta cuja história fala de missão e misericórdia"],["Mateus","Mateus","discípulo e nome tradicionalmente ligado ao Evangelho"],["Marcos","Marcos","nome ligado ao segundo Evangelho"],["Lucas","Lucas","nome ligado ao terceiro Evangelho"],["João","João","discípulo e autor tradicional do quarto Evangelho"],["Paulo","Atos","apóstolo e missionário do Novo Testamento"],["Timóteo","1 Timóteo","cooperador de Paulo nas primeiras comunidades cristãs"],["Tito","Tito","cooperador de Paulo"],["Lázaro","João","personagem do relato da ressurreição em Betânia"],["Natanael","João","discípulo apresentado no Evangelho de João"]
];
const femaleNames = [
  ["Sara","Gênesis","matriarca associada à promessa"],["Rebeca","Gênesis","matriarca apresentada na narrativa de Isaque"],["Raquel","Gênesis","matriarca de Israel"],["Lia","Gênesis","matriarca de Israel"],["Miriã","Êxodo","profetisa e irmã de Moisés"],["Débora","Juízes","profetisa e juíza de Israel"],["Rute","Rute","personagem associada à lealdade e redenção"],["Ana","1 Samuel","mulher cuja oração é central na narrativa"],["Abigail","1 Samuel","mulher apresentada por sua prudência"],["Ester","Ester","rainha que protegeu seu povo"],["Noemi","Rute","personagem ligada à família e restauração"],["Hulda","2 Reis","profetisa consultada em Jerusalém"],["Maria","Lucas","mãe de Jesus na narrativa do Novo Testamento"],["Marta","Lucas","irmã de Maria e Lázaro"],["Maria Madalena","João","discípula presente na narrativa da ressurreição"],["Priscila","Atos","colaboradora no ensino cristão"],["Lídia","Atos","mulher que acolheu Paulo e seus companheiros"],["Febe","Romanos","mulher mencionada por Paulo em sua carta"],["Eunice","2 Timóteo","mãe de Timóteo mencionada por sua fé"],["Loide","2 Timóteo","avó de Timóteo mencionada por sua fé"]
];
const bookMapForDate = ["Gênesis","Êxodo","Levítico","Números","Deuteronômio","Josué","Juízes","Rute","1 Samuel","2 Samuel","1 Reis","2 Reis"];

function showNameApp() {
  openModal(`
    <h2>👶 Nome de Propósito</h2>
    <p class="modal-sub">Uma combinação lúdica entre sua data e personagens bíblicos. Não é uma previsão espiritual.</p>
    <div class="form-grid">
      <div class="form-field"><label>Data de nascimento</label><input id="babyDate" type="date" value="${new Date().toISOString().slice(0,10)}"></div>
      <div class="form-field"><label>Gênero</label><select id="babyGender"><option value="male">Masculino</option><option value="female">Feminino</option><option value="both">Qualquer</option></select></div>
    </div>
    <button class="btn primary" id="generateName" style="margin-top:16px">Gerar nome ✨</button>
    <div id="nameResult"></div>
  `);
  $("#generateName").onclick = () => {
    const date = new Date($("#babyDate").value + "T12:00:00");
    if (isNaN(date)) return;
    const gender = $("#babyGender").value;
    const pool = gender === "female" ? femaleNames : gender === "male" ? maleNames : [...maleNames,...femaleNames];
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(),0,0))/86400000);
    const idx = Math.abs(date.getFullYear()*31 + dayOfYear) % pool.length;
    const item = pool[idx];
    const book = bookMapForDate[date.getMonth()];
    $("#nameResult").innerHTML = `<div class="result-card"><div class="name-symbol">✨</div><h3>${item[0]}</h3><p><b>Livro associado à data:</b> ${book}</p><p><b>Personagem/livro:</b> ${item[1]}</p><p>${item[2]}.</p><small>O resultado usa uma regra determinística baseada no ano, dia do ano e gênero; é uma brincadeira temática e não um método bíblico de nomeação.</small></div>`;
  };
}

/* 2 — Quiz */
const quiz = [
  {q:"Qual foi o primeiro livro da Bíblia?",a:["Êxodo","Gênesis","Salmos","Mateus"],c:1,i:"📖",e:"Gênesis abre a Bíblia e relata a criação e os primeiros acontecimentos da história bíblica."},
  {q:"Quem construiu a arca?",a:["Moisés","Davi","Noé","Pedro"],c:2,i:"🛶",e:"No relato de Gênesis, Noé construiu a arca seguindo as instruções recebidas de Deus."},
  {q:"Quantos discípulos Jesus escolheu?",a:["10","11","12","13"],c:2,i:"👥",e:"Os Evangelhos apresentam doze apóstolos escolhidos por Jesus."},
  {q:"Quem derrotou Golias?",a:["Davi","Josué","Samuel","Sansão"],c:0,i:"🪨",e:"1 Samuel 17 narra Davi enfrentando Golias."},
  {q:"Qual é o último livro do Novo Testamento?",a:["Judas","Hebreus","Atos","Apocalipse"],c:3,i:"🌟",e:"Apocalipse encerra o Novo Testamento."},
  {q:"Quem recebeu os Dez Mandamentos?",a:["Abraão","Moisés","Elias","Salomão"],c:1,i:"📜",e:"Êxodo relata Moisés recebendo os mandamentos no Sinai."},
  {q:"Qual discípulo era cobrador de impostos?",a:["Mateus","João","André","Tiago"],c:0,i:"💰",e:"Mateus é apresentado como cobrador de impostos antes de seguir Jesus."},
  {q:"Em qual cidade Jesus nasceu?",a:["Jerusalém","Nazaré","Belém","Jericó"],c:2,i:"⭐",e:"Os Evangelhos de Mateus e Lucas situam o nascimento de Jesus em Belém."},
  {q:"Quem foi lançado na cova dos leões?",a:["Daniel","Ezequiel","Jonas","Neemias"],c:0,i:"🦁",e:"Daniel 6 narra Daniel na cova dos leões."},
  {q:"Qual salmo começa com 'O Senhor é o meu pastor'?",a:["Salmo 1","Salmo 23","Salmo 91","Salmo 119"],c:1,i:"🐑",e:"O conhecido início está no Salmo 23."}
];
function showQuiz() {
  openModal(`<div id="quizApp"></div>`);
  let current=0, score=0, answered=false;
  function render(){
    if(current>=quiz.length){
      const pct=Math.round(score/quiz.length*100);
      $("#quizApp").innerHTML=`<div class="tribe-result"><div class="tribe-emblem">🏆</div><h2>Quiz concluído!</h2><p>Você fez <b>${score}/${quiz.length}</b> pontos (${pct}%).</p><p class="modal-sub">Volte e jogue novamente para tentar superar sua pontuação.</p><button class="btn primary" id="restartQuiz">Jogar novamente</button></div>`;
      $("#restartQuiz").onclick=()=>{current=0;score=0;render()}; return;
    }
    const q=quiz[current];
    $("#quizApp").innerHTML=`<div class="quiz-head"><div><b>Quiz Bíblico</b><div class="modal-sub">Pergunta ${current+1} de ${quiz.length}</div></div><div class="score">⭐ ${score}</div></div><div class="quiz-progress"><span style="width:${current/quiz.length*100}%"></span></div><div class="question-illustration">${q.i}</div><div class="quiz-question">${q.q}</div><div class="answers">${q.a.map((x,i)=>`<button class="answer" data-i="${i}">${x}</button>`).join("")}</div><div class="quiz-feedback" id="quizFeedback"></div>`;
    $$(".answer").forEach(btn=>btn.onclick=()=>{
      if(answered)return; answered=true;
      const i=+btn.dataset.i;
      $$(".answer").forEach((b,n)=>{if(n===q.c)b.classList.add("correct"); if(n===i&&i!==q.c)b.classList.add("wrong")});
      if(i===q.c){score++;$("#quizFeedback").textContent="✅ Correto! +1 ponto";}else $("#quizFeedback").textContent="❌ Ainda não. "+q.e;
      setTimeout(()=>{current++;answered=false;render()},1100);
    });
  }
  render();
}

/* 3 — Tribos */
const tribes = [
  ["Rúben","🌾","associada simbolicamente à primogenitura, ao começo e à responsabilidade de abrir caminhos."],
  ["Simeão","🗡️","associada simbolicamente à intensidade, energia e firmeza diante de desafios."],
  ["Levi","📜","associada simbolicamente ao serviço, ensino e cuidado com as coisas sagradas."],
  ["Judá","🦁","associada simbolicamente à liderança, coragem e louvor."],
  ["Dã","⚖️","associada simbolicamente ao senso de justiça, avaliação e discernimento."],
  ["Naftali","🕊️","associada simbolicamente à liberdade, agilidade e capacidade de comunicar."],
  ["Gade","🛡️","associada simbolicamente à resistência, proteção e perseverança."],
  ["Aser","🌿","associada simbolicamente à alegria, abundância e gratidão."],
  ["Issacar","📚","associada simbolicamente ao aprendizado, percepção dos tempos e sabedoria."],
  ["Zebulom","⛵","associada simbolicamente a movimento, caminhos, trabalho e expansão."],
  ["José","🌱","associada simbolicamente a resiliência, administração e capacidade de florescer em situações difíceis."],
  ["Benjamim","🔥","associada simbolicamente à coragem, agilidade e intensidade."]
];
function hashString(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function showTribes(){
  openModal(`<h2>🛡️ Simulador das 12 Tribos</h2><p class="modal-sub">Experiência lúdica inspirada em símbolos atribuídos às tribos bíblicas. Não determina ancestralidade, linhagem ou identidade real.</p><div class="form-field"><label>Seu nome</label><input id="tribeName" placeholder="Digite seu nome"></div><button class="btn primary" id="drawTribe" style="margin-top:15px">Descobrir minha tribo ✨</button><div id="tribeResult"></div>`);
  $("#drawTribe").onclick=()=>{
    const name=$("#tribeName").value.trim();
    if(!name){$("#tribeResult").innerHTML=`<div class="result-card">Digite seu nome para continuar.</div>`;return}
    const t=tribes[hashString(name.toLowerCase())%tribes.length];
    const initials=name.split(/\s+/).filter(Boolean).map(x=>x[0].toUpperCase()).join("");
    $("#tribeResult").innerHTML=`<div class="result-card tribe-result"><div class="tribe-emblem">${t[1]}</div><div class="modal-sub">Perfil simbólico para ${initials}</div><h3>Tribo de ${t[0]}</h3><div class="why"><b>Por que o simulador chegou aqui?</b><br>${t[2]} O resultado é calculado de forma determinística a partir das letras do nome, para que o mesmo nome produza o mesmo resultado.</div></div>`;
  };
}

/* 4 — Palavra do dia */
const words=[
 ["Fé","Hebreus 11:1","Confiar em Deus mesmo quando ainda não enxergamos o resultado. Hoje, transforme uma preocupação em uma oração de confiança."],
 ["Esperança","Romanos 15:13","A esperança cristã aponta para Deus como fonte de alegria e paz. Procure alimentar sua mente com aquilo que fortalece essa esperança."],
 ["Sabedoria","Tiago 1:5","Quando faltar direção, peça sabedoria a Deus. Antes de decidir no impulso, pare, ore e procure bons conselhos."],
 ["Gratidão","1 Tessalonicenses 5:18","A gratidão muda a maneira de enxergar o cotidiano. Liste hoje três motivos pelos quais você pode agradecer."],
 ["Coragem","Josué 1:9","Coragem bíblica não significa ausência de medo. Significa avançar lembrando da presença e da direção de Deus."],
 ["Paz","João 14:27","A paz de Cristo não depende de todas as circunstâncias estarem resolvidas. Reserve alguns minutos para silenciar e orar."],
 ["Perseverança","Gálatas 6:9","Continue fazendo o bem sem desistir. Pequenas atitudes fiéis podem construir grandes mudanças ao longo do tempo."],
 ["Amor","1 Coríntios 13:4-7","O amor é apresentado como paciente, bondoso e perseverante. Escolha hoje uma atitude concreta de amor."],
 ["Discernimento","Filipenses 1:9-10","Peça clareza para distinguir o que é bom e agir com sabedoria. Nem toda oportunidade precisa ser aceita."],
 ["Serviço","Marcos 10:45","Jesus apresenta liderança também como serviço. Procure uma pessoa que você possa ajudar de maneira prática hoje."]
];
function showWord(){
  const item=words[Math.floor(Math.random()*words.length)];
  openModal(`<div class="word-result"><div class="name-symbol">💡</div><div class="word-big">${item[0]}</div><p class="word-ref">${item[1]}</p><p>${item[2]}</p><button class="btn primary" id="newWord">Outra palavra</button></div>`);
  $("#newWord").onclick=showWord;
}

/* 5 — Oração */
const prayers={
 prosperidade:["Pai, obrigado por tudo o que já colocaste em minhas mãos. Dá-me sabedoria para administrar meus recursos, portas de trabalho honesto, disciplina para cuidar do que recebi e generosidade para repartir com quem precisa. Que prosperidade nunca seja apenas acúmulo, mas também propósito, responsabilidade e bênção compartilhada. Em nome de Jesus, amém."],
 cura:["Senhor, coloco diante de Ti as minhas dores e limitações. Dá-me força para atravessar este momento, direção para buscar o cuidado necessário e consolo para o coração. Sustenta também minha família e as pessoas que caminham comigo. Que eu encontre paz e esperança em Tua presença. Em nome de Jesus, amém."],
 discernimento:["Deus, ilumina minha mente e meu coração. Ajuda-me a distinguir o que é verdadeiro, útil e justo. Livra-me de decisões tomadas pela pressa, medo ou orgulho. Dá-me sabedoria para ouvir bons conselhos, coragem para dizer não quando necessário e paz para seguir o caminho correto. Em nome de Jesus, amém."],
 familia:["Senhor, cuida da minha família. Ensina-nos a falar com amor, perdoar com sinceridade e servir uns aos outros. Protege nossos relacionamentos e ajuda-nos a atravessar as dificuldades com união. Que nosso lar seja um lugar de paz, respeito e fé. Em nome de Jesus, amém."],
 ansiedade:["Pai, entrego a Ti aquilo que não consigo controlar. Acalma meus pensamentos, ajuda-me a viver um dia de cada vez e mostra os próximos passos que realmente posso dar. Coloca pessoas sábias ao meu redor e dá-me serenidade para procurar ajuda quando precisar. Em nome de Jesus, amém."],
 agradecimento:["Senhor, obrigado pela vida, pelas pessoas, pelas oportunidades e até pelas lições que surgiram de momentos difíceis. Ensina-me a reconhecer Tuas bondades no cotidiano e a viver com um coração generoso. Que minha gratidão também apareça em minhas atitudes. Em nome de Jesus, amém."],
 trabalho:["Deus, abençoa meu trabalho e minhas responsabilidades. Dá-me honestidade, criatividade, organização e disposição para fazer o que está ao meu alcance. Abre caminhos profissionais saudáveis e ajuda-me a tratar cada pessoa com respeito. Que meu trabalho tenha propósito. Em nome de Jesus, amém."],
 protecao:["Senhor, guarda minha caminhada e a das pessoas que amo. Dá-nos prudência, livra-nos de perigos evitáveis e ajuda-nos a tomar decisões responsáveis. Que a confiança em Ti venha acompanhada de sabedoria e cuidado. Em nome de Jesus, amém."]
};
function showPrayer(){
  openModal(`<h2>🙏 Gerador de Oração</h2><p class="modal-sub">Escolha o tema e personalize este momento com suas próprias palavras.</p><div class="form-field"><label>Categoria</label><select id="prayerCat">${Object.keys(prayers).map(x=>`<option value="${x}">${x[0].toUpperCase()+x.slice(1)}</option>`).join("")}</select></div><button class="btn primary" id="generatePrayer" style="margin-top:15px">Gerar oração</button><div id="prayerResult"></div>`);
  function gen(){const cat=$("#prayerCat").value;$("#prayerResult").innerHTML=`<div class="result-card"><div class="prayer-text">${prayers[cat][0]}</div><button class="btn ghost" id="copyPrayer" style="margin-top:12px">Copiar oração</button></div>`;$("#copyPrayer").onclick=()=>copyText(prayers[cat][0]);}
  $("#generatePrayer").onclick=gen; gen();
}

/* App cards */
$$("[data-open]").forEach(btn=>btn.addEventListener("click",()=>({names:showNameApp,quiz:showQuiz,tribes:showTribes,word:showWord,prayer:showPrayer}[btn.dataset.open])()));

/* YouTube */
const karaoke=[
 ["Louvores Gospel","louvor gospel karaokê playback com letra"],
 ["Harpa Cristã","Harpa Cristã karaokê playback com letra"],
 ["Hinos antigos","hinos evangélicos antigos karaokê playback"],
 ["Adoração","louvores de adoração gospel karaokê"],
 ["Corinhos","corinhos de fogo gospel karaokê"],
 ["Infantil","louvor gospel infantil karaokê"]
];
let currentYoutubeQuery="";
function renderKaraoke(){
  $("#karaokeList").innerHTML=karaoke.map((x,i)=>`<button class="karaoke-item" data-q="${x[1]}"><b>${x[0]}</b><span>Pesquisar no YouTube • ${x[1]}</span></button>`).join("");
  $$(".karaoke-item").forEach(b=>b.onclick=()=>setYoutube(b.dataset.q));
}
function setYoutube(q){currentYoutubeQuery=q;$("#youtubeQuery").textContent=q;window.open("https://www.youtube.com/results?search_query="+encodeURIComponent(q),"youtubeSearch","noopener");}
$("#openYoutube").onclick=()=>{if(currentYoutubeQuery)setYoutube(currentYoutubeQuery);else window.open("https://www.youtube.com/results?search_query=karaoke+gospel","youtubeSearch","noopener")};
renderKaraoke();

/* Harpa: atalhos e busca real */
const hymnQuick=["1 — Chuvas de Graça","3 — Plena Paz","4 — Deus Velará por Ti","15 — Conversão","187 — Mais Perto Quero Estar"];
$("#harpaResults").innerHTML=hymnQuick.map(x=>`<button>${x}</button>`).join("");
$$(".quick-hymns button").forEach(b=>b.onclick=()=>searchHarpa(b.textContent));
function searchHarpa(term){const q="Harpa Cristã "+term;window.open("https://www.google.com/search?q="+encodeURIComponent(q),"harpaSearch","noopener")}
$("#searchHarpa").onclick=()=>{const q=$("#harpaSearch").value.trim();if(q)searchHarpa(q)};

/* Pix EMV */
function crc16(str){
  let crc=0xFFFF;
  for(let i=0;i<str.length;i++){
    crc^=str.charCodeAt(i)<<8;
    for(let j=0;j<8;j++) crc=(crc&0x8000)?((crc<<1)^0x1021)&0xFFFF:(crc<<1)&0xFFFF;
  }
  return crc.toString(16).toUpperCase().padStart(4,"0");
}
function tlv(id,value){return id+String(value.length).padStart(2,"0")+value}
function buildPix(){
  let key=CONFIG.pixKey;
  if(CONFIG.pixKeyType==="phone" && !key.startsWith("+55")) key="+55"+key.replace(/\D/g,"");
  const merchant=CONFIG.pixMerchantName.normalize("NFD").replace(/[\u0300-\u036f]/g,"").slice(0,25).toUpperCase();
  const city=CONFIG.pixCity.normalize("NFD").replace(/[\u0300-\u036f]/g,"").slice(0,15).toUpperCase();
  const gui=tlv("00","br.gov.bcb.pix");
  const keyField=tlv("01",key);
  const merchantAccount=tlv("26",gui+keyField);
  let payload=tlv("00","01")+tlv("01","12")+merchantAccount+tlv("52","0000")+tlv("53","986")+tlv("58","BR")+tlv("59",merchant)+tlv("60",city)+tlv("62",tlv("05",CONFIG.pixTxid));
  return payload+"6304"+crc16(payload+"6304");
}
function makeQr(){
  const el=$("#pixQr"); el.innerHTML="";
  if(window.QRCode){new QRCode(el,{text:buildPix(),width:165,height:165,colorDark:"#221b40",colorLight:"#ffffff"});}
  else el.innerHTML="<small>QR indisponível sem conexão.</small>";
}
makeQr();
async function copyText(text){try{await navigator.clipboard.writeText(text);toast("Copiado!")}catch{toast("Não foi possível copiar automaticamente.")}}
$("#copyPix").onclick=()=>copyText(CONFIG.pixKey);
function toast(msg){const t=document.createElement("div");t.className="toast";t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),1800)}

/* Bíblia */
const bibleBooks=[
["Gênesis","GEN",50],["Êxodo","EXO",40],["Levítico","LEV",27],["Números","NUM",36],["Deuteronômio","DEU",34],["Josué","JOS",24],["Juízes","JDG",21],["Rute","RUT",4],["1 Samuel","1SA",31],["2 Samuel","2SA",24],["1 Reis","1KI",22],["2 Reis","2KI",25],["1 Crônicas","1CH",29],["2 Crônicas","2CH",36],["Esdras","EZR",10],["Neemias","NEH",13],["Ester","EST",10],["Jó","JOB",42],["Salmos","PSA",150],["Provérbios","PRO",31],["Eclesiastes","ECC",12],["Cânticos","SNG",8],["Isaías","ISA",66],["Jeremias","JER",52],["Lamentações","LAM",5],["Ezequiel","EZK",48],["Daniel","DAN",12],["Oséias","HOS",14],["Joel","JOL",3],["Amós","AMO",9],["Obadias","OBA",1],["Jonas","JON",4],["Miquéias","MIC",7],["Naum","NAM",3],["Habacuque","HAB",3],["Sofonias","ZEP",3],["Ageu","HAG",2],["Zacarias","ZEC",14],["Malaquias","MAL",4],
["Mateus","MAT",28],["Marcos","MRK",16],["Lucas","LUK",24],["João","JHN",21],["Atos","ACT",28],["Romanos","ROM",16],["1 Coríntios","1CO",16],["2 Coríntios","2CO",13],["Gálatas","GAL",6],["Efésios","EPH",6],["Filipenses","PHP",4],["Colossenses","COL",4],["1 Tessalonicenses","1TH",5],["2 Tessalonicenses","2TH",3],["1 Timóteo","1TI",6],["2 Timóteo","2TI",4],["Tito","TIT",3],["Filemom","PHM",1],["Hebreus","HEB",13],["Tiago","JAS",5],["1 Pedro","1PE",5],["2 Pedro","2PE",3],["1 João","1JN",5],["2 João","2JN",1],["3 João","3JN",1],["Judas","JUD",1],["Apocalipse","REV",22]
];
const bookSelect=$("#bibleBook"), chapterSelect=$("#bibleChapter");
bibleBooks.forEach((b,i)=>bookSelect.add(new Option(b[0],i)));
function fillChapters(){
  const n=bibleBooks[+bookSelect.value][2];chapterSelect.innerHTML="";
  for(let i=1;i<=n;i++)chapterSelect.add(new Option(i,i));
}
bookSelect.addEventListener("change",fillChapters); fillChapters(); chapterSelect.value=1;
let bibleLoading=false;
async function loadBible(){
  if(bibleLoading)return;bibleLoading=true;
  const book=bibleBooks[+bookSelect.value], chapter=+chapterSelect.value;
  $("#bibleTitle").textContent=`${book[0]} ${chapter}`;
  $("#bibleContent").innerHTML=`<p class="loading">Carregando ${book[0]} ${chapter}...</p>`;
  try{
    const url=`https://bible-api.com/${book[1]}+${chapter}?translation=almeida`;
    const res=await fetch(url);
    if(!res.ok)throw new Error("HTTP "+res.status);
    const data=await res.json();
    const verses=data.verses||[];
    if(!verses.length)throw new Error("Sem versos");
    $("#bibleContent").innerHTML=verses.map(v=>`<p class="verse"><span class="verse-num">${v.verse}</span><span>${escapeHtml(v.text.trim())}</span></p>`).join("");
    const globalIndex=bibleBooks.slice(0,+bookSelect.value).reduce((s,b)=>s+b[2],0)+chapter;
    const total=bibleBooks.reduce((s,b)=>s+b[2],0);
    $("#readerProgress").style.width=Math.min(100,globalIndex/total*100)+"%";
  }catch(e){
    $("#bibleContent").innerHTML=`<div class="error">Não foi possível carregar este capítulo agora. Verifique sua conexão e tente novamente.<br><small>${e.message}</small></div>`;
  }finally{bibleLoading=false}
}
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
$("#loadBible").onclick=loadBible;
function moveChapter(dir){
  let bi=+bookSelect.value, ch=+chapterSelect.value+dir;
  if(ch<1){if(bi>0){bi--;bookSelect.value=bi;fillChapters();ch=bibleBooks[bi][2]}else return}
  if(ch>bibleBooks[bi][2]){if(bi<bibleBooks.length-1){bi++;bookSelect.value=bi;fillChapters();ch=1}else return}
  chapterSelect.value=ch;loadBible();
}
$("#prevChapter").onclick=()=>moveChapter(-1);$("#nextChapter").onclick=()=>moveChapter(1);
loadBible();

/* Versículo diário — referências e pequenas citações curtas */
const dailyRefs=[
["Salmo 23:1","O Senhor é o meu pastor; nada me faltará."],
["Provérbios 3:5","Confia no Senhor de todo o teu coração."],
["Isaías 41:10","Não temas, porque eu sou contigo."],
["Mateus 11:28","Vinde a mim, todos os que estais cansados."],
["Filipenses 4:13","Posso todas as coisas naquele que me fortalece."],
["Salmo 46:1","Deus é o nosso refúgio e fortaleza."],
["Romanos 12:12","Alegrai-vos na esperança, sede pacientes na tribulação."]
];
function daily(){const v=dailyRefs[Math.floor(Math.random()*dailyRefs.length)];$("#dailyVerseRef").textContent=v[0];$("#dailyVerseText").textContent="“"+v[1]+"”"}
$("#newDailyVerse").onclick=daily;daily();
