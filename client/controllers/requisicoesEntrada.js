const express = require('express'); // Chamando a biblioteca express
const router = express.Router(); // Exportando para fora;
const mysql = require('../aa.db').pool; // chamando as credenciais do banco de dados;
const data = new Date().toISOString(); // PEgando a data no formatado desejado para o banco;
const path = require('path');

exports.entradaProduto = (req, res, next) => {

    const {codigo, quantidade, valorUnitario, valorTotal, tipoProduto} = req.body;

    valorTotal_tratado = parseFloat(valorTotal.replace(/R\$|\s/g, '').replace(',', '.'));

    mysql.getConnection((err, conn) => {
        if(err) return res.json({message: "Erro ao conectar com o banco de dados!"});

        const query = `SELECT * FROM tbl_Produto WHERE cod_Prd = ?;`;

        conn.query(query, [codigo], (err, result) => {
            conn.release();
            if(err) return res.json({message: "Erro na requisição SQL!"});

            if(result.length == 0) return res.json({message: "Nenhum produto localizado, entre em contato com o suporte!"});

            mysql.getConnection((err, conn) => {
                const query2 = `INSERT INTO tbl_Entrada2 (codigo_produto, nome_produto , preco_total, preco_unitario, qtd_comprada, data_entrada) VALUES (?,?,?,?,?,?);`
                conn.query(query2, [codigo, tipoProduto, valorTotal_tratado, valorUnitario, quantidade, data], (err, result) => {
                    conn.release();
                    if(err) return res.json({message: "Erro ao enviar a entrada de produto!"});

                    mysql.getConnection((err, conn) => {
                        const query3 = `UPDATE tbl_Produto
                        SET qtd_TotProduto = qtd_TotProduto + ?
                        WHERE cod_Prd = ?;`

                        conn.query(query3, [quantidade, codigo], (err, result) => {
                            conn.release();
                            if(err) return res.json({message: "Erro ao atualizar a quantidade do produto!"});

                            return res.json({message: "Entrada realizada com sucesso!"});
                        })
                    })
                })
            })
        })
    })
}

exports.entradasProdutos = (req, res, next) => {
    mysql.getConnection((err, conn) => {
        if(err) return res.json({message: "Erro ao conectar com o banco de dados!"});
        const query = `SELECT * FROM tbl_Entrada2;`;
        conn.query(query, (err, result) => {
            conn.release();
            if(err) return res.json({message: "Erro ao conectar com o banco de dados!"});

            const response = {
                quantidade: result.length,
                entradas: result.map( entrada => {
                    return {
                        id: entrada.codigo_produto,
                        nome_produto: entrada.nome_produto,
                        data_entrada: entrada.data_entrada,
                        qtd_comprada: entrada.qtd_comprada,
                        preco_unitario: entrada.preco_unitario,
                        preco_total: entrada.preco_total,
                    }
                })
            }
            return res.json(response);
        })
    })
}

exports.catalogandoPedido = (req, res, next) => {

    const {nome, email, tipo_pagamento, valor_compra , produtos_solicitados } = req.body.request

    mysql.getConnection((err, conn) => {
        
        if(err) return res.json({message: "Erro ao conectar com o banco de dados!"});

        if(valor_compra == 0) return res.json({message: "Valor invalido!"});
        
        const query = `SELECT * FROM tbl_User WHERE email_Login = ?`;

        conn.query(query, [email], (err, result) => {
            conn.release();
            
            if(err) return res.json({message: "Erro ao conectar com o banco de dados!"});

            if(result.length == 0) return res.json({message: "Nenhum usuário foi encontrado!"});
            
            let contato = result[0].telefone;

            const query = `INSERT INTO pedidos_Realizados (contato, email_User, status, forma_pagamento, funcionario, valor_compra, data_pedido) VALUES (?,?,?,?,?,?,?); `;

            conn.query(query, [contato, email ,0, tipo_pagamento, nome, valor_compra, data], (err, result) => {
                conn.release();

                if(err) return res.json({message: "Erro ao conectar com o banco de dados!!"});

                return res.json({message: "Pedido realizado com sucesso!"})

            })
        })
    })
    
}

exports.historicoPedidosRealizados = (req, res, next) => {
        
    mysql.getConnection((err, conn) => {
        if(err) return res.json({message: "Erro ao conectar com o banco de dados!"});

        const query = `SELECT * FROM pedidos_Realizados`;

        conn.query(query, (err, result) => {
            conn.release();
            if(err) return res.json({message: "Erro ao conectar com o banco de dados!!"});

            const response = {
                quantidade: result.length,
                pedidos: result.map( pedidos => {''
                    return {
                        numero_pedido: pedidos.id,
                        email_user: pedidos.email_User,
                        funcionario: pedidos.funcionario,
                        forma_pagamento: pedidos.forma_pagamento,
                        status: pedidos.status,
                        contato: pedidos.contato,
                        valor_compra: pedidos.valor_compra,
                        data_pedido: pedidos.data_pedido
                    }
                })
            }

            return res.json(response);

        })
    })
}

exports.confirmandoCompra = (req, res, next) => {

    const {id} = req.body;

    mysql.getConnection((err, conn) => {
        if(err) return res.json({message: "Erro ao conectar com o banco de dados!"});

        const query = `SELECT * FROM pedidos_Realizados WHERE id = ?;`

        conn.query(query,[id], (err, result) => {
            conn.release();
            if(err) return res.json({message: "Erro ao conectar com o banco de dados!"});

            let status = result[0].status;
            let status_enviado = 1;

            if(status == 1){
                status_enviado = 0
            }

            const query = `UPDATE pedidos_Realizados SET status = ? WHERE id = ?;`

            conn.query(query, [status_enviado, id], (err, result) => {
                conn.release();
                if(err) return res.json({message: "Erro ao conectar com o banco de dados!"});

                if(result.affectedRows == 0) return res.json({message: "Erro ao atualizar status do produto!"})
                    
                const query = `UPDATE tbl_Saida SET status = ? WHERE codigo_pedido = ?;`

                conn.query(query, [status_enviado, id], (err, result) => {
                    conn.release();

                    if(err) return res.json({message: "Erro ao conectar com o banco de dados!"});

                    if(result.affectedRows == 0) return res.json({message: "Erro ao atualizar status do produto!"})
                    
                    return res.json({message: "Pagamento atualizado com sucesso!"});

                })
            })
        })
    })
}

exports.chamandoSaida = (req, res, next) => {

    mysql.getConnection((err, conn) => {
        if (err) return res.json({message: "Erro ao conectar com o banco de dados"});

        const query = `SELECT * FROM tbl_Saida;`;

        conn.query(query, (err, result) => {
            conn.release();
            if (err) return res.json({message: "Erro ao conectar com o banco de dados"});

            if (result.length == 0) return res.json({message: "Nenhuma saida foi encontrado"});

            const response = {
                quantidade: result.length,
                produtos: result.map(prod => {
                    return {
                        codido_pedido: prod.codigo_pedido,
                        codigo_produto: prod.codigo_produto,
                        funcionario: prod.funcionario,
                        data_saida: prod.data_saida,
                        qtd_comprada: prod.qtd_comprada,
                        nome_produto: prod.nome_produto,
                        forma_pagamento: prod.forma_pagamento,
                        valor_compra: prod.valor_compra,
                        status_compra: prod.status
                    }
                })
            }

            return res.json(response);
        })
    })
}
