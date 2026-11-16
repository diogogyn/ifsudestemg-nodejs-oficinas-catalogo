// Armazenamento em memória
const oficinas = [];
let proximoId = 1;

exports.listar = async () => {
  return oficinas.slice();
};

exports.listarAbertas = async () => {
  return oficinas.filter(o => o.inscricoesAbertas);
};

exports.buscarPorId = async (id) => {
  return oficinas.find(o => o.id === Number(id)) || null;
};

exports.criar = async ({ titulo, responsavel, descricao, cargaHoraria }) => {
  const nova = {
    id: proximoId++,
    titulo,
    responsavel,
    descricao,
    cargaHoraria: Number(cargaHoraria),
    inscricoesAbertas: true
  };
  oficinas.push(nova);
  return nova;
};

exports.atualizar = async (id, dados) => {
  const oficina = oficinas.find(o => o.id === Number(id));
  if (!oficina) return null;
  oficina.titulo        = dados.titulo;
  oficina.responsavel   = dados.responsavel;
  oficina.descricao     = dados.descricao;
  oficina.cargaHoraria  = Number(dados.cargaHoraria);
  return oficina;
};

exports.alternarSituacao = async (id) => {
  const oficina = oficinas.find(o => o.id === Number(id));
  if (!oficina) return null;
  oficina.inscricoesAbertas = !oficina.inscricoesAbertas;
  return oficina;
};

exports.excluir = async (id) => {
  const idx = oficinas.findIndex(o => o.id === Number(id));
  if (idx === -1) return false;
  oficinas.splice(idx, 1);
  return true;
};

exports.pesquisarPorTitulo = async (termo) => {
  const t = (termo || '').toLowerCase();
  return oficinas.filter(o => o.titulo.toLowerCase().includes(t));
};

exports.resumo = async () => {
  const total = oficinas.length;
  const abertas = oficinas.filter(o => o.inscricoesAbertas).length;
  const encerradas = total - abertas;
  const somaCargaAbertas = oficinas
    .filter(o => o.inscricoesAbertas)
    .reduce((acc, o) => acc + o.cargaHoraria, 0);
  return { total, abertas, encerradas, somaCargaAbertas };
};