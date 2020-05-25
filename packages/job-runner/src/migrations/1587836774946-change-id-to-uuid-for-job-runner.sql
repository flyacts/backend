CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
    WITH SCHEMA public;

ALTER TABLE public.job_queues ADD COLUMN uuid_id uuid DEFAULT uuid_generate_v4();
ALTER TABLE public.jobs ADD COLUMN uuid_id uuid DEFAULT uuid_generate_v4();

ALTER TABLE public.jobs ADD COLUMN uuid_job_queue_id uuid;
UPDATE public.jobs SET uuid_job_queue_id = (SELECT uuid_id FROM public.job_queues WHERE id = job_queue_id);
ALTER TABLE public.jobs DROP COLUMN job_queue_id;
ALTER TABLE public.jobs RENAME uuid_job_queue_id TO job_queues_id;

ALTER TABLE public.jobs DROP COLUMN id;
ALTER TABLE public.jobs RENAME COLUMN uuid_id TO id;
ALTER TABLE public.jobs ADD CONSTRAINT pk___jobs___id PRIMARY KEY (id);

ALTER TABLE public.job_queues DROP COLUMN id;
ALTER TABLE public.job_queues RENAME COLUMN uuid_id TO id;
ALTER TABLE public.job_queues ADD CONSTRAINT pk___job_queues___id PRIMARY KEY (id);

ALTER TABLE public.jobs DROP CONSTRAINT IF EXISTS fk___jobs___job_queues_id___job_queue;
ALTER TABLE public.jobs ADD CONSTRAINT fk___jobs___job_queues_id___job_queue FOREIGN KEY (job_queue_id)
    REFERENCES public.job_queues (id) MATCH FULL
    ON DELETE NO ACTION ON UPDATE NO ACTION;
