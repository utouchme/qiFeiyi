import { Box, BaseBox, MixBox, Direct } from './interface/data';
import { comBineBox, _genMixBox, isOverlap } from './utils';
export default class GenDom {
  private orignBox: Box[] = [];
  constructor(data: BaseBox[]) {
    this.initData(data);
    console.log(this.orignBox);
  }

  initData(data: BaseBox[]) {
    for (let i = 0; i < data.length; i++) {
      const el = data[i];
      this.orignBox.push(this.formatterBox(el as Box));
    }
  }

  /**
   * 生成html
   */

  genHtml(): string {
    const ASTArr = this.crossRecognition(this.orignBox as MixBox[]);
    const AST = _genMixBox({
      id: 'root',
      name: 'root',
      x: 0,
      y: 0,
      tagName: 'div',
      children: ASTArr
    });
    console.log(AST);
    const el = this.genElement(AST);
    console.log(el);

    return el.outerHTML;
  }

  /**
   * 生成 HTMLElement
   * @param AST
   */

  genElement(AST: MixBox): HTMLElement {
    const root = document.createElement('div');
    root.className = 'tao-box';
    this.iteratorTree(root, AST);
    return root;
  }

  iteratorTree(root: HTMLElement, mixBox: MixBox) {
    const arr = mixBox.children;
    const len = arr.length;
    for (let i = 0; i < len; i++) {
      const node = arr[i];
      const child = this.createTag(node, mixBox, arr[i - 1]);
      if (!node.leaf) {
        this.iteratorTree(child, node);
      }
      root.appendChild(child);
    }
  }

  /**
   * 创建标签元素
   * @param node
   */

  createTag(node: MixBox, parentNode: MixBox, prevNode: MixBox): HTMLElement {
    const element = document.createElement(node.tagName || 'div');
    this.initBoxAttributes(element, node);
    this.initBoxStyles(element, node);
    // 布局
    node.direct && element.setAttribute('tao-direct', node.direct);
    if (prevNode) {
      if (node.direct == 'x') {
        element.style.setProperty('margin-left', node.x - prevNode.x1 + 'px');
        element.style.setProperty('margin-top', node.y - parentNode.y + 'px');
      } else if (node.direct == 'y') {
        element.style.setProperty('margin-left', node.x - parentNode.x + 'px');
        element.style.setProperty('margin-top', node.y - prevNode.y1 + 'px');
      }
    } else {
      element.style.setProperty('margin-left', node.x - parentNode.x + 'px');
      element.style.setProperty('margin-top', node.y - parentNode.y + 'px');
    }

    if (node.leaf) {
      element.innerText = node.dataText || '';
    }
    return element;
  }

  initBoxAttributes(element: HTMLElement, node: MixBox) {
    const dataAttributes = node.dataAttributes;
    if (dataAttributes) {
      for (const key in dataAttributes) {
        if (dataAttributes.hasOwnProperty(key)) {
          const attribute = dataAttributes[key];
          element.setAttribute(key, attribute);
        }
      }
    }
  }

  initBoxStyles(element: HTMLElement, node: MixBox) {
    const dataStyles = node.dataStyles;
    if (dataStyles) {
      for (const key in dataStyles) {
        if (dataStyles.hasOwnProperty(key)) {
          const style = dataStyles[key];
          element.style.setProperty(key, style);
        }
      }
    }
  }

  /**
   * 格式化box
   * @param box
   */

  formatterBox(box: Box): Box {
    box.mX = box.x + box.width / 2;
    box.mY = box.y + box.height / 2;
    box.x1 = box.x + box.width;
    box.y1 = box.y + box.height;
    return box;
  }

  getNextDirect(direct: Direct) {
    if (direct == 'x') {
      return 'y';
    } else if (direct == 'y') {
      return 'x';
    }
  }

  /**
   * 十字识别法
   * @param data
   * @param startDirect
   */

  crossRecognition(data: MixBox[], startDirect: Direct = 'y'): MixBox[] {
    const recogBox: MixBox[] = this.directRecognition(data, startDirect);
    for (let i = 0; i < recogBox.length; i++) {
      const el = recogBox[i];
      const newDirect = this.getNextDirect(startDirect);
      if (!el.leafWrapper) {
        el.children = this.crossRecognition(el.children, newDirect);
      }
    }
    return recogBox;
  }

  /**
   * 方向识别
   * @param data
   * @param direct
   */

  directRecognition(data: MixBox[], direct: Direct): MixBox[] {
    let newMixBox: MixBox[] = this.splitLayer(data, direct);
    newMixBox = this.layerCombine(newMixBox, direct);
    this.markLeaf(newMixBox);
    return newMixBox;
  }

  /**
   * 标记叶子节点
   * @param data
   */

  markLeaf(data: MixBox[]): void {
    for (let i = 0; i < data.length; i++) {
      const el = data[i];
      if (el.children.length == 1) {
        el.leafWrapper = true;
        el.children[0].leaf = true;
      }
    }
  }

  /**
   * box 分层
   * @param data
   * @param direct
   */

  splitLayer(data: MixBox[], direct: Direct): MixBox[] {
    const unique: number[] = [];
    const layerSet: MixBox[] = [];
    for (let i = 0; i < data.length; i++) {
      const el = data[i];
      const xPos: number = unique.indexOf(el[direct]);
      if (xPos > -1) {
        const mixBox: MixBox = layerSet[xPos];
        layerSet[xPos] = comBineBox(mixBox, el as MixBox);
      } else {
        unique.push(el[direct]);
        const mixBox: MixBox = _genMixBox({
          id: 'layer-' + unique.length,
          name: 'layer-' + unique.length,
          direct
        });
        layerSet.push(comBineBox(mixBox, el as MixBox));
      }
    }
    return layerSet;
  }

  layerCombine(data: MixBox[], direct: Direct): MixBox[] {
    const layerMixBox: MixBox[] = [];
    let rowLayerDataFlag = -1;
    const sortData = data.sort((box1, box2) => box1[direct] - box2[direct]);
    for (let i = 0; i < sortData.length; i++) {
      let newBox = sortData[i];
      if (i <= rowLayerDataFlag) {
        continue;
      }
      const el = sortData[i];
      for (let j = sortData.length - 1; j > i; j--) {
        const ta = sortData[j];
        if (isOverlap(el, ta, direct)) {
          newBox = comBineBox(el, ta);
          for (let k = j - 1; k > i; k--) {
            newBox = comBineBox(newBox, sortData[k]);
            newBox.combine = true;
          }
          rowLayerDataFlag = j;
          break;
        }
      }
      layerMixBox.push(newBox);
    }
    return layerMixBox;
  }

  // end
}
