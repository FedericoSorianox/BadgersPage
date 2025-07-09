import type { PageServerLoad } from './$types';
import type { SupabaseClient } from '@supabase/supabase-js';

export const load: PageServerLoad = async ({
	locals: { supabase }
}: {
	locals: { supabase: SupabaseClient };
}) => {
	const { data: products, error } = await supabase.from('productos').select('*');

	if (error) {
		console.error('Error fetching products for admin:', error);
		return { products: [] };
	}

	return {
		products
	};
}; 