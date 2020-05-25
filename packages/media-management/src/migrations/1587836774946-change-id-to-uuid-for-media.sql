CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
    WITH SCHEMA public;

ALTER TABLE public.media ADD COLUMN uuid_id uuid DEFAULT uuid_generate_v4();
ALTER TABLE public.files ADD COLUMN uuid_id uuid DEFAULT uuid_generate_v4();

ALTER TABLE public.files ADD COLUMN uuid_media_id uuid;
UPDATE public.files SET uuid_media_id = (SELECT uuid_id FROM public.media WHERE id = media_id);
ALTER TABLE public.files DROP COLUMN media_id;
ALTER TABLE public.files RENAME uuid_media_id TO media_id;

ALTER TABLE public.files DROP COLUMN id;
ALTER TABLE public.files RENAME COLUMN uuid_id TO id;
ALTER TABLE public.files ADD CONSTRAINT pk___files___id PRIMARY KEY (id);

ALTER TABLE public.media DROP COLUMN id;
ALTER TABLE public.media RENAME COLUMN uuid_id TO id;
ALTER TABLE public.media ADD CONSTRAINT pk___media___id PRIMARY KEY (id);

ALTER TABLE public.jobs DROP CONSTRAINT IF EXISTS fk___jobs___job_queues_id___job_queue;
ALTER TABLE public.jobs ADD CONSTRAINT fk___jobs___job_queues_id___job_queue FOREIGN KEY (job_queue_id)
    REFERENCES public.job_queues (id) MATCH FULL
    ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE public.media RENAME COLUMN model_id TO legacy_model_id;
ALTER TABLE public.media ADD COLUMN model_id uuid;
