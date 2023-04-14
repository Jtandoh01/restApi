import express from 'express';
import { createStudent, getStudentByEmail } from '../db/students';
import { authentication, random } from '../helpers';

//login controller
export const login = async(req:express.Request, res:express.Response) => {
	try {
		// Retrieve email and password from the request body
		const {email, password} = req.body;

		//checks if both email and password are provided
		if(!email || !password){
			//return 400 code if both are not provided
			return res.sendStatus(400);
		}

		// Retrieve the student with the given email from the database,
		// including their authentication salt and password hash
		const student = await getStudentByEmail(email).select('+authentication.salt +authentication.password');
		
		// If no student is found with the given email, return a 400 status code
		if(!student){
			return res.sendStatus(400);
		}

		// Hash the provided password using the student's salt and compare it to the
		// stored password hash to authenticate the student
		const expectedHash = authentication(student.authentication.salt, password);
		
		// If the passwords don't match, return a 403 (Forbidden) status code
		if (student.authentication.password !== expectedHash){
			return res.sendStatus(403);
		}

		const salt = random();
		student.authentication.sessionToken = authentication(salt, student._id.toString());

		await student.save();

		res.cookie('AUTH_REALTI', student.authentication.sessionToken, {domain: 'localhost', path: '/'});
		
		return res.status(200).json(student).end()
	} catch (error) {
		console.log(error);
		return res.sendStatus(400);
		
	}
}




//register controller
export const register = async (req: express.Request, res: express.Response) => {
	try {
		const{  email, name, age, password} = req.body;

		if(!name || !email || !age || !password){
			return res.sendStatus(400);
		}

		const existingStudent = await getStudentByEmail(email);


		if(existingStudent){
			return res.sendStatus(400);
		}

		const salt = random();
		const student = await createStudent({
			name,
			email,
			age,
			authentication:{
				salt,
				password: authentication(salt, password),
			},		
		});
		return res.status(200).json(student).end();

	} catch (error) {
		console.log(error);
		return res.sendStatus(400);		
	}
};

