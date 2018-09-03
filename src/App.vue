<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isRouterAlive: true
    }
  },
  mounted () {
    console.log = (function (oriLogFunc) {
      return function () {
        // [...arguments].map(val => {
        //   val.stack
        //     ? localStorage.setItem('aaaaa', JSON.stringify(val.stack))
        //     : localStorage.setItem('aaaaa', JSON.stringify(val))
        // })
        oriLogFunc.call(console, ...arguments)
      }
    })(console.log)
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style>
html, body {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  list-style: none;
  background-color: #eeeeee;
}
a {
  text-decoration: none;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #000;
  width: 100%;
  height: 100%;
}
</style>
