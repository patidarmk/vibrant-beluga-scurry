import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Todo } from '@/types';
import TodoForm from '@/components/TodoForm';
import TodoItem from '@/components/TodoItem';
import WeatherWidget from '@/components/WeatherWidget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const initialTodos: Todo[] = [
  { id: '1', text: 'Build a stunning UI', completed: true },
  { id: '2', text: 'Integrate local storage', completed: true },
  { id: '3', text: 'Add edit and delete functionality', completed: false },
  { id: '4', text: 'Deploy the final app', completed: false },
];

const Index = () => {
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos', initialTodos);
  const [filter, setFilter] = useState('all');

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
    };
    setTodos([...todos, newTodo]);
  };

  const toggleComplete = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const editTodo = (id: string, newText: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter(todo => !todo.completed).length;

  return (
    <div className="container mx-auto max-w-2xl py-12">
      <WeatherWidget />
      <Card className="bg-white/30 backdrop-blur-lg border-gray-200/50 shadow-2xl shadow-blue-500/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gray-800">
            My Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TodoForm addTodo={addTodo} />
          <Tabs value={filter} onValueChange={setFilter} className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active ({activeCount})</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <div className="mt-4 space-y-2">
              {filteredTodos.length > 0 ? (
                filteredTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    toggleComplete={toggleComplete}
                    deleteTodo={deleteTodo}
                    editTodo={editTodo}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">No tasks here. Enjoy your day!</p>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;