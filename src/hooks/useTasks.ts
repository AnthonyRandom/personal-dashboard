import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService, type Task, type TaskFormData, type TaskUpdateData } from '@/services/taskService';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export function useTasks(filter: 'all' | 'pending' | 'completed' | 'today' | 'overdue' = 'all') {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['tasks', user?.id, filter],
    queryFn: () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      if (filter === 'all') {
        return taskService.getTasks(user.id);
      } else {
        return taskService.getTasksByFilter(user.id, filter);
      }
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false,
  });
}

export function useTaskStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['task-stats', user?.id],
    queryFn: () => {
      if (!user?.id) throw new Error('User not authenticated');
      return taskService.getTaskStats(user.id);
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 1, // 1 minute
    refetchOnWindowFocus: false,
  });
}

export function useCreateTask() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskData: TaskFormData) => {
      if (!user?.id) throw new Error('User not authenticated');
      return taskService.createTask(user.id, taskData);
    },
    onSuccess: (newTask) => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['task-stats', user?.id] });
      
      toast.success('Task created successfully');
    },
    onError: (error) => {
      console.error('Failed to create task:', error);
      toast.error('Failed to create task. Please try again.');
    },
  });
}

export function useUpdateTask() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, updates }: { taskId: string; updates: TaskUpdateData }) => {
      if (!user?.id) throw new Error('User not authenticated');
      return taskService.updateTask(taskId, user.id, updates);
    },
    onSuccess: (updatedTask) => {
      // Update task in cache
      queryClient.setQueryData(
        ['tasks', user?.id, 'all'],
        (oldData: Task[] | undefined) => {
          if (!oldData) return [updatedTask];
          return oldData.map(task => 
            task.id === updatedTask.id ? updatedTask : task
          );
        }
      );

      // Also update filtered views
      ['pending', 'completed'].forEach(filter => {
        queryClient.setQueryData(
          ['tasks', user?.id, filter],
          (oldData: Task[] | undefined) => {
            if (!oldData) return [];
            
            const shouldInclude = filter === 'pending' ? !updatedTask.completed : updatedTask.completed;
            const filteredData = oldData.filter(task => task.id !== updatedTask.id);
            
            if (shouldInclude) {
              return [updatedTask, ...filteredData];
            }
            return filteredData;
          }
        );
      });

      queryClient.invalidateQueries({ queryKey: ['task-stats', user?.id] });
      toast.success('Task updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update task:', error);
      toast.error('Failed to update task. Please try again.');
    },
  });
}

export function useToggleTask() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      return taskService.toggleTask(taskId, user.id);
    },
    onMutate: async (taskId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks', user?.id] });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks', user?.id, 'all']);

      // Optimistically update to the new value
      if (previousTasks) {
        queryClient.setQueryData(
          ['tasks', user?.id, 'all'],
          previousTasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )
        );
      }

      return { previousTasks };
    },
    onError: (error, taskId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks', user?.id, 'all'], context.previousTasks);
      }
      console.error('Failed to toggle task:', error);
      toast.error('Failed to update task. Please try again.');
    },
    onSuccess: (updatedTask) => {
      // Invalidate filtered queries and stats
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id, 'pending'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id, 'completed'] });
      queryClient.invalidateQueries({ queryKey: ['task-stats', user?.id] });
    },
  });
}

export function useDeleteTask() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      return taskService.deleteTask(taskId, user.id);
    },
    onSuccess: (_, taskId) => {
      // Remove task from all query caches
      ['all', 'pending', 'completed'].forEach(filter => {
        queryClient.setQueryData(
          ['tasks', user?.id, filter],
          (oldData: Task[] | undefined) => {
            if (!oldData) return [];
            return oldData.filter(task => task.id !== taskId);
          }
        );
      });

      queryClient.invalidateQueries({ queryKey: ['task-stats', user?.id] });
      toast.success('Task deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete task:', error);
      toast.error('Failed to delete task. Please try again.');
    },
  });
}
