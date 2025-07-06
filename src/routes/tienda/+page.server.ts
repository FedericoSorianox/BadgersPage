export const load = async ({ locals }: { locals: any }) => {
  const { data, error } = await locals.supabase
    .from('productos')
    .select('*');

  if (error) {
    console.error('Error fetching products:', error);
    return { productos: [] };
  }

  return {
    productos: data ?? [],
  };
};