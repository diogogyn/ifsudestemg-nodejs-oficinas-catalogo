const model = require('../models/oficinaModel');

// ---------- Listagem ----------
exports.listar = async (req, res) => {
  const oficinas = await model.listar();
  const resumo = await model.resumo();
  res.render('index', {
    title: 'Início',
    paginaAtiva: 'inicio',
    oficinas,
    resumo,
    filtroAbertas: false,
    temOficinasCadastradas: oficinas.length > 0
  });
};

exports.listarAbertas = async (req, res) => {
  const todas = await model.listar();
  const abertas = await model.listarAbertas();
  const resumo = await model.resumo();
  res.render('index', {
    title: 'Inscrições Abertas',
    paginaAtiva: 'inicio',
    oficinas: abertas,
    resumo,
    filtroAbertas: true,
    temOficinasCadastradas: todas.length > 0
  });
};

// ---------- Cadastro ----------
exports.formNova = (req, res) => {
  res.render('oficinas/nova', { title: 'Nova Oficina', paginaAtiva: 'nova' });
};

exports.criar = async (req, res) => {
  const { titulo, responsavel, descricao, cargaHoraria } = req.body;
  await model.criar({ titulo, responsavel, descricao, cargaHoraria });
  res.redirect('/');
};

// ---------- Consulta ----------
exports.consultar = async (req, res) => {
  const oficina = await model.buscarPorId(req.params.id);
  if (!oficina) return res.redirect('/');
  res.render('oficinas/consulta', { title: 'Consultar Oficina', oficina });
};

// ---------- Edição ----------
exports.formEdicao = async (req, res) => {
  const oficina = await model.buscarPorId(req.params.id);
  if (!oficina) return res.redirect('/');
  res.render('oficinas/edicao', { title: 'Editar Oficina', oficina });
};

exports.editar = async (req, res) => {
  const { titulo, responsavel, descricao, cargaHoraria } = req.body;
  await model.atualizar(req.params.id, { titulo, responsavel, descricao, cargaHoraria });
  res.redirect('/');
};

// ---------- Alternar / Excluir ----------
exports.alternar = async (req, res) => {
  await model.alternarSituacao(req.params.id);
  res.redirect('/');
};

exports.excluir = async (req, res) => {
  await model.excluir(req.params.id);
  res.redirect('/');
};

// ---------- Pesquisa ----------
exports.pesquisar = async (req, res) => {
  const termo = req.body.termo;
  if (termo === undefined) {
    return res.render('pesquisa/index', {
      title: 'Pesquisa',
      paginaAtiva: 'pesquisa'
    });
  }
  const resultados = await model.pesquisarPorTitulo(termo);
  res.render('pesquisa/index', {
    title: 'Pesquisa',
    paginaAtiva: 'pesquisa',
    termo,
    resultados,
    pesquisou: true
  });
};