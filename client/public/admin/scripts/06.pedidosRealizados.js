// Relatorios dos pedidos   

fetch('/chamada/pedidosRealizados')
.then(response => {
  if (!response.ok) throw new Error('Erro ao buscar os dados');
  return response.json();
})
.then(data => {
  construirTabela(data);
  exportarTabela(data);
})
.catch(error => console.error('Erro:', error));


function construirTabela(dados){

  let i = 0;
  const pedidos = dados.pedidos;
  const tabela = document.querySelector('#tabelaProdutos');
  const template = document.querySelector('#produto-template');

  for(let i=pedidos.length-1; i>=0; i--){

    // if(pedidos[i].qtd_TotProduto <= 0) return;
    const td = template.content.cloneNode(true);  // Clona o conteúdo do template

    let transformando_data = new Date(pedidos[i].data_pedido).toLocaleDateString()

    // Popula o conteúdo do clone com os dados dos pedidos
    td.querySelector('#codigo').textContent = pedidos[i].numero_pedido;
    td.querySelector('#funcionario').textContent = pedidos[i].funcionario;
    td.querySelector('#contato').textContent = pedidos[i].contato;
    td.querySelector('#formaPagamento').textContent = pedidos[i].forma_pagamento;
    td.querySelector('#data').textContent = transformando_data;
    td.querySelector('#valorCompra').textContent = pedidos[i].valor_compra;
    const checkbox = td.querySelector('#status_pgto');

    if(pedidos[i].status == 1) checkbox.checked = true; 

    let tr = td.querySelector('tr');
    tabela.appendChild(td); // Adiciona a linha à tabela

    if (i % 2 == 0) tr.setAttribute('class', 'linha-par');
    else tr.setAttribute('class', 'linha-impar');

  }

  verificaClick(tabela); // Chama a função que verifica os clicks na tabela
}

function exportarTabela(dados){
  pedidos = dados.pedidos;
  document.getElementById('exportarExcel').addEventListener('click', function() {
    // Converter tabela para uma planilha (workbook)
    const planilha = XLSX.utils.json_to_sheet(pedidos);

    const arquivoExcel = XLSX.utils.book_new();

    // Adiciona a planilha no arquivo criado com um nome
    XLSX.utils.book_append_sheet(arquivoExcel, planilha, 'pedidos 1');

    // Gerar o arquivo Excel e faz o download
    XLSX.writeFile(arquivoExcel, 'pedidos.xlsx');
  })
} 

function verificaClick(tabela){
  tabela.addEventListener('click', (e) => {
    const tag = e.target;
    let span = tag.parentElement;
    const tr = span.parentElement;

    if(tag.id === 'status_pgto'){

      const pedido = {
        id: tr.querySelector('#codigo').innerHTML,
      }

      fetch('/atualiza/pagamento', {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pedido)
      })
      .then(response => {
        if(!response.ok) throw new Error;
        return response.json();
      })
      .then(response => popup(response.message))
      .catch(error => console.error('Erro:', error))
    }

  })
}

function popup(mensagem){
  const popUp = document.querySelector('#popup');
  popUp.style.display = 'flex'; // Torna o popup visivel

  //Seleciona os itens do popup
  const btnClose = document.querySelector('.close-btn');
  const icon = document.querySelector('.icon');
  const message = document.querySelector('.message');
  message.innerHTML = mensagem; // Exibe mensagem de retorno

  if(mensagem.includes('sucesso')){
    icon.innerHTML = 'task_alt';
  }else{
    icon.innerHTML = 'cancel';
  }
  btnClose.addEventListener('click', (e) =>{
    popUp.style.display = 'none';
  })
}

function filtrar() {
  let input,tabela,tr;
  input = document.querySelector('#searchbar');
  tabela = document.querySelector('#tabelaProdutos');
  filter = input.value.toUpperCase();
  tr = tabela.getElementsByTagName("tr");

  // Esconde todas as linhas da tabela
  for (let i = 1; i < tr.length; i++) {
    tr[i].style.display = 'none'; 
  }

  // Mostra as linhas que correspondem à pesquisa
  for (let i = 1; i < tr.length; i++) {
    td_funcionario = tr[i].querySelector('#funcionario').innerHTML;
    if (td_funcionario.toUpperCase().indexOf(filter) > -1) {
      tr[i].style.display = 'table-row'; // Mostra a linha
    }
  }
}


