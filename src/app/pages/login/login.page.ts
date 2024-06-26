import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { LoadingController, Platform, ToastController } from '@ionic/angular';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  formularioLogin: FormGroup;
  email: string = '';
  password: string = '';
  emailRecuperacion: string = '';
  mostrarFormulario: boolean = false;
  shouldShowMenu
  constructor(
    private router: Router,
    private authservice: AuthService,
    private platform: Platform,
    private afAuth: Auth,
    private toastController: ToastController,
    private loadingCtrl: LoadingController,

  ) {
    // Configuración de formulario
    this.formularioLogin = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  
  async login() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
      duration: 1500,
    });
    const {email, password} = this.formularioLogin.value
    
    await loading.present()
    this.authservice
      .login(email, password)
      .then((res) => {
        console.log(res);
        this.router.navigate(['/home']);
        // this.platform.ready().then(() => {
        //   setTimeout(() => {
        //     window.location.reload();
        //   }, 200); // Delay de 2000 milisegundos (2 segundos)
        // });
      })
      .catch((err) => console.log(err));
  }

  loginAsGuest() {
    this.authservice
      .loginAsGuest()
      .then((res) => {
        console.log(res);
        this.router.navigate(['/home']);
      })
      .catch((err) => console.log(err));
  }

  loginWithGoogle() {
    this.authservice.signInWithGoogle().then((res) => {
      this.router.navigate(['/home']);
    });
  }

  loginWithFacebook() {
    this.authservice.signInWithFacebook().then((res) => {
      this.router.navigate(['/home']);
    });
  }

  forgotPassword() {
    this.mostrarFormulario = true;
  }

  sendResetEmail() {
    if (!this.emailRecuperacion) {
      console.error('Por favor, ingrese un correo electrónico válido');
      // Puedes mostrar un mensaje de error aquí si lo deseas
      return;
    }

    this.authservice
      .forgotPassword(this.emailRecuperacion)
      .then(() => {
        console.log('Correo de restablecimiento enviado');
        // Puedes mostrar un mensaje de éxito aquí si lo deseas
        this.mostrarFormulario = false; // Ocultar el formulario después de enviar el correo
      })
      .catch((err) => {
        console.error('Error al enviar el correo de restablecimiento:', err);
        // Puedes mostrar un mensaje de error aquí si lo deseas
      });
  }

  onClick() {
    this.router.navigate(['/registro']);
  }

  ngOnInit() {}



  async presentToast(position: 'top' | 'middle' | 'bottom', mensaje, duration) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: duration,
      position: position,
    });

    await toast.present();
  }
}
