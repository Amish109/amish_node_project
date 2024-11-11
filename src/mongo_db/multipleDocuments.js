// const { MongoClient } = require('mongodb');
const { mongodbConnector } = require('../base/mongo_db_connector');
const { students_array_of_obj } = require('./Pipeline/100_sample_students_no_id');
// const { getmongodbConnection } = require('../base/mongo_connector');
// const fs = require('fs');
function main (req,res){
    async function main1() {
        const db =await mongodbConnector();
        // let upload_data =[];
        // for(let i=0;i<100 ; i++){
        //     upload_data.push(
        //         {
        //             //   "_id": "609e1234567890abcdef9012",
        //               "personalInfo": {
        //                 "firstName": `Aarav${index}`,
        //                 "lastName": `Patel${index}`,
        //                 "email": `aarav.patel${index}@example.com`,
        //                 "phone": {
        //                   "mobile": "+91-9876543210",
        //                   "home": "+91-11-23456789"
        //                 },
        //                 "address": {
        //                   "street": "123 MG Road",
        //                   "city": "Mumbai",
        //                   "state": "Maharashtra",
        //                   "pinCode": "400001",
        //                   "country": "India"
        //                 },
        //                 "dateOfBirth": "2002-08-10"
        //               },
        //               "academicDetails": {
        //                 "enrollment": {
        //                   "studentId": "S2023001",
        //                   "program": "Bachelor of Technology in Computer Engineering",
        //                   "institution": "Indian Institute of Technology, Mumbai",
        //                   "startDate": "2020-07-01",
        //                   "expectedGraduationDate": "2024-06-15",
        //                   "status": "Active"
        //                 },
        //                 "GPA": 8.7,
        //                 "courses": [
        //                   {
        //                     "courseId": "CSE101",
        //                     "courseName": "Introduction to Programming",
        //                     "credits": 4,
        //                     "grade": "A",
        //                     "semester": "2020-1"
        //                   },
        //                   {
        //                     "courseId": "CSE202",
        //                     "courseName": "Data Structures and Algorithms",
        //                     "credits": 4,
        //                     "grade": "A-",
        //                     "semester": "2021-1"
        //                   },
        //                   {
        //                     "courseId": "CSE303",
        //                     "courseName": "Database Management Systems",
        //                     "credits": 4,
        //                     "grade": "B+",
        //                     "semester": "2021-2"
        //                   },
        //                   {
        //                     "courseId": "CSE404",
        //                     "courseName": "Software Engineering",
        //                     "credits": 4,
        //                     "grade": "A",
        //                     "semester": "2022-1"
        //                   }
        //                 ]
        //               },
        //               "extracurricularActivities": [
        //                 {
        //                   "activityName": "Coding Club",
        //                   "position": "Secretary",
        //                   "yearsActive": [
        //                     {
        //                       year: 2021,
        //                       semester: "1"
        //                     },
        //                     {
        //                       year: 2022,
        //                       semester: "2"
        //                     }
        //                   ],
        //                   "achievements": [
        //                     "Organized inter-college hackathons",
        //                     "Led workshops on competitive programming"
        //                   ]
        //                 },
        //                 {
        //                   "activityName": "Volunteer for NGO",
        //                   "role": "Tutor",
        //                   "yearsActive": [
        //                     {
        //                       year: 2020,
        //                       semester: "2"
        //                     },
        //                     {
        //                       year: 2021,
        //                       semester: "1"
        //                     }
        //                   ],
        //                   "achievements": [
        //                     "Tutored underprivileged children in mathematics and science",
        //                     "Helped in organizing educational camps"
        //                   ]
        //                 }
        //               ],
        //               "awards": [
        //                 {
        //                   "awardName": "Best Project Award",
        //                   "year": 2022,
        //                   "details": "For the project on AI-based traffic management system"
        //                 },
        //                 {
        //                   "awardName": "Merit Scholarship",
        //                   "year": 2021,
        //                   "details": "Awarded for maintaining a GPA above 8.5"
        //                 }
        //               ],
        //               "emergencyContact": {
        //                 "contactPerson": {
        //                   "name": "Neeta Patel",
        //                   "relationship": "Mother",
        //                   "phone": "+91-9876501234"
        //                 },
        //                 "alternateContact": {
        //                   "name": "Rajesh Patel",
        //                   "relationship": "Father",
        //                   "phone": "+91-9876512345"
        //                 }
        //               },
        //               "financialAid": {
        //                 "scholarships": [
        //                   {
        //                     "name": "Government Merit Scholarship",
        //                     "amount": 25000,
        //                     "year": 2020
        //                   },
        //                   {
        //                     "name": "Institutional Scholarship",
        //                     "amount": 15000,
        //                     "year": 2021
        //                   }
        //                 ],
        //                 "loans": [
        //                   {
        //                     "loanId": "L2023001",
        //                     "amount": 50000,
        //                     "provider": "National Bank of India",
        //                     "status": "Active"
        //                   }
        //                 ]
        //               }
        //             }
        //     )
        // }
       try {

        const response = await db.collection('collection2').find({}).toArray();
        console.log("Response data for mutiple doc",response);
        if(response.length==0){
          const rec = await  db.collection('collection2').insertMany(students_array_of_obj);
         res.send("created");
        } else{
          res.send("already exists");
        }
       } catch (error) {
        console.log("Error",error)
        res.send("error")
        
       }
        
        // return 'done.';
      }
      main1();
     }
module.exports={
    main
}

