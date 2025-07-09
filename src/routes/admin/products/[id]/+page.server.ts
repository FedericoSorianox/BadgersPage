import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
  const { id } = params;
  if (!id) {
    throw error(400, 'Product ID is required');
  }

  const { data: producto, error: dbError } = await supabase
    .from('productos')
    .select('*')
    .eq('id', id)
    .single();

  if (dbError) {
    throw error(500, `Error fetching product: ${dbError.message}`);
  }

  if (!producto) {
    throw error(404, 'Product not found');
  }

  return {
    producto,
  };
};

export const actions: Actions = {
  default: async ({ request, params, locals: { supabase } }) => {
    const { id } = params;
    const formData = await request.formData();
    const nombre = formData.get('nombre') as string;
    const descripcion = formData.get('descripcion') as string;
    const precio = parseFloat(formData.get('precio') as string);
    const categoria = formData.get('categoria') as string;
    const newImageFile = formData.get('imagen') as File;
    let imagenUrl = formData.get('current_image_url') as string;

    if (isNaN(precio) || precio <= 0) {
        return fail(400, { error: 'El precio debe ser un número positivo.' });
    }

    // Si se subió una nueva imagen, procesarla
    if (newImageFile && newImageFile.size > 0) {
        const fileName = `${Date.now()}_${newImageFile.name}`;
        const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(fileName, newImageFile);

        if (uploadError) {
            return fail(500, { error: `Error al subir la nueva imagen: ${uploadError.message}` });
        }

        const { data: publicUrlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName);
        
        imagenUrl = publicUrlData.publicUrl;
        
        // Opcional: Borrar la imagen antigua si existe y no es una de las de ejemplo
        const oldImageUrl = formData.get('current_image_url') as string;
        if (oldImageUrl && !oldImageUrl.startsWith('/products/')) {
            const oldFileName = oldImageUrl.split('/').pop();
            if(oldFileName) await supabase.storage.from('product-images').remove([oldFileName]);
        }
    }


    const { error: updateError } = await supabase
      .from('productos')
      .update({
        nombre,
        descripcion,
        precio,
        imagen: imagenUrl, // Usar la nueva URL o la existente
        categoria,
      })
      .eq('id', id);

    if (updateError) {
      return fail(500, { error: `Error al actualizar el producto: ${updateError.message}` });
    }

    throw redirect(303, '/admin');
  },
}; 