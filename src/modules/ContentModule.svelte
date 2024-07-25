<script lang="ts">
	import type { CollectionEntry } from 'astro:content';
	export let content: CollectionEntry<"x86">;
	import SvelteMarkdown from 'svelte-markdown';

</script>

<h1>{content.data.name} - {content.data.description}</h1>

<SvelteMarkdown source={content.data.longDescription} isInline={false}></SvelteMarkdown>

<table>
	<thead>
		<tr>
			<th>Opcode</th>
			<th>Instruction</th>
			<th>Op/En</th>
			<th>64-bit Mode</th>
			<th>Compat/Leg Mode</th>
			<th>Description</th>
		</tr>
	</thead>
	<tbody>
		{#each content.data.instructionTypes as instructionType}
			<tr>
				<td>{instructionType.opCode}</td>
				<td>{instructionType.instruction}</td>
				<td>{instructionType.operatorEncoding}</td>
				<td>{instructionType.supports64BitMode}</td>
				<td>{instructionType.supportsCompatMode}</td>
				<td>{instructionType.description}</td>
			</tr>
		{/each}
	</tbody>
</table>

<h2>Supported Operand Modes</h2>


<table>
	<thead>
		<tr>
			<th>Opcode</th>
			<th>Operand 1</th>
			<th>Operand 2</th>
			<th>Operand 3</th>
			<th>Operand 4</th>
		</tr>
	</thead>
	<tbody>
		{#each content.data.instructionTypes as instructionType}
			<tr>
				<td>{instructionType.opCode}</td>
				<td>{instructionType.instruction.match(/(AL|AX)/g)}</td>
				<td>{instructionType.instruction.match(/(imm8|imm16|imm32|imm64)/g)}</td>
			</tr>
		{/each}
	</tbody>
</table>