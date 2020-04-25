CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
    WITH SCHEMA public;

ALTER TABLE public.users ADD COLUMN uuid_id uuid DEFAULT uuid_generate_v4();
ALTER TABLE public.roles ADD COLUMN uuid_id uuid DEFAULT uuid_generate_v4();
ALTER TABLE public.tokens ADD COLUMN uuid_id uuid DEFAULT uuid_generate_v4();

ALTER TABLE public.user_roles ADD COLUMN uuid_users_id uuid;
ALTER TABLE public.user_roles ADD COLUMN uuid_roles_id uuid;

UPDATE public.user_roles SET uuid_roles_id = (SELECT uuid_id FROM public.roles WHERE id = roles_id);
UPDATE public.user_roles SET uuid_users_id = (SELECT uuid_id FROM public.users WHERE id = users_id);

ALTER TABLE public.user_roles DROP COLUMN roles_id;
ALTER TABLE public.user_roles DROP COLUMN users_id;
ALTER TABLE public.user_roles RENAME uuid_users_id TO users_id;
ALTER TABLE public.user_roles RENAME uuid_roles_id TO roles_id;

ALTER TABLE public.tokens ADD COLUMN uuid_users_id uuid;

UPDATE public.tokens SET uuid_users_id = (SELECT uuid_id FROM public.users WHERE id = users_id);
ALTER TABLE public.tokens DROP COLUMN users_id;
ALTER TABLE public.tokens RENAME uuid_users_id TO users_id;

ALTER TABLE public.users DROP COLUMN id;
ALTER TABLE public.users RENAME COLUMN uuid_id TO id;
ALTER TABLE public.users ADD CONSTRAINT pk___users___id PRIMARY KEY (id);
ALTER TABLE public.roles DROP COLUMN id;
ALTER TABLE public.roles RENAME COLUMN uuid_id TO id;
ALTER TABLE public.roles ADD CONSTRAINT pk___roles___id PRIMARY KEY (id);
ALTER TABLE public.tokens DROP COLUMN id;
ALTER TABLE public.tokens RENAME COLUMN uuid_id TO id;
ALTER TABLE public.tokens ADD CONSTRAINT pk___tokens___id PRIMARY KEY (id);

ALTER TABLE public.user_roles ADD CONSTRAINT fk___user_roles___users_id___users FOREIGN KEY (users_id)
    REFERENCES public.users (id) MATCH FULL
    ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE public.user_roles ADD CONSTRAINT fk___user_roles___roles_id___roles FOREIGN KEY (roles_id)
    REFERENCES public.roles (id) MATCH FULL
    ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE public.tokens ADD CONSTRAINT fk___tokens___users_id___users FOREIGN KEY (users_id)
    REFERENCES public.users (id) MATCH FULL
    ON DELETE NO ACTION ON UPDATE NO ACTION;
