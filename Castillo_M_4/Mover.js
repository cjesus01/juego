class Mover extends Personaje{

    constructor(){
        super();
        this.personaje = document.getElementById('personaje');
        this.posicion = {
            left : this.personaje.offsetLeft,
            top : this.personaje.offsetTop
        };
        this.velo = 20;
    }

    //obtenemos informacion de tamaño y posicion
    status() {
        return this.personaje.getBoundingClientRect();
    }

    statusSuelo(){
        return this.piso.getBoundingClientRect();
    }

    //obtenemos la direccion que viene por parametro y tomamos tamaño y posicion comparamos a cual corresponde y controlamos que NO salga de 
    //los margenes y va a modificar posicion.
    mover(direccion){
        let per = this.personaje.getBoundingClientRect();

        if(direccion === "ArrowRight" ){
            if( per.left + this.velo <= 1320){
                this.posicion.left += this.velo;
            }
        }
        else if(direccion === "ArrowLeft"){
            if( per.left + this.velo >= this.margenLados()){
                this.posicion.left -= this.velo;    
            }
        }
        else if(direccion === "ArrowUp"){
            if(this.margenSupe() <= (per.top + this.velo + 636)){
                this.posicion.top -= this.velo;
            }
        }
        
        else if(direccion === "ArrowDown"){
            if(this.suelo() >= per.bottom + this.velo){
                this.posicion.top += this.velo;     
            }  
        }
        this.modificarPosicion();
    }

    //Modifica en altura y ancho la posicion del personaje
    modificarPosicion() {
        this.personaje.style.left = `${this.posicion.left}px`;
        this.personaje.style.top = `${this.posicion.top}px`;
    }

    //Toma el contenedor y obtiene le alto, lo retorna
    margenSupe(){
        this.alto = document.getElementById('contenedor');
        let altoo = this.alto.offsetHeight;

        return altoo;
    }

    //Toma el ancho del contenedor y lo retorna 
    margenLados(){
        this.ancho = document.getElementById('contenedor');
        let anchoo = this.ancho.offsetLeft;

        return anchoo;
    }

    //Toma los valores del suelo, le suma 10 para mas presicion.
    suelo(){
        this.piso = document.getElementById('piso');
        let top = this.piso.offsetTop;

        return top + 10;
    }
}