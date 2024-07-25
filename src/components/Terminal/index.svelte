<script lang="ts">
	import Convert from "ansi-to-html";

	const convert = new Convert()

	export let output = "";
	$: lines = output.trimEnd().split("\n");

	export const clear = () => {
		output = "";
	};

	export const log = (line: string) => {
		output += line + "\n";
	};

	export const execute = (command: string) => {
		commandLineText = command;
		executeCommandLine();
	};

	export const commands: Record<string, (...args: string[]) => Promise<number>> = {
		clear: async (...args: string[]) => {
			clear()
			return 0
		},
		help: async (...args: string[]) => {
			log("Available commands:");
			log("  clear");
			log("  help");
			return 0;
		},
	}

	let focused = false;

	interface ExecutedCommand {
		command: string;
		args: string[];
		result: number;
	}

	let executionStack: ExecutedCommand[] = [];
	let executionStackIndex = 0;

	const reconstructCommandCall = (command: ExecutedCommand) => {
		return `${command.command} ${command.args.join(" ")}`;
	};

	async function executeCommandLine() {
		if (commandLineText == "") return;

			const argv = commandLineText.split(" ");
			const command = argv[0];
			let result: number = 0

			log(`\x1b[32m➜\x1b[0m ${argv.join(" ")}`);
			if (commands.hasOwnProperty(command)) {
				result = await commands[command](...argv.slice(1));
			} else {
				log(`command not found: ${command}`);
			}


			// Store command in execution stack to enable arrow up and down
			executionStack.push({command: command, args: argv.slice(1), result });
			commandLineText = "";
			executionStackIndex = 0;
	}

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === "Enter") {
			event.preventDefault();

			executeCommandLine()
		}

		if (event.key === "Tab") {
			event.preventDefault();
		}

		if (event.key === "ArrowUp") {
			event.preventDefault();
			if (executionStackIndex < executionStack.length) {
				executionStackIndex++;
				commandLineText = reconstructCommandCall(executionStack[executionStack.length - executionStackIndex]);
			}
		}

		if (event.key === "ArrowDown") {
			event.preventDefault();
			if (executionStackIndex > 1) {
				executionStackIndex--;
				commandLineText = reconstructCommandCall(executionStack[executionStack.length - executionStackIndex]);
			}
		}
	};

	let commandLineText = "";

	let terminalInputElement: HTMLInputElement;
</script>

<div
	{...$$restProps}
	tabindex="-1"
	on:focus={() => {
		terminalInputElement.focus();
		focused = true;
	}}
	class="cursor-text px-4 outline-none overflow-y-auto max-h-[600px]"
>
	{#each lines as line}
		<pre class="text-base text-white m-0 p-0 before:hidden">{@html convert.toHtml(line)}</pre>
	{/each}
	<div class="flex flex-row items-center gap-2">
		<span class="text-[#00AA00] text-base">➜</span>
		<div class="flex flex-row items-center">
			<input
			style="width: {commandLineText.length}ch"
				class="text-base text-white outline-none bg-transparent w-min caret-transparent"
				on:focusout={() => (focused = false)}
				bind:value={commandLineText}
				on:keydown={handleKeydown}
				bind:this={terminalInputElement}
			/>
			{#if focused}
				<span class="cursor w-2 h-4 bg-white inline-block"></span>
			{/if}
		</div>
	</div>
</div>

<style>
	* {
		font-family: "Ubuntu Mono", monospace;
	}

	@keyframes blinking {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	.cursor {
		animation: blinking 1.2s step-end infinite;
	}
</style>
