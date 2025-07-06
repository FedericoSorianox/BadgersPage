// src/routes/login/+page.server.ts

import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export const actions = {
  // Este nombre "login" coincide con el action="?/login" de tu formulario
  login: async ({ request, locals }: RequestEvent) => {
    const formData = await request.formData();
    const email = formData.get('email') as string;

    // le decimos a Supabase que envíe un "Magic Link"
    const { error } = await locals.supabase.auth.signInWithOtp({
      email,
      options: {
        // La URL a la que el usuario volverá después de hacer clic en el enlace del correo
        emailRedirectTo: `http://localhost:5173/` // <-- ¡CAMBIA ESTA LÍNEA!
      }
    });

    // aquí podrías manejar el error si Supabase falla
    if (error) {
      console.error(error);
      return { success: false, message: 'No se pudo enviar el enlace.' };
    }

    // Si todo va bien, redirigimos al usuario a una página de confirmación
    throw redirect(303, '/check-email');
  }
};