ALTER TABLE public.jobs ALTER created_at TYPE timestamp with time zone;
ALTER TABLE public.jobs ALTER updated_at TYPE timestamp with time zone;
ALTER TABLE public.job_queues ALTER created_at TYPE timestamp with time zone;
ALTER TABLE public.job_queues ALTER updated_at TYPE timestamp with time zone;
