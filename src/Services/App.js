import React, { useReducer, useContext, useEffect } from "react"

function reducer(state, action) {
  switch (action.type) {
    case 'Reset':
      return action.payload
    case 'Add':
      return [
        ...state,
        {
          id: Date.now(),
          text: 'New Todo',
          completed: false
        }
      ]
    case 'Completed':
      return state.map(item => {
        if (item.id === action.payload) {
          return {
            ...item,
            completed: !item.completed,
          }
        }
        return item
      })
    case 'Delete':
      return state.filter(item => action.payload !== item.id)
    case 'ChangeText':
      return state.map(item => {
        if (item.id === action.payload) {
          return {
            ...item,
            text: action.ChangedValue,
          }
        }
        return item
      })
    default:
      return state
  }
}

const Context = React.createContext();

const App = () => {
  const [state, dispatch] = useReducer(reducer, [])

  useEffect(() => {
    const raw = localStorage.getItem('data')
    dispatch({ type: 'Reset', payload: JSON.parse(raw) })
  }, [])

  useEffect(() => {
    localStorage.setItem('data', JSON.stringify(state))
  }, [state])


  return (
    <Context.Provider value = {dispatch}>
      <div className="flex h-screen justify-center items-center flex-col">
        <h1 className="text-3xl">Todo React tailwind App</h1>
        <TodoList items={ state }/>
        <button onClick={ () => dispatch({type: 'Add'}) }>Add item</button>
      </div>
    </Context.Provider>
  )
}

const TodoList = ({ items }) => {
  return items.map(item => <TodoItem key={item.id} item = { item }/>)
}

const TodoItem = ({item}) => {
  const dispatch = useContext(Context)

  return(
    <div>
      <input
        type="checkbox"
        checked={item.completed}
        onChange={() => dispatch({ type: 'Completed', payload: item.id })}
      />
      <input type="text" defaultValue={item.text} onChange={event => dispatch({ 
          type: 'ChangeText', 
          payload: item.id, 
          ChangedValue: event.target.value 
        })}/>
      <button onClick={() => dispatch({ type: 'Delete', payload: item.id })}>
        Delete
      </button>
    </div>
  )
}

export default App