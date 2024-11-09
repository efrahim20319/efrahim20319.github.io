const li1 = document.querySelector("#toHover");

li1.addEventListener("mouseover", function () {
    this.textContent = "Obrigado por passares!";
})

li1.addEventListener("mouseout", function () {
    this.textContent = "Passa por Aqui!";
})



const span = document.querySelector("span")
document.querySelectorAll(".colorChanger")
    .forEach((btn) => {
        btn.addEventListener("click", function () {
            span.style.color = btn.innerHTML.toLowerCase();
        })
    })

const input1 = document.querySelector("#toWriteInput");
document.querySelector("#toWrite")
    .addEventListener("input", function () {
        const cores = ["#FF5733", "#33FF57", "#3357FF", "#FF33A8", "#33FFF6", "#F3FF33", "#9D33FF", "#FF8C33", "#33FF8C"];
        const numeroAleatorio = Math.floor(Math.random() * 9);
        input1.style.backgroundColor = cores[numeroAleatorio]
    })



const input2 = document.querySelector("#toChangeColorInput");
document.querySelector("form")
    .addEventListener("submit", (e) => {
        e.preventDefault()
        document.body.style.backgroundColor = input2.value.toLocaleLowerCase();
    })

const span2 = document.querySelector("#counter");
document.querySelector("button#toCountBtn")
    .addEventListener("click", function () {
        span2.innerHTML = Number(span2.innerHTML) + 1;
    })