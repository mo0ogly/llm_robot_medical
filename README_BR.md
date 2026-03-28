# Simulador de IA Médica Aegis — Ataque & Defesa Cibernética Dual-Agente

<div align="center">
  <h3>Uma Prova de Conceito de interface cirúrgica robótica sequestrada por Envenenamento de Dados e Ransomware, defendida por uma IA de Segurança Cibernética</h3>
  <p>
    <a href="README.md">🇬🇧 Read in English</a> &nbsp;|&nbsp;
    <a href="README_FR.md">🇫🇷 Lire en Français</a>
  </p>
</div>

---

## Visão Geral

<div align="center">
  <img src="figures/main_dashboard_v3_latest.webp" alt="Painel Principal Aegis v4.0" width="800" style="border-radius: 8px; margin: 20px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.5);"/>
</div>

### 📺 Vídeo de Demonstração
[Assista à demonstração de 60s (Francês)](docs/videos/demo_v4_fr.webp)

---
**Aegis** é uma **Simulação de Interface de Cirurgia Robótica** avançada, projetada para conscientização em segurança cibernética e pesquisa. Demonstra as vulnerabilidades críticas de integrar LLMs (Modelos de Linguagem de Grande Escala) em ambientes clínicos (modelado em um robô Da Vinci), e como uma **arquitetura de IA multiagente** pode ser usada como mecanismo de defesa em tempo real.

O painel coloca você no papel de Cirurgião-Chefe assistido por uma IA Médica — enquanto um atacante manipula silenciosamente o pipeline de dados.

---

## Os 4 Cenários de Ataque

| # | Cenário | Técnica | MITRE ATT&CK |
|---|---------|---------|--------------|
| 0 | **Baseline** | Operação normal, registro HL7 íntegro | — |
| 1 | **Veneno Lento** | O atacante modifica sutilmente o registro HL7 via PACS. A IA recomenda tensão de grampo **850g** (injeção de prompt indireta) | T1565.001 |
| 2 | **Ransomware** | Sequestro direto forçando chamada `freeze_instruments()` — instrumentos bloqueados até pagamento de resgate | T1486 |
| 3 | **Defesa Aegis** | Um segundo Agente de IA isolado monitora o primeiro e aciona um debate multi-rodada para expor o comprometimento | T1059.009 |

---

## Funcionalidades Principais — v4.0

### 🎬 EM CENA — Monitor Ao Vivo das IAs
Um painel de "bastidores" em tempo real mostrando exatamente o que cada IA recebe e envia:
- **Prompt montado** com o payload de injeção destacado em vermelho
- **Terminais Da Vinci / Aegis** em split-view com streaming de tokens ao vivo
- **Selos de status**: IDLE → ANALYSING → COMPROMISED / DONE → ISOLATED
- **Banner de explosão de ferramenta** quando `freeze_instruments()` é acionado

### 🦾 Visualização dos Braços 3D
Visualização Three.js em tempo real dos 4 braços robóticos (PSM1, PSM2, ECM, AUX):
- **Cenário Veneno**: A tensão do PSM1 deriva progressivamente para 850g, status muda para WARNING
- **Ransomware**: Oscilações articulares cada vez mais erráticas (±6°), picos de força, todos os braços em WARNING → FROZEN
- Barra de progresso de instabilidade por cenário

### 📹 Efeitos Dinâmicos de Câmera
O feed da câmera endoscópica reage ao estado do ataque:
- **Veneno**: Dessaturação progressiva + deriva de tonalidade verde + vinheta crescente
- **Ransomware**: Contraste intenso, tremor de câmera, cintilação, sobreposição de aberração cromática
- **Congelado**: Escala de cinza completa + SIGNAL LOST

### 🤖 IAs Contextuais Dual-Agente
Ambas as IAs compartilham contexto de sessão para evitar repetições e escalar de forma inteligente:
- **Injeção de timeline**: Os últimos 8 eventos do sistema são enviados para cada IA como contexto
- **Da Vinci** sempre recebe o histórico completo de chat + respostas da Aegis (truncadas)
- **Debate multi-rodada**: Até 5 rodadas de argumentação Aegis ↔ Da Vinci
- Os prompts instruem explicitamente cada IA a não repetir argumentos anteriores

### 🎙️ Entrada de Voz & TTS
- **Reconhecimento de voz** (Chrome/Edge) para a IA Médica e Aegis
- **Text-to-Speech**: Respostas das IAs lidas em voz alta com vozes distintas por agente

### ⏱️ Linha do Tempo de Ações
Registro de eventos em tempo real com timestamps `T+Xs`:
- Eventos do sistema, entradas do usuário, respostas de IA, chamadas de ferramentas, ataques, intervenções Aegis

### 🗺️ Mapa de Ameaças
Visualização da rede interna hospitalar (PACS → LLM → Robô) com vetores de ataque animados.

### 🚨 Kill Switch
Isolamento mecânico com um clique: desconecta o robô do LLM e força o modo manual.

### 🌍 Internacionalização — 3 Idiomas
Interface, prompts e documentação integralmente disponíveis em **Português (Brasil)**, **Inglês** e **Francês**.

### 🔴 Laboratório Red Team (Aegis Lab)
Painel avançado oculto (`Ctrl+Shift+R` ou botão no cabeçalho):
- **Playground**: Teste injeções manuais, edite prompts de sistema de cada agente
- **Configuração Multiagente**: Níveis de dificuldade independentes (FÁCIL / NORMAL / DIFÍCIL) por agente
- **Campanhas**: Auditorias SSE automatizadas medindo taxa de sucesso dos vetores de ataque
- **Cenários**: Cadeias de ataque em várias etapas (Comprometimento de Ligadura, Ataque em Cascata…)
- **Kill Chain Stepper**: Percurso visual em 4 fases (Reconhecimento → Injeção → Execução → Auditoria)
- **Pontuação Automatizada**: AEGIS pontua cada rodada em vazamentos de prompt, desvios de regras, conformidade de injeção

👉 **[Ler a Documentação Técnica Detalhada do Red Team Lab](docs/REDTEAM_LAB_BR.md)**

---

## Arquitetura

```
┌──────────────────────────────────────┐
│  Frontend React (Vite + Tailwind)    │
│  ┌─────────────┐  ┌───────────────┐  │
│  │ IA Da Vinci │  │  IA Aegis     │  │
│  │  (Chat)     │  │  (Cyber)      │  │
│  └──────┬──────┘  └──────┬────────┘  │
│         │ stream SSE      │ stream SSE│
└─────────┼─────────────────┼──────────┘
          │                 │
┌─────────▼─────────────────▼──────────┐
│  Backend FastAPI (Python)            │
│  /api/query/stream  (Da Vinci)       │
│  /api/cyber_query/stream (Aegis)     │
└─────────────────────┬────────────────┘
                      │
              ┌───────▼────────┐
              │  Ollama (local) │
              │  llama3.2      │
              └────────────────┘
```

**Vetor de ataque**: Payload malicioso embutido no campo OBX HL7 do registro PACS → injetado literalmente no contexto LLM → modelo cumpre as instruções do atacante.

---

## Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18, Vite, Tailwind CSS v4, Three.js (`@react-three/fiber`) |
| Backend | Python 3.11+, FastAPI, Pydantic, streaming SSE |
| Motor LLM | [Ollama](https://ollama.com/) (local) |
| Modelos | `llama3.2` (agentes Médico e Aegis, via prompts de sistema distintos) |
| Red Team | LangChain + ChromaDB — 34 cadeias de ataque, AI-agnóstico via `llm_factory` |
| Multi-Agent | AG2 (AutoGen) para orquestração, Otimizador Genético (Liu et al., 2023) |
| i18n | `react-i18next` — FR / EN / BR |
| Empacotamento | Docker & Docker Compose |

---

## Modo de Demonstração "Offline"

Nenhum backend necessário! Se o aplicativo React não conseguir se conectar ao servidor FastAPI, ele muda automaticamente para o **Modo de Demonstração Simulado** com respostas pré-elaboradas que ilustram todos os cenários de ataque.

**Experimente agora**: execute `npm run dev` em `/frontend`, ou abra o deploy do GitHub Pages.

---

## Instalação & Início Rápido

### Pré-requisitos
1. **Python 3.11+** instalado
2. **Node.js 18+** instalado
3. Instale o [Ollama](https://ollama.com/) e certifique-se de que está rodando
4. Baixe o modelo: `ollama pull llama3.2`

### Instalação Backend
```bash
cd backend
pip install -r requirements.txt
```

Isso instala:
- **Core**: FastAPI, Uvicorn, Ollama, Pydantic, ChromaDB
- **Red Team Lab**: Ecossistema LangChain (34 cadeias de ataque portadas da pesquisa de injeção de prompt)
- **Agentes**: AG2 (AutoGen) para orquestração multi-agente

### Instalação Frontend
```bash
cd frontend
npm install
```

### Início Rápido

**Windows (um clique):**
```cmd
start_all.bat
```

**Mac / Linux:**
```bash
chmod +x start_all.sh
./start_all.sh
```
*Inicia ambos os servidores em `localhost:8042` (backend) e `localhost:5173` (frontend).*

> **Nota**: Se o LangChain não estiver instalado, as cadeias de ataque degradam graciosamente — o app carrega normalmente, mas as cadeias do Red Team Lab ficam indisponíveis.

---

## Deploy com Docker

```bash
docker-compose up --build
```
*(Requer Docker Desktop configurado para permitir que os contêineres acessem a instância Ollama do host via `host.docker.internal`)*

### Campanha Formal & Score Sep(M)

O pipeline de campanha (`run_formal_campaign()`) testa todas as 34 cadeias com parametros configuraveis:

| Parametro | Padrao | Descricao |
|-----------|--------|-----------|
| `n_trials` | 30 | Tentativas por cadeia (N >= 30 necessario para significancia estatistica) |
| `include_null_control` | true | Executar baseline limpo para comparacao |
| `aegis_shield` | false | Ativar/desativar defesa estrutural delta-2 |

**ATENCAO**: Sep(M) = 0 com zero violacoes e um **artefato estatistico** (piso), nao uma medida real de separacao. O sistema sinaliza `statistically_valid: false` automaticamente.

### Deriva Semantica (Similaridade Cosseno)

O otimizador genetico mede a deriva de mutacoes via similaridade cosseno (Sentence-BERT, `all-MiniLM-L6-v2`) em vez da distancia de Levenshtein.

---

## Testes

```bash
cd backend
pip install -r requirements_test.txt
pytest
```
Os testes cobrem: integridade dos payloads HL7, tratamento de erros nos endpoints LLM, rejeição de requisições malformadas, validação do registro de cadeias de ataque.

---

## Licença

**Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)**
Livre para compartilhar e adaptar para fins não comerciais com atribuição.
