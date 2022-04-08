const mongoose = require('mongoose')

const connectDB = async () => {
	try{
		const conn = await mongoose.connect(process.env.MONGODB_URI, {
			useUnifiedTopology: true,
			useNewUrlParser: true 
		})

		console.log(`MongoDB connected\n${conn.connection.host}`)
	}catch(err){
		console.error(err)
		process.exit(1)
	}
}

module.exports = connectDB