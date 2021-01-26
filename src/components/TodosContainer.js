import React, { Component } from 'react'
import axios from 'axios'
import update from 'immutability-helper'

class TodosContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      todos: [],
      inputValue: ''
    }
  }

  getTodos() {
    axios.get('/tarefas')
    .then(response => {
      this.setState({todos: response.data})
    })
    .catch(error => console.log(error))
  }
  

  createTodo = (e) => {
	var tarefa = document.getElementById("tarefa").value;
	var descricao = document.getElementById("descricao").value;
	
	//console.log(tarefa+' - '+descricao)
	
	document.getElementById("tarefa").value = '';
	document.getElementById("descricao").value = '';
	
    axios.post('/nova-tarefa', {tarefa: tarefa, descricao: descricao})
    .then(response => {
		response.data.id = response.data.id[0]
      const todos = update(this.state.todos, {
        $splice: [[0, 0, response.data]]
      })
	  console.log(this.state.todos)
      this.setState({
        todos: todos,
		inputValue: ''
      })
	  console.log(todos)
    })
    .catch(error => console.log(error))   
  }
  

  updateTodo = (e, id) => {
    axios.put(`/marcar-tarefa/${id}`, {flag: e.target.checked})
    .then(response => {
      const todoIndex = this.state.todos.findIndex(x => x.id === response.data[0].id)
      const todos = update(this.state.todos, {
		  [todoIndex]: {$set: response.data[0]}
      })
      this.setState({
        todos: todos,
		inputValue: ''
      })
    })
    .catch(error => console.log(error))      
  }
  
  editTodo = (id) => {
	  const todoIndex = this.state.todos.findIndex(x => x.id === id)
	  var descricao = this.state.todos[todoIndex].descricao
	  var desc = prompt("Você pode alterar a descrição da tarefa", descricao);
  	
	  if(desc){
	      axios.put(`/alterar-tarefa/${id}`, {descricao: desc})
	      .then(response => {
	        const todoIndex = this.state.todos.findIndex(x => x.id === response.data[0].id)
	        const todos = update(this.state.todos, {
	  		  [todoIndex]: {$set: response.data[0]}
	        })
	        this.setState({
	          todos: todos,
	  		inputValue: ''
	        })
	      })
	      .catch(error => console.log(error)) 
	  }
  }

  deleteTodo = (id) => {
    axios.delete(`/excluir-tarefa/${id}`)
    .then(response => {
      const todoIndex = this.state.todos.findIndex(x => x.id === id)
      const todos = update(this.state.todos, {
        $splice: [[todoIndex, 1]]
      })
      this.setState({
        todos: todos,
		inputValue: ''
      })
    })
    .catch(error => console.log(error))
  }
  
  componentDidMount() {
    this.getTodos()
  }

  render() {
    return (
      <div>
        <div className="inputContainer">
          <input className="taskInput" type="text" id="tarefa" 
            placeholder="Tarefa" maxLength="50" />
          <input className="taskInput" type="text" id="descricao" 
            placeholder="Descrição da tarefa" maxLength="500" />
		  <button className="gravarBtn" onClick={this.createTodo} >
		    Gravar tarefa
		  </button>
        </div>  	    
	<div className="listWrapper">
	   <ul className="taskList">
		  {this.state.todos.map((todo) => {
		    return(
		      <li className="task" todo={todo} key={todo.id}>
				<input className="taskCheckbox" type="checkbox"
					checked={todo.flag} onChange={(e) => this.updateTodo(e, todo.id)} />              
				<label className="taskLabel">{todo.tarefa} - {todo.descricao}</label>
		
				<span className="deleteTaskBtn" onClick={(e) => this.deleteTodo(todo.id)} >x</span>
				<span className="editTaskBtn" onClick={(e) => this.editTodo(todo.id)} >editar</span>
		      </li>
		    )       
		  })} 	    
	   </ul>
	</div>
     </div>
    )
  }
}

export default TodosContainer