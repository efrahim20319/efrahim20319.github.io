async function main() {
    const data = await fetch("https://deisishop.pythonanywhere.com/products/")
    const produtos = await data.json()


    let idsSelectionados = new Set();
    let produtosSelecionados = [];

    document.addEventListener("DOMContentLoaded", carregarProdutos(produtos))
    const categorySelect = document.querySelector("#categorySelect");
    const orderSelect = document.querySelector("#orderSelect");
    const inputPesquisar = document.querySelector("#inputPesquisar");
    const form = document.querySelector("#checkboxForm");



    categorySelect.addEventListener("change", function () {
        const category = this.value;

        const filteredProducts = produtos.filter(produto => produto.category == category)

        if (filteredProducts.length == 0) {
            carregarProdutos(produtos)
        } else {
            carregarProdutos(filteredProducts)
        }
    })


    orderSelect.addEventListener("change", function () {
        const value = this.value;
        let orderedProducts = [...produtos];
        if (value == "1") {
            orderedProducts = orderedProducts.sort((a, b) => {
                if (a.price > b.price) {
                    return -1;
                }
                if (a.price < b.price) {
                    return 1;
                }
                return 0;
            });
            carregarProdutos(orderedProducts)
        } else if (value == "2") {
            orderedProducts = orderedProducts.sort((a, b) => {
                if (a.price > b.price) {
                    return 1;
                }
                if (a.price < b.price) {
                    return -1;
                }
                return 0;
            });
            carregarProdutos(orderedProducts)
        } else {
            carregarProdutos(produtos)
        }
    })

    inputPesquisar.addEventListener("input", function () {
        const value = this.value;
        const filteredProducts = produtos.filter(product => product.title.includes(value))
        if (filteredProducts.length == 0) {
            carregarProdutos(produtos)
        } else {
            carregarProdutos(filteredProducts);
        }
    })

    form.addEventListener("submit", function (evt) {
        evt.preventDefault()
        if (idsSelectionados.size == 0) {
            alert("Carrinho vazio!")
            return
        }
        const inputStudent = document.querySelector("#deisiStudent");
        const inputDiscount = document.querySelector("#discount");
        console.log({ inputStudent });
        console.log();

        
        const reqBody = {
            "products": [...idsSelectionados],
            "student": Boolean(inputStudent.checked),
            "coupon": inputDiscount.value
        }

        fetch('https://deisishop.pythonanywhere.com/buy/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reqBody)
        })
        .then(req => {
            console.log(req);
            return req.json()
        }).then(res => {
            const spanPrice = document.querySelector("#finalPrice")
            spanPrice.textContent = res.totalCost
            const spanReference = document.querySelector("#paymentReference")
            spanReference.textContent = res.reference


            const payInfo = document.querySelector("#payInfo")

            payInfo.style.display = "block";

        })


    })

    function carregarProdutos(produtosList) {
        const sectionProdutos = document.querySelector("#allProducts")
        sectionProdutos.innerHTML = "";
        produtosList.forEach(produto => {
            const elementoProduto = criaProduto(produto, function () {
                idsSelectionados.add(produto.id)
                carregarProdutosSelecionados()
                localStorage.setItem("produtos-selecionados", JSON.stringify(produtosSelecionados))
            })
            sectionProdutos.appendChild(elementoProduto)
        });

        atualizaCesto();

    }

    function atualizaCesto() {
        if (localStorage.getItem("produtos-selecionados")) {
            idsSelectionados = new Set();
            const produtosSelecionados = JSON.parse(localStorage.getItem("produtos-selecionados"));
            for (const produto of produtosSelecionados) {
                idsSelectionados.add(produto.id);
            }
            carregarProdutosSelecionados();
        }
    }

    function criaProduto(produto, callback) {
        // Criar o elemento article com a classe 'produto'
        const article = document.createElement('article');
        article.classList.add('produto');
        article.setAttribute("id", String(produto.id))
        // Criar o título
        const titulo = document.createElement('h3');
        titulo.textContent = produto.title;

        // Criar a imagem
        const imagem = document.createElement('img');
        imagem.classList.add('produto__image');
        imagem.src = produto.image;
        imagem.alt = produto.title;

        // Criar o preço
        const preco = document.createElement('span');
        preco.classList.add('produto__price');
        preco.textContent = `Custo total: ${produto.price}€`;

        // Criar a descrição
        const descricao = document.createElement('p');
        descricao.classList.add('produto__description');
        descricao.textContent = produto.description;

        // Criar o botão
        const botao = document.createElement('button');
        botao.textContent = '+ Adicionar ao cesto';

        botao.addEventListener("click", callback)

        // Montar a estrutura no article
        article.appendChild(titulo);
        article.appendChild(imagem);
        article.appendChild(preco);
        article.appendChild(descricao);
        article.appendChild(botao);

        // Retornar o elemento article criado
        return article;
    }

    function criaProdutoCesto(produto) {
        const elementoProduto = criaProduto(produto, function () {
            idsSelectionados.delete(produto.id)
            carregarProdutosSelecionados()
            localStorage.setItem("produtos-selecionados", JSON.stringify(produtosSelecionados))
        })
        const paragrado = elementoProduto.querySelector("p");
        paragrado.remove()
        const botao = elementoProduto.querySelector("button");
        botao.textContent = '- Remover do cesto';
        return elementoProduto;
    }


    function carregarProdutosSelecionados() {
        const idsSelectionadosArray = [...idsSelectionados]
        produtosSelecionados = produtos.filter(produto => idsSelectionadosArray.includes(produto.id))
        const sectionSelecionados = document.querySelector("#selecionados")
        const custoTotalElement = document.querySelector("#custoTotal");
        sectionSelecionados.innerHTML = "";
        produtosSelecionados.forEach(produto => {
            const elementoProduto = criaProdutoCesto(produto)
            sectionSelecionados.appendChild(elementoProduto)
        });


        try {
            const precoTotal = produtosSelecionados.map(({ price }) => price).reduce((acc, val) => acc + val)
            custoTotalElement.textContent = `Custo total: ${precoTotal.toFixed(2)}€`
        } catch (error) {
            if (error instanceof TypeError) {
                custoTotalElement.textContent = ""
            }
        }

    }
}

main()
    .then(() => {
        console.log("App runnung!!");
    })