"use strict";
//definimos las clases
let mover = new Mover();
let enemigo = new Enemigo();
let energia = new Energia();

//definimos las variables que usamos
let crearEnemigoIntervalo;
let moverEnemigosIntervalo;
let moverCombustible;
let crearCombustible;
let contador;
let cargarIntervalo;
let cantVidas = 3;
let colision = false;
let juegoTerminado = false;
let colisionReciente = false;
let recienCarga = false;
let energiaReducida = false;
let tiempoTotal = 60;
let tiempoDeCarga = 10;
let cargar = 0
let menu = document.querySelector('#menu');

//Tomamos clases y le asigamos el evento click llendo cada uno a una a la funcion que corresponde
document.querySelector('.jugar').addEventListener('click', darlePlay);
document.querySelector('.instrucciones').addEventListener('click', mostrarInstruccion);
document.querySelector('.volver').addEventListener('click', volverMenuPrincipal)

//Tomamos el id que pertenece a la instrucciones y lo oculatamos para volver al menu principal, removiendo y agregando los atributos que hacen falta
function volverMenuPrincipal(){
   let instruccion = document.querySelector('#instru');
   instruccion.classList.remove('info');
   instruccion.classList.add('infoOculto');
}

//Tomamos el id que pertenece al boton instrucciones y lo oculatamos para ir a las instrucciones
//removiendo y agregando los atributos que hacen falta
function mostrarInstruccion(){
   let instruccion = document.querySelector('#instru');
   instruccion.classList.remove('infoOculto');
   instruccion.classList.add('info');
}

//Tomamos el id que pertenece al boton play y lo oculatamos para comenzar a jugar
//removiendo y agregando los atributos que hacen falta
function darlePlay(){
   menu.classList.remove('empezar');
   menu.classList.add('menuOculto');
   gameLoop();
}

//agregar un evento que se ejecuta cada vez que se presiona una tecla en el teclado, si el juego esta NO terminado ingresa en la funcion mover
//de la clase mover. Se controla que el juego este terminado para evitar que se mueva finalizada la partida
document.addEventListener('keydown', (e)=>{
   if(!juegoTerminado){
      mover.mover(e.key);
   }   
})

//Iniciamos el juego, con la funcion que controla el ciclo del juego y
// con crear enemigo y energia los cuales van a sus respectivas clases se crean los mencionados cada 5 segundo.
//mover enemigo y energia desplaza a estos por el juego, con el tiempo dado. 
//creamos un intervalo el cual reduce el tiempo y controla cada 1 segundo si el tiempo de carga de la energia se vuelve 0 
//se dirige a la funcion modificar energia (EXPLICACION MAS ABAJO), si es mayor a 0 se dirige a la funcion detectar combustible(EXPLICACION MAS ABAJO)
//las funciones finales inicia la detección continua de colisiones con los enemigos o combustibles, asegurando que el juego continuamente 
//verifica si el personaje colisiona con uno de estos.
function gameLoop(){
   iniciarJuego();
   crearEnemigoIntervalo = setInterval(enemigo.crearEnemigo, 5000);
   moverEnemigosIntervalo = setInterval(enemigo.moverEnemigos, 1000);
   crearCombustible = setInterval(energia.crearEnergia, 5000);
   moverCombustible = setInterval(energia.moverEnergia, 2000);
   cargarIntervalo = setInterval(()=>{
      tiempoDeCarga--;
      if(tiempoDeCarga > 0){
         detectarCombustible();
      }
      if(tiempoDeCarga === 0){
         tiempoDeCarga = 5;
         modificarEnergia();
      }
   }, 1000);
   detectarColicionContinua();
   detectarColicionCombustible();
}

//Inicializamos el tiempo faltante con valor del tiempo temporal y configuramos un intervalo que se ejecuta cada segundo.
//restamos el tiempo y actualizamos el contenido con el nuevo valor del tiempo faltante, si el tiempo llega a 0, se detiene el intervalo
//obtenemos la clase final y agregamos y removemos las clases necesarias para mostrar el mensaje determinado.
//se dirige a la funcion terminar juego (EXPLICADO MAS ABAJO);
function iniciarJuego(){
   let tiempoFaltante = tiempoTotal;
   contador = setInterval(function(){
   tiempoFaltante--;
   document.getElementById('tiempo').textContent = tiempoFaltante;

      if(tiempoFaltante === 0){
         clearInterval(contador);
         let juegoFinalizado = document.querySelector('.final'); 
         juegoFinalizado.classList.remove('final');
         juegoFinalizado.classList.add('finalOcultado');
         terminarJuego(); 
      }
   }, 1000);
}

//Funciones creadas para detectar colisiones continuamente en un juego mientras el juego no haya terminado, si el juego NO esta terminado
//va a la funcion detectar colision y llama continuamente a requestAnimationFrame en un bucle, permitiendo la detección continua de colisiones 
//mientras el juego esté en curso
function detectarColicionContinua() {
   if (!juegoTerminado) {
      detectarColicion();
      requestAnimationFrame(detectarColicionContinua);
   }
}

function detectarColicionCombustible() {
   if (!juegoTerminado) {
      detectarCombustible();
      requestAnimationFrame(detectarColicionCombustible);
   }
}

//Se agrega al documento keyup  y tomamos el enemigo. Guardamos en left un objeto que contiene los estilos y comparamos que si el evento 
//corresponde a la tecla apretada, llama a la funcion detectar colicion y detectar combustible, tomando un elemento y cambiando su posicion
//a fin de poder ver si los valores coinciden, ya que los mismo son diferente. 
document.addEventListener('keyup', (e) => {
   let ene = document.querySelector('.enemigo');

   let left = parseInt(window.getComputedStyle(ene).left, 10);
   
   if (e.key === 'ArrowRight') {
       ene.style.left = `${left - 200}px`;
       detectarColicion();
       detectarCombustible();
   }
   if (e.key === 'ArrowLeft') {
       ene.style.left = `${left + 200}px`;
       detectarColicion();
       detectarCombustible();
   }
   if(e.key === 'ArrowUp'){
      ene.style.top = `${top + 100}px`;
      detectarColicion();
      detectarCombustible();
   }
   if(e.key === 'ArrowDown'){
      ene.style.top = `${top - 100}px`;
      detectarColicion();
      detectarCombustible();
   }
});

//Tomamos todos los enemigos que existen y el personaje, guardamos el tamaño y posicion del elemento. Recorremos el arreglo de enemigos guardado
//y tambien guardamos en e_pos el tamaño y posicion del elemento. Comparamos si los valores se cruzan, de dar true, ingresa y verifica que NO
//haya habiado una colision reciente a fin de evitar que nos descuente 2 vidas en una colision. Va a la funcion contar vidas.
function detectarColicion() {
   let ene = document.querySelectorAll('.enemigo');
   let perso = document.querySelector('#personaje');

   let p_pos =  perso.getBoundingClientRect();
   
   ene.forEach(enemigo => {
      let e_pos = enemigo.getBoundingClientRect()
      if ( e_pos.left <= p_pos.right && e_pos.right >= p_pos.left && e_pos.bottom >= p_pos.top && e_pos.top <= p_pos.bottom) {
         if(!colisionReciente){
            colision = true;
            contarVidas(colision);
         }
      }
   });
}

//Tomamos todos los combustibles que existen y el personaje, guardamos el tamaño y posicion del elemento. Recorremos el arreglo de combustible guardado
//y tambien guardamos en c_pos el tamaño y posicion del elemento. Comparamos si los valores se cruzan, de dar true, ingresa y contamos, ya que para
//modificar el valor necesitamos obtener 2 combustibles. Lo guardamos en cargar y remueve la animacion a fin de dar efecto de que lo absorvio.
//Si ingresa cargar vuelve a 0 y va a la funcion cargar energia.
function detectarCombustible(){
   let combu = document.querySelectorAll('.energia');
   let perso = document.querySelector('#personaje');

   let p_pos = perso.getBoundingClientRect();

  combu.forEach(combustible =>{
      let c_pos = combustible.getBoundingClientRect();
      if(c_pos.left <= p_pos.right && c_pos.right >= p_pos.left && c_pos.bottom >= p_pos.top && c_pos.top <= p_pos.bottom){
            cargar++;
            combustible.classList.remove('energiaAnimacion');
            if(cargar === 2){  
               cargar = 0; 
               cargarEnergia();
            }
      }
   });
}

//Recibimos el intervalo guardado y guardamos la energia a fin de cambiar la imagen. Recorremos que si se una ingresa en un if y cambia el valor
//resetea el intervalo y agrega y elimina la clase, la cual cambia la foto de la barra de energia. En caso de ir a ser vacia 
//ira a la funcion terminar juego.
function modificarEnergia(cargarIntervalo){
   let energia = document.querySelector('#energia');

   if(energia.classList.contains('mediaLlena')){
      energia.classList.remove('mediaLlena');
      energia.classList.add('energiaMedia');
      clearInterval(cargarIntervalo);
   } else if(energia.classList.contains('energiaMedia')){
      energia.classList.remove('energiaMedia');
      energia.classList.add('casiVacia');
      clearInterval(cargarIntervalo);
   } else if(energia.classList.contains('casiVacia')){
      energia.classList.remove('casiVacia');
      energia.classList.add('vacia');
      juegoTerminado = true;
      terminarJuego();
   } else if(energia.classList.contains('energiaLlena')){
      energia.classList.remove('energiaLlena');
      energia.classList.add('mediaLlena');
      clearInterval(cargarIntervalo);
   } 
}

//Guardamos la energia a fin de cambiar la imagen. Recorremos que si se una ingresa en un if y cambia el valor
//agrega y elimina la clase, la cual cambia la foto de la barra de energia.
function cargarEnergia(){
   let energia = document.querySelector('#energia');

   if(energia.classList.contains('casiVacia')){
      energia.classList.remove('casiVacia');
      energia.classList.add('energiaMedia');
      return;
   }
   if(energia.classList.contains('energiaMedia')){
      energia.classList.remove('energiaMedia');
      energia.classList.add('mediaLlena');
      return;
   }
   if(energia.classList.contains('mediaLlena')){
      energia.classList.remove('mediaLlena');
      energia.classList.add('energiaLlena');
      return;
   }
}

//Tremos colision y seleccionamos las vidas. Si la colision es true modificamos el valor de colicion resiente a true y lo colocamos en un if
//creamos un set time out el cual cambia el valor de la colision a false y espera 2 segundos para volver a tomar otra colision a fin de evitar
//que en una sola colision nos quedemos sin vidas. Asi mismo descuenta las vidas y va a acutalizando la cantidad de vidas.
//Si no hay mas vidas el juego terminado pasa a true  y va a funcion terminar juego.
function contarVidas(colision){
   let vida = document.querySelector('#vida');
   if(colision){
      colisionReciente = true;
      if(colisionReciente ){
         setTimeout(() => colisionReciente = false, 2000);
      }
      cantVidas -= 1;
      if(cantVidas == 2){
         vida.classList.remove('vidasTotal');
         vida.classList.add('vidasMenosUno');
      }
      if(cantVidas == 1){
         vida.classList.remove('vidasMenosUno');
         vida.classList.add('vidasMenosDos');
      }
      if(cantVidas == 0){
         vida.classList.remove('vidasMenosDos');
         vida.classList.add('sinVidas');
         juegoTerminado = true;
         terminarJuego();
      }
   }
}

//Resetean todos los intervalos y toma los valores moviles, como asi tambien combustible y enemigos. cambia los valores a fin de quitar la animacion
//y en el caso de enemigo y combustible se hace lo mismo con todos los que se encuentran en pantalla.
//Luego si el juago terminado es true se cambia tambien la clase del personaje para cambiar la imagen y se va a la funcion game over
//en el else se toma cuando ganamos remueve personaje a fin de dejarlo quieto y toma el boton reiniciar con evento click y va a la funcion
//reiniciar juego.
function terminarJuego(){
   clearInterval(crearEnemigoIntervalo);
   clearInterval(moverEnemigosIntervalo);
   clearInterval(contador);
   clearInterval(cargarIntervalo);
   clearInterval(crearCombustible);
   clearInterval(moverCombustible);

   let personaje = document.querySelector('#personaje');
   let enemi = document.querySelectorAll('.enemigoAnimacion');
   let paisaje = document.querySelector('#paisaje');
   let suelo = document.querySelector('#piso');
   let combu = document.querySelectorAll('.energiaAnimacion');

   enemi.forEach(enemigo =>{
         enemigo.classList.remove('enemigoAnimacion');
         enemigo.classList.add('enemigoPausado');
   })

   combu.forEach(combus =>{
      combus.classList.remove('energiaAnimacion');
      combus.classList.add('energiaPausado');
   })

   paisaje.classList.remove('paisaje');
   paisaje.classList.add('paisajePausado');

   suelo.classList.remove('piso');
   suelo.classList.add('pisoPausado');
   
   if(juegoTerminado){
      personaje.classList.remove('personaje');
      personaje.classList.add('personajePerdio');
      gameOver();
   }
   else{
      personaje.classList.remove('personaje');
      document.querySelector('#reiniciar1').addEventListener('click', reiniciarJuego);
   }
}

//En caso de perder muestra el cartel de game over agregando y sacando con las cales y luego tomando reiniciar donde agrega evento click
//y va a reiniciar el juego
function gameOver(){
   let terminado = document.querySelector('#juegoTerminado');
   terminado.classList.remove('terminado');
   terminado.classList.add('terminadoOculto');
   document.querySelector('#reiniciar').addEventListener('click', reiniciarJuego);
}

// Refresca el juego iniciandolo de 0
function reiniciarJuego(){
   location.reload();
}



