window.onload = function(){

    //各種パラメータ
    var NBALL = 200; // 生成するボールの数
    var R = 5; // ボールの半径
    var TIME_INTERVAL = 33; // 
    var BLACK_ALPHA = 0.3; // 透明度
    var grav = 10000; // 重力加速度

    //canvasコンテキストを得る
    var canvas = document.getElementById('mycanvas');
    var ctx = canvas.getContext('2d');

    // 壁を表すオブジェクト
    var wall = {
        left: 0, //左壁の座標
        right: canvas.width, //右壁の座標
        top: 0, //上壁の座標
        bottom: canvas.height //下壁の座標
    };

    //ボールコンストラクタ
    function Ball(x, y, r, vx, vy, color){
        this.x = x;     // ボール座標
        this.y = y;
        this.r = r;     // ボールの半径
        this.vx = vx;   // ボール速度
        this.vy = vy;
        this.color = color; // ボール色
    }

    // ボールコンストラクタのプロトタイプ（容量削減）
    Ball.prototype = {
        setVelocityAsRandom: function(vmin, vmax){ // 速度をランダムに設定する
            var v = vmin + Math.random()*(vmax - vmin);
            var theta = 2*Math.PI*Math.random(); // 角度
            this.vx = v*Math.cos(theta);
            // this.vy = v*Math.sin(theta);
            this.vy = 5;
            return this;
        },
        draw: function(ctx){ // ボールの描画
            ctx.fillStyle = "rgb(255,255,255)";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI, true);
            ctx.fill();
            return this;
        },
        move: function(){ //ボールの移動
            this.vy += 2;
            this.x += this.vx;
            this.y += this.vy;
            return this;
        },
        collisionJudge: function(wall){
            if(this.x - this.r < wall.left){ //左壁との衝突判定
                this.x = wall.left + this.r;
                if(this.vx < 0) this.vx *= -1;
            }
            if(this.x + this.r > wall.right){ //右壁との衝突判定
                this.x = wall.right - this.r;
                if(this.vx > 0) this.vx *= -1;
            }
            if(this.y - this.r < wall.top){ //上壁との衝突判定
                this.y = wall.top + this.r;
                if(this.vy < 0) this.vy *= -1;
            }
            if(this.y + this.r > wall.bottom){ //下壁との衝突判定
                this.y = wall.bottom - this.r;
                if(this.vy > 0){this.vy *= -1; this.vy -= 0.4;} // 実験箇所
            }
            return this;
        }
    };
    
    //ボールオブジェクトをNBALL個作成し、配列ballsに格納する
    var balls = [];
    for(var i = 0; i < NBALL; i++){
        balls[i] = new Ball(wall.right/2, wall.bottom/2, R);
        balls[i].setVelocityAsRandom(2, 7);
    }

    function drawFrame(){ //アニメーションのフレームを描画
        //背景を黒く塗る
        ctx.fillStyle = "rgba(0, 0, 0," +BLACK_ALPHA+ ")";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        //ボールの位置を更新して描画
        for(i = 0; i < balls.length; i++){
            balls[i].move().collisionJudge(wall).draw(ctx);
        }
    }

    //アニメーションを行う：TIME_INTERVAL(ms)ごとにdrawFrameを実行
    this.setInterval(drawFrame, TIME_INTERVAL);
}