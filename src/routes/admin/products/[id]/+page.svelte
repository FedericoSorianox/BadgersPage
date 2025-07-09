<script lang="ts">
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from '$lib/components/ui/card';
  import { Label } from '$lib/components/ui/label';
  import { Input } from '$lib/components/ui/input';
  import { Button } from '$lib/components/ui/button';
  
  export let data;
  export let form;

  let { producto } = data;

</script>

<Card class="max-w-xl mx-auto mt-8">
  <CardHeader>
    <CardTitle>Editar Producto</CardTitle>
    <CardDescription>Realiza cambios en el producto. Haz clic en guardar cuando termines.</CardDescription>
  </CardHeader>
  <CardContent>
    <form method="POST" enctype="multipart/form-data">
      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label for="nombre">Nombre</Label>
          <Input id="nombre" name="nombre" value={producto.nombre} required />
        </div>
        <div class="grid gap-2">
          <Label for="descripcion">Descripción</Label>
          <textarea id="descripcion" name="descripcion" class="textarea textarea-bordered w-full" rows="3">{producto.descripcion}</textarea>
        </div>
        <div class="grid gap-2">
          <Label for="precio">Precio</Label>
          <Input id="precio" name="precio" type="number" step="0.01" value={producto.precio} required />
        </div>
        <div class="grid gap-2">
          <Label>Imagen Actual</Label>
          <img src={producto.imagen} alt={producto.nombre} class="w-32 h-32 object-cover rounded-md" />
          <input type="hidden" name="current_image_url" value={producto.imagen} />
        </div>
        <div class="grid gap-2">
          <Label for="imagen">Reemplazar Imagen (Opcional)</Label>
          <Input id="imagen" name="imagen" type="file" />
        </div>
        <div class="grid gap-2">
          <Label for="categoria">Categoría</Label>
          <Input id="categoria" name="categoria" value={producto.categoria} />
        </div>
        {#if form?.error}
          <p class="text-red-500">{form.error}</p>
        {/if}
        <Button type="submit">Guardar Cambios</Button>
      </div>
    </form>
  </CardContent>
</Card>
<div class="text-center mt-4">
    <a href="/admin" class="link">Volver al panel de administración</a>
</div> 