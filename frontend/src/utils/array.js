
const groupBy = function (arr, key) {
  const result = [];
  arr.forEach(item =>
    (result[item[key]] = result[item[key]] || []).push(item)
  )

  return Object.entries(result)
};

const array = {
  groupBy
}

export default array
