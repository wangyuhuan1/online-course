import { Component} from '@angular/core';
const todos = [{
  id:1,
  title:"吃饭",
  done:true
},
{
  id:2,
  title:"睡觉",
  done:false
}]
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  //声明一个todos变量，它是一个对象数组，赋予一个初值
  public todos:{
    id:number,
    title:string,
    done:boolean
  }[]=todos
  public currentEditing:{
    id:number,
    title:string,
    done:boolean
  }=null
  addTodo(e):void{
    const titleText=e.target.value
    console.log(titleText)
    if(!titleText.length){
      return
    }
    const last=this.todos[this.todos.length-1]
    this.todos.push({
      id:last?last.id+1:1,
      title:titleText,
      done:false
    })
    e.target.value=''
  }
  get toggleAll(){
    return this.todos.every(t=>t.done)
  }
  set toggleAll(val:boolean){
    this.todos.forEach(t=>t.done=val)
  }
  removeTodo(index:number):void{
    this.todos.splice(index,1)
  }
  saveEdit(todo, e) {
    todo.title = e.target.value
    this.currentEditing = null
  }
  handleEditKeyUp(e) {
    const { keyCode, target } = e
    if (keyCode === 27) {
      target.value = this.currentEditing.title
      this.currentEditing = null
    }
  }
  get remaningCount () {
    return this.todos.filter(t => !t.done).length
  }
  clearAllDone () {
    this.todos = this.todos.filter(t => !t.done)
  }
}
