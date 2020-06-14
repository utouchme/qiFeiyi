import { MixBox, Direct } from './interface/data';

function isOverlap(box1: MixBox, box2: MixBox, direct: Direct): boolean {
  let overLap = false;
  if (direct == 'y' && Math.abs(box1.mY - box2.mY) < box1.height / 2 + box2.height / 2) {
    overLap = true;
  } else if (direct == 'x' && Math.abs(box1.mX - box2.mX) < box1.width / 2 + box2.width / 2) {
    overLap = true;
  } else if (
    Math.abs(box1.mX - box2.mX) < box1.width / 2 + box2.width / 2 &&
    Math.abs(box1.mY - box2.mY) < box1.height / 2 + box2.height / 2
  ) {
    overLap = true;
  }
  return overLap;
}

function _genMixBox(mixBox?: Record<string, any>): MixBox {
  const initMixBox: MixBox = {
    id: '',
    name: '',
    width: 0,
    height: 0,
    x: Infinity,
    y: Infinity,
    x1: 0,
    y1: 0,
    mX: 0,
    mY: 0,
    children: [],
    direct: 'x'
  };

  return { ...initMixBox, ...(mixBox || {}) };
}

function comBineBox(box1: MixBox, box2: MixBox): MixBox {
  const newBox = _genMixBox(box1);
  newBox.id += box2.id;
  newBox.name += box2.name;
  if (box2.x < newBox.x) {
    newBox.x = box2.x;
  }
  if (box2.y < newBox.y) {
    newBox.y = box2.y;
  }
  if (box2.x1 > newBox.x1) {
    newBox.x1 = box2.x1;
  }
  if (box2.y1 > newBox.y1) {
    newBox.y1 = box2.y1;
  }
  newBox.width = newBox.x1 - newBox.x;
  newBox.height = newBox.y1 - newBox.y;
  newBox.mX = newBox.x + newBox.width / 2;
  newBox.mY = newBox.y + newBox.height / 2;
  newBox.children = (newBox.children || []).concat(box2.children || box2);
  return newBox;
}

export { _genMixBox, comBineBox, isOverlap };

export default { _genMixBox, comBineBox, isOverlap };
