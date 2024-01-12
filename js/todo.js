class TodoEvent {

    // Singleton
    static #instance = null;
    static getInstance() {
        if(this.#instance == null) {
            this.#instance = new TodoEvent();
        }
        return this.#instance;
    }
    
    addEventAddTodoClick() {
        const addButton = document.querySelector(".plus-button");
        addButton.onclick = () => {
            this.addTodo();
        }
    }


    addEventAddTodoKeyUp() {
        const addText = document.querySelector(".add-text");
        addText.onkeydown = (event) => {
            if (event.keyCode === 13) {
                const textValue = addText.value.trim();
                if (/[\S\s]/.test(textValue)) {
                    const addButton = document.querySelector(".plus-button");
                    addButton.click();
                } else {
                    this.showError();
                }
            }
        };
    }
    
    
    

    addTodo() {
        const addText = document.querySelector(".add-text");
        const textValue = addText.value.trim();
        if (/[\S\s]/.test(textValue)) {
            TodoService.getInstance().addList(textValue);
            addText.value = "";
            this.clearError(); 
        } else {
            this.showError(); 
        }
    }
   

    showError() {
        
        this.clearError();
    
       
        const noticeErr = document.createElement("div");
        noticeErr.setAttribute("class", "notice");
        noticeErr.textContent = "* 내용을 입력해주세요."; 
    
        const addBox = document.querySelector(".add-box");
        addBox.appendChild(noticeErr);
    
        
        const addText = document.querySelector(".add-text");
        addText.style.borderBottom = "1px solid rgb(201, 65, 65)";
    }
    

    clearError() {
        const addText = document.querySelector(".add-text");
        const existingNotice = document.querySelector(".notice");
        if (existingNotice) {
            existingNotice.remove();
        }
        addText.style.borderBottom = "1px solid rgb(163, 155, 155)";
    }
    
    
    addEventAddBtnAll() {
        const btnAll = document.querySelector(".btn-all");
        const listElements = TodoService.getInstance().listCount();
        btnAll.onclick = () => {
            listElements.forEach(listElement => {
                listElement.style.display = "";
            });
        }
    }

    addEventAddBtnIng() {
        const btnIng = document.querySelector(".btn-ing");
        const listElements = TodoService.getInstance().listCount();
        const listCheck = TodoService.getInstance().checkList();

        btnIng.onclick = () => {
            for(let i = 0; i < listCheck.lebgth; i++) {
                if(listCheck[i].checked == true) {
                    listElements.style.display = "none";
                } else {
                    listElements.style.display = "";
                }
            }
        }

    }

    addEventAddBtnCpt() {
        const btnCpt = document.querySelector(".btn-cpt");
        const listElements = TodoService.getInstance().listCount();
        const listCheck = TodoService.getInstance().checkList();

        btnCpt.onclick = () => {
            for(let i = 0; i < listCheck.length; i++) {
                if(listCheck[i].checked == true) {
                    listElements.style.display = "";
                } else {
                    listElements.style.display = "none";
                }
            }
        }
    }

    addEventAddAllSelect() {
        const allSelect = document.querySelector(".all-select");
        
        allSelect.onclick = () => {
            const {listCheck, listLabel} = TodoService.getInstance().checkList();
            if(allSelect.checked == true) {
                for(let i = 0; i < listCheck.length; i++) {
                    listCheck[i].checked = true;
                    listLabel[i].style.textDecoration = "line-through"
                    listLabel[i].style.color = "indianred";
                    
                    
                }
            } else {
                for(let i = 0; i < listCheck.length; i++) {
                    listCheck[i].checked = false;
                    listLabel[i].style.textDecoration = "none";
                    listLabel[i].style.color = "black";
                }
            }
            TodoService.getInstance().listCount();
        }
    }

    addEventAddAllDelete() {
        const allDelete = document.querySelector(".all-delete");
        const listContainer = document.querySelector(".list-container");
        const allSelect = document.querySelector(".all-select");
        allDelete.onclick = () => {
            listContainer.innerHTML = ``;
            allSelect.checked = false;
            TodoService.getInstance().todoList = []; 
            TodoService.getInstance().updateLocalStorage(); 
        }
    }
}


class TodoService {
    // Singleton
    static #instance = null;
    static getInstance() {
        if(this.#instance == null) {
            this.#instance = new TodoService();
        }
        return this.#instance;
    }
    

    todoList = null;

    constructor() {
        if(localStorage.getItem("TODO") == null) {
            this.todoList = new Array();
        } else {
            this.todoList = JSON.parse(localStorage.getItem("TODO"));
        }
        this.loadTodoList();
    }

    addList(textValue) {
        const todoObj = { todoContent: textValue };
        this.todoList.push(todoObj);
        this.updateLocalStorage();
    }

    updateLocalStorage() {
        localStorage.setItem("TODO", JSON.stringify(this.todoList));
        this.loadTodoList();
    }


    loadTodoList() {
        const listContainer = document.querySelector(".list-container");
        listContainer.innerHTML = "";
    
        this.todoList.forEach((todoObj) => {
            const list = document.createElement("div");
            list.setAttribute("class", "list");
            list.innerHTML = `<label class="list-label"><input type="checkbox" class="list-check">${todoObj.todoContent}</label><button class="delete-button">x</button>`;
            listContainer.appendChild(list);
        });
    
        this.checkList();
        this.deleteList();
        this.listCount();
    }

    checkList() {
        const listCheck = document.querySelectorAll(".list-check");
        const listLabel = document.querySelectorAll(".list-label");

        listCheck.forEach((listElement,index) => {
            listElement.onclick = () => {
               if(listElement.checked) {
                listLabel[index].style.textDecoration = "line-through";
                listLabel[index].style.color = "indianred";
               } else {
                listLabel[index].style.textDecoration = "none";
                listLabel[index].style.color = "black";
               }
               this.listCount();
            }

        });
        return { listCheck, listLabel };
    }

    deleteList() {
        const deleteButton = document.querySelectorAll(".delete-button");
        const listElements = document.querySelectorAll(".list");
        deleteButton.forEach((deleteElement,index) => {
            deleteElement.onclick = () => {
                listElements[index].remove();
                this.todoList.splice(index, 1); 
                this.updateLocalStorage(); 
                this.listCount();
            }
        });

        
    }

    listCount() {
        const beforeArray = [];
        const afterArray = [];
        const listElements = document.querySelectorAll(".list");
        const listCheck = document.querySelectorAll(".list-check");

        for(let i = 0; i < listElements.length; i++ ) {
            if(listCheck[i].checked == false) {
                beforeArray.push(listElements[i]);
            } else {
                afterArray.push(listElements[i]);
            }

        }

        const beforeCount = beforeArray.length;
        const afterCount = afterArray.length;
        const allCount = beforeCount + afterCount ;

        const btnAll = document.querySelector(".btn-all");
        const btnIng = document.querySelector(".btn-ing");
        const btnCpt = document.querySelector(".btn-cpt");

        btnAll.value = "전체 : " + allCount ;
        btnIng.value = "진행중  : " + beforeCount;
        btnCpt.value = "완료 : " + afterCount;

        return listElements;
    }
    


}