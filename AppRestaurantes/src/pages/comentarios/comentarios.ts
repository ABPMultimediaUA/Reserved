import { RestaurantePage } from './../restaurante/restaurante';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestaurantProvider } from '../../providers/restaurant/restaurant';


@IonicPage()
@Component({
  selector: 'page-comentarios',
  templateUrl: 'comentarios.html',
})
export class ComentariosPage {

  denunciarcomentario={usuarioU: '', restauranteR: '', comentarioC: ''}

  constructor(public navCtrl: NavController, public navParams: NavParams, public restaurantService:RestaurantProvider) {
  }

  denunciar_comentario(comentario,usuario){
    this.denunciarcomentario.usuarioU=usuario;
    this.denunciarcomentario.restauranteR=this.restaurantService.session.idRestaurante;
    this.denunciarcomentario.comentarioC=comentario;

    this.restaurantService.denunciar_comentario(this.denunciarcomentario)
    .subscribe(()=>{
      this.restaurantService.cambiar_estado_denunciado(comentario);
      if(this.restaurantService.denunciada==true){
        this.navCtrl.push(RestaurantePage);
        this.restaurantService.denunciada=false;
      }
        
    });;
    
  }

}
