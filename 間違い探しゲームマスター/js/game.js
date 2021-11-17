const APPLICATION_KEY = "4686232af896489e8900c62cf35af4d18f40cf0684e050287ec33db114084493";
const CLIENT_KEY = "05fb4f134f6ce7e4e435a5ca236bbe5492048879329c44f0034f2c867b806184";
const ncmb = new NCMB(APPLICATION_KEY,CLIENT_KEY);
const DBName = "Table";

let Table = ncmb.DataStore(DBName);

let timer = null;
const MAX = 3;
let count = 1;
function init() {
  if (timer == null) {
    start = new Date();
    time();
    gameStart();
  }
}

function gameStart() {
  let size = 5;
  let qNum = Math.floor(Math.random()*q.length);

  for(let i=0; i<size*size; i++) {
    let s = document.createElement("span");
    s.textContent = q[qNum][0];
    s.setAttribute("id", "num"+i);
    s.addEventListener("click", function() {
      if(this.textContent == q[qNum][1]) {
        correct.play();
        alert("正解");
        while(cells.firstChild) {
          cells.removeChild(cells.firstChild);
        }
        count++;
        if(MAX >= count) {
          gameStart();
        } else {
          alert("Game clear!");
          clearTimeout(timer);

          // データの保存
          let test = new Table();
          let key = "score";
          let value = timer;
          test.set(key, parseInt(value));
          test.save()
            .then(function(){
              console.log("成功");
            })
            .catch(function(err){
              console.log("エラー発生： " + err);
            });
          // データの読み込み
          Table
            .order("score")
            .fetchAll()
            .then(function(results){
              if(value<results[0].score) {
                console.log(results);
                alert("ハイスコア！");
              }
            })
            .catch(function(err){
              console.log("エラー発生： " + err);
            });
        }
      } else {
        wrong.play();
      }
    });
    cells.appendChild(s);
    if(i%size == size-1) {
      const br = document.createElement("br");
      cells.appendChild(br);
    }
  }
  let p = Math.floor(Math.random()*size*size);
  let ans = document.getElementById("num"+p);
  ans.textContent = q[qNum][1];
}

function time() {
  let now = new Date();
  let eTime = parseInt((now.getTime() - start.getTime())/1000);
  score.textContent = eTime;
  timer = setTimeout("time()", 1000);
}
