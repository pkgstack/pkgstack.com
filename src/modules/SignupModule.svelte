<script lang="ts">
	import {QuestionMarkCircled} from "radix-svelte-icons";

	async function signup(e: SubmitEvent) {
		e.preventDefault();

		if (password !== confirmpassword) {
			alert("Passwords do not match.");
			return;
		}

		// Validate the username
		if (username.length < 3) {
			alert("Username must be at least 3 characters long.");
			return;
		}

		if (username.length > 32) {
			alert("Username must be at most 32 characters long.");
			return;
		}

		if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
			alert("Username must only contain letters, numbers, underscores and hyphens.");
			return;
		}

		const response = await fetch("/api/auth/signup", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username,
				email,
				firstname,
				lastname,
				password,
			}),
		});

		const json = await response.json();

		if (response.status !== 200) {
			alert(json.message);
		}

		if (response.status === 200) {
			window.location.href = "/auth/login";
		}
	}

	let username: string;
	let email: string;
	let firstname: string;
	let lastname: string;
	let password: string;
	let confirmpassword: string;
</script>

<form class="max-w-sm w-full" on:submit={signup}>
	<h1>Signup</h1>
	<p>Create an account to upload packages to the Stack Registry.</p>
	<div class="flex flex-row items-center justify-between">
		<h4 class="my-2">Username</h4>
		<div class="tooltip" data-tip="Your username may only contain lowercase characters, numbers, underscores and hyphens. It may be between 3 and 32 characters long.">
			<QuestionMarkCircled size={18}></QuestionMarkCircled>
		</div>
	</div>
	<input type="text" bind:value={username} pattern={`^[a-z0-9_-]{3,32}$`} name="username" placeholder="alexmeymey" class="input input-bordered w-full" />
	<div class="flex flex-row gap-4">
		<div>
			<h4>First Name</h4>
			<input type="text" bind:value={firstname} name="firstname" placeholder="Alex" class="input input-bordered w-full" />
		</div>
		<div>
			<h4>Last Name</h4>
			<input type="text" bind:value={lastname} name="lastname" placeholder="Meyers" class="input input-bordered w-full" />
		</div>
	</div>
	<h4>Email</h4>
	<input type="email" bind:value={email} name="email" placeholder="someone@example.com" class="input input-bordered w-full" />
	<h4>Password</h4>
	<input type="password" bind:value={password} name="password" placeholder="*********" class="input input-bordered w-full" />
	<h4>Confirm Password</h4>
	<input type="password" bind:value={confirmpassword} name="confirmpassword" placeholder="*********" class="input input-bordered w-full" />
	<div class="flex flex-row justify-between mt-4">
		<button class="btn btn-primary" tabindex="0">Sign Up</button>
		<a href="/auth/login" class="btn btn-ghost">Log In instead</a>
	</div>
</form>