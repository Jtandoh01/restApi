import express from 'express';
import { deleteStudent, getAllStudents, updateStudent } from '../controllers/students';
import { isAuthenticated, isOwner } from '../middlewares';

export default (router: express.Router)=>{
	router.get('/students' ,isAuthenticated, getAllStudents);

	router.delete('/students/:id', isAuthenticated, isOwner, deleteStudent);

	router.patch('/students/:id', isAuthenticated, isOwner, updateStudent)

};