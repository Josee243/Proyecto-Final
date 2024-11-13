let carrito = [];

// Función para agregar productos al carrito
function agregarAlCarrito(nombre, precio) {
    console.log(`Agregando al carrito: ${nombre} - Precio: ${precio}`);
    const productoExistente = carrito.find(item => item.nombre === nombre);
    
    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({ nombre, precio, cantidad: 1 });
    }

    actualizarCarrito();
}

// Función para actualizar el carrito en la interfaz
function actualizarCarrito() {
    console.log("Actualizando el carrito...");
    const carritoItems = document.getElementById("carritoItems");
    carritoItems.innerHTML = "";

    let total = 0;

    carrito.forEach((item, index) => {
        const totalProducto = item.precio * item.cantidad;
        total += totalProducto;

        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${item.nombre}</td>
            <td>$${item.precio}</td>
            <td>${item.cantidad}</td>
            <td>$${totalProducto}</td>
            <td><button class="btn btn-danger btn-sm" onclick="eliminarDelCarrito(${index})">Eliminar</button></td>
        `;
        carritoItems.appendChild(fila);
    });

    document.getElementById("totalCarrito").innerText = total;
}

// Función para eliminar productos del carrito
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
}

// Función para procesar la compra
function procesarCompra() {
    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    // Calcular el total
    const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

    // Datos de la compra a enviar
    const compraData = {
        productos: carrito,
        total: total
    };

    // Enviar datos al servidor
    fetch('http://localhost:3307/Proyecto.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(compraData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.mensaje || "Compra procesada exitosamente. ¡Gracias por su compra!");
        carrito = []; // Vaciar el carrito después de la compra
        actualizarCarrito();
    })
    .catch(error => console.error('Error al procesar la compra:', error))
    
}




