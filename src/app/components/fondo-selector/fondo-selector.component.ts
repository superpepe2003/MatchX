import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-fondo-selector',
  templateUrl: './fondo-selector.component.html',
  styleUrls: ['./fondo-selector.component.scss'],
})
export class FondoSelectorComponent implements OnInit {

  @Output() fondoSel = new EventEmitter<string>();
  @Input() fondoActivo = '01-fondo.jpg';

  fondos = [
    {
      img: '01-fondo.jpg',
      seleccionado: true
    },
    {
      img: '02-fondo.jpg',
      seleccionado: false
    },
    {
      img: '03-fondo.jpg',
      seleccionado: false
    },
    {
      img: '04-fondo.jpg',
      seleccionado: false
    },
    {
      img: '05-fondo.jpg',
      seleccionado: false
    },
    {
      img: '06-fondo.jpg',
      seleccionado: false
    },
    {
      img: '07-fondo.jpg',
      seleccionado: false
    },
];

fondoSlide = {
  slidesPerView: 2.5,
};

  constructor() {}

  ngOnInit() {
    this.fondos.forEach(av => {
      av.seleccionado = false;
      if (av.img === this.fondoActivo) {
        av.seleccionado = true;
      }
    });
  }

  seleccionarFondo( fondo ) {
    this.fondos.forEach( av => av.seleccionado = false );

    fondo.seleccionado = true;

    console.log( fondo.img );
    this.fondoSel.emit( fondo.img );

  }


}
