import express from 'express';
import { get, merge } from 'lodash';

import { getStudentBySessionToken } from '../db/students';


export const isOwner = async(req:express.Request, res:express.Response, next: express.NextFunction)=>{
	try {
		const { id } = req.params;
		
		const currentStudentId = get(req, 'identity._id') as string;

		if(!currentStudentId){
			return res.sendStatus(403);
		}

		if(currentStudentId.toString() !== id){
			return res.sendStatus(403);
		}

	  next();
		
	} catch (error) {
		console.log(error);
		return res.sendStatus(400);
		
	}
}

//authentication middleware
export const isAuthenticated = 
async(req:express.Request, res: express.Response, next: express.NextFunction) =>
{

	try {
		//retrieve cookies from req
		const sessionToken = req.cookies['AUTH_REALTI']; 

		// No cookies implies no session
		if(!sessionToken){
			return res.sendStatus(403);
		}

		//check if there is an existing student by the session token delivered
		const existingStudent = await getStudentBySessionToken(sessionToken);
		//return status code 403=forbidden if student exists
		if(!existingStudent){
			return res.sendStatus(403);
		}
		
		merge(req, { identity: existingStudent });

		return next();
		
	} catch (error) {

		console.log(error)
		return res.sendStatus(400);
	}
}