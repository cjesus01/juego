class Energia{
    constructor() {
        this.energias = [];
        this.crearEnergia();
        this.velo = 3;
    }

    //obtenemos informacion de tamaño y posicion de todos
    status(){
        return this.energias.map(energia => energia.getBoundingClientRect());
    }

    //setamos la cantidad en 1 ya que son acumulativos. Tomamos el contenedor, el piso y el tamaño y posicion. Tomamos alto y ancho del contenedor
    //recorremos para ir creando el div de energia, agregarle la clase energia como hijo del contenedor. Obtenemos posY y posX para que se random
    //le colocamos el estilo sumandole al bottom el piso para que no se creen abajo de el piso y se agrega al arreglo    
    crearEnergia = () =>{
        let cantEne = 1;
        let contenedor = document.getElementById('contenedor');
        let suelo = document.getElementById('piso');
        let piso = suelo.getBoundingClientRect();

        let alto = contenedor.offsetHeight;
        let ancho = contenedor.offsetWidth;
        for(let i = 0; i < cantEne; i++){
            let energia = document.createElement('div');
            energia.classList.add('energia');
            contenedor.appendChild(energia);

            let posY = Math.random()* (alto);
            let posX = Math.random()* (ancho);
            energia.style.bottom = (posY + piso.height) + 'px';
            energia.style.left = (posX) + 'px';
            this.energias.push(energia);
        }
    }

    //Tomamos todos los energia en un arreglo, los recorremos, tomamos la energia en particular y le agregamos la animacion. cuando termina
    //le removemos la clase
    moverEnergia() {
        let energias = document.querySelectorAll(".energia");
        for (let i = 0; i < energias.length; i++) {
            let energia = energias[i];
            energia.classList.add("energiaAnimacion");
            energia.addEventListener('animationend', () =>{
                energia.classList.remove("energiaAnimacion");
            })
        }
    }
}