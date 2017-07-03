var vk_neutral = 0;
var vk_up = 1;
var vk_right = 2;
var vk_down = 3;
var vk_left = 4;


CLOCKWORKRT.components.register([
    {
        name: "player",
        sprite: "player",
        events: [
            {
                name: "#setup", code: function(event){
                    this.var.keyboardRight = false;
                    this.var.keyboardLeft = false;
                    this.var.keyboardJump = false;

                    this.var.moveSpeed = 4; //velocidad a la que se moverá el jugador lateralmente
                    this.var.jumpSpeed = 30; //velocidad con la que saltará el jugador
                    this.var.vLimit = 40;
                    this.var.vSpeed = 0; //velocidad vertical
                    this.var.hSpeed = 0; //velocidad horizontal
                    this.var.gravity = 1; //velocidad de la gravedad que afecta al jugador
                    this.var.jumpEnable = true;
                }
            },
            {
                name: "#loop", code: function (event){
                    if(this.var.keyboardRight && !this.var.keyboardLeft)//nos movemos a la derecha
                        this.var.hSpeed = this.var.moveSpeed;
                    else if(!this.var.keyboardRight && this.var.keyboardLeft)//nos movemos a la izquierda
                        this.var.hSpeed = -this.var.moveSpeed;
                    else
                        this.var.hSpeed = 0;


                    this.var.vSpeed += this.var.gravity;
                    if(this.var.vSpeed >= this.var.vLimit)
                        this.var.vSpeed = this.var.vLimit;
                    if(this.var.keyboardJump == true){
                        //TODO comprobar, para el salto normal, que haya colision con suelo debajo del jugador
                        if(this.var.jumpEnable == true){
                            this.var.vSpeed = -this.var.jumpSpeed;//doble salto
                            this.var.keyboardJump = false;
                        }
                    }
                    this.var.$x += this.var.hSpeed;
                    this.var.$y += this.var.vSpeed;
                    if(this.var.$y >= 700)
                        this.var.$y = 0;
                    /*
                    TODO:
                        si no estoy de pie en un solido, vspeed += gravity
                        si en x+hspeed o y+vspeed hay una colision con un solido
                        me snappeo al grid mas cercano
                    */
                }
            },
            {
                name: "vk_press", code: function(event){
                    this.engine.debug.log(event);
                    switch(event){
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
                name: "vk_release", code: function(event){
                    this.engine.debug.log("release" + event);
                    switch(event){
                        case 0://vk_neutral
                            //this.var.keyboardRight = this.var.keyboardLeft = false;
                        break;
                        case 1://vk_up
                            this.var.vSpeed = Math.max(this.var.vSpeed, -0.25*this.var.jumpSpeed);//para detener el salto de forma mas organica
                        break;
                        case 2://vk_right
                            //this.var.keyboardRight = true;
                        break;
                        case 3://vk_down
                        break;
                        case 4://vk_left
                            //this.var.keyboardLeft = true;
                        break;
                    }
                }
            },
            {
                name: "gamepadDown", code: function(event){
                    this.engine.debug.log(event.name);
                    if(event.name == "A")
                        this.do.vk_press(vk_up);
                }
            },
            {
                name: "gamepadUp", code: function(event){
                    this.engine.debug.log(event.name);
                    if(event.name == "A")
                        this.do.vk_release(vk_up);
                }
            },
            {
                name: "gamepadAxis", code: function(event){
                    var xAxis = event.values[0].x;
                    if(xAxis < -0.5)//le estamos dando a la izda
                        this.do.vk_press(vk_left);
                    else if(xAxis > 0.5)
                        this.do.vk_press(vk_right);
                    else
                        this.do.vk_press(vk_neutral);
                }
            },
            {
                name: "keyboardDown", code: function (event) {
                    this.engine.debug.log("DOWN "+ event.key);
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
                    this.engine.debug.log("UP "+ event.key);
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
            }
        ]
    },
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