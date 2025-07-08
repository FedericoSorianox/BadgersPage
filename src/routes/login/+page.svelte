<script lang="ts">
  import { supabase } from '$lib/supabaseClient';

  async function loginWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:5173/' // o la ruta que quieras después del login
      }
    });
    if (error) {
      alert(error.message);
    }
  }
</script>

<button on:click={loginWithGoogle}>
  Login con Google
</button>