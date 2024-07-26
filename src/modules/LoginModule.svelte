<script lang="ts">

	import Cookies from "js-cookie";

	async function captureSubmit(e: SubmitEvent) {
		e.preventDefault();
		e.stopPropagation();

		const response = await fetch("/api/auth/refreshtoken", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Basic ${btoa(`${email}:${password}`)}`,
			},
		});

		if (response.status !== 200) {
			alert("Invalid credentials");
			return;
		}

		const data = await response.json();

		if (!data.body || !data.body.refreshToken) {
			alert("Something went wrong, please try again later.");
			return;
		}

		Cookies.set("refreshToken", data.body.refreshToken, { expires: 7 });

		// Get the accessToken too
		const accessTokenResponse = await fetch("/api/auth/accesstoken", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${data.body.refreshToken}`,
			},
		});

		if (accessTokenResponse.status !== 200) {
			alert("Something went wrong, please try again later.");
			return;
		}

		const accessTokenData = await accessTokenResponse.json();

		if (!accessTokenData.body || !accessTokenData.body.accessToken) {
			alert("Something went wrong, please try again later.");
			return;
		}

		Cookies.set("accessToken", accessTokenData.body.accessToken, { expires: 1 });

		window.location.href = "/profile";
	}

	let email: string;
	let password: string;
</script>

<form class="max-w-sm w-full" on:submit={captureSubmit}>
	<h1>Login</h1>
	<p>Log in to your account to access all issued keys and your created packages.</p>
	<h4>Email</h4>
	<input type="email" bind:value={email} placeholder="someone@example.com" class="input input-bordered w-full" />
	<h4>Password</h4>
	<input type="password" bind:value={password} placeholder="*********" class="input input-bordered w-full" />
	<div class="flex flex-row justify-between mt-4">
		<button class="btn btn-primary" tabindex="0">Log In</button>
		<a href="/auth/signup" class="btn btn-ghost">No Account yet?</a>
	</div>
</form>