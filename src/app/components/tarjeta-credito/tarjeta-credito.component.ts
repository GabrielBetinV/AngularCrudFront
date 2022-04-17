import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { TarjetaService } from 'src/app/services/tarjeta.service';

@Component({
  selector: 'app-tarjeta-credito',
  templateUrl: './tarjeta-credito.component.html',
  styleUrls: ['./tarjeta-credito.component.css']
})
export class TarjetaCreditoComponent implements OnInit {

  listTarjeta: any[] = [];
  accion= 'Agregar ';
  id: number | undefined;

    form: FormGroup;

  constructor(private fb:FormBuilder,private toastr: ToastrService, private _tarjetaServices:TarjetaService) {



    
    
      this.form = this.fb.group({

          titular: ['', Validators.required],
          numeroTarjeta: ['',[Validators.required, Validators.maxLength(16), Validators.minLength(16)]],
          fechaExpiracion: ['',[Validators.required, Validators.maxLength(5), Validators.minLength(5)]],
          cvv: ['',[Validators.required, Validators.maxLength(3), Validators.minLength(3)]]
      })




   }

  ngOnInit(): void {

      this.obtenerTArjetas();
  }

  
  obtenerTArjetas(){

    this._tarjetaServices.getListTarjetas().subscribe(data =>{
      console.log(data);
      this.listTarjeta = data;
    }, error => {  

     console.log(error); 

    })


  }


  guardarTarjeta(){

   
    const tarjeta: any = {

      titular: this.form.get("titular")?.value,
      numeroTarjeta: this.form.get("numeroTarjeta")?.value,
      fechaExpiracion: this.form.get("fechaExpiracion")?.value,
      cvv: this.form.get("cvv")?.value
 
    }


    if(this.id == undefined){
      // Agregamos una tarjeta

      this._tarjetaServices.saveTarjeta(tarjeta).subscribe(data =>{
        this.toastr.success('La tarjeta fue registrada con exito', 'Tarejeta Registrada');
        this.obtenerTArjetas();
        this.form.reset();
      }, error => {  
  
       console.log(error); 
       this.toastr.error('Ops ocurrior un error', 'Error');
  
      })

    }else{

      tarjeta.id = this.id; // Agreamos el ID de la tarjeta ala variable
      this._tarjetaServices.updateTarjeta(this.id, tarjeta).subscribe(data =>{
        this.form.reset();
        this.accion = 'Agregar ';
        this.id= undefined;
        this.toastr.info('La tarjeta fue Editada con exito', 'Tarejeta Editada');
        this.obtenerTArjetas();
      
        
      
      }, error => {  
  
       console.log(error); 
       this.toastr.error('Ops ocurrior un error', 'Error');
  
      })


    }




   
    
        
  }

  eliminarTarjeta(id: number){

   
    this._tarjetaServices.deleteTarjetas(id).subscribe(data =>{
      this.toastr.error('La tarjeta fue eliminada con exito' , 'Tarjeta Eliminada');
      this.obtenerTArjetas();
    }, error => {  

     console.log(error); 

    })


  }



  editarTarjeta(tarjeta: any){

    // Cambiamos el titulo del formulario y asignamos el id de la tarjeta a la variable id creada
    this.accion = 'Editar ';
    this.id = tarjeta.id;
    console.log(this.id);
     
    // LLenamos el fomulario

    this.form.patchValue({

      titular: tarjeta.titular,
      numeroTarjeta: tarjeta.numeroTarjeta,
      fechaExpiracion: tarjeta.fechaExpiracion,
      cvv: tarjeta.cvv
    })

  }
}
