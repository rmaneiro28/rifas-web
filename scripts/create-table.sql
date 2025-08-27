-- Crear tabla de rifas
create table public.t_rifas (
  id_rifa uuid not null default extensions.uuid_generate_v4 (),
  nombre character varying(255) not null,
  descripcion text null,
  precio_ticket numeric(10, 2) not null,
  total_tickets integer not null,
  fecha_inicio timestamp without time zone not null,
  fecha_fin timestamp without time zone not null,
  estado character varying(50) null default 'activa'::character varying,
  imagen_url text null,
  premio_principal character varying(255) not null,
  segundo_premio character varying(255) null,
  tercer_premio character varying(255) null,
  cuarto_premio character varying(255) null,
  categoria character varying(100) null,
  reglas text null,
  created_at timestamp without time zone null default CURRENT_TIMESTAMP,
  updated_at timestamp without time zone null default CURRENT_TIMESTAMP,
  constraint rifas_pkey primary key (id_rifa),
  constraint rifas_estado_check check (
    (
      (estado)::text = any (
        (
          array[
            'activa'::character varying,
            'finalizada'::character varying,
            'cancelada'::character varying,
            'pendiente'::character varying
          ]
        )::text[]
      )
    )
  ),
  constraint rifas_precio_ticket_check check ((precio_ticket > (0)::numeric)),
  constraint rifas_total_tickets_check check ((total_tickets > 0))
) TABLESPACE pg_default;

-- Crear índices
create index IF not exists idx_rifas_estado on public.t_rifas using btree (estado) TABLESPACE pg_default;
create index IF not exists idx_rifas_categoria on public.t_rifas using btree (categoria) TABLESPACE pg_default;
create index IF not exists idx_rifas_fecha_inicio on public.t_rifas using btree (fecha_inicio) TABLESPACE pg_default;
create index IF not exists idx_rifas_fecha_fin on public.t_rifas using btree (fecha_fin) TABLESPACE pg_default;
create index IF not exists idx_rifas_created_at on public.t_rifas using btree (created_at) TABLESPACE pg_default;

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at automáticamente
create trigger update_rifas_updated_at BEFORE
update on t_rifas for EACH row
execute FUNCTION update_updated_at_column ();
