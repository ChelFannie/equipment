class loginValidate {
  static createCode () {
    let code = ''
    let codeLength = 4
    let random = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    for (let i = 0; i < codeLength; i++) {
      let index = Math.floor(Math.random() * 36)
      code += random[index]
    }
    return code
  }
}

export default loginValidate
