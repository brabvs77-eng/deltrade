import { visit } from 'unist-util-visit';

/**
 * Markdown tables overflow on narrow screens, so each one gets a scrollable
 * wrapper instead of forcing the whole article to scroll sideways.
 */
export function rehypeWrapTables() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'table' || !parent || index === null) return;
      if (parent.type === 'element' && parent.properties?.className?.includes?.('table-scroll')) {
        return;
      }

      parent.children[index] = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['table-scroll'] },
        children: [node],
      };
    });
  };
}
