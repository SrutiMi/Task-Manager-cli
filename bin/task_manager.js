#!/usr/bin/env node
const program = require('commander');
const pkg = require('../package.json')
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'tasks.json');

program
    .version(pkg.version)
    
program
   .command('add')
   .description('Add the tasks')
   .option('-n, --name <name>', 'Task name')
   .action((options)=>{
    //Load existing tasks from file
       let tasks=[];
       if(fs.existsSync(DATA_FILE)){
        tasks = JSON.parse(fs.readFileSync(DATA_FILE));
       }

       //Add new task
       const newTask = {name: options.name};
       tasks.push(newTask);

       //Save tasks to file
       fs.writeFileSync(DATA_FILE, JSON.stringify(tasks));

       console.log('Task added');
   });

program
   .command('list')
   .description('List the tasks')
   .action(()=>{
    if (!fs.existsSync(DATA_FILE)) {
        console.log('No tasks found');
        return;
      }
  
      const tasks = JSON.parse(fs.readFileSync(DATA_FILE));
      if (tasks.length === 0) {
        console.log('No tasks found');
        return;
      }
  
      console.log('Tasks:');
      tasks.forEach((task, index) => {
        console.log(`${index + 1}. ${task.name}`);
      });
   });


program
   .command('status')
   .description('Shows the status ofthe tasks')
   .option('-n, --name <name>', 'Task name')
   .action((options)=>{
    if (!fs.existsSync(DATA_FILE)) {
        console.log('No tasks found');
        return;
      }
  
      const tasks = JSON.parse(fs.readFileSync(DATA_FILE));
      const task = tasks.find((task) => task.name === options.name);
      if (!task) {
        console.log(`Task "${options.name}" not found`);
        return;
      }
  
      console.log(`Status of task "${options.name}": ${task.status || 'Not started'}`);
   });

   
program
   .command('remove')
   .description('Removes the task')
   .option('-n, --name <name>', 'Task name')
   .action((options) => {
    if (!fs.existsSync(DATA_FILE)) {
      console.log('No tasks found');
      return;
    }

    let tasks = JSON.parse(fs.readFileSync(DATA_FILE));
    const taskIndex = tasks.findIndex((task) => task.name === options.name);
    if (taskIndex === -1) {
      console.log(`Task "${options.name}" not found`);
      return;
    }

    const removedTask = tasks.splice(taskIndex, 1)[0];
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks));
    console.log(`Removed task "${removedTask.name}"`);
  });

program
  .command('delete-all')
  .description('Delete all tasks')
  .action(() => {
    try {
      fs.unlinkSync(DATA_FILE);
      console.log('All tasks deleted successfully');
    } catch (error) {
      console.error('Failed to delete tasks', error);
    }
  });

program.parse(process.argv);