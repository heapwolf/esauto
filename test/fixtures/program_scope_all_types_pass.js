var v1 = new Date()
var v2 = new Date()
var v3 = true
var v4 = {}
var v5 = []
var v6 = /RE/
var v7 = null
var v8 = undefined
let l1 = 1
let l2 = 'hello'

v2 = v1
v1 = v2
v3 = false
v3 = true
v3 = v3
v4 = { hello: true }
v5 = [1,2,3]
v6 = /OK/
v7 = null // TODO fix this
l1 = 0
l2 = 'goodbye'

function f0() {
  v2 = v1
  v1 = v2
  v3 = false
  v3 = true
  v3 = v3
  l1 = 0
  l2 = 'goodbye'
}

//
// TODO fail this!
//
var f1 = function() {
  v2 = v1
  v1 = v2
  v3 = false
  v3 = true
  v3 = v3
  l1 = 0
  l2 = 'goodbye'
}
