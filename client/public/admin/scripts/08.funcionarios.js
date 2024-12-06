// Realizando a seleção de valores na página
const buttonCadastro = document.querySelector('#button-cadastrar');
const buttonPesquisar = document.querySelector('#buttonPesquisa');
const buttonEditar = document.querySelector('#buttonEditar');
const buttonApagar = document.querySelector('#apagarFuncionario');


// Botões de eventos -->
buttonCadastro.addEventListener('click', () => {
  e.preventDefault();
  window.location.href = '/funcionarios/cadastro'
})


// realizando requisição --> 
fetch('/chamada/funcionarios')
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro ao buscar os dados');
    }
    return response.json();
  })
  .then(data => {
    let funcionarios = data.usuarios; // tratando os dados;

    let i = 0;
    const ul = document.querySelector('#tabelaProdutos')

    funcionarios.forEach((item) => {

      let tr = document.createElement('tr');
      
      let  td_nome_fun = document.createElement('td');
      td_nome_fun.setAttribute('id', 'id_nome_fun');
      let  td_email = document.createElement('td');
      td_email.setAttribute('id', 'id_email');
      let  td_telefone = document.createElement('td');
      td_telefone.setAttribute('id', 'td_telefone');
      let  td_tipo_user = document.createElement('td');
      td_telefone.setAttribute('id', 'td_tipo_user');
      
      //Coluna para editar o contato 
      let  td_edit = document.createElement('td');
      td_edit.setAttribute('id', 'buttonEditar');

      let link_edit = document.createElement('a');
      link_edit.setAttribute('href','/funcionarios/editar')
      link_edit.setAttribute('class','editar');

      let icons_edit = document.createElement('span')
      icons_edit.setAttribute('class','material-icons-outlined')

      link_edit.appendChild(icons_edit);
      td_edit.appendChild(link_edit);
      icons_edit.innerHTML = 'edit';

      let td_status = document.createElement('td');
      td_status.setAttribute('id','status');
      if(item.status == 1 ) td_status.setAttribute('class','aprovado');
      if(item.status == 0 ) td_status.setAttribute('class', 'pendente');

      td_nome_fun.innerHTML = item.nome
      td_email.innerHTML = item.email
      td_telefone.innerHTML =  item.telefone

      if(item.tipo_funcionario == 1){
        td_tipo_user.innerHTML = 'Administrador'
      }else{
        td_tipo_user.innerHTML = 'Funcionário'
      }

      tr.appendChild(td_nome_fun)
      tr.appendChild(td_email)
      tr.appendChild(td_telefone)
      tr.appendChild(td_tipo_user)
      tr.appendChild(td_status)
      tr.appendChild(td_edit)

      if (i % 2 == 0) {
        tr.setAttribute('class', 'linha-par');
      } else {
        tr.setAttribute('class', 'linha-impar');
      }

      ul.appendChild(tr);
      i++

    })

  })
  .catch(error => {
    console.error('Erro:', error);
  });


function filtrar() {
  var input,
    ul,
    tr,
    td_nome_fun;

  input = document.querySelector('#searchbar');
  ul = document.querySelector('#tabelaProdutos');
  filter = input.value.toUpperCase();
  tr = ul.getElementsByTagName("tr");

  // Esconde todas as linhas da tabela
  for (let i = 1; i < tr.length; i++) {
    tr[i].style.display = 'none'; 
  }

  // Mostra as linhas que correspondem à pesquisa
  for (let i = 1; i < tr.length; i++) {
    td_nome_fun = tr[i].querySelector('#id_nome_fun').innerHTML;

    if (td_nome_fun.toUpperCase().indexOf(filter) > -1) {
      tr[i].style.display = 'table-row'; // Mostra a linha
    }
  }
}

// Verificar o click no lapis de editar
document.addEventListener('click', (e) =>{
  const tag = e.target;
  if(tag.classList.contains('material-icons-outlined')){
    e.preventDefault();
    const a = tag.parentElement;
    const td = a.parentElement;
    const tr = td.parentElement; // Obtem a linha da tabela
    const nome = tr.querySelector('#id_nome_fun').textContent; // Obtem o nome do funcionario
    const email = tr.querySelector('#id_email').textContent; // Obtem o email do funcionario
    const contato = tr.querySelector('#td_tipo_user').textContent; // Obtem o telefone do funcionario
    let status = tr.querySelector('#status'); // Obtem o telefone do funcionario

  if(status.classList.contains('aprovado')){
    status = 'ativo';
    sessionStorage.setItem('editData', JSON.stringify({ nome, email,contato,status }));
  } 
  else {
    status = 'desativo';
    sessionStorage.setItem('editData', JSON.stringify({ nome, email,contato,status }));
  }
  window.location.href = '/funcionarios/editar'
}
})



