ALTER TABLE public.tokens ALTER created_at TYPE timestamp with time zone;
ALTER TABLE public.tokens ALTER updated_at TYPE timestamp with time zone;
ALTER TABLE public.users ALTER created_at TYPE timestamp with time zone;
ALTER TABLE public.users ALTER updated_at TYPE timestamp with time zone;
ALTER TABLE public.roles ALTER created_at TYPE timestamp with time zone;
ALTER TABLE public.roles ALTER updated_at TYPE timestamp with time zone;
