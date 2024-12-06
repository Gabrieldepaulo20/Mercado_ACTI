// Realizando a seleção de elementos da página
const buttonEntrada = document.querySelector('#entradaProduto');
const select = document.querySelector('#produto');
const input_valor_uni = document.querySelector('#valor-uni');
const input_valor_total = document.querySelector('#valor-total');
const inputCod = document.querySelector('#codigo');
const qtd = document.querySelector('#qtd');

//Trata os campo input que recebem numeros(preço unitario)
input_valor_uni.addEventListener('input', (e) => {
  let value = input_valor_uni.value.replace(/\D/g, ''); // Remove qualquer caractere não numérico
  value = value.replace(/(\d{2})$/, '.$1'); // Adiciona a virgula como separador de decimal
  value = value.replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1.'); //Adiciona ponto de separador de milhar
  input_valor_uni .value = 'R$ ' + value;
});
qtd.addEventListener('input', (e) => {
  let value = qtd.value.replace(/\D/g, ''); // Remove qualquer caractere não numérico
  qtd.value = value;
})

// Realizando o cadastro de entrada de produtos ;
buttonEntrada.addEventListener('click', (e) => {
  e.preventDefault();
  const form = document.querySelector('#formularioEntrada');
  const formatandoDados = new FormData(form);

  const dados = {
    codigo: formatandoDados.get('codigo'),
    quantidade: formatandoDados.get('quantidade'),
    valorUnitario: formatandoDados.get('valorUnitario').replace(/^R\$ /, '').replace(/\./g, '').replace(/(\d{2})$/, '.$1'),// Remove o prefixo e formata o valor como número,
    valorTotal: formatandoDados.get('valorTotal'),
    tipoProduto: formatandoDados.get('tipoProduto')
  }

  if(dados.quantidade == 0 || dados.valorTotal == 0 ||  dados.valorUnitario == 0 || dados.valorTotal == 'R$ 0.00' || dados.valorUnitario == ''){
    alert('Por favor valide os valores antes de realizar a entrada de novos produtos!');
  }else {
    fetch('/entrada/produto', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dados)
    })
    .then (response => {
      if(!response.ok) {
        throw new Error('Erro ao enviar dados')
      }
      return response.json();
    })
    .then(data => {
      popup(data.message);
    })
    .catch(error => {
      console.error('Erro:', error);
    });
  }
  
})


// Responsável por enviar os produtos cadastrado ao front-end, para assim realizar a entrada.

fetch('/chamada/produto') // Busca os produtos
.then(response => {
  if (!response.ok) {
    throw new Error('Erro ao buscar os dados');
  }
  return response.json();
})
.then(data => {
  construindoSelect(data.produtos);
})
.catch(error => {
  console.error('Erro:', error);  
});


function popup(mensagem){
  const popUp = document.querySelector('#popup');
  popUp.style.display = 'flex'; // Torna o popup visivel

  //Seleciona os itens do popup
  const btnClose = document.querySelector('.close-btn');
  const btnBack = document.querySelector('.back-btn');
  const icon = document.querySelector('.icon');
  const message = document.querySelector('.message');
  message.innerHTML = mensagem; // Exibe mensagem de retorno

  
  if(mensagem == 'Entrada realizada com sucesso!'){
    icon.innerHTML = 'task_alt';
    btnBack.style.display = '';
  }else{
    icon.innerHTML = 'cancel';
    btnBack.style.display = 'none';
    inputCod.value = '';
    qtd.value = '';
    input_valor_uni.value = '';
    input_valor_total.value = '';
  }

  btnClose.addEventListener('click', (e) =>{
    popUp.style.display = 'none';
    window.location.href = '/entrada/pedido'
  })
  btnBack.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/entrada'
  })
}

function construindoSelect(data){
  const select = document.querySelector('#produto');
  for(let i=0; i<data.length; i++){
    let option = document.createElement('option');
    option.setAttribute("value", data[i].nome_Prd);
    option.innerHTML = data[i].nome_Prd;

    select.appendChild(option);
  }
}

function buscandoProduto(){

  const form = document.querySelector('#formularioEntrada');
  const formatandoDados = new FormData(form);
  const dados = {
    tipoProduto: formatandoDados.get('tipoProduto')
  }
  
  fetch('/chamada/produto/especifico', {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dados)
  })
  .then (response => {
    if(!response.ok) {
      throw new Error('Erro ao enviar dados')
    }

    return response.json();
  })
  .then(data => {
    inputCod.value = data.produto[0].cod_Prd;
  })
  .catch(error => {
    console.error('Erro:', error);
  });

}

// Responsável por realizar a multiplicação da qtd pelo valor unitário do produto.
function multiplicandoValorTotal(){

  let qtd_total = Number(qtd.value);
  let valor_uni = parseFloat(input_valor_uni.value.replace(/R\$|\s/g, '').replace(',', '.'));

  if(isNaN(valor_uni)){
    valor_uni = 0
  }

  let multiplicando_valores = (qtd_total * valor_uni).toFixed(2);

  return input_valor_total.value = `R$ ${multiplicando_valores}`

}