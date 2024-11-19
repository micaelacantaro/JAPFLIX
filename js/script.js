//obtengo los datos
fetch('https://japceibal.github.io/japflix_api/movies-data.json')
    .then(response => response.json())
    .then(data => {
        let peliculasFiltradas = data;
        //función para buscar las películas filtradas
        function buscar() {
            const searchText = document.getElementById('inputBuscar').value.toLowerCase(); 
            if(searchText !== ''){
                peliculasFiltradas = data.filter(pelicula => {
                    const title = pelicula.title.toLowerCase();
                    const tagline = pelicula.tagline.toLowerCase();
                    const overview = pelicula.overview.toLowerCase();
                    const genres = pelicula.genres.map(g => g.name.toLowerCase());

                    return title.includes(searchText) ||
                        tagline.includes(searchText) ||
                        overview.includes(searchText) ||
                        genres.some(genero => genero.includes(searchText));
                });
                mostrarPeliculas(peliculasFiltradas);
            }
        }
        //función que muestra la lista de películas filtradas
        function mostrarPeliculas(peliculas) {
            const lista = document.getElementById('lista');
            lista.innerHTML = ''; 

            peliculas.forEach(pelicula => {
                const li = document.createElement('li');
                li.classList.add('list-group-item');
                li.classList.add('colorLista');
                // Añadir data-bs-toggle y data-bs-target para abrir el offcanvas para el contenedor superior
                li.setAttribute('data-bs-toggle', 'offcanvas');
                li.setAttribute('data-bs-target', '#offcanvasTop');

                const contenidoPelicula = `
                    <h5>${pelicula.title}</h5> 
                    <p><em>${pelicula.tagline}</em></p>
                    <p>${mostrarEstrellas(pelicula.vote_average)}</p>
                `;

                li.innerHTML = contenidoPelicula;
                li.addEventListener('click', () => mostrarDetallesPelicula(pelicula));

                lista.appendChild(li);
            });
        }
        
        //función para mostrar la calificación en forma de estrellas
        function mostrarEstrellas(voteAverage) {
            const maxStars = 5;
            const estrellasLlenas = Math.round(voteAverage / 2); 
            let estrellasHTML = '';

            for (let i = 0; i < estrellasLlenas; i++) {
                estrellasHTML += '<span class="fa fa-star checked"></span>'; 
            }

            for (let i = estrellasLlenas; i < maxStars; i++) {
                estrellasHTML += '<span class="fa fa-star"></span>'; 
            }

            return estrellasHTML;
        }

        // función para mostrar los datos de la película en el contenedor superior
        function mostrarDetallesPelicula(pelicula) {
            // Actualizar el contenido del offcanvas con los detalles de la película
            document.getElementById('titlePelicula').textContent = pelicula.title;
            document.getElementById('overviewPelicula').textContent = pelicula.overview;
            const generos = pelicula.genres.map(genero => genero.name).join(', ');
            document.getElementById('generosPelicula').textContent = generos;
            const añoLanzamiento = new Date(pelicula.release_date).getFullYear();
            const duracion = `${pelicula.runtime} minutos`;
            const presupuesto = `$${pelicula.budget.toLocaleString()}`;
            const ganancias = `$${pelicula.revenue.toLocaleString()}`;

            // Crear la lista de datos extra
            const moreInfoList = `
            <li><strong>Año de Lanzamiento:</strong> ${añoLanzamiento}</li>
            <li><strong>Duración:</strong> ${duracion}</li>
            <li><strong>Presupuesto:</strong> ${presupuesto}</li>
            <li><strong>Ganancias:</strong> ${ganancias}</li>`;

            // Insertar los datos extra en el dropdown del offcanvas
            document.getElementById('moreInfo').innerHTML = moreInfoList;
        }


        document.getElementById('btnBuscar').addEventListener('click', buscar);

    })
    .catch(error => console.error('Error al cargar el archivo JSON:', error));





