import { supabase, type Database } from './supabase';
import { z } from 'zod';

export type Task = Database['public']['Tables']['tasks']['Row'];
export type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
export type TaskUpdate = Database['public']['Tables']['tasks']['Update'];

// Enhanced validation schemas
export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  category: z.string().min(1, 'Category is required').max(50, 'Category must be less than 50 characters'),
  due_date: z.string().optional().or(z.undefined()),
  start_date: z.string().optional().or(z.undefined()),
  time_estimate: z.number().min(0).optional().or(z.undefined()), // in minutes
  tags: z.array(z.string()).optional().or(z.undefined()),
  project_id: z.string().optional().or(z.undefined()),
  parent_task_id: z.string().optional().or(z.undefined()),
  recurring_pattern: z.string().optional().or(z.undefined()), // "daily", "weekly", "monthly", "yearly"
  recurring_interval: z.number().min(1).optional().or(z.undefined()),
  recurring_end_date: z.string().optional().or(z.undefined()),
});

export const taskUpdateSchema = taskSchema.partial().extend({
  completed: z.boolean().optional(),
});

export type TaskFormData = z.infer<typeof taskSchema>;
export type TaskUpdateData = z.infer<typeof taskUpdateSchema>;

// Natural language parsing utilities
export interface ParsedTask {
  title: string;
  description?: string;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  time_estimate?: number;
}

export function parseNaturalLanguage(input: string): ParsedTask {
  const parsed: ParsedTask = { title: input };
  let cleanTitle = input;
  
  // Priority detection
  const priorityKeywords = {
    high: ['urgent', 'asap', 'critical', 'important', 'high'],
    medium: ['medium', 'normal'],
    low: ['low', 'sometime', 'when possible']
  };
  
  for (const [priority, keywords] of Object.entries(priorityKeywords)) {
    if (keywords.some(keyword => input.toLowerCase().includes(keyword))) {
      parsed.priority = priority as 'low' | 'medium' | 'high';
      // Remove priority keywords from title
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        cleanTitle = cleanTitle.replace(regex, '');
      });
      break;
    }
  }
  
  // Date parsing
  const datePatterns = [
    { pattern: /(?:today|tonight)/i, offset: 0 },
    { pattern: /(?:tomorrow)/i, offset: 1 },
    { pattern: /(?:next week)/i, offset: 7 },
    { pattern: /(?:in (\d+) days?)/i, offset: (match: RegExpMatchArray) => parseInt(match[1] || '0') },
    { pattern: /(?:at (\d{1,2})(?::(\d{2}))?(am|pm)?)/i, time: true }
  ];
  
  for (const { pattern, offset, time } of datePatterns) {
    const match = input.match(pattern);
    if (match) {
      const today = new Date();
      if (typeof offset === 'function') {
        today.setDate(today.getDate() + offset(match));
      } else if (typeof offset === 'number') {
        today.setDate(today.getDate() + offset);
      }
      parsed.due_date = today.toISOString().split('T')[0];
      // Remove date patterns from title
      cleanTitle = cleanTitle.replace(pattern, '');
      break;
    }
  }
  
  // Tag detection
  const tagMatch = input.match(/#(\w+)/g);
  if (tagMatch) {
    parsed.tags = tagMatch.map(tag => tag.slice(1)).filter(Boolean);
    // Remove tags from title
    tagMatch.forEach(tag => {
      cleanTitle = cleanTitle.replace(tag, '');
    });
  }
  
  // Time estimate detection
  const timeMatch = input.match(/(\d+)\s*(?:min|minutes?|h|hours?)/i);
  if (timeMatch && timeMatch[1]) {
    const value = parseInt(timeMatch[1]);
    const unit = timeMatch[0].toLowerCase();
    parsed.time_estimate = unit.includes('h') ? value * 60 : value;
    // Remove time estimate from title
    cleanTitle = cleanTitle.replace(timeMatch[0], '');
  }
  
  // Clean up the title: remove extra spaces and trim
  cleanTitle = cleanTitle.replace(/\s+/g, ' ').trim();
  
  // Update the title with the cleaned version
  parsed.title = cleanTitle.length > 0 ? cleanTitle : 'Untitled Task';
  
  return parsed;
}

class TaskService {
  async getTasks(userId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getTasksByFilter(userId: string, filter: 'all' | 'pending' | 'completed' | 'today' | 'overdue'): Promise<Task[]> {
    let query = supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId);

    if (filter === 'pending') {
      query = query.eq('completed', false);
    } else if (filter === 'completed') {
      query = query.eq('completed', true);
    } else if (filter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      query = query.eq('completed', false).eq('due_date', today);
    } else if (filter === 'overdue') {
      const today = new Date().toISOString().split('T')[0];
      query = query.eq('completed', false).lt('due_date', today);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getTasksByProject(userId: string, projectId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getTasksByTag(userId: string, tag: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .contains('tags', [tag])
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createTask(userId: string, taskData: TaskFormData): Promise<Task> {
    const validatedData = taskSchema.parse(taskData);
    
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        ...validatedData,
        user_id: userId,
        completed: false,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async createTaskFromNaturalLanguage(userId: string, input: string): Promise<Task> {
    const parsed = parseNaturalLanguage(input);
    
    return this.createTask(userId, {
      title: parsed.title,
      description: parsed.description,
      priority: parsed.priority || 'medium',
      category: 'Personal',
      due_date: parsed.due_date,
      tags: parsed.tags,
      time_estimate: parsed.time_estimate,
    });
  }

  async updateTask(taskId: string, userId: string, updates: TaskUpdateData): Promise<Task> {
    const validatedData = taskUpdateSchema.parse(updates);
    
    const { data, error } = await supabase
      .from('tasks')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', taskId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async toggleTask(taskId: string, userId: string): Promise<Task> {
    // First get the current task to toggle its completed status
    const { data: currentTask, error: fetchError } = await supabase
      .from('tasks')
      .select('completed')
      .eq('id', taskId)
      .eq('user_id', userId)
      .single();

    if (fetchError) throw fetchError;

    const { data, error } = await supabase
      .from('tasks')
      .update({
        completed: !currentTask.completed,
        updated_at: new Date().toISOString(),
      })
      .eq('id', taskId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteTask(taskId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  async getTaskStats(userId: string): Promise<{
    total: number;
    completed: number;
    pending: number;
    overdue: number;
    today: number;
    thisWeek: number;
    totalTimeEstimated: number;
    totalTimeCompleted: number;
  }> {
    const { data, error } = await supabase
      .from('tasks')
      .select('completed, due_date, time_estimate')
      .eq('user_id', userId);

    if (error) throw error;

    const now = new Date().toISOString().split('T')[0] || '';
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekStartStr = weekStart.toISOString().split('T')[0] || '';
    
    const stats = {
      total: data.length,
      completed: data.filter(task => task.completed).length,
      pending: data.filter(task => !task.completed).length,
      overdue: data.filter(task => 
        !task.completed && 
        task.due_date && 
        task.due_date < now
      ).length,
      today: data.filter(task => 
        !task.completed && 
        task.due_date === now
      ).length,
      thisWeek: data.filter(task => 
        !task.completed && 
        task.due_date && 
        task.due_date >= weekStartStr && 
        task.due_date <= now
      ).length,
      totalTimeEstimated: data.reduce((sum, task) => sum + (task.time_estimate || 0), 0),
      totalTimeCompleted: data.filter(task => task.completed).reduce((sum, task) => sum + (task.time_estimate || 0), 0),
    };

    return stats;
  }

  async getTags(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('tags')
      .eq('user_id', userId)
      .not('tags', 'is', null);

    if (error) throw error;
    
    const allTags = data
      .flatMap(task => task.tags || [])
      .filter((tag, index, arr) => arr.indexOf(tag) === index);
    
    return allTags;
  }

  async getProjects(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('project_id')
      .eq('user_id', userId)
      .not('project_id', 'is', null);

    if (error) throw error;
    
    const projects = data
      .map(task => task.project_id)
      .filter((project, index, arr) => arr.indexOf(project) === index);
    
    return projects;
  }
}

export const taskService = new TaskService();
