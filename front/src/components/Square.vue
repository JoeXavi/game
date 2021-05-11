<template>
  <button class="square" :class="[ value, { 'winner': winner } ]"
    :disabled="disabled" @click="click" ref="square">{{value}}</button>
</template>

<script>
export default {
  name: 'Square',
  props: {
    value: String,
    winner: Boolean,
    disabled: Boolean,
    
  },
  data() {
    return {
      emit:true
    }
  },
  methods: {
    click () {
        if(this.emit)
        this.$emit('click')
    }
  },
  created() {
    this.$bus.$on('move',()=>{
      this.emit = false
      this.$refs.square.click()
    })

    
  },
}
</script>

<style scoped>
.square {
  background: #fff9;
  background-blend-mode: exclusion;
  background-image: var(--noise-pattern);
  border: 1px solid #fffc;
  font-size: 15vmin;
  font-weight: bold;
  line-height: 34px;
  padding: 0;
  text-align: center;
  box-shadow: inset 0 0 0 #0004;
  text-shadow: -1px -1px 1px #fff, -1px 1px 1px #fff, 1px -1px 1px #fff, 1px 1px 1px #fff;
  transition: all .25s ease;
  outline: none;
}

.square.winner {
  background: #8885;
}

.square:not([disabled]):empty:hover,
.square:not([disabled]):empty:focus {
  box-shadow: inset 0 2px 25px #0006;
  cursor: pointer;
}

.square:not([disabled]):empty:active {
  box-shadow: inset 0 2px 50px #0008;
}

.square.X {
  color: #6758bb;
}

.square.O {
  color: #1f73bd;
}
</style>
