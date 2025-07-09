export const load = async ({ locals: { supabase } }) => {
  try {
    const { data, error } = await supabase.from('productos').select('*');

    if (error) {
      console.error('Error fetching products:', error);
      // Si la tabla no existe, devolver productos de ejemplo
      return { 
        productos: [
          {
            id: '1',
            nombre: 'Kimono Blanco',
            descripcion: 'Kimono de Jiu Jitsu de alta calidad, color blanco',
            precio: 89.99,
            imagen: '/products/kimono blanco.jpg',
            categoria: 'Kimonos'
          },
          {
            id: '2',
            nombre: 'Lycra BJJ',
            descripcion: 'Lycra para Jiu Jitsu No-Gi, diseño moderno',
            precio: 45.99,
            imagen: '/products/Lycra bjj.jpg',
            categoria: 'Lycras'
          },
          {
            id: '3',
            nombre: 'Cinturones',
            descripcion: 'Cinturones de Jiu Jitsu de diferentes colores',
            precio: 15.99,
            imagen: '/products/cinturones.jpg',
            categoria: 'Accesorios'
          }
        ] 
      };
    }

    return {
      productos: data ?? [],
    };
  } catch (err) {
    console.error('Error in load function:', err);
    return { productos: [] };
  }
};