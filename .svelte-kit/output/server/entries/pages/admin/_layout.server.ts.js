const load = async ({ locals }) => {
  const { session, supabaseClient } = locals;
  if (session) {
    const { data: profile, error: profileError } = await supabaseClient.from("profiles").select("role").eq("id", session.user.id).single();
    if (profileError) {
      return { session, role: null };
    }
    return { session, role: profile?.role };
  }
  return { session: null, role: null };
};
export {
  load
};
