var esauto = require('../index')
var test = require('tape')
var fs = require('fs')

var root = __dirname + '/fixtures'

test('program scope pass', function(t) {
  var warnings = esauto(fs.readFileSync(root + '/program_scope_pass.js'))
  t.equal(warnings.length, 0)
  t.end()
})

test('program scope fail', function(t) {
  var actual = esauto(fs.readFileSync(root + '/program_scope_fail.js'))

  var expected = [{ variable: 'v1',
    initialized: 'Number',
    reassigned: 'String',
    loc: { line: 2, column: 0 } 
  }]

  t.deepEqual(actual, expected)
  t.end()
})

test('multiple warnings from program scope fail', function(t) {
  var actual = esauto(fs.readFileSync(root + '/program_scope_multiple_warnings.js'))

  var expected = [
    {
      variable: 'v1',
      initialized: 'Number',
      reassigned: 'String',
      loc: { line: 4, column: 0 } 
    },
    { 
      variable: 'v2',
      initialized: 'Array',
      reassigned: 'Boolean',
      loc: { line: 5, column: 0 } 
    },
    { 
      variable: 'v3',
      initialized: 'Object',
      reassigned: 'Number',
      loc: { line: 6, column: 0 } 
    } 
  ]

  t.deepEqual(actual, expected)
  t.end()
})

test('function scope pass', function(t) {
  var warnings = esauto(fs.readFileSync(root + '/function_scope_pass.js'))
  t.equal(warnings.length, 0)
  t.end()
})

test('function scope fail', function(t) {
  var actual = esauto(fs.readFileSync(root + '/function_scope_fail.js'))

  var expected = [{
    variable: 'v1',
    initialized: 'Number',
    reassigned: 'String',
    loc: { line: 3, column: 2 }
  }]

  t.deepEqual(actual, expected)
  t.end()
})

test('nested function scope pass', function(t) {
  var warnings = esauto(fs.readFileSync(root + '/nested_function_scope_pass.js'))
  t.equal(warnings.length, 0)
  t.end()
})

test('nested function scope fail', function(t) {
  var actual = esauto(fs.readFileSync(root + '/nested_function_scope_fail.js'))

  var expected = [{ 
    variable: 'v1',
    initialized: 'Number',
    reassigned: 'String',
    loc: { line: 5, column: 4 } 
  }]

  t.deepEqual(actual, expected)
  t.end()
})

test('lookup function scope pass', function(t) {
  var warnings = esauto(fs.readFileSync(root + '/lookup_scope_pass.js'))
  t.equal(warnings.length, 0)
  t.end()
})

test('lookup function scope fail', function(t) {
  var actual = esauto(fs.readFileSync(root + '/lookup_scope_fail.js'))

  var expected = [{ 
    variable: 'a0',
    initialized: 'Number',
    reassigned: 'String',
    loc: { line: 3, column: 2 } 
  }]

  t.deepEqual(actual, expected)
  t.end()
})

test('nested lookup function scope pass', function(t) {
  var warnings = esauto(fs.readFileSync(root + '/nested_lookup_scope_pass.js'))
  t.equal(warnings.length, 0)
  t.end()
})

test('nested lookup function scope fail', function(t) {
  var actual = esauto(fs.readFileSync(root + '/nested_lookup_scope_fail.js'))

  var expected = [{ 
    variable: 'a0',
    initialized: 'Number',
    reassigned: 'String',
    loc: { line: 5, column: 6 } 
  }]

  t.deepEqual(actual, expected)
  t.end()
})

test('nested lookup function args in different positions scope pass', function(t) {
  var warnings = esauto(fs.readFileSync(root + '/nested_lookup_argspos_scope_pass.js'))
  t.equal(warnings.length, 0)
  t.end()
})

test('nested lookup function literal args in different positions scope fail', function(t) {
  var actual = esauto(fs.readFileSync(root + '/nested_lookup_argspos_scope_fail.js'))

  var expected = [{ 
    variable: 'a0',
    initialized: 'Number',
    reassigned: 'Boolean',
    loc: { line: 5, column: 6 } 
  }]

  t.deepEqual(actual, expected)
  t.end()
})

test('nested lookup function named args pass', function(t) {
  var warnings = esauto(fs.readFileSync(root + '/nested_lookup_named_scope_pass.js'))
  t.equal(warnings.length, 0)
  t.end()
})

test('nested lookup function named args fail', function(t) {
  var actual = esauto(fs.readFileSync(root + '/nested_lookup_named_scope_fail.js'))

  var expected = [{ 
    variable: 'a0',
    initialized: 'Object',
    reassigned: 'Boolean',
    loc: { line: 5, column: 6 } 
  }] 

  t.deepEqual(actual, expected)
  t.end()
})

test('all types', function(t) {
  var warnings = esauto(fs.readFileSync(root + '/program_scope_all_types_pass.js'))
    console.log(warnings)
  t.equal(warnings.length, 0)
  t.end()
})

test('lookup function expression scope pass', function(t) {
  var warnings = esauto(fs.readFileSync(root + '/lookup_function_expression_scope_pass.js'))
  t.equal(warnings.length, 0)
  t.end()
})

