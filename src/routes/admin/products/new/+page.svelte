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
  
  export let form;

</script>

<Card class="max-w-xl mx-auto mt-8">
  <CardHeader>
    <CardTitle>Crear Nuevo Producto</CardTitle>
    <CardDescription>Completa los detalles del nuevo producto. Haz clic en guardar cuando termines.</CardDescription>
  </CardHeader>
  <CardContent>
    <form method="POST" enctype="multipart/form-data">
      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label for="nombre">Nombre</Label>
          <Input id="nombre" name="nombre" placeholder="Ej: Kimono Azul" required />
        </div>
        <div class="grid gap-2">
          <Label for="descripcion">Descripción</Label>
          <textarea id="descripcion" name="descripcion" class="textarea textarea-bordered w-full" rows="3" placeholder="Ej: Kimono de alta calidad..."></textarea>
        </div>
        <div class="grid gap-2">
          <Label for="precio">Precio</Label>
          <Input id="precio" name="precio" type="number" step="0.01" placeholder="Ej: 99.99" required />
        </div>
        <div class="grid gap-2">
          <Label for="imagen">Imagen del Producto</Label>
          <Input id="imagen" name="imagen" type="file" required />
        </div>
        <div class="grid gap-2">
          <Label for="categoria">Categoría</Label>
          <Input id="categoria" name="categoria" placeholder="Ej: Kimonos" />
        </div>
        {#if form?.error}
          <p class="text-red-500">{form.error}</p>
        {/if}
        <Button type="submit">Guardar Producto</Button>
      </div>
    </form>
  </CardContent>
</Card>
<div class="text-center mt-4">
    <a href="/admin" class="link">Volver al panel de administración</a>
</div> 