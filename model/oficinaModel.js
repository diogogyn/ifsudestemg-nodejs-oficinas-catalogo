let oficinas = [];
let nextId = 1;

async function listAll() {
  return [...oficinas];
}

async function listOpen() {
  return oficinas.filter((oficina) => oficina.inscricoesAbertas);
}

async function getById(id) {
  return oficinas.find((oficina) => oficina.id === Number(id)) || null;
}

async function create(data) {
  const oficina = {
    id: nextId++,
    titulo: data.titulo,
    responsavel: data.responsavel,
    descricao: data.descricao,
    cargaHoraria: Number(data.cargaHoraria),
    inscricoesAbertas: true
  };

  oficinas.push(oficina);
  return oficina;
}

async function update(id, data) {
  const oficina = await getById(id);
  if (!oficina) {
    return null;
  }

  oficina.titulo = data.titulo;
  oficina.responsavel = data.responsavel;
  oficina.descricao = data.descricao;
  oficina.cargaHoraria = Number(data.cargaHoraria);

  return oficina;
}

async function remove(id) {
  const index = oficinas.findIndex((oficina) => oficina.id === Number(id));
  if (index === -1) {
    return false;
  }

  oficinas.splice(index, 1);
  return true;
}

async function toggleInscricoes(id) {
  const oficina = await getById(id);
  if (!oficina) {
    return null;
  }

  oficina.inscricoesAbertas = !oficina.inscricoesAbertas;
  return oficina;
}

async function searchByTitle(term) {
  const normalized = term.trim().toLowerCase();
  return oficinas.filter((oficina) => oficina.titulo.toLowerCase().includes(normalized));
}

async function getSummary() {
  const total = oficinas.length;
  const abertas = oficinas.filter((oficina) => oficina.inscricoesAbertas);
  const encerradas = total - abertas.length;
  const cargaHorariaAbertas = abertas.reduce(
    (sum, oficina) => sum + oficina.cargaHoraria,
    0
  );

  return {
    total,
    abertas: abertas.length,
    encerradas,
    cargaHorariaAbertas
  };
}

module.exports = {
  listAll,
  listOpen,
  getById,
  create,
  update,
  remove,
  toggleInscricoes,
  searchByTitle,
  getSummary
};
