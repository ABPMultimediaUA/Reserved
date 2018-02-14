import { UsersProvider } from './../providers/users/users';
import { AllrestaurantsPage } from './../pages/allrestaurants/allrestaurants';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { RegistroPage } from '../pages/registro/registro';
import { PerfilPage } from '../pages/perfil/perfil';
import { LoginPage } from '../pages/login/login';
import { BusquedaPage } from '../pages/busqueda/busqueda';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';

import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  restaurantes = AllrestaurantsPage;
  registro = RegistroPage;
  perfil=PerfilPage;
  busqueda = BusquedaPage;
  rootPage:any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,private menuCtrl:MenuController,private alertCtrl:AlertController, public userservice:UsersProvider, public storage:Storage) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  openPage( pagina:any ){

    if(this.userservice.logueado==true){
      this.rootPage=pagina;
      this.menuCtrl.close();
    }else{
      this.alertCtrl.create({
        title:"Error",
        subTitle:"No tienes acceso a este sitio",
        buttons:["OK"]
      }).present();
    }

  }

  closeSession(){
    this.userservice.logueado=false;
    this.userservice.login_correcto=false;
    this.storage.set('idUsuario',"null");
    this.storage.set('token',"null");
    this.rootPage=LoginPage;
    this.menuCtrl.close();

  }

}
