ALTER TABLE public.files ALTER COLUMN created_by TYPE uuid USING uuid_generate_v4();
ALTER TABLE public.files ALTER COLUMN updated_by TYPE uuid USING uuid_generate_v4();

ALTER TABLE public.media ALTER COLUMN created_by TYPE uuid USING uuid_generate_v4();
ALTER TABLE public.media ALTER COLUMN updated_by TYPE uuid USING uuid_generate_v4();
