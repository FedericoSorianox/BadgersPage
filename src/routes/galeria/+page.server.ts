import { fail, error, type Actions, type PageServerLoad } from '@sveltejs/kit';

interface GalleryItemRecord {
  id: string;
  created_at: string;
  user_id: string;
  file_name: string;
  storage_path: string;
  title: string | null;
  clients: {
    name: string;
  } | null;
}

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  const { data: galleryItems, error: galleryError } = await supabase
    .from('gallery')
    .select('*, clients(name)')
    .order('created_at', { ascending: false })
    .limit(8);

  if (galleryError) {
    console.error('Error fetching gallery items:', galleryError);
    throw error(500, 'Error fetching gallery items');
  }

  const itemsWithUrls = (galleryItems as GalleryItemRecord[]).map((item) => {
    const { data: publicUrlData } = supabase.storage.from('gallery').getPublicUrl(item.storage_path);
    return {
      ...item,
      url: publicUrlData.publicUrl,
    };
  });

  return { gallery: itemsWithUrls };
};

export const actions: Actions = {
  upload: async ({ request, locals: { supabase, session } }) => {
    if (!session) {
      throw error(401, 'Unauthorized');
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;

    if (!file || file.size === 0) {
      return fail(400, { message: 'No file uploaded or file is empty' });
    }

    const userId = session.user.id;
    const fileName = `${userId}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage.from('gallery').upload(fileName, file);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return fail(500, { message: 'Error uploading file' });
    }

    const { error: dbError } = await supabase
      .from('gallery')
      .insert({ user_id: userId, file_name: file.name, storage_path: fileName, title: title });

    if (dbError) {
      console.error('Error saving file info to database:', dbError);
      // Try to delete the uploaded file if DB insert fails
      await supabase.storage.from('gallery').remove([fileName]);
      return fail(500, { message: 'Error saving file info' });
    }

    // After uploading, check if we need to prune old entries
    const { data: allItems, error: countError } = await supabase
      .from('gallery')
      .select('id, storage_path')
      .order('created_at', { ascending: true });

    if (countError) {
        console.error('Error counting gallery items:', countError);
        // Don't fail the whole request for this, just log it.
    }

    if (allItems && allItems.length > 8) {
        const itemsToDelete = (allItems as {id: string, storage_path: string}[]).slice(0, allItems.length - 8);
        const pathsToDelete = itemsToDelete.map(item => item.storage_path);
        const idsToDelete = itemsToDelete.map(item => item.id);

        if (pathsToDelete.length > 0) {
            const { error: deleteStorageError } = await supabase.storage.from('gallery').remove(pathsToDelete);
            if (deleteStorageError) {
                console.error('Error deleting old files from storage:', deleteStorageError);
            }
        }
        if (idsToDelete.length > 0) {
            const { error: deleteDbError } = await supabase.from('gallery').delete().in('id', idsToDelete);
            if (deleteDbError) {
                console.error('Error deleting old records from database:', deleteDbError);
            }
        }
    }


    return { success: true, message: 'File uploaded successfully' };
  },

  delete: async ({ request, locals: { supabase, session } }) => {
    if (!session) {
      throw error(401, 'Unauthorized');
    }

    // Check if user is admin
    const { data: client } = await supabase
      .from('clients')
      .select('role')
      .eq('user_id', session.user.id)
      .single();

    if (!client || client.role !== 'admin') {
      return fail(403, { message: 'Forbidden' });
    }

    const formData = await request.formData();
    const id = formData.get('id') as string;
    const storage_path = formData.get('storage_path') as string;

    if (!id || !storage_path) {
      return fail(400, { message: 'Missing required fields' });
    }

    // Delete file from storage
    const { error: storageError } = await supabase.storage.from('gallery').remove([storage_path]);
    if (storageError) {
      console.error('Error deleting file from storage:', storageError);
      return fail(500, { message: 'Error deleting file from storage' });
    }

    // Delete record from database
    const { error: dbError } = await supabase.from('gallery').delete().eq('id', id);
    if (dbError) {
      console.error('Error deleting record from database:', dbError);
      return fail(500, { message: 'Error deleting record from database' });
    }

    return { success: true, message: 'Item deleted successfully' };
  }
}; 