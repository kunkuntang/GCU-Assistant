function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function Vadidator () {
  let strategies = {
    required(value, errorMsg) {
      return value === '' ? errorMsg : void 0
    },
    minLength(value, length, errorMsg) {
      return value.length < length ?
        errorMsg : void 0
    }
  }
  let cache = []
  let add = (value, rules) => {
    for (let rule of rules) {
      let strategyAry = rule.strategy.split(':') //例如['minLength',6]
      let errorMsg = rule.errorMsg //'用户名不能为空'
      cache.push(() => {
        let strategy = strategyAry.shift() //用户挑选的strategy
        strategyAry.unshift(value) //把input的value添加进参数列表
        strategyAry.push(errorMsg) //把errorMsg添加进参数列表，[value,6,errorMsg]
        return strategies[strategy].apply(value, strategyAry)
      })
    }
  }
  let start = () => {
    for (let validatorFunc of cache) {
      let errorMsg = validatorFunc()//开始校验，并取得校验后的返回信息
      if (errorMsg) {//r如果有确切返回值，说明校验没有通过
        return errorMsg
      }
    }
  }

  return {
    add,
    start
  }
}

module.exports = {
  formatTime: formatTime,
  Vadidator
}
