// Inicializa o array 'compra' com dados armazenados no sessionStorage
let compra = JSON.parse(sessionStorage.getItem('store')) || [];

// Busca dados dos produtos cadastrados no banco
fetch('/chamada/produto')
.then(response => {
    if (!response.ok) throw new Error('Erro ao buscar os dados');
    return response.json();
})
.then(data => exibirProdutos(data.produtos)) //Chama a função que constroi a tabela e exibe os produtos encontrados
.catch(error => console.error('Erro:', error));

// Função que exibe os produtos recebidos do servidor na interface
function exibirProdutos(produtos){

    const sessaoDoce = document.querySelector('#Doces');
    const sessaoSalgado = document.querySelector('#Salgados');
    const sessaoBebida = document.querySelector('#Bebidas');    
    const template = document.querySelector('#produto-template');

    // Percorre a lista de produtos para criar e exibir cada um
    for(let produto of produtos){

        const p = template.content.cloneNode(true);

        if(produto.qtd_TotProduto > 0){
            p.querySelector('.prod').textContent = produto.nome_Prd;
            p.querySelector('.vlrUnitario').textContent = `R$ ${produto.vlr_Unit}`;
        }

        // Percorre pelo "sessionStorage" para verificar se o produto já foi armazenado
        for(let i of compra){
            if(i.nome == produto.nome_Prd){
                p.querySelector('.qtdAtual').textContent = i.quantidade;
                
                // Atualiza a qtd total
                let qtdElemento = document.querySelector('#qtdItens');
                let qtdText = qtdElemento.textContent.split(' ');
                qtdElemento.textContent = `${Number(qtdText[0]) +  i.quantidade} itens`;

                // Carrega o valor total
                let totalElemento = document.querySelector('#valorTotal');
                let totalText = parseFloat(totalElemento.textContent.replace(/^R\$ /, '').replace(/\./g, '').replace(/(\d{2})$/, '.$1'));
                let pruduto = parseFloat(produto.vlr_Unit) * i.quantidade;
                totalElemento.innerHTML = `R$ ${(totalText + pruduto).toFixed(2)}`;
            }
        }

        if(produto.tipo_produto == "Salgado" && produto.qtd_TotProduto > 0) sessaoSalgado.appendChild(p);
            else if(produto.tipo_produto == "Bebida" && produto.qtd_TotProduto > 0 ) sessaoBebida.appendChild(p);
            else if(produto.tipo_produto == "Doce" && produto.qtd_TotProduto > 0 )sessaoDoce.appendChild(p);
        }

        // Configura os eventos de clique para os produtos em cada seção
        verificarClick(sessaoDoce);
        verificarClick(sessaoSalgado);
        verificarClick(sessaoBebida);
}

function verificarClick(sessaoDoce){
    sessaoDoce.addEventListener('click', (e) => {
        const tag = e.target;
        let span = tag.parentElement;
        const itemProduto = span.parentElement;
        const spanQtd = span.querySelector('.qtdAtual');

        if(tag.classList.contains('addProdutos')){

            e.preventDefault();
            
            // Realizando a captura do nome do produto que será adicionado no carrinho.
            const tipoProduto_01 = itemProduto.querySelector('.prod').textContent;

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
          

                let qtd_prod = parseFloat(spanQtd.innerHTML) // Recebe a quantidade solicitada pelo usuário.

                // Verificando se qtd solicitada pelo usuário não é superior ao que está armazenado no banco de
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

function verificaaaClick(tabela){
    tabela.addEventListener('click', (e) => {

      if(tag.classList.contains('btnAdd')){
        e.preventDefault();
        const span = tr.querySelector('.qtdAtual');
  
        const tipoProduto_01 = tr.querySelector('#prod').textContent;
  
        const dados = {
          tipoProduto: tipoProduto_01
        }
  
        // Aqui estou realizando a chamada da API no banco de dados, onde a cada nova inserção de produto no carrinho ele irá validar se a quantidade está compatível ou não.
  
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
          let itens = JSON.parse(sessionStorage.getItem('compra'));
  
          let quantidade_produto = data.produto[0].qtd_Prd; // Recebe a quantidade armazenada no banco de dados.
  
          let qtd_prod = parseFloat(span.innerHTML) // Recebe a quantidade solicitada pelo usuário.
  
          let verificando_na_tabela_qtd = 0
  
          if(itens){
  
              for(let i=0; i<itens.length; i++){
                let nome_produto = itens[i].nome;
                let qtd_produto_procurado = parseFloat(itens[i].qtd);
              
                if(tipoProduto_01 == nome_produto){
                    verificando_na_tabela_qtd = verificando_na_tabela_qtd + qtd_produto_procurado
                }
            }
          }
  
          if(verificando_na_tabela_qtd > 0){
              if(verificando_na_tabela_qtd + qtd_prod > quantidade_produto){
                alert(`Não é possível adicionar o produto no carrinho, pois [quantidade solicitada] + [o que já está no carrinho] excede a disponível em Estoque`); // Exibe alert avisando o usario que o item foi adicionado
                return
              }
          }
          
          if(qtd_prod > quantidade_produto){
            alert(`Não é possível adicionar o produto no carrinho, escolha uma quantidade menor ou igual a: ${quantidade_produto} (Em Estoque)`); // Exibe alert avisando o usario que o item foi adicionado
          }
          else {
            if(!addCarinho(tr)) return; //Chama a função que adiciona os itens na aba "finalizar compra" 
  
            limpaItem(span,tr); //Chama a função que limpa os itens na tabela após add no carrinho
            alert('Produto adicionado no carrinho com sucesso!'); // Exibe alert avisando o usario que o item foi adicionado
          }
  
        })
        .catch(error => {
          console.error('Erro:', error);
        });
      }
    })
};
  











  
// Função que realiza conta do valor TOTAL (qtd * valor unitario) e adiciona no front
function atualizaValorTotal (span,click){
    let valorUni = span.querySelector('.vlrUnitario');

    // Variaveis da qtd total
    let qtdTotal =  document.querySelector('#qtdItens').textContent;
    qtdTotal = parseFloat(qtdTotal.replace(/^R\$ /, '').replace(/\./g, '').replace(/(\d{2})$/, '.$1'));

    // Variaveis da qtd do produto
    let tagQtd = span.querySelector('.qtdAtual');
    let qtd = parseFloat(tagQtd.textContent);

    // Variaveis do valor total
    let valorTotal = document.querySelector('#valorTotal');
    let totalNumber = valorTotal.textContent;
    totalNumber = parseFloat(totalNumber.replace(/^R\$ /, '').replace(/\./g, '').replace(/(\d{2})$/, '.$1'))

    // Variabel do valor unitario do produto
    valorUni = valorUni.textContent;
    valorUni = parseFloat(valorUni.replace(/^R\$ /, '').replace(/\./g, '').replace(/(\d{2})$/, '.$1'));

    let resultado;

    // Verica se o click foi para adicionar produto ou retirar e atualiza a qtd total
    if(click == 'add') {
        qtd++;
        document.querySelector('#qtdItens').textContent = `${1 + qtdTotal} itens`;
        resultado = (totalNumber + valorUni).toFixed(2);
    }
    else if(click == 'remove' && qtd > 0) {
        qtd--;
        document.querySelector('#qtdItens').textContent = `${qtdTotal-1} itens`;
        resultado = (totalNumber - valorUni).toFixed(2);
    }
    else if (qtd <= 0){
        return;
    }

    tagQtd.innerHTML = qtd;
    valorTotal.innerHTML = `R$ ${resultado}`;

    sessionStorage.setItem('total', JSON.stringify(parseFloat(resultado).toFixed(2))); 
    
    armazenarCompra(span);
}

// Função para adicionar ou remover um item do sessionStorage/carrinho
function armazenarCompra(span){
    const nome = span.querySelector('.prod').textContent; 
    const valor = span.querySelector('.vlrUnitario').textContent; 
    let quantidade = span.querySelector('.qtdAtual').textContent;
    quantidade = Number(quantidade);

    // Filtra os produtos para atualizar a quantidade ou remover se for 0
    let igual = false; // booleano para verificar se o produto já existe no sessionStorage
    compra = compra.filter(produto => {
        if(nome == produto.nome_produto){
            produto.qtd_comprada = quantidade;
            igual = true;
        }
        return produto.qtd_comprada > 0;
    })

    // Se o produto não for encontrado no sessionStorage, adiciona-o como um novo item
    if(!igual) compra.push({'nome_produto': nome,'qtd_comprada': quantidade, 'valor': valor});

    sessionStorage.setItem('store', JSON.stringify(compra)); 
}


// Realizando a seleção de elementos da página
const buttonLogout = document.querySelector('.logo-exit');
const nome = document.querySelector('#nameUser');

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

// --> Definindo variáveis a serem usadas no front-end - Nome;
let nameUSer = getCookie('name');
nameUSer = nameUSer.split(' ');
nome.textContent = `Olá, ${nameUSer[0]}!`;

// Realiza o logout do sistema

buttonLogout.addEventListener('click', () => {
    sessionStorage.removeItem('store');
    fetch('/logout', {
        method: 'POST',
    })
    .then(response => {
        window.location.href = '/login';
    })
    .catch(error => {
        console.error('Erro ao fazer logout:', error);
    });
});

// <-- FIM