// Define la URL base del backend para las peticiones API
const backend_URL = "http://localhost:4000"

// Obtiene el elemento del DOM donde se mostrarán la lista de productos
const productsList = document.getElementById("products-list");
// Obtiene el elemento del formulario para crear productos
const productForm = document.getElementById("form-product")

// Función asíncrona para realizar peticiones HTTP a la API
async function fetchAPI(url) {
    // Realiza una petición fetch a la URL proporcionada con headers JSON
    const result = await fetch(url, {headers: {"Content-Type": "application/json"}})
    // Verifica si la respuesta no fue exitosa (status diferente de 200-299)
    if(!result.ok){
        // Intenta parsear el error como JSON, si falla retorna un objeto vacío
        const errorData = await result.json().catch(()=>({}));
        // Extrae el mensaje de error de diferentes posibles propiedades o convierte todo a string
        const message = errorData.message || errorData.error || JSON.stringify(errorData);
        // Lanza una excepción con el mensaje de error
        throw new Error(message)
    }
    // Si la respuesta fue exitosa, retorna los datos parseados como JSON
    return result.json()
}

// Función asíncrona para obtener la lista de productos del servidor
async function getProducts() {
    // Llama a la API para obtener los productos desde el endpoint /products
    const products = await fetchAPI(`${backend_URL}/products`);
    // Actualiza el HTML del contenedor con la lista de productos
    // Itera sobre cada producto y crea un div con su información
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


// Código comentado - función de inicialización alternativa
// (async function initt() {
//     try {
//         await getProducts();
//     } catch (error) {
//         console.error(error);
//     }
// })();


// Función asíncrona para crear un nuevo producto en el servidor
async function createProduct(product) {
    // Realiza una petición POST al endpoint de productos
    const response = await fetch(`${backend_URL}/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        // Convierte el objeto producto a formato JSON
        body: JSON.stringify(product)
    });
    // Verifica si la respuesta no fue exitosa
    if (!response.ok) {
        // Intenta obtener los datos del error, si falla retorna objeto vacío
        const errorData = await response.json().catch(() => ({}));
        // Extrae el mensaje de error de diferentes posibles propiedades
        const message = errorData.message || errorData.error || JSON.stringify(errorData);
        // Lanza una excepción con el mensaje de error formateado
        throw new Error(`Error al crear el producto: ${message}`);
    }
    // Si fue exitosa, retorna los datos de la respuesta como JSON
    return await response.json();
}

// Función de inicialización que se ejecuta inmediatamente (IIFE - Immediately Invoked Function Expression)
(async function initt() {
    try {
        // Carga inicial de productos al iniciar la aplicación
        await getProducts();

        // Agrega un listener al evento submit del formulario
        productForm.addEventListener("submit", async (event) => {
            // Previene el comportamiento por defecto del formulario (recargar página)
            event.preventDefault(); 

            // Crea un objeto con los datos del nuevo producto desde los inputs del formulario
            const newProduct = {
                name: document.getElementById("name").value,
                price: parseFloat(document.getElementById("price").value),
                category: document.getElementById("category").value,
                stock: parseInt(document.getElementById("stock").value, 10) || 0
            };

            try {
                // Llama a la función para crear el producto en el servidor
                await createProduct(newProduct);
                // Limpia el formulario después de crear el producto exitosamente
                productForm.reset();
                // Recarga la lista de productos para mostrar el nuevo producto
                await getProducts(); 
            } catch (error) {
                // Si hay un error al crear el producto, lo registra en consola
                console.error("Fallo al crear el producto:", error);
                // Muestra una alerta al usuario con el mensaje de error
                alert(`No se pudo crear el producto: ${error.message}`);
            }
        });

    } catch (error) {
        // Si hay un error en la inicialización, lo registra en consola
        console.error(error);
    }
})();