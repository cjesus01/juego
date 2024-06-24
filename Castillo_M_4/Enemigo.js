class Enemigo{
    constructor() {
        this.enemigos = [];
        this.crearEnemigo();
        this.velo = 5;
    }

    //obtenemos informacion de tamaño y posicion de todos
    status(){
        return this.enemigos.map(enemigo => enemigo.getBoundingClientRect());
    }

    //setamos la cantidad en 1 ya que son acumulativos. Tomamos el contenedor, el piso y el tamaño y posicion. Tomamos alto y ancho del contenedor
    //recorremos para ir creando el div de enemigos, agregarle la clase enemigo como hijo del contenedor. Obtenemos posY y posX para que se random
    //le colocamos el estilo sumandole al bottom el piso para que no se creen abajo de el piso y se agrega al arreglo         
    crearEnemigo = () =>{
        let cantEne = 1;
        let contenedor = document.getElementById('contenedor');
        let suelo = document.getElementById('piso');
        let piso = suelo.getBoundingClientRect();

        let alto = contenedor.offsetHeight;
        let ancho = contenedor.offsetWidth;
        for(let i = 0; i < cantEne; i++){
            let enemigo = document.createElement('div');
            enemigo.classList.add('enemigo');
            contenedor.appendChild(enemigo);

            let posY = Math.random()* (alto);
            let posX = Math.random()* (ancho);
            enemigo.style.bottom = (posY + piso.height) + 'px';
            enemigo.style.left = (posX) + 'px';
            this.enemigos.push(enemigo);
        }
    }

    //Tomamos todos los enemigos en un arreglo, los recorremos, tomamos el enemigo en particular y le agregamos la animacion. cuando termina
    //le removemos la clase
    moverEnemigos() {
        let enemigos = document.querySelectorAll(".enemigo");
        for (let i = 0; i < enemigos.length; i++) {
            let enemigo = enemigos[i];
            enemigo.classList.add("enemigoAnimacion");
            enemigo.addEventListener('animationend', () =>{
                enemigo.classList.remove("enemigoAnimacion");
            })
        }
    }
}
