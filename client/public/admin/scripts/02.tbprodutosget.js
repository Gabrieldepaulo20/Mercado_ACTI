fetch('/chamada/produto')

  .then(response => {
    if (!response.ok) {
      throw new Error('Erro ao buscar os dados');
    }
    return response.json();
  })
  .then(data => {
    
    let produtos = data.produtos;

    let i = 0;
    const ul = document.querySelector('#tabelaProdutos');

    for(let i=produtos.length-1; i>=0; i--){
        let tr = document.createElement('tr');

        let td_id = document.createElement('td');
        td_id.setAttribute('id', 'id_prod');
        let td_nome = document.createElement('td');
        td_nome.setAttribute('id', 'id_nome');
        let td_quantidade = document.createElement('td');
        td_quantidade.setAttribute('id', 'id_qtd');
        let td_preco = document.createElement('td');
        td_preco.setAttribute('id', 'id_preco');
        let td_tipo_produto = document.createElement('td');
        td_tipo_produto.setAttribute('id', 'td_tipo_produto');

        td_id.innerText = produtos[i].cod_Prd;
        td_nome.innerText = produtos[i].nome_Prd;
        td_quantidade.innerText = produtos[i].qtd_TotProduto;
        td_preco.innerText = `R$ ${produtos[i].vlr_Unit}`;
        td_tipo_produto.innerText = produtos[i].tipo_produto;

        //Coluna para editar o contato 
        let  td_edit = document.createElement('td');
        td_edit.setAttribute('id', 'buttonEditar');

        let link_edit = document.createElement('a');
        link_edit.setAttribute('href','/tabela/produto/editar')
        link_edit.setAttribute('class','editar');

        let icons_edit = document.createElement('span')
        icons_edit.setAttribute('class','material-icons-outlined')

        link_edit.appendChild(icons_edit);
        td_edit.appendChild(link_edit);
        icons_edit.innerHTML = 'edit';

        tr.appendChild(td_id);
        tr.appendChild(td_nome);
        tr.appendChild(td_tipo_produto);
        tr.appendChild(td_quantidade);
        tr.appendChild(td_preco);
        tr.appendChild(td_edit);

        if (i % 2 == 0) {
          tr.setAttribute('class', 'linha-par');
        } else {
          tr.setAttribute('class', 'linha-impar');
        }

        ul.appendChild(tr);
    }

    // produtos.forEach((item) => {
    //     let tr = document.createElement('tr');

    //     let td_id = document.createElement('td');
    //     td_id.setAttribute('id', 'id_prod');
    //     let td_nome = document.createElement('td');
    //     td_nome.setAttribute('id', 'id_nome');
    //     let td_quantidade = document.createElement('td');
    //     td_quantidade.setAttribute('id', 'id_qtd');
    //     let td_preco = document.createElement('td');
    //     td_preco.setAttribute('id', 'id_preco');
    //     let td_tipo_produto = document.createElement('td');
    //     td_tipo_produto.setAttribute('id', 'td_tipo_produto');

    //     td_id.innerText = item.cod_Prd;
    //     td_nome.innerText = item.nome_Prd;
    //     td_quantidade.innerText = item.qtd_TotProduto;
    //     td_preco.innerText = `R$ ${item.vlr_Unit}`;
    //     td_tipo_produto.innerText = item.tipo_produto;

    //     //Coluna para editar o contato 
    //     let  td_edit = document.createElement('td');
    //     td_edit.setAttribute('id', 'buttonEditar');
  
    //     let link_edit = document.createElement('a');
    //     link_edit.setAttribute('href','/tabela/produto/editar')
    //     link_edit.setAttribute('class','editar');
  
    //     let icons_edit = document.createElement('span')
    //     icons_edit.setAttribute('class','material-icons-outlined')
  
    //     link_edit.appendChild(icons_edit);
    //     td_edit.appendChild(link_edit);
    //     icons_edit.innerHTML = 'edit';

    //     tr.appendChild(td_id);
    //     tr.appendChild(td_nome);
    //     tr.appendChild(td_tipo_produto);
    //     tr.appendChild(td_quantidade);
    //     tr.appendChild(td_preco);
    //     tr.appendChild(td_edit);

    //     if (i % 2 == 0) {
    //       tr.setAttribute('class', 'linha-par');
    //     } else {
    //       tr.setAttribute('class', 'linha-impar');
    //     }

    //     ul.appendChild(tr);
    //     i++;
    // })

  })
  .catch(error => {
    console.error('Erro:', error);  
  });


  // Função que realiza a filtragem de valores após a sua digitação

  function filtrar() {
    var input,
      ul,
      tr,
      td_id,
      td_nome,
      td_quantidade,
      td_preco,
      count = 0;
  
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
      td_id = tr[i].querySelector('#id_prod').innerHTML;
      td_nome = tr[i].querySelector('#id_nome').innerHTML;
      td_quantidade = tr[i].querySelector('#id_qtd').innerHTML;
      td_preco = tr[i].querySelector('#id_preco').innerHTML;
  
      if (td_nome.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = 'table-row'; // Mostra a linha
      }
    }
  }

  document.addEventListener('click', (e) =>{
    const tag = e.target;
    if(tag.classList.contains('material-icons-outlined')){
      e.preventDefault();
      const a = tag.parentElement;
      const td = a.parentElement;
      const tr = td.parentElement; // Obtem a linha da tabela
      const codigo = tr.querySelector('#id_prod').textContent; // Obtem o nome do funcionario
      const produto = tr.querySelector('#id_nome').textContent; // Obtem o email do funcionario
      const valor = tr.querySelector('#id_preco').textContent; // Obtem o telefone do funcionario
      sessionStorage.setItem('editData', JSON.stringify({ codigo, produto,valor })); // Salva temporiamente essas informações
      window.location.href = '/tabela/produto/editar'
    }
  })