<template>
  <div class="board" v-if="squares">
    <div class="container" v-if="!game">
      <div class="row h-100 mh-100 align-self-center pt-4"> 
        <div class="col-12 text-center current-games">
        <h2>Ingresa tu nombre</h2>
          <div class="row mt-3">
            <div class="offset-2 col-8">
              <b-form >
                <b-form-input
                  id="inline-form-input-name"
                  class="mb-2 mr-sm-2 mb-sm-0"
                  placeholder="Ingresa tu nombre aqui..."
                  v-model="user"
                ></b-form-input>
              </b-form>
            </div>
          </div>
          <hr>
          <div class="row mt-3 content-games">
            <p>Selecciona una partida!</p>
            <div class="col-5"><b>Sala</b></div>
            <div class="col-2"><b>Estado</b></div>
            <div class="col-2"><b>Ganador</b></div>
            <div class="col-3"><b>Accion</b></div>
            <template v-for="game in games"> 
              <div class="col-5 align-self-center mt-1">{{game.participants.creator.name}} <br><small>{{game._id}}</small></div>
              
              <div class="col-2 align-self-center mt-1">{{game.status}}</div>
              <div class="col-2 align-self-center mt-1" >{{winnerf(game)}}</div>
              
              <div class="col-3 align-self-center mt-1"><b-button variant="primary" v-if="game.status === 'Active'" @click="joinGame(game._id)">Ingresar</b-button></div>
            </template>
          </div>
          <hr>
          <div class="row mt-3">
            <div class="offset-2 col-8">
                <p>o Crea una partida!</p>
                <b-button variant="primary" @click="createGame()">  Crear partida  </b-button>
              
            </div>
          </div>

        </div>
      </div>
    </div>
    <template v-if="game">
      <div v-for="row in 3" :key="row" class="board-row">
        <square v-for="i in 3" :key="indexByRow(i, row)"
          :value="squares[indexByRow(i, row)]"
          :disabled="!!winner || disabled"
          :winner="!!winner && winner.includes(indexByRow(i, row))"
          @click="click(i, row)" />
      </div>
    </template>
  </div>
  
</template>

<script>
export default {
  name: 'Board',
  data() {
    return {
      game:false,
      games:[],
      user:'',
      currentGame:{} ,
      disabled: false
      }
  },
  props: {
    squares: Array,
    winner: Array
  },
  components: {
    Square: () => import('./Square')
  },
  created() {
    this.getGames()
    this.$bus.$on('disable',(data)=>{
      this.disabled = data
    })

    this.$bus.$on('updateGamesLocal',()=>{
      this.getGames()
    })
  },
  computed:{
    
  },
  methods: {

    winnerf(game){
      if(game.winner === 'creator')
        return game.participants.creator.name
      if(game.winner === 'guess')
        return game.participants.guess.name
      
      return ''
    },
    
    indexByRow (index, row, max = 3) {
      
      return (row * max + index) - (max + 1)
    },

    click (index, row) {
      this.$emit('click', this.indexByRow(index, row));
    },
    validateUser(){
      if(this.user === '')
        return false
      else  return true
    },
    async joinGame(id){
      if(!this.validateUser()){
        alert('Falta Ingresar nombre')
        return
      }
      try{
        const user = await axios.post(`/users`,{name:this.user})
        const game = await axios.get(`/games/${id}`)
        const gameToJoin = game.data.body
        const toCreate = {
          "participants":{
            ...gameToJoin.participants,
            "guess":{
              "_id":user.data.body._id,
              "name":user.data.body.name
            }
          }
        }
        const gameUpdate = await axios.put(`/games/${id}`,toCreate)
        this.currentGame = game.data.body
        this.mqttConect({game:this.currentGame,who:'guess'})
        this.getGames()
        this.game = true
      }catch(e){alert(e)}
      
    },
    mqttConect(game){
      //console.log("gameSend",game)
      this.$emit('conect',game)
    },
    async createGame(){
      if(!this.validateUser()){
        alert('Falta Ingresar nombre')
        return}
      try{
        const user = await axios.post(`/users`,{name:this.user})
        const toCreate = {
          "participants":{
            "creator":{
              "_id":user.data.body._id,
              "name":user.data.body.name
            }
          }
        }
        const game = await axios.post(`/games`,toCreate)
        
        this.currentGame = game.data.body
        this.mqttConect({game:this.currentGame,who:'creator'})
        this.getGames()
        this.game = true
        this.$bus.$emit('updateGames')

      }catch(e){
        alert(e)
      }
      
    },
    getGames(){
      axios.get(`/games`).then(res=>{
        this.games = res.data.body
      })
    },
  }
}
</script>

<style scoped>
.content-games{
  max-height: 25vmin;
  overflow-y: scroll;
}
.current-games{
  color:#fff;
}
.board {
  margin:auto;
  border: 1rem solid #fff4;
  box-shadow: 2.5px 5px 25px #0004, 0 1px 6px #0006;
  border-radius: .5rem;
  width: 65vmin;
  height: 65vmin;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(3, 1fr);
  backdrop-filter: blur(10px);
  background-blend-mode: exclusion;
  background-image: var(--noise-pattern);
}

.board-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr;
}
</style>
