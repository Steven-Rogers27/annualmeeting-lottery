import random from 'random'

export function createRandom(source: number[][]) {
  const result = []
  let i = 0,
    min = 0,
    max = 0,
    batch = source.length

  while (i < batch) {
    min = 0
    max = source[i].length - 1   
    const rIdx = random.int(min, max)
    result[i] = {
      value: source[i][rIdx],
      index: rIdx
    } 
    i++
  }
  return result
}

export function createSource(count: number[]) {
  const source = []
  let i = 0
  while(i < count.length) {
    const max = count[i]
    let j = 0
    const item = []
    while(j < max) {
      item[j] = j++
    }
    source.push(item)
    i++
  }

  return source
}