const modenaSelect = document.getElementById("moneda");
const criptomonedasSelect = document.getElementById("criptomonedas");
const formulario = document.getElementById("formulario");
const resultado = document.getElementById("resultado");

const objBusqueda = {
  modena: "",
  criptomoneda: "",
};

// Crear un promise

const obtenerCripto = (criptomonedas) =>
  new Promise((resolve) => {
    resolve(criptomonedas);
  });

document.addEventListener("DOMContentLoaded", () => {
  consultarCriptomonedas();

  formulario.addEventListener("submit", submitFormulario);

  criptomonedasSelect.addEventListener("change", leerValor);
  modenaSelect.addEventListener("change", leerValor);
});

function consultarCriptomonedas() {
  const url =
    "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((resultado) => obtenerCripto(resultado.Data))
    .then((criptomonedas) => selectCripto(criptomonedas));
}

function selectCripto(criptomonedas) {
  criptomonedas.forEach((cripto) => {
    const { FullName, Name } = cripto.CoinInfo;

    const option = document.createElement("option");
    option.value = Name;
    option.textContent = FullName;
    criptomonedasSelect.appendChild(option);
  });
}

const leerValor = (e) => {
  objBusqueda[e.target.name] = e.target.value;
};

const submitFormulario = (e) => {
  e.preventDefault();

  // Validar

  const { moneda, criptomoneda } = objBusqueda;

  if (moneda === "" || criptomoneda === "") {
    mostrarAlerta("Ambos campos son obligatorios");
    return;
  }

  // Consultar la API Con los resultados.

  consultarAPI();
};

const mostrarAlerta = (mgs) => {
  // no se repite la alerta.
  const existeError = document.querySelector(".error");
  if (!existeError) {
    const divMensaje = document.createElement("div");
    divMensaje.classList.add("error");

    // Mensaje de error.

    divMensaje.textContent = mgs;

    formulario.appendChild(divMensaje);

    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }
};

const consultarAPI = () => {
  const { moneda, criptomoneda } = objBusqueda;

  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

  mostrarSpinner();

  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((cotizacion) => {
      monstrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
    });
};

const monstrarCotizacionHTML = (cotizacion) => {
  limpiarHTML();
  const { PRICE, HIGHDAY, LOWDAY, LASTUPDATE, CHANGEPCT24HOUR } = cotizacion;

  const precio = document.createElement("p");
  precio.classList.add("precio");
  precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

  const precioAlto = document.createElement("p");
  precioAlto.innerHTML = `El precio más alto del día es: <span>${HIGHDAY}</span>`;

  const precioBajo = document.createElement("p");
  precioBajo.innerHTML = `El precio más bajo del día es: <span>${LOWDAY}</span>`;

  const ultimasHoras = document.createElement("p");
  ultimasHoras.innerHTML = `La variación de las últimas 24 hrs es de: <span> %${CHANGEPCT24HOUR}</span>`;

  const ultimaActalizacion = document.createElement("p");
  ultimaActalizacion.innerHTML = `La última actualización fue: <span> ${LASTUPDATE}</span>`;

  resultado.appendChild(precio);
  resultado.appendChild(precioAlto);
  resultado.appendChild(precioBajo);
  resultado.appendChild(ultimasHoras);
  resultado.appendChild(ultimaActalizacion);
};

const limpiarHTML = () => {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
};

const mostrarSpinner = () => {
  limpiarHTML();

  const spinner = document.createElement("div");
  spinner.classList.add("spinner");

  spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;
  resultado.appendChild(spinner);
};
