    
    class ItemDoCardapio {
        constructor(cod, descricao, valor, itemPrincipal = null) {
            this.cod = cod;  // Código do item no cardápio
            this.descricao = descricao;  // Descrição do item
            this.valor = valor;  // Valor do item
            this.itemPrincipal = itemPrincipal;  // Código do item principal, se for um extra
        }
    }

    class MetodoDePagamento {
        constructor(descricao) {
            this.descricao = descricao;  // Descrição do método de pagamento
        }
    }

    class CaixaDaLanchonete {
        constructor() {
            this.menuItens = [  // Lista de itens do cardápio
                new ItemDoCardapio("cafe", "Café", 3.00),
                new ItemDoCardapio("chantily", "Chantily (extra do Café)", 1.50, "cafe"),
                new ItemDoCardapio("suco", "Suco Natural", 6.20),
                new ItemDoCardapio("sanduiche", "Sanduíche", 6.50),
                new ItemDoCardapio("queijo", "Queijo (extra do Sanduíche)", 2.00, "sanduiche"),
                new ItemDoCardapio("salgado", "Salgado", 7.25),
                new ItemDoCardapio("combo1", "1 Suco e 1 Sanduíche", 9.50),
                new ItemDoCardapio("combo2", "1 Café e 1 Sanduíche", 7.50)
            ];
            this.metodoPagamento = [  // Lista de métodos de pagamento
                new MetodoDePagamento("dinheiro"),
                new MetodoDePagamento("credito"),
                new MetodoDePagamento("debito")
            ];
        }

        calcularValorDaCompra(metodoDePagamento, itens) {
            if (itens.length === 0) {
                return "Não há itens no carrinho de compra!";
            } else {
                let totalValor = 0.00;
                for (const item of itens) {
                    const itemEquant = this.separarQuantProduto(item);  // Separa item e quantidade
                    if (typeof itemEquant === "string") {
                        return 'Item inválido!';
                    }

                    const tipoItem = itemEquant[0];  // Tipo do item
                    const quantItem = parseInt(itemEquant[1]);  // Quantidade do item
                    if (isNaN(quantItem) || quantItem < 1) {
                        return "Quantidade inválida!";
                    }

                    const itemCalculatedValor = this.calcularValorItem(tipoItem, quantItem, itens);  // Calcula o valor do item

                    if (typeof itemCalculatedValor === "string") {
                        return itemCalculatedValor;
                    }

                    totalValor += itemCalculatedValor;  // Soma o valor calculado ao total
                }

                totalValor = this.aplicarTaxaOuDesconto(metodoDePagamento, totalValor);  // Aplica taxa ou desconto ao total

                if (typeof totalValor === 'string') {
                    return totalValor;
                }

                return `R$ ${totalValor.toFixed(2).replace('.', ',')}`;  // Retorna o valor total formatado
            }
        }

        separarQuantProduto(item) {
            const separarItem = item.split(",");  // Separa o item e a quantidade por vírgula

            if (separarItem.length !== 2) {
                return "Item inválido!";
            }
            return separarItem;
        }

        aplicarTaxaOuDesconto(formaDePagamento, valorTotal) {
            let novoValorTotal = valorTotal;
            switch (formaDePagamento) {
                case this.metodoPagamento[0].descricao:  // Caso seja pagamento em dinheiro
                    novoValorTotal *= 0.95;  // Aplica desconto de 5%
                    break;
                case this.metodoPagamento[1].descricao:  // Caso seja pagamento com crédito
                    novoValorTotal *= 1.03;  // Aplica taxa de 3%
                    break;
                case this.metodoPagamento[2].descricao:  // Caso seja pagamento com débito
                    break;  // Não aplica alterações no valor
                default:
                    return "Forma de pagamento inválida!";
            }
            return novoValorTotal;
        }

        calcularValorItem(tipoItem, quantidade, itens) {
            let valorTotalItem = 0;
            const menuItem = this.menuItens.find(item => item.cod === tipoItem);  // Encontra o item no cardápio

            if (!menuItem) {
                return "Item inválido!";
            }

            if (menuItem.itemPrincipal && !this.temItemPrincipal(itens, menuItem.itemPrincipal)) {
                return 'Item extra não pode ser pedido sem o principal';
            }

            valorTotalItem = menuItem.valor * quantidade;  // Calcula o valor total do item
            return valorTotalItem;
        }

        temItemPrincipal(itens, itemPrincipal) {
            for (const item of itens) {
                const tipoItem = this.separarQuantProduto(item)[0];  // Encontra o tipo do item
                if (itemPrincipal === tipoItem) {
                    return true;
                }
            }
            return false;
        }
    }

    export {CaixaDaLanchonete};
