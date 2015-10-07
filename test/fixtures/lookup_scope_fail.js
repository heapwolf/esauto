
function f0(a0) {
  a0 = 's1'
}

//
// Successfully determine that literal is a number
// by finding the fist caller in a parent scope.
//
f0(10)

