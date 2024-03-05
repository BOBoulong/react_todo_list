import {useCallback, useEffect, useState} from 'react';

const App = () => {
  const LOCAL_STORAGE_KEY = 'todos';
  const [todos, setTodos] = useState(
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) ?? [],
  );

  const [currentTodo, setCurrentTodo] = useState('');

  const [edit, setEdit] = useState(null);
  const [editText, setEditText] = useState('');

  const addTodo = () => {
    if (currentTodo !== '') {
      const todo = { id: Date.now(), text: currentTodo, completed: false };
      setTodos([...todos, todo]);
      setCurrentTodo('');
    }
  };

  const [filter, setFilter] = useState('all');

  const todoTasks = todos.filter((todo) => {
    if (filter === 'todo') {
      return !todo.completed;
    }

    if (filter === 'complete') {
      return todo.completed;
    }

    return todo;
  });

  const handleFilterChange = (value) => {
    setFilter(value);
  };

  const handleToggleComplete = (item) => {
    const { id } = item;
    setTodos((prevTodos) =>
      prevTodos.map((todo) => {
        // console.log('todo===>', { ...todo, completed: true }, id);
        return todo.id === id ? { ...todo, completed: !todo.completed } : todo;
      }),
    );
  };

  const handleEditTodo = ({ e, id }) => {
    e.preventDefault();
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, text: editText };
      }
      return todo;
    });
    setTodos(updatedTodos);
    setEdit(null);
  };

  const handleDeleteTodo = (id) => {
    const filteredTodos = todos.filter((todo) => todo.id !== id);
    setTodos(filteredTodos);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'all') {
      return true;
    } else if (filter === 'todo') {
      return !todo.completed;
    } else if (filter === 'complete') {
      return todo.completed;
    }
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const onButtonClick = useCallback(() => handleFilterChange('complete'), [])

  // const handleEditTodo = (index, newText) => {
  //   const updatedTodos = [...todos];
  //   updatedTodos[index].text = newText;
  //   setTodos(updatedTodos);
  // };

  // const handleDeleteTodo = (index) => {
  //   const updatedTodos = [...todos];
  //   updatedTodos.splice(index, 1);
  //   setTodos(updatedTodos);
  // };

  // const handleToggleAll = () => {
  //   const updatedTodos = todos.map((todo) => {
  //     return {
  //       ...todo,
  //       completed: !todo.completed,
  //     };
  //   });
  //   setTodos(updatedTodos);
  // };
  // console.log("edit====>", edit);

  return (
    <div className={`h-screen w-screen bg-white pt-9`}>
      <div className="m-auto w-11/12 rounded-md bg-gray-100 p-6 font-sans shadow-xl lg:max-w-4xl">
        <h3 className="pt-2 text-center text-5xl font-semibold uppercase text-gray-700">
          TODO LIST
        </h3>
        <form className="flex scroll-pl-10 space-x-1 pt-3">
          <input
            type="text"
            placeholder="Enter Todo List"
            className="mt-1 w-10/12 rounded-md border-2 border-gray-400 bg-white px-3 py-2 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
            value={currentTodo}
            required
            onChange={(e) => setCurrentTodo(e.target.value)}
          />
          <button
            className="mt-1 transform rounded-md border-2 border-gray-400 bg-purple-700 px-10 py-2 tracking-wide text-white transition-colors duration-200 hover:bg-purple-500 focus:bg-purple-500 focus:outline-none"
            onClick={addTodo}
          >
            ADD
          </button>
        </form>
        <div className="flex  space-x-8 pt-3">
          <button
            className={`mr-2 w-1/4 justify-center space-x-4 p-2 text-white ${
              filter === 'all'
                ? 'rounded-md border-2 bg-blue-700 focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 dark:border-gray-400'
                : 'rounded-md border-2 bg-blue-700 focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 dark:border-gray-400'
            } rounded px-3 py-1`}
            onClick={() => handleFilterChange('all')}
          >
            All
          </button>
          <button
            className={`mr-2 w-1/4 justify-center space-x-4 p-2 text-white ${
              filter === 'todo'
                ? 'rounded-md border-2 bg-red-500 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:border-gray-400'
                : 'rounded-md border-2 bg-red-500 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:border-gray-400'
            } rounded px-3 py-1`}
            onClick={() => handleFilterChange('todo')}
          >
            Todo
          </button>
          <button
            className={`mr-2 w-1/4 justify-center space-x-4 p-2 text-white ${
              filter === 'complete'
                ? 'rounded-md border-2 bg-green-500 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:border-gray-400'
                : ' rounded-md border-2 bg-green-500 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:border-gray-400'
            } rounded px-3 py-1`}
            onClick={onButtonClick}
          >
            Done
          </button>
        </div>
        <h2 className="mt-2 flex rounded-md border-2 border-gray-700 bg-white p-3 font-sans text-3xl font-semibold text-gray-700 shadow-xl lg:max-w-4xl">
          {todoTasks.length} Tasks
        </h2>
        <ul className="space-y-2">
          {filteredTodos.map((todo) => (
            <li
              key={todo.id}
              className={`flex items-center justify-between ${
                todo.completed ? `checked: true` : ''
              }`}
            >
              <div className="mt-2 flex w-full justify-between rounded-md bg-white p-3 font-sans shadow-xl lg:max-w-4xl">
                <div className="flex justify-start space-x-4 ">
                  <input
                    type="checkbox"
                    className="mt-1"
                    defaultChecked={todo.completed}
                    onClick={() => handleToggleComplete(todo)}
                  />
                  <label className="mt-1 px-1 py-3 text-lg">{todo.text}</label>
                </div>
                <div className="flex space-x-4">
                  <button
                    aria-label="Edit"
                    type="button"
                    className="mt-1 flex transform rounded-md bg-blue-700 px-3 py-3 tracking-wide text-white transition-colors duration-200 hover:bg-blue-500"
                    // onClick={() => handleEditTodo(todo.id)}
                    onClick={() => setEdit(todo)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                    Edit
                  </button>
                  <button
                    aria-label="Delete"
                    type="button"
                    className="mt-1 flex  transform space-x-0 rounded-md bg-red-700 px-3 py-3 tracking-wide text-white transition-colors duration-200 hover:bg-red-500"
                    onClick={() => handleDeleteTodo(todo.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
              {edit && edit.id === todo.id && (
                <div className="fixed inset-0 z-20">
                  <div
                    className="absolute inset-0 z-50 bg-slate-500/50 text-center"
                    // onClick={() => setEdit(null)}
                  ></div>
                  <div className="absolute left-[26%] top-7 z-[100] mx-auto w-2/4 rounded-lg bg-white px-6 py-3">
                    <div className="flex items-center justify-between">
                      <h2 className="mt-1 px-1 py-3 text-lg">
                        Edit Todo ID({todo.id})
                      </h2>
                      <button
                        className="scale-125 hover:text-red-500"
                        onClick={() => setEdit(null)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-6 w-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    <form onSubmit={(e) => handleEditTodo({ e, id: todo.id })}>
                      <input
                        type="text"
                        onChange={(e) => setEditText(e.target.value)}
                        defaultValue={todo.text}
                        className="mt-1 w-full rounded-md border-2 border-gray-400 bg-white px-3 py-2 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
                      />
                      <div className="pl mt-2 flex justify-end space-x-4">
                        <button
                          type="submit"
                          className="mt-1 flex  transform space-x-0 rounded-md bg-black px-3 py-3 tracking-wide text-white transition-colors duration-200 hover:bg-black"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEdit(null)}
                          className="mt-1 flex  transform space-x-0 rounded-md bg-red-700 px-3 py-3 tracking-wide text-white transition-colors duration-200 hover:bg-red-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
        {/* <div className="flex  pt-3 space-x-9 ">
          <button
            type="button"
            className="flex justify-center w-1/4 p-2 space-x-4 text-white border-2 rounded-md focus:ring-2 focus:ring-offset-2 bg-blue-500 dark:border-gray-400 focus:ring-blue-500"
          >
            ALL
          </button>
          <button
            type="button"
            className="flex justify-center w-1/4 p-2 space-x-4 text-white border-2 rounded-md focus:ring-2 focus:ring-offset-2 bg-red-500 dark:border-gray-400 focus:ring-red-500"
          >
            TODO
          </button>
          <button
            type="button"
            className="flex justify-center w-1/4 p-2 space-x-4 text-white border-2 rounded-md focus:ring-2 focus:ring-offset-2 bg-green-500 dark:border-gray-400 focus:ring-green-500"
          >
            DONE
          </button>
        </div>
        <h2 className="flex mt-2 text-3xl text-gray-700 font-sans font-semibold p-1">
          {todos.length} Tasks Remaining . . .
        </h2>
        <div className="flex mt-2 justify-between p-3 bg-white rounded-md shadow-xl lg:max-w-4xl font-sans">
          <div className="flex space-x-4 justify-start ">
            <input type="checkbox" className="" />
            <label className="px-1 py-3 text-lg" htmlFor="1">
              Learn JS
            </label>
          </div>
          <div className="flex space-x-4">
            <button
              aria-label="Edit"
              type="button"
              className="flex space-x-0 tracking-wide px-3 py-3 text-white transition-colors duration-200 transform bg-blue-700 rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
              Edit
            </button>
            <button
              aria-label="Delete"
              type="button"
              className="flex space-x-0 tracking-wide px-3 py-3 text-white transition-colors duration-200 transform bg-red-700 rounded-md hover:bg-red-500 focus:outline-none focus:bg-red-500"
              onClick={removeTodoHandler}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
              <p>Delete</p>
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default App;
