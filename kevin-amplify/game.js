// Elementos del juego
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');

// Variables del juego
let score = 0;
let gameRunning = false;
let platforms = [];
let player = {
    x: canvas.width / 2 - 15,
    y: canvas.height - 50,
    width: 30,
    height: 30,
    dx: 0,
    dy: 0,
    gravity: 0.2,
    jumpForce: -8,
    maxSpeed: 5,
    color: '#FF5722'
};
let keys = {
    left: false,
    right: false
};

// Inicializar plataformas
function initPlatforms() {
    platforms = [];
    // Plataforma inicial debajo del jugador
    platforms.push({
        x: player.x - 10,
        y: player.y + 20,
        width: 50,
        height: 10,
        color: '#4CAF50'
    });

    // Crear plataformas aleatorias
    for (let i = 0; i < 8; i++) {
        platforms.push({
            x: Math.random() * (canvas.width - 70),
            y: Math.random() * canvas.height,
            width: 70,
            height: 10,
            color: '#4CAF50'
        });
    }
}

// Dibujar jugador
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Ojos del jugador
    ctx.fillStyle = 'white';
    ctx.fillRect(player.x + 7, player.y + 7, 5, 5);
    ctx.fillRect(player.x + 18, player.y + 7, 5, 5);
}

// Dibujar plataformas
function drawPlatforms() {
    platforms.forEach(platform => {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

// Actualizar jugador
function updatePlayer() {
    // Aplicar gravedad
    player.dy += player.gravity;
    player.y += player.dy;

    // Movimiento horizontal
    if (keys.left) {
        player.dx = -player.maxSpeed;
    } else if (keys.right) {
        player.dx = player.maxSpeed;
    } else {
        player.dx = 0;
    }
    player.x += player.dx;

    // Limitar movimiento horizontal
    if (player.x < 0) {
        player.x = canvas.width;
    } else if (player.x > canvas.width) {
        player.x = 0;
    }

    // Detectar colisión con plataformas
    let onPlatform = false;
    platforms.forEach(platform => {
        if (
            player.y + player.height >= platform.y &&
            player.y + player.height <= platform.y + platform.height &&
            player.x + player.width >= platform.x &&
            player.x <= platform.x + platform.width &&
            player.dy > 0
        ) {
            player.dy = player.jumpForce;
            onPlatform = true;
        }
    });

    // Si el jugador cae por debajo de la pantalla
    if (player.y > canvas.height) {
        gameOver();
    }

    // Si el jugador sube más allá de la mitad de la pantalla
    if (player.y < canvas.height / 2) {
        const diff = canvas.height / 2 - player.y;
        player.y = canvas.height / 2;
        score += Math.floor(diff);
        scoreElement.textContent = `Puntuación: ${score}`;

        // Mover plataformas hacia abajo
        platforms.forEach(platform => {
            platform.y += diff;

            // Si la plataforma sale de la pantalla, crear una nueva arriba
            if (platform.y > canvas.height) {
                platform.y = -platform.height;
                platform.x = Math.random() * (canvas.width - platform.width);
            }
        });
    }
}

// Game over
function gameOver() {
    gameRunning = false;
    startScreen.style.display = 'flex';
    score = 0;
    scoreElement.textContent = `Puntuación: 0`;
}

// Bucle del juego
function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updatePlayer();
    drawPlatforms();
    drawPlayer();

    requestAnimationFrame(gameLoop);
}

// Event listeners para teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = true;
    if (e.key === 'ArrowRight' || e.key === 'd') keys.right = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd') keys.right = false;
});

// Iniciar juego
startButton.addEventListener('click', () => {
    startScreen.style.display = 'none';
    gameRunning = true;
    player = {
        x: canvas.width / 2 - 15,
        y: canvas.height - 50,
        width: 30,
        height: 30,
        dx: 0,
        dy: 0,
        gravity: 0.2,
        jumpForce: -8,
        maxSpeed: 5,
        color: '#FF5722'
    };
    initPlatforms();
    gameLoop();
});

// Inicializar plataformas al cargar
initPlatforms();