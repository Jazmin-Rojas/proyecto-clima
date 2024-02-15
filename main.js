const urlBase = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = '6d08a4d454399fe951bc5e2e500c7dde';
const difKelvin = 273.15;

document.getElementById('formBusqueda').addEventListener('submit', (event) => {
    event.preventDefault();
    const ciudad = document.getElementById('ciudadEntrada').value;
    if (ciudad) {
        fetchDatosClima(ciudad);
    }
});

document.getElementById('mostrarDatosLocalStorage').addEventListener('click', mostrarDatosLocalStorageEnModal);
document.getElementById('cerrarModal').addEventListener('click', cerrarModal);

function fetchDatosClima(ciudad) {
    fetch(`${urlBase}?q=${ciudad}&appid=${apiKey}`)
        .then(data => data.json())
        .then(data => {
            if (data.cod === 200) {
                guardarDatosLocalStorage(ciudad, data);
                mostrarDatosClima(data);
            } else {
                alert(`No se encontraron datos para la ciudad ${ciudad}`);
                document.querySelector('#ciudadEntrada').value = '';
            }
        })
        .catch(error => {
            console.error('Error al obtener datos del clima:', error);
            alert('Se produjo un error al obtener datos del clima. Por favor, intenta nuevamente más tarde.');
        });
}

function mostrarDatosClima(data) {
    document.getElementById('datosClima').innerHTML = '';
    const ciudadNombre = data.name;
    const paisNombre = data.sys.country;
    const temperatura = data.main.temp;
    const humedad = data.main.humidity;
    const descripcion = data.weather[0].description;
    const icono = data.weather[0].icon;

    const ciudadTitulo = document.createElement('h2');
    ciudadTitulo.textContent = `${ciudadNombre}, ${paisNombre}`;
    const temperaturaInfo = document.createElement('p');
    temperaturaInfo.textContent = `La temperatura es: ${Math.floor(temperatura - difKelvin)}ºC`;
    const humedadInfo = document.createElement('p');
    humedadInfo.textContent = `La humedad es: ${humedad}%`;
    const iconoInfo = document.createElement('img');
    iconoInfo.src = `https://openweathermap.org/img/wn/${icono}.png`;
    const descripcionInfo = document.createElement('p');
    descripcionInfo.textContent = `La descripción meteorológica es: ${descripcion}`;

    const div = document.createElement('div');
    div.appendChild(ciudadTitulo);
    div.appendChild(temperaturaInfo);
    div.appendChild(humedadInfo);
    div.appendChild(iconoInfo);
    div.appendChild(descripcionInfo);

    document.getElementById('datosClima').appendChild(div);
}

function guardarDatosLocalStorage(ciudad, data) {
    let storedData = JSON.parse(localStorage.getItem('weatherData')) || {};
    storedData[ciudad] = data;
    localStorage.setItem('weatherData', JSON.stringify(storedData));
}

function mostrarDatosLocalStorageEnModal() {
    const storedData = JSON.parse(localStorage.getItem('weatherData'));
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = '';
    if (storedData && Object.keys(storedData).length > 0) {
        for (const ciudad in storedData) {
            if (storedData.hasOwnProperty(ciudad)) {
                const data = storedData[ciudad];
                const ciudadTitulo = document.createElement('h2');
                ciudadTitulo.textContent = `${ciudad}, ${data.sys.country}`;
                ciudadTitulo.classList.add('elemento-lista');
                const temperaturaInfo = document.createElement('p');
                temperaturaInfo.textContent = `La temperatura es: ${Math.floor(data.main.temp - difKelvin)}ºC`;
                temperaturaInfo.classList.add('elemento-lista');
                const humedadInfo = document.createElement('p');
                humedadInfo.textContent = `La humedad es: ${data.main.humidity}%`;
                humedadInfo.classList.add('elemento-lista');
                const iconoInfo = document.createElement('img');
                iconoInfo.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
                iconoInfo.classList.add('elemento-lista');
                const descripcionInfo = document.createElement('p');
                descripcionInfo.textContent = `La descripción meteorológica es: ${data.weather[0].description}`;
                descripcionInfo.classList.add('elemento-lista');
                const separator = document.createElement('hr');

                const botonEliminar = document.createElement('button');
                botonEliminar.textContent = 'X';
                botonEliminar.className = 'eliminar-elemento';
                botonEliminar.classList.add('eliminar-elemento');
                botonEliminar.onclick = function () {
                    eliminarElemento(ciudad);
                };

                const div = document.createElement('div');
                div.classList.add('elemento-lista');
                div.appendChild(ciudadTitulo);
                div.appendChild(botonEliminar);
                div.appendChild(temperaturaInfo);
                div.appendChild(humedadInfo);
                div.appendChild(iconoInfo);
                div.appendChild(descripcionInfo);
                div.appendChild(separator);

                modalContent.appendChild(div);
            }
        }
    } else {
        const noDataMessage = document.createElement('p');
        noDataMessage.textContent = 'No hay datos almacenados en el localStorage.';
        noDataMessage.style.textAlign = 'center';
        noDataMessage.style.margin = '20px 0';
        noDataMessage.classList.add('no-data-message');
        modalContent.appendChild(noDataMessage);
    }

    const modal = document.getElementById('myModal');
    modal.style.display = 'block';
}

function eliminarElemento(id) {
    let storedData = JSON.parse(localStorage.getItem('weatherData')) || {};
    delete storedData[id];
    localStorage.setItem('weatherData', JSON.stringify(storedData));
    mostrarDatosLocalStorageEnModal();
}

function cerrarModal() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';
}
