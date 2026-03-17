import { useState, useEffect, useRef } from "react";

// ─── DATA ───────────────────────────────────────────────────────────────────

const ARCHETYPES = {
  Curandeiro: {
    icon: "✦",
    color: "#6aafe6",
    classes: [
      "Boticário", "Bardo", "Discípulo", "Profeta", "Ceifador de Almas",
      "Orador dos Espíritos", "Cruzado (Híbrido)", "Herético (Híbrido)", "Vigia (Híbrido)"
    ],
    heroes: [
      { name: "Andira Runehand", mov: 4, hp: 12, fatigue: 4, def: "gray", str: 2, will: 4, know: 3, perc: 2, ability: "Cada vez que um herói dentro de 3 espaços de você sofrer 1 ou mais HP de um ataque, a figura que realizou o ataque sofre 1 HP.", heroicFeat: "Ação: Escolha 1 herói dentro de 3 espaços de você. Realize um ataque contra um monstro dentro de 3 espaços. O herói escolhido recupera HP igual ao dobro do dano causado.", fluff: "Eu não entendo mais por que posso ouvir os espíritos falarem do que entendo por que você não pode." },
      { name: "Ashrian", mov: 5, hp: 10, fatigue: 4, def: "gray", str: 2, will: 3, know: 2, perc: 4, ability: "Quando um monstro minion começa sua ativação adjacente a você, ele fica Atordoado.", heroicFeat: "Ação: Escolha um monstro dentro de 3 espaços de você. Cada monstro nesse grupo fica Atordoado.", fluff: "Eu não entendo mais por que posso ouvir os espíritos falarem do que entendo por que você não pode." },
      { name: "Augur Grisom", mov: 3, hp: 12, fatigue: 5, def: "gray", str: 4, will: 3, know: 2, perc: 2, ability: "Cada outro herói dentro de 3 espaços ganha: Cada vez que um monstro erra mirando você, recupere 1 HP.", heroicFeat: "Use durante seu turno. Cada herói na sua linha de visão recupera 2 HP e 2 de 💧.", fluff: "Um mar infinito de possibilidades está no que está por vir. Até mesmo um pequeno vislumbre enlouquecerá a maioria." },
      { name: "Avric Albright", mov: 4, hp: 12, fatigue: 4, def: "gray", str: 2, will: 4, know: 3, perc: 2, ability: 'Cada herói dentro de 3 espaços (incluindo você) ganha "Surto: Recupere 1 HP" em todas as jogadas de ataque.', heroicFeat: "Ação: Role 2 dados vermelhos. Cada herói dentro de 3 espaços pode recuperar HP igual ao rolado.", fluff: "Eu me dedico àqueles que precisam. Serei seu escudo, sua luz na escuridão." },
      { name: "Ispher", mov: 4, hp: 10, fatigue: 4, def: "gray", str: 2, will: 3, know: 3, perc: 3, ability: "Você não pode ser Envenenado. No início do seu turno, recupere 2 HP.", heroicFeat: "Ação: Recupere 8 HP e descarte todas as condições.", fluff: "Somos temidos, somos desprezados, mas ainda assim sou chamado para ajudar?" },
      { name: "Rendiel", mov: 5, hp: 10, fatigue: 4, def: "gray", str: 2, will: 5, know: 3, perc: 1, ability: "Cada vez que você reviver um herói, você recupera 2 HP e 2 💧.", heroicFeat: "Ação: Reviva um herói adjacente nocauteado. Ele recupera todos os HP e 💧.", fluff: "Uma melodia antiga, refinada através de incontáveis gerações... dada livremente." },
      { name: "Ulma Grimstone", mov: 4, hp: 8, fatigue: 5, def: "gray", str: 2, will: 3, know: 4, perc: 2, ability: "Heróis dentro de 3 espaços podem revelar cartas de Busca até encontrar Poção ao invés de sacar normalmente.", heroicFeat: "Use durante seu turno para virar uma Poção sua. Heróis adjacentes também podem virar uma Poção.", fluff: "A única coisa mais emocionante do que misturar uma nova poção é realmente testá-la." },
      { name: "Serena", mov: 3, hp: 8, fatigue: 6, def: "brown", str: 1, will: 5, know: 3, perc: 2, ability: "Se atacada enquanto adjacente a outro herói, ele pode sofrer 1 💧 para se tornar alvo do ataque.", heroicFeat: "Ação: Teste Vontade e Conhecimento. Para cada teste passado, heróis em 3 espaços recuperam 3 HP e 1 💧.", fluff: "Esperei em silêncio por tempo demais. Agora o mundo conhecerá minha canção." },
    ]
  },
  Mago: {
    icon: "◆",
    color: "#e8c06a",
    classes: [
      "Conjurador", "Elementalista", "Geomante", "Feiticeiro", "Necromante", "Mestre das Runas",
      "Mago de Batalha (Híbrido)", "Guardião do Conhecimento (Híbrido)", "Vidente (Híbrido)"
    ],
    heroes: [
      { name: "Astarra", mov: 4, hp: 10, fatigue: 5, def: "gray", str: 1, will: 4, know: 4, perc: 2, ability: "Uma vez por rodada, gaste 1 mov para teleportar adjacente a 1 herói dentro de 3 espaços.", heroicFeat: "Use no início do turno para mover cada outra figura dentro de 3 espaços 1 espaço.", fluff: "Você ficaria surpreso com o que pode aprender quando não tem ninguém para lhe dizer como pensar." },
      { name: "Dezra the Vile", mov: 5, hp: 8, fatigue: 4, def: "gray", str: 2, will: 2, know: 4, perc: 3, ability: "No início do turno, recupere 1 HP ou 1 💧 por monstro adjacente.", heroicFeat: "Use quando o overlord ativar um monstro adjacente. Todos os monstros adjacentes ficam imobilizados.", fluff: "Muito poucas pessoas entendem minhas habilidades. Eu prefiro assim." },
      { name: "High Mage Quellen", mov: 4, hp: 10, fatigue: 4, def: "gray", str: 1, will: 3, know: 5, perc: 2, ability: "No início do turno, escolha herói em 3 espaços. Se ele tiver 💧, recupere 1-2 💧.", heroicFeat: "Use no início do turno para +4 💧 neste turno. No final, recupere toda 💧.", fluff: "Eu me alimento da sabedoria dos outros, mesmo quando é menos satisfatório do que a minha própria." },
      { name: "Leorik of the Book", mov: 4, hp: 8, fatigue: 5, def: "gray", str: 1, will: 2, know: 5, perc: 3, ability: "Cada monstro dentro de 3 espaços recebe -1 HP em ataques (mín. 1).", heroicFeat: "Ação: Ataque mágico que ignora alcance e atinge cada figura adjacente.", fluff: "Se meus anos de estudo me ensinaram alguma coisa, é que sou digno do conhecimento que possuo." },
      { name: "Ravaella Lightfoot", mov: 4, hp: 8, fatigue: 5, def: "black", str: 1, will: 2, know: 4, perc: 4, ability: "Se rolar faces em branco na defesa, adicione 1 Escudo.", heroicFeat: "Ao ser atacada, teste Conhecimento e Percepção. +3 Escudos por teste passado.", fluff: "Estou aqui? Estou ali? Ou estou bem atrás de você?" },
      { name: "Widow Tarha", mov: 4, hp: 10, fatigue: 4, def: "gray", str: 2, will: 3, know: 4, perc: 2, ability: "Uma vez por rodada, re-role 1 dado de ataque ou poder.", heroicFeat: "Ação: Ataque que afeta 2 monstros na linha de visão. 1 rolagem, defesas separadas.", fluff: "Não tenho mais nada a perder. No entanto, ainda há muito mais poder para eu ganhar." },
    ]
  },
  Batedor: {
    icon: "◈",
    color: "#7ec8a0",
    classes: [
      "Caçador de Recompensas", "Caminhante das Sombras", "Caçador de Tesouros",
      "Mateiro", "Espreitador", "Ladrão", "Monge (Híbrido)", "Devastador (Híbrido)", "Trapaceiro (Híbrido)"
    ],
    heroes: [
      { name: "Arvel Worldwalker", mov: 4, hp: 10, fatigue: 4, def: "gray", str: 3, will: 3, know: 3, perc: 3, ability: "Ao falhar teste de atributo, recupere 1 💧. Uma vez por rodada, re-role o teste.", heroicFeat: "Devolva até 2 cartas de Classe e ganhe outras de mesmo XP.", fluff: "Minha missão permanece insatisfeita - a busca por um problema para o qual eu não sou a resposta!" },
      { name: "Jaine Fairwood", mov: 5, hp: 8, fatigue: 5, def: "gray", str: 2, will: 2, know: 3, perc: 4, ability: "Ao sofrer HP de ataque, pode converter parte ou tudo em 💧.", heroicFeat: "Ação: Mova o dobro da Velocidade e realize um ataque antes, depois ou durante.", fluff: "Aqui na selva, eu protejo aqueles que me julgaram mal." },
      { name: "Logan Lashley", mov: 4, hp: 10, fatigue: 4, def: "gray", str: 3, will: 2, know: 2, perc: 4, ability: "Não pode ser Imobilizado. Após atacar com Exótica, mova 1 espaço.", heroicFeat: "Após causar HP, mova até sua Velocidade e ataque novamente.", fluff: "Não há dúvida de que você precisa de mim. A questão é, você pode me pagar?" },
      { name: "Raythen", mov: 4, hp: 14, fatigue: 5, def: "brown", str: 3, will: 1, know: 2, perc: 5, ability: "Uma vez por turno, gaste 1 💧: 1 herói no mesmo tile re-rola teste de atributo usando seus valores.", heroicFeat: "Procure token de busca adjacente a outro herói como ação extra.", fluff: "Apenas tenha cuidado, eu aposto que este lugar ainda tem alguns truques na manga." },
      { name: "Roganna the Shade", mov: 5, hp: 10, fatigue: 4, def: "gray", str: 2, will: 4, know: 2, perc: 3, ability: "Ataques contra monstros não adjacentes a outros heróis ganham +1 HP.", heroicFeat: "Até seu próximo turno, heróis em 3 espaços só podem ser atacados por monstros adjacentes.", fluff: "Fique perfeitamente imóvel. Essa criatura é agressiva e sua mordida é fatal." },
      { name: "Thaiden Mistpeak", mov: 4, hp: 10, fatigue: 5, def: "gray", str: 3, will: 2, know: 1, perc: 5, ability: "Ao atacar, pode cancelar o ataque para procurar token de busca em 3 espaços.", heroicFeat: "Quando monstro entrar adjacente: ele fica Imobilizado e você move 3 espaços.", fluff: "Todos nós temos dívidas a pagar." },
      { name: "Tinashi the Wanderer", mov: 4, hp: 12, fatigue: 4, def: "gray", str: 3, will: 3, know: 2, perc: 3, ability: "Cada vez que derrotar um monstro, recupere 1 💧.", heroicFeat: "Teleporte para espaço vazio dentro de 3 espaços.", fluff: "As sombras me mantêm. Não há nada a temer nas sombras... exceto eu." },
      { name: "Tomble Burrowell", mov: 4, hp: 8, fatigue: 5, def: "gray", str: 1, will: 3, know: 2, perc: 5, ability: "Se atacado adjacente a herói, adicione o pool de defesa dele ao seu.", heroicFeat: "Ação: Remova-se do mapa. No próximo turno, apareça em 4 espaços do token.", fluff: "Não pense nisso como roubo. Pense como doação para uma causa nobre." },
    ]
  },
  Guerreiro: {
    icon: "⬥",
    color: "#c87e7e",
    classes: [
      "Mestre das Feras", "Berserker", "Campeão", "Cavaleiro", "Marechal",
      "Escaramuçador", "Vingador (Híbrido)", "Invasor (Híbrido)", "Conjurador de Aço (Híbrido)"
    ],
    heroes: [
      { name: "Alys Raine", mov: 4, hp: 12, fatigue: 4, def: "gray", str: 3, will: 3, know: 4, perc: 1, ability: "Cada vez que herói adjacente sofrer HP de ataque, recupere 1 💧.", heroicFeat: "Renove todas as cartas exaustas e recupere 2 💧.", fluff: "O ladrão e o senhor são iguais / a lei chama ambos à justiça." },
      { name: "Grisban the Thirsty", mov: 3, hp: 14, fatigue: 4, def: "gray", str: 5, will: 3, know: 2, perc: 1, ability: "Ao descansar, pode descartar 1 Condição.", heroicFeat: "Realize 1 ação de ataque extra durante seu turno.", fluff: "Todo esse assassinato é um trabalho sedento. Beba comigo!" },
      { name: "Orkell the Swift", mov: 5, hp: 10, fatigue: 5, def: "brown", str: 4, will: 2, know: 1, perc: 4, ability: "Ao sofrer HP de ataque, mova 1 espaço após.", heroicFeat: "Enquanto nocauteado, levante-se e recupere todos os HP ou mova monstros adjacentes.", fluff: "Apenas tente acompanhar, certo?" },
      { name: "Pathfinder Durik", mov: 5, hp: 10, fatigue: 4, def: "gray", str: 3, will: 2, know: 2, perc: 4, ability: "Mova através de monstros gastando 1 mov adicional por espaço.", heroicFeat: "Ao sair de espaço com monstro, ataque-o gratuitamente com Surto: Perfurar 3.", fluff: "Os caminhos que conheço são perigosos e eu os trilho com cuidado." },
      { name: "Syndrael", mov: 4, hp: 12, fatigue: 4, def: "gray", str: 4, will: 2, know: 3, perc: 2, ability: "Se não se moveu neste turno, recupere 2 💧 no final.", heroicFeat: "Escolha herói em 3 espaços. Ambos fazem ação de movimento extra.", fluff: "Você jura lealdade eterna, mas você é mortal. O que sabe sobre compromisso?" },
    ]
  }
};

const CLASS_SKILLS = {
  "Boticário": {
    skills: [
      { name: "Preparar Elixir", xp: 0, stamina: 1, rules: "Exaura durante seu turno. Escolha você ou herói adjacente para ganhar 1 ficha de elixir. Herói pode descartar ficha para rolar 1 dado vermelho e recuperar HP." },
      { name: "Mistura", xp: 1, stamina: 1, rules: "➔: Ataque. Se tiver elixir, +1 ⚡. Perfurar 1. ⚡: +1 HP." },
      { name: "Conhecimento de Ervas", xp: 1, stamina: 1, rules: "Exaura quando herói descartar elixir. Também descarta 1 Condição." },
      { name: "Substância Escura", xp: 1, stamina: 1, rules: "Exaura: coloque elixir em monstro a 3 espaços. Herói atacante pode descartar para +1 dado verde." },
      { name: "Coragem Engarrafada", xp: 2, stamina: 2, rules: "Exaura: ataque sem ação. Se causar HP, ganhe 1 elixir." },
      { name: "Tônico Protetor", xp: 2, stamina: 1, rules: "Exaura após descartar elixir. Herói pode descartar ficha para +1 dado cinza na defesa." },
      { name: "Fórmula Secreta", xp: 2, stamina: 1, rules: "+2 Vida. Exaura quando herói com elixir atacar: +1 dado verde, ⚡: +2 HP." },
      { name: "Esconderijo Secreto", xp: 3, stamina: 2, rules: "➔: Exaura. Você e cada herói adjacente ganham 1 elixir." },
      { name: "Remédios Potentes", xp: 3, stamina: null, rules: "Ao descartar elixir, +1 dado verde e recupere 💧 igual ao ⚡. Exaura para reviver herói adjacente sem ação." },
    ]
  },
  "Bardo": {
    skills: [
      { name: "Canção da Cura", xp: 0, stamina: 2, rules: "Coloque ficha de canção. 🎼 Heróis a 3 espaços recuperam 1 HP. 🎶 Outros heróis a 3 espaços recuperam 1 💧." },
      { name: "Dissonância", xp: 1, stamina: 2, rules: "Coloque ficha de canção. 🎼 Heróis em 3 espaços ganham +1 mov. 🎶 Monstros em 3 espaços sofrem 1 HP ao ativar." },
      { name: "Descanso Pacífico", xp: 1, stamina: null, rules: "Herói a 3 espaços que descansar recupera +2 HP." },
      { name: "Substituto", xp: 1, stamina: 1, rules: "Coloque ficha de canção. 🎼 +1 HP ao recuperar. 🎶 +1 💧 ao recuperar." },
      { name: "Ária de Guerra", xp: 2, stamina: 2, rules: "Coloque ficha de canção. 🎼 +1 Escudo ao ser atacado. 🎶 +1 HP ao atacar." },
      { name: "Concentração", xp: 2, stamina: 1, rules: "Se ambas fichas em cartas diferentes: +1 HP +1 💧. Exaura: herói recupera +2 HP ao curar." },
      { name: "Ensaio", xp: 2, stamina: 1, rules: "Coloque ficha de canção. 🎼 Herói em 3 espaços descarta Condição. 🎶 Re-role 1 dado por rodada." },
      { name: "Cacofonia", xp: 3, stamina: 3, rules: "+1 💧. Exaura: ative efeitos 🎼 e 🎶 de outra carta." },
      { name: "Andarilho", xp: 3, stamina: null, rules: "+2 Vida. Efeitos de canção alcançam 5 espaços. Ao colocar ficha de canção, mova 1 espaço." },
    ]
  },
  "Discípulo": {
    skills: [
      { name: "Oração de Cura", xp: 0, stamina: 1, rules: "Exaura: role 1 dado vermelho. Herói adjacente ou você recupera HP igual ao rolado." },
      { name: "Armadura da Fé", xp: 1, stamina: null, rules: "Ao usar Oração de Cura, herói ganha +1 dado marrom de defesa até seu próximo turno." },
      { name: "Golpe Abençoado", xp: 1, stamina: 1, rules: "➔: Ataque corpo a corpo. Se causar HP, você e 1 herói adjacente recuperam 2 HP." },
      { name: "Toque Purificador", xp: 1, stamina: null, rules: "Ao usar Oração de Cura, herói pode descartar 1 Condição." },
      { name: "Fúria Divina", xp: 2, stamina: null, rules: "Ao usar Oração de Cura, herói ganha +1 dado amarelo no próximo ataque." },
      { name: "Oração de Paz", xp: 2, stamina: 2, rules: "➔: Exaura. Monstros adjacentes não podem atacar." },
      { name: "Hora de Necessidade", xp: 2, stamina: null, rules: "➔: Ganhe 2 mov e recupere 2 💧." },
      { name: "Poder Sagrado", xp: 3, stamina: null, rules: "Oração de Cura afeta 2 heróis. Se rolar ⚡, ambos recuperam 1 💧." },
      { name: "Luz Radiante", xp: 3, stamina: 3, rules: "➔: Role 1 dado vermelho. Cada herói na linha de visão recupera HP rolado. Cada monstro sofre HP rolado." },
    ]
  },
  "Profeta": {
    skills: [
      { name: "Discernimento Suave", xp: 0, stamina: 1, rules: "Exaura: herói ganha ficha de discernimento (+1 HP +1 ⚡). Pode descartar para +1 HP." },
      { name: "Visão de Batalha", xp: 1, stamina: null, rules: "+1 HP (máx 6). Heróis perto do discernimento podem sofrer 2 💧 para re-rolar dado de ataque." },
      { name: "Premonição", xp: 1, stamina: 1, rules: "Exaura quando monstro atacar herói com discernimento: descarte ficha para +2 Escudos." },
      { name: "Destino Sombrio", xp: 1, stamina: null, rules: "Herói com discernimento gasta 2 💧: overlord revela topo do baralho. Herói decide topo ou fundo." },
      { name: "Visão Ampla", xp: 2, stamina: 1, rules: "Exaura quando discernimento for descartado: outro herói ganha a ficha." },
      { name: "Linha de Vida", xp: 2, stamina: 2, rules: "Exaura quando herói com discernimento for nocauteado. Descarte essências: recupera HP igual." },
      { name: "Vitória Prevista", xp: 2, stamina: 2, rules: "Exaura quando herói com discernimento atacar: +1 dado verde. Se derrotar, +3 HP." },
      { name: "Discernimentos Focados", xp: 3, stamina: null, rules: "+2 Vida. Ao ganhar discernimento, heróis adjacentes recuperam 1 HP e 1 💧." },
      { name: "Onisciência", xp: 3, stamina: 3, rules: "Exaura quando monstro atacar herói com discernimento: ataque erra automaticamente." },
    ]
  },
  "Ceifador de Almas": {
    skills: [
      { name: "Colheita de Essência", xp: 0, stamina: null, rules: "Monstro derrotado: +1 essência. Se você for derrotado, perde toda essência." },
      { name: "Fluxo de Vida", xp: 0, stamina: 1, rules: "Exaura: descarte até 4 essências. Herói a 3 espaços recupera HP igual." },
      { name: "Extração da Praga", xp: 1, stamina: null, rules: "Ao usar Fluxo de Vida, herói pode descartar Condição. Se o fizer, ganhe a Condição e +2 essências." },
      { name: "Elo Espiritual", xp: 1, stamina: 2, rules: "+4 essências por encontro. Exaura: herói em 3 espaços não cai, descarte essências = HP." },
      { name: "Vínculo Profano", xp: 1, stamina: null, rules: "Monstro a 3 espaços ataca: gaste 1 essência para re-rolar dado." },
      { name: "Alma Amaldiçoada", xp: 2, stamina: 1, rules: "Exaura e gaste 2 essências: monstro a 3 espaços recebe +1 HP de ataques contra ele." },
      { name: "Armadura Etérea", xp: 2, stamina: 1, rules: "Exaura: herói adjacente ganha +1 Escudo por ataque e +1 essência por ataque recebido." },
      { name: "Galvanizar", xp: 2, stamina: null, rules: "Ao usar Fluxo de Vida, herói pode re-rolar dado OU mover 2 espaços +1 HP." },
      { name: "Fonte de Vitalidade", xp: 3, stamina: null, rules: "Fluxo/Elo: +1 HP recuperado. Herói em 3 espaços descansa: +2 essências." },
      { name: "Pacto do Ceifador", xp: 3, stamina: null, rules: "Fluxo: +2 essências para herói extra. +1 essência para +1 💧 cada." },
    ]
  },
  "Orador dos Espíritos": {
    skills: [
      { name: "Pele de Pedra", xp: 0, stamina: 1, rules: "Exaura quando herói a 3 espaços for atacado: +1 dado cinza de defesa." },
      { name: "Drenar Espírito", xp: 1, stamina: 1, rules: "➔: Ataque. Se causar HP, heróis em 3 espaços recuperam 1 HP." },
      { name: "Chuva Curativa", xp: 1, stamina: 2, rules: "➔: Role 1 dado vermelho. Heróis em 3 espaços recuperam HP igual." },
      { name: "Dor Compartilhada", xp: 1, stamina: 1, rules: "➔: Ataque. Se causar HP, cada outro monstro do grupo sofre 1 HP." },
      { name: "Nuvem de Névoa", xp: 2, stamina: 1, rules: "➔: Exaura. Ataques em 3 espaços erram a menos que gastem 1 ⚡." },
      { name: "Dádiva da Natureza", xp: 2, stamina: null, rules: "Ao descansar, recupere HP igual à 💧 recuperada." },
      { name: "Tempestade", xp: 2, stamina: 2, rules: "➔: Exaura e teste Vontade. Se passar, monstros em 3 espaços sofrem 2 HP, heróis recuperam 1 HP." },
      { name: "Espíritos Ancestrais", xp: 3, stamina: 1, rules: "Exaura quando monstros sofrerem HP de perícia: Envenenados." },
      { name: "Vigor", xp: 3, stamina: null, rules: "Exaura quando heróis recuperarem de perícia: +1 HP +1 💧. Ataques: ⚡: heróis recuperam 1 💧." },
    ]
  },
  "Mestre das Feras": {
    skills: [
      { name: "Vinculado pela Caça", xp: 0, stamina: 1, rules: "➔: Coloque seu marcador de familiar Lobo em espaço vazio adjacente. Você só pode controlar 1 Lobo por vez. Pode descartar o Lobo a qualquer momento no seu turno." },
      { name: "Lobo", xp: 0, stamina: null, rules: "Familiar: Velocidade 4, Vida 3, Sem dados de defesa. Ataque Corpo a Corpo: +1 azul +1 vermelho. Tratado como figura. 1 ação de ataque na ativação. ⚡: Perfurar 1." },
      { name: "Fúria Bestial", xp: 1, stamina: 2, rules: "➔: Ataque. Se adjacente ao Lobo, pode re-rolar 1 dado. Ganha: \"⚡: Role 1 dado vermelho e adicione o HP rolado ao resultado\"." },
      { name: "Espreitador", xp: 1, stamina: null, rules: "Após declarar alvo do ataque, pode mover o Lobo 1 espaço. Monstros não podem declarar o Lobo como alvo se houver herói como alvo legal." },
      { name: "Sobrevivencialista", xp: 1, stamina: null, rules: "+2 Vida. Heróis adjacentes ao Lobo adicionam 1 dado marrom à defesa. Lobo adjacente a você também ganha 1 dado marrom." },
      { name: "Frenesi Feral", xp: 2, stamina: 2, rules: "➔: Exaura para atacar. Após o ataque, seu Lobo pode atacar imediatamente. Enquanto exaurida, heróis atacando monstros perto do Lobo adicionam 1 dado verde." },
      { name: "Selvageria", xp: 2, stamina: null, rules: "Herói atacando monstro adjacente ao Lobo pode adicionar 1 dado verde. Lobo atacando monstro adjacente a herói adiciona 1 dado verde." },
      { name: "Caçador das Sombras", xp: 2, stamina: null, rules: "Lobo ganha +1 dado cinza de defesa. Antes de ativar o Lobo, pode exaurir esta carta para ele atacar com 2 dados vermelhos e 2 verdes; depois disso, o Lobo é derrotado." },
      { name: "Troca de Pele", xp: 3, stamina: 3, rules: "➔: Exaura para atacar como se ocupasse o espaço do Lobo. Enquanto exaurida, seus ataques e os do Lobo ganham: \"⚡: Perfurar 2. ⚡⚡: +5 HP\"." },
      { name: "Predador", xp: 3, stamina: null, rules: "Você e o Lobo ganham +4 Vida. Ao levantar ou ser revivido, recupera +2 HP. Ataques do Lobo ganham: \"⚡: +1 HP. ⚡: Você recupera 1 💧\"." },
    ]
  },
  "Berserker": {
    skills: [
      { name: "Raiva", xp: 0, stamina: 1, rules: "➔: Realize um ataque com arma Corpo a Corpo. Este ataque ganha +1 HP." },
      { name: "Bruto", xp: 1, stamina: null, rules: "+4 Vida. Ao levantar ou ser revivido, recupera +2 HP adicionais." },
      { name: "Contra-Ataque", xp: 1, stamina: 1, rules: "Após monstro adjacente resolver ataque que afete você, exaura para atacar com arma Corpo a Corpo. Se o monstro sobreviver, continua a ativação." },
      { name: "Aleijar", xp: 1, stamina: 2, rules: "Exaura no seu turno para escolher monstro adjacente e testar Força. Se passar, o monstro fica Imobilizado." },
      { name: "Carga", xp: 2, stamina: 2, rules: "➔: Mova-se até sua Velocidade e realize um ataque com arma Corpo a Corpo." },
      { name: "Maestria com Armas", xp: 2, stamina: null, rules: "Ao atacar com arma de 2 mãos ou duas armas de 1 mão, pode exaurir esta carta para adicionar 1 ⚡ aos resultados." },
      { name: "Redemoinho", xp: 2, stamina: 1, rules: "➔: Ataque todos os monstros adjacentes. 1 rolagem de ataque, cada monstro rola defesa separadamente." },
      { name: "Raiva Mortal", xp: 3, stamina: 2, rules: "➔: Ataque com arma Corpo a Corpo. Ganha: \"⚡: +1 HP para cada 2 HP marcados na sua ficha de herói\"." },
      { name: "Executar", xp: 3, stamina: null, rules: "Ao atacar com Corpo a Corpo, após rolar dados, exaura para ganhar +X HP, onde X é a 💧 sofrida para usar esta perícia." },
    ]
  },
  "Campeão": {
    skills: [
      { name: "Valor dos Heróis", xp: 0, stamina: null, rules: "Ao derrotar monstro com Corpo a Corpo, ganhe 1 Valor. Antes de rolar ataque, gaste 1 Valor para +1 HP (máx 1/ataque)." },
      { name: "Uma Lenda Viva", xp: 1, stamina: 1, rules: "Exaura ao sofrer HP. Gaste até 3 Valor para reduzir o dano em 1 por Valor gasto." },
      { name: "Glória da Batalha", xp: 1, stamina: null, rules: "Ao derrotar monstro, aliados a 3 espaços ganham 1 Valor. Pode gastar 1 Valor para +1 Escudo na defesa." },
      { name: "Presença Inspiradora", xp: 1, stamina: null, rules: "Quando aliado a 3 espaços ataca, ganha: \"⚡: Ganhe 1 Valor\". Pode gastar 1 Valor para aliado a 3 espaços re-rolar teste de Vontade falho." },
      { name: "Investida Motivadora", xp: 2, stamina: 2, rules: "➔: Exaura para mover e atacar. Se derrotar monstro, heróis a 3 espaços ganham 1 Valor ou recuperam 1 💧." },
      { name: "Sem Misericórdia", xp: 2, stamina: null, rules: "Após suserano ativar grupo de monstros, gaste 2 Valor para exaurir esta carta e atacar imediatamente." },
      { name: "Resolução Estoica", xp: 2, stamina: null, rules: "Quando você ou aliado a 3 espaços gasta Valor, você ou aliado adjacente pode recuperar 1 💧." },
      { name: "Pela Causa", xp: 3, stamina: 1, rules: "+1 dado marrom na defesa. Exaura quando monstro atacar você ou aliado adjacente e gaste Valor para +1 dado cinza de defesa ao alvo por Valor gasto." },
      { name: "Golpe Valeroso", xp: 3, stamina: null, rules: "Ao ganhar Valor, pode colocar ficha de dano nesta carta. Pode exaurir para +1 HP no ataque por ficha acumulada; depois descarte as fichas." },
    ]
  },
  "Cavaleiro": {
    skills: [
      { name: "Juramento de Honra", xp: 0, stamina: 1, rules: "➔: Escolha herói a 3 espaços que tenha monstro adjacente. Coloque sua figura no espaço vazio mais próximo do monstro e ataque-o." },
      { name: "Avanço", xp: 1, stamina: 1, rules: "Após derrotar monstro Corpo a Corpo, exaura para mover sua Velocidade e atacar de novo." },
      { name: "Desafio", xp: 1, stamina: null, rules: "Exaura para marcar monstro na visão com sua ficha. Enquanto exaurida, ataques entre vocês ganham +1 HP." },
      { name: "Defender", xp: 1, stamina: 1, rules: "Quando aliado adjacente for atacado, use para se tornar o alvo no lugar dele." },
      { name: "Treino de Defesa", xp: 2, stamina: null, rules: "Com Escudo, +1 dado marrom na defesa. Pode exaurir esta carta em vez de exaurir o Escudo." },
      { name: "Guarda", xp: 2, stamina: 2, rules: "Quando monstro entrar em espaço adjacente, exaura para interromper e atacar. Se sobreviver, termina a ativação." },
      { name: "Pancada com Escudo", xp: 2, stamina: null, rules: "Com Escudo, ataques Corpo a Corpo ganham: \"⚡: Escolha monstro adjacente; ele fica Atordoado\"." },
      { name: "Inspiração", xp: 3, stamina: null, rules: "No início do turno, se adjacente a 1+ herói, você e aliados adjacentes recuperam 1 💧." },
      { name: "Obstinado", xp: 3, stamina: null, rules: "+2 Vida. Ao ser derrotado, pode mover sua Velocidade e atacar antes de cair nocauteado." },
    ]
  },
  "Marechal": {
    skills: [
      { name: "Retribuição", xp: 0, stamina: 1, rules: "Exaura após monstro a até 2 espaços resolver ataque que afete outro herói. Aquele monstro sofre 2 HP." },
      { name: "Fogo Zeloso", xp: 1, stamina: null, rules: "Exaura quando suserano jogar carta de Suserano. Recupere 1 💧. Ao renovar, monstro a 2 espaços sofre 1 HP." },
      { name: "Onda de Choque", xp: 1, stamina: 1, rules: "Exaura ao atacar com arma Corpo a Corpo de 2 mãos, antes de rolar. Se causar 1+ HP, cada monstro adjacente ao alvo sofre 1 HP." },
      { name: "Justa Recompensa", xp: 1, stamina: 2, rules: "Exaura quando suserano ativar grupo de monstros. Enquanto exaurida, cada vez que monstro desse grupo a 3 espaços atacar outro herói, suserano descarta 1 carta." },
      { name: "Vigilância Atenta", xp: 2, stamina: 1, rules: "Exaura quando monstro entrar em espaço adjacente. Enquanto exaurida, monstro que sair de espaço a 2 espaços sofre 1 HP." },
      { name: "Eu Sou a Lei", xp: 2, stamina: null, rules: "Exaura após monstro a 2 espaços resolver ataque que afete você. Ataque-o. Teste Conhecimento; se passar, sofra 1 💧 e o monstro ganha 1 Condição à sua escolha." },
      { name: "Pelas Regras", xp: 2, stamina: 1, rules: "Exaura quando suserano jogar carta de Suserano. Teste Conhecimento. Adicione Escudos igual ao custo de XP da carta. Se passar, carta volta ao topo sem efeito. Se falhar, sofra 1 HP." },
      { name: "Golpe Esmagador", xp: 3, stamina: null, rules: "Exaura quando monstro a 2 espaços e na visão realizar ataque que não cause HP. Ataque-o com arma de 2 mãos; remova todos os dados de defesa do monstro." },
      { name: "Resistência Final", xp: 3, stamina: 2, rules: "Exaura quando herói a 5 espaços for nocauteado. Coloque-se no espaço dele e ataque. Ao renovar, pode reviver 1 herói nocauteado em seu espaço." },
    ]
  },
  "Escaramuçador": {
    skills: [
      { name: "Ataque Duplo", xp: 0, stamina: 2, rules: "Exaura ao atacar, antes de rolar. Se tiver 2 armas Corpo a Corpo de 1 mão, adicione 1 ⚡. Pode usar habilidades de ⚡ de ambas as armas." },
      { name: "De Volta à Ação", xp: 1, stamina: null, rules: "+2 Vida. Ao levantar ou ser revivido, pode mover até sua Velocidade." },
      { name: "Ferimentos Profundos", xp: 1, stamina: 1, rules: "Exaura ao resolver ataque que causou 1+ HP a monstro. Ele sofre 1 HP adicional e fica com Sangramento." },
      { name: "Fio Afiado", xp: 1, stamina: null, rules: "Cada ataque com arma de Lâmina ou Machado ganha Perfurar 1." },
      { name: "Nascido na Batalha", xp: 2, stamina: null, rules: "Ao derrotar monstro com arma Corpo a Corpo de 1 mão, recupere 1 HP e 1 💧." },
      { name: "Sempre em Movimento", xp: 2, stamina: 1, rules: "Ao ser nocauteado, coloque marcador a 3 espaços. Exaura no início do turno para descartar Atordoado ou Imobilizado." },
      { name: "Implacável", xp: 2, stamina: 1, rules: "Exaura após resolver ataque com arma de 1 mão. Ataque o mesmo monstro com arma de 1 mão diferente." },
      { name: "Abrir Caminho", xp: 3, stamina: 3, rules: "➔: Mova sua Velocidade e ataque. Pode passar por monstros. Ataque afeta cada monstro pelo qual passou." },
      { name: "Imparável", xp: 3, stamina: null, rules: "+1 💧. Ao atacar com Corpo a Corpo, após rolar dados, pode mudar cada resultado X para outro resultado à escolha." },
    ]
  },
  "Vingador (Híbrido)": {
    isHybrid: true,
    hybridArchetype: "Curandeiro",
    skills: [
      { name: "Justiceiro", xp: 0, stamina: null, rules: "Ao ganhar esta carta, escolha 1 baralho de Classe padrão do arquétipo Curandeiro. Você pode comprar perícias de qualquer um dos baralhos, exceto cartas com custo 3 XP do baralho de Curandeiro escolhido." },
      { name: "Santo Campeão", xp: 1, stamina: null, rules: "Quando outro herói a até 3 espaços causar HP durante ataque, coloque 1 ficha de dano nesta carta. Durante seu turno, descarte 2 fichas para +2 HP e Perfurar 2. Se for derrotado, descarte todas as fichas." },
      { name: "Golpe Vingativo", xp: 2, stamina: null, rules: "Quando outro herói a até 3 espaços sofrer HP durante ataque, coloque 1 ficha de dano nesta carta. Ao atacar, antes de rolar, descarte 2 fichas para recuperar 1 💧." },
      { name: "Morte vinda do Alto", xp: 3, stamina: 1, rules: "Use após monstro resolver ataque contra outro herói. Descarte 2 fichas de Santo Campeão ou Golpe Vingativo e coloque-se adjacente àquele herói. Ataque aquele monstro sem usar ação." },
    ]
  },
  "Cruzado (Híbrido)": {
    isHybrid: true,
    hybridArchetype: "Guerreiro",
    skills: [
      { name: "Escolhido de Kellos", xp: 0, stamina: null, rules: "Ao ganhar esta carta, escolha 1 baralho de Classe padrão do arquétipo Guerreiro. Você pode comprar perícias de qualquer um dos baralhos, exceto cartas com custo 3 XP do baralho de Guerreiro escolhido." },
      { name: "Aura Zelosa", xp: 1, stamina: 1, rules: "Exaura no início do seu turno. Enquanto exaurida, cada vez que herói a até 3 espaços derrotar um monstro, ele recupera 2 HP." },
      { name: "Justo", xp: 2, stamina: null, rules: "Cada vez que um herói derrotar 1 ou mais monstros, aquele herói recupera 1 💧." },
      { name: "Luz Divina", xp: 3, stamina: 1, rules: "Exaura quando herói sem ficha nesta carta for ser derrotado. Role 2 dados vermelhos. Ele recupera HP igual ao HP rolado, 💧 igual ao ⚡ rolado e descarta todas as Condições. Coloque a ficha dele nesta carta." },
    ]
  },
  "Conjurador": {
    skills: [
      { name: "Canalização", xp: 0, stamina: null, rules: "Descarte fichas de imagem a qualquer momento no turno. Gaste 1 mov para mover ficha de imagem 1 espaço. ➔: Ataque com arma Mágica. Meça alcance e linha de visão a partir de uma ficha de imagem." },
      { name: "Imagem Espelhada", xp: 0, stamina: null, rules: "Sofra 💧 igual ao nº de fichas de imagem no mapa. Coloque 1 ficha de imagem em espaço vazio a até 2 espaços. Ficha é tratada como figura de herói com seus atributos e 1 dado cinza de defesa. Se sofrer HP ou 💧, é descartada e você sofre 1 HP e 1 💧." },
      { name: "Caminho Ilusório", xp: 1, stamina: null, rules: "Monstros gastam +1 mov para entrar adjacente a ficha de imagem. Ao sofrer 1 💧 para +1 mov, pode mover ficha de imagem 1 espaço." },
      { name: "Muitos Amigos", xp: 1, stamina: null, rules: "Se adjacente a 1+ fichas de imagem, +1 dado marrom de defesa. Se 3+ fichas no mapa, +1 dado verde de ataque." },
      { name: "Refração", xp: 1, stamina: 2, rules: "➔: Exaura para colocar 1 ficha de imagem a até 3 espaços de outra ficha. Pode atacar com arma Mágica medindo alcance/visão a partir de uma delas." },
      { name: "Luz Cegante", xp: 2, stamina: 2, rules: "Exaura ao ser atacado, antes dos dados: +2 Escudos na defesa. Após o ataque, coloque ficha de imagem adjacente. Se não sofreu HP, mova até 2 espaços." },
      { name: "Fogo Concentrado", xp: 2, stamina: 1, rules: "➔: Ataque com arma Mágica. +1 HP para cada ficha de imagem a até 3 espaços do alvo." },
      { name: "Prestidigitação Mental", xp: 2, stamina: 2, rules: "➔: Escolha ficha de imagem a até 5 espaços. Remova-se do mapa e substitua a ficha pela sua figura. Cada monstro adjacente fica Atordoado." },
      { name: "Assalto Prismático", xp: 3, stamina: 3, rules: "➔: Exaura. Para cada ficha de imagem no mapa, mova-a até sua Velocidade OU ataque com arma Mágica medindo alcance/visão a partir da ficha." },
      { name: "Vórtice", xp: 3, stamina: 2, rules: "➔: Exaura e escolha ficha de imagem. Mova cada monstro a até 3 espaços dela até 2 espaços (deve terminar a até 3 espaços). Cada um sofre 2 HP." },
    ]
  },
  "Elementalista": {
    skills: [
      { name: "Foco Elemental", xp: 0, stamina: null, rules: "Ao ganhar esta carta, escolha 2 cartas de 🌀 e ganhe-as imediatamente. Cartas de 🌀 são cartas de Classe que ocupam o lugar de um custo de XP." },
      { name: "🔥 Labareda", xp: 0, stamina: 1, elemental: true, rules: "Exaura ao atacar, após rolar dados. Ataque ganha Perfurar X, onde X = nº de cartas 🌀 exauridas." },
      { name: "⛰️ Garra", xp: 0, stamina: 1, elemental: true, rules: "Exaura no seu turno: escolha monstro não-tenente a até 3 espaços. Se nº de cartas 🌀 exauridas ≥ espaços que o monstro ocupa, ele fica Atordoado." },
      { name: "💨 Rajada", xp: 0, stamina: 1, elemental: true, rules: "Exaura no seu turno: escolha aliado a até 3 espaços. Mova-o um nº de espaços até o total de cartas 🌀 exauridas." },
      { name: "💧 Maré", xp: 0, stamina: 1, elemental: true, rules: "Exaura após ataque. Monstro adjacente ao alvo sofre HP igual ao nº de cartas 🌀 exauridas." },
      { name: "Terra e Céu", xp: 1, stamina: null, rules: "Rajada/Garra pode atingir até 5 espaços em vez de 3. Ao comprar, ganhe 1 perícia 🌀 adicional." },
      { name: "Harmonia Primordial", xp: 1, stamina: null, rules: "Exaura no seu turno para preparar (refresh) 1 de suas cartas 🌀." },
      { name: "Sol e Mar", xp: 1, stamina: null, rules: "Ao usar Maré ou Labareda, exaura para re-rolar 1 dado de ataque/poder. Ao comprar, ganhe 1 perícia 🌀 adicional." },
      { name: "Equilíbrio Espiritual", xp: 2, stamina: null, rules: "Exaura após exaurir uma carta 🌀. Se 2+ cartas 🌀 exauridas, recupere 2 💧." },
      { name: "Fúria da Tempestade", xp: 2, stamina: null, rules: "Ao usar Maré, pode escolher monstro a até 2 espaços de monstro adjacente. Ao usar Rajada, pode escolher 1 figura não-tenente." },
      { name: "Poder Vulcânico", xp: 2, stamina: null, rules: "Enquanto Garra exaurida, +1 Escudo na defesa. Enquanto Labareda exaurida, após monstro atacar você, ele sofre 1 HP." },
      { name: "Abraço da Natureza", xp: 3, stamina: null, rules: "+1 💧. Ao usar Maré, +1 monstro alvo. Ao usar Garra, atinja figuras não-tenentes igual ao nº de cartas 🌀 exauridas." },
      { name: "Fúria da Natureza", xp: 3, stamina: null, rules: "+1 💧. Ao usar Labareda, +1 dado amarelo no ataque. Ao usar Rajada, pode escolher a si mesmo." },
    ]
  },
  "Geomante": {
    skills: [
      { name: "Pedra Convocada", xp: 0, stamina: null, rules: "Familiar: Velocidade 2, Vida 2, Defesa 1 dado marrom. Obstáculo, pode ser alvo de ataques. Máx 1 no mapa. Seus ataques contra monstro adjacente a Pedra ganham +1 ⚡." },
      { name: "Chamado da Terra", xp: 0, stamina: 1, rules: "➔: Exaura para colocar Pedra Convocada em espaço vazio a até 3 espaços. Enquanto exaurida, 1 Pedra pode atacar na ativação dela (usando sua arma Mágica)." },
      { name: "Angústia Terrena", xp: 1, stamina: 1, rules: "➔: Exaura para atacar com arma Mágica mirando espaço de uma Pedra (ignora alcance/visão). Ganha Explosão. Após o ataque, Pedra é derrotada." },
      { name: "Palavra Estremecedora", xp: 1, stamina: 2, rules: "➔: Ataque com arma Mágica. Ganha: \"⚡: Cada monstro a até 2 espaços de uma Pedra testa Poder. Quem falhar fica Atordoado.\"" },
      { name: "Língua de Pedra", xp: 1, stamina: null, rules: "+1 Pedra Convocada permitida no mapa. Pedras ganham Velocidade 3. Cada Pedra adiciona +1 dado cinza à sua defesa." },
      { name: "Linha de Ley", xp: 2, stamina: null, rules: "+1 Pedra permitida no mapa. Se a até 3 espaços de 2 Pedras, exaura antes de dados para +1 Escudo na defesa ou +1 ⚡ no ataque." },
      { name: "Fúria Derretida", xp: 2, stamina: 2, rules: "➔: Ataque com arma Mágica medindo alcance/visão a partir de uma Pedra. Ganha: \"Queimar. ⚡: Explosão.\"" },
      { name: "Caminhos da Pedra", xp: 2, stamina: 2, rules: "➔: Exaura para teleportar adjacente a uma Pedra. Enquanto exaurida, cada Pedra pode +1 dado cinza na sua defesa." },
      { name: "Cataclismo", xp: 3, stamina: 2, rules: "➔: Exaura. Para cada Pedra no mapa, ataque com arma Mágica medindo alcance/visão a partir dela. Após cada ataque, remova a Pedra." },
      { name: "Espigão de Gravidade", xp: 3, stamina: 2, rules: "➔: Exaura e escolha grupo de monstros. Mova cada figura até 2 espaços em direção a uma Pedra. Monstros que terminarem adjacentes sofrem 1 HP." },
    ]
  },
  "Necromante": {
    skills: [
      { name: "Levantar Mortos", xp: 0, stamina: 1, rules: "➔: Coloque seu marcador de familiar Reanimado em um espaço vazio adjacente a você." },
      { name: "Reanimado", xp: 0, stamina: null, rules: "Familiar: Velocidade 3, Vida 4, Sem defesa. Ataque Corpo a Corpo: +1 azul +1 vermelho. Não pode recuperar vida. 1 ação de ataque na ativação. ⚡: +1 HP." },
      { name: "Explosão de Cadáver", xp: 1, stamina: 1, rules: "➔: Ataque com arma Mágica mirando espaço do Reanimado. Ganha Explosão, ignora alcance e linha de visão. Após o ataque, Reanimado é derrotado." },
      { name: "Pressa Mortal", xp: 1, stamina: null, rules: "Cada vez que sofrer 1 💧 para +1 mov, pode mover o Reanimado 1 espaço." },
      { name: "Fúria dos Mortos-Vivos", xp: 1, stamina: 1, rules: "➔: Exaura para ativar seu Reanimado. Ele ainda ativa normalmente neste turno." },
      { name: "Pacto Sombrio", xp: 2, stamina: null, rules: "Reanimado ganha +1 dado marrom de defesa. Ao sofrer HP, pode fazer o Reanimado sofrer todo o HP no seu lugar (e vice-versa)." },
      { name: "Poder dos Mortos-Vivos", xp: 2, stamina: 1, rules: "Reanimado ganha +2 Vida (mesmo exaurida). Exaura quando Reanimado atacar monstro: ataque ganha +1 HP." },
      { name: "Sangue Vampírico", xp: 2, stamina: null, rules: "Reanimado ganha +1 dado amarelo de ataque. Cada vez que você ou Reanimado derrotar monstro, recupere 1 💧." },
      { name: "Exército da Morte", xp: 3, stamina: 2, rules: "➔: Ataque com o Reanimado. Afeta cada monstro na linha de visão, ignorando alcance. Reanimado não precisa de linha de visão, mas deve estar no mapa." },
      { name: "Comando Agonizante", xp: 3, stamina: 2, rules: "Exaura após você ou Reanimado resolver ataque. Escolha 1 monstro derrotado e teste Conhecimento. Se falhar, recupere 1 💧. Se passar: retorne o monstro, mova-o até sua Velocidade, ataque com ele e remova-o." },
    ]
  },
  "Mestre das Runas": {
    skills: [
      { name: "Conhecimento Rúnico", xp: 0, stamina: null, rules: "Com arma Mágica ou Runa equipada, cada ataque ganha: \"⚡: Sofra 1 💧 para +2 HP.\"" },
      { name: "Runa Explosiva", xp: 1, stamina: 1, rules: "➔: Ataque com arma Runa. Este ataque ganha Explosão." },
      { name: "Armadura Fantasmagórica", xp: 1, stamina: 1, rules: "Após rolar dados de defesa ao ser atacado, use para +1 Escudo aos resultados." },
      { name: "Inscrever Runa", xp: 1, stamina: null, rules: "Qualquer arma que você equipar ganha a característica Runa enquanto estiver equipada." },
      { name: "Vontade de Ferro", xp: 2, stamina: null, rules: "+1 💧. Ao gastar 1 ⚡ durante ataque para recuperar 1 💧, recupere 2 💧 em vez disso." },
      { name: "Maestria Rúnica", xp: 2, stamina: null, rules: "Ao atacar com arma Runa, pode exaurir esta carta para +1 ⚡ aos resultados." },
      { name: "Feitiçaria Rúnica", xp: 2, stamina: 1, rules: "➔: Ataque com arma Runa. Se causar 1+ HP, escolha 1 Condição: o alvo sofre essa Condição." },
      { name: "Quebrar a Runa", xp: 3, stamina: 4, rules: "➔: Ataque com arma Runa. Ignora alcance. Afeta cada figura a até 3 espaços na linha de visão. Cada figura rola defesa separadamente." },
      { name: "Conjuração Rápida", xp: 3, stamina: 2, rules: "Após atacar com arma Runa, exaura para realizar imediatamente um ataque adicional." },
    ]
  },
  "Mago de Batalha (Híbrido)": {
    isHybrid: true,
    hybridArchetype: "Guerreiro",
    skills: [
      { name: "Veterano Arcano", xp: 0, stamina: null, rules: "Ao ganhar esta carta, escolha 1 baralho de Classe padrão do arquétipo Guerreiro. Você pode comprar perícias de qualquer um dos baralhos, exceto cartas com custo 3 XP do baralho de Guerreiro escolhido." },
      { name: "Arma Planar", xp: 1, stamina: 1, rules: "Armas de Runa perdem À Distância; ganham Corpo a Corpo e traços Lâmina, Martelo, Machado e Exótica; podem perder 1 ícone de mão. Exaura ao atacar com Runa, antes de rolar, para +1 ⚡ aos resultados." },
      { name: "Trama Rúnica", xp: 2, stamina: null, rules: "+2 Vida por Runa equipada (mesmo exaurida). Ao exaurir Manto ou Escudo, pode exaurir esta carta em vez disso." },
      { name: "Sifão da Morte", xp: 3, stamina: null, rules: "Ao derrotar monstro adjacente, recupere 1 HP ou 1 💧. Exaura ao sofrer HP igual à Vida, antes de cair, para atacar imediatamente. Se derrotar o alvo, recupere 1 HP." },
    ]
  },
  "Guardião do Conhecimento (Híbrido)": {
    isHybrid: true,
    hybridArchetype: "Curandeiro",
    skills: [
      { name: "Interdisciplinar", xp: 0, stamina: null, rules: "Ao ganhar esta carta, escolha 1 baralho de Classe padrão do arquétipo Curandeiro. Você pode comprar perícias de qualquer um dos baralhos, exceto cartas com custo 3 XP do baralho de Curandeiro escolhido." },
      { name: "Remédio Antigo", xp: 1, stamina: 2, rules: "+X Vida, onde X = seu Conhecimento. Exaura quando herói a até 3 espaços ganhar Condição e teste Conhecimento. Se passar, herói descarta a Condição imediatamente." },
      { name: "Equilíbrio Cuidadoso", xp: 2, stamina: 1, rules: "Exaura ao atacar, antes de rolar. Sofra HP até seu Conhecimento. Ataque ganha +1 HP por HP sofrido. Se o monstro sofrer HP, recupere 2 HP." },
      { name: "Onisciente", xp: 3, stamina: 1, rules: "+1 Conhecimento (máx 6). Escolha cartas de perícia e teste Conhecimento. Adicione Escudos = nº de cartas escolhidas. Se passar, prepare cada uma e ignore custo de 💧 delas até fim da rodada." },
    ]
  },
  "Caçador de Recompensas": {
    skills: [
      { name: "Alvo Escolhido", xp: 0, stamina: 1, rules: "Exaura no início do turno para rastrear monstro na linha de visão. Ataques contra monstro rastreado ganham +1 HP (mesmo exaurida)." },
      { name: "Tocaia", xp: 1, stamina: null, rules: "➔: Exaura. Enquanto exaurida, não pode agir, mover ou ser movido. Ao preparar, realize um ataque extra com +1 dado amarelo." },
      { name: "Longo Alcance", xp: 1, stamina: 1, rules: "Exaura ao atacar com Arco, antes de rolar. Se alvo a 5+ espaços, ataque ganha +3 Alcance e +1 HP." },
      { name: "Não Tão Rápido", xp: 1, stamina: 1, rules: "Quando monstro rastreado na visão se mover, reduza mov dele em 1 (mín 1). Mova-se 2 espaços imediatamente." },
      { name: "Correntes de Ferro Negro", xp: 2, stamina: null, rules: "Quando monstro rastreado na visão atacar, após rolar. Custo = nº de ⚡ rolados. Teste Percepção. Se passar, monstro não pode gastar ⚡ no ataque." },
      { name: "Olhar Maligno", xp: 2, stamina: null, rules: "Exaura no final do turno: monstro rastreado fica Amaldiçoado. Exaura no final do turno: monstro Amaldiçoado rastreado sofre 1 HP." },
      { name: "Disfarçado", xp: 2, stamina: null, rules: "Exaura no final do turno se não atacou nesta rodada. Enquanto exaurida, +1 dado cinza de defesa. Ao preparar, ganhe 3 mov." },
      { name: "Dia de Pagamento", xp: 3, stamina: null, rules: "Exaura após derrotar monstro mestre. Suserano escolhe 1 ficha de busca no mapa; vasculhe-a. Não pode ser usado no mesmo grupo duas vezes no encontro." },
      { name: "Fogo Rápido", xp: 3, stamina: 1, rules: "Após derrotar monstro rastreado com Arco, mova até 2 espaços. Escolha monstro na visão e ataque. Se não derrotar, rastreie-o." },
    ]
  },
  "Caminhante das Sombras": {
    skills: [
      { name: "Alma Sombria", xp: 0, stamina: null, rules: "Familiar: Velocidade 1, Sem Vida, Sem defesa. Pode ocupar qualquer espaço com figuras ou terreno. Monstros adjacentes ou no espaço dela que sofram HP de ataque sofrem +1 HP." },
      { name: "Alma Vinculada", xp: 0, stamina: 1, rules: "Use ao realizar ataque que não erre. Coloque Alma Sombria adjacente ao alvo. Apenas 1 no mapa por vez." },
      { name: "Servo das Sombras", xp: 1, stamina: null, rules: "➔: Exaura para vasculhar ficha de busca a até 3 espaços da Alma Sombria. Descarte a Alma." },
      { name: "Amigo Fiel", xp: 1, stamina: null, rules: "Exaura no início do turno para colocar Alma Sombria a até 3 espaços de você." },
      { name: "Através do Véu", xp: 1, stamina: 1, rules: "Exaura ao atacar monstro no espaço ou adjacente à Alma Sombria, antes de rolar. +1 dado verde ao ataque." },
      { name: "Passo Sombrio", xp: 2, stamina: null, rules: "+1 💧. Herói que entrar em espaço da Alma Sombria ganha 1 mov." },
      { name: "Vazio Infinito", xp: 2, stamina: null, rules: "Ao descartar Alma por perícia, recupere 1 HP e 1 💧. Herói no espaço da Alma atacado: ataque erra a menos que gaste 1 ⚡." },
      { name: "Sobrenatural", xp: 2, stamina: null, rules: "Ataques contra monstros no espaço ou adjacentes à Alma ganham Perfurar 1. Ao gastar 1 ⚡ para mov, ataque ganha +1 HP." },
      { name: "Fantoche das Sombras", xp: 3, stamina: 3, rules: "➔: Exaura para escolher monstro a até 3 espaços da Alma. Ataque com a Alma usando tipo, dados e surtos daquele monstro." },
      { name: "Passo de Sombra", xp: 3, stamina: 1, rules: "➔: Exaura para colocar-se no espaço da Alma Sombria. Pode descartar a Alma para atacar com +1 ⚡ nos resultados." },
    ]
  },
  "Caçador de Tesouros": {
    skills: [
      { name: "Explorador", xp: 0, stamina: null, rules: "Se não adjacente a herói, ataques ganham +1 HP. Ao comprar Busca, compre 2, escolha 1 e devolva a outra ao topo ou fundo do baralho." },
      { name: "Desbravador", xp: 1, stamina: 1, rules: "➔: Exaura para buscar. Enquanto exaurida, pode atacar 1 vez sem gastar ação." },
      { name: "Corrida do Ouro", xp: 1, stamina: null, rules: "Exaura no turno após buscar: ganhe mov = nº de cartas de Busca (máx 5). Enquanto exaurida, pode mover através de inimigos." },
      { name: "Vistoria", xp: 1, stamina: 1, rules: "+1 💧 (mesmo exaurida). Exaura para ver as 3 cartas do topo do baralho de Busca. Devolva na ordem que quiser." },
      { name: "Guardar o Espólio", xp: 2, stamina: 1, rules: "Exaura ao ser atacado, antes dos dados. Adicione dado de defesa conforme cartas de Busca: 0-1: marrom; 2: cinza; 3+: preto." },
      { name: "Isca da Fortuna", xp: 2, stamina: null, rules: "Ao buscar, recupere 1 HP e 1 💧. Ao derrotar monstro, pode mover topo do baralho de Busca para o fundo (sem ver)." },
      { name: "Prestidigitação", xp: 2, stamina: null, rules: "Com arma Exótica ou Arco, ataques ganham Perfurar 2 (mesmo exaurida). Exaura quando outro herói comprar Busca para que ele entregue a você." },
      { name: "Achado não é Roubado", xp: 3, stamina: 1, rules: "➔: Ataque com Exótica +1 dado verde. Ganha: \"⚡: +1 HP por carta de Busca (máx +4 HP)\"." },
      { name: "Trilha de Riquezas", xp: 3, stamina: 1, rules: "Com 2+ cartas de Busca, exaura para vasculhar ficha de busca a até 3 espaços sem gastar ação." },
    ]
  },
  "Mateiro": {
    skills: [
      { name: "Ágil", xp: 0, stamina: 1, rules: "Quando monstro se mover para espaço adjacente, use para mover-se 1 espaço. O monstro continua a ativação." },
      { name: "Preciso", xp: 1, stamina: null, rules: "Ao atacar com Arco, pode re-rolar 1 dado de poder (1 vez por ataque)." },
      { name: "Sentido de Perigo", xp: 1, stamina: 2, rules: "➔: Exaura para forçar suserano a descartar aleatoriamente 1 carta de Suserano da mão." },
      { name: "Olhos de Águia", xp: 1, stamina: null, rules: "Ao atacar com Arco, figuras aliadas não bloqueiam sua linha de visão." },
      { name: "Maestria com Arco", xp: 2, stamina: null, rules: "Ao atacar com Arco, pode exaurir para +1 ⚡ aos resultados." },
      { name: "Primeiro Golpe", xp: 2, stamina: 2, rules: "No turno do suserano, após escolher monstro para ativar, exaura para atacar com Arco. Se sobreviver, continua ativação." },
      { name: "Pés Ligeiros", xp: 2, stamina: null, rules: "Ao sofrer 1 💧 para mov, ganhe 2 mov em vez de 1. Ao usar Ágil, mova 2 espaços em vez de 1." },
      { name: "Flecha Negra", xp: 3, stamina: 1, rules: "➔: Ataque com Arco +2 Alcance. Se causar menos de 3 HP (após defesa), cause 3 HP em vez disso (a menos que erre)." },
      { name: "Tiro em Movimento", xp: 3, stamina: null, rules: "Ao atacar com Arco, mova até 2 espaços antes de declarar alvo ou após resolver. Com Armadura Pesada, apenas 1 espaço." },
    ]
  },
  "Espreitador": {
    skills: [
      { name: "Armar Armadilha", xp: 0, stamina: 1, rules: "Exaura para colocar 1 armadilha adjacente. Ataques ganham +1 HP se adjacente a armadilha. Monstro que entrar adjacente sofre 1 HP e ficha é removida." },
      { name: "Explorar", xp: 1, stamina: 1, rules: "➔: Ataque. Se alvo a até 3 espaços de armadilha, +1 dado verde. Ganha: \"⚡: Alvo fica Enfraquecido\"." },
      { name: "Marca do Caçador", xp: 1, stamina: 1, rules: "Exaura no turno para marcar monstro a até 3 espaços de armadilha. Próximo herói a atacá-lo ganha +1 ⚡." },
      { name: "Armadilha Improvisada", xp: 1, stamina: null, rules: "Exaura após buscar para colocar armadilha adjacente. Enquanto exaurida, heróis adjacentes a armadilhas recuperam 1 💧 no início do turno." },
      { name: "Presa Fácil", xp: 2, stamina: 1, rules: "➔: Exaura para atacar. Antes de rolar, coloque armadilha adjacente ao alvo. Enquanto exaurida, ataques perto de armadilhas ganham Perfurar 1." },
      { name: "Conhecimento do Local", xp: 2, stamina: null, rules: "Herói perto de ficha de busca e armadilha pode sofrer 1 💧 para exaurir esta carta e vasculhar sem ação." },
      { name: "Farpas Venenosas", xp: 2, stamina: 2, rules: "Exaura e escolha armadilha. Role dado azul por monstro a até 3 espaços; se não rolar X, fica Envenenado. Descarte armadilha." },
      { name: "Emboscada", xp: 3, stamina: 1, rules: "Exaura quando monstro entrar a até 3 espaços de armadilha para atacá-lo. Se não derrotado, continua ativação." },
      { name: "Vantagem", xp: 3, stamina: 2, rules: "+1 💧 e +2 Vida. ➔: Ataque. Antes de rolar, descarte armadilhas do mapa para +1 HP por cada." },
    ]
  },
  "Ladrão": {
    skills: [
      { name: "Ganancioso", xp: 0, stamina: 1, rules: "➔: Vasculhe ficha de busca a até 3 espaços de você." },
      { name: "Avaliação", xp: 1, stamina: null, rules: "Após comprar Busca, pode descartá-la para comprar outra. Deve manter a segunda." },
      { name: "Truques Sujos", xp: 1, stamina: 1, rules: "➔: Ataque com Corpo a Corpo ou Lâmina. Se causar 1+ HP, alvo fica Atordoado." },
      { name: "Furtivo", xp: 1, stamina: null, rules: "+1 HP contra monstros sem linha de visão para você no início do turno. Exaura para abrir/fechar porta sem ação." },
      { name: "Estrepes", xp: 2, stamina: 1, rules: "Quando monstro se mover para adjacente, exaura e teste Percepção. Se passar, 1 HP e fica Imobilizado." },
      { name: "Cambalhota", xp: 2, stamina: 1, rules: "Exaura no turno. Enquanto exaurida, pode mover através de figuras inimigas." },
      { name: "Invisível", xp: 2, stamina: 2, rules: "Exaura no turno. Enquanto exaurida, ataques contra você erram, a menos que gastem 1 ⚡." },
      { name: "Ataque Surpresa", xp: 3, stamina: 1, rules: "Exaura para atacar monstro que seja o único na visão. Não requer ação." },
      { name: "Espreitar", xp: 3, stamina: 1, rules: "➔: Exaura para vasculhar sem ação. Enquanto exaurida, +1 dado marrom de defesa." },
    ]
  },
  "Monge (Híbrido)": {
    isHybrid: true,
    hybridArchetype: "Curandeiro",
    skills: [
      { name: "Chamado Superior", xp: 0, stamina: null, rules: "Ao ganhar esta carta, escolha 1 baralho de Classe padrão do arquétipo Curandeiro. Você pode comprar perícias de qualquer um dos baralhos, exceto cartas com custo 3 XP do baralho de Curandeiro escolhido." },
      { name: "Equilíbrio Interior", xp: 1, stamina: 1, rules: "Exaura ao declarar descanso. 1 herói a até 3 espaços descarta 1 Condição. Enquanto exaurida, +1 em todos os testes de atributo (máx 6)." },
      { name: "Mãos Vazias", xp: 2, stamina: 1, rules: "Ao derrotar monstro com mãos nuas, ataque adicional imediato. Ataques com mãos nuas ganham: \"Perfurar X (X = alcance). ⚡: Atordoar\"." },
      { name: "Voto de Liberdade", xp: 3, stamina: null, rules: "Ao atacar com mãos nuas ou Exótica, após rolar, pode mudar cada X para outro resultado. Sem Armadura Leve/Pesada, pode mudar resultados de defesa em branco." },
    ]
  },
  "Devastador (Híbrido)": {
    isHybrid: true,
    hybridArchetype: "Guerreiro",
    skills: [
      { name: "Endurecido pela Batalha", xp: 0, stamina: null, rules: "Ao ganhar esta carta, escolha 1 baralho de Classe padrão do arquétipo Guerreiro. Você pode comprar perícias de qualquer um dos baralhos, exceto cartas com custo 3 XP do baralho de Guerreiro escolhido." },
      { name: "Momento", xp: 1, stamina: 1, rules: "Exaura após atacar com Corpo a Corpo. Ganhe mov igual ao HP que o alvo sofreu." },
      { name: "Assalto Impetuoso", xp: 2, stamina: null, rules: "Ao atacar com Corpo a Corpo, antes de rolar, gaste até 3 mov. Ataque ganha +1 HP por mov gasto." },
      { name: "Arremesso Vicioso", xp: 3, stamina: 1, rules: "+1 Velocidade. ➔: Ataque à distância com arma Corpo a Corpo equipada. Alcance = sua Velocidade. Após o ataque, desequipe a arma." },
    ]
  },
  "Trapaceiro (Híbrido)": {
    isHybrid: true,
    hybridArchetype: "Mago",
    skills: [
      { name: "Ofuscante", xp: 0, stamina: null, rules: "Ao ganhar esta carta, escolha 1 baralho de Classe padrão do arquétipo Mago. Você pode comprar perícias de qualquer um dos baralhos, exceto cartas com custo 3 XP do baralho de Mago escolhido." },
      { name: "Coleção Particular", xp: 1, stamina: null, rules: "Ao comprar e guardar Busca, coloque 1 ficha de 💧 nesta carta. Ao usar perícia, descarte 1 ficha desta carta para ignorar o custo de 💧 daquela perícia." },
      { name: "Agora Você me Vê", xp: 2, stamina: 1, rules: "Ao ser alvo de ataque, 1 herói a até 5 espaços não afetado pode trocar de lugar com você e se tornar o alvo." },
      { name: "Fusão Arcana", xp: 3, stamina: null, rules: "No início do encontro, escolha 1 arma Mágica não equipada que carregue. Coloque-a junto a 1 arma equipada. Enquanto equipada, ela ganha habilidades e características da arma escolhida." },
    ]
  },
  "Invasor (Híbrido)": {
    isHybrid: true,
    hybridArchetype: "Batedor",
    skills: [
      { name: "No Meio do Combate", xp: 0, stamina: null, rules: "Ao ganhar esta carta, escolha 1 baralho de Classe padrão do arquétipo Batedor. Você pode comprar perícias de qualquer um dos baralhos, exceto cartas com custo 3 XP do baralho de Batedor escolhido." },
      { name: "Assalto Surpresa", xp: 1, stamina: null, rules: "Ao atacar monstro que não tinha linha de visão para você no início do turno, +1 ⚡ ao ataque." },
      { name: "Dividir os Espólios", xp: 2, stamina: null, rules: "+1 💧. Ao comprar e guardar Busca, cada herói recupera 1 💧. Pode dar a carta para outro herói imediatamente." },
      { name: "Fechar a Distância", xp: 3, stamina: 1, rules: "+1 Velocidade. Exaura após ataque à distância. Equipe/desequipe armas livremente. Mova até Velocidade e ataque com Corpo a Corpo." },
    ]
  },
  "Conjurador de Aço (Híbrido)": {
    isHybrid: true,
    hybridArchetype: "Mago",
    skills: [
      { name: "Guarda Rúnica", xp: 0, stamina: null, rules: "Ao ganhar esta carta, escolha 1 baralho de Classe padrão do arquétipo Mago. Você pode comprar perícias de qualquer um dos baralhos, exceto cartas com custo 3 XP do baralho de Mago escolhido." },
      { name: "Enxerto de Runas", xp: 1, stamina: null, rules: "+1 Força. Armadura perde restrição de Runas. Ao atacar com Rúnica e Armadura Pesada: \"⚡: Recupera 2 HP e 1 💧\"." },
      { name: "Mago do Escudo", xp: 2, stamina: null, rules: "1 Escudo perde ícone de 1 mão. Exaura quando herói a 3 espaços for atacado: ele usa seu Escudo. Após, sofra 1 💧 para renovar carta e Escudo." },
      { name: "Sangue de Ferro", xp: 3, stamina: 1, rules: "-1 Velocidade, +4 Vida, +1 💧. Se rolar brancos na defesa, +1 Escudo. Ao ganhar Condição, descarte-a imediatamente." },
    ]
  },
  "Vidente (Híbrido)": {
    isHybrid: true,
    hybridArchetype: "Batedor",
    skills: [
      { name: "Clarividência", xp: 0, stamina: null, rules: "Ao ganhar esta carta, escolha 1 baralho de Classe padrão do arquétipo Batedor. Você pode comprar perícias de qualquer um dos baralhos, exceto cartas com custo 3 XP do baralho de Batedor escolhido." },
      { name: "Visão Verdadeira", xp: 1, stamina: null, rules: "Pode contar Alcance e traçar linha de visão a partir de fichas de busca na sua linha de visão." },
      { name: "Translocação", xp: 2, stamina: null, rules: "Exaura no final do turno para escolher 2 heróis. Eles trocam de lugar no mapa." },
      { name: "Premonição", xp: 3, stamina: null, rules: "Exaura quando monstro entrar em espaço adjacente para atacá-lo. Ganha: \"⚡: Se causar 1+ HP, alvo sofre 1 Condição à sua escolha\"." },
    ]
  },
  "Vigia (Híbrido)": {
    isHybrid: true,
    hybridArchetype: "Batedor",
    skills: [
      { name: "Vigilância", xp: 0, stamina: null, rules: "Ao ganhar esta carta, escolha 1 baralho de Classe padrão do arquétipo Batedor. Você pode comprar perícias de qualquer um dos baralhos, exceto cartas com custo 3 XP do baralho de Batedor escolhido." },
      { name: "Recuperação Rápida", xp: 1, stamina: 1, rules: "Quando herói na visão iniciar turno: +1 mov e +1 HP. OU no turno de herói: vire 1 Busca para baixo para descartar 1 Condição." },
      { name: "Pioneiro", xp: 2, stamina: null, rules: "Na Viagem, +2 em testes de Conhecimento, Percepção e Vontade (máx 6). Exaura no turno de herói: você e adjacentes movem 1 espaço." },
      { name: "Unidade", xp: 3, stamina: null, rules: "Quando herói na visão recuperar 1+ HP, também recupera 1 💧. Teste Vontade; se falhar, exaura. Outros heróis podem usar suas Buscas como se estivessem na área deles." },
    ]
  },
  "Herético (Híbrido)": {
    isHybrid: true,
    hybridArchetype: "Mago",
    skills: [
      { name: "Visionário Exilado", xp: 0, stamina: null, rules: "Ao ganhar esta carta, escolha 1 baralho de Classe padrão do arquétipo Mago. Você pode comprar perícias de qualquer um dos baralhos, exceto cartas com custo 3 XP do baralho de Mago escolhido." },
      { name: "Cura Arcana", xp: 1, stamina: 1, rules: "Exaura no início do turno. Enquanto exaurida, herói a até 3 espaços que recuperar 1+ 💧 também recupera 1 HP." },
      { name: "Recuperação Sombria", xp: 2, stamina: null, rules: "Exaura no início do turno e sofra até 2 HP. Recupere 💧 igual ao HP sofrido." },
      { name: "Artes Proibidas", xp: 3, stamina: null, rules: "Ao derrotar monstro, descarte 1 Condição sua. Heróis a 3 espaços atacando ganham: \"⚡: +2 HP. ⚡: Veneno. ⚡: Recupere 1 HP.\"" },
    ]
  },
};

const HEALER_STANDARD_CLASSES = ["Boticário", "Bardo", "Discípulo", "Profeta", "Ceifador de Almas", "Orador dos Espíritos"];
const WARRIOR_STANDARD_CLASSES = ["Mestre das Feras", "Berserker", "Campeão", "Cavaleiro", "Marechal", "Escaramuçador"];
const MAGE_STANDARD_CLASSES = ["Conjurador", "Elementalista", "Geomante", "Feiticeiro", "Necromante", "Mestre das Runas"];
const SCOUT_STANDARD_CLASSES = ["Caçador de Recompensas", "Caminhante das Sombras", "Caçador de Tesouros", "Mateiro", "Espreitador", "Ladrão"];

const HYBRID_COLORS = { Curandeiro: "#6aafe6", Guerreiro: "#c87e7e", Mago: "#e8c06a", Batedor: "#7ec8a0" };
const hybridColor = (arch) => HYBRID_COLORS[arch] || "#7ec8a0";

// ─── ITEMS ──────────────────────────────────────────────────────────────────
// slot: "1h" = uma mão, "2h" = duas mãos, "armor" = vestimenta, "other" = outros/bugigangas

const SHOP_ITEMS = [
  { id: "escudo-ferro", name: "Escudo de Ferro", slot: "1h", dice: "—", rules: "Exaura após rolar defesa para re-rolar 1 dado ou +1 🛡️.", ch: "I", trait: "Escudo", gold: 50 },
  { id: "armadura-couro", name: "Armadura de Couro", slot: "armor", dice: "🟫", rules: "+1 Vida.", ch: "I", trait: "Armadura Leve", gold: 75 },
  { id: "manto-pesado", name: "Manto Pesado", slot: "armor", dice: "—", rules: "Exaura após rolar para cancelar 1 ⚡ em ataque contra você.", ch: "I", trait: "Armadura Pesada", gold: 75 },
  { id: "lanca-ferro", name: "Lança de Ferro", slot: "1h", attack: "Corpo a corpo", dice: "🟦🟨", rules: "Alcance. ⚡: +1 HP. ⚡: Perfurar 1.", ch: "I", trait: "Exótica", gold: 75 },
  { id: "martelo-leve", name: "Martelo Leve", slot: "1h", attack: "Corpo a corpo", dice: "🟦🟨", rules: "+2 HP. ⚡: Atordoar.", ch: "I", trait: "Martelo", gold: 75 },
  { id: "funda", name: "Funda", slot: "1h", attack: "À distância", dice: "🟦🟨", rules: "⚡: +1 Alcance, +1 HP. ⚡: Atordoar.", ch: "I", trait: "Exótica", gold: 75 },
  { id: "elmo-escorpiao", name: "Elmo de Escorpião", slot: "other", dice: "—", rules: "Ataques à Distância ganham +1 Alcance. Limite 1 Elmo.", ch: "I", trait: "Capacete", gold: 75 },
  { id: "espada-larga-aco", name: "Espada Larga de Aço", slot: "1h", attack: "Corpo a corpo", dice: "🟦🟥", rules: "Re-role 1 dado vermelho por ataque. ⚡: +1 HP.", ch: "I", trait: "Espada", gold: 100 },
  { id: "machado-batalha-ferro", name: "Machado de Batalha de Ferro", slot: "2h", attack: "Corpo a corpo", dice: "🟦🟥", rules: "Perfurar 1. ⚡: Perfurar 1. ⚡: +2 HP.", ch: "I", trait: "Machado", gold: 100 },
  { id: "arco-longo-olmo", name: "Arco Longo de Olmo", slot: "2h", attack: "À distância", dice: "🟦🟨", rules: "Adjacentes não bloqueiam visão. ⚡: +2 Alcance. ⚡: +2 HP.", ch: "I", trait: "Arco", gold: 100 },
  { id: "amuleto-sorte", name: "Amuleto da Sorte", slot: "other", dice: "—", rules: "Exaura para re-rolar teste de atributo. Deve manter o novo.", ch: "I", trait: "Bugiganga", gold: 100 },
  { id: "raio-sol", name: "Raio de Sol", slot: "2h", attack: "À distância", dice: "🟦🟨", rules: "⚡: Atordoar. ⚡: +2 HP.", ch: "I", trait: "Magia, Runa", gold: 125 },
  { id: "onda-mana", name: "Onda de Mana", slot: "other", dice: "—", rules: "Após rolar ataque, exaura para +1 ⚡ ao resultado.", ch: "I", trait: "Runa", gold: 125 },
  { id: "cota-malha", name: "Cota de Malha", slot: "armor", dice: "◻️", rules: "Não pode equipar Runas. Mov reduzido a 4 (não pode aumentar).", ch: "I", trait: "Armadura Pesada", gold: 150 },
  { id: "cajado-magico", name: "Cajado Mágico", slot: "2h", attack: "À distância", dice: "🟦🟥", rules: "⚡: 1 HP a monstro a 3 espaços do alvo. ⚡: +1 Alcance.", ch: "I", trait: "Magia, Cajado", gold: 150 },
  { id: "imolacao", name: "Imolação", slot: "2h", attack: "À distância", dice: "🟦🟥", rules: "Perfurar 1. ⚡: +1 HP. ⚡: +1 Alcance.", ch: "I", trait: "Magia, Runa", gold: 150 },
  { id: "anel-poder", name: "Anel do Poder", slot: "other", dice: "—", rules: "+1 💧.", ch: "I", trait: "Anel", gold: 150 },
  { id: "besta", name: "Besta", slot: "1h", attack: "À distância", dice: "🟦🟨", rules: "Perfurar 1. ⚡: +2 HP. ⚡: +1 HP e mova alvo 1 espaço.", ch: "I", trait: "Arco, Exótico", gold: 175 },
  { id: "escudo-aco-pesado", name: "Escudo de Aço Pesado", slot: "1h", dice: "—", rules: "Exaura após rolar defesa para re-rolar 1 dado e +1 🛡️.", ch: "II", trait: "Escudo", gold: 100 },
];

const CLASS_STARTING_EQUIPMENT = {
  "Boticário": [
    { id: "frascos-fumegantes", name: "Frascos Fumegantes", slot: "1h", attack: "À distância", dice: "🟦🟩", rules: "⚡⚡: +3 HP. ⚡: Veneno.", trait: "Exótica", gold: 0 },
  ],
  "Bardo": [
    { id: "alaude", name: "Alaúde", slot: "other", dice: "—", rules: "Exaura e sofra 1 💧: herói a 3 espaços recupera 1 💧.", trait: "Bugiganga", gold: 0 },
    { id: "lamina-viajante", name: "Lâmina do Viajante", slot: "1h", attack: "Corpo a corpo", dice: "🟦🟨", rules: "⚡: Perfurar 1. ⚡: +1 mov.", trait: "Espada", gold: 0 },
  ],
  "Discípulo": [
    { id: "maca-ferro", name: "Maça de Ferro", slot: "1h", attack: "Corpo a corpo", dice: "🟦🟨", rules: "⚡: Atordoar.", trait: "Martelo", gold: 0 },
    { id: "escudo-madeira", name: "Escudo de Madeira", slot: "1h", dice: "—", rules: "Exaura após rolar defesa para +1 🛡️.", trait: "Escudo", gold: 0 },
  ],
  "Profeta": [
    { id: "mangual-ferro", name: "Mangual de Ferro", slot: "1h", attack: "Corpo a corpo", dice: "🟦🟨", rules: "Alcance. Mão vazia: +1 HP. ⚡: Enfraquecer.", trait: "Martelo, Exótica", gold: 0 },
    { id: "tomo-sabio", name: "Tomo do Sábio", slot: "other", dice: "—", rules: "Exaura antes de teste para -1 🛡️ nos resultados.", trait: "Livro", gold: 0 },
  ],
  "Ceifador de Almas": [
    { id: "foice-ceifador", name: "Foice do Ceifador", slot: "1h", attack: "Corpo a corpo", dice: "🟦🟨", rules: "Derrotar: +1 HP. ⚡: Perfurar 1.", trait: "Magia, Lâmina, Cajado", gold: 0 },
    { id: "espelho-almas", name: "Espelho de Almas", slot: "other", dice: "—", rules: "Ao descartar Condição, +1 essência em Colheita.", trait: "Bugiganga", gold: 0 },
  ],
  "Orador dos Espíritos": [
    { id: "cajado-carvalho", name: "Cajado de Carvalho", slot: "2h", attack: "Corpo a corpo", dice: "🟦🟨", rules: "Alcance. ⚡: +1 HP.", trait: "Cajado", gold: 0 },
  ],
  "Caçador de Recompensas": [
    { id: "besta-dupla", name: "Besta Dupla", slot: "2h", attack: "À distância", dice: "🟦🟥", rules: "⚡: Perfurar 1. ⚡: +1 Alcance.", trait: "Besta, Exótico", gold: 0 },
  ],
  "Caminhante das Sombras": [
    { id: "machadinha-penas", name: "Machadinha de Penas", slot: "1h", attack: "À distância", dice: "🟦🟥", rules: "⚡: +1 Alcance. ⚡: Sangrar.", trait: "Machado, Exótico", gold: 0 },
    { id: "manto-tribal", name: "Manto Tribal", slot: "armor", dice: "—", rules: "Exaura ao descansar. Enquanto exaurida, +1 🟫 à defesa.", trait: "Manto", gold: 0 },
    { id: "alma-sombria-item", name: "Alma Sombria", slot: "other", dice: "—", rules: "Familiar: Vel 1, Sem Vida, Sem defesa. Pode ocupar espaço com figuras/terreno. Monstros no espaço ou adjacentes que sofram HP de ataque sofrem +1 HP.", trait: "Familiar", gold: 0 },
  ],
  "Mestre das Feras": [
    { id: "lanca-caca", name: "Lança de Caça", slot: "1h", attack: "Corpo a corpo", dice: "🟦🟥", rules: "Alcance. ⚡: Perfurar 1.", trait: "Exótico", gold: 0 },
    { id: "faca-esfolar", name: "Faca de Esfolar", slot: "1h", attack: "Corpo a corpo", dice: "🟦🟩", rules: "Se alvo tiver fichas de dano, ganha: \"⚡: +3 HP\".", trait: "Espada", gold: 0 },
    { id: "lobo-item", name: "Lobo", slot: "other", dice: "—", rules: "Familiar: Vel 4, Vida 3, Sem defesa. Ataque Corpo a Corpo: 🟦🟥. Tratado como figura. 1 ação de ataque na ativação. ⚡: Perfurar 1.", trait: "Familiar", gold: 0 },
  ],
  "Berserker": [
    { id: "grande-machado-lascado", name: "Grande Machado Lascado", slot: "2h", attack: "Corpo a corpo", dice: "🟦🟥", rules: "⚡: +1 HP. ⚡: +1 HP.", trait: "Machado", gold: 0 },
  ],
  "Campeão": [
    { id: "espada-larga-gasta", name: "Espada Larga Gasta", slot: "2h", attack: "Corpo a corpo", dice: "🟦🟥", rules: "Antes de rolar, sofra 1 💧 para +1 ⚡ ao resultado. ⚡: +1 HP.", trait: "Espada", gold: 0 },
    { id: "chifre-coragem", name: "Chifre da Coragem", slot: "other", dice: "—", rules: "Exaura para dar 1 Valor a herói a até 3 espaços.", trait: "Bugiganga", gold: 0 },
  ],
  "Cavaleiro": [
    { id: "espada-larga-gasta-cav", name: "Espada Larga Gasta", slot: "2h", attack: "Corpo a corpo", dice: "🟦🟥", rules: "Antes de rolar, sofra 1 💧 para +1 ⚡ ao resultado. ⚡: +1 HP.", trait: "Espada", gold: 0 },
    { id: "manto-tribal-cav", name: "Manto Tribal", slot: "armor", dice: "—", rules: "Exaura ao descansar. Enquanto exaurida, +1 🟫 à defesa.", trait: "Manto", gold: 0 },
  ],
  "Marechal": [
    { id: "martelo-guerra", name: "Martelo de Guerra", slot: "2h", attack: "Corpo a corpo", dice: "🟦🟥", rules: "Não pode gastar ⚡ para recuperar 💧. ⚡: +2 HP.", trait: "Martelo", gold: 0 },
    { id: "anel-sinete", name: "Anel de Sinete", slot: "other", dice: "—", rules: "Exaura quando você ou herói adjacente for atacado, antes de rolar, para +1 🛡️ aos resultados.", trait: "Bugiganga", gold: 0 },
  ],
  "Escaramuçador": [
    { id: "machadinha-serrilhada", name: "Machadinha Serrilhada", slot: "1h", attack: "Corpo a corpo", dice: "🟦🟨", rules: "Antes de rolar, sofra 1 💧 para trocar dado amarelo por vermelho. ⚡: Perfurar 1.", trait: "Machado", gold: 0 },
    { id: "machado-enferrujado", name: "Machado Enferrujado", slot: "1h", attack: "Corpo a corpo", dice: "🟦🟩", rules: "Após rolar, sofra 1 💧 para re-rolar 1 dado de poder. ⚡: +2 HP.", trait: "Machado", gold: 0 },
  ],
  "Conjurador": [
    { id: "cajado-prismatico", name: "Cajado Prismático", slot: "2h", attack: "À distância", dice: "🟦🟩", rules: "⚡: +1 HP. ⚡: +1 HP. ⚡: Atordoar.", trait: "Magia, Cajado", gold: 0 },
  ],
  "Elementalista": [
    { id: "pinaculo-confluencia", name: "Pináculo da Confluência", slot: "2h", attack: "À distância", dice: "🟦🟩", rules: "⚡: +1 HP. ⚡: Se 2+ cartas 🌀 exauridas, +2 HP.", trait: "Magia, Cajado", gold: 0 },
    { id: "reserva-estilhacos", name: "Reserva de Estilhaços", slot: "other", dice: "—", rules: "Exaura após derrotar monstro com arma Mágica. Enquanto exaurida, é considerada carta 🌀 exaurida.", trait: "Bugiganga", gold: 0 },
  ],
  "Geomante": [
    { id: "runa-estase", name: "Runa de Estase", slot: "2h", attack: "À distância", dice: "🟦🟩", rules: "⚡: +1 HP. ⚡⚡: Imobilizar.", trait: "Magia, Runa", gold: 0 },
    { id: "pedra-convocada-item", name: "Pedra Convocada", slot: "other", dice: "—", rules: "Familiar: Vel 2, Vida 2, Def 🟫. Obstáculo, pode ser alvo de ataques. Máx 1 no mapa. Seus ataques contra monstro adjacente a Pedra ganham +1 ⚡.", trait: "Familiar", gold: 0 },
  ],
  "Feiticeiro": [
    { id: "cajado-sepultura", name: "Cajado da Sepultura", slot: "2h", attack: "À distância", dice: "🟦🟩", rules: "⚡: +1 Alcance. ⚡: +1 HP e Recupere 1 HP.", trait: "Magia, Cajado", gold: 0 },
  ],
  "Necromante": [
    { id: "foice-ceifador-necro", name: "Foice do Ceifador", slot: "2h", attack: "À distância", dice: "🟦🟨", rules: "Ao derrotar monstro com esta arma, recupere 1 HP. ⚡: +1 Alcance.", trait: "Magia, Cajado", gold: 0 },
    { id: "reanimado-item", name: "Reanimado", slot: "other", dice: "—", rules: "Familiar: Vel 3, Vida 4, Sem defesa. Ataque Corpo a Corpo: 🟦🟥. Não pode recuperar vida. 1 ação de ataque na ativação. ⚡: +1 HP.", trait: "Familiar", gold: 0 },
  ],
  "Mestre das Runas": [
    { id: "dardo-arcano", name: "Dardo Arcano", slot: "2h", attack: "À distância", dice: "🟦🟨", rules: "⚡: +1 Alcance. ⚡: Perfurar 2.", trait: "Magia, Runa", gold: 0 },
  ],
  "Caçador de Tesouros": [
    { id: "chicote-couro", name: "Chicote de Couro", slot: "1h", attack: "Corpo a corpo", dice: "🟦🟨", rules: "Alcance. ⚡: Perfurar 1. ⚡: Mova o alvo 1 espaço.", trait: "Exótico", gold: 0 },
    { id: "bussola-defunto", name: "Bússola do Defunto", slot: "other", dice: "—", rules: "Exaura no turno. Se a até 3 espaços de ficha de busca, ganhe 1 mov.", trait: "Bugiganga", gold: 0 },
  ],
  "Mateiro": [
    { id: "arco-curto-teixo", name: "Arco Curto de Teixo", slot: "2h", attack: "À distância", dice: "🟦🟨", rules: "⚡: +2 Alcance. ⚡: +1 HP.", trait: "Arco", gold: 0 },
  ],
  "Espreitador": [
    { id: "faca-caca", name: "Faca de Caça", slot: "1h", attack: "Corpo a corpo", dice: "🟦🟨", rules: "⚡: +1 HP. ⚡: Recupere 1 💧.", trait: "Espada", gold: 0 },
    { id: "teia-viuva-negra", name: "Teia da Viúva Negra", slot: "1h", attack: "À distância", dice: "🟦🟩", rules: "⚡: Imobilizar. ⚡: +1 HP.", trait: "Exótico", gold: 0 },
  ],
  "Ladrão": [
    { id: "facas-arremesso", name: "Facas de Arremesso", slot: "1h", attack: "À distância", dice: "🟦🟨", rules: "Contra monstro adjacente, +1 HP. ⚡: +1 Alcance.", trait: "Espada", gold: 0 },
    { id: "amuleto-sorte-ladrao", name: "Amuleto da Sorte", slot: "other", dice: "—", rules: "Exaura para re-rolar teste de atributo. Mantenha o novo resultado.", trait: "Bugiganga", gold: 0 },
  ],
};

const SLOT_LABELS = { "1h": "✋", "2h": "✋🤚", armor: "👕", other: "💍" };
const SLOT_NAMES = { "1h": "Uma Mão", "2h": "Duas Mãos", armor: "Vestimenta", other: "Outro" };

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

const defColors = { gray: "#9ca3af", brown: "#a3845c", black: "#4a4a4a" };
const defDice = { gray: "🔲", brown: "🟫", black: "⬛" };

function StatBadge({ label, value, color, theme }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
      background: theme === "light" ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)", borderRadius: 8, padding: "6px 10px", minWidth: 48,
    }}>
      <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1, opacity: 0.5, fontFamily: "'EB Garamond', serif" }}>{label}</span>
      <span style={{ fontSize: 20, fontWeight: 700, color: color || "#e8e0d4", fontFamily: "'Cinzel', serif" }}>{value}</span>
    </div>
  );
}

function SkillCard({ skill, selected, onToggle, disabled, theme, exhausted, onExhaustToggle }) {
  const isInit = skill.xp === 0;
  const isLight = theme === "light";
  const hasExhaust = /exaur|exaust/i.test(skill.rules);
  return (
    <div
      onClick={() => !disabled && onToggle()}
      style={{
        background: selected ? (isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.08)") : (isLight ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.2)"),
        border: exhausted ? "1px solid rgba(232,126,126,0.4)" : (selected ? `1px solid ${isLight ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.3)"}` : `1px solid ${isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.06)"}`),
        borderLeft: exhausted ? "3px solid #e87e7e" : undefined,
        borderRadius: 10, padding: "12px 14px", cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled && !selected ? 0.4 : 1,
        transition: "all 0.2s ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: 14, fontWeight: 600 }}>{skill.name}</span>
          {hasExhaust && selected && (
            <label onClick={e => e.stopPropagation()} style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", fontSize: 11, color: exhausted ? "#e87e7e" : (isLight ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.35)") }}>
              <input
                type="checkbox"
                checked={!!exhausted}
                onChange={e => onExhaustToggle(skill.name, e.target.checked)}
                style={{ accentColor: "#e87e7e", width: 13, height: 13, cursor: "pointer" }}
              />
              {exhausted ? "Exaurida" : "Exaurir"}
            </label>
          )}
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {skill.stamina && <span style={{ fontSize: 11, background: "rgba(100,180,255,0.15)", color: "#7cb8f0", padding: "2px 7px", borderRadius: 6 }}>💧{skill.stamina}</span>}
          <span style={{
            fontSize: 11, padding: "2px 8px", borderRadius: 6,
            background: skill.elemental ? "rgba(139,126,200,0.2)" : (isInit ? "rgba(120,200,160,0.15)" : "rgba(255,200,100,0.15)"),
            color: skill.elemental ? "#8b7ec8" : (isInit ? "#7ec8a0" : "#e8c06a"),
          }}>
            {skill.elemental ? "🌀 Elemental" : (isInit ? "Início" : `${skill.xp} XP`)}
          </span>
        </div>
      </div>
      <p style={{ fontSize: 12, lineHeight: 1.5, opacity: exhausted ? 0.35 : 0.6, margin: 0, textDecoration: exhausted ? "line-through" : "none", transition: "all 0.2s ease" }}>{skill.rules}</p>
    </div>
  );
}

const THEMES = {
  dark: {
    bg: "#0f0e0c", headerBg: "linear-gradient(180deg, rgba(40,35,28,0.9) 0%, rgba(15,14,12,1) 100%)",
    text: "#e8e0d4", textMuted: "rgba(232,224,212,0.6)", textFaint: "rgba(232,224,212,0.4)",
    cardBg: "rgba(255,255,255,0.04)", cardBorder: "rgba(255,255,255,0.06)",
    inputBg: "#1a1816", inputBorder: "rgba(255,255,255,0.1)",
    btnBg: "rgba(255,255,255,0.08)", headerBorder: "rgba(255,255,255,0.06)",
    skillBg: "rgba(0,0,0,0.2)", skillActiveBg: "rgba(255,255,255,0.08)", skillActiveBorder: "rgba(255,255,255,0.3)",
    summaryBg: "linear-gradient(135deg, rgba(232,192,106,0.06), rgba(200,150,100,0.03))",
    summaryBorder: "rgba(232,192,106,0.15)",
  },
  light: {
    bg: "#ffffff", headerBg: "linear-gradient(180deg, #f0ebe3 0%, #ffffff 100%)",
    text: "#2a2520", textMuted: "rgba(42,37,32,0.6)", textFaint: "rgba(42,37,32,0.4)",
    cardBg: "rgba(0,0,0,0.03)", cardBorder: "rgba(0,0,0,0.08)",
    inputBg: "#ffffff", inputBorder: "rgba(0,0,0,0.15)",
    btnBg: "rgba(0,0,0,0.06)", headerBorder: "rgba(0,0,0,0.08)",
    skillBg: "rgba(255,255,255,0.6)", skillActiveBg: "rgba(0,0,0,0.04)", skillActiveBorder: "rgba(0,0,0,0.2)",
    summaryBg: "linear-gradient(135deg, rgba(180,150,80,0.1), rgba(160,120,70,0.05))",
    summaryBorder: "rgba(180,150,80,0.25)",
  }
};

export default function RPGCharacterSheet() {
  const [archetype, setArchetype] = useState(null);
  const [heroName, setHeroName] = useState("");
  const [className, setClassName] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [xpSpent, setXpSpent] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [gold, setGold] = useState(0);
  const [heroicFeatUsed, setHeroicFeatUsed] = useState(false);
  const [exhaustedSkills, setExhaustedSkills] = useState({});
  const [hybridSubclass, setHybridSubclass] = useState("");
  const [inventory, setInventory] = useState([]);
  const [equipped, setEquipped] = useState([]);
  const [exhaustedItems, setExhaustedItems] = useState({});
  const [showShop, setShowShop] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [toast, setToast] = useState("");
  const sheetRef = useRef(null);
  const heroCardRef = useRef(null);

  const t = THEMES[theme];
  const archData = archetype ? ARCHETYPES[archetype] : null;
  const heroData = archData?.heroes.find(h => h.name === heroName);
  const classSkills = CLASS_SKILLS[className];

  useEffect(() => {
    if (archetype) { setHeroName(""); setClassName(""); setSelectedSkills([]); setHeroicFeatUsed(false); setExhaustedSkills({}); setHybridSubclass(""); setInventory([]); setEquipped([]); setExhaustedItems({}); setShowShop(false); }
  }, [archetype]);

  useEffect(() => {
    if (className && classSkills) {
      const initSkills = classSkills.skills.filter(s => s.xp === 0 && !s.elemental).map(s => s.name);
      setSelectedSkills(initSkills);
      setExhaustedSkills({});
      setHybridSubclass("");
      const startItems = CLASS_STARTING_EQUIPMENT[className] || [];
      setInventory(startItems.map(it => ({ ...it })));
      setEquipped(startItems.map(it => it.id));
      setShowShop(false);
    } else {
      setSelectedSkills([]);
      setExhaustedSkills({});
      setHybridSubclass("");
      setInventory([]);
      setEquipped([]);
    }
  }, [className]);

  // When hybrid subclass changes, add its init skills and starting equipment
  useEffect(() => {
    if (hybridSubclass && CLASS_SKILLS[hybridSubclass]) {
      const hybridInit = CLASS_SKILLS[hybridSubclass].skills.filter(s => s.xp === 0).map(s => s.name);
      setSelectedSkills(prev => {
        const baseInit = classSkills ? classSkills.skills.filter(s => s.xp === 0 && !s.elemental).map(s => s.name) : [];
        const currentNonInit = prev.filter(n => {
          const inBase = classSkills?.skills.find(s => s.name === n);
          if (inBase && inBase.xp === 0 && !inBase.elemental) return false;
          return true;
        });
        return [...new Set([...baseInit, ...hybridInit, ...currentNonInit])];
      });
      // Load starting equipment from both the hybrid class and its chosen subclass
      const baseItems = CLASS_STARTING_EQUIPMENT[className] || [];
      const subItems = CLASS_STARTING_EQUIPMENT[hybridSubclass] || [];
      const allItems = [...baseItems, ...subItems].map(it => ({ ...it }));
      setInventory(allItems);
      setEquipped(allItems.map(it => it.id));
    }
  }, [hybridSubclass]);

  const isHybridClass = classSkills?.isHybrid;
  const hybridSubclassSkills = (isHybridClass && hybridSubclass && CLASS_SKILLS[hybridSubclass])
    ? CLASS_SKILLS[hybridSubclass].skills.filter(s => s.xp <= 2)
    : [];

  const allSkillsForXP = [
    ...(classSkills ? classSkills.skills : []),
    ...hybridSubclassSkills,
  ];
  const xpUsed = allSkillsForXP.filter(s => selectedSkills.includes(s.name) && s.xp > 0).reduce((sum, s) => sum + s.xp, 0);

  function toggleSkill(skill) {
    if (skill.xp === 0) return;
    if (selectedSkills.includes(skill.name)) {
      setSelectedSkills(prev => prev.filter(n => n !== skill.name));
    } else {
      const newXP = allSkillsForXP.filter(s => selectedSkills.includes(s.name) && s.xp > 0).reduce((sum, s) => sum + s.xp, 0);
      if (newXP + skill.xp <= totalXP) {
        setSelectedSkills(prev => [...prev, skill.name]);
      }
    }
  }

  // ─── Equipment helpers ────────────────────────────────────────────
  function getEquippedItems() { return inventory.filter(it => equipped.includes(it.id)); }
  function handsUsed() {
    return getEquippedItems().reduce((sum, it) => sum + (it.slot === "2h" ? 2 : it.slot === "1h" ? 1 : 0), 0);
  }
  function armorCount() { return getEquippedItems().filter(it => it.slot === "armor").length; }
  function otherCount() { return getEquippedItems().filter(it => it.slot === "other").length; }

  function canEquip(item) {
    if (equipped.includes(item.id)) return false;
    if (item.slot === "2h") return handsUsed() === 0;
    if (item.slot === "1h") return handsUsed() <= 1;
    if (item.slot === "armor") return armorCount() === 0;
    if (item.slot === "other") return otherCount() < 2;
    return false;
  }

  function toggleEquip(item) {
    if (equipped.includes(item.id)) {
      setEquipped(prev => prev.filter(id => id !== item.id));
      setExhaustedItems(prev => { const n = { ...prev }; delete n[item.id]; return n; });
    } else if (canEquip(item)) {
      setEquipped(prev => [...prev, item.id]);
    }
  }

  function buyItem(shopItem) {
    if (gold < shopItem.gold) return;
    const uid = shopItem.id + "-" + Date.now();
    const newItem = { ...shopItem, id: uid };
    setGold(prev => prev - shopItem.gold);
    setInventory(prev => [...prev, newItem]);
  }

  function sellItem(item) {
    if (item.gold === 0) return;
    setEquipped(prev => prev.filter(id => id !== item.id));
    setExhaustedItems(prev => { const n = { ...prev }; delete n[item.id]; return n; });
    setInventory(prev => prev.filter(it => it.id !== item.id));
    setGold(prev => prev + Math.floor(item.gold / 2));
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  async function handleSave() {
    const data = { archetype, heroName, className, selectedSkills, totalXP, gold, heroicFeatUsed, exhaustedSkills, hybridSubclass, inventory, equipped, exhaustedItems, theme };
    try {
      await window.storage.set("rpg-character-sheet", JSON.stringify(data));
      showToast("Ficha salva com sucesso!");
    } catch (e) {
      showToast("Erro ao salvar.");
    }
  }

  async function handleLoad() {
    try {
      const result = await window.storage.get("rpg-character-sheet");
      if (result && result.value) {
        const data = JSON.parse(result.value);
        setTheme(data.theme || "dark");
        setArchetype(data.archetype || null);
        setTimeout(() => {
          setHeroName(data.heroName || "");
          setClassName(data.className || "");
          setTimeout(() => {
            setHybridSubclass(data.hybridSubclass || "");
            setTimeout(() => {
              setSelectedSkills(data.selectedSkills || []);
              setTotalXP(data.totalXP || 0);
              setGold(data.gold || 0);
              setHeroicFeatUsed(data.heroicFeatUsed || false);
              setExhaustedSkills(data.exhaustedSkills || {});
              setInventory(data.inventory || []);
              setEquipped(data.equipped || []);
              setExhaustedItems(data.exhaustedItems || {});
            }, 50);
          }, 50);
        }, 50);
        showToast("Ficha carregada!");
      } else {
        showToast("Nenhuma ficha salva encontrada.");
      }
    } catch (e) {
      showToast("Nenhuma ficha salva encontrada.");
    }
  }

  function handleExportPDF() {
    const el = heroCardRef.current;
    if (!el) return;
    const printWin = window.open("", "_blank");
    const bgColor = theme === "light" ? "#ffffff" : "#0f0e0c";
    const textColor = theme === "light" ? "#2a2520" : "#e8e0d4";
    printWin.document.write(`<!DOCTYPE html><html><head><title>Ficha de Personagem</title>
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet" />
      <style>
        body { margin: 20px; padding: 0; background: ${bgColor}; color: ${textColor}; font-family: 'EB Garamond', Georgia, serif; }
        @media print { .no-print { display: none !important; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
      </style></head><body>${el.outerHTML}</body></html>`);
    printWin.document.close();
    setTimeout(() => { printWin.print(); }, 600);
  }

  const btnStyle = {
    background: t.btnBg, border: `1px solid ${t.cardBorder}`, borderRadius: 8,
    padding: "7px 12px", cursor: "pointer", fontSize: 13, color: t.text,
    fontFamily: "'EB Garamond', serif", display: "flex", alignItems: "center", gap: 5,
    transition: "all 0.2s ease",
  };

  return (
    <div ref={sheetRef} style={{
      minHeight: "100vh", background: t.bg,
      color: t.text, fontFamily: "'EB Garamond', Georgia, serif",
      transition: "background 0.3s ease, color 0.3s ease",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet" />

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 999,
          background: theme === "dark" ? "#2a2820" : "#fff", color: t.text,
          border: `1px solid ${t.cardBorder}`, borderRadius: 10, padding: "10px 20px",
          fontSize: 14, fontFamily: "'EB Garamond', serif", boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          animation: "fadeIn 0.3s ease",
        }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{
        background: t.headerBg,
        borderBottom: `1px solid ${t.headerBorder}`,
        padding: "20px 20px 16px",
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{
              fontFamily: "'Cinzel', serif", fontSize: 24, fontWeight: 900, margin: 0,
              letterSpacing: 3, textTransform: "uppercase",
              background: "linear-gradient(135deg, #e8c06a, #c8956a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              Ficha de Personagem
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: 12, opacity: 0.4, letterSpacing: 2 }}>DESCENT 2ª ED</p>
          </div>
          <div className="no-print" style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <button onClick={handleSave} style={btnStyle} title="Salvar ficha">💾 Salvar</button>
            <button onClick={handleLoad} style={btnStyle} title="Carregar ficha">📂 Carregar</button>
            <button onClick={handleExportPDF} style={btnStyle} title="Exportar PDF">📄 PDF</button>
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} style={btnStyle} title="Alternar tema">
              {theme === "dark" ? "☀️ Claro" : "🌙 Escuro"}
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 16px" }}>

        {/* Archetype */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {Object.entries(ARCHETYPES).map(([key, val]) => (
              <div
                key={key}
                onClick={() => { setArchetype(key); }}
                style={{
                  padding: "10px 12px", borderRadius: 8, cursor: "pointer",
                  background: archetype === key ? `linear-gradient(135deg, ${val.color}22, ${val.color}08)` : t.cardBg,
                  border: archetype === key ? `2px solid ${val.color}88` : `2px solid ${t.cardBorder}`,
                  transition: "all 0.25s ease", textAlign: "center",
                }}
              >
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 13, fontWeight: 700, color: archetype === key ? val.color : t.text }}>{key}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: Class & Hero */}
        {archetype && (
          <div style={{
            marginBottom: 24, animation: "fadeIn 0.3s ease",
          }}>
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <select
                  value={className} onChange={e => setClassName(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 12px", fontSize: 14, fontFamily: "'EB Garamond', serif",
                    background: t.inputBg, border: `1px solid ${t.inputBorder}`,
                    borderRadius: 8, color: t.text, outline: "none", appearance: "auto",
                  }}
                >
                  <option value="">Selecione a classe...</option>
                  {archData.classes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <select
                  value={heroName} onChange={e => setHeroName(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 12px", fontSize: 14, fontFamily: "'EB Garamond', serif",
                    background: t.inputBg, border: `1px solid ${t.inputBorder}`,
                    borderRadius: 8, color: t.text, outline: "none", appearance: "auto",
                  }}
                >
                  <option value="">Selecione o herói...</option>
                  {archData.heroes.map(h => <option key={h.name} value={h.name}>{h.name}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Hybrid Subclass Selector */}
        {isHybridClass && className && (() => {
          const hArch = classSkills.hybridArchetype;
          const hColor = hybridColor(hArch);
          const hList = hArch === "Curandeiro" ? HEALER_STANDARD_CLASSES : hArch === "Guerreiro" ? WARRIOR_STANDARD_CLASSES : hArch === "Mago" ? MAGE_STANDARD_CLASSES : SCOUT_STANDARD_CLASSES;
          return (
            <div style={{ marginBottom: 24, animation: "fadeIn 0.3s ease" }}>
              <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, opacity: 0.4, display: "block", marginBottom: 6, color: hColor }}>
                Classe de {hArch} (Híbrido — perícias até 2 XP)
              </label>
              <select
                value={hybridSubclass} onChange={e => setHybridSubclass(e.target.value)}
                style={{
                  width: "100%", maxWidth: 340, padding: "10px 12px", fontSize: 14, fontFamily: "'EB Garamond', serif",
                  background: t.inputBg, border: `1px solid ${t.inputBorder}`,
                  borderRadius: 8, color: t.text, outline: "none", appearance: "auto",
                }}
              >
                <option value="">Selecione a classe de {hArch.toLowerCase()}...</option>
                {hList.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          );
        })()}

        {/* Hero Card */}
        {heroData && (
          <div ref={heroCardRef} style={{
            background: theme === "light" ? "#ffffff" : `linear-gradient(135deg, ${t.cardBg}, ${t.cardBg})`,
            border: `1px solid ${archData.color}44`,
            borderRadius: 14, padding: 20, marginBottom: 24, animation: "fadeIn 0.3s ease",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 22, fontWeight: 700, margin: 0, color: archData.color }}>
                  {heroData.name}{className && <span style={{ fontWeight: 400, fontSize: 16, opacity: 0.7 }}>, {className}{hybridSubclass ? ` / ${hybridSubclass}` : ""}</span>}
                </h2>
                <p style={{ margin: "4px 0 0", fontSize: 13, fontStyle: "italic", opacity: 0.5, maxWidth: 400, lineHeight: 1.4 }}>
                  "{heroData.fluff}"
                </p>
              </div>
              <div style={{
                display: "flex", alignItems: "center", gap: 5,
                background: defColors[heroData.def] + "22", border: `1px solid ${defColors[heroData.def]}44`,
                borderRadius: 8, padding: "4px 10px", fontSize: 13,
              }}>
                <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1, opacity: 0.5 }}>Def</span>
                <span style={{ fontSize: 18 }}>{defDice[heroData.def]}</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
              <StatBadge label="Mov" value={heroData.mov} color={archData.color} theme={theme} />
              <StatBadge label="HP" value={heroData.hp} color={archData.color} theme={theme} />
              <StatBadge label="💧" value={heroData.fatigue} color={archData.color} theme={theme} />
              <StatBadge label="For" value={heroData.str} color={archData.color} theme={theme} />
              <StatBadge label="Vont" value={heroData.will} color={archData.color} theme={theme} />
              <StatBadge label="Con" value={heroData.know} color={archData.color} theme={theme} />
              <StatBadge label="Perc" value={heroData.perc} color={archData.color} theme={theme} />
            </div>

            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, opacity: 0.4, marginBottom: 4 }}>Habilidade Heroica</div>
              <p style={{ fontSize: 13, lineHeight: 1.6, margin: 0, color: t.textMuted }}>{heroData.ability}</p>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, opacity: 0.4, color: "#e8c06a" }}>Feito Heroico</div>
                <label style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer", fontSize: 11, color: heroicFeatUsed ? t.textFaint : "#e8c06a" }}>
                  <input
                    type="checkbox"
                    checked={heroicFeatUsed}
                    onChange={e => setHeroicFeatUsed(e.target.checked)}
                    style={{ accentColor: "#e8c06a", width: 14, height: 14, cursor: "pointer" }}
                  />
                  {heroicFeatUsed ? "Usado" : ""}
                </label>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.6, margin: 0, color: t.textMuted, opacity: heroicFeatUsed ? 0.35 : 1, textDecoration: heroicFeatUsed ? "line-through" : "none", transition: "all 0.2s ease" }}>{heroData.heroicFeat}</p>
            </div>

            {/* Equipment */}
            {className && classSkills && (<>
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, opacity: 0.4 }}>
                Equipamentos ({handsUsed()}/2 mãos · {armorCount()}/1 vestimenta · {otherCount()}/2 outros)
              </label>
              <div className="no-print" style={{ display: "flex", gap: 6 }}>
                {Object.values(exhaustedItems).some(v => v) && (
                  <button onClick={() => setExhaustedItems({})} style={{
                    background: "rgba(126,200,160,0.12)", border: "1px solid rgba(126,200,160,0.25)",
                    borderRadius: 6, padding: "4px 10px", cursor: "pointer",
                    fontSize: 11, color: "#7ec8a0", fontFamily: "'EB Garamond', serif",
                  }}>
                    ↻ Preparar Itens
                  </button>
                )}
                <button onClick={() => setShowShop(!showShop)} style={{
                  background: "rgba(200,168,126,0.12)", border: "1px solid rgba(200,168,126,0.25)",
                  borderRadius: 6, padding: "4px 10px", cursor: "pointer",
                  fontSize: 11, color: "#c8a87e", fontFamily: "'EB Garamond', serif",
                }}>
                  {showShop ? "✕ Fechar Loja" : "🛒 Loja"}
                </button>
              </div>
            </div>

            {/* Equipped & Inventory */}
            {inventory.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: showShop ? 16 : 0 }}>
                {inventory.map((item, i) => {
                  const isEq = equipped.includes(item.id);
                  const canEq = !isEq && canEquip(item);
                  const hasExhaust = /exaur|exaust/i.test(item.rules);
                  const isExhausted = !!exhaustedItems[item.id];
                  return (
                    <div key={item.id + "-" + i} style={{
                      display: "flex", gap: 10, alignItems: "flex-start",
                      background: isEq ? (theme === "light" ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.06)") : "transparent",
                      border: isExhausted ? "1px solid rgba(232,126,126,0.4)" : (isEq ? `1px solid ${theme === "light" ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.12)"}` : `1px solid ${theme === "light" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.04)"}`),
                      borderLeft: isExhausted ? "3px solid #e87e7e" : undefined,
                      borderRadius: 10, padding: "8px 12px",
                    }}>
                      <div style={{ minWidth: 28, textAlign: "center", fontSize: 16, paddingTop: 2 }}>{SLOT_LABELS[item.slot]}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                          <span style={{ fontFamily: "'Cinzel', serif", fontSize: 13, fontWeight: 600 }}>{item.name}</span>
                          {hasExhaust && isEq && (
                            <label onClick={e => e.stopPropagation()} style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", fontSize: 10, color: isExhausted ? "#e87e7e" : (theme === "light" ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.35)") }}>
                              <input
                                type="checkbox"
                                checked={isExhausted}
                                onChange={e => setExhaustedItems(prev => ({ ...prev, [item.id]: e.target.checked }))}
                                style={{ accentColor: "#e87e7e", width: 12, height: 12, cursor: "pointer" }}
                              />
                              {isExhausted ? "Exaurido" : "Exaurir"}
                            </label>
                          )}
                          {item.attack && <span style={{ fontSize: 10, background: "rgba(232,126,126,0.12)", color: "#e87e7e", padding: "1px 6px", borderRadius: 4 }}>{item.attack}</span>}
                          {item.dice && item.dice !== "—" && <span style={{ fontSize: 10, background: "rgba(100,180,255,0.12)", color: "#7cb8f0", padding: "1px 6px", borderRadius: 4 }}>{item.dice}</span>}
                          <span style={{ fontSize: 10, opacity: 0.4 }}>{item.trait}</span>
                        </div>
                        <p style={{ fontSize: 11, lineHeight: 1.4, margin: "3px 0 0", opacity: isExhausted ? 0.35 : 0.55, textDecoration: isExhausted ? "line-through" : "none", transition: "all 0.2s ease" }}>{item.rules}</p>
                      </div>
                      <div className="no-print" style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center", minWidth: 56 }}>
                        <button onClick={() => toggleEquip(item)} style={{
                          background: isEq ? "rgba(126,200,160,0.15)" : (canEq ? t.btnBg : "transparent"),
                          border: `1px solid ${isEq ? "rgba(126,200,160,0.3)" : (canEq ? t.cardBorder : "transparent")}`,
                          borderRadius: 6, padding: "3px 8px", cursor: isEq || canEq ? "pointer" : "not-allowed",
                          fontSize: 10, color: isEq ? "#7ec8a0" : t.text, opacity: !isEq && !canEq ? 0.3 : 1,
                          fontFamily: "'EB Garamond', serif",
                        }}>
                          {isEq ? "Equipado" : "Equipar"}
                        </button>
                        {item.gold > 0 && (
                          <button onClick={() => sellItem(item)} style={{
                            background: "transparent", border: "none", cursor: "pointer",
                            fontSize: 9, color: "#c8a87e", opacity: 0.6, fontFamily: "'EB Garamond', serif",
                          }}>
                            Vender {Math.floor(item.gold / 2)}g
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {inventory.length === 0 && !showShop && (
              <p style={{ fontSize: 12, opacity: 0.35, fontStyle: "italic", margin: 0 }}>Nenhum item no inventário.</p>
            )}

            {/* Shop */}
            {showShop && (
              <div className="no-print" style={{ marginTop: 12 }}>
                <label style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, opacity: 0.35, display: "block", marginBottom: 8 }}>Loja de Itens</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {SHOP_ITEMS.map((item, i) => {
                    const owned = inventory.some(it => it.id === item.id);
                    const afford = gold >= item.gold;
                    return (
                      <div key={item.id} style={{
                        display: "flex", gap: 10, alignItems: "flex-start",
                        background: theme === "light" ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.02)",
                        border: `1px solid ${theme === "light" ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.04)"}`,
                        borderRadius: 8, padding: "7px 10px", opacity: owned ? 0.4 : 1,
                      }}>
                        <div style={{ minWidth: 24, textAlign: "center", fontSize: 14, paddingTop: 1 }}>{SLOT_LABELS[item.slot]}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
                            <span style={{ fontFamily: "'Cinzel', serif", fontSize: 12, fontWeight: 600 }}>{item.name}</span>
                            {item.attack && <span style={{ fontSize: 9, background: "rgba(232,126,126,0.12)", color: "#e87e7e", padding: "1px 5px", borderRadius: 4 }}>{item.attack}</span>}
                            {item.dice !== "—" && <span style={{ fontSize: 9, background: "rgba(100,180,255,0.12)", color: "#7cb8f0", padding: "1px 5px", borderRadius: 4 }}>{item.dice}</span>}
                            <span style={{ fontSize: 9, opacity: 0.4 }}>{item.trait} · Cap.{item.ch}</span>
                          </div>
                          <p style={{ fontSize: 10, lineHeight: 1.4, margin: "2px 0 0", opacity: 0.5 }}>{item.rules}</p>
                        </div>
                        <button onClick={() => !owned && afford && buyItem(item)} disabled={owned || !afford} style={{
                          background: afford && !owned ? "rgba(200,168,126,0.15)" : "transparent",
                          border: `1px solid ${afford && !owned ? "rgba(200,168,126,0.3)" : "transparent"}`,
                          borderRadius: 6, padding: "3px 8px", cursor: afford && !owned ? "pointer" : "not-allowed",
                          fontSize: 10, color: "#c8a87e", fontFamily: "'EB Garamond', serif",
                          opacity: owned ? 0.3 : (afford ? 1 : 0.4), minWidth: 48, whiteSpace: "nowrap",
                        }}>
                          {owned ? "✓" : `${item.gold}g`}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Skills */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, opacity: 0.4 }}>
                Perícias de {className}
              </label>
              {Object.values(exhaustedSkills).some(v => v) && (
                <button
                  onClick={() => setExhaustedSkills({})}
                  style={{
                    background: "rgba(126,200,160,0.12)", border: "1px solid rgba(126,200,160,0.25)",
                    borderRadius: 6, padding: "4px 10px", cursor: "pointer",
                    fontSize: 11, color: "#7ec8a0", fontFamily: "'EB Garamond', serif",
                  }}
                >
                  ↻ Preparar Todas
                </button>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {classSkills.skills.map((skill, i) => {
                const isSelected = selectedSkills.includes(skill.name);
                const isInit = skill.xp === 0 && !skill.elemental;
                const canAfford = xpUsed + skill.xp <= totalXP;
                const disabled = !isInit && !skill.elemental && !isSelected && !canAfford;
                return (
                  <SkillCard
                    key={i}
                    skill={skill}
                    selected={isSelected}
                    onToggle={() => {
                      if (isInit) return;
                      if (skill.elemental) {
                        if (isSelected) {
                          setSelectedSkills(prev => prev.filter(n => n !== skill.name));
                        } else {
                          setSelectedSkills(prev => [...prev, skill.name]);
                        }
                      } else {
                        toggleSkill(skill);
                      }
                    }}
                    disabled={isInit ? false : disabled}
                    theme={theme}
                    exhausted={exhaustedSkills[skill.name]}
                    onExhaustToggle={(name, val) => setExhaustedSkills(prev => ({ ...prev, [name]: val }))}
                  />
                );
              })}
            </div>
          </div>

          {/* Hybrid Subclass Skills */}
          {isHybridClass && hybridSubclass && hybridSubclassSkills.length > 0 && (
          <div style={{ marginBottom: 40, animation: "fadeIn 0.3s ease" }}>
            <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, opacity: 0.4, display: "block", marginBottom: 10, color: hybridColor(classSkills.hybridArchetype) }}>
              Perícias de {hybridSubclass} ({classSkills.hybridArchetype} — até 2 XP)
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {hybridSubclassSkills.map((skill, i) => {
                const isSelected = selectedSkills.includes(skill.name);
                const isInit = skill.xp === 0;
                const canAfford = xpUsed + skill.xp <= totalXP;
                const disabled = !isInit && !isSelected && !canAfford;
                return (
                  <SkillCard
                    key={"h-" + i}
                    skill={skill}
                    selected={isSelected}
                    onToggle={() => { if (!isInit) toggleSkill(skill); }}
                    disabled={isInit ? false : disabled}
                    theme={theme}
                    exhausted={exhaustedSkills[skill.name]}
                    onExhaustToggle={(name, val) => setExhaustedSkills(prev => ({ ...prev, [name]: val }))}
                  />
                );
              })}
            </div>
          </div>
        )}

        </>)}
          </div>
        )}

        {/* XP / Gold Tracker */}
        {className && classSkills && (
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20,
            animation: "fadeIn 0.3s ease",
          }}>
            <div style={{
              background: "rgba(232,192,106,0.06)", border: "1px solid rgba(232,192,106,0.15)",
              borderRadius: 10, padding: 14, textAlign: "center",
            }}>
              <label style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, opacity: 0.5, display: "block", marginBottom: 6 }}>XP Total Disponível</label>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <button onClick={() => setTotalXP(Math.max(0, totalXP - 1))} style={{ background: t.btnBg, border: "none", color: t.text, width: 28, height: 28, borderRadius: 6, cursor: "pointer", fontSize: 16 }}>−</button>
                <span style={{ fontFamily: "'Cinzel', serif", fontSize: 24, fontWeight: 700, color: "#e8c06a", minWidth: 30, textAlign: "center" }}>{totalXP}</span>
                <button onClick={() => setTotalXP(totalXP + 1)} style={{ background: t.btnBg, border: "none", color: t.text, width: 28, height: 28, borderRadius: 6, cursor: "pointer", fontSize: 16 }}>+</button>
              </div>
              <div style={{ fontSize: 11, opacity: 0.5, marginTop: 4 }}>Usado: {xpUsed} / {totalXP}</div>
            </div>
            <div style={{
              background: "rgba(200,168,126,0.06)", border: "1px solid rgba(200,168,126,0.15)",
              borderRadius: 10, padding: 14, textAlign: "center",
            }}>
              <label style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, opacity: 0.5, display: "block", marginBottom: 6 }}>Ouro</label>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <button onClick={() => setGold(Math.max(0, gold - 25))} style={{ background: t.btnBg, border: "none", color: t.text, width: 28, height: 28, borderRadius: 6, cursor: "pointer", fontSize: 16 }}>−</button>
                <span style={{ fontFamily: "'Cinzel', serif", fontSize: 24, fontWeight: 700, color: "#c8a87e", minWidth: 40, textAlign: "center" }}>{gold}</span>
                <button onClick={() => setGold(gold + 25)} style={{ background: t.btnBg, border: "none", color: t.text, width: 28, height: 28, borderRadius: 6, cursor: "pointer", fontSize: 16 }}>+</button>
              </div>
              <div style={{ fontSize: 11, opacity: 0.5, marginTop: 4 }}>moedas de ouro</div>
            </div>
          </div>
        )}

        {/* Summary */}
        {heroData && className && (
          <div style={{
            background: t.summaryBg,
            border: `1px solid ${t.summaryBorder}`,
            borderRadius: 14, padding: 20, marginBottom: 40,
          }}>
            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 18, fontWeight: 700, margin: "0 0 12px", color: "#e8c06a" }}>
              Resumo do Personagem
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 16px", fontSize: 14, lineHeight: 1.8 }}>
              <span style={{ opacity: 0.5 }}>Arquétipo:</span><span style={{ color: archData.color }}>{archetype}</span>
              <span style={{ opacity: 0.5 }}>Classe:</span><span>{className}</span>
              {hybridSubclass && classSkills && <><span style={{ opacity: 0.5 }}>Subclasse {classSkills.hybridArchetype}:</span><span style={{ color: hybridColor(classSkills.hybridArchetype) }}>{hybridSubclass}</span></>}
              <span style={{ opacity: 0.5 }}>Herói:</span><span>{heroData.name}</span>
              <span style={{ opacity: 0.5 }}>XP Gasto:</span><span>{xpUsed} / {totalXP}</span>
              <span style={{ opacity: 0.5 }}>Ouro:</span><span>{gold}</span>
              <span style={{ opacity: 0.5 }}>Equipados:</span><span>{getEquippedItems().map(it => it.name).join(", ") || "—"}</span>
              <span style={{ opacity: 0.5 }}>Perícias:</span><span>{selectedSkills.join(", ")}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
