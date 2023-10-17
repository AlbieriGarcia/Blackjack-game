// Funcion anonima auto invocada :: Patron Modulo

const miModulo = (() => {

    'use strict'

    let deck = [];
    let tipos = ['C','D','H','S'],
        especiales = ['A','J','K','Q'];

    let puntosJugadores = [];

    // Referencias del HTML
    const btnPedir = document.querySelector('#btnPedir'),
          btnDetener = document.querySelector('#btnDetener'),
          btnNuevo = document.querySelector('#btnNuevo');

    const divCartasjugadores = document.querySelectorAll('.divCartas'),
          puntosHTML = document.querySelectorAll('small');

    // Esta funcion inicializa el juego
    const inicializarJuego = ( numJugadores = 2 ) => {

        deck = crearDeck();
        puntosJugadores = [];

        for( let i = 0; i < numJugadores; i++) {
            puntosJugadores.push(0);
        }

        puntosHTML.forEach( elem => elem.innerText = 0);
        divCartasjugadores.forEach( elem => elem.innerHTML = '');
        
        btnPedir.disabled = false;
        btnDetener.disabled = false;

    }

    // esta funcion crea un nuevo deck

    const crearDeck = () =>{

        deck = [];

        for(let i = 2 ; i <= 10 ; i++){
            for (let tipo of tipos) {
                deck.push(i + tipo)           
            }
        }

        for (let tipo of tipos) {
            for (let especial of especiales) {
                deck.push(especial + tipo);
            }
        }

        return  _.shuffle( deck );  // el metodo _.shuffle baraja el array

    }

    // esta funcion me permite tomar una carta
    const pedirCarta = () => {

        if (deck.length === 0 ){
            throw 'No hay cartas en el deck';
        }

        return deck.pop();
    }

    // necesito sacar el valor de la carta ya que por ejemplo 2D y 2H valen lo mismo, solo quiero el 2

    const valorCarta = ( carta ) => {
        const valor = carta.substring(0, carta.length - 1); // esto me extrae el ultimo valor de un string

        // isNaN verifica si el string contiene un numero
        // el * 1 convierte el numero que es tipo str a number
            
        return ( isNaN( valor ))?
                (valor === 'A') ? 11: 10
                : valor * 1;

    }

    // turno: 0 = primer jugador y el ultimo sera la computadora
    const acumularPuntos = ( carta, turno ) => {

        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta( carta );
        puntosHTML[turno].innerText = puntosJugadores[turno];

        return puntosJugadores[turno];

    }

    const crearCarta = ( carta, turno) => {

        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/cartas/${carta}.png`;
        imgCarta.className = 'carta'
        divCartasjugadores[turno].append( imgCarta );

    }

    const determinarGanador = () => {

        const [puntosMinimos, puntosComputadora] = puntosJugadores;

        setTimeout(()=>{
            if( puntosComputadora === puntosMinimos) {
                alert('Empate!');
            } else if( puntosMinimos > 21 ){
                alert('La Computadora ganó');
            } else if(puntosComputadora > 21) {
                alert('Has ganado!!');
            } else {
                alert('La Computadora ganó')
            }
        }, 100);
    }
    // turno de la computadora

    const turnoComputadora = ( puntosMinimos ) => {

        let puntosComputadora = 0;

        do{

            const carta = pedirCarta();
            puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);

            crearCarta( carta, puntosJugadores.length - 1);


        } while( (puntosComputadora < puntosMinimos) && (puntosMinimos <= 21 ));

        determinarGanador();

    }

    // eventos

    btnPedir.addEventListener('click', () => {

        const carta = pedirCarta();
        const puntosJugador = acumularPuntos( carta, 0);

        crearCarta( carta, 0);


        if ( puntosJugador > 21 ){
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);

        } else if ( puntosJugador === 21 ){
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);
        }

    });

    btnDetener.addEventListener('click', () => {
        btnPedir.disabled = true;
        btnDetener.disabled = true;

        turnoComputadora( puntosJugadores[0] );
    });

    btnNuevo.addEventListener('click', () => {

        inicializarJuego();

    });

    // como esta funcion auto invocada no se puede ver, y es lo que quiero que nadie pueda manipular el codigo por
    // fuera, pero aveces quiero que ciertas cosas las personas si tengan acceso y para eso sirve esto:

    return {
        nuevoJuego: inicializarJuego
    }


})();
