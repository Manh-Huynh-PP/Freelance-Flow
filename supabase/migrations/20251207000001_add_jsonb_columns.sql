-- Migration: Add JSONB columns for flexible data storage
-- Run this in Supabase SQL Editor or via CLI

-- Add task_data JSONB column to tasks table
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS task_data JSONB;

-- Add project_data JSONB column to projects table  
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS project_data JSONB;

-- Add client_data JSONB column to clients table
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS client_data JSONB;

-- Add quote_data JSONB column to quotes table
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS quote_data JSONB;
