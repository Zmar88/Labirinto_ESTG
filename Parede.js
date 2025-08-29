class Parede {
  constructor(px, py, pl, pa) {
    //posiçao
    this.x, this.y;

    //altura e largura
    this.altura = pa;
    this.largura = pl;

    //posicionar
    this.x = px;
    this.y = py;
  }

  //metodo de desenhar a Parede
  desenhaParede() {
    fill(243, 190, 100);
    rect(this.x, this.y, this.largura, this.altura);
    stroke(243, 190, 100);
  }
}
