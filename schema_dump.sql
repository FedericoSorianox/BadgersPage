--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: SCHEMA "public"; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA "public" IS 'standard public schema';


--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";


--
-- Name: EXTENSION "pg_graphql"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "pg_graphql" IS 'pg_graphql: GraphQL support';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";


--
-- Name: EXTENSION "pg_stat_statements"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "pg_stat_statements" IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";


--
-- Name: EXTENSION "pgcrypto"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "pgcrypto" IS 'cryptographic functions';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";


--
-- Name: EXTENSION "supabase_vault"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "supabase_vault" IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: get_user_role(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."get_user_role"() RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM public.clients WHERE user_id = auth.uid();
  RETURN user_role;
END;
$$;


ALTER FUNCTION "public"."get_user_role"() OWNER TO "postgres";

--
-- Name: handle_new_client(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."handle_new_client"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.clients (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_client"() OWNER TO "postgres";

--
-- Name: handle_new_client_user(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."handle_new_client_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Insert a new row into public.clients for the new auth.users record
  -- It sets the user_id and a default role of 'user'.
  -- The 'name' will be null initially and can be set by the user or an admin later.
  INSERT INTO public.clients (user_id, role, name)
  VALUES (NEW.id, 'user', NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_client_user"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

--
-- Name: clients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."clients" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "user_id" "uuid" NOT NULL,
    "role" "text" DEFAULT 'user'::"text",
    "name" "text"
);


ALTER TABLE "public"."clients" OWNER TO "postgres";

--
-- Name: clients_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE "public"."clients_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."clients_id_seq" OWNER TO "postgres";

--
-- Name: clients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE "public"."clients_id_seq" OWNED BY "public"."clients"."id";


--
-- Name: disciplines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."disciplines" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "image_url" "text"
);


ALTER TABLE "public"."disciplines" OWNER TO "postgres";

--
-- Name: events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "event_date" "date" NOT NULL,
    "description" "text",
    "image_url" "text"
);


ALTER TABLE "public"."events" OWNER TO "postgres";

--
-- Name: gallery; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."gallery" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "file_name" "text" NOT NULL,
    "storage_path" "text" NOT NULL,
    "title" "text"
);


ALTER TABLE "public"."gallery" OWNER TO "postgres";

--
-- Name: productos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."productos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "nombre" "text" NOT NULL,
    "descripcion" "text",
    "precio" numeric(10,2) NOT NULL,
    "imagen" "text",
    "categoria" "text",
    "stock" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."productos" OWNER TO "postgres";

--
-- Name: schedule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."schedule" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "time_slot" "text" NOT NULL,
    "monday" "text",
    "tuesday" "text",
    "wednesday" "text",
    "thursday" "text",
    "friday" "text",
    "saturday" "text"
);


ALTER TABLE "public"."schedule" OWNER TO "postgres";

--
-- Name: clients id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."clients" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."clients_id_seq"'::"regclass");


--
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."clients"
    ADD CONSTRAINT "clients_pkey" PRIMARY KEY ("id");


--
-- Name: clients clients_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."clients"
    ADD CONSTRAINT "clients_user_id_key" UNIQUE ("user_id");


--
-- Name: disciplines disciplines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."disciplines"
    ADD CONSTRAINT "disciplines_pkey" PRIMARY KEY ("id");


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_pkey" PRIMARY KEY ("id");


--
-- Name: gallery gallery_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."gallery"
    ADD CONSTRAINT "gallery_pkey" PRIMARY KEY ("id");


--
-- Name: productos productos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."productos"
    ADD CONSTRAINT "productos_pkey" PRIMARY KEY ("id");


--
-- Name: schedule schedule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."schedule"
    ADD CONSTRAINT "schedule_pkey" PRIMARY KEY ("id");


--
-- Name: gallery gallery_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."gallery"
    ADD CONSTRAINT "gallery_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."clients"("user_id");


--
-- Name: productos Admins can delete products; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can delete products" ON "public"."productos" FOR DELETE USING (("public"."get_user_role"() = 'admin'::"text"));


--
-- Name: productos Admins can insert products; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can insert products" ON "public"."productos" FOR INSERT WITH CHECK (("public"."get_user_role"() = 'admin'::"text"));


--
-- Name: clients Admins can update any client data; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can update any client data" ON "public"."clients" FOR UPDATE USING ((( SELECT "clients_1"."role"
   FROM "public"."clients" "clients_1"
  WHERE ("clients_1"."user_id" = "auth"."uid"())) = 'admin'::"text"));


--
-- Name: productos Admins can update products; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can update products" ON "public"."productos" FOR UPDATE USING (("public"."get_user_role"() = 'admin'::"text"));


--
-- Name: clients Admins can view all client data; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can view all client data" ON "public"."clients" FOR SELECT USING ((( SELECT "clients_1"."role"
   FROM "public"."clients" "clients_1"
  WHERE ("clients_1"."user_id" = "auth"."uid"())) = 'admin'::"text"));


--
-- Name: gallery Allow admin to delete; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow admin to delete" ON "public"."gallery" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."clients"
  WHERE (("clients"."user_id" = "auth"."uid"()) AND ("clients"."role" = 'admin'::"text")))));


--
-- Name: events Allow admin to delete events; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow admin to delete events" ON "public"."events" FOR DELETE USING ((( SELECT "clients"."role"
   FROM "public"."clients"
  WHERE ("clients"."user_id" = "auth"."uid"())) = 'admin'::"text"));


--
-- Name: events Allow admin to insert events; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow admin to insert events" ON "public"."events" FOR INSERT WITH CHECK ((( SELECT "clients"."role"
   FROM "public"."clients"
  WHERE ("clients"."user_id" = "auth"."uid"())) = 'admin'::"text"));


--
-- Name: events Allow admin to update events; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow admin to update events" ON "public"."events" FOR UPDATE USING ((( SELECT "clients"."role"
   FROM "public"."clients"
  WHERE ("clients"."user_id" = "auth"."uid"())) = 'admin'::"text")) WITH CHECK ((( SELECT "clients"."role"
   FROM "public"."clients"
  WHERE ("clients"."user_id" = "auth"."uid"())) = 'admin'::"text"));


--
-- Name: gallery Allow authenticated users to insert; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow authenticated users to insert" ON "public"."gallery" FOR INSERT TO "authenticated" WITH CHECK (true);


--
-- Name: clients Allow authenticated users to read clients data; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow authenticated users to read clients data" ON "public"."clients" FOR SELECT TO "authenticated" USING (true);


--
-- Name: gallery Allow owner to delete; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow owner to delete" ON "public"."gallery" FOR DELETE USING (("auth"."uid"() = "user_id"));


--
-- Name: gallery Allow public read access; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow public read access" ON "public"."gallery" FOR SELECT USING (true);


--
-- Name: events Allow public read access to events; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow public read access to events" ON "public"."events" FOR SELECT USING (true);


--
-- Name: disciplines Enable delete for admins; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable delete for admins" ON "public"."disciplines" FOR DELETE USING ((( SELECT "clients"."role"
   FROM "public"."clients"
  WHERE ("clients"."user_id" = "auth"."uid"())) = 'admin'::"text"));


--
-- Name: schedule Enable delete for admins; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable delete for admins" ON "public"."schedule" FOR DELETE USING ((( SELECT "clients"."role"
   FROM "public"."clients"
  WHERE ("clients"."user_id" = "auth"."uid"())) = 'admin'::"text"));


--
-- Name: disciplines Enable insert for admins; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable insert for admins" ON "public"."disciplines" FOR INSERT WITH CHECK ((( SELECT "clients"."role"
   FROM "public"."clients"
  WHERE ("clients"."user_id" = "auth"."uid"())) = 'admin'::"text"));


--
-- Name: schedule Enable insert for admins; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable insert for admins" ON "public"."schedule" FOR INSERT WITH CHECK ((( SELECT "clients"."role"
   FROM "public"."clients"
  WHERE ("clients"."user_id" = "auth"."uid"())) = 'admin'::"text"));


--
-- Name: disciplines Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON "public"."disciplines" FOR SELECT USING (true);


--
-- Name: schedule Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON "public"."schedule" FOR SELECT USING (true);


--
-- Name: disciplines Enable update for admins; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable update for admins" ON "public"."disciplines" FOR UPDATE USING ((( SELECT "clients"."role"
   FROM "public"."clients"
  WHERE ("clients"."user_id" = "auth"."uid"())) = 'admin'::"text"));


--
-- Name: schedule Enable update for admins; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable update for admins" ON "public"."schedule" FOR UPDATE USING ((( SELECT "clients"."role"
   FROM "public"."clients"
  WHERE ("clients"."user_id" = "auth"."uid"())) = 'admin'::"text"));


--
-- Name: productos Productos are viewable by everyone; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Productos are viewable by everyone" ON "public"."productos" FOR SELECT USING (true);


--
-- Name: clients Users can update their own client data; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update their own client data" ON "public"."clients" FOR UPDATE USING (("auth"."uid"() = "user_id"));


--
-- Name: clients Users can view their own client data; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own client data" ON "public"."clients" FOR SELECT USING (("auth"."uid"() = "user_id"));


--
-- Name: disciplines; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."disciplines" ENABLE ROW LEVEL SECURITY;

--
-- Name: events; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."events" ENABLE ROW LEVEL SECURITY;

--
-- Name: gallery; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."gallery" ENABLE ROW LEVEL SECURITY;

--
-- Name: productos; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."productos" ENABLE ROW LEVEL SECURITY;

--
-- Name: schedule; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."schedule" ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION "supabase_realtime" WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

--
-- Name: SCHEMA "public"; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";


--
-- Name: FUNCTION "armor"("bytea"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."armor"("bytea") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."armor"("bytea") TO "dashboard_user";


--
-- Name: FUNCTION "armor"("bytea", "text"[], "text"[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."armor"("bytea", "text"[], "text"[]) TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."armor"("bytea", "text"[], "text"[]) TO "dashboard_user";


--
-- Name: FUNCTION "crypt"("text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."crypt"("text", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."crypt"("text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "dearmor"("text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."dearmor"("text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."dearmor"("text") TO "dashboard_user";


--
-- Name: FUNCTION "decrypt"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."decrypt"("bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."decrypt"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "decrypt_iv"("bytea", "bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."decrypt_iv"("bytea", "bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."decrypt_iv"("bytea", "bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "digest"("bytea", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."digest"("bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."digest"("bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "digest"("text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."digest"("text", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."digest"("text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "encrypt"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."encrypt"("bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."encrypt"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "encrypt_iv"("bytea", "bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."encrypt_iv"("bytea", "bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."encrypt_iv"("bytea", "bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "gen_random_bytes"(integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."gen_random_bytes"(integer) TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."gen_random_bytes"(integer) TO "dashboard_user";


--
-- Name: FUNCTION "gen_random_uuid"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."gen_random_uuid"() TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."gen_random_uuid"() TO "dashboard_user";


--
-- Name: FUNCTION "gen_salt"("text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."gen_salt"("text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."gen_salt"("text") TO "dashboard_user";


--
-- Name: FUNCTION "gen_salt"("text", integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."gen_salt"("text", integer) TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."gen_salt"("text", integer) TO "dashboard_user";


--
-- Name: FUNCTION "hmac"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."hmac"("bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."hmac"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "hmac"("text", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."hmac"("text", "text", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."hmac"("text", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pg_stat_statements"("showtext" boolean, OUT "userid" "oid", OUT "dbid" "oid", OUT "toplevel" boolean, OUT "queryid" bigint, OUT "query" "text", OUT "plans" bigint, OUT "total_plan_time" double precision, OUT "min_plan_time" double precision, OUT "max_plan_time" double precision, OUT "mean_plan_time" double precision, OUT "stddev_plan_time" double precision, OUT "calls" bigint, OUT "total_exec_time" double precision, OUT "min_exec_time" double precision, OUT "max_exec_time" double precision, OUT "mean_exec_time" double precision, OUT "stddev_exec_time" double precision, OUT "rows" bigint, OUT "shared_blks_hit" bigint, OUT "shared_blks_read" bigint, OUT "shared_blks_dirtied" bigint, OUT "shared_blks_written" bigint, OUT "local_blks_hit" bigint, OUT "local_blks_read" bigint, OUT "local_blks_dirtied" bigint, OUT "local_blks_written" bigint, OUT "temp_blks_read" bigint, OUT "temp_blks_written" bigint, OUT "shared_blk_read_time" double precision, OUT "shared_blk_write_time" double precision, OUT "local_blk_read_time" double precision, OUT "local_blk_write_time" double precision, OUT "temp_blk_read_time" double precision, OUT "temp_blk_write_time" double precision, OUT "wal_records" bigint, OUT "wal_fpi" bigint, OUT "wal_bytes" numeric, OUT "jit_functions" bigint, OUT "jit_generation_time" double precision, OUT "jit_inlining_count" bigint, OUT "jit_inlining_time" double precision, OUT "jit_optimization_count" bigint, OUT "jit_optimization_time" double precision, OUT "jit_emission_count" bigint, OUT "jit_emission_time" double precision, OUT "jit_deform_count" bigint, OUT "jit_deform_time" double precision, OUT "stats_since" timestamp with time zone, OUT "minmax_stats_since" timestamp with time zone); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pg_stat_statements"("showtext" boolean, OUT "userid" "oid", OUT "dbid" "oid", OUT "toplevel" boolean, OUT "queryid" bigint, OUT "query" "text", OUT "plans" bigint, OUT "total_plan_time" double precision, OUT "min_plan_time" double precision, OUT "max_plan_time" double precision, OUT "mean_plan_time" double precision, OUT "stddev_plan_time" double precision, OUT "calls" bigint, OUT "total_exec_time" double precision, OUT "min_exec_time" double precision, OUT "max_exec_time" double precision, OUT "mean_exec_time" double precision, OUT "stddev_exec_time" double precision, OUT "rows" bigint, OUT "shared_blks_hit" bigint, OUT "shared_blks_read" bigint, OUT "shared_blks_dirtied" bigint, OUT "shared_blks_written" bigint, OUT "local_blks_hit" bigint, OUT "local_blks_read" bigint, OUT "local_blks_dirtied" bigint, OUT "local_blks_written" bigint, OUT "temp_blks_read" bigint, OUT "temp_blks_written" bigint, OUT "shared_blk_read_time" double precision, OUT "shared_blk_write_time" double precision, OUT "local_blk_read_time" double precision, OUT "local_blk_write_time" double precision, OUT "temp_blk_read_time" double precision, OUT "temp_blk_write_time" double precision, OUT "wal_records" bigint, OUT "wal_fpi" bigint, OUT "wal_bytes" numeric, OUT "jit_functions" bigint, OUT "jit_generation_time" double precision, OUT "jit_inlining_count" bigint, OUT "jit_inlining_time" double precision, OUT "jit_optimization_count" bigint, OUT "jit_optimization_time" double precision, OUT "jit_emission_count" bigint, OUT "jit_emission_time" double precision, OUT "jit_deform_count" bigint, OUT "jit_deform_time" double precision, OUT "stats_since" timestamp with time zone, OUT "minmax_stats_since" timestamp with time zone) TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pg_stat_statements"("showtext" boolean, OUT "userid" "oid", OUT "dbid" "oid", OUT "toplevel" boolean, OUT "queryid" bigint, OUT "query" "text", OUT "plans" bigint, OUT "total_plan_time" double precision, OUT "min_plan_time" double precision, OUT "max_plan_time" double precision, OUT "mean_plan_time" double precision, OUT "stddev_plan_time" double precision, OUT "calls" bigint, OUT "total_exec_time" double precision, OUT "min_exec_time" double precision, OUT "max_exec_time" double precision, OUT "mean_exec_time" double precision, OUT "stddev_exec_time" double precision, OUT "rows" bigint, OUT "shared_blks_hit" bigint, OUT "shared_blks_read" bigint, OUT "shared_blks_dirtied" bigint, OUT "shared_blks_written" bigint, OUT "local_blks_hit" bigint, OUT "local_blks_read" bigint, OUT "local_blks_dirtied" bigint, OUT "local_blks_written" bigint, OUT "temp_blks_read" bigint, OUT "temp_blks_written" bigint, OUT "shared_blk_read_time" double precision, OUT "shared_blk_write_time" double precision, OUT "local_blk_read_time" double precision, OUT "local_blk_write_time" double precision, OUT "temp_blk_read_time" double precision, OUT "temp_blk_write_time" double precision, OUT "wal_records" bigint, OUT "wal_fpi" bigint, OUT "wal_bytes" numeric, OUT "jit_functions" bigint, OUT "jit_generation_time" double precision, OUT "jit_inlining_count" bigint, OUT "jit_inlining_time" double precision, OUT "jit_optimization_count" bigint, OUT "jit_optimization_time" double precision, OUT "jit_emission_count" bigint, OUT "jit_emission_time" double precision, OUT "jit_deform_count" bigint, OUT "jit_deform_time" double precision, OUT "stats_since" timestamp with time zone, OUT "minmax_stats_since" timestamp with time zone) TO "dashboard_user";


--
-- Name: FUNCTION "pg_stat_statements_info"(OUT "dealloc" bigint, OUT "stats_reset" timestamp with time zone); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pg_stat_statements_info"(OUT "dealloc" bigint, OUT "stats_reset" timestamp with time zone) TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pg_stat_statements_info"(OUT "dealloc" bigint, OUT "stats_reset" timestamp with time zone) TO "dashboard_user";


--
-- Name: FUNCTION "pg_stat_statements_reset"("userid" "oid", "dbid" "oid", "queryid" bigint, "minmax_only" boolean); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pg_stat_statements_reset"("userid" "oid", "dbid" "oid", "queryid" bigint, "minmax_only" boolean) TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pg_stat_statements_reset"("userid" "oid", "dbid" "oid", "queryid" bigint, "minmax_only" boolean) TO "dashboard_user";


--
-- Name: FUNCTION "pgp_armor_headers"("text", OUT "key" "text", OUT "value" "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pgp_armor_headers"("text", OUT "key" "text", OUT "value" "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_armor_headers"("text", OUT "key" "text", OUT "value" "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_key_id"("bytea"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pgp_key_id"("bytea") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_key_id"("bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt"("bytea", "bytea"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt"("bytea", "bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt_bytea"("bytea", "bytea"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt_bytea"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt_bytea"("bytea", "bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_encrypt"("text", "bytea"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_encrypt"("text", "bytea", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_encrypt_bytea"("bytea", "bytea"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_encrypt_bytea"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_decrypt"("bytea", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_decrypt"("bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_decrypt_bytea"("bytea", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_decrypt_bytea"("bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_encrypt"("text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_encrypt"("text", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_encrypt_bytea"("bytea", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_encrypt_bytea"("bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v1"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."uuid_generate_v1"() TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."uuid_generate_v1"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v1mc"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."uuid_generate_v1mc"() TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."uuid_generate_v1mc"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v3"("namespace" "uuid", "name" "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."uuid_generate_v3"("namespace" "uuid", "name" "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."uuid_generate_v3"("namespace" "uuid", "name" "text") TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v4"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."uuid_generate_v4"() TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."uuid_generate_v4"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v5"("namespace" "uuid", "name" "text"); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."uuid_generate_v5"("namespace" "uuid", "name" "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."uuid_generate_v5"("namespace" "uuid", "name" "text") TO "dashboard_user";


--
-- Name: FUNCTION "uuid_nil"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."uuid_nil"() TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."uuid_nil"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_ns_dns"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."uuid_ns_dns"() TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."uuid_ns_dns"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_ns_oid"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."uuid_ns_oid"() TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."uuid_ns_oid"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_ns_url"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."uuid_ns_url"() TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."uuid_ns_url"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_ns_x500"(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "extensions"."uuid_ns_x500"() TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."uuid_ns_x500"() TO "dashboard_user";


--
-- Name: FUNCTION "graphql"("operationName" "text", "query" "text", "variables" "jsonb", "extensions" "jsonb"); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "graphql_public"."graphql"("operationName" "text", "query" "text", "variables" "jsonb", "extensions" "jsonb") TO "postgres";
GRANT ALL ON FUNCTION "graphql_public"."graphql"("operationName" "text", "query" "text", "variables" "jsonb", "extensions" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "graphql_public"."graphql"("operationName" "text", "query" "text", "variables" "jsonb", "extensions" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "graphql_public"."graphql"("operationName" "text", "query" "text", "variables" "jsonb", "extensions" "jsonb") TO "service_role";


--
-- Name: FUNCTION "get_user_role"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."get_user_role"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_role"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_role"() TO "service_role";


--
-- Name: FUNCTION "handle_new_client"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."handle_new_client"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_client"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_client"() TO "service_role";


--
-- Name: FUNCTION "handle_new_client_user"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."handle_new_client_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_client_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_client_user"() TO "service_role";


--
-- Name: FUNCTION "_crypto_aead_det_decrypt"("message" "bytea", "additional" "bytea", "key_id" bigint, "context" "bytea", "nonce" "bytea"); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "vault"."_crypto_aead_det_decrypt"("message" "bytea", "additional" "bytea", "key_id" bigint, "context" "bytea", "nonce" "bytea") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "vault"."_crypto_aead_det_decrypt"("message" "bytea", "additional" "bytea", "key_id" bigint, "context" "bytea", "nonce" "bytea") TO "service_role";


--
-- Name: FUNCTION "create_secret"("new_secret" "text", "new_name" "text", "new_description" "text", "new_key_id" "uuid"); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "vault"."create_secret"("new_secret" "text", "new_name" "text", "new_description" "text", "new_key_id" "uuid") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "vault"."create_secret"("new_secret" "text", "new_name" "text", "new_description" "text", "new_key_id" "uuid") TO "service_role";


--
-- Name: FUNCTION "update_secret"("secret_id" "uuid", "new_secret" "text", "new_name" "text", "new_description" "text", "new_key_id" "uuid"); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "vault"."update_secret"("secret_id" "uuid", "new_secret" "text", "new_name" "text", "new_description" "text", "new_key_id" "uuid") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "vault"."update_secret"("secret_id" "uuid", "new_secret" "text", "new_name" "text", "new_description" "text", "new_key_id" "uuid") TO "service_role";


--
-- Name: TABLE "pg_stat_statements"; Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON TABLE "extensions"."pg_stat_statements" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "extensions"."pg_stat_statements" TO "dashboard_user";


--
-- Name: TABLE "pg_stat_statements_info"; Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON TABLE "extensions"."pg_stat_statements_info" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "extensions"."pg_stat_statements_info" TO "dashboard_user";


--
-- Name: TABLE "clients"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."clients" TO "anon";
GRANT ALL ON TABLE "public"."clients" TO "authenticated";
GRANT ALL ON TABLE "public"."clients" TO "service_role";


--
-- Name: SEQUENCE "clients_id_seq"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE "public"."clients_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."clients_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."clients_id_seq" TO "service_role";


--
-- Name: TABLE "disciplines"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."disciplines" TO "anon";
GRANT ALL ON TABLE "public"."disciplines" TO "authenticated";
GRANT ALL ON TABLE "public"."disciplines" TO "service_role";


--
-- Name: TABLE "events"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."events" TO "anon";
GRANT ALL ON TABLE "public"."events" TO "authenticated";
GRANT ALL ON TABLE "public"."events" TO "service_role";


--
-- Name: TABLE "gallery"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."gallery" TO "anon";
GRANT ALL ON TABLE "public"."gallery" TO "authenticated";
GRANT ALL ON TABLE "public"."gallery" TO "service_role";


--
-- Name: TABLE "productos"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."productos" TO "anon";
GRANT ALL ON TABLE "public"."productos" TO "authenticated";
GRANT ALL ON TABLE "public"."productos" TO "service_role";


--
-- Name: TABLE "schedule"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."schedule" TO "anon";
GRANT ALL ON TABLE "public"."schedule" TO "authenticated";
GRANT ALL ON TABLE "public"."schedule" TO "service_role";


--
-- Name: TABLE "secrets"; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE "vault"."secrets" TO "postgres" WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE "vault"."secrets" TO "service_role";


--
-- Name: TABLE "decrypted_secrets"; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE "vault"."decrypted_secrets" TO "postgres" WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE "vault"."decrypted_secrets" TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER "issue_graphql_placeholder" ON "sql_drop"
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION "extensions"."set_graphql_placeholder"();


ALTER EVENT TRIGGER "issue_graphql_placeholder" OWNER TO "supabase_admin";

--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER "issue_pg_cron_access" ON "ddl_command_end"
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION "extensions"."grant_pg_cron_access"();


ALTER EVENT TRIGGER "issue_pg_cron_access" OWNER TO "supabase_admin";

--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER "issue_pg_graphql_access" ON "ddl_command_end"
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION "extensions"."grant_pg_graphql_access"();


ALTER EVENT TRIGGER "issue_pg_graphql_access" OWNER TO "supabase_admin";

--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER "issue_pg_net_access" ON "ddl_command_end"
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION "extensions"."grant_pg_net_access"();


ALTER EVENT TRIGGER "issue_pg_net_access" OWNER TO "supabase_admin";

--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER "pgrst_ddl_watch" ON "ddl_command_end"
   EXECUTE FUNCTION "extensions"."pgrst_ddl_watch"();


ALTER EVENT TRIGGER "pgrst_ddl_watch" OWNER TO "supabase_admin";

--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER "pgrst_drop_watch" ON "sql_drop"
   EXECUTE FUNCTION "extensions"."pgrst_drop_watch"();


ALTER EVENT TRIGGER "pgrst_drop_watch" OWNER TO "supabase_admin";

--
-- PostgreSQL database dump complete
--

