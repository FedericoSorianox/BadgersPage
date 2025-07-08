const load = async ({ locals }) => {
  const { supabaseClient } = locals;
  const { data, error } = await supabaseClient.from("productos").select("*");
  if (error) {
    console.error("Error fetching products:", error);
    return { productos: [] };
  }
  return {
    productos: data ?? []
  };
};
export {
  load
};
