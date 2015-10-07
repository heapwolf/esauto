'use strict'
const esprima = require('esprima')
const traverse = require('traverse')

Object.prototype.forEach = function(cb) {
  Object.keys(this).forEach(k => cb(this[k], k))
}

function createAST(x, opts) {

  let index = 0

  let template = { 
    variables: {}, // variables for this scope
    params: [], // parameters for this scope
    calls: [], // calls made from this scope
    scopes: {}, // scopes inside this scope
    assignments: [] // assignments done in this scope
  }

  let tree = JSON.parse(JSON.stringify(template))

  let ast = esprima.parse(x, { loc: true })

  function createsNewScope(node) {
    return node.type === 'FunctionDeclaration' ||
      node.type === 'FunctionExpression' ||
      node.type === 'Program'
  }

  function getType(v) {

    if (v !== null) {
      if (typeof v == 'object' && v.type) {
        if (v.type == 'NewExpression') {
          return v.callee.name
        }
        if (v.type == 'ArrayExpression') {
          return 'Array'
        }
        else if (v.type == 'ObjectExpression') {
          return 'Object'
        }
      }
      if (v && v.value) v = v.value
    }

    return ({}).toString.call(v).split(' ')[1].slice(0, -1)
  }

  function traverse(ast, p) {
    let name 

    if (createsNewScope(ast)) {
      if (ast.type == 'Program') name = 'program'
      else name = ast.id && ast.id.name
      if (!name) name = ("anonymous" + index++)
      p = p.scopes[name] = p.scopes[name] || 
        JSON.parse(JSON.stringify(template))
    }

    if (ast.type == 'CallExpression') {
      let args = ast.arguments.map(function(arg) {
        if (arg.value) {
          return { name: 'Literal', type: getType(arg.value) }
        }
        else {
          return { name: arg.name, type: 'Unknown' }
        }
      })
      p.calls.push({ callee: ast.callee.name, arguments: args })
    }

    if (ast.type == 'AssignmentExpression') {

      let right = (typeof ast.right.value !== 'undefined') 
        ? ast.right.value
        : ast.right

      p.assignments.push([
        ast.left.name,
        (ast.right.type == 'Identifier') 
          ? { lookup: right.name } 
          : getType(right),
        opts.verbose
          ? ast.loc
          : ast.loc.start
      ])
    }

    if (ast.type && ast.type == 'FunctionDeclaration' || ast.type == 'FunctionExpression') {
      ast.params.forEach(function(param) {
        p.params.push(param.name)
        p.variables[param.name] = 'Unknown'
      })
    }

    if (ast.type && ast.type == 'VariableDeclaration') {
      ast.declarations.forEach(function(dec) {
        if (dec.init) {

          if (dec.init.type == 'FunctionExpression') {
            //
            // if name is annonymous 
            //
            if (dec.id && dec.id.name) {
              dec.init.id = { name: dec.id.name }
            }
            traverse(dec.init, p)
          }

          let t = getType(dec.init)
          p.variables[dec.id.name] = t
        }
      })
    }

    ast.forEach(function(val, key) {

      if (val !== null && (val.body || key == 'body' || val.type)) {
        traverse(val, p)
      }
    })
  }

  traverse(ast, tree)
  return tree
}

module.exports = function(x, opts) {

  opts = opts || {}

  let ast = createAST(x, opts)
  let warnings = []

  traverse(ast).forEach(function(scope) {

    //
    // TODO
    // Also check for return type consistency
    //
    let that = this

    function lookupVariableType(variableName, scope, ctx) {
      if (!scope) return

      let type = scope.variables[variableName]
      if (type && type != 'Unknown') return type

      let paramIndex = scope.params.indexOf(variableName)
      let previousScope = ctx.parent && ctx.parent.parent.node
      let previousCtx = ctx.parent && ctx.parent.parent

      if (paramIndex > -1) {
        let scopeName = ctx.key
        return lookupCaller(scopeName, paramIndex, previousScope, previousCtx)
      }

      return lookupVariableType(variableName, previousScope, previousCtx)
    }

    function lookupCaller(scopeName, paramIndex, scope, ctx) {
      if (!scope) return

      let type
      let i = 0

      scope.calls.some(function (call) {
        if (call.callee == scopeName) {

          function eachArgument(arg, callIndex) {

            if (paramIndex == callIndex) {
              type = (arg.type == 'Unknown')
                ? lookupVariableType(arg.name, scope, ctx)
                : type = arg.type
            }
          }

          call.arguments.forEach(eachArgument)     
        }
      })

      return type
    } 

    if (scope && scope.variables) {
      scope.variables.forEach(function(val, key) {
        if (val == 'Unknown') {
          scope.variables[key] = lookupVariableType(key, scope, that)
          that.update(scope)
        }
      })
    }

    if (scope && scope.assignments) {
      scope.assignments.forEach(function(val, key) {

        let name = val[0]
        let type = val[1]
        let loc = val[2]

        if (type.lookup) {
          type = lookupVariableType(type.lookup, scope, that)
        }

        let t = (scope.variables[name] ||
          lookupVariableType(name, scope, that))

        if (t == type) return

        warnings.push({ 
          variable: name,
          initialized: t, 
          reassigned: type, 
          loc: loc 
        })
      })
    }

  })

  return warnings
}

