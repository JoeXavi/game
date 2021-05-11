<template>
  <div class="game">
    <div class="game-area">
      <div class="game-title">
        <img src="logo.svg" alt="Vue" />
        <h1>Tik Tak Toe</h1>
      </div>

      <board :squares="squares" :winner="winner" @click="click" @conect="conectMqtt"/>

      <div class="game-info">
        <p v-if="stepNumber === 0">
          Vamos comenzar! Comienza&nbsp;<b :class="currentPlayer">{{ currentPlayer }}</b>! <template v-if="stepNumber===0">
          - Tu eres {{who}}</template>  
        </p>
        <p v-else-if="!!winner">
          El vencedor es:&nbsp;
          <b :class="currentPlayer">{{ currentPlayer }}</b>!&nbsp;
          <button @click="clickRestart">Jugar nuevamente</button>
        </p>
        <p v-else-if="stepNumber > 8">
          Nuevamente!&nbsp;
          <button @click="clickRestart">Jugar nuevamente</button>
        </p>
        <p v-else>
          Ahora el jugador&nbsp;
          <b :class="currentPlayer">{{ currentPlayer }}</b>!&nbsp;.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Game',
  components: {
    Board: () => import('./Board')
  },
  data () {
    return {
      topic:'',
      squares: Array(9).fill(null),
      stepNumber: 0,
      currentPlayer: 'X',
      winner: null,
      who: 'X',
      init : 'X'
    }
  },
  created() {
    this.conectMqtt(null)
    this.$bus.$on('updateGames',()=>{
      this.mqtt2.publish('gametest', JSON.stringify({"message":"updateGames"}))
    })
  },
  methods: {
    conectMqtt(game){
      if(!game){
        const mqtt = this.$mqtt()
        this.mqtt2 = mqtt
        this.mqtt2.subscribe('gametest', function (err, res) {
          if (err) {
            console.log('🚨 Error when subscribing to topic ' + topic + ': ' + err);
            return;
          } 
          else {
              console.log("subscribed", res)
          }  
          
        })
        const self = this
        mqtt.on('message', function (topic, message) {
          const messageJSON = JSON.parse(message.toString())
          if(messageJSON.message === 'updateGames'){
            self.$bus.$emit('updateGamesLocal')
            return
          }
        })
        return
      }

      const mqtt = this.$mqtt()
      this.mqtt = mqtt
      this.topic = `game/${game.game._id}`
      if(game.who !== 'creator'){
        this.who = 'O' 
         
        this.$bus.$emit('disable', true)
      }else {
       
      }
      

      this.mqtt.subscribe(this.topic, function (err, res) {
        if (err) {
            console.log('🚨 Error when subscribing to topic ' + topic + ': ' + err);
            return;
        } 
        else {
            console.log("subscribed", res)
        }    
      })
      const self = this
      mqtt.on('message', function (topic, message) {
        
        const messageJSON = JSON.parse(message.toString())
        if(messageJSON.message === 'updateGames'){
          self.$bus.$emit('updateGamesLocal')
          return
        }
        if(messageJSON.message === 'restart'){
          self.restart()
          return
        }
        if(self.who != messageJSON.who){
          if (self.squares[messageJSON.move] || self.winner) return
          self.$set(self.squares, messageJSON.move, messageJSON.who)
          self.$bus.$emit('disable', false)
          if (!self.hasWinner()) {
            self.stepNumber++
            self.currentPlayer = self.currentPlayer === 'X' ? 'O' : 'X'
          }
        }
    });
    },
    hasWinner() {
      if (this.winner) return true

      const squares = this.squares
      const matches = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7],
        [2, 5, 8], [0, 4, 8], [2, 4, 6]
      ]

      for (let i = 0; i < matches.length; i++) {
        const [a, b, c] = matches[i]
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
          this.winner = [ a, b, c ]
          return true
        }
      }

      return false
    },
    clickRestart(){
      this.mqtt.publish(this.topic, JSON.stringify({"message":"restart"}))
      this.init = this.init === 'X' ? 'O' : 'X'
      this.restart()
    },
    restart() {
      this.init = this.init === 'X' ? 'O' : 'X'
      this.currentPlayer = this.init
      this.squares = Array(9).fill(null)
      this.stepNumber = 0
      if(this.init === this.who)
        this.$bus.$emit('disable', false)
      else
        this.$bus.$emit('disable', true)

      this.winner = null

    },

    click (i) {
      if(this.who === this.currentPlayer)
        this.mqtt.publish(this.topic, JSON.stringify({"message":"Move","move": i,"who":this.who}))
      if (this.squares[i] || this.winner) return
      this.$set(this.squares, i, this.currentPlayer)
      if (!this.hasWinner()) {
        this.stepNumber++
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X'
      }
      this.$bus.$emit('disable', true)
      
      
      
    }
  }
}
</script>

<style scoped>
.game {
  
  background: linear-gradient(rgba(149,66,212,.0), rgba(88,177,245,.0)), url('../assets/2038428.png');
  
  overflow: hidden;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}


.game-area {
  display: flex;
  flex-flow: column;
}

.game-title {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 0 3vmin;
}

.game-title img {
  margin: 0 12px 0 -20px;
  width: 40px;
  filter: drop-shadow(-1px 1px 0 #0007) drop-shadow(1px -1px 0 #0007) drop-shadow(1px 1px 0 #0007);
}

.game-title h1 {
  margin: 0;
  font-size: 2.25em;
  color: rgba(var(--theme-color));
  text-shadow: -1px -1px 1px #fff, -1px 1px 1px #fff, 1px -1px 1px #fff, 1px 1px 1px #fff;
}

.game-info {
  margin: 3vmin 0 0;
  padding: 1rem .5rem;
  font-size: 1.25em;
  text-align: center;
  box-shadow: 2.5px 5px 25px #0001, 0 1px 6px #0004;
  text-shadow: 0 0 1px #fff, 0 2px 5px #fff5;
  border-radius: .5rem;
  backdrop-filter: blur(10px);
  background: #fff6;
  background-blend-mode: exclusion;
  background-image: var(--noise-pattern);
  color: #111;
}

.game-info p {
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.game-info .X,
.game-info .O {
  text-shadow: -1px -1px 0 #000b, -1px 1px 0 #000b, 1px -1px 0 #000b, 1px 1px 0 #000b;
}

.game-info .X {
  color: #6758bb;
}

.game-info .O {
  color: #1f73bd;
}

.game-info button {
  text-transform: uppercase;
  font-weight: 600;
  font-size: .75em;
  padding: .5rem 1rem;
  margin: -.5rem 0 -.5rem 1rem;
  border: 2px solid #fff;
  background: #fff5;
  text-shadow: 0 0 1px #fff, 0 2px 5px #fff5;
  color: #111;
  cursor: pointer;
  outline: none;
  transition: all .25s ease;
}

.game-info button:focus,
.game-info button:hover {
  background: #1115;
  border-color: rgba(var(--theme-color));
  box-shadow: 0 0 10px rgba(var(--theme-color), .75);
  color: rgba(var(--theme-color));
  text-shadow: -1px -1px 0 #0007, -1px 1px 0 #0007, 1px -1px 0 #0007, 1px 1px 0 #0007;
}

.game-info button:active {
  background: #1119;
}
</style>