    document.addEventListener('DOMContentLoaded', () => {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        mostrarProductosEnCarrito(carrito);
        verificarCarritoVacio(carrito);
    });

    function mostrarProductosEnCarrito(productos) {
        const galeria = document.querySelector('.car-gallery');
        galeria.innerHTML = '';

        if (productos.length === 0) {
            galeria.innerHTML = '<p class="empty-message">Tu carrito está vacío.</p>';
            return; // Salir de la función si el carrito está vacío
        }

        productos.forEach((producto, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('car-gallery-item');
            itemDiv.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <div class="car-info">
                    <h3 class="car-title">${producto.nombre}</h3>
                    <p class="car-description">${producto.tipo}</p>
                    <h4 class="car-price">${producto.precio}</h4>
                    <p class="car-quantity">Cantidad: ${producto.cantidad}</p>
                    <button class="remove-button" data-index="${index}">Eliminar</button>
                </div>
            `;
            galeria.appendChild(itemDiv);
        });

        // Añadir manejador de eventos a los botones de eliminar
        document.querySelectorAll('.remove-button').forEach(button => {
            button.addEventListener('click', eliminarProductoDelCarrito);
        });
    }

    function verificarCarritoVacio(productos) {
        const mensaje = document.querySelector('.empty-message');

        if (productos.length === 0 && !mensaje) {
            const galeria = document.querySelector('.car-gallery');
            galeria.innerHTML = '<p class="empty-message">Tu carrito está vacío.</p>';
        }
    }

    function eliminarProductoDelCarrito(event) {
        const index = event.target.dataset.index;
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

        // Eliminar el producto del array
        carrito.splice(index, 1);

        // Actualizar el localStorage
        localStorage.setItem('carrito', JSON.stringify(carrito));

        // Volver a mostrar los productos en el carrito
        mostrarProductosEnCarrito(carrito);
        verificarCarritoVacio(carrito);
    }
