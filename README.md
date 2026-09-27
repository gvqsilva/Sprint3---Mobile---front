# 🚙 AutoIntel AI — Ford Market Intelligence

<p align="center">

  <img src="https://github.com/user-attachments/assets/85a9d3ad-ca27-4ba7-aa78-39d9cef54cfc" width="300" alt="AutoIntel AI Logo"/>

</p>

<p align="center">

<strong>Inteligência de Mercado Automotivo potencializada por Inteligência Artificial.</strong>

</p>

<p align="center">

  <img src="https://img.shields.io/badge/React%20Native-2026-blue?logo=react" alt="React Native"/>
  <img src="https://img.shields.io/badge/Expo-Expo%20Go-black?logo=expo" alt="Expo"/>
  <img src="https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/IA-Groq-orange" alt="Groq"/>
  <img src="https://img.shields.io/badge/Model-GPT--OSS--20B-purple" alt="GPT OSS 20B"/>
  <img src="https://img.shields.io/badge/Storage-AsyncStorage-blue" alt="AsyncStorage"/>
  <img src="https://img.shields.io/badge/Platform-Android-green" alt="Android"/>
  <img src="https://img.shields.io/badge/Status-Sprint%203-success" alt="Sprint 3"/>

</p>

<p align="center">

<a href="#-sobre-o-projeto">Sobre</a> • <a href="#-funcionalidades">Funcionalidades</a> • <a href="#-arquitetura">Arquitetura</a> • <a href="#-design-system">Design System</a> • <a href="#-demonstração">Demonstração</a> • <a href="#-execução">Execução</a> • <a href="#-apk">APK</a>

</p>

---

## 📌 Sobre o Projeto

O **AutoIntel AI** é uma plataforma mobile de **Inteligência de Mercado Automotivo** desenvolvida para apoiar profissionais de **P&D, Produto, Engenharia, Marketing e Vendas** na análise estratégica da concorrência.

A solução foi desenvolvida para o desafio:

> **Inovação em Inteligência de Mercado e Engenharia de Produto (P&D)**

A indústria automotiva exige a análise constante de informações sobre concorrentes, incluindo:

* preços;
* motorização;
* potência;
* torque;
* desempenho;
* tecnologia;
* segurança;
* equipamentos;
* capacidade off-road;
* versões;
* posicionamento de mercado.

O processo tradicional de coleta e comparação dessas informações pode consumir tempo e exigir diversas fontes diferentes.

O **AutoIntel AI** utiliza **Inteligência Artificial Generativa** para transformar consultas sobre o mercado automotivo em análises estruturadas, comparações e insights estratégicos.

### 🎯 Objetivo

> **Transformar dados da concorrência em inteligência acionável para decisões de produto.**

O aplicativo conecta pesquisa, processamento por IA e visualização estratégica em um único fluxo:

```text
Pesquisa
   ↓
Matriz de Dados
   ↓
Inteligência Artificial
   ↓
Duelo Estratégico
   ↓
Radar de Mercado
   ↓
Insights
   ↓
Diretrizes de P&D
```

---

# 🏆 Sprint 3 — Versão Final

O **Sprint 3** representa a versão final do AutoIntel AI, consolidando as funcionalidades desenvolvidas anteriormente e aplicando um **Design System unificado** à experiência.

Nesta etapa, o foco passou de apenas desenvolver funcionalidades para entregar uma aplicação com características de produto finalizado.

### Objetivos da versão final

* ✅ Consolidar as funcionalidades do desafio;
* ✅ Corrigir problemas identificados nas Sprints anteriores;
* ✅ Padronizar componentes e telas;
* ✅ Aplicar Design System;
* ✅ Implementar estados de loading, erro, vazio e sucesso;
* ✅ Garantir consistência visual;
* ✅ Organizar o código;
* ✅ Implementar uma arquitetura segura para consumo da IA;
* ✅ Remover dependência de banco externo para o histórico local;
* ✅ Disponibilizar build Android;
* ✅ Validar execução em dispositivo físico/emulador.

---

# 🚀 Funcionalidades

## 🔎 Varredura de Mercado

Permite pesquisar e estruturar informações de veículos concorrentes.

A análise considera informações como:

* preço estimado;
* motorização;
* potência;
* torque;
* transmissão;
* tração;
* capacidade de carga/porta-malas;
* suspensão e amortecedores;
* ângulo de ataque;
* modos de condução;
* características técnicas;
* diferenciais competitivos.

As informações são organizadas em uma **Matriz de Dados** para facilitar a análise do veículo.

O processamento da pesquisa é realizado através do backend FastAPI, que encaminha a solicitação para o serviço de IA.

---

## ⚔️ Duelo Estratégico

O **Duelo Estratégico** permite analisar o veículo pesquisado em relação à **Ford Ranger Raptor V6**.

A análise considera diferentes dimensões:

| Critério           | Análise                                         |
| ------------------ | ----------------------------------------------- |
| 💪 Força           | Desempenho e capacidade mecânica                |
| 🧠 Tecnologia      | Recursos tecnológicos e conectividade           |
| 🏔️ Off-Road       | Capacidades fora de estrada                     |
| 💰 Custo-Benefício | Relação entre preço, equipamentos e capacidades |

O resultado é processado pela IA e apresentado ao usuário em formato executivo.

---

## 📊 Radar Estratégico

O Radar apresenta uma visão consolidada das informações coletadas.

### Mapa de Ameaças

Organiza os concorrentes de acordo com seus principais atributos competitivos.

### White-Space

Permite identificar possíveis lacunas relacionadas a:

* produto;
* equipamentos;
* tecnologia;
* posicionamento;
* funcionalidades.

### Diretrizes de P&D

Os dados analisados podem ser utilizados para gerar insights relacionados ao desenvolvimento e evolução de produtos.

---

## 🤖 Copiloto Tático

O **Copiloto IA** funciona como um assistente de inteligência comercial e automotiva.

Pode auxiliar em:

* diferenciais de produto;
* objeções;
* argumentos comerciais;
* comparações;
* análise de veículos;
* informações técnicas;
* posicionamento competitivo.

A interface utiliza o conceito de **Battle Cards**, permitindo acessar rapidamente consultas pré-configuradas.

Também é possível inserir perguntas e objeções diretamente pelo campo de conversa.

### Battle Cards

Exemplos disponíveis:

* Objeção Hilux;
* Preço Alto;
* Duelo V6.

As solicitações são enviadas para o backend e processadas pela IA.

---

## 🔐 Cofre de Inteligência

O **Cofre de Inteligência** funciona como o histórico local das análises realizadas no dispositivo.

Podem ser armazenados:

* pesquisas;
* análises de veículos;
* duelos;
* informações de histórico;
* registros utilizados pela aplicação.

O armazenamento utiliza:

```text
AsyncStorage
```

Não existe dependência de Supabase para o armazenamento do histórico do aplicativo.

---

## 📄 Exportação de Dossiê

A aplicação possui suporte à preparação de resultados para compartilhamento.

Tecnologias utilizadas:

* `react-native-view-shot`;
* `expo-sharing`.

---

# 🎨 Design System

Uma das principais entregas do **Sprint 3** foi a consolidação do **Design System do AutoIntel AI**.

O objetivo é garantir consistência visual e comportamental entre as diferentes telas da aplicação.

## 🎨 Identidade Visual

A interface utiliza uma identidade inspirada no universo automotivo e tecnológico, combinando:

* alto contraste;
* azul institucional;
* vermelho de destaque;
* superfícies claras;
* cards informativos;
* indicadores visuais;
* componentes consistentes;
* elementos inspirados em performance automotiva.

A identidade visual busca transmitir:

> **Tecnologia + Performance + Inteligência + Mercado Automotivo**

---

## 🖌️ Tokens Visuais

Os principais elementos visuais são organizados de forma padronizada:

```text
Background
Surface
Surface Secondary
Primary
Secondary
Success
Warning
Error
Text Primary
Text Secondary
Border
```

---

## 🔤 Tipografia

A interface segue uma hierarquia visual consistente:

```text
Display
Heading
Subtitle
Body
Caption
Label
```

---

## 📐 Espaçamento

A aplicação utiliza uma escala padronizada:

```text
XS  → 4px
SM  → 8px
MD  → 16px
LG  → 24px
XL  → 32px
XXL → 48px
```

---

## 🧩 Componentes

Entre os principais componentes utilizados estão:

* Buttons;
* Cards;
* Inputs;
* Search Bars;
* Chips;
* Badges;
* Headers;
* Navigation;
* Data Cards;
* Metric Cards;
* Progress Indicators;
* Loading States;
* Empty States;
* Error States;
* Success Feedback.

---

# 🔄 Estados de Interface

O Sprint 3 contempla estados específicos para diferentes situações da aplicação.

## ⏳ Loading

Utilizado enquanto:

* dados são carregados;
* análises de IA estão sendo processadas;
* informações são geradas.

---

## ❌ Error

Apresentado quando uma operação não pode ser concluída.

Os erros são tratados para fornecer feedback ao usuário e facilitar a identificação de problemas de conexão ou processamento.

---

## 📭 Empty State

Utilizado quando não existem dados disponíveis.

Exemplos:

* nenhuma pesquisa salva;
* histórico vazio;
* nenhum registro disponível.

---

## ✅ Success

Utilizado para indicar operações concluídas com sucesso.

Exemplos:

* pesquisa concluída;
* análise processada;
* resposta do Copiloto recebida;
* compartilhamento iniciado.

---

# 📱 Telas

```text
Home
 │
 ├── Pesquisa
 │     └── Matriz de Dados
 │
 ├── Duelo
 │
 ├── Radar
 │
 ├── Copiloto
 │
 └── Cofre
       └── Histórico
```

---

# 🏗️ Arquitetura

O AutoIntel AI utiliza uma arquitetura baseada em **React Native + Expo + FastAPI**, separando a aplicação mobile da camada responsável pelo processamento de Inteligência Artificial.

```text
                         AutoIntel AI
                              │
             ┌────────────────┴────────────────┐
             │                                 │
             ▼                                 ▼
      React Native / Expo                 FastAPI
             │                                 │
             │                         API REST / HTTPS
             │                                 │
             │                                 ▼
             │                           Groq Cloud
             │                                 │
             │                                 ▼
             │                          GPT-OSS-20B
             │
             ▼
       AsyncStorage
             │
             ▼
     Histórico local
```

## Fluxo de Inteligência Artificial

```text
React Native
     │
     │ POST
     ▼
FastAPI
     │
     │ requisição autenticada
     ▼
Groq Cloud
     │
     ▼
GPT-OSS-20B
     │
     ▼
FastAPI
     │
     │ JSON
     ▼
React Native
```

Essa arquitetura mantém as credenciais da Groq fora do aplicativo mobile.

---

# 🔐 Segurança da API

A chave da Groq **não é armazenada no código do aplicativo**.

O aplicativo mobile realiza chamadas somente para o backend.

```text
❌ React Native → Groq diretamente

✅ React Native → FastAPI → Groq
```

A chave da Groq permanece configurada como variável de ambiente no backend:

```env
GROQ_API_KEY=sua_chave
```

O aplicativo utiliza somente a URL pública da API:

```text
https://seu-backend.com
```

Essa separação reduz a exposição das credenciais utilizadas para acesso ao serviço de IA.

---

# 🧠 Inteligência Artificial

A camada de Inteligência Artificial utiliza a **Groq Cloud API** através do backend FastAPI.

## Modelo utilizado

```text
openai/gpt-oss-20b
```

O modelo é utilizado nos principais fluxos de IA da aplicação:

* pesquisa de veículos;
* geração de especificações;
* duelo estratégico;
* Copiloto Tático.

### Pesquisa

```text
POST /api/v1/pesquisa
```

### Duelo

```text
POST /api/v1/duelo
```

### Copiloto

```text
POST /api/v1/copiloto
```

O backend processa as respostas e retorna dados estruturados para o aplicativo.

---

# 🌐 Backend

O backend do AutoIntel AI foi desenvolvido utilizando **FastAPI**.

## Endpoints

| Método | Endpoint           | Função                             |
| ------ | ------------------ | ---------------------------------- |
| `GET`  | `/`                | Health Check                       |
| `POST` | `/api/v1/pesquisa` | Pesquisa e estruturação de veículo |
| `POST` | `/api/v1/duelo`    | Análise do duelo estratégico       |
| `POST` | `/api/v1/copiloto` | Consulta ao Copiloto IA            |

### Health Check

```http
GET /
```

Resposta:

```json
{
  "status": "AutoIntel API Operacional",
  "database": "Local no dispositivo",
  "storage": "AsyncStorage"
}
```

---

# 💾 Persistência de Dados

O AutoIntel AI utiliza armazenamento local para dados da experiência do usuário.

```text
React Native
      │
      ▼
AsyncStorage
      │
      ├── nome_usuario
      ├── foto_usuario
      └── historico_pesquisas
```

A solução não depende de Supabase para armazenar o histórico do aplicativo.

Isso permite que pesquisas e informações de perfil permaneçam disponíveis localmente no dispositivo.

---

# 🛠️ Tecnologias

| Tecnologia                 | Utilização                 |
| -------------------------- | -------------------------- |
| **React Native**           | Desenvolvimento mobile     |
| **Expo**                   | Desenvolvimento e build    |
| **JavaScript**             | Linguagem principal        |
| **React Navigation**       | Navegação                  |
| **FastAPI**                | Backend e API REST         |
| **Python**                 | Desenvolvimento do backend |
| **Groq Cloud API**         | Inteligência Artificial    |
| **GPT-OSS-20B**            | Modelo de IA               |
| **AsyncStorage**           | Persistência local         |
| **Expo Sharing**           | Compartilhamento           |
| **React Native View Shot** | Captura de dossiês         |
| **Expo EAS**               | Build Android              |
| **Git / GitHub**           | Versionamento              |

---

# 📂 Estrutura do Projeto

A estrutura pode ser organizada da seguinte forma:

```text
AutoIntel AI/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── .env
│
├── src/
│   │
│   ├── components/
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Input/
│   │   ├── Header/
│   │   └── Badge/
│   │
│   ├── screens/
│   │   ├── HomeScreen.js
│   │   ├── PesquisaScreen.js
│   │   ├── CopilotoScreen.js
│   │   ├── RadarScreen.js
│   │   ├── PerfilScreen.js
│   │   └── ...
│   │
│   ├── navigation/
│   │
│   ├── services/
│   │   ├── api/
│   │   ├── storage/
│   │   └── export/
│   │
│   ├── theme/
│   │   ├── colors.js
│   │   ├── typography.js
│   │   ├── spacing.js
│   │   └── index.js
│   │
│   └── utils/
│
├── assets/
│
├── app.json
├── package.json
└── README.md
```

---

# 🎥 Demonstração

## Fluxo Principal

A demonstração apresenta o fluxo:

```text
Home
  ↓
Pesquisa
  ↓
Matriz de Dados
  ↓
Duelo
  ↓
Radar
  ↓
Copiloto
```

▶️ **Vídeo demonstrativo:**

https://youtube.com/shorts/OdrO1SgaBWc

---

# 🖥️ Demonstração Visual

## 🏠 Home

<img src="https://github.com/user-attachments/assets/c83d5e8e-f7c5-4631-b311-929af97fd0b7" width="350" alt="AutoIntel AI - Home"/>

---

## 🔎 Pesquisa / Matriz de Dados

<img src="https://github.com/user-attachments/assets/97a9a4ac-8caf-484e-b9b9-c48fe20b07ee" width="350" alt="AutoIntel AI - Pesquisa"/>

---

## 📊 Radar Estratégico

<img src="https://github.com/user-attachments/assets/272d2482-9572-4963-8b97-c3a1c8735405" width="350" alt="AutoIntel AI - Radar"/>

---

## 🤖 Copiloto

<img src="https://github.com/user-attachments/assets/4915c829-35bd-4121-a26e-db9e384f942e" width="350" alt="AutoIntel AI - Copiloto"/>

---

## 🔐 Cofre de Inteligência

<img src="https://github.com/user-attachments/assets/7ceb9d6c-62c5-4017-8bc8-b37ae19a046e" width="350" alt="AutoIntel AI - Cofre"/>

> 📌 As imagens acima representam as principais interfaces do aplicativo.

---

# ⚙️ Como Executar

## Pré-requisitos

### Aplicativo

* Node.js LTS;
* npm ou Yarn;
* Expo;
* Expo Go ou emulador Android;
* Git.

### Backend

* Python 3.x;
* pip;
* FastAPI;
* Uvicorn;
* chave da Groq.

---

# 📱 Executando o Aplicativo

## 1. Clonar o projeto

```bash
git clone https://github.com/seu-usuario/autointel-ford.git

cd autointel-ford
```

## 2. Instalar dependências

```bash
npm install
```

ou:

```bash
yarn install
```

## 3. Executar em desenvolvimento

```bash
npx expo start -c
```

ou:

```bash
yarn expo start --clear
```

## 4. Executar no dispositivo

1. Abra o **Expo Go**;
2. Escaneie o QR Code;
3. Certifique-se de que o ambiente esteja configurado corretamente;
4. Verifique se o aplicativo consegue acessar a URL pública do backend.

---

# 🐍 Executando o Backend Localmente

Entre na pasta do backend:

```bash
cd backend
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

Configure o arquivo `.env`:

```env
GROQ_API_KEY=sua_chave_groq
```

Execute:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

A API estará disponível em:

```text
http://localhost:8000
```

A documentação Swagger estará disponível em:

```text
http://localhost:8000/docs
```

---

# 🌐 Configuração do Frontend

Para desenvolvimento local utilizando Android Emulator:

```js
const API_BASE_URL = 'http://10.0.2.2:8000';
```

Para dispositivo físico ou backend hospedado:

```js
const API_BASE_URL = 'https://seu-backend.com';
```

Na versão final, o aplicativo deve utilizar a URL pública do backend.

---

# 📦 APK — Versão Final

O Sprint 3 contempla a disponibilização da aplicação em formato **APK Android**.

O build pode ser realizado utilizando **Expo EAS Build**.

## Build

Exemplo:

```bash
eas build -p android
```

Após a conclusão do processo, o APK poderá ser disponibilizado através do link fornecido pelo EAS ou por outro meio de distribuição definido para o projeto.

### 📥 Download

> **Substitua pelo link público do APK final.**

🔗 **APK:** https://expo.dev/accounts/vasquez021/projects/SprintMobile/builds/f3737b2e-088b-4b88-ad86-b7a573b7bec8

---

# 🧪 Validação da Versão Final

## Navegação

* [x] Home funcionando
* [x] Navegação entre telas
* [x] Bottom Tabs funcionando
* [x] Stack Navigation funcionando
* [x] Navegação sem erros críticos

## Funcionalidades

* [x] Pesquisa
* [x] Matriz de Dados
* [x] Duelo
* [x] Radar
* [x] Copiloto
* [x] Cofre
* [x] Histórico local
* [x] Integração com backend
* [x] Integração com IA

## Backend

* [x] FastAPI funcionando
* [x] Health Check
* [x] Endpoint de Pesquisa
* [x] Endpoint de Duelo
* [x] Endpoint de Copiloto
* [x] Backend hospedado
* [x] Credencial da Groq protegida no backend

## Design System

* [x] Cores padronizadas
* [x] Tipografia padronizada
* [x] Espaçamentos consistentes
* [x] Componentes padronizados
* [x] Botões padronizados
* [x] Cards padronizados
* [x] Loading
* [x] Error
* [x] Empty State
* [x] Success Feedback

## APK

* [ ] Build final gerado
* [ ] APK instalado
* [ ] Aplicação abre corretamente
* [ ] Fluxos principais testados
* [ ] Sem crashes
* [ ] Sem erros críticos

---

# 🎯 Visão de Produto

A evolução do AutoIntel AI segue o conceito:

```text
                         DADOS
                           │
                           ▼
                  COLETA DE MERCADO
                           │
                           ▼
                    DATA PROCESSING
                           │
                           ▼
                     INTELIGÊNCIA IA
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
           DUELO         RADAR      COPILOTO
              │            │            │
              └────────────┼────────────┘
                           ▼
                        INSIGHTS
                           │
                           ▼
                    DIRETRIZES P&D
                           │
                           ▼
                    DECISÃO DE PRODUTO
```

O objetivo é transformar informações fragmentadas do mercado automotivo em uma camada de inteligência que possa apoiar análises de produto e estratégia.

---

# 👥 Equipe

| Integrante           |     RM |
| -------------------- | -----: |
| **Augusto Mendonça** | 558371 |
| **Gabriel Vasquez**  | 557056 |
| **Gustavo Oliveira** | 559163 |

---

# 🎓 Contexto Acadêmico

Projeto desenvolvido no contexto do **FIAP Challenge**, explorando a aplicação prática de:

* Inteligência Artificial Generativa;
* Desenvolvimento Mobile;
* Engenharia de Software;
* Design Systems;
* Inteligência de Mercado;
* Análise de Dados;
* Engenharia de Produto;
* Experiência do Usuário.

---

# 📌 Status do Projeto

```text
Sprint 1        ✅
Sprint 2        ✅
Sprint 3        ✅
Design System   ✅
Backend API     ✅
Integração IA   ✅
Storage Local   ✅
APK             🚧
README          ✅
```

**Status atual:**

> 🚀 **Versão Final — Sprint 3**

---

# 📄 Licença

Projeto desenvolvido para fins acadêmicos e de demonstração.

---

<p align="center">

### 🚙 AutoIntel AI

<strong>Transformando dados automotivos em inteligência para produto.</strong>

<br><br>

Made with 🤖 + 🚗 + 💻

</p>
