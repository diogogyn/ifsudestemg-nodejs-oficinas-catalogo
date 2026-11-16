var express = require('express');
var createError = require('http-errors');
var router = express.Router();
var oficinaModel = require('../model/oficinaModel');

function toValidatedPayload(body) {
  const payload = {
    titulo: (body.titulo || '').trim(),
    responsavel: (body.responsavel || '').trim(),
    descricao: (body.descricao || '').trim(),
    cargaHoraria: Number(body.cargaHoraria)
  };

  const errors = [];
  if (!payload.titulo) {
    errors.push('Informe o título da oficina.');
  }
  if (!payload.responsavel) {
    errors.push('Informe o nome da pessoa responsável.');
  }
  if (!payload.descricao) {
    errors.push('Informe a descrição da atividade.');
  }
  if (!Number.isInteger(payload.cargaHoraria) || payload.cargaHoraria < 1 || payload.cargaHoraria > 40) {
    errors.push('Informe a carga horária com valor inteiro entre 1 e 40 horas.');
  }

  return { payload, errors };
}

router.get('/', async function(req, res) {
  const oficinas = await oficinaModel.listAll();
  const summary = await oficinaModel.getSummary();

  res.render('oficinas/list', {
    title: 'Catálogo de Oficinas',
    oficinas,
    summary,
    viewMode: 'all',
    activeNav: 'inicio',
    hasAnyOficinas: summary.total > 0,
    emptyMessage: 'Nenhuma oficina cadastrada ainda.'
  });
});

router.get('/oficinas/abertas', async function(req, res) {
  const oficinas = await oficinaModel.listOpen();
  const summary = await oficinaModel.getSummary();

  res.render('oficinas/list', {
    title: 'Inscrições Abertas',
    oficinas,
    summary,
    viewMode: 'open',
    activeNav: 'inicio',
    hasAnyOficinas: summary.total > 0,
    emptyMessage: summary.total > 0
      ? 'Nenhuma oficina está com inscrições abertas.'
      : 'Nenhuma oficina cadastrada ainda.'
  });
});

router.get('/sobre', function(req, res) {
  res.render('about', {
    title: 'Sobre',
    activeNav: 'sobre'
  });
});

router.get('/oficinas/nova', function(req, res) {
  res.render('oficinas/form', {
    title: 'Nova oficina',
    activeNav: 'nova',
    formAction: '/oficinas',
    cancelLink: '/',
    oficina: {}
  });
});

router.post('/oficinas', async function(req, res) {
  const { payload, errors } = toValidatedPayload(req.body);

  if (errors.length > 0) {
    return res.status(400).render('oficinas/form', {
      title: 'Nova oficina',
      activeNav: 'nova',
      formAction: '/oficinas',
      cancelLink: '/',
      oficina: payload,
      errors
    });
  }

  await oficinaModel.create(payload);
  res.redirect('/');
});

router.get('/oficinas/:id', async function(req, res, next) {
  const oficina = await oficinaModel.getById(req.params.id);
  if (!oficina) {
    return next(createError(404, 'Oficina não encontrada'));
  }

  res.render('oficinas/detail', {
    title: 'Consulta de oficina',
    oficina
  });
});

router.get('/oficinas/:id/editar', async function(req, res, next) {
  const oficina = await oficinaModel.getById(req.params.id);
  if (!oficina) {
    return next(createError(404, 'Oficina não encontrada'));
  }

  res.render('oficinas/form', {
    title: 'Editar oficina',
    formAction: '/oficinas/' + oficina.id + '/editar',
    cancelLink: '/oficinas/' + oficina.id,
    oficina
  });
});

router.post('/oficinas/:id/editar', async function(req, res, next) {
  const oficina = await oficinaModel.getById(req.params.id);
  if (!oficina) {
    return next(createError(404, 'Oficina não encontrada'));
  }

  const { payload, errors } = toValidatedPayload(req.body);
  if (errors.length > 0) {
    return res.status(400).render('oficinas/form', {
      title: 'Editar oficina',
      formAction: '/oficinas/' + oficina.id + '/editar',
      cancelLink: '/oficinas/' + oficina.id,
      oficina: { ...payload, id: oficina.id },
      errors
    });
  }

  await oficinaModel.update(oficina.id, payload);
  res.redirect('/');
});

router.post('/oficinas/:id/toggle', async function(req, res, next) {
  const oficina = await oficinaModel.toggleInscricoes(req.params.id);
  if (!oficina) {
    return next(createError(404, 'Oficina não encontrada'));
  }

  res.redirect('/');
});

router.post('/oficinas/:id/delete', async function(req, res, next) {
  const removed = await oficinaModel.remove(req.params.id);
  if (!removed) {
    return next(createError(404, 'Oficina não encontrada'));
  }

  res.redirect('/');
});

router.get('/pesquisa', function(req, res) {
  res.render('search', {
    title: 'Pesquisa',
    activeNav: 'pesquisa',
    beforeSearch: true,
    termo: ''
  });
});

router.post('/pesquisa', async function(req, res) {
  const termo = (req.body.termo || '').trim();
  const resultados = termo ? await oficinaModel.searchByTitle(termo) : [];

  res.render('search', {
    title: 'Pesquisa',
    activeNav: 'pesquisa',
    beforeSearch: false,
    termo,
    resultados
  });
});

module.exports = router;
