import produtos from "/lab9/produtos.js";
let idsSelectionados = new Set();
let produtosSelecionados = [];


document.addEventListener("DOMContentLoaded", carregarProdutos(produtos))



function carregarProdutos(produtosList) {
    const sectionProdutos = document.querySelector("#allProducts")
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