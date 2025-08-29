class Colecionavel {
  constructor(px, py) {
    //posiçao
    this.x, this.y;

    //diametro
    this.diam = 37;

    //imagem do Colecionavel
    this.colecionavel = loadImage("media/ecgm-logo.png");

    //posicionar
    this.x = px;
    this.y = py;
  }

  //desenhaColecionavel
  desenhaColecionavel() {
    imageMode(CENTER);
    image(this.colecionavel, this.x, this.y);
    imageMode(CORNER);
    this.colecionavel.resize(37, 37);
  }
}
