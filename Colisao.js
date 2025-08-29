//detetar a colisao entre 2 circulos
//coordenadas e diametro
function circuloCirculo(x1, y1, d1, x2, y2, d2) {
  var xDist = x1 - x2; //distancia na horizontal
  var yDist = y1 - y2; //distancia na vertical
  var distancia = sqrt(xDist * xDist + yDist * yDist);

  //teste da colisão
  if ((d1 / 2, d2 / 2 > distancia)) {
    return true;
  } else {
    return false;
  }
}

//retorna true se houver colisao entre um rectangulo e um circulo
function circuloRectangulo(cX, cY, cL, rX, rY, rA, rL) {
  //raio do circulo
  cR = cL / 2;

  //calcular a distancia em X e em Y entre o centro do circulo e do retangulo
  var distX = Math.abs(cX - rX - rL / 2);
  var distY = Math.abs(cY - rY - rA / 2);

  //se a distancia for maior que meio retangulo + meio circulo então estão
  //muito afastados para colidirem
  if (distX > rL / 2 + cR) {
    return false;
  }
  if (distY > rA / 2 + cR) {
    return false;
  }

  //caso contrario colidem
  if (distX <= rL / 2) {
    return true;
  }
  if (distY <= rA / 2) {
    return true;
  }

  var dx = distX - rL / 2;
  var dy = distY - rA / 2;
  return dx * dx + dy * dy <= cR * cR;
}
