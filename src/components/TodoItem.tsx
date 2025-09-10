import { useState } from 'react';
import { Todo } from '@/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Edit, Trash2, Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TodoItemProps {
  todo: Todo;
  toggleComplete: (id: string) => void;
  deleteTodo: (id: string) => void;
  editTodo: (id: string, newText: string) => void;
}

export default function TodoItem({ todo, toggleComplete, deleteTodo, editTodo }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleEdit = () => {
    if (isEditing && editText.trim()) {
      editTodo(todo.id, editText);
    }
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText(todo.text);
  };

  return (
    <div className="flex items-center p-3 bg-white/50 rounded-lg transition-all hover:bg-white/80">
      <Checkbox
        id={`todo-${todo.id}`}
        checked={todo.completed}
        onCheckedChange={() => toggleComplete(todo.id)}
        className="mr-4"
      />
      <div className="flex-1">
        {isEditing ? (
          <Input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="h-8"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
          />
        ) : (
          <label
            htmlFor={`todo-${todo.id}`}
            className={cn(
              'text-sm font-medium transition-colors',
              todo.completed ? 'text-gray-500 line-through' : 'text-gray-800'
            )}
          >
            {todo.text}
          </label>
        )}
      </div>
      <div className="flex items-center space-x-1 ml-2">
        {isEditing ? (
          <>
            <Button variant="ghost" size="icon" onClick={handleEdit} className="h-8 w-8">
              <Save className="h-4 w-4 text-green-500" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleCancelEdit} className="h-8 w-8">
              <X className="h-4 w-4 text-gray-500" />
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} className="h-8 w-8">
              <Edit className="h-4 w-4 text-blue-500" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => deleteTodo(todo.id)} className="h-8 w-8">
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}