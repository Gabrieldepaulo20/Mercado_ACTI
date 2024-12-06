let compras = JSON.parse(sessionStorage.getItem('store')) || [];
const btnCompra = document.querySelector('#btnCompra');
const opc_pagamento = document.querySelector('#metodo')

let promises = [];

// Realizando a captura das informações do usuário.
function getCookie(name) {
    const cookie = document.cookie;
    const separandoCookie = cookie.split('; ');
    for( let buscando of separandoCookie) {
        const [cookieNome, cookieValor] = buscando.split('=');
        if(cookieNome === name) {
            return decodeURIComponent(cookieValor);
        }
    }
    return null
}

// --> Definindo variáveis a serem usadas no front-end - Nome e E-mail que serão enviadas ao banco de dados;
const nameUSer_real_prod = getCookie('name');
const emailUSer_real_prod = getCookie('email');
// <-- FIM

let pedido = Obj_compra_usuario(nameUSer_real_prod,emailUSer_real_prod);

exibirProdutos(compras);

function exibirProdutos(compras){
    const tbody = document.querySelector('#bodyTable')
    const template = document.querySelector('#produto-template');

    for(let produto of compras){
        const td = template.content.cloneNode(true);
    
        td.querySelector('.nome').textContent = produto.nome_produto;
        td.querySelector('.qtd').textContent = `${produto.qtd_comprada}x`;
        td.querySelector('.valor-uni').textContent = `${produto.valor}`;

        tbody.appendChild(td);
    }

    document.querySelector('.total-compra').textContent = `R$ ${(sessionStorage.getItem('total')).replaceAll('"', ' ')}`;
    verificarClick(tbody);
}

function verificarClick(tbody){
    tbody.addEventListener('click', (e) => {
        const tag = e.target;
        let span = tag.parentElement;
        const itemProduto = span.parentElement;

        if(tag.classList.contains('addProdutos')){

            let itemProduto_02 = itemProduto.parentElement;

            let valor_qtd = (itemProduto_02.querySelector('.qtd').textContent).replace('x','');

            const tipoProduto_01 = itemProduto_02.querySelector('.nome').textContent;

            // Objeto que será enviado para o banco de dados.
            const dados = {
                tipoProduto: tipoProduto_01
            }

            // Estou realizando a chamada no banco de dados via API;
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

                let quantidade_produto = data.produto[0].qtd_Prd; // Recebe a quantidade armazenada no banco de dados.
                
                let qtd_prod = parseFloat(valor_qtd) // Recebe a quantidade solicitada pelo usuário.

                // Verificando se qtd solicitada pelo usuário não é superior ao que está armazenado no banco de dados.
                if(qtd_prod >= quantidade_produto){
                    alert(`Não é possível adicionar o produto no carrinho, escolha uma quantidade menor ou igual a: ${quantidade_produto} (Em Estoque)`); // Exibe alert avisando o usario que o item foi adicionado
                }
                else {
                    atualizaValorTotal(itemProduto,'add');
                }
        
              })
              .catch(error => {
                console.error('Erro:', error);
              });
        }

        if(tag.classList.contains('removeProdutos')){
            atualizaValorTotal(itemProduto,'remove');
        }
    })
}

function atualizaValorTotal (span,click){
    const itemProduto = span.parentElement;

    // Variaveis da qtd 
    const tagQuantidade =  itemProduto.querySelector('.qtd');
    let quantidade = Number(tagQuantidade.textContent.slice(-2,1));

    // Variaveis do valor total
    let totalNumber = document.querySelector('.total-compra').textContent;
    totalNumber = parseFloat(totalNumber.replace('R$', ''));

    // // Variabel do valor unitario do produto
    let valorUni = itemProduto.querySelector('.valor-uni').textContent;
    valorUni = parseFloat(valorUni.replace('R$', ''));

    let resultado;
    // Verica se o click foi para adicionar produto ou retirar e atualiza a qtd total
    if(click == 'add') {
        quantidade++;
        resultado = (totalNumber + valorUni).toFixed(2);
    }
    else if(click == 'remove' && quantidade > 0) {
        quantidade--;
        resultado = (totalNumber - valorUni).toFixed(2);
    }
    else if (quantidade <= 0){
        return;
    }

    tagQuantidade.textContent = `${quantidade}x`;
    document.querySelector('.total-compra').textContent = `R$ ${resultado}`;

    // Atualiza os itens e o valor armazenado
    sessionStorage.setItem('total', JSON.stringify(parseFloat(resultado).toFixed(2))); 
    armazenarCompra(itemProduto);
}

// Função para adicionar ou remover um item do sessionStorage/carrinho
function armazenarCompra(span){
    const nome = span.querySelector('.nome').textContent; 
    let quantidade = span.querySelector('.qtd').textContent;
    quantidade = Number(quantidade.slice(-2,1));

    if(quantidade == 0){
        const tbody = span.parentElement;
        const tabela = tbody.parentElement;
        tabela.deleteRow(span.rowIndex); // Retira o produto da tabela renderizada
    }
   
    compras = compras.filter(produto => {
        if(nome == produto.nome_produto){
            produto.qtd_comprada = quantidade;
        }
        return produto.qtd_comprada > 0;
    })

    sessionStorage.setItem('store', JSON.stringify(compras));
}

btnCompra.addEventListener('click', (e) => {
    e.preventDefault(e);

    let compras_realizadas = [];
    let  compras_nao_realizadas = [];
    let totalNumber = (document.querySelector('.total-compra').textContent).replace('R$', '');

    if(compras.length == 0){
        alert('Carrinho está vazio');
        return;
    }

    // Validando se o pedido tem em estoque e realizando a decrementação no banco de dados.
    for(let i=0; i<compras.length; i++){

        let qtd_prod = compras[i].qtd_comprada; // Irá receber a quantidade solicitada.
        let prod_nome = compras[i].nome_produto; // Nome do produto que será verificado.

        // verificando cada produto
        let verificando = true;
  
        const dados = {
            tipoProduto: prod_nome,
            qtd_Prd: qtd_prod
        }

        promises.push(

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
            
         // Criando a variável que irá receber os produtos, pois com ela irei validar se não há produto repetido, assim resolvendo o primeiro Erro.
            let quantidade_produto = data.produto[0].qtd_Prd; // Recebe a quantidade armazenada no banco de dados.
            
            // Certo, aqui após fazer a validação de cada produto e verificar se a quantidade solicitada está disponível no estoque, eu realizo então a chamada da API que decrementa a quantidade solicitada no banco de dados.
            if(qtd_prod <= quantidade_produto){
                compras_realizadas.push(obj_comprado(prod_nome, qtd_prod))

                fetch('/realizando/compra', {
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

                })
                .catch(error => {
                    console.error('Erro:', error);
                });

            }else {
                compras_nao_realizadas.push(obj_comprado(prod_nome, qtd_prod));
            }

        })
        .catch(error => {
            console.error('Erro:', error);
        })

        )
    }

    Promise.all(promises).then(() => {
        pedido.tipo_pagamento = opc_pagamento.value;

        let somando_valores = 0;

        // Aqui caso o array que armazena a lista de produtos onde não foi possível realizar a compra for maior que zero
        // ele irá evitar com que o array de 'pedidos_realizados' receba esse tipo de produto.
        if(compras_nao_realizadas.length > 0){
            for(let i=0; i<compras.length; i++){

                let verificando_prod = compras[i].nome_produto;
                let adicionar = true;

                for(let i=0; i<compras_nao_realizadas.length; i++){
                    if(verificando_prod == compras_nao_realizadas[i].nome_produto){
                        adicionar = false;
                    }
                }

                if(adicionar == true){
                    // Nesse script estou somando apenas os valores da compra.
                    let valor_compra = parseFloat((compras[i].valor).replace('R$', ''));
                    let multiplicador = compras[i].qtd_comprada;

                    valor_compra = valor_compra * multiplicador;
        
                    somando_valores+=valor_compra;

                    pedido.produtos_solicitados.push(compras[i])
                }else {
                    continue;
                }
            }

        }else{
                for(let i=0; i<compras.length; i++){
                    // Nesse script estou somando apenas os valores da compra.
                    pedido.produtos_solicitados.push(compras[i]);
                    
                    let valor_compra = parseFloat((compras[i].valor).replace('R$', ''));
                    let multiplicador = compras[i].qtd_comprada;
        
                    valor_compra = valor_compra * multiplicador;
        
                    somando_valores+=valor_compra;
                }
        }

        pedido.valor_compra = somando_valores;
        
        let dados = {
            request: pedido
        }

        let promises_arm_pedido = []

        promises_arm_pedido.push(

            fetch('/realizandoCompra', {
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
            })
            .catch(error => {
                console.error('Erro:', error);
            })
        )

        Promise.all(promises_arm_pedido).then(() => {

            fetch('/cadastrando/pedido', {
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
            })
            .catch(error => {
              console.error('Erro:', error);
            });

            if(compras_nao_realizadas.length > 0){
                let pedidosNaoRealizados = '';

                for(let i=0; i<compras_nao_realizadas.length; i++){
                    pedidosNaoRealizados+=' '+compras_nao_realizadas[i].nome_produto;
                }

                alert(`Não foi possível realizar a compra desses produtos: ${pedidosNaoRealizados}, pois já não estão mais disponiveis`)
                
                sessionStorage.clear()
                compras = [];
                window.location.href = '/home'
            }else{
                // alert("Pedido realizado com sucesso!")
                sessionStorage.clear()
                window.location.href = '/carrinho/status'
            }
            
        })
    })
})

function Obj_compra_usuario(name, e_mail, opc_pag, total_compra_feita){
    return {
      nome: name,
      email: e_mail,
      tipo_pagamento: opc_pag,
      valor_compra: total_compra_feita,
      produtos_solicitados: []
    }
}

function obj_comprado(nome_prod, qtd){
    return {
      nome_produto: nome_prod,
      qtd_comprada: qtd
    }
}
