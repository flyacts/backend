ALTER TABLE public.tokens RENAME COLUMN "createdAt" TO created_at;
ALTER TABLE public.tokens RENAME COLUMN "updatedAt" TO updated_at;
ALTER TABLE public.users RENAME COLUMN "createdAt" TO created_at;
ALTER TABLE public.users RENAME COLUMN "updatedAt" TO updated_at;
ALTER TABLE public.roles RENAME COLUMN "createdAt" TO created_at;
ALTER TABLE public.roles RENAME COLUMN "updatedAt" TO updated_at;
