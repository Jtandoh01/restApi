import mongoose from "mongoose";

//Defining schema
const StudentSchema = new mongoose.Schema({
	
	name:{
		type: String,
		required: true
	},
	age:{
		type: Number,
		required: true,

	},
	email:{
		type: String,
		required: true,
		unique: true
	},
	authentication:{
		password:{
			type:String,
			required: true,
			select:false
		},
		salt:{
			type: String,
			select:false
		},
		sessionToken:{
			type:String,
			select:false
		},
	},

});

export const StudentModel = mongoose.model('Student', StudentSchema);

export const getStudents = () => StudentModel.find();

export const getStudentById = (id: string) => StudentModel.findById(id);

//optional in assignment
export const getStudentByEmail = (email: string)=> StudentModel.findOne({ email });

export const getStudentBySessionToken = (sessionToken: string) => StudentModel.findOne({	'authentication.sessionToken': sessionToken,});

export const createStudent = (values: Record<string, any>)=> new StudentModel(values).
save().then((student)=> student.toObject()); //create a new student by supplying details

export const updateStudentById = (id: string , values:Record<string, any>) => StudentModel.findByIdAndUpdate(id, values)

//delete student
export const deleteStudentById = (id:string) => StudentModel.findOneAndDelete({ _id:id });






