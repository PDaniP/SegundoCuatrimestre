CREATE TABLE public.estado_usuario (
    id integer GENERATED ALWAYS AS IDENTITY,
    descripcion character varying(50) NOT NULL,
    CONSTRAINT estado_usuario_id PRIMARY KEY (id),
    CONSTRAINT descricion_unique UNIQUE (descripcion)
);

INSERT INTO public.estado_usuario (descripcion) VALUES
('Activo'),
('Inactivo'),
('Suspendido');


CREATE TABLE public.usuarios (
    id integer GENERATED ALWAYS AS IDENTITY,
    nombre character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password character varying(255) NOT NULL,
    rol character varying(50) DEFAULT 'usuario_estandar',
    estado_id integer DEFAULT 1 NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Usuarios_pkey" PRIMARY KEY (id),
    CONSTRAINT email_unique UNIQUE (email),
    CONSTRAINT fk_usuario_estado
        FOREIGN KEY (estado_id)
        REFERENCES public.estado_usuario(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);


CREATE TABLE public.publicaciones (
    id integer GENERATED ALWAYS AS IDENTITY,
    titulo character varying(150) NOT NULL,
    contenido text NOT NULL,
    autor_id integer NOT NULL,
    CONSTRAINT publicaciones_pkey PRIMARY KEY (id),
    CONSTRAINT publicaciones_autor_id_fkey
        FOREIGN KEY (autor_id)
        REFERENCES public.usuarios(id)
        ON DELETE RESTRICT
);