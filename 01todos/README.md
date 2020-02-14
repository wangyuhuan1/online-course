## 5.TodoMVC案例

### 5.1 下载模板

```shell
git clone https://github.com/tastejs/todomvc-app-template.git --depth 1
```

```shell
//初始化项目
ng new todomvc-angular
cd todomvc-angular
ng serve
```

将 `todomvc-angular\src\app\app.component.html` 文件内容替换如下：

```html
<section class="todoapp">
  <header class="header">
    <h1>todos</h1>
    <input class="new-todo" placeholder="What needs to be done?" autofocus>
  </header>
  <!-- This section should be hidden by default and shown when there are todos -->
  <section class="main">
    <input id="toggle-all" class="toggle-all" type="checkbox">
    <label for="toggle-all">Mark all as complete</label>
    <ul class="todo-list">
      <!-- These are here just to show the structure of the list items -->
      <!-- List items should get the class `editing` when editing and `completed` when marked as completed -->
      <li class="completed">
        <div class="view">
          <input class="toggle" type="checkbox" checked>
          <label>Taste JavaScript</label>
          <button class="destroy"></button>
        </div>
        <input class="edit" value="Create a TodoMVC template">
      </li>
      <li>
        <div class="view">
          <input class="toggle" type="checkbox">
          <label>Buy a unicorn</label>
          <button class="destroy"></button>
        </div>
        <input class="edit" value="Rule the web">
      </li>
    </ul>
  </section>
  <!-- This footer should hidden by default and shown when there are todos -->
  <footer class="footer">
    <!-- This should be `0 items left` by default -->
    <span class="todo-count"><strong>0</strong> item left</span>
    <!-- Remove this if you don't implement routing -->
    <ul class="filters">
      <li>
        <a class="selected" href="#/">All</a>
      </li>
      <li>
        <a href="#/active">Active</a>
      </li>
      <li>
        <a href="#/completed">Completed</a>
      </li>
    </ul>
    <!-- Hidden if no completed items are left ↓ -->
    <button class="clear-completed">Clear completed</button>
  </footer>
</section>
<footer class="info">
  <p>Double-click to edit a todo</p>
  <!-- Remove the below line ↓ -->
  <p>Template by <a href="http://sindresorhus.com">Sindre Sorhus</a></p>
  <!-- Change this out with your name and url ↓ -->
  <p>Created by <a href="http://todomvc.com">you</a></p>
  <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
</footer>

```

安装模板依赖的样式文件：

```shell
npm install todomvc-app-css
```

在 `todomvc-angular\src\styles.less` 文件中导入样式文件：

```css
/* You can add global styles to this file, and also import other style files */
@import url('todomvc-app-css/index.css');
```

看到如下页面说明成功。

![todomvc-angular](E:/wangke/teacher/courseware/22.angular/readme/assets/1563418624733.png)



### 5.2 列表数据渲染



```javascript
#1.app.components.ts
import { Component } from '@angular/core';

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
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  //声明一个todos变量，他是一个对象数组，赋予一个初值
  public todos:{
    id:number,
    title:string,
    done:boolean
  }[]= todos
}

#2.app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    //引入FormsModule，可以在表单中使用ngModel(双向数据绑定)
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

#3.app.component.html
 <ul class="todo-list">
      <li *ngFor="let todo of todos" [ngClass]="{completed: todo.done}">
        <div class="view">
          <input class="toggle" type="checkbox" [(ngModel)]="todo.done">
          <label>{{ todo.title }}</label>
        </div>
      </li>
    </ul>




     <!-- 
      li 是每一个任务项
      每个任务项有三种状态：
        正常状态 没有样式
        完成状态 completed
        编辑状态 editing
     -->  ???????
```

### 5.3 添加任务

### 

```javascript
#1.app.component.html
    <h1>todos</h1>
    <input
      class="new-todo"
      placeholder="What needs to be done?"
      autofocus
      (keyup.enter)="addTodo($event)">
      
      
#2.app.component.ts     
export class AppComponent {
  //声明一个todos变量，他是一个对象数组，赋予一个初值
  public todos: {
    id: number,
    title: string,
    done: boolean
  }[] = todos

  //声明一个添加任务的函数，该函数入参一个事件对象，返回值是void
  addTodo(e): void {
    const titleText = e.target.value
    if (!titleText.length) {
      return
    }

    const last = this.todos[this.todos.length - 1]

    this.todos.push({
      id: last ? last.id + 1 : 1,
      title: titleText,
      done: false
    })

    // 清除文本框
    e.target.value = ''
  }
}
```

### 5.4 切换所有任务项

![1581061830879](E:/wangke/teacher/courseware/22.angular/readme/assets/1581061830879.png)

思路：切换input控件的checked属性值由任务列表中的任务状态决定，当任务列表中的所有任务都完成，input空间的checked状态为选中状态；反之为没有选中状态

这边我们通过get、set来完成

#### 5.4.1 所有任务都完成的情况

```javascript
 #1.app.component.html
 <section class="main">
    <input id="toggle-all" class="toggle-all" type="checkbox" [checked]="toggleAll">
  
  #2.app.component.ts   
  //当在外部使用toggleAll属性的时候，调用get方法，当前方法如果todos中所有的任务完成，返回true；如果有任何一个任务没有完成，返回false
  get toggleAll () {
    return this.todos.every(t => t.done)
  }
```

#### 5.4.2 点击切换按钮

```javascript
 #1.app.component.html
<section class="main">
    <input id="toggle-all" class="toggle-all" type="checkbox" [checked]="toggleAll" (change)="toggleAll = $event.target.checked">
 
 
 #2.app.component.ts   
 //当在外部给toggleAll赋值的时候，调用set方法，作用是修改todos中所有任务的状态
  set toggleAll (val: boolean) {
    this.todos.forEach(t => t.done = val)
  }
```

### 5.5 删除任务

![1581062150742](E:/wangke/teacher/courseware/22.angular/readme/assets/1581062150742.png)

```javascript
 #1.app.component.html
 <!--1.遍历的时候添加索引i-->
<li *ngFor="let todo of todos; let i = index;" [ngClass]="{
      completed: todo.done
    }">
        <div class="view">
          <input class="toggle" type="checkbox" [(ngModel)]="todo.done">
          <label>{{ todo.title }}</label>
		  <!--2.添加删除按钮-->
          <button class="destroy" (click)="removeTodo(i)"></button>
        </div>
      </li>
      
#2.app.component.ts       
removeTodo (index: number): void {
    this.todos.splice(index, 1)
 }
```

### 5.6 编辑功能

#### 5.6.1 双击label启用编辑样式

![1581062662377](E:/wangke/teacher/courseware/22.angular/readme/assets/1581062662377.png)

```javascript
  #1.app.component.html
  <ul class="todo-list">
      <!--1.新增一个currentEditing变量用于控制当前li是否添加editing样式-->
      <li *ngFor="let todo of todos; let i = index;" [ngClass]="{completed: todo.done, editing: currentEditing === todo}">
        <div class="view">
          <input class="toggle" type="checkbox" [(ngModel)]="todo.done">
          <!--2.双击当前label，修改currentEditing的值-->
          <label (dblclick)="currentEditing = todo">{{ todo.title }}</label>
          <button class="destroy" (click)="removeTodo(i)"></button>
        </div>
		<!--3.添加一个input文本框用于文本编辑--->
        <input class="edit" [value]="todo.title">
      </li>
    </ul>
  
  
#2.app.component.ts    
//4.声明currentEditing用来表示当前正在编辑的对象
  public currentEditing: {
    id: number,
    title: string,
    done: boolean
  } = null
```

#### 5.6.2 回车键、失去焦点保存编辑、esc取消编辑

```javascript
 #1.app.component.html
      <input class="edit" [value]="todo.title" (keyup)="handleEditKeyUp($event)"
      (keyup.enter)="saveEdit(todo, $event)" (blur)="saveEdit(todo, $event)">
          
          
#2.app.component.ts
  saveEdit(todo, e) {
    // 保存编辑
    todo.title = e.target.value
    // 去除编辑样式
    this.currentEditing = null
  }

  //键盘弹起的时候判断是否按下了回车键
  handleEditKeyUp(e) {
    const { keyCode, target } = e
    //esc键  还原最初的文字
    if (keyCode === 27) {
      // 取消编辑
      // 同时把文本框的值恢复为原来的值
      target.value = this.currentEditing.title
      this.currentEditing = null
    }
  }
```

### 5.7 剩余未完成任务数量显示

```javascript
 #1.app.component.html
<footer class="footer">
    <span class="todo-count"><strong>{{remaningCount}}</strong> item left</span>
  
 #2.app.component.ts   
 //剩余未完成任务数量
  get remaningCount () {
    return this.todos.filter(t => !t.done).length
  }
```

### 5.8 清除所有已完成任务

```javascript
#1.app.component.html
  <button
    (click)="clearAllDone()"
    class="clear-completed">Clear completed</button>
</footer>  
  
#2.app.component.ts 
  // 清除所有已完成任务项
   clearAllDone () {
    this.todos = this.todos.filter(t => !t.done)
  }
```

### 5.9 任务列表过滤

```javascript
#1.app.component.html
 <footer class="footer">
    <span class="todo-count"><strong>{{remaningCount}}</strong> item left</span>
    <!-- 1.点击a标签切换路由 -->
    <ul class="filters">
      <li>
        <a class="selected" href="#/">All</a>
      </li>
      <li>
        <a href="#/active">Active</a>
      </li>
      <li>
        <a href="#/completed">Completed</a>
      </li>
    </ul>
    
    
#2.app.component.ts     
  import { Router, NavigationStart, NavigationEnd } from '@angular/router';
  //2.添加一个属性用于控制任务列表的切换
  public visibility: string = 'all'
  //3.注入路由对象
  constructor( private router: Router) {}
  //4.ngOnInit方法中监听路由变化，根据不同的地址修改this.visibility为不同类型
  ngOnInit() {
    this.router.events
    .subscribe((event) => {
      /* 路由事件类型：
        NavigationStart：导航开始
        NavigationEnd：导航结束
        NavigationCancel：取消导航
        NavigationError：导航出错
        RoutesRecoginzed：路由已认证
      */
      if(event instanceof NavigationEnd) {
        const hash = window.location.hash.substr(1)
        switch (hash) {
          case '/':
            this.visibility = 'all'
            break;
          case '/active':
            this.visibility = 'active'
            break;
          case '/completed':
            this.visibility = 'completed'
            break;
        }
      }
    });
  }

  //5.get方法，当visibility发生变化的时候会触发该方法，在该方法中返回新列表
  get filterTodos() {
    if (this.visibility === 'all') {
      return this.todos
    } else if (this.visibility === 'active') {
      return this.todos.filter(t => !t.done)
    } else if (this.visibility === 'completed') {
      return this.todos.filter(t => t.done)
    }
  }

#3.修改app.component.html的ngFor循环的变量
<ul class="todo-list">
      <!--1.新增一个currentEditing变量用于控制当前li是否添加editing样式-->
      <li *ngFor="let todo of filterTodos; let i = index;"
```