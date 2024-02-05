function preprocessPythonCode(code) {
  // Remove single-line comments
  code = code.replace(/#.*/g, "")

  // Remove multiline comments
  code = code.replace(/'''[\s\S]*?'''/g, "")
  code = code.replace(/"""[\s\S]*?"""/g, "")

  // Remove whitespaces
  // code = code.replace(/\s+/g, '');

  return code
}

// list of keywords
const keywords = [
  "def",
  "and",
  "as",
  "assert",
  "break",
  "class",
  "continue",
  "def",
  "del",
  "elif",
  "else",
  "except",
  "False",
  "finally",
  "for",
  "from",
  "global",
  "if",
  "import",
  "in",
  "is",
  "lambda",
  "None",
  "nonlocal",
  "not",
  "or",
  "pass",
  "raise",
  "return",
  "True",
  "try",
  "while",
  "with",
  "yield",
]

const builtInFunctions = [
  "abs",
  "aiter",
  "all",
  "any",
  "anext",
  "ascii",
  "bin",
  "bool",
  "breakpoint",
  "bytearray",
  "bytes",
  "callable",
  "chr",
  "classmethod",
  "compile",
  "complex",
  "delattr",
  "dict",
  "dir",
  "divmod",
  "enumerate",
  "eval",
  "exec",
  "filter",
  "float",
  "format",
  "frozenset",
  "getattr",
  "globals",
  "hasattr",
  "hash",
  "help",
  "hex",
  "id",
  "input",
  "int",
  "isinstance",
  "issubclass",
  "iter",
  "len",
  "list",
  "locals",
  "map",
  "max",
  "memoryview",
  "min",
  "next",
  "object",
  "oct",
  "open",
  "ord",
  "pow",
  "print",
  "property",
  "range",
  "repr",
  "reversed",
  "round",
  "set",
  "setattr",
  "slice",
  "sorted",
  "staticmethod",
  "str",
  "sum",
  "super",
  "tuple",
  "type",
  "vars",
  "zip",
  "__import__",
]

function tokenizeCode(preprocessedCode) {
  const variablePattern =
    /[A-Za-z_][A-Za-z0-9_]*(?=(?:(?:[^"']*["'][^"']*["'])*[^"']*$))/g

  const tokens = preprocessedCode.match(variablePattern)
  
  // Remove tokens that are keywords or built-in functions
  const filteredTokens = tokens.filter(token => {
    return !keywords.includes(token) && !builtInFunctions.includes(token)
  })
  
  // Remove tokens starting with a number
  const finalTokens = filteredTokens.filter(token => isNaN(token.charAt(0)))

  return finalTokens
}

function calculateTokenSimilarity(tokens1, tokens2) {
  const set1 = new Set(tokens1)
  const set2 = new Set(tokens2)

  const intersection = new Set([...set1].filter((token) => set2.has(token)))

  const union = new Set([...set1, ...set2])

  const similarity = (intersection.size / union.size) * 100

  return similarity > 100 ? 100 : similarity.toFixed(1)
}

module.exports = {
  preprocessPythonCode,
  tokenizeCode,
  calculateTokenSimilarity,
}
