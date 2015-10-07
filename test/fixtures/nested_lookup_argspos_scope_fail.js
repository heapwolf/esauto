
function f0(_, _, a0) {
  function f1() {
    function f2() {
      a0 = true
    }
  }
}

//
// Successfully determine that literal is a number
// by finding the fist caller in a parent scope.
//
f0(null, null, 10)

