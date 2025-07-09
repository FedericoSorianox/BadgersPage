import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const nombre = formData.get('nombre') as string;
    const descripcion = formData.get('descripcion') as string;
    const precio = parseFloat(formData.get('precio') as string);
    const categoria = formData.get('categoria') as string;
    const imagenFile = formData.get('imagen') as File;

    if (!nombre || !precio || !imagenFile || imagenFile.size === 0) {
        return fail(400, { error: 'Nombre, precio e imagen son campos requeridos.' });
    }
    
    if (isNaN(precio) || precio <= 0) {
        return fail(400, { error: 'El precio debe ser un número positivo.' });
    }

    // 1. Subir la imagen a Supabase Storage
    const fileName = `${Date.now()}_${imagenFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, imagenFile);

    if (uploadError) {
      return fail(500, { error: `Error al subir la imagen: ${uploadError.message}` });
    }

    // 2. Obtener la URL pública de la imagen
    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    const publicUrl = publicUrlData.publicUrl;

    // 3. Insertar el producto en la base de datos con la URL de la imagen
    const { error: insertError } = await supabase
      .from('productos')
      .insert([
        {
          nombre,
          descripcion,
          precio,
          imagen: publicUrl,
          categoria,
        },
      ]);

    if (insertError) {
      // Opcional: si la inserción en la BD falla, podríamos intentar borrar la imagen subida.
      await supabase.storage.from('product-images').remove([fileName]);
      return fail(500, { error: `Error al crear el producto: ${insertError.message}` });
    }

    throw redirect(303, '/admin');
  },
}; 