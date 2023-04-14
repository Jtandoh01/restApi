import express from 'express';
import { getStudents, getStudentById ,deleteStudentById  } from '../db/students';


export const getAllStudents = async(
	req: express.Request,
	res: express.Response
)=>{
	try {
		const students = await getStudents();

		return res.status(200).json(students);

	} catch (error) {
		console.log(error);
		return res.sendStatus(400);
	}
};

//Delete student in database controller
export const deleteStudent = async(req:express.Request, res:express.Response)=>{
	try {
		const { id } = req.params;
		const deleteStudent = await deleteStudentById(id);
		return res.json(deleteStudent);

	} catch (error) {
		console.log(error);
		return res.sendStatus(400);	
	}
}

//update student record
export const updateStudent = async(req:express.Request, res:express.Response)=>{
	try {

		const { id } = req.params;
		const { email} = req.body;
		if(!email){
			return res.sendStatus(403);
		} 

		const student = await getStudentById(id);

		student.email = email;
		await student.save();

		return res.status(200).json(student).end();

		
	} catch (error) {
		console.log(error);
		return res.sendStatus(400);
	}
}


