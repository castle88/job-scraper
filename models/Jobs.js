// const mongoose = require("mongoose");
const { Model, Sequelize, DataTypes } = require("sequelize");

// const JobSchema = mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   companyName: {
//     type: String,
//     required: true,
//   },
//   companyLocation: {
//     type: String,
//     required: true,
//   },
//   link: {
//     type: String,
//     required: true,
//   },
//   createdAt: {
//     type: String,
//     required: true,
//   },
// });

// const Job = mongoose.model("Jobs", JobSchema);

// module.exports = Job;
/* 
CREATE TABLE users (
    title varchar,
    companyName varchar,
    companyLocation varchar,
    link varchar,
    createdAt varchar,
);
*/
class Job extends Model {}

const JobMap = (sequelize) => {
  Job.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    companyName: {
      type: DataTypes.STRING,
    },
    companyLocation: {
      type: DataTypes.STRING,
    },
    link: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.STRING,
    },
  });
};
module.exports = { Job, JobMap };
