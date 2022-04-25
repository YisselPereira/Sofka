window.onload = function(){

    let preguntas = [];
    let jugador;
    let nivel = 1;
    let preguntaActual;

    
    cargarPreguntas();
    ocultarElemento("trivia");

    function ocultarElemento(id){
        document.getElementById(id).style.display = "none";
    }
    function mostrarElemento(id){
        document.getElementById(id).style.display = "";
    }

    function crearJugador(){
        let nombre = document.getElementById("jugador").value;
        jugador = new Jugador(nombre);
    }

    function cargarPreguntas(){
        // Recorremos las preguntas 
        // DATA viene del archivo db/data.js
        DATA.forEach(pregunta => {
            // Creamos una instancia de pregunta y la almacenamos en memoria
            let preg = new Pregunta(pregunta.categoria,pregunta.texto,pregunta.correcta,pregunta.opciones);
            preguntas.push(preg);
        });
    }

    function iniciarJuego(){
        nivel = 1;
        crearJugador();
        nuevaRonda();
    }

    function seleccionarPregunta(){
        // Obtenemos las preguntas de la categoria actual
        let pregs = preguntas.filter(preg => nivel == preg.categoria);
        let numero = Math.floor(Math.random()*pregs.length);
        return pregs[numero];
    }

    function mezclarOpciones(pregunta){
        let opciones = [];
        opciones.push(pregunta.correcta);
        opciones.push(pregunta.opciones[0]);
        opciones.push(pregunta.opciones[1]);
        opciones.push(pregunta.opciones[2]);
        return opciones.sort(() => Math.random() - 0.5);
    }

    function mostrarPregunta(texto,opciones){
        document.getElementById("preg").textContent = texto;
        document.getElementById("op1").textContent = opciones[0];
        document.getElementById("op2").textContent = opciones[1];
        document.getElementById("op3").textContent = opciones[2];
        document.getElementById("op4").textContent = opciones[3];
    }

    function nuevaRonda(){
        // Seleccionamos la pregunta aleatoriamente
        let pregunta = seleccionarPregunta();
        preguntaActual = pregunta;
        // Obtenemos las opciones y las mezclamos
        let opciones = mezclarOpciones(pregunta);
        // Mostramos la pregunta
        mostrarPregunta(pregunta.texto,opciones);

        document.getElementById("nivel").textContent = "Nivel: "+nivel;
        document.getElementById("puntos").textContent = "Puntos: "+jugador.puntaje;
    }

    function finalizarJuego(){
        // Obtenemos los jugadores del localStorage
        let jugadores = localStorage.getItem('jugadores');
        if(!jugadores){
            jugadores = [];
        }else{
            jugadores = JSON.parse(jugadores);
        }
        // Agregamos el nuevo resultado
        jugadores.push(jugador);
        // Volvemos a guardar en localStorage
        localStorage.setItem('jugadores',JSON.stringify(jugadores));
    }

    function evaluarPregunta(respuesta){
        // Si selecciono la respuesta correcta
        if(respuesta == preguntaActual.correcta){
            // Agregamos los puntos correspondientes
            jugador.puntaje += 100 * nivel;
            // Si el nivel es el 5 entonces finaliza el juego
            if(nivel == 5){
                finalizarJuego();
                mostrarElemento("inicio");
                ocultarElemento("trivia");
            }else{
                // Subimos de nivel y cargamos una nueva pregunta
                nivel++; 
                nuevaRonda();
            }
        }else{
            nuevaRonda();
        }
    }

    document.getElementById("Iniciar").addEventListener("click",function(){
        iniciarJuego();
        mostrarElemento("trivia");
        ocultarElemento("inicio");
    });


    document.getElementById("op1").addEventListener("click",function(){
        evaluarPregunta(this.textContent);
    });
    document.getElementById("op2").addEventListener("click",function(){
        evaluarPregunta(this.textContent);
    });
    document.getElementById("op3").addEventListener("click",function(){
        evaluarPregunta(this.textContent);
    });
    document.getElementById("op4").addEventListener("click",function(){
        evaluarPregunta(this.textContent);
    });

    document.getElementById("finalizar").addEventListener("click",function(){
        finalizarJuego();
        mostrarElemento("inicio");
        ocultarElemento("trivia");
    })
}