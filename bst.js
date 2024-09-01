function Tree (array, sortingFunct) {
    let dummy = TreeNode(Infinity);
    let _root;
    function sortArray () {
        if (sortingFunct) {
            let sort = sortingFunct(array);
            if (Array.isArray(sort)) array = sort;
        }
        else array.sort()
    }
    function removeDuplicates () { 
        let newArr = [];
        array.forEach((value, index) => {
            if (!(newArr[newArr.length-1] === value)) newArr.push(value)
        })
        array = newArr;
    }
    function buildTree (l, r) {
        if (l > r) return null
        const mid = Math.floor((l + r) / 2)
        const node = TreeNode(array[mid], buildTree(l, mid - 1), buildTree(mid + 1, r));
        return node
    }
    function connectRoot () {
        _root = buildTree(0, array.length - 1);
        dummy.left = _root
    }
    // Inserted from Odin
    const prettyPrint = (node, prefix = "", isLeft = true) => {
        if (node === null) {
          return;
        }
        if (node.right !== null) {
          prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
        }
        console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.val}`);
        if (node.left !== null) {
          prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
        }
    };
    function insert (value) {
        let node = _root;
        const newNode = TreeNode(value);
        while ((value < node.val && node.left) || (value > node.val && node.right)) {
            if (value < node.val) node = node.left;
            else node = node.right;
        }
        if (value < node.val) node.left = newNode;
        else if ((value > node.val)) node.right = newNode;
    }
    function remove(value) {
        let prevNode = dummy;
        let node = _root;
        while (node && prevNode) {
            if (node.val == value) {
                if (node.left) {
                    if (prevNode.val > value) prevNode.left = node.left;
                    else prevNode.right = node.left;
                    const right = node.right;
                    node = node.left;
                    while (node.right) node = node.right;
                    node.right = right;
                } else {
                    prevNode.left = node.right;
                }
                updateRoot()
                return
            }
            else if (node.val < value) {
                prevNode = node;
                node = node.right;
            } else {
                prevNode = node;
                node = node.left;
            }        
        }
    }
    function updateRoot () {
        _root = dummy.left
    }
    function find (value) {
        let node = _root;
        while (node) {
            if (node.val == value) return node
            else if (node.val > value) node = node.left
            else node = node.right
        }
    }
    function levelOrderTraversal (callback) {
        throwCallbackError(callback)
        let q = [_root];
        while (q.length) {
            const node = q.pop()
            if (!node) continue
            callback(node, node.left, node.right)
            q.unshift(node.left)
            q.unshift(node.right)
        }
    }
    function inOrder (callback) {
        throwCallbackError(callback)
        let stack = [];
        let curr = _root;

        while (curr || stack.length) {
            while (curr) {
                stack.push(curr);
                curr = curr.left
            }
            curr = stack.pop()
            callback(curr, curr.left, curr.right)
            curr = curr.right
        }

    }
    function preOrder (callback) {
        throwCallbackError(callback)
        let stack = [_root];
        while (stack.length) {
            let curr = stack.pop();
            if (!curr) continue
            callback(curr, curr.left, curr.right)
            stack.push(curr.right);
            stack.push(curr.left);
        }
    }

    function postOrder (callback) {
        throwCallbackError(callback)
        let visit = [false];
        let stack = [_root];
        while (stack.length) {
            const curr = stack.pop();
            const v = visit.pop();
            if (curr) {
                if (v) {
                    callback(curr, curr.left, curr.right);
                } else {
                    stack.push(curr, curr.right, curr.left);
                    visit.push(true, false, false);
                }
            }
        }
    }
    function height (value) {
        node = find(value);
        let count = -1;
        let q = [node];
        while (q.length) {
            const oldL = q.length;
            count++
            for (let n = 0; n < oldL; n++) {
                const curr = q.pop()
                if (!curr) continue
                q.unshift(curr.left);
                q.unshift(curr.right);
            }
        }
        return count - 1
    }
    function depth (value) {
        count = 0
        let curr = _root;
        while (curr) {
            if (curr.val == value) return count
            else if (curr.val > value) curr = curr.left
            else curr = curr.right
            count++
        }
    }
    function isBalanced () {
        let minHeight;
        let count = -1;
        q = [_root]
        while (q.length) {
            let oldL = q.length;
            if (minHeight && minHeight + 1 < count) return false
            for (let n = 0; n < oldL; n++) {
                const curr = q.pop()
                if (!curr) {
                    if (!minHeight) minHeight = count
                    continue
                }
                q.unshift(curr.left);
                q.unshift(curr.right);
            }
            count++
        }
        return true
    }
    function rebalance () {
        array = [];
        inOrder((node) => array.push(node.val));
        connectRoot()
    }
    function throwCallbackError (callback) {
        if (!callback) throw new Error("Callback function is required");
    }
    
    sortArray()
    removeDuplicates()
    connectRoot()
    
    
    return {        
        builtFromArray: array,
        getCurrArray: () => array,
        get root () {
            return dummy.left;
        },
        prettyPrint: () => prettyPrint(_root),
        insert,
        remove,
        find,
        levelOrderTraversal,
        inOrder,
        preOrder,
        postOrder,
        height,
        depth,
        isBalanced,
        printBalance: () => console.log("Balance state: ", isBalanced()),
        rebalance,
    }
}

function TreeNode (val, left=null, right=null) {
    return {
        val,
        left,
        right,
    }
}

// Driver section
function randomNumArray(arrLen, maxNum, minNum=0) {
    let arr = [];
    for (let n = 0; n < arrLen; n++) arr.push(Math.floor(Math.random() * (maxNum + 1 - minNum)) + minNum);
    return arr;
}

// Would be in Tree as static method if I wasn`t creating tree with factory function
function treePrint (node) {
    console.log(node.val);
}

a = Tree(randomNumArray(31, 100));
a.printBalance()
a.levelOrderTraversal(treePrint);
a.preOrder(treePrint);
a.inOrder(treePrint);
a.postOrder(treePrint);

randomNumArray(19, 200, 100).forEach((value) => a.insert(value));
a.printBalance()

a.rebalance()
a.printBalance()
a.levelOrderTraversal(treePrint);
a.preOrder(treePrint);
a.inOrder(treePrint);
a.postOrder(treePrint);