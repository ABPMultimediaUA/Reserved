import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { RestaurantsProvider } from '../restaurants/restaurants';
import { Storage } from '@ionic/storage';


@Injectable()
export class UsersProvider {

  login_correcto=false;
  modificar_perfil=false;
  modificar_reserva= false;
  pinmodi=false;
  session:any;
  nuevopedido:any;
  logueado=false;
  nuevareserva = false;
  nuevopin=false;
  pedidos=false;
  idpedido=false;

  //Guardamos la info del usuario que se acaba de loguear.
  infouser:any;
  pininfo:any;
  reservaactual:any;
  reservapinactual:any;
  pedidoactual:any;
  reservasusuario:any;
  reservation:any;
  reservaconfirmada:any;
  reservafutura:any;
  botonhistorial:boolean=false;
  botonpendientes:boolean=false;

  constructor(public http: HttpClient, private alertCtrl:AlertController, public storage:Storage) {

  }

  add_user(data){
    let url="api/adduser";

    return this.http.post(url, data, {responseType: 'json'} )
      .map(resp=>{
        //si entra, significa que el nick ya esta siendo utilizado por otro usuario.
        if(resp==='Nick no disponible'){
          this.alertCtrl.create({
            title:"Error",
            subTitle:"Nick ya en uso",
            buttons:["OK"]
          }).present();
        }else{
          console.log("Usuario creado");
          this.logueado=true;
          this.login_correcto=true;
          //guardamos la informacion del usuario
          this.session=resp;
          //Guardar en el storage
          this.storage.set('idUsuario', this.session.idUsuario);
          this.storage.set('token', this.session.token);
        };

      })

  }


  login_user(data){
    let url="api/login";

    return this.http.post(url,data,{responseType:'json'})
      .map(resp=>{
        //si entra, significa que el nick no existe.
        if(resp==='Login incorrecto'){
          this.alertCtrl.create({
            title:"Error",
            subTitle:"Nick y/o contraseña incorrectos",
            buttons:["OK"]
          }).present();
        }else if(resp==='Login incorrecto'){
          this.alertCtrl.create({
            title:"Error",
            subTitle:"Nick y/o contraseña incorrectos",
            buttons:["OK"]
          }).present();
        }else{
          console.log("Login correcto");
          this.logueado=true;
          this.login_correcto=true;
          //guardamos la informacion del usuario
          this.session=resp;
          //Guardar en el storage
          this.storage.set('idUsuario', this.session.idUsuario);
          this.storage.set('token', this.session.token);


        }
      })
  }

  user_profile(id,token){
    let url="api/users/";
    this.http.get(url+id,{headers: {'token-acceso':token}}).subscribe(data=>{
      this.infouser=data;
    });

  }

  mis_reservas(){
    let url="api/users/";
    this.storage.get('idUsuario').then((val) => {
      this.storage.get('token').then((val2) => {
        this.http.get(url+val+"/reservations",{headers: {'token-acceso':val2}}).subscribe(data=>{
          this.reservasusuario=data;
          console.log(this.reservasusuario);
        });
      });
    });

  }

  modify_user(data){
    let url="api/users/";
    return this.http.put(url+this.session.idUsuario, data, {headers: {'token-acceso':this.session.token} , responseType: 'json'} )
      .map(resp=>{
          console.log("Perfil Actualizado");
          this.modificar_perfil=true;

      })

  }

  aforoaux:any;

  comprobar_aforo(data){
    let url = "api/users/comprobaraforo";
    return this.http.post(url,data, {headers: {'token-acceso':this.session.token} , responseType:'json'})
    .map(resp=>{
      this.aforoaux=resp;
      if(this.aforoaux[0]==undefined){
        this.nuevareserva = true;
      }else{
        if(this.aforoaux[0].aforo-data.comensales<0){
          this.alertCtrl.create({
            title:"Error",
            subTitle:"Aforo completo, escoja otro dia",
            buttons:["OK"]
          }).present();
        }else{
          this.nuevareserva = true;
        }
      }

    })

  }

  add_reserva(data){
    let url = "api/users/";
    return this.http.post(url+this.session.idUsuario+"/reservations",data, {headers: {'token-acceso':this.session.token} , responseType:'text'})
    .map(resp=>{
      console.log("Reserva nueva");
      this.mis_reservas();
      
    })
  }

  //id del pedido dada una reserva
  pedido_actual(id){
    let url = "api/users/";
    this.http.get(url+this.session.idUsuario+"/reservations/orders/"+id,{headers:{'token-acceso':this.session.token}})
    .subscribe(data=>{
      this.pedidoactual =data;
      this.reservation=this.pedidoactual[0].idPedido;
      this.idpedido=true;
      console.log(this.idpedido);
    })
  }


  add_pedido(data){
    let url = "api/restaurants/orders/";
    return this.http.post(url+this.reservation+"/orderproducts",data, {headers: {'token-acceso':this.session.token} , responseType:'text'})
    .map(resp=>{
      console.log(this.reservation);
      console.log("Pedido enviado");
      this.nuevopedido = true;
    })

  }
  modify_reserva(data){
    let url="api/users/";
    return this.http.put(url+this.session.idUsuario+"/reservation/"+this.reservaactual, data, {headers: {'token-acceso':this.session.token} , responseType: 'json'} )
      .map(resp=>{
        this.user_profile(this.session.idUsuario, this.session.token);
          console.log("Reserva actualizada");
          this.modificar_reserva=true;

      })

  }
  eliminar_reserva(id,data){
    let url="api/users/";
    this.http.put(url+this.session.idUsuario+"/reservations/"+id,data, {headers: {'token-acceso':this.session.token}}).subscribe(data=>{
      this.user_profile(this.session.idUsuario, this.session.token);
    });

  }
  reservasconfirmadas(){
    let url="api/users/";
    this.http.get(url+this.session.idUsuario+"/reservations/confirmadas", {headers: {'token-acceso':this.session.token} , responseType: 'json'} )
      .subscribe(data=>{
          this.reservaconfirmada=data;
          console.log(this.reservaconfirmada);
      })
  }
  add_pin(data){
    let url = "api/users/addpin";
    return this.http.post(url,data, {headers: {'token-acceso':this.session.token} , responseType:'json'})
    .map(resp=>{
      if(resp==='Pin incorrecto'){
        this.alertCtrl.create({
          title:"Error",
          subTitle:"Pin incorrecto",
          buttons:["OK"]
        }).present();
      }else{
        console.log("Pin correcto");
        console.log(resp);
        this.nuevopin = true;
        this.pininfo= resp;
      }
    })
  }
  reservasfuturas(){
    let url="api/users/";
    this.http.get(url+this.session.idUsuario+"/reservations/future", {headers: {'token-acceso':this.session.token} , responseType: 'json'} )
      .subscribe(data=>{
          this.reservafutura=data;
          console.log(this.reservafutura);
      })
  }
  modificarpin(id,data){
      let url="api/users/pin/";
      return this.http.put(url+id, data, {headers: {'token-acceso':this.session.token} , responseType: 'json'} )
        .map(resp=>{
            console.log("Usuario actualizada");
            this.pinmodi=true;
  
        })
  
    }
  }

 
