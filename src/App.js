import React, { useState, useEffect } from 'react';
import Formulario from './components/Formulario';
import ListadoImagenes from './components/ListadoImagenes'; 

function App() {

  //state de la App
  const [ busqueda, guardarBusqueda ] = useState('');
  const [ imagenes, guardarImagenes ] = useState([]);
  const [ paginaactual, guardarPaginaActual ] = useState(1);
  const [ totalpaginas, guardarTotalPaginas ] = useState(1);
  
  useEffect(() => {
   const consultarAPI = async () => {
      if(busqueda === '') return;

      const imagenesPorPagina = 10;
      const key = "16770867-269e834c87375857bdbe6429b";
      const url = `https://pixabay.com/api/?key=${key}&q=${busqueda}&per_page=${imagenesPorPagina}&page=${paginaactual}`;

      const respuesta = await fetch(url);
      const resultado = await respuesta.json();

      guardarImagenes(resultado.hits);

      //calcular el total de páginas
      const calcularTotalPaginas = Math.ceil(resultado.totalHits / imagenesPorPagina);

      guardarTotalPaginas(calcularTotalPaginas);

      //Mover la pantalla hacia arriba
      const jumbotron = document.querySelector('.jumbotron');
      jumbotron.scrollIntoView({behaviour: 'smooth'});

   }
   consultarAPI();
  }, [busqueda, paginaactual])

  //definir la página Anterior
  const paginaAnterior = () => {
   const nuevaPaginaActual = paginaactual - 1;

   if(nuevaPaginaActual === 0) return;

   guardarPaginaActual(nuevaPaginaActual);
  }

  //definir la pagina paginaSiguiente
  const paginaSiguiente = () => {
    const nuevaPaginaActual = paginaactual + 1;

    if(nuevaPaginaActual > totalpaginas) return;

    guardarPaginaActual(nuevaPaginaActual);
  }

  return (
    <div className="container">
      <div className="jumbotron">
        <p className="lead text-center">Buscador de imágenes</p>
        <Formulario 
          guardarBusqueda={guardarBusqueda}
        />
      </div>
      <div className="row justify-content-center">
        <ListadoImagenes 
          imagenes={imagenes}
        />
        {(paginaactual === 1) ? null : (
          <button 
          type="button"
          className="bbtn btn-info mr-1"
          onClick={paginaAnterior}
          >&laquo; Anterior</button>
        )}
     {(paginaactual === totalpaginas) ? null : (
          <button 
          type="button"
          className="bbtn btn-info"
          onClick={paginaSiguiente}
          >Siguiente &raquo;</button>
     )}
      </div>
    </div>
  );
}

export default App;
