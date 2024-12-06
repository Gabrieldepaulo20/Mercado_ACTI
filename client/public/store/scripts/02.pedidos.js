// Armazenando as chamadas de API;
let promises = []
let dados, dados_saida;

const bloco_compras = document.querySelector('.squares');

// Pegando as informações do usuário:
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

promises.push(
    fetch('/chamada/pedidosRealizados')
    .then(response => {
    if (!response.ok) throw new Error('Erro ao buscar os dados');
    return response.json();
    })
    .then(data => {
    dados = data.pedidos;
    
    })
    .catch(error => console.error('Erro:', error)),

    fetch('/saida/produto')
    .then(response => {
    if (!response.ok) throw new Error('Erro ao buscar os dados');
    return response.json();
    })
    .then(data => {
    dados_saida = data.produtos;
    
    })
    .catch(error => console.error('Erro:', error))
)

Promise.all(promises).then(() => {
    for(let i=dados.length-1; i>=0; i--){
        if(dados[i].email_user == emailUSer_real_prod){ // Caso o e-mail cadastrado no pedidos_realizado for igual ao do usuário logado, ele irá apresentar os seus pedidos.
            let elemento = criando_elemento_main(dados[i].numero_pedido, dados[i].status, dados[i].valor_compra, dados[i].data_pedido, dados_saida);
            bloco_compras.appendChild(elemento);
        }
    }
})

function criando_p(qtd, nome_Prd){
    let p = document.createElement('p');

    p.innerHTML = `${qtd}x ${nome_Prd}`;

    return p;
}

function criando_elemento_main(id, status, total_value, data, dados_saida){

    data = new Date(data).toLocaleDateString(); //  Transformando a data recebida do banco de dados.

    let div_main = document.createElement('div');
    div_main.setAttribute('class', 'square');

    let h2 = document.createElement('h2');

    h2.innerHTML = `ID do pedido: ${id}`;

    let div_textStatus = document.createElement('div');
    div_textStatus.setAttribute('class', 'text-status');

    let span = document.createElement('span');
    span.setAttribute('class','material-icons-outlined');

    let p_confi_pay = document.createElement('span');
    
    if(status == 0){
        p_confi_pay.innerHTML = 'Aguardando confirmação';
        span.setAttribute('id', 'hGlassIcon');
        span.innerHTML = 'hourglass_empty';
    }else {
        p_confi_pay.innerHTML = 'Pagamento realizado';
        span.setAttribute('id', 'checkIcon');
        span.innerHTML = 'check_circle';
    }

    div_textStatus.appendChild(span);
    div_textStatus.appendChild(p_confi_pay);

    let div_class_elements = document.createElement('div');
    div_class_elements.setAttribute('class', 'elements');
    
    for(let i=0; i<dados_saida.length; i++){

        if(id == dados_saida[i].codido_pedido){
            let p_prod = criando_p(dados_saida[i].qtd_comprada, dados_saida[i].nome_produto);
            div_class_elements.appendChild(p_prod);
        }
    }

    let div_price = document.createElement('div');
    div_price.setAttribute('class', 'price');

    let p_date = document.createElement('p');
    p_date.setAttribute('class', 'date');

    p_date.innerHTML = data;

    let h4_text = document.createElement('h4');
    h4_text.setAttribute('id', 'total');
    h4_text.innerHTML = 'Total';

    let h3_text = document.createElement('h3');
    h3_text.innerHTML = `R$ ${total_value}`;

    div_price.appendChild(p_date);
    div_price.appendChild(h4_text);
    div_price.appendChild(h3_text);

    div_main.appendChild(h2);
    div_main.appendChild(div_textStatus);
    div_main.appendChild(div_class_elements);
    div_main.appendChild(div_price);

    return div_main;
}

// Realizando a seleção de elementos da página
const buttonLogout = document.querySelector('#logoutIcon');

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