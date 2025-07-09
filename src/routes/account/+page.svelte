<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	export let data;
	export let form;

	$: ({ session } = data);
</script>

<div class="container mx-auto max-w-lg py-12">
	<Card>
		<CardHeader>
			<CardTitle>Mi Cuenta</CardTitle>
			<CardDescription>
				Aquí puedes gestionar la configuración de tu cuenta. Tu correo es {session.user.email}.
			</CardDescription>
		</CardHeader>
		<CardContent>
			<form method="POST" action="?/updatePassword" class="space-y-6">
				<h3 class="text-lg font-semibold">Cambiar Contraseña</h3>

				{#if form?.message}
					<div
						class="p-4 text-sm rounded-md"
						class:bg-green-100={!form?.error}
						class:text-green-700={!form?.error}
						class:bg-red-100={form?.error}
						class:text-red-700={form?.error}
						role="alert"
					>
						{form.message}
					</div>
				{/if}

				<div class="space-y-2">
					<Label for="password">Nueva Contraseña</Label>
					<Input
						id="password"
						name="password"
						type="password"
						required
						minlength="6"
						placeholder="••••••••"
					/>
				</div>

				<div class="space-y-2">
					<Label for="confirmPassword">Confirmar Nueva Contraseña</Label>
					<Input
						id="confirmPassword"
						name="confirmPassword"
						type="password"
						required
						minlength="6"
						placeholder="••••••••"
					/>
				</div>

				<div>
					<Button type="submit" class="w-full">Actualizar Contraseña</Button>
				</div>
			</form>
		</CardContent>
	</Card>
</div> 