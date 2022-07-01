document.getElementById("gameOverScreen").style = "display: none;"
document.getElementById("gameWinScreen").style = "display: none;"
const canvas = document.getElementById('gameScreen')
const c = canvas.getContext('2d')
const music = new Audio('RedMayhemMusic.mp3')
music.loop = true
canvas.width = window.innerWidth - 8
canvas.height = window.innerHeight - 37
var health = 3000
var projectileInterval = 0
var gameOver = false
const firstPhase = 3000
const secondPhase = 2250
const thirdPhase = 1500
const finalPhase = 750
var direction = 0
var dashcooldown = 0
var iFrames = 0
var playerHealth = 5
var timesToIterateWinScript = 1
class Player {
    constructor() {
        this.width = 50
        this.height = 50
        this.position = {
            x: canvas.width / 2 - this.width / 2,
            y: canvas.height - 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }
    }
    draw() {
        c.fillStyle = "cyan"
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}
class Enemy {
    constructor() {
        this.width = 100
        this.height = 100
        this.position = {
            x: 700,
            y: 0
        }
        this.velocity = {
            x: 0,
            y: 0
        }
    }
    draw() {
        c.fillStyle = "red"
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}
class Projectiles {
    constructor(velocityX, velocityY, positionX, positionY) {
        this.width = 30
        this.height = 30
        this.position = {
            x: positionX,
            y: positionY
        }
        this.velocity = {
            x: velocityX,
            y: velocityY
        }
    }
    draw() {
        c.fillStyle = "red"
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}
class BossBar {
    constructor() {
        this.width = 1000
        this.positionX = canvas.width / 2 - this.width / 2
        this.height = 25
    }
    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.positionX, 0, this.width, this.height)
    }
    update() {
        this.draw()
    }
}
class Particles {
    constructor(velocityX, velocityY, positionX, positionY, color) {
        this.width = 15
        this.height = 15
        this.position = {
            x: positionX,
            y: positionY
        }
        this.velocity = {
            x: velocityX,
            y: velocityY
        }
        this.color = color
    }
    draw() {
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

/*class Particle {
    constructor(velocityX2, velocityY2, colorForParticle) {
        this.color = 'cyan'
        this.scale = 30
        this.position.x = {
            x: player.position.x + player.width / 2 - this.scale / 2,
            y: player.position.y + player.height / 2 - this.scale / 2
        }
        this.velocity = {
            x: velocityX2,
            y: velocityY2
        }
    }
}*/
const player = new Player
const enemy = new Enemy
const bossBar = new BossBar
var projectiles = []
var particles = []
var keysPressed = {
    a: false,
    d: false,
    w: false,
    s: false
}
function animatePlayer() {
    requestAnimationFrame(animatePlayer)
    if (gameOver) return
    c.clearRect(0, 0, canvas.width, canvas.height)
    c.fillStyle = "black"
    c.fillRect(0, 0, canvas.width, canvas.height)
    c.fillStyle = 'grey'
    c.fillRect(canvas.width / 2 - 500, 0, 1000, 25)
    c.fillStyle = '#03fc3d'
    c.fillRect(player.position.x, player.position.y - 20, playerHealth * 10, 15)
    bossBar.update()
    projectiles.forEach((projectile, index) => {
        projectile.update()
        if (player.position.x + player.width > projectile.position.x && player.position.x < projectile.position.x + projectile.width && player.position.y + player.height > projectile.position.y && player.position.y < projectile.position.y + projectile.height){
            projectiles.splice(index, 1)
            endGame()
        }
    })
    enemy.update()
    player.update()
    particles.forEach((particle, index) => {
        particle.update()
    }) 
    if(!keysPressed.a && !keysPressed.d) {
        player.velocity.x = 0
    }
    if(!keysPressed.w && !keysPressed.s) {
        player.velocity.y = 0
    }
    if(keysPressed.d) {
        player.velocity.x = 5
    }
    if(keysPressed.a) {
        player.velocity.x = -5
    }
    if(keysPressed.w) {
        player.velocity.y = -5
    }
    if(keysPressed.s) {
        player.velocity.y = 5
    }
    if (player.position.x + player.width >= canvas.width) {
        player.position.x = canvas.width - player.width
    }
    if (player.position.y + player.height >= canvas.height) {
        player.position.y = canvas.height - player.height
    }
    if (player.position.x <= 0) {
        player.position.x = 0
    }
    if (player.position.y <= 0) {
        player.position.y = 0
    }
    if (player.position.x + player.width > enemy.position.x && player.position.x < enemy.position.x + enemy.width && player.position.y + player.height > enemy.position.y && player.position.y < enemy.position.y + enemy.height){
        endGame()
    }
    if (projectileInterval == 50 && health >= secondPhase && health <= 3000) {
        projectileInterval = 0
        //normal projectile shooting
        projectiles.push(new Projectiles(5,0,enemy.position.x + enemy.width / 2 - 15, enemy.position.y + enemy.height / 2 - 15, ))
        projectiles.push(new Projectiles(-5,0,enemy.position.x + enemy.width / 2 - 15, enemy.position.y + enemy.height / 2 - 15, ))
        projectiles.push(new Projectiles(0,5,enemy.position.x + enemy.width / 2 - 15, enemy.position.y + enemy.height / 2 - 15, ))
        projectiles.push(new Projectiles(0,-5,enemy.position.x + enemy.width / 2 - 15, enemy.position.y + enemy.height / 2 - 15, ))
        //diagonal projectile shooting
        /*projectiles.push(new Projectiles(2.5,2.5,enemy.position.x + enemy.width / 2 - 15, enemy.position.y + enemy.height / 2 - 15, ))
        projectiles.push(new Projectiles(-2.5,-2.5,enemy.position.x + enemy.width / 2 - 15, enemy.position.y + enemy.height / 2 - 15, ))
        projectiles.push(new Projectiles(-2.5,2.5,enemy.position.x + enemy.width / 2 - 15, enemy.position.y + enemy.height / 2 - 15, ))
        projectiles.push(new Projectiles(2.5,-2.5,enemy.position.x + enemy.width / 2 - 15, enemy.position.y + enemy.height / 2 - 15, ))*/
    }
    if (projectileInterval == 70 && health <= secondPhase && health >= thirdPhase) {
        projectileInterval = 0
        //normal projectile shooting
        projectiles.push(new Projectiles(5,0,enemy.position.x + enemy.width / 2 - 15, enemy.position.y + enemy.height / 2 - 15, ))
        projectiles.push(new Projectiles(-5,0,enemy.position.x + enemy.width / 2 - 15, enemy.position.y + enemy.height / 2 - 15, ))
        projectiles.push(new Projectiles(0,5,enemy.position.x + enemy.width / 2 - 15, enemy.position.y + enemy.height / 2 - 15, ))
        projectiles.push(new Projectiles(0,-5,enemy.position.x + enemy.width / 2 - 15, enemy.position.y + enemy.height / 2 - 15, ))
        //diagonal projectile shooting
        projectiles.push(new Projectiles(2.5,2.5,enemy.position.x + enemy.width / 2 - 15, enemy.position.y + enemy.height / 2 - 15, ))
        projectiles.push(new Projectiles(-2.5,-2.5,enemy.position.x + enemy.width / 2 - 15, enemy.position.y + enemy.height / 2 - 15, ))
        projectiles.push(new Projectiles(-2.5,2.5,enemy.position.x + enemy.width / 2 - 15, enemy.position.y + enemy.height / 2 - 15, ))
        projectiles.push(new Projectiles(2.5,-2.5,enemy.position.x + enemy.width / 2 - 15, enemy.position.y + enemy.height / 2 - 15, ))
    }
    if (projectileInterval >= 65 && health <= thirdPhase && health >= finalPhase) {
        c.fillStyle = 'pink'
        c.fillRect(enemy.position.x + 20, 0, enemy.width - 40, canvas.height)
        c.fillRect(0, enemy.position.y + 20, canvas.width, enemy.height - 40)
    }
    if (projectileInterval >= 100 && health <= thirdPhase && health >= finalPhase) {
        c.fillStyle = 'red'
        c.fillRect(enemy.position.x + 20, 0, enemy.width - 40, canvas.height)
        c.fillRect(0, enemy.position.y + 20, canvas.width, enemy.height - 40)
        if (projectileInterval == 125) {
            projectileInterval = 0
        }
        if (player.position.x + player.width > enemy.position.x && player.position.x < enemy.position.x + enemy.width) {
            endGame()
        }
        if (player.position.y + player.height > enemy.position.y && player.position.y < enemy.position.y + enemy.height) {
            endGame()
        }
    }
    //code break
    if (projectileInterval >= 75 && health <= finalPhase) {
        c.fillStyle = 'pink'
        c.fillRect(enemy.position.x + 20, 0, enemy.width - 40, canvas.height)
        c.fillRect(0, enemy.position.y + 20, canvas.width, enemy.height - 40)
    }
    if (projectileInterval == 37 && health <= finalPhase) {
        projectiles.push(new Projectiles(5,0,enemy.position.x + enemy.width / 2 - 15, enemy.position.y + enemy.height / 2 - 15, ))
        projectiles.push(new Projectiles(-5,0,enemy.position.x + enemy.width / 2 - 15, enemy.position.y + enemy.height / 2 - 15, ))
        projectiles.push(new Projectiles(0,5,enemy.position.x + enemy.width / 2 - 15, enemy.position.y + enemy.height / 2 - 15, ))
        projectiles.push(new Projectiles(0,-5,enemy.position.x + enemy.width / 2 - 15, enemy.position.y + enemy.height / 2 - 15, ))
        //diagonal projectile shooting
        projectiles.push(new Projectiles(2.5,2.5,enemy.position.x + enemy.width / 2 - 15, enemy.position.y + enemy.height / 2 - 15, ))
        projectiles.push(new Projectiles(-2.5,-2.5,enemy.position.x + enemy.width / 2 - 15, enemy.position.y + enemy.height / 2 - 15, ))
        projectiles.push(new Projectiles(-2.5,2.5,enemy.position.x + enemy.width / 2 - 15, enemy.position.y + enemy.height / 2 - 15, ))
        projectiles.push(new Projectiles(2.5,-2.5,enemy.position.x + enemy.width / 2 - 15, enemy.position.y + enemy.height / 2 - 15, ))
    }
    if (projectileInterval >= 150 && health <= finalPhase) {
        c.fillStyle = 'red'
        c.fillRect(enemy.position.x + 20, 0, enemy.width - 40, canvas.height)
        c.fillRect(0, enemy.position.y + 20, canvas.width, enemy.height - 40)
        if (projectileInterval == 175) {
            projectileInterval = 0
        }
        if (player.position.x + player.width > enemy.position.x && player.position.x < enemy.position.x + enemy.width) {
            endGame()
        }
        if (player.position.y + player.height > enemy.position.y && player.position.y < enemy.position.y + enemy.height) {
            endGame()
        }
    }
    if (health <= 0 && timesToIterateWinScript == 1) {
        enemy.width = 0
        for (let i = 0; i < 50; i++) {
            iFrames = 0
            particles.push(new Particles(Math.random() * 5 - 2, Math.random() * 5 - 2,enemy.position.x,enemy.position.y, 'red'))
            particles.forEach(particle => {
                particle.update()
            });
        }
        timesToIterateWinScript = 0
    }
    if (health <= 0 && timesToIterateWinScript == 0 && iFrames >= 50) {
        projectiles = []
        projectiles.forEach((projectile, index) => {
            projectile.update()
        })
        gameOver = true
        canvas.style = 'display: none;'
        document.querySelector('body').style = 'background-color: black;'
        document.getElementById("gameWinScreen").style = "display: box; text-align: center; font-family: Verdana; color: cyan;"
    }
    if (health <= 0) {
        projectiles = []
        firstPhase = 9999
        secondPhase = 9999
        thirdPhase = 9999
        finalPhase = 9999
    }
    health--
    projectileInterval++
    dashcooldown--
    bossBar.width = health / 3
}
animatePlayer()
function animateEnemy() {
    requestAnimationFrame(animateEnemy)
    if(gameOver) {
        return
    }
    if (player.position.x - player.width / 2 > enemy.position.x) {
        enemy.velocity.x = 2
    }
    if (player.position.x - player.width / 2 < enemy.position.x) {
        enemy.velocity.x = -2
    }
    if (player.position.y - player.height / 2 > enemy.position.y) {
        enemy.velocity.y = 2
    }
    if (player.position.y - player.height / 2 < enemy.position.y) {
        enemy.velocity.y = -2
    }
    if (playerHealth == 0) {
        player.width = 0
        player.height = 0
    }
    if (playerHealth == 0 && iFrames >= 50) {
        gameOver = true
        particles = []
        canvas.style = 'display: none;'
        document.querySelector('body').style = 'background-color: black;'
        document.getElementById("gameOverScreen").style = "display: box; text-align: center; font-family: Verdana; color: red;"
    }
    if (iFrames >= 50) {
        particles = []
    }
    iFrames++
}
animateEnemy()
function endGame() {
    if (iFrames >= 51) {
        playerHealth--
        iFrames = 0
        for (let i = 0; i < 20; i++) {
            particles.push(new Particles(Math.random() * 5 - 2, Math.random() * 5 - 2,player.position.x,player.position.y, 'cyan'))
        }
    }  
    /*canvas.style = "display: none;"
    gameOver = true
    document.getElementById("gameOverScreen").style = "display: box; text-align: center; font-family: Verdana; color: red;"
    document.getElementById('finalScore').innerText = health
    document.querySelector('body').style = 'background-color: black;'*/
}
window.addEventListener("keydown", () =>{
    switch (event.key) {
        case 'd':
            music.play()
            keysPressed.d = true
            direction = 90
        break
        case 'a':
            music.play()
            keysPressed.a = true
            direction = -90
        break
        case 'w':
            music.play()
            keysPressed.w = true
            direction = 0
        break
        case 's':
            music.play()
            keysPressed.s = true
            direction = 180
        break
    }
})
window.addEventListener("keyup", () =>{
    switch (event.key) {
        case 'd':
            music.play()
            keysPressed.d = false
        break
        case 'a':
            music.play()
            keysPressed.a = false
        break
        case 'w':
            music.play()
            keysPressed.w = false
        break
        case 's':
            music.play()
            keysPressed.s = false
        break
        case ' ':
            music.play()
            if (direction == 90 && dashcooldown <= 0) {
                player.position.x += 200
                dashcooldown = 30
            }
            if (direction == -90 && dashcooldown <= 0) {
                player.position.x += -200
                dashcooldown = 30
            }
            if (direction == 0 && dashcooldown <= 0) {
                player.position.y += -200
                dashcooldown = 30
            }
            if (direction == 180 && dashcooldown <= 0) {
                player.position.y += 200
                dashcooldown = 30
            }
        break
    }
})
