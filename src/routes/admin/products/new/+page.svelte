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
  import { enhance } from '$app/forms';
  
  export let form;

</script>

<Card class="max-w-xl mx-auto mt-8">
  <CardHeader>
    <CardTitle>Crear Nuevo Producto</CardTitle>
    <CardDescription>Completa los detalles del nuevo producto. Haz clic en guardar cuando termines.</CardDescription>
  </CardHeader>
  <CardContent>
    <form method="POST" action="?/createProduct" use:enhance enctype="multipart/form-data" class="grid gap-4">
      <div class="grid gap-2">
        <Label for="nombre">Nombre</Label>
        <Input id="nombre" name="nombre" placeholder="Ej: Kimono Keiko" required />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="grid gap-2">
          <Label for="costo">Precio Costo</Label>
          <Input id="costo" name="costo" type="number" step="0.01" placeholder="Ej: 75.00" required />
        </div>
        <div class="grid gap-2">
          <Label for="precio">Precio Venta</Label>
          <Input id="precio" name="precio" type="number" step="0.01" placeholder="Ej: 99.99" required />
        </div>
      </div>

      <div class="grid gap-2">
        <Label for="stock">Stock Inicial</Label>
        <Input id="stock" name="stock" type="number" placeholder="Ej: 10" value="0" required />
      </div>

      <div class="grid gap-2">
        <Label for="descripcion">Descripción</Label>
        <textarea id="descripcion" name="descripcion" class="textarea textarea-bordered w-full" rows="3" placeholder="Ej: Kimono de alta calidad..."></textarea>
      </div>

      <div class="grid gap-2">
        <Label for="categoria">Categoría</Label>
        <Input id="categoria" name="categoria" placeholder="Ej: Kimonos" />
      </div>

      <div class="grid gap-2">
        <Label for="imagen">Imagen del Producto (Opcional)</Label>
        <Input id="imagen" name="imagen" type="file" />
      </div>

      {#if form?.message}
        <p class="text-red-500">{form.message}</p>
      {/if}
      <Button type="submit">Guardar Producto</Button>
    </form>
  </CardContent>
</Card>
<div class="text-center mt-4">
    <a href="/admin/inventario" class="link">Volver al inventario</a>
</div> 