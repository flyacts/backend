ALTER TABLE public.jobs RENAME COLUMN "createdAt" TO created_at;
ALTER TABLE public.jobs RENAME COLUMN "updatedAt" TO updated_at;
ALTER TABLE public.job_queues RENAME COLUMN "createdAt" TO created_at;
ALTER TABLE public.job_queues RENAME COLUMN "updatedAt" TO updated_at;
