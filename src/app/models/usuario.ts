import { map } from 'rxjs/operators';

export class Usuario {
    uid?: string;
    email?: string;
    password?: string;
    nombreCompleto?: string;
    nick?: string;
    sexo?: string;
    fondo?: string;
    avatar?: string;
    estudios?: string;
    altura?: number;
    deporte?: string;
    comida?: string;
    lugar?: string;
    cita?: string;
    location?: { lat: number, lng: number};
    fechaNac?: Date = new Date();
}
