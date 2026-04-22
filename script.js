const botoes = document.querySelectorAll(".btn")
const menus = document.querySelectorAll(".menu")
const cartmodal = document.getElementById("cartmodal")
const btncar = document.getElementById("btncar")
const closemodal = document.getElementById("close-modal")
const pagamento = document.getElementById("pagamento")
const troco = document.getElementById("troco")
const btnitem = document.querySelectorAll(".btnitem")
const cartitemscontainer = document.getElementById("cart-items")
const totalitems = document.getElementById("total")
const quantPed = document.getElementById("quantped")
const addressInput = document.getElementById("address")
const nameInput = document.getElementById("name")
const cpfInput = document.getElementById("cpf")
const nameWarn = document.getElementById("name-warn")
const cpfWarn = document.getElementById("cpf-warn")
const addressWarn = document.getElementById("address-warn")
const checkoutBtn = document.getElementById("checkout-btn")



let cart = []

botoes.forEach(botao => {
    botao.addEventListener("click", () => {

        const target = botao.getAttribute("data-target");
        const menu = document.getElementById(target)

        const jaAtivo = menu.classList.contains("ativo")

        // fecha tudo
        menus.forEach(m => m.classList.remove("ativo"))
        botoes.forEach(b => b.classList.remove("ativo"))

        // se não estava aberto, abre
        if (!jaAtivo) {
            const scrollY = window.scrollY;
            menu.classList.add("ativo")
            botao.classList.add("ativo")

            window.scrollTo(0, scrollY);

            menu.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
        //updatecartmodal()
    })
})
    btncar.addEventListener("click", ()=> {
        cartmodal.style.display = "flex"
    })

    cartmodal.addEventListener("click", function(event) {
        if(event.target === cartmodal){
            cartmodal.style.display = "none"
        }
    })

    closemodal.addEventListener("click", () =>{
        cartmodal.style.display = "none"
    })

    pagamento.addEventListener("change", () => {
        if (pagamento.value === "dinheiro") {
            troco.style.display = "block"
        } else
            troco.style.display = "none"

    })

   btnitem.forEach(button => {
    button.addEventListener("click", (event) => {
        const parentbutton = event.target.closest(".btnitem")

        if(parentbutton) {
            const name = parentbutton.getAttribute("data-name")
            const price = parseFloat(parentbutton.getAttribute("data-price"))

            addtocart(name, price)
        }
    })
    })
        //adicionar no carrinho
        function addtocart(name, price){
            const existingitem = cart.find(item => item.name === name )

            if(existingitem){
                existingitem.quantity += 1;
            }else{

            cart.push({
                name,
                price,
                quantity: 1,
            })
            }
            updatecartmodal()

        }

        function updatecartmodal(){
            cartitemscontainer.innerHTML = "";
            let total = 0;

            cart.forEach(item => {
                const cartitemelement = document.createElement("div");

                cartitemelement.innerHTML = `
                <div class="btncarf">
                    <div >
                        <p> ${item.name}</p>
                        <p>QTD: ${item.quantity}</p>
                        <p>R$ ${item.price.toFixed(2)}</p
                        
                       
                    </div>

                    <div>
                        <button class="remove-btn" data-name="${item.name}">
                            Remover
                        </button>
                    </div>
                </div>  
                `

            total = total + item.price * item.quantity


                cartitemscontainer.appendChild(cartitemelement)
            })

            totalitems.textContent = total.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
            });

            quantPed.innerHTML = cart.length;

        }
        //funçao de remover item do carrinho
        cartitemscontainer.addEventListener("click", function(event){
            if(event.target.classList.contains ("remove-btn")){
                const name = event.target.getAttribute("data-name")
                removeitemcart(name);
            }
        })

        function removeitemcart(name){
            const index = cart.findIndex(item => item.name === name);

            if(index !== -1){
                const item = cart[index];

                if(item.quantity > 1){
                    item.quantity -= 1;
                    updatecartmodal();
                    return;
                }

                cart.splice(index, 1);
                updatecartmodal();
            }
        }

        nameInput.addEventListener("input", function(event){
            let inputValue = event.target.value;

            if(inputValue !== ""){
                nameWarn.classList.add("hidden")
            }

        })

        cpfInput.addEventListener("input", function(event){
            let inputValue = event.target.value;

            if(inputValue !== ""){
                cpfWarn.classList.add("hidden")
            }

        })

        addressInput.addEventListener("input", function(event){
             let inputValue = event.target.value;

             if(inputValue !== ""){
                addressWarn.classList.add("hidden")
             }

         })


           
        checkoutBtn.addEventListener("click", function() {
            const isOpen = checkRestaurant();
            if(!isOpen){
                Toastify({
                    text: "Ops fechado no momento",
                    duration: 3000,
                    destination: "https://github.com/apvarun/toastify-js",
                    newWindow: true,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                    background: "linear-gradient(to right, #e8f536, #ffc905)",
                    },
                }).showToast();

                return;
            }

            if (cart.length === 0) return;

            if(nameInput.value.trim() === ""){
                nameWarn.classList.remove("hidden")
                return;
            }
            
            if(cpfInput.value.trim() === ""){
                cpfWarn.classList.remove("hidden")
                return;
            }

            if(addressInput.value.trim() === ""){
                addressWarn.classList.remove("hidden")
                return;  
          } 
          
          enviarpedido();
        
          
        })

        function checkRestaurant(){
            const data = new Date();
            const hora = data.getHours();
            return hora >= 18 && hora < 23;
        }
    
    const hourSpan = document.getElementById("hour-span")
    const isOpen = checkRestaurant();

    if(isOpen){
        hourSpan.classList.remove("closed")
        hourSpan.classList.add("open")
    }else{
        hourSpan.classList.remove("open")
        hourSpan.classList.add("closed")
    }
    
    const numero = "14997406757" 
    function enviarpedido() {
        let mensagem = "🛒 *Pedido*\n\n";
        
        cart.forEach(item => {
            mensagem += `${item.name} - R$ ${item.price.toFixed(2)} - QTF: ${item.quantity}\n`;
        });
        mensagem += "\n👤 Nome: " + nameInput.value;
        mensagem += "\n🧾 CPF: " + cpfInput.value;
        mensagem += "\n📍 Endereço: " + addressInput.value;
        mensagem += `\n💰 Pagamento: ${pagamento.value}`;

        const mensagemFormatada = encodeURIComponent(mensagem);

        const link = `https://wa.me/${numero}?text=${mensagemFormatada}`;
        window.open(link, "_blank");

        cart.length = 0;
        updatecartmodal();

    }