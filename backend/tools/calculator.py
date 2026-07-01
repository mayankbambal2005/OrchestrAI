import ast
import operator


SAFE_OPS = {
    ast.Add:  operator.add,
    ast.Sub:  operator.sub,
    ast.Mult: operator.mul,
    ast.Div:  operator.truediv,
    ast.Pow:  operator.pow,
    ast.Mod:  operator.mod,
    ast.USub: operator.neg,
}


def _eval(node):
    if isinstance(node, ast.Num):
        return node.n
    if isinstance(node, ast.Constant):
        return node.value
    if isinstance(node, ast.BinOp):
        return SAFE_OPS[type(node.op)](_eval(node.left), _eval(node.right))
    if isinstance(node, ast.UnaryOp):
        return SAFE_OPS[type(node.op)](_eval(node.operand))
    raise ValueError(f"Unsupported operation: {type(node)}")


def calculate(expression: str) -> str:
    """Safely evaluate a math expression string."""
    try:
        tree   = ast.parse(expression, mode="eval")
        result = _eval(tree.body)
        return str(result)
    except Exception as e:
        return f"Calculation error: {str(e)}"
