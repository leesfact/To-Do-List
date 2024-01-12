window.onload = () => {
    TodoEvent.getInstance().addEventAddTodoClick();
    TodoEvent.getInstance().addEventAddTodoKeyUp();
    TodoEvent.getInstance().addEventAddBtnAll();
    TodoEvent.getInstance().addEventAddBtnIng();
    TodoEvent.getInstance().addEventAddBtnCpt();
    TodoEvent.getInstance().addEventAddAllSelect();
    TodoEvent.getInstance().addEventAddAllDelete();
    TodoService.getInstance();
}