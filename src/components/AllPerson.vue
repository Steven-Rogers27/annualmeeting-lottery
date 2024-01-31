<script setup lang="ts">
import { createRandom, createSource } from '../utils/generator'
import { ref } from 'vue'
import person from '../assets/person.json'

let batch = 1,
  max = person.length

const round = ref(0)
const source = ref<number[][]>([]) 
const result = ref<{value: number, index: number}[]>([])

const status = ref(2) // 0 停止，1 开始，2 重置
const onStatusClick = (s: number) => {
  if (!source.value[0].length) {
    window.alert('奖池已空，请重置')
    return
  }

  if (s) {
    // 展示结果
    status.value = 0
    result.value = createRandom(source.value!)
    console.log(result.value)
    source.value!.forEach((arr, idx) => {
      arr.splice(result.value![idx].index, 1)
    })
  } else {
    // 开始滚动动画
    setTimeout(initSourceNodeList)
    setTimeout(rollupAnimation)
    result.value.length = 0
    status.value = 1
    round.value++
  }
}
const onReset = () => {
  source.value = createSource(new Array(batch).fill(max))
  result.value.length = 0
  status.value = 2
}
const initSourceNodeList = () => {
  const unitList = document.querySelectorAll('.unit')
  for (const unit of unitList) {
    const callback = () => {
      const { height: unitHeight } = unit.children[0].getBoundingClientRect()
      let y = 0
      for (const value of unit.children) {
        value.setAttribute('style', `
          transform: translateY(${y}px)
        `)
        y += unitHeight
      }
    }
    requestAnimationFrame(callback)
  }
}
onReset()

const rollupAnimation = () => {
  const unitList = document.querySelectorAll('.unit')
  for (const unit of unitList) {
    const callback = () => {
      const { height: unitHeight } = unit.children[0].getBoundingClientRect()
      let lastY = 0
      for (const value of unit.children) {
        const cs = getComputedStyle(value)
        const transform = cs.transform
        const reg = /^matrix\((.+)\)$/
        const res = reg.exec(transform)
        let y = 0
        if (res) {
          const vList = res[1].split(',').map(Number)
          y = vList[5]
        }
        if (y <= -unitHeight) {
          if (!lastY) {
            const cs = getComputedStyle(unit.children[unit.children.length - 1])
            const transform = cs.transform
            const res = reg.exec(transform)
            if (res) {
              lastY = res[1].split(',').map(Number)[5]
            }
          }
          y = lastY + unitHeight
        }
        y -= 50
        value.setAttribute('style', `
          transform: translateY(${y}px)
        `)
        lastY = y
      }

      if (status.value) {
        requestAnimationFrame(callback)
      }
    }
    requestAnimationFrame(callback)
  }
}
</script>

<template>
  <span
    class="reset-button"
    @click="onReset"
  >重置</span>
  <div
    class="wrapper"
  >
    <template
      v-if="status == 0"
    >
      <div
        v-for="(v,i) in result"
        :key="i"
        class="unit"
      >
        <div class="unit__value">{{ person[v.value] }}</div>
      </div>
    </template>
    <template
      v-else-if="status == 1"
    >
      <div
        v-for="(u, i) in source"
        :key="i"
        class="unit"
      >
        <div
          v-for="(v, k) in u"
          :key="k"
          class="unit__value"
        >
          {{ person[v] }}
        </div>
      </div>
    </template>
    <template
      v-else
    >
      <div class="choujiangzhong--beijing">
        <div class="zhuanpan"></div>
        <div class="choujiangzhong">
        </div>
      </div>
    </template>
  </div>
  <div
    class="bottom"
  >
    <template
      v-if="status == 1"
    >
      <button
        @click="() => onStatusClick(1)"
        class="status-button"
      >停止</button>
    </template>
    <template
      v-else
    >
      <button
        @click="() => onStatusClick(0)"
        class="status-button"
      >开始</button>
    </template>
  </div>
</template>

<style scoped lang="scss">
.reset-button {
  position: absolute;
  top: 1%;
  right: 3%;
  color: #fff;
  font-size: 14px;
  font-family: 'Microsoft YaHei';
  cursor: pointer;
}
.wrapper {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 10% 17% 14%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  $uniWidth: 100%;
  $unitHeight: 30vh; 
  .unit {
    position: relative;
    width: $uniWidth;
    height: $unitHeight;
    border: 2px solid hsl(59, 92%, 50%);
    overflow: hidden;
    .unit__value {
      position: absolute;
      width: $uniWidth;
      height: $unitHeight;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 6vmax;
      color: #fff;
      font-family: 'Microsoft YaHei';
    }
  }
  .choujiangzhong--beijing {
    width: 100%;
    height: 100%; 
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    .zhuanpan {
      width: 25vw;
      height: 25vw; 
      background-image: url('../assets/zhuanpan.png');
      background-size: contain;
      background-repeat: no-repeat;
      transform-origin: 50% 50%;
      transform-box: fill-box;
      animation: loading 2s linear infinite;
    }
    @keyframes loading {
      0% {
        transform: rotate(0deg);
      } 
      100% {
        transform: rotate(360deg);
      }
    }
    .choujiangzhong {
      position: absolute;
      left: 50%;
      top: 65%;
      transform: translate(-50%, -50%);
      width: 40vw;
      height: 40vw; 
      background-image: url('../assets/choujiang.png');
      background-size: contain;
      background-repeat: no-repeat;
    }
  }
}
.bottom {
  position: absolute;
  bottom: 9%;
  width: 100%;
  display: flex;
  justify-content: center;
  .status-button {
    cursor: pointer;
    background-color: #fff;
    width: 15%;
    height: 15%;
    border: none !important;
  }
}
</style>

