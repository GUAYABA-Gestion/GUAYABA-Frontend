import { MouseEventHandler } from "react";

export interface CustomButtonProps {
    title: string;
    containerStyles?: string;
    handleClick?: MouseEventHandler<HTMLButtonElement>;
}

export type FormProps = {
    submit: () => void;
    del: () => void;
    update: () => void
};

export interface Personas {
    dni: number;
    residencia_id: number;
    cdf_id: number | null
    nombre_completo: string;
    fecha_nacimiento: string;
    sexo: string;
    email: string;
    telefono: string;
    celular: string;
  };

export type TablaPersonas = Personas[];

export interface Cdf {
    cdf_id: number;
    persona_id: number;
};

export interface Viviendas {
    id: number;
    municipio_id: number;
    tipo_vivienda: string;
    direccion: string;
    pisos: number;
    tamano: number;
    estrato: number;
    avaluo: number;
}

export type TablaViviendas = Viviendas[];

export interface Propiedades {
    id: number;
    vivienda_id: number;
    propietario_id: number;
}

export type TablaPropiedades = Propiedades[];

export interface Negocios {
    nit: string;
    propietario_id: number;
    municipio_id: number;
    tipo_negocio: string;
    nombre: string;
    direccion: string;
    telefono: number;
}

export type TablaNegocios = Negocios[]

export interface Municipios {
    id: number;
    nombre: string;
    gobernador_id: number;
    habitantes: number;
    area: number;
}

export type TablaMunicipios = Municipios[]