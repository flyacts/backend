CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
    WITH SCHEMA public;

ALTER TABLE public.jobs ALTER COLUMN created_by TYPE uuid USING uuid_generate_v4();
ALTER TABLE public.jobs ALTER COLUMN updated_by TYPE uuid USING uuid_generate_v4();

ALTER TABLE public.job_queues ALTER COLUMN created_by TYPE uuid USING uuid_generate_v4();
ALTER TABLE public.job_queues ALTER COLUMN updated_by TYPE uuid USING uuid_generate_v4();
