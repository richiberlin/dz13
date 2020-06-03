import { DnD } from "./dnd";

export class Note {
  constructor(button) {
    this.data = [];
    this.container = document.querySelector(".container"); // контейнер, нужен для изоляции заметок от остального html
    this.button = button;

    this.colorInput = document.querySelector("#colorInput");

    this._handleClickButton = this._clickButton.bind(this);
    this.setCoords = this._setCoords.bind(this);

    this._init();
  }

  _init() {
    this.button.addEventListener("click", this._handleClickButton);
  }

  // метод для записи координат в data, передаём его в класс DnD
  _setCoords(note, coords) {
    const index = note.getAttribute("data-index");

    this.data[index].left = coords.x;
    this.data[index].top = coords.y;
    console.log(this.data); // если вызвать в контексте класса Note в другом классе, есть доступ к data
  }

  _constructorNote(content, top, left, color) {
    return {
      content,
      top,
      left,
      color,
    };
  }

  _editNote(textAreaNode, contentNode, index) {
    console.log(textAreaNode, contentNode, index);

    if (textAreaNode.hidden) {
      textAreaNode.hidden = false;
      contentNode.hidden = true;
    } else {
      textAreaNode.hidden = true;
      contentNode.hidden = false;
      this.data[index].content = textAreaNode.value;

      this.render();
    }
  }

  _clickButton() {
    const color = this.colorInput.value;
    const newNoteObj = this._constructorNote("Hello", 48, 24, color); // передаём дефолтные значения
    this.data.push(newNoteObj);

    this.render();
  }

  _clickCloseButton(index) {
    this.data.splice(index, 1);

    this.render();
  }

  _createNote(data, index) {
    const [divNode, buttonNode, textAreaNode] = [
      document.createElement("div"),
      document.createElement("button"),
      document.createElement("textarea"),
    ];

    const noteNode = divNode.cloneNode(true);
    noteNode.setAttribute("data-index", index); // index нужен, чтобы найти объект в массиве data
    noteNode.classList.add("note");
    noteNode.style.cssText = `position: absolute; top: ${data.top}px; left: ${data.left}px; background-color: ${data.color}`;
    new DnD(noteNode, this.setCoords);

    const btnCloseNode = buttonNode.cloneNode(true);
    btnCloseNode.classList.add("note__close");
    btnCloseNode.innerHTML = `<i class="fas fa-times"></i>`;
    btnCloseNode.addEventListener("click", () => {
      this._clickCloseButton(index);
    });

    const btnEditNode = buttonNode.cloneNode(true);
    btnEditNode.classList.add("note__edit");
    btnEditNode.innerHTML = `<i class="far fa-edit">Редактировать</i>`;
    btnEditNode.addEventListener("click", () => {
      this._editNote(textAreaNode, contentNode, index);
    });

    const contentNode = divNode.cloneNode(true);
    contentNode.classList.add("note__content");
    contentNode.innerHTML = data.content;

    textAreaNode.classList.add("note_textarea");
    textAreaNode.value = data.content;
    textAreaNode.hidden = true;

    noteNode.append(btnCloseNode, contentNode, textAreaNode, btnEditNode);

    return noteNode;
  }

  render() {
    this.container.innerHTML = ""; // очищаем контейнер перед каждым рендером

    this.data.forEach((noteObj, index) => {
      const noteNode = this._createNote(noteObj, index);

      this.container.append(noteNode);
    });
  }
}
