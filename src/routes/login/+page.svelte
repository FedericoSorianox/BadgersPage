<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '$lib/components/ui/card';
</script>

<div class="flex items-center justify-center min-h-screen bg-stone-100">
  <Card class="w-full max-w-sm mx-4">
    <CardHeader class="text-center">
      <CardTitle class="text-2xl">Bienvenido</CardTitle>
      <CardDescription>Ingresa tu correo para continuar</CardDescription>
    </CardHeader>
    <CardContent>
      <form method="POST" action="?/login" class="space-y-4">
        <div class="space-y-2">
          <Label for="email">Correo Electrónico</Label>
          <Input type="email" name="email" id="email" placeholder="tu@email.com" required />
        </div>
        <Button type="submit" class="w-full">Enviar Magic Link</Button>
      </form>
    </CardContent>
  </Card>
</div>