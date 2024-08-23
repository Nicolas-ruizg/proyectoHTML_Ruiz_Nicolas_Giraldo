let productos = []; // Declara productos como variable global

document.addEventListener('DOMContentLoaded', () => {
    fetch('PRODUCTOS.json')
        .then(response => response.json())
        .then(data => {
            productos = data; // Asigna los datos a la variable global
            generarProductos(productos);
            actualizarSeccionActual();
        })
        .catch(error => console.error('Error al cargar el JSON:', error));

    window.filtrarPorId = function(id) {
        if (id === 'TODOS') {
            generarProductos(productos);
        } else {
            const productosFiltrados = productos.filter(producto => producto.id === id);
            generarProductos(productosFiltrados);
        }
        actualizarSeccionActual();
    };
});

function generarProductos(productos) {
    const seccionCarros = document.querySelector('.carros');
    seccionCarros.innerHTML = '';
    const secciones = {};

    productos.forEach(producto => {
        if (!secciones[producto.id]) {
            secciones[producto.id] = document.createElement('section');
            secciones[producto.id].id = producto.id;
            secciones[producto.id].classList.add('car-section');
            secciones[producto.id].innerHTML = `<h1 class="section-title">${producto.id}</h1><div class="car-container"></div>`;
            seccionCarros.appendChild(secciones[producto.id]);
        }

        const carDiv = document.createElement('div');
        carDiv.classList.add('car');
        carDiv.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" class="car-image">
            <div class="car-info">
                <h3 class="car-title">${producto.nombre}</h3>
                <p class="car-description">${producto.tipo}</p>
                <h4 class="car-price">${producto.precio}</h4>
                <button class="add-to-cart" data-id="${producto.id}" data-nombre="${producto.nombre}" data-tipo="${producto.tipo}" data-imagen="${producto.imagen}" data-precio="${producto.precio}">Añadir al Carrito</button>
            </div>
        `;

        secciones[producto.id].querySelector('.car-container').appendChild(carDiv);
    });

    // Agregar evento a los botones de añadir al carrito
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const producto = {
                id: button.getAttribute('data-id'),
                nombre: button.getAttribute('data-nombre'),
                tipo: button.getAttribute('data-tipo'),
                imagen: button.getAttribute('data-imagen'),
                precio: button.getAttribute('data-precio'),
                cantidad: 1
            };
            agregarAlCarrito(producto);
        });
    });
}

function agregarAlCarrito(producto) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    // Crear un identificador único para cada combinación de atributos
    const idUnico = `${producto.id}-${producto.nombre}-${producto.tipo}-${producto.precio}`;
    const index = carrito.findIndex(item => item.idUnico === idUnico);

    if (index > -1) {
        carrito[index].cantidad++; // Incrementa la cantidad si el producto ya está en el carrito
    } else {
        carrito.push({
            ...producto,
            idUnico
        });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    alert(`${producto.nombre} ha sido añadido al carrito`);
}

function actualizarSeccionActual() {
    const secciones = document.querySelectorAll('.car-section');
    const header = document.getElementById('current-section');

    const opciones = {
        root: null,
        threshold: 0.7 // 70% de la sección visible para considerarla activa
    };

    const callback = (entradas, observador) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                header.textContent = entrada.target.querySelector('.section-title').textContent;
            }
        });
    };

    const observador = new IntersectionObserver(callback, opciones);

    secciones.forEach(seccion => {
        observador.observe(seccion);
    });
}
