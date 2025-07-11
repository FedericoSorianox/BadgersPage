import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  createProduct: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const nombre = formData.get('nombre') as string;
    const precio = parseFloat(formData.get('precio') as string);
    const costo = parseFloat(formData.get('costo') as string);
    const stock = parseInt(formData.get('stock') as string, 10);
    const imageFile = formData.get('imagen') as File;

    let imagePath: string | null = null;
    if (imageFile && imageFile.size > 0) {
      const fileName = `${Date.now()}_${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, imageFile);

      if (uploadError) {
        return fail(500, { success: false, message: `Error al subir la imagen: ${uploadError.message}` });
      }
      imagePath = fileName;
    }

    const { error: insertError } = await supabase.from('productos').insert({
      nombre,
      precio,
      costo,
      stock,
      imagen: imagePath
    });

    if (insertError) {
      return fail(500, {
        success: false,
        message: `Error al crear el producto: ${insertError.message}`
      });
    }

    throw redirect(303, '/admin/inventario');
  },
}; 