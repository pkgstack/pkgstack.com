import { parse } from "node:querystring";
import { visit } from "unist-util-visit";

function createTabs(tabs: string) {
  return {
    type: "wrapper",
    data: {
      hName: "div",
      hProperties: {
        id: tabs,
				role: "tablist",
        className: "tabs tabs-bordered",
      },
    },
    children: [],
  };
}

function createTab(node: { meta: { tabs: string; name: string; lang: string; }; }, index: number) {
  const tabGroup = node.meta.tabs;
  let tabName = node.meta.name;

	// Strip possible quotes
	tabName = tabName.replace(/^['"]|['"]$/g, "");

  return [
    {
      type: "html",
      value: `<input type="radio" name="${tabGroup}" data-lang="${node.meta.lang}" role="tab" class="tab whitespace-nowrap" aria-label="${tabName}" ${index === 0 ? "checked" : ""} />`,
    },
    {
      type: "wrapper",
      data: {
        hName: "div",
        hProperties: {
					role: "tabpanel",
          className: "tab-content",
        },
      },
      children: [node],
    },
  ];
}

function createPlaceholder({ tabs, name }) {
  return {
    type: "html",
    value: ``,
  };
}

export default function remarkCodeTabs({
  metaDelimiter = " ",
} = {}) {
  return function transform(tree: any, file: any) {
    const queue = {};

    visit(tree, "code", function (node, index, parent) {
      const meta = parse(node.meta ?? "", metaDelimiter);

      if (!meta.tabs) return;

      const newNode = !queue[meta.tabs]
        ? createTabs(meta.tabs)
        : createPlaceholder(meta);

      parent.children[index] = newNode;
      queue[meta.tabs] ??= newNode;

      queue[meta.tabs].children.push(
        ...createTab({ ...node, meta }, queue[meta.tabs].children.length)
      );
    });
  };
}
