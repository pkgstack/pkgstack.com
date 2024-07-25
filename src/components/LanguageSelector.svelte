<script lang="ts">
	function addCopeSnippetLanguageSelector(event: Event & { currentTarget: HTMLSelectElement }) {
		document.querySelectorAll(".tabs[role='tablist']").forEach(element => {
			const tabs = element.querySelectorAll(".tab")
			const selectedLanguage = event.currentTarget?.value as keyof typeof languageMap;

			if (!selectedLanguage) {
				return
			}

			for (let i = 0; i < tabs.length; i++) {
				const tab = tabs[i];
				const language = tab.getAttribute("data-lang")

				if (language && language == selectedLanguage) {
					// Language already present
					break;
				}

				if (i !== tabs.length - 1) {
					continue;
				}

				// Add a new code snippet and corresponding tab
				const codeElement = element.querySelector("pre")

				if (!codeElement) {
					continue;
				}

				const translatedCodeSnippet = translateCodeSnippet(codeElement.textContent as string, selectedLanguage)

				const newTab = document.createElement("input")
				newTab.setAttribute("type", "radio")
				newTab.setAttribute("class", "tab whitespace-nowrap")
				newTab.setAttribute("role", "tab")
				newTab.setAttribute("aria-selected", "false")
				newTab.setAttribute("data-lang", selectedLanguage)
				newTab.setAttribute("id", `tab-${selectedLanguage}`)
				newTab.setAttribute("name", tab.getAttribute("name") as string)
				newTab.setAttribute("aria-label", languageMap[selectedLanguage])

				const newCodeSnippet = document.createElement("pre")
				newCodeSnippet.setAttribute("class", "tab-content")
				newCodeSnippet.setAttribute("role", "tabpanel")
				newCodeSnippet.setAttribute("aria-labelledby", `tab-${selectedLanguage}`)
				newCodeSnippet.textContent = translatedCodeSnippet

				element.appendChild(newTab)
				element.appendChild(newCodeSnippet)
			}
		})
	}

	// TODO: Actually implement translation :sweat-smile:
	function translateCodeSnippet(snippet: string, language: string) {
		switch (language) {
			case "gyro":
				return snippet
			case "javascript":
				return snippet 
			case "cpp":
				return snippet
			case "c":
				return snippet
			case "mlisp":
				return snippet
			case "python":
				return snippet
			default:
				return snippet
		}
	}

	const languageMap = {
		"gyro": "Gyro",
		"javascript": "JavaScript",
		"cpp": "C++",
		"c": "C",
		"mlisp": "META Lisp",
		"python": "Python"
	}
</script>

<select class="select select-bordered" on:input={addCopeSnippetLanguageSelector}>
	<option value="" selected disabled>Translate Code</option>
	{#each Object.entries(languageMap) as [key, name]}
		<option value={key}>{name}</option>
	{/each}
</select>