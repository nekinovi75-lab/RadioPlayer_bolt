/*
  # Drop all tables
  
  This migration removes all tables from the database.
  
  1. Tables Dropped
    - favorites table
*/

DROP TABLE IF EXISTS favorites CASCADE;