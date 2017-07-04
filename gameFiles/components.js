var vk_neutral = 0;
var vk_up = 1;
var vk_right = 2;
var vk_down = 3;
var vk_left = 4;
var resolution_height = 750;
var level_height = 3600;
var cam_limit_down = level_height - resolution_height;
var cam_limit_up = Math.floor(resolution_height / 2);
var w = 50;
var h = 50;

function checkCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
    return (
        ((x1 >= x2 && x1 <= x2 + w2) || (x1 + w1 >= x2 && x1 + w1 <= x2 + w2)) &&
        ((y1 >= y2 && y1 <= y2 + h2) || (y1 + h1 >= y2 && y1 + h1 <= y2 + h2))
    );
}


CLOCKWORKRT.components.register([
    {
        name: "player",
        sprite: "player",
        collision: {
            "player": [
                { "x": 0, "y": 0, "w": 50, "h": 50, "#tag": "collenemy" }
            ]
        },
        events: [
            {
                name: "#setup", code: function (event) {
                    this.var.keyboardRight = false;
                    this.var.keyboardLeft = false;
                    this.var.keyboardJump = false;

                    this.engine.var.$cameraX = 0;
                    this.engine.var.$cameraY = 0;
                    this.var.cameraY = 0;

                    this.var.moveSpeed = 12; //velocidad a la que se moverá el jugador lateralmente
                    this.var.jumpSpeed = 24; //velocidad con la que saltará el jugador
                    this.var.vLimit = 30;
                    this.var.vSpeed = 0; //velocidad vertical
                    this.var.hSpeed = 0; //velocidad horizontal
                    this.var.gravity = 2; //velocidad de la gravedad que afecta al jugador
                    this.var.jumpEnable = true;
                    this.var.onFloor = false;
                }
            },
            {
                name: "#loop", code: function (event) {
                    this.var.onFloor = (this.engine.collisionQuery("player", {
                        "x": this.var.$x,
                        "y": this.var.$y + 1, "w": w, "h": h
                    }).length != 0);

                    if (this.var.keyboardRight && !this.var.keyboardLeft)//nos movemos a la derecha
                        this.var.hSpeed = this.var.moveSpeed;
                    else if (!this.var.keyboardRight && this.var.keyboardLeft)//nos movemos a la izquierda
                        this.var.hSpeed = -this.var.moveSpeed;
                    else
                        this.var.hSpeed = 0;


                    this.var.vSpeed += this.var.gravity;
                    if (this.var.vSpeed >= this.var.vLimit)
                        this.var.vSpeed = this.var.vLimit;
                    //JUMPING
                    if (this.var.onFloor == true) {
                        //TODO comprobar, para el salto normal, que haya colision con suelo debajo del jugador
                        this.var.jumpEnable = true;
                        if (this.var.keyboardJump) {
                            this.var.vSpeed = -this.var.jumpSpeed;//doble salto
                            this.var.keyboardJump = false;
                        }
                    } else if (this.var.keyboardJump) {
                        if((this.var.keyboardLeft && (this.engine.collisionQuery("player", {"x": this.var.$x + 24,
                        "y": this.var.$y, "w": w, "h": h}).length != 0)) ||
                        (this.var.keyboardRight && (this.engine.collisionQuery("player", {"x": this.var.$x - 24,
                        "y": this.var.$y, "w": w, "h": h}).length != 0))){
                            this.var.vSpeed = -this.var.jumpSpeed;
                            this.var.keyboardJump = false;
                        }
                        else if(this.var.jumpEnable == true){
                            this.var.vSpeed = -this.var.jumpSpeed;//doble salto
                            this.var.keyboardJump = false;
                            this.var.jumpEnable = false;
                        }
                    }

                    var collider = null;
                    var aux = 0;
                    var arrayCollisions = this.engine.collisionQuery("player", {
                        "x": this.var.$x + this.var.hSpeed,
                        "y": this.var.$y + this.var.vSpeed, "w": w, "h": h
                    });
                    this.engine.debug.log(JSON.stringify({
                        "x": this.var.$x + this.var.hSpeed,
                        "y": this.var.$y + this.var.vSpeed, "w": w, "h": h
                    }));
                    this.engine.debug.log("collision length: " + arrayCollisions.length);
                    //this.engine.debug.log("x: " + this.var.$x + " y: " + this.var.$y + " w: " + (this.var.$x+w) + " h: " + (this.var.$y+h));

                    if (arrayCollisions.length != 0) {
                        arrayCollisions = this.engine.collisionQuery("player", {
                            "x": this.var.$x + this.var.hSpeed,
                            "y": this.var.$y, "w": w, "h": h
                        });
                        if (arrayCollisions.length != 0) {//colisionaremos lateralmente con algo
                            this.engine.debug.log("COLISION HORIZONTAL");
                            collider = arrayCollisions[0];
                            aux = Math.sign(collider.var.$x - this.var.$x);
                            this.var.hSpeed = aux;
                            if (aux != 0) {
                                while (!checkCollision(this.var.$x + this.var.hSpeed, this.var.$y, w, h, collider.var.$x, collider.var.$y, collider.var.w, collider.var.h)) {
                                    this.var.hSpeed += aux;
                                }
                                this.var.$x += this.var.hSpeed - aux;
                                this.var.hSpeed = 0;
                            }
                        } else {
                            this.var.$x += this.var.hSpeed;
                        }
                        arrayCollisions = this.engine.collisionQuery("player", {
                            "x": this.var.$x,
                            "y": this.var.$y + this.var.vSpeed, "w": w, "h": h
                        });
                        if (arrayCollisions.length != 0) {//colisionamos verticalmente con algo
                            this.engine.debug.log("COLISION VERTICAL");
                            collider = arrayCollisions[0];
                            aux = Math.sign(collider.var.$y - this.var.$y);
                            this.var.vSpeed = aux;
                            if (aux != 0) {
                                while (!checkCollision(this.var.$x, this.var.$y + this.var.vSpeed, w, h, collider.var.$x, collider.var.$y, collider.var.w, collider.var.h)) {
                                    this.var.vSpeed += aux;
                                }
                                this.var.$y += this.var.vSpeed - aux;
                                this.var.vSpeed = 0;
                            }
                        } else {
                            this.var.$y += this.var.vSpeed;
                        }
                    } else {
                        this.var.$x += this.var.hSpeed;
                        this.var.$y += this.var.vSpeed;
                    }
                    if (this.var.$y >= level_height) {
                        this.var.cameraY = 0;
                        this.var.$y = 0;
                    }

                    var tentativeCameraY = this.var.$y - cam_limit_up;
                    //Movemos la camara
                    if (tentativeCameraY >= cam_limit_down) {
                        this.engine.var.$cameraY = cam_limit_down;
                    } else if (tentativeCameraY <= 0) {
                        this.engine.var.$cameraY = 0;
                    } else {
                        this.engine.var.$cameraY = tentativeCameraY;
                    }
                }
            },
            {
                name: "vk_press", code: function (event) {
                    switch (event) {
                        case 0://vk_neutral
                            this.var.keyboardRight = this.var.keyboardLeft = false;
                            break;
                        case 1://vk_up
                            this.var.keyboardJump = true;
                            break;
                        case 2://vk_right
                            this.var.keyboardRight = true;
                            break;
                        case 3://vk_down
                            break;
                        case 4://vk_left
                            this.var.keyboardLeft = true;
                            break;
                    }
                }
            },
            {
                name: "vk_release", code: function (event) {
                    switch (event) {
                        case 0://vk_neutral
                            //this.var.keyboardRight = this.var.keyboardLeft = false;
                            break;
                        case 1://vk_up
                            this.var.vSpeed = Math.max(this.var.vSpeed, -0.25 * this.var.jumpSpeed);//para detener el salto de forma mas organica
                            break;
                        case 2://vk_right
                            this.var.keyboardRight = false;
                            break;
                        case 3://vk_down
                            break;
                        case 4://vk_left
                            this.var.keyboardLeft = false;
                            break;
                    }
                }
            },
            {
                name: "gamepadDown", code: function (event) {
                    if (event.name == "A")
                        this.do.vk_press(vk_up);
                }
            },
            {
                name: "gamepadUp", code: function (event) {
                    if (event.name == "A")
                        this.do.vk_release(vk_up);
                }
            },
            {
                name: "gamepadAxis", code: function (event) {
                    var xAxis = event.values[0].x;
                    if (xAxis < -0.5) {//le estamos dando a la izda
                        this.do.vk_press(vk_left);
                        this.do.vk_release(vk_right);
                    }
                    else if (xAxis > 0.5) {
                        this.do.vk_press(vk_right);
                        this.do.vk_release(vk_left);
                    }
                    else {
                        this.do.vk_press(vk_neutral);
                    }
                }
            },
            {
                name: "keyboardDown", code: function (event) {
                    switch (event.key) {
                        case 37: //flecha izquierda
                            this.do.vk_press(vk_left);
                            break;
                        case 38: //flecha arriba
                            this.do.ck_press(vk_up);
                            break;
                        case 39: //flecha derecha
                            this.do.vk_press(vk_right);
                            break;
                        case 40: //flecha abajo
                            //this.var.ay = 1;
                            break;
                        case 32: //espacio
                            //this.do.fire();
                            break;
                    }
                }
            },
            {
                name: "keyboardUp", code: function (event) {
                    switch (event.key) {
                        case 37: //flecha izquierda
                            this.do.vk_press(vk_neutral);
                            break;
                        case 38: //flecha arriba
                            //if(this.var.vSpeed < 0)
                            this.do.vk_release(vk_up);
                            break;
                        case 39: //flecha derecha
                            this.do.vk_press(vk_neutral);
                            break;
                        case 40: //flecha abajo
                            //this.var.ay = 1;
                            break;
                        case 32: //espacio
                            //this.do.fire();
                            break;
                    }
                }
            },
            {
                name: "#collide", code: function (event) {
                    if(event.shape2kind == "enemy1"){
                        this.engine.debug.log("colision con enemy1: " + this.engine.var['#currentLevel']);
                        this.engine.loadLevelByIndex(this.engine.var['#currentLevel']);
                    }
                }
            }
        ]
    },

    {
        name: "block",
        events: [
            {
                name: "#setup", code: function (event) {
                    this.setCollider("collenemy", { "x": 0, "y": 0, "w": this.var.w, "h": this.var.h });
                    for (var i = 0; i < this.var.w / 50; i++)
                        for (var j = 0; j < this.var.h / 50; j++)
                            var texturita = this.engine.spawn("textura", this.var.textura, { $x: i * 50 + this.var.$x, $y: j * 50 + this.var.$y });
                }
            }
        ]
    },
    {
        name: "suelo",
        inherits: "block",
        collision: {
            "block": [
                { "x": 0, "y": 0, "w": 0, "h": 0, "#tag": "collenemy" }
            ]
        }
    },
    {
        name: "meta",
        inherits: "block",
        collision: {
            "meta": [
                { "x": 0, "y": 0, "w": 50, "h": 50, "#tag": "collenemy" }
            ]
        },
        events: [
            {
                name: "#collide", code: function (event) {
                this.engine.loadLevel(this.var.levelname);
                }
            }
        ]
    },
    {
        name: "lava",
        inherits: "block",
        collision: {
            "lava": [
                { "x": 0, "y": 0, "w": 0 , "h": 0, "#tag": "collenemy"},
            ]
        },
           events: [
            {
                name: "#collide", code: function (event) {
                // this.engine.debug.log(this.engine.var["#currentLevel"])
                // this.engine.debug.log(this.engine.loadLevelByIndex.toString())
                this.engine.loadLevelByIndex(this.engine.var["#currentLevel"]);
                }
            }
        ]
    }, 
    {
        name: "enemy",
        events: [
            {
                name: "#setup", code: function (event) {
                    this.setCollider("collenemy", { "x": 0, "y": 0, "w": this.var.w, "h": this.var.h });
                    this.setCollider("collplayer", { "x": 0, "y": 0, "w": this.var.w, "h": this.var.h });
                }
            },
            {
                name: "#loop", code: function (event) {
                    this.var.$x += this.var.speed;
                    this.var.$y += this.var.dir;
                }
            },
            {
                name: "#collide", code: function (event) {
                    this.var.$x -= this.var.speed;
                    this.var.$y -= this.var.speed * this.var.dir;
                    this.var.speed = -this.var.speed;
                    this.var.dir = -this.var.dir

                }
            }
        ],

        collision: {
            "enemy1": [
                { "x": 0, "y": 0, "w": 16 , "h": 16, "#tag": "collenemy"}
            ],
              "enemy2": [
                { "x": 0, "y": 0, "w": 16 , "h": 16, "#tag": "collplayer"}
            ]

        }
    },
    {
        name: "enemyshooter",
        inherits: "enemy",
        events: [
           {
                name: "#setup", code: function (event) {
                    this.var.timer = 0;
                    this.var.$x += this.var.speed;
                    this.var.$y += this.var.dir;
                }
            },
            {
                name: "#loop", code: function (event) {
                    this.var.$x += this.var.speed;
                    this.var.$y += this.var.dir;
                    this.var.timer++;
                    if (this.var.timer%this.var.cadency == 0) {
                          var tiro = this.engine.spawn("tirito", this.var.disparete,
                             {$x:this.var.$x+this.var.w/2, $y:this.var.$y+this.var.h/2,
                             w:this.var.dispw, h:this.var.disph,
                             dir:this.var.dispdir, speed:this.var.dispspeed})
                    }
                }
            }
        ]


    },
    {
        name: "enemydisp",
        inherits: "enemyshooter",
        sprite: "enemydisp"
    },
    {
        name: "disparo",
        events: [
            {
                name: "#setup", code: function (event) {
                   this.setCollider("collenemy", { "x": 0, "y": 0, "w": this.var.w , "h": this.var.h});

                }
            },
            {
                name: "#loop", code: function (event) {
                    this.var.$x += this.var.speed;
                    this.var.$y += this.var.dir;
                }
            },
            {
                name: "#collide", code: function (event) {
                    var explode = this.engine.spawn("explosion1", "explosion", {$x:this.var.$x, $y:this.var.$y})
                    this.engine.destroy(this);
                }
            }
        ],

        collision: {
             "bullet": [
                { "x": 0, "y": 0, "w": 16 , "h": 16, "#tag": "collenemy"}
            ]
            
        }
    },

    {
        name: "background"
    },

    {
        name: "background1",
        sprite: "background1",
        inherits: "background"
    },
    {
        name: "disparo1",
        inherits: "disparo",
        sprite: "disparo1"
    },
    {
        name: "enemy1",
        inherits: "enemy",
        sprite: "enemy1"
    },
    {
        name: "enemy3",
        inherits: "enemy",
        sprite: "enemy3"
    },
    {
        name: "enemy4",
        inherits: "enemy",
        sprite: "enemy4"
    },
    {
        name: "enemy2",
        inherits: "enemy",
        sprite: "enemy2"
    },
    {
        name: "textura1",
        sprite: "textura1"
    },
        {
        name: "textura1_1",
        sprite: "textura1_1"
    },
        {
        name: "textura1_2",
        sprite: "textura1_2"
    },
        {
        name: "textura1_3",
        sprite: "textura1_3"
    },
        {
        name: "textura1_4",
        sprite: "textura1_4"
    },
        {
        name: "textura1_5",
        sprite: "textura1_5"
    },
        {
        name: "textura1_6",
        sprite: "textura1_6"
    },
        {
        name: "textura1_7",
        sprite: "textura1_7"
    },
        {
        name: "textura1_8",
        sprite: "textura1_8"
    },
        {
        name: "textura1_9",
        sprite: "textura1_9"
    },
        {
        name: "textura1_10",
        sprite: "textura1_10"
    },
        {
        name: "textura1_11",
        sprite: "textura1_11"
    },
        {
        name: "textura1_12",
        sprite: "textura1_12"
    },
        {
        name: "textura1_13",
        sprite: "textura1_13"
    },
        {
        name: "textura1_14",
        sprite: "textura1_14"
    },
        {
        name: "textura1_15",
        sprite: "textura1_15"
    },
        {
        name: "textura1_16",
        sprite: "textura1_16"
    },
     {
        name: "pinchos",
        sprite: "pinchos"
    }, {
        name: "metasprite",
        sprite: "meta"
    },
   {
        name: "explosion",
        sprite: "explosion",
        events: [
            {
                name: "#setup", code: function (event) {
                    this.var.timer = 0;
                }
            },
            {
                name: "#loop", code: function (event) {
                    this.var.timer++;
                    if (this.var.timer == 30) {
                        this.engine.destroy(this);
                    }
                }
            }
        ]
    }


])

/*CLOCKWORKRT.components.register([
    {
        name: "ship",
        events: [
            {
                name: "#setup", code: function (event) {
                    this.var.friction = 0.03;
                    this.var.vx = this.var.vy = 0;
                    this.var.ax = this.var.ay = 0;
                }
            },
            {
                name: "#loop", code: function (event) {
                    this.var.vx += this.var.ax;
                    this.var.vy += this.var.ay;
                    this.var.$x += this.var.vx;
                    this.var.$y += this.var.vy;
                    this.var.vx *= (1 - this.var.friction);
                    this.var.vy *= (1 - this.var.friction);
                }
            }
        ]
    },
    {
        name: "playerShip",
        sprite: "playerShip",
        inherits: "ship",
        events: [
            {
                name: "keyboardDown", code: function (event) {
                    switch (event.key) {
                        case 37:
                            this.var.ax = -1;
                            break;
                        case 38:
                            this.var.ay = -1;
                            break;
                        case 39:
                            this.var.ax = 1;
                            break;
                        case 40:
                            this.var.ay = 1;
                            break;
                        case 32:
                            this.do.fire();
                            break;
                    }
                }
            },
            {
                name: "keyboardUp", code: function (event) {
                    switch (event.key) {
                        case 37:
                            this.var.ax = 0;
                            break;
                        case 38:
                            this.var.ay = 0;
                            break;
                        case 39:
                            this.var.ax = 0;
                            break;
                        case 40:
                            this.var.ay = 0;
                            break;
                    }
                }
            },
            {
                name: "fire", code: function (event) {
                    if (Math.random() > 0.5) {
                        this.engine.spawn("somePlayerFire", "playerFire", { $x: this.var.$x + 40, $y: this.var.$y, $z: this.var.$z - 1 });
                    } else {
                        this.engine.spawn("somePlayerFire", "playerFire", { $x: this.var.$x + 70, $y: this.var.$y, $z: this.var.$z - 1 });
                    }
                }
            },
            {
                name: "#collide", code: function (event) {
                    this.engine.spawn("explosion", "explosion", { $x: this.var.$x, $y: this.var.$y, $z: this.var.$z + 1 });
                    this.engine.do.playerDamaged();
                }
            }
        ],
        collision: {
            "player": [
                { "x": 0, "y": 0, "w": 100, "h": 100, "#tag": "shipCollision" },
            ]
        }
    },
    {
        name: "kamikazeLogic",
        events: [
            {
                name: "#setup", code: function (event) {
                    this.var.ay = 0.5;
                    this.var.friction = 0.1;
                    this.var.health = 3;
                    this.var.$state = "Health" + this.var.health;

                }
            },
            {
                name: "#loop", code: function (event) {
                    var playerShip = this.engine.find("playerShip");
                    if (playerShip.var.$x < this.var.$x) {
                        this.var.ax = -1;
                    } else {
                        this.var.ax = 1;
                    }
                    if (this.var.$y > 800) {
                        this.engine.destroy(this);
                    }
                }
            },
            {
                name: "#collide", code: function (event) {
                    if (event.shape2kind == "player") {
                        this.engine.destroy(this);
                        this.engine.spawn("explosion", "explosion", { $x: this.var.$x, $y: this.var.$y, $z: this.var.$z + 1 });
                    }
                    if (event.shape2kind == "playerFire") {
                        this.engine.spawn("explosion", "explosion", { $x: this.var.$x, $y: this.var.$y, $z: this.var.$z + 1 });
                        this.engine.do.scorePoints(100);
                        this.var.health--;
                        if (this.var.health > 0) {
                            this.var.$state = "Health" + this.var.health;
                        } else {
                            this.engine.destroy(this);
                        }
                    }
                }
            }
        ],
        collision: {
            "enemy": [
                { "x": 0, "y": 0, "w": 100, "h": 100, "#tag": "shipCollision" },
            ],
            "enemyFire": [
                { "x": 50, "y": 100, "#tag": "shipCollision" },
            ]
        }
    },
    {
        name: "cannonLogic",
        events: [
            {
                name: "#setup", code: function (event) {
                    this.var.ay = 0.2;
                    this.var.friction = 0.1;
                    this.var.timer = 0;
                }
            },
            {
                name: "#loop", code: function (event) {
                    this.var.timer++;
                    if (this.var.timer == 100) {
                        this.var.timer = 0;
                        this.do.fire();
                    }
                }
            },
            {
                name: "fire", code: function (event) {
                    this.engine.spawn("someWaveFire", "waveFire", { $x: this.var.$x, $y: this.var.$y + 100, $z: this.var.$z - 1 });
                }
            },
            {
                name: "#collide", code: function (event) {
                    this.engine.spawn("explosion", "explosion", { $x: this.var.$x, $y: this.var.$y, $z: this.var.$z + 1 });
                    this.engine.do.scorePoints(200);
                    this.engine.destroy(this);
                }
            }
        ],
        collision: {
            "enemy": [
                { "x": 0, "y": 0, "w": 100, "h": 100, "#tag": "shipCollision" },
            ]
        }
    },
    {
        name: "triangleLogic",
        events: [
            {
                name: "#setup", code: function (event) {
                    this.var.ay = 0.2;
                    this.var.friction = 0.1;
                    this.var.timer = 0;
                }
            },
            {
                name: "#loop", code: function (event) {
                    this.var.timer++;
                    if (this.var.timer == 50) {
                        this.var.timer = 0;
                        this.do.fire();
                    }
                }
            },
            {
                name: "fire", code: function (event) {
                    var plasma1 = this.engine.spawn("someWaveFire", "plasmaFire", { $x: this.var.$x + 20, $y: this.var.$y + 100, $z: this.var.$z - 1 });
                    plasma1.var.vx = -1;
                    var plasma2 = this.engine.spawn("someWaveFire", "plasmaFire", { $x: this.var.$x + 80, $y: this.var.$y + 100, $z: this.var.$z - 1 });
                    plasma2.var.vx = 1;
                }
            },
            {
                name: "#collide", code: function (event) {
                    this.engine.spawn("explosion", "explosion", this.var.$x, this.var.$y, this.var.$z + 1);
                    this.engine.do.scorePoints(300);
                    this.engine.destroy(this);
                }
            }
        ],
        collision: {
            "enemy": [
                { "x": 0, "y": 0, "w": 100, "h": 100, "#tag": "shipCollision" },
            ]
        }
    },
    {
        name: "kamikazeShip",
        sprite: "kamikazeShip",
        inherits: ["ship", "kamikazeLogic"]
    },
    {
        name: "cannonShip",
        sprite: "cannonShip",
        inherits: ["ship", "cannonLogic"]
    },
    {
        name: "triangleShip",
        sprite: "triangleShip",
        inherits: ["ship", "triangleLogic"]
    },
    {
        name: "playerFire",
        sprite: "playerFire",
        events: [
            {
                name: "#loop", code: function (event) {
                    this.var.$y -= 10;
                    if (this.var.$y < -50) {
                        this.engine.destroy(this);
                    }
                }
            },
            {
                name: "#collide", code: function (event) {
                    this.engine.destroy(this);
                }
            }],
        collision: {
            "playerFire": [
                { "x": 0, "y": 0, "#tag": "shipCollision" },
            ]
        }
    },
    {
        name: "plasmaFire",
        sprite: "plasmaFire",
        events: [
            {
                name: "#loop", code: function (event) {
                    this.var.$y += 4;
                    this.var.$x += this.var.vx;
                    if (this.var.$y > 800) {
                        this.engine.destroy(this);
                    }
                }
            },
            {
                name: "#collide", code: function (event) {
                    this.engine.destroy(this);
                }
            }],
        collision: {
            "enemyFire": [
                { "x": 0, "y": 0, "#tag": "shipCollision" },
            ]
        }
    },
    {
        name: "waveFire",
        sprite: "waveFire",
        events: [
            {
                name: "#loop", code: function (event) {
                    this.var.$y += 4;
                    if (this.var.$y > 800) {
                        this.engine.destroy(this);
                    }
                }
            }, {
                name: "#collide", code: function (event) {
                    this.engine.destroy(this);
                }
            }],
        collision: {
            "enemyFire": [
                { "x": 50, "y": 100, "#tag": "shipCollision" },
            ]
        }
    },
    {
        name: "livesIndicator",
        sprite: "livesIndicator",
        events: [
            {
                name: "#setup", code: function (event) {
                    this.var.lives = 3;
                    this.var.$state = this.var.lives + "lives";
                }
            },
            {
                name: "playerDamaged", code: function (event) {
                    this.var.lives--;
                    if (this.var.lives > 0) {
                        this.var.$state = this.var.lives + "lives";
                    } else {
                        this.engine.loadLevel("mainLevel");
                    }
                }
            }]
    },
    {
        name: "enemySpawner",
        events: [
            {
                name: "#setup", code: function (event) {
                    this.var.timeline = [
                        { enemy: "kamikazeShip", x: 600, t: 70 },
                        { enemy: "kamikazeShip", x: 200, t: 200 },
                        { enemy: "kamikazeShip", x: 900, t: 200 },
                        { enemy: "kamikazeShip", x: 200, t: 500 },
                        { enemy: "kamikazeShip", x: 900, t: 600 },
                        { enemy: "kamikazeShip", x: 200, t: 700 },
                        { enemy: "cannonShip", x: 600, t: 850 },
                        { enemy: "cannonShip", x: 600, t: 1000 },
                        { enemy: "kamikazeShip", x: 200, t: 1050 },
                        { enemy: "kamikazeShip", x: 900, t: 1050 },
                        { enemy: "cannonShip", x: 200, t: 1120 },
                        { enemy: "cannonShip", x: 900, t: 1120 },
                        { enemy: "kamikazeShip", x: 100, t: 1200 },
                        { enemy: "kamikazeShip", x: 300, t: 1200 },
                        { enemy: "kamikazeShip", x: 700, t: 1200 },
                        { enemy: "kamikazeShip", x: 1100, t: 1200 },
                        { enemy: "triangleShip", x: 600, t: 1300 },
                        { enemy: "triangleShip", x: 200, t: 1400 },
                        { enemy: "triangleShip", x: 900, t: 1400 },
                        { enemy: "kamikazeShip", x: 100, t: 1410 },
                        { enemy: "kamikazeShip", x: 100, t: 1410 },
                        { enemy: "kamikazeShip", x: 1100, t: 1410 },
                        { enemy: "kamikazeShip", x: 600, t: 1410 },
                        { enemy: "cannonShip", x: 200, t: 1120 },
                        { enemy: "cannonShip", x: 900, t: 1120 },
                    ];
                    this.var.timer = 0;
                }
            },
            {
                name: "#loop", code: function (event) {
                    var that = this;
                    this.var.timeline.filter(function (event) {
                        return event.t == that.var.timer;
                    }).forEach(function (event) {
                        that.engine.spawn("spawnedEnemy", event.enemy, { $x: event.x, $y: -100, $z: 0 });
                    });
                    this.var.timer++;
                }
            }
        ]
    },
    {
        name: "score",
        sprite: "score",
        events: [
            {
                name: "#setup", code: function (event) {
                    this.var.$score = 0;
                }
            },
            {
                name: "scorePoints", code: function (event) {
                    this.var.$score += event;
                }
            }
        ]
    },
    {
        name: "explosion",
        sprite: "explosion",
        events: [
            {
                name: "#setup", code: function (event) {
                    this.var.timer = 0;
                }
            },
            {
                name: "#loop", code: function (event) {
                    this.var.timer++;
                    if (this.var.timer == 10) {
                        this.engine.destroy(this);
                    }
                }
            }
        ]
    }
]);*/