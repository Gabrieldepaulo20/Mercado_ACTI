const express = require('express');
const produtosAPI = require('../controllers/requisicoesProduto');
const funcionariosAPI = require('../controllers/requisicoesFuncionario');
const entradasAPI = require('../controllers/requisicoesEntrada');
const router = express.Router();

// Chamando API referente aos produtos / cadastro / chamada.

router.post('/cadastrando/produto', produtosAPI.cadastrandoProduto);
router.delete('/deletando/produto', produtosAPI.deletandoProduto);
router.get('/chamada/produto', produtosAPI.chamandoProduto);
router.patch('/chamada/produto/especifico', produtosAPI.chamandoProdutoEspec);
router.patch('/atualizando/produto', produtosAPI.atualizandoProdutoPreco);
router.patch('/realizando/compra', produtosAPI.realizandoCompra);
router.post('/cadastrando/pedido', produtosAPI.cadastrandoPedidoRealizado);

// Chamando API referente a funcionarios.

router.get('/chamada/funcionarios', funcionariosAPI.chamandoFuncionarios);
router.get('/pesquisa/:email', funcionariosAPI.chamadaFuncionarioEspec);
router.delete('/delete', funcionariosAPI.deletandoUser);
router.patch('/atualizando', funcionariosAPI.atualizandoUser);
router.patch('/atualiza/funcionario', funcionariosAPI.atualizaStore);

// Chamada API referente as entradas/saidas.

router.post('/entrada/produto', entradasAPI.entradaProduto);
router.get('/entradas/produtos', entradasAPI.entradasProdutos);
router.post('/realizandoCompra', entradasAPI.catalogandoPedido);
router.get('/chamada/pedidosRealizados', entradasAPI.historicoPedidosRealizados);
router.patch('/atualiza/Pagamento', entradasAPI.confirmandoCompra);
router.get('/saida/produto', entradasAPI.chamandoSaida);


module.exports = router;