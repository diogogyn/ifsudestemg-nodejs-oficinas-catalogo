# Catálogo de Oficinas de Treinamento

Aplicação web **fullstack** para gerenciar um catálogo de oficinas de treinamento diversos.
Desenvolvida em **Node.js + Express + Handlebars + Bootstrap 5 (offline)**, com renderização
de páginas no servidor e persistência **em memória** durante a execução.

---

## 📌 Objetivo

Permitir o cadastro, consulta, edição, exclusão, pesquisa e controle de situação
(aberta/encerrada) de oficinas de treinamento, além de exibir indicadores resumidos
do catálogo.

---

## 🛠️ Tecnologias utilizadas

| Camada            | Tecnologia                                       |
|-------------------|--------------------------------------------------|
| Runtime           | Node.js                                          |
| Framework web     | Express                                          |
| Gerador de projeto| Express Generator (`express --view=hbs`)         |
| Template engine   | Handlebars (`express-handlebars`)                |
| Front-end         | HTML + CSS + Bootstrap 5 (instalação offline)    |
| Persistência      | Memória do servidor (array em JavaScript)        |
| Arquitetura       | MVC (Model – View – Controller)                  |

---

## 📂 Estrutura de pastas (MVC)`
```
oficinas-catalogo/
├── app.js # Configuração do Express, engine e rotas
├── bin/
│ └── www # Bootstrap do servidor
├── controllers/
│ └── oficinaController.js # Regras de negócio / ações do CRUD
├── models/
│ └── oficinaModel.js # Armazenamento em memória (métodos assíncronos)
├── routes/
│ ├── index.js # GET / (listagem)
│ ├── sobre.js # GET /sobre (página sobre)
│ ├── oficinas.js # GET/POST /oficinas/... (CRUD)
│ └── pesquisa.js # GET/POST /pesquisa (pesquisa)
├── views/
│ ├── layouts/
│ │ └── main.hbs # Layout compartilhado (menu + Bootstrap)
│ ├── index.hbs # Listagem + resumo do catálogo
│ ├── sobre.hbs # Página "Sobre"
│ ├── error.hbs # Página de erro
│ ├── oficinas/
│ │ ├── nova.hbs # Formulário de cadastro
│ │ ├── consulta.hbs # Detalhes da oficina
│ │ └── edicao.hbs # Formulário de edição
│ └── pesquisa/
│ └── index.hbs # Formulário + resultado da pesquisa
└── public/
├── stylesheets/style.css
└── vendor/bootstrap/ # Bootstrap 5 copiado localmente (offline)
├── css/bootstrap.min.css
└── js/bootstrap.bundle.min.js
```

##  Funcionalidades implementadas
### 1. Página principal
Tabela com todas as oficinas (colunas: Título, Carga horária,
Inscrições, Ações).

Cabeçalho da tabela com table-primary e text-center;
linhas com efeito hover (table-hover).
Ações por linha: Consultar · Editar · Excluir (modal Bootstrap) · Encerrar/Reabrir.
Área de resumo com quatro indicadores calculados a cada requisição:
- Total de oficinas
- Quantidade com inscrições abertas
- Quantidade com inscrições encerradas
- Soma das cargas horárias das oficinas abertas
- Se o catálogo estiver vazio, exibe mensagem + link para cadastrar a primeira oficina.
- Alternância entre Todas as Oficinas e Inscrições Abertas por botões.

### 2. Inscrições Abertas (GET /oficinas/abertas)
Reutiliza o mesmo template e a mesma tabela da listagem principal.
Mostra apenas oficinas com inscricoesAbertas = true.
Se houver oficinas cadastradas e todas estiverem encerradas, mostra
"Nenhuma oficina está com inscrições abertas".
O resumo considera sempre o catálogo completo.

### 3. Página Sobre (/sobre)
Nome do autor e objetivo da aplicação.

### 4. Cadastro de oficina (GET/POST /oficinas/nova)
Acessível pelo menu Nova oficina ou pelo link da listagem vazia.
Campos obrigatórios: título, responsável, descrição e carga horária.
Carga horária restrita a inteiros de 1 a 40 (type="number" +
min="1" max="40" step="1"), convertida para Number antes de armazenar.
Toda oficina nova começa com inscrições abertas.
Botão Cancelar volta à página principal.

### 5. Consulta (GET /oficinas/:id)
Exibe todos os atributos.
Descrição preserva as quebras de linha com < pre >.

### 6. Edição (GET/POST /oficinas/:id/editar)
Acessível a partir da tela de consulta.
Formulário pré-preenchido com os dados atuais.
Preserva id e inscricoesAbertas.
Cancelar volta à tela de consulta.

### 7. Exclusão (POST /oficinas/:id/excluir)
Modal Bootstrap com o título da oficina e botões Cancelar / Confirmar.
A exclusão só ocorre após a confirmação; cancelar mantém a página atual.

### 8. Alternância de situação (POST /oficinas/:id/alternar)
Alterna entre aberta ↔ encerrada.
Atualiza somente o campo inscricoesAbertas e redireciona para /.

### 9. Pesquisa (GET/POST /pesquisa)
Mesma página exibe formulário e resultado.
Mantém o termo digitado visível após a pesquisa.
Busca case-insensitive por título (includes).
Cada resultado é um link para a consulta da oficina. Antes da primeira pesquisa, exibe instrução ao usuário. Se nada for encontrado, exibe mensagem de resultado vazio.

## Rotas
| Método | EndPoint  | Descrição     |
|--------|-----------|---------------|
GET	/	Listagem completa + resumo
GET	/oficinas/abertas	Listagem somente de oficinas abertas
GET	/sobre	Página Sobre
GET	/oficinas/nova	Formulário de cadastro
POST	/oficinas/nova	Cria oficina
GET	/oficinas/:id	Consulta detalhada
GET	/oficinas/:id/editar	Formulário de edição
POST	/oficinas/:id/editar	Salva edição
POST	/oficinas/:id/alternar	Encerra / reabre inscrições
POST	/oficinas/:id/excluir	Exclui oficina (após confirmação no modal)
GET	/pesquisa	Formulário de pesquisa (estado inicial)
POST	/pesquisa	Executa pesquisa e exibe resultados


## Para executar o projeto
```bash
# Clonar/entrar na pasta do projeto
cd nodejs-oficinas-catalogo

# Instalar dependências
npm install

# Iniciar o servidor
npm start
```
Acesse em: http://localhost:3000