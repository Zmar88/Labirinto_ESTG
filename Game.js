let video;
let poseNet;

//propriedades iniciais do heroi(bola)
let heroiX = 0;
let heroiY = 0;
let heroiDiam = 25;

let gameOver;
let pontuacao;

//definição do ecrã inicial
let ECRA = 0;

//botoes
let botao1;
let botao2;
let botao1Over;
let botao2Over;
let back;
let backOver;

//fonte
let fonteTexto;

//temporizador
let timer = 5;

//array de paredes
let asParedes = [];

//array de colecionaveis
let osColecionaveis = [];

//numero inicial de paredes
let numParedes = 12;

//numero inicial de colecionaveis
let numColecionaveis = 3;

//numero de vidas
let numVidas;

//ficheiros de som
let musicaFundo, somItem, somGameOver, somVitoria;

// função de preload
function preload() {
  //loading de imagens
  botao1 = loadImage("media/botaoJogar.png");
  botao2 = loadImage("media/botaoInst.png");
  botao1Over = loadImage("media/botaoJogarOver.png");
  botao2Over = loadImage("media/botaoInstOver.png");
  ecraInstrucoes = loadImage("media/inst.png");
  fonteTexto = loadFont("media/YouBlockhead.ttf");
  back = loadImage("media/back.png");
  backOver = loadImage("media/backOver.png");
  bg = loadImage("media/bg.png");
  meta = loadImage("media/meta.png");
  bg2 = loadImage("media/bg2.png");
  vencer = loadImage("media/vencer2.png");
  perdeu = loadImage("media/gameOver.png");
  inst = loadImage("media/inst2.png");

  //o audio devera ser pre-carregado para depois ser ativado
  soundFormats("mp3", "wav", "ogg");
  musicaFundo = loadSound("media/MusicaFundo.mp3");
  somItem = loadSound("media/ApanhaItem.wav");
  somGameOver = loadSound("media/GameOver.wav");
  somVitoria = loadSound("media/SomVitoria.wav");
}

function setup() {
  createCanvas(800, 480);

  //video
  video = createCapture(VIDEO);
  video.hide();

  //posenet
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on("pose", gotPoses);

  initJogo();
}

function initJogo() {
  //para qualquer som que esteja a ser tocado
  musicaFundo.stop();

  initParedes();
  initColecionaveis();

  //definição das variaveis no inicio de jogo
  pontuacao = 0;
  numVidas = 3;
  numColecionaveis = 3;
  gameOver = false;

  //musica em loop
  musicaFundo.loop();
}

function gotPoses(poses) {
  // console.log(poses);

  //update da posição do heroi(bola)
  if (poses.length > 0) {
    heroiX = poses[0].pose.keypoints[0].position.x;
    heroiY = poses[0].pose.keypoints[0].position.y;
  }
}

//Função para testar se o PoseNet foi acedido com sucesso
function modelReady() {
  console.log("PoseNet carregado!!!!");
}

function draw() {
  //ecrã de "Menu"
  if (ECRA == 0) {
    //background
    image(bg, 0, 0);

    //botoes
    image(botao1, 300, 300, 196, 55);
    image(botao2, 300, 380, 196, 55);

    //reinicia a pontuação e o nº de vidas
    pontuacao = 0;
    numVidas = 3;

    //hover dos botões
    if (mouseX > 300 && mouseX < 470 && mouseY > 300 && mouseY < 360) {
      image(botao1Over, 300, 300, 196, 55);
    } else if (mouseX > 300 && mouseX < 470 && mouseY > 380 && mouseY < 440) {
      image(botao2Over, 300, 380, 196, 55);
    }
  } else if (ECRA == 5) {
    //ecrã de "Pré-Jogo"/"Loading"
    image(inst, 0, 0, 800, 480);
    textSize(100);
    textFont(fonteTexto);
    fill(255);
    noStroke();

    //temporizador
    text(timer, width / 2 - 48, height / 2 + 30);

    //inverte o sentido do ecrã
    translate(video.width, 0);
    scale(-1, 1);
    desenhaHeroi();

    //diminuição do valor do timer conforme o tempo passa
    if (frameCount % 60 == 0 && timer > 0) {
      timer--;
    }
    if (timer == 0) {
      //se chegar a 0 o utilizador é redirecionado para o ecrã "Jogo"
      ECRA = 1;
    }
  }
  if (ECRA == 1) {
    //ecrã "Jogo"

    image(bg2, 0, 0, 800, 480);
    textFont(fonteTexto);
    textSize(12);
    fill(243, 190, 100);
    noStroke();
    text("Pontuação: " + pontuacao, 650, 20);
    text("Coleciona todos os objetos e alcança a meta!", 650, 100, 150);

    //desenha o video da camara invertido
    translate(video.width, 0);
    scale(-1, 1);
    image(video, 0, 0);

    //enquanto gameOver==false
    if (!gameOver) {
      desenhaHeroi();

      desenhaLabirinto();
      desenhaColecionaveis();

      image(meta, 0, 50, 38, 48);
      image(meta, 0, 0, 38, 48);

      detetaColisao();

      ganhaJogo();
    } else {
      console.log("Perdeste!");
    }
  } else if (ECRA == 2) {
    //ecrã "Instruções"
    image(ecraInstrucoes, 0, 0, 800, 480);
    image(back, 30, 30, 75, 72);

    if (mouseX > 30 && mouseX < 105 && mouseY > 30 && mouseY < 102) {
      image(backOver, 30, 30, 75, 72);
    }
  } else if (ECRA == 3) {
    //ecrã "Vencer"
    image(vencer, 0, 0, 820, 480);
    //textSize(25);
    text("Pontuação: " + pontuacao, 280, 400);
    fill(255);
    noStroke();

    image(back, 30, 30, 75, 72);

    if (mouseX > 30 && mouseX < 105 && mouseY > 30 && mouseY < 102) {
      image(backOver, 30, 30, 75, 72);
    }
  } else if (ECRA == 4) {
    //ecrã "Perder"
    image(perdeu, 0, 0, 800, 480);
    //textSize(25);
    text("Pontuação: " + pontuacao, 280, 400);
    fill(255);
    noStroke();

    image(back, 30, 30, 75, 72);

    if (mouseX > 30 && mouseX < 105 && mouseY > 30 && mouseY < 102) {
      image(backOver, 30, 30, 75, 72);
    }
  }
}

//desenha o heroi
function desenhaHeroi() {
  fill(255, 0, 0);
  ellipse(heroiX, heroiY, heroiDiam);
  //stroke(255, 0, 0);
}

//initParedes
function initParedes() {
  for (var i = 0; i < numParedes; i++) {
    var pix = random(0, 1) * (width - 20) + 10;
    var piy = random(0, 1) * (height - 20) + 10;
    var w = 100;
    var h = 20;

    //dependendo do seu index as paredes são desenhadas em posições pré-definidas
    switch (i) {
      case 0:
        pix = 620;
        piy = 1;
        w = 20;
        h = 600;
        break;

      case 1:
        pix = 1;
        piy = 100;
        w = 20;
        h = 379;
        break;

      case 2:
        pix = 19;
        piy = 459;
        w = 610;
        h = 25;
        break;

      case 3:
        pix = 20;
        piy = 1;
        w = 600;
        h = 20;
        break;

      case 4:
        pix = 349;
        piy = 101;
        w = 20;
        h = 600;
        break;

      case 5:
        pix = 270;
        piy = 1;
        w = 20;
        h = 299;
        break;

      case 6:
        pix = 350;
        piy = 100;
        w = 200;
        h = 20;
        break;

      case 7:
        pix = 1;
        piy = 150;
        w = 200;
        h = 20;
        break;

      case 8:
        pix = 100;
        piy = 280;
        w = 175;
        h = 20;
        break;

      case 9:
        pix = 450;
        piy = 230;
        w = 180;
        h = 20;
        break;

      case 10:
        pix = 200;
        piy = 290;
        w = 20;
        h = 100;
        break;

      case 11:
        pix = 140;
        piy = 1;
        w = 20;
        h = 90;
        break;
    }

    parede = new Parede(pix, piy, w, h);
    asParedes.push(parede);
  }
}

//initColecionaveis
function initColecionaveis() {
  for (var i = 0; i < numColecionaveis; i++) {
    var x = random(0, 1) * (640 - 20) + 10;
    var y = random(0, 1) * (height - 20) + 10;
    colecionavel = new Colecionavel(x, y);

    //verifica que o colecionavel não entra
    //dentro das paredes do labirinto
    if (asParedes.length > 0) {
      for (var j = 0; j < asParedes.length; j++) {
        aParede = asParedes[j];
        if (
          circuloRectangulo(
            colecionavel.x,
            colecionavel.y,
            colecionavel.diam,
            aParede.x,
            aParede.y,
            aParede.altura,
            aParede.largura
          )
        ) {
          colecionavel.x = random(0, 1) * (640 - 20) + 10;
          colecionavel.y = random(0, 1) * (height - 20) + 10;
          //reverifica a nova posição com todas as paredes
          j = 0;
        }
      }
    }
    osColecionaveis.push(colecionavel);
  }
}

//desenha o labirinto
function desenhaLabirinto() {
  if (asParedes.length > 0) {
    for (var g = 0; g < asParedes.length; g++) {
      aParede = asParedes[g];
      aParede.desenhaParede();
    }
  }
}

//desenha os colecionaveis
function desenhaColecionaveis() {
  if (osColecionaveis.length > 0) {
    for (var g = 0; g < osColecionaveis.length; g++) {
      oColecionavel = osColecionaveis[g];
      oColecionavel.desenhaColecionavel();
    }
  }
}

//detetaColisao
function detetaColisao() {
  if (asParedes.length > 0) {
    for (var j = 0; j < asParedes.length; j++) {
      aParede = asParedes[j];
      if (
        circuloRectangulo(
          heroiX,
          heroiY,
          heroiDiam,
          aParede.x,
          aParede.y,
          aParede.altura,
          aParede.largura
        )
      ) {
        console.log("Tocaste!");
        numVidas--;
        //se o numero de vidas for 0
        if (numVidas <= 0) {
          musicaFundo.stop();
          somGameOver.play();
          gameOver = true;
          ECRA = 4;
          limpaColecionaveis();
        }
      }
    }
    for (var j = 0; j < osColecionaveis.length; j++) {
      oColecionavel = osColecionaveis[j];
      if (
        circuloCirculo(
          heroiX,
          heroiY,
          heroiDiam,
          oColecionavel.x,
          oColecionavel.y,
          oColecionavel.diam
        )
      ) {
        //remove o colecionavel após colisão com o heroi
        removeColecionavel(oColecionavel);
      }
    }
  }
}

//removeColecionavel
function removeColecionavel(obj) {
  var index = osColecionaveis.indexOf(obj);
  if (index > -1) {
    osColecionaveis.splice(index, 1);
    pontuacao++;
    somItem.play();
    console.log("Pontuação: " + pontuacao);
  }
}

//ganhaJogo
function ganhaJogo() {
  if (heroiX <= 70 && heroiY >= 60 && heroiY <= 150) {
    ECRA = 3;
    musicaFundo.stop();
    somVitoria.play();
    limpaColecionaveis();
    console.log("Ganhaste!!!!");
  }
}

//função para o click do mouse com os botões
function mouseClicked() {
  if (ECRA == 0) {
    if (mouseX < 470 && mouseX > 300) {
      if (mouseY < 370 && mouseY > 300) {
        timer = 5;
        ECRA = 5;
      }
      if (mouseY < 440 && mouseY > 380) {
        ECRA = 2;
      }
    }
  } else if (ECRA == 2) {
    if (mouseX > 30 && mouseX < 105 && mouseY > 30 && mouseY < 102) {
      ECRA = 0;
      initJogo();
    }
  } else if (ECRA == 3) {
    if (mouseX > 30 && mouseX < 105 && mouseY > 30 && mouseY < 102) {
      ECRA = 0;
      initJogo();
    }
  } else if (ECRA == 4) {
    if (mouseX > 30 && mouseX < 105 && mouseY > 30 && mouseY < 102) {
      ECRA = 0;
      initJogo();
    }
  }
}

//necessario pra ativar o audio apos click no canvas
function touchStarted() {
  if (getAudioContext().state !== "running") {
    getAudioContext().resume();
  }
}

//limpa o array dos Colecionaveis
function limpaColecionaveis() {
  osColecionaveis = [];
  if (osColecionaveis.length > 0) {
    for (var g = 0; g < osColecionaveis.length; g++) {
      oColecionavel = osColecionaveis[g];
      removeColecionavel(oColecionavel);
    }
  }
}
