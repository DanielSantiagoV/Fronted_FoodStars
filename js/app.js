const backend_URL = "http://localhost:4000"

const productsList = document.getElementById("products-list");
const productForm = document.getElementById("form-product")

async function fetchAPI(url) {
    const result = await fetch(url, {headers: {"Content-Type": "application/json"}})
    if(!result.ok){
        const errorData = await result.json().catch(()=>({}));
        const message = errorData.message || errorData.error || JSON.stringify(errorData);
        throw new Error(message)
    }
    return result.json()
}

async function getProducts() {
    const products = await fetchAPI(`${backend_URL}/products`);
    productsList.innerHTML = `
        <div class="list-products">
            ${products.map(p => `
                <div class="product">
                    <p>${p.name}</p>
                    <p>${p.price}</p>
                    <p>${p.category}</p>
                    <p>${p.stock}</p>
                </div>
                `).join("")}
        </div>
    `
}


// (async function initt() {
//     try {
//         await getProducts();
//     } catch (error) {
//         console.error(error);
//     }
// })();


async function createProduct(product) {
    const response = await fetch(`${backend_URL}/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.message || errorData.error || JSON.stringify(errorData);
        throw new Error(`Error al crear el producto: ${message}`);
    }
    return await response.json();
}

(async function initt() {
    try {
        await getProducts();

        productForm.addEventListener("submit", async (event) => {
            event.preventDefault(); 

            const newProduct = {
                name: document.getElementById("name").value,
                price: parseFloat(document.getElementById("price").value),
                category: document.getElementById("category").value,
                stock: parseInt(document.getElementById("stock").value, 10) || 0
            };

            try {
                await createProduct(newProduct);
                productForm.reset();
                await getProducts(); 
            } catch (error) {
                console.error("Fallo al crear el producto:", error);
                alert(`No se pudo crear el producto: ${error.message}`);
            }
        });

    } catch (error) {
        console.error(error);
    }
})();