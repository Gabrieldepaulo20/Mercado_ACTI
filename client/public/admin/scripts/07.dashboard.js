const waste = document.querySelector('#waste');
const profit_01 = document.querySelector('#exits');
const profit_02 = document.querySelector('#profit');
const tabela = document.querySelector('#table');
const filtro = document.querySelector('#filtro');
const capturando_data_atual = new Date();

let entrada_produtos, pedidos_produtos, saidas_produtos, nomes_produtos;

let chamadas = [];

chamadas.push(
  fetch('/entradas/produtos')

  .then(response => {
    if (!response.ok) {
      throw new Error('Erro ao buscar os dados');
    }
    return response.json();
  })
  .then(data => {
    
    entrada_produtos = data.entradas;

  })
  .catch(error => {
    console.error('Erro:', error);  
  }),


  fetch('/chamada/pedidosRealizados')

  .then(response => {
    if (!response.ok) {
      throw new Error('Erro ao buscar os dados');
    }
    return response.json();
  })
  .then(data => {
    
    pedidos_produtos = data.pedidos;

  })
  .catch(error => {
    console.error('Erro:', error);  
  }),

  fetch('/saida/produto')

  .then(response => {
    if (!response.ok) {
      throw new Error('Erro ao buscar os dados');
    }
    return response.json();
  })
  .then(data => {
    
    saidas_produtos = data.produtos;

  })
  .catch(error => {
    console.error('Erro:', error);  
  }),

  fetch('/chamada/produto')

  .then(response => {
    if (!response.ok) {
      throw new Error('Erro ao buscar os dados');
    }
    return response.json();
  })
  .then(data => {
    
    nomes_produtos = data.produtos;

  })
  .catch(error => {
    console.error('Erro:', error);  
  })

)

Promise.all(chamadas).then(() => {

    CriandoOpcoesMeses(filtro);
    let mes_selecionado = filtro.value;

    criandoTabelaFiltrando();

    filtro.addEventListener('click', (e)=>{
        criandoTabelaFiltrando();
    })

})

function construindo_obj(nome, valor_gasto, receita_gerada, lucro){
    
    let tr = document.createElement('tr');
    let td_01 = document.createElement('td');
    let td_02 = document.createElement('td');
    let td_03 = document.createElement('td');
    let td_04 = document.createElement('td');

    td_01.innerHTML = nome;
    td_02.innerHTML = `R$ ${valor_gasto.toFixed(2)}`;
    td_03.innerHTML = `R$ ${receita_gerada.toFixed(2)}`;
    td_04.innerHTML = `R$ ${lucro.toFixed(2)}`;

    tr.appendChild(td_01);
    tr.appendChild(td_02);
    tr.appendChild(td_03);
    tr.appendChild(td_04);

    return tr;
}

function capturando_data(valor){

    let data = new Date(valor);
    let mes_entrada_saida = data.getMonth();
    let ano_entrada_saida = data.getFullYear();
    // Somando mais um no mês para bater corretamente com o filtro do usuário.
    return `${mes_entrada_saida + 1}/${ano_entrada_saida}`;
}

// Irá adicionar a opção de meses no botão do SELECT.
function CriandoOpcoesMeses(select){
  
  // Irá armazenar todas as data já adicionadas, assim evitando repetição.
  let datas = [];
  let flag_data_repetida = false; // Caso tiver tag repetida, esse valor será true.
 
  entrada_produtos.forEach(item => {
    let data = capturando_data(item.data_entrada);

    // Iterando sobre o array datas em busca do valor repetido.
    for(let i=0; i<datas.length; i++){
      if(datas[i] == data){
        flag_data_repetida = true;
      }
    }

    // Caso a flaag for falsa ele irá adicionar o valor no select.
    if(!flag_data_repetida){
      let data_insert = criandoOption(data);
      datas.push(data);
      select.appendChild(data_insert);
    }
  })
}

// Criando elemento para adicionar no SELECT no html.
function criandoOption(valor){
  let option = document.createElement('option');
  option.setAttribute("value", valor);
  option.innerHTML = valor;

  return option;
}

function criandoTabelaFiltrando(){
  tabela.innerHTML = "";
            let somando_lucro = 0;
            let somando_saida = 0;
        
            let lucro = 0;

            let mes_selecionado = filtro.value;

            // OK;
            entrada_produtos.forEach(item => {
              // Realizando a captura do Mês para ser usado no filtro.
              let data_mes = capturando_data(item.data_entrada);
              if(data_mes == mes_selecionado){
                let valor_01 = Number(item.preco_total);
                somando_saida = somando_saida + valor_01;
            }        
            
        });

        // OK;
        pedidos_produtos.forEach(item => {
          let data_mes = capturando_data(item.data_pedido);

          // Pegando o status do pedido para validar a soma dos pedidos.
          let status = item.status;          

          if(data_mes == mes_selecionado && status == 1){
            let valor_02 = Number(item.valor_compra);
            somando_lucro = somando_lucro + valor_02;
          }
            
        });

        lucro = somando_lucro - somando_saida;

        waste.innerHTML = `R$ ${somando_saida.toFixed(2)}`;
        profit_01.innerHTML = `R$ ${somando_lucro.toFixed(2)}`;
        profit_02.innerHTML = `R$ ${lucro.toFixed(2)}`;

        nomes_produtos.forEach(item => {

          let nome_produto = item.nome_Prd;
          let lucro_Prd = 0;
          let receita_ger_Prd = 0;
          let valor_gasto_Prd = 0;

          // OK
          if(saidas_produtos){
            saidas_produtos.forEach(item => {

              let data_mes = capturando_data(item.data_saida);

              let status = item.status_compra; 

              if(item.nome_produto == nome_produto && status == 1){
                if(data_mes == mes_selecionado){
                  let valor = Number(item.valor_compra);
                  receita_ger_Prd = receita_ger_Prd + valor;
                }
              }
            });
          }
          
          entrada_produtos.forEach(item => {

            if(item.nome_produto == nome_produto){

              let data_mes = capturando_data(item.data_entrada);
              
              if(data_mes == mes_selecionado){
                let valor = Number(item.preco_total);
                valor_gasto_Prd = valor_gasto_Prd + valor;
              }
            }
            
          });
          
          lucro_Prd = receita_ger_Prd - valor_gasto_Prd;

          let obj = construindo_obj(nome_produto, valor_gasto_Prd, receita_ger_Prd, lucro_Prd);
          tabela.appendChild(obj);

        });
}