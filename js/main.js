var game = new Vue({
  el:'.container',
  data:{
    food:-1,
    isStart:false,
    isSelectDiffcult:false,
    isFailedFlag:false,
    isShowScore:false,
    diffcult:120,
    score:-1,
    highScore:-1,
    headNumber:298,
    highScoreDiffcult:'',
    directing:'',
    randomContainer:[],
    directArr:[],
    gameObj:'',
    snakeArr:[],
    itemStyle:{
      width:'34px',
      height:'34px'
    },
    containerStyle:{
      width:'1152px',
      height:'648px'
    },
    btnStyle:{
      width:'',
      height:''
    },
    diffcultChoose:{
      marginTop:''
    },
    menuStyle:{
      marginTop:''
    },
    titleStyle:{
      fontSize:''
    },
    pStyle:{
      fontSize:''
    }
  },
  created:function(){
    this.init();
  },
  mounted:function(){
    this.initStyle();
    document.addEventListener("keydown",this.directionKey);
    window.addEventListener("resize",this.initStyle);
  },
  methods:{
    init:function(){
      for(var i=0;i<576;i++){
        if(i!=295&&i!=296&&i!=297&&i!=298){
          this.randomContainer.push(i);
        }
      }
    },
    initStyle:function(){
      console.log("改变了");
			var clientW = document.body.clientWidth*0.98;
      var ewidth = (clientW-clientW%32)/32;
      var itemWidth = ewidth-2;
      var height = ewidth*18;
      var width = ewidth*32;
      this.itemStyle = {
        width:itemWidth+'px',
        height:itemWidth+'px'
      }
      this.containerStyle={
        width:width+'px',
        height:height+'px'
      }
      this.btnStyle = {
        width:itemWidth*6+'px',
        height:itemWidth*2.5+'px',
        lineHeight:itemWidth*2.5+'px',
        fontSize:(itemWidth*0.8>24?24:itemWidth*0.8)+'px',
        margin:'0 '+itemWidth*1+'px'
      }
      this.diffcultChoose = {
        marginTop:itemWidth*3+'px'
      }
      this.menuStyle={
        marginTop:itemWidth*3+'px',
      }
      this.titleStyle={
        fontSize:((itemWidth)*2.5>=54?54:(itemWidth*2.5))+'px'
      }
      this.pStyle={
        fontSize:(itemWidth*0.8>24?24:itemWidth*0.8)+'px',
        marginBottom:(itemWidth*2.5>84?84:itemWidth*2)+'px'
      }
    },
    start:function(){
      console.log("开始计时了");
      this.isStart = true;
      this.isFailedFlag = false;
      this.snakeArr = [{
        num:295
      },{
        num:296
      },{
        num:297
      },{
        num:298
      }];
      this.directArr = [{
        name:'up',
        flag:false
      },{
        name:'down',
        flag:false
      },{
        name:'left',
        flag:false
      },{
        name:'right',
        flag:true
      }];
      this.init();
      this.showFood();
      this.gameObj = setInterval(this.GameStart, this.diffcult);
    },
    GameStart:function(){
      var _self = this;
      _self.headNumber = (this.snakeArr[(this.snakeArr.length)-1]).num+1;
      if(_self.isFailed(_self.headNumber)){
        this.GameFailed();
        clearInterval(this.gameObj);
        return;
      };
      _self.headNumber = (this.snakeArr[(this.snakeArr.length)-1]).num+1;
      var val = _self.headNumber;
      for (var i = 0; i < this.directArr.length; i++) {
        if(this.directArr[i].flag){
          if(this.directArr[i].name=='up'){
            val = val-32;
          }else if(this.directArr[i].name=='left'){
            val = val-1;
          }else if(this.directArr[i].name=='down'){
            val = val+32;
          }else{
            val = val+1;
          }
        }
      }
      if(val-1==this.food){
        this.eat(val-1);
      }else{
        for(var i=0;i<_self.snakeArr.length;i++){
          _self.process(_self.directionJudge(),i);
        }
      }
    },
    process:function(name,i){
      var _self = this;
      var count = _self.direCount(name);
      _self.directing = name;
      if(i== _self.snakeArr.length-1){
        _self.snakeArr[i].num = _self.snakeArr[i].num+count;
        return;
      }
      _self.snakeArr[i].num = _self.snakeArr[i+1].num;
    },
    showFood:function(){
      this.randomContainer = [];
      for (var i = 0; i < 576; i++) {
        this.randomContainer.push(i);
      }
      for (var j = 0; j < this.snakeArr.length; j++) {
        this.randomContainer.splice(this.randomContainer.indexOf(this.snakeArr[j].num),1)
      }
      var random = this.random(0,this.randomContainer.length-1);
      this.food = this.randomContainer[random];
    },
    showScore:function(){
      this.isShowScore = true;
      this.highScore = JSON.parse(localStorage.getItem('score')).score;
      this.highScoreDiffcult = JSON.parse(localStorage.getItem('score')).diffcult;
    },
    clearScore:function(){
      localStorage.setItem("score",JSON.stringify({score:0,diffcult:''}));
      var obj = JSON.parse(localStorage.getItem('score'));
      this.highScore = JSON.parse(localStorage.getItem('score')).score;
    },
    random:function(min,max){
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    isFailed:function(headNum){
      var name ='';
      for (var i = 0; i < this.directArr.length; i++) {
        if (this.directArr[i].flag) {
          name = this.directArr[i].name;
        }
      }
      var isRepeat = this.isDash(name,this.snakeArr[this.snakeArr.length-1].num);
      if(headNum%32==0 && this.directArr[3].flag ||
        headNum > 0 && headNum <=32 && this.directArr[0].flag||
        (headNum-1)%32==0 && this.directArr[2].flag||
        headNum>544 && headNum <=576 && this.directArr[1].flag||isRepeat){
        return true;
      }
      return false;
    },
    isDash:function(name,headNum){
      var count = this.direCount(name);
      for (var i = 0; i < this.snakeArr.length-1; i++) {
        if(this.snakeArr[i].num == headNum+count){
          return true;break;
        }
      }
      return false;
    },
    isSnake:function(i){
      for(var index = 0;index<this.snakeArr.length;index++){
        if(this.snakeArr[index].num == i){
          return true;break;
        }
      }
      return false;
    },
    isSnakeHead:function(number){
      if(this.snakeArr[this.snakeArr.length-1].num==number){
        return true;
      }else{
        return false
      }
    },
    direCount:function(name){
      var count = -1;
      if(name=='right'){
        count = 1;
      }else if(name=='left'){
        count = -1;
      }else if(name=='up'){
        count = -32;
      }else{
        count = 32;
      }
      return count;
    },
    GameFailed:function(){
      this.isFailedFlag = true;
      this.score = (this.snakeArr.length-4)*100;
      if(localStorage.getItem("score")){
        if(JSON.parse(localStorage.getItem("score")).score<this.score){
          localStorage.setItem("score",JSON.stringify({diffcult:this.diffcult==120?'NORMAL'
            :this.diffcult==50?'HARD'
            :'EASY',
            score:this.score}));
        }
      }else{
        localStorage.setItem("score",JSON.stringify({diffcult:this.diffcult==120?'NORMAL'
          :this.diffcult==50?'HARD'
          :'EASY',
          score:this.score}));
      }
    },
    directionKey:function(event){
      event.preventDefault();
      if(this.isFailedFlag){return;}
      if (event.keyCode==37){//左
        if(this.directing == 'right'||this.directing == 'left'){return;}
        this.game_left();
      }
      if (event.keyCode==38){//上
        if(this.directing == 'up'||this.directing == 'down'){return;}
        this.game_up();
      }
      if (event.keyCode==39){//右
        if(this.directing == 'right'||this.directing == 'left'){return;}
        this.game_right();
      }
      if (event.keyCode==40){//下
        if(this.directing == 'up'||this.directing == 'down'){return;}
        this.game_down();
      }

    },
    directionInit:function(){
      for(var i =0;i<this.directArr.length;i++){
        this.$set(this.directArr[i],'flag',false);
      }
    },
    game_left:function(){
      this.directionInit()
      this.$set(this.directArr[2],'flag',true);
    },
    game_up:function(){
      this.directionInit()
      this.$set(this.directArr[0],'flag',true);
    },
    game_down:function(){
      this.directionInit()
      this.$set(this.directArr[1],'flag',true);
    },
    game_right:function(){
      this.directionInit()
      this.$set(this.directArr[3],'flag',true);
    },
    directionJudge:function(){
      var index = -1;
      for(var i=0;i<this.directArr.length;i++){
        if(this.directArr[i].flag){
          return this.directArr[i].name;
          break;
        }
      }
      return this.directArr[3].name;
    },
    eat:function(n){
      this.snakeArr.push({
        num:n
      })
      this.showFood();
    },
    chooseDiff:function(diff){
      switch(diff){
        case 'easy':
          this.diffcult = 200;
          break;
        case 'normal':
          this.diffcult = 120;
          break;
        case 'hard':
          this.diffcult = 50;
          break;
        default:return;
      }
      this.isSelectDiffcult = false;
    }
  }
})