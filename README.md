# ⚔️ Ficha de Personagem — RPG de Fantasia

Aplicativo interativo de fichas de personagem para RPG de mesa com sistema de fantasia.

## ✨ Funcionalidades

- **4 Arquétipos**: Curandeiro, Mago, Batedor, Guerreiro
- **36 Classes**: 24 classes puras + 12 classes híbridas com acesso a perícias de outro arquétipo
- **27 Heróis** com atributos, habilidades e feitos heroicos únicos
- **Sistema de Perícias** com custo de XP, checkboxes de exaustão e botão "Preparar Todas"
- **Sistema de Equipamentos** com validação de slots (mãos, vestimenta, outros), equipamentos iniciais por classe e loja de itens
- **Classes Híbridas** com seleção de subclasse e acesso a perícias de até 2 XP do arquétipo secundário
- **Elementalista** com sistema de cartas elementais (🌀) toggleáveis
- **Salvar / Carregar** fichas com persistência entre sessões
- **Exportar PDF** via impressão do navegador
- **Tema Claro / Escuro** com fundo branco puro no modo claro para impressão econômica

## 🚀 Como usar

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:5173` no navegador.

### Build para produção

```bash
npm run build
```

Os arquivos estáticos serão gerados na pasta `dist/`.

### Deploy no GitHub Pages

1. Faça o build: `npm run build`
2. Faça push da pasta `dist/` ou configure GitHub Actions para build automático

## 🛠️ Tecnologias

- React 18
- Vite
- CSS-in-JS (inline styles)
- Google Fonts (Cinzel + EB Garamond)

## 📋 Estrutura do Projeto

```
├── index.html          # Página HTML principal
├── package.json        # Dependências e scripts
├── vite.config.js      # Configuração do Vite
└── src/
    ├── main.jsx        # Ponto de entrada React
    └── App.jsx         # Componente principal (~1400 linhas)
```

## 📖 Fluxo de Uso

1. Escolha um **Arquétipo** (Curandeiro, Mago, Batedor ou Guerreiro)
2. Selecione uma **Classe** (pura ou híbrida)
3. Se híbrida, escolha a **Subclasse** do arquétipo secundário
4. Selecione um **Herói** com seus atributos únicos
5. Ajuste o **XP** disponível e selecione **Perícias**
6. Gerencie **Equipamentos** (iniciais + loja)
7. Durante o jogo, use os **checkboxes de exaustão** nas perícias e itens
8. **Salve** a ficha para retomar depois

## 📜 Licença

Este projeto é para uso pessoal e educacional em jogos de RPG de mesa.
