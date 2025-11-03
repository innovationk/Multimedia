export default class TreeTools {
    static getLeaves({ rows = [], parentField = "parent_id" }) {
        const tree = this.buildTree(rows, parentField);
        return this.buildLeavesWithPath(tree);
    }

    static buildTree(nodes, parentField) {
        const tree = {};
        const childrenMap = {};

        nodes.forEach(node => {
            tree[node.id] = { ...node, children: [] };
            childrenMap[node.id] = tree[node.id];
        });

        nodes.forEach(node => {
            if (node[parentField] !== null) {
                childrenMap[node[parentField]].children.push(tree[node.id]);
            }
        });

        return Object.values(tree).filter(node => node[parentField] === null);
    }

    static buildLeavesWithPath(tree) {
        const lastElements = [];

        function traverse(node, path, pathEn, pathFr) {
            const currentPath = [...path, node[`label`]];
            const currentPathEn = [...pathEn, node[`label_en`]];
            const currentPathFr = [...pathFr, node[`label_fr`]];

            if (node.children.length === 0) {
                let lastElement = { ...node };
                lastElement.path = currentPath.join(' > ');
                lastElement.path_en = currentPathEn.join(' > ');
                lastElement.path_fr = currentPathFr.join(' > ');

                lastElements.push(lastElement);
            } else {
                node.children.forEach(child => traverse(
                    child,
                    currentPath,
                    currentPathEn,
                    currentPathFr
                ));
            }
        }

        tree.forEach(rootNode => traverse(rootNode, [], [], []));

        return lastElements;
    }
}