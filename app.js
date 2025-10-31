const API_BASE = 'https://proweb.leoproti.com.br/alunos';

// Elementos
const form = document.getElementById('alunoForm');
const nomeInput = document.getElementById('nome');
const turmaInput = document.getElementById('turma');
const cursoInput = document.getElementById('curso');
const matriculaInput = document.getElementById('matricula');
const alunoIdInput = document.getElementById('alunoId');
const tbody = document.querySelector('#alunosTable tbody');
const limparBtn = document.getElementById('limparBtn');

document.addEventListener('DOMContentLoaded', () => {
  fetchAlunos();
});

limparBtn.addEventListener('click', limparFormulario);

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const aluno = {
    nome: nomeInput.value.trim(),
    turma: turmaInput.value.trim(),
    curso: cursoInput.value.trim(),
    matricula: matriculaInput.value.trim()
  };

  if (!aluno.nome || !aluno.turma || !aluno.curso || !aluno.matricula) {
    alert('Preencha todos os campos.');
    return;
  }

   const id = alunoIdInput.value;
  try {
    if (id) {
    
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(aluno)
      });
      if (!res.ok) throw new Error('Erro ao atualizar');
      alert(' Aluno atualizado com sucesso!');
    } else {
      //  Corrigido endpoint de criação
      const res = await fetch(`${API_BASE}`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(aluno)
      });
      if (!res.ok) throw new Error('Erro ao criar');
      alert(' Aluno criado com sucesso!');
    }
    limparFormulario();
    fetchAlunos();
  } catch (err) {
    console.error(err);
    alert('Erro: ' + err.message);
  }
});

async function fetchAlunos() {
  try {
    const res = await fetch(API_BASE); 
    if (!res.ok) throw new Error('Falha ao buscar alunos');
    const alunos = await res.json();
    renderTable(alunos);
  } catch (err) {
    console.error(err);
    tbody.innerHTML = `<tr><td colspan="5">Erro ao carregar alunos.</td></tr>`;
  }
}

function renderTable(alunos) {
  tbody.innerHTML = '';
  if (!alunos || alunos.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5">Nenhum aluno cadastrado.</td></tr>`;
    return;
  }
  alunos.forEach(a => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${a.nome}</td>
      <td>${a.turma}</td>
      <td>${a.curso}</td>
      <td>${a.matricula}</td>
      <td>
        <button class="btn btn-sm btn-info btn-edit" data-id="${a.id}">Editar</button>
        <button class="btn btn-sm btn-danger btn-delete" data-id="${a.id}">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

   document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      if (!confirm('Deseja realmente excluir?')) return;
      try {
        if (!res.ok) throw new Error('Erro ao excluir');
        fetchAlunos();
      } catch (err) {
        console.error(err);
        alert('Erro ao excluir aluno.');
      }
    });
  });
}


async function carregarAluno(id) {
  try {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) throw new Error('Erro ao buscar aluno');
    const a = await res.json();
    alunoIdInput.value = a.id;
    nomeInput.value = a.nome;
    turmaInput.value = a.turma;
    cursoInput.value = a.curso;
    matriculaInput.value = a.matricula;
  } catch (err) {
    console.error(err);
    alert('Erro ao carregar aluno.');
  }
}

function limparFormulario() {
  alunoIdInput.value = '';
  nomeInput.value = '';
  turmaInput.value = '';
  cursoInput.value = '';
  matriculaInput.value = '';
}
